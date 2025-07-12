let mapInstance = null;

// Load the default base map
function loadBasicMap() {
  const mapDiv = document.getElementById('map');
  if (!mapDiv) return;

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    mapDiv.innerHTML = '';
  }

  mapInstance = L.map('map').setView([31.5204, 74.3587], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance);
}

// Draw route on the map by route name
async function drawRouteOnMap(routeName) {
  try {
    const res = await fetch('http://localhost:3000/live-routes');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const routes = await res.json();
// Inside drawRouteOnMap()
console.log('User searched:', routeName);
routes.forEach(r => {
  console.log(`${r.RouteCode} - ${r.RouteName}`);
});

const match = routes.find(r => {
  return routeName.toLowerCase().includes(r.RouteCode.toLowerCase());
});

if (!match || !Array.isArray(match.Path) || match.Path.length === 0) {
  console.error("❌ No route match or empty path");
  return loadBasicMap();
}

    const path = match.Path;
    const stops = match.Stops || [];

    // Validate path coordinates
    if (!Array.isArray(path[0]) || typeof path[0][0] !== 'number' || typeof path[0][1] !== 'number') {
      console.error("❌ Invalid path coordinates");
      return loadBasicMap();
    }

    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      mapDiv.innerHTML = '';
    }

    mapInstance = L.map('map').setView(path[0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    const polyline = L.polyline(path, { color: 'blue' }).addTo(mapInstance);
    mapInstance.fitBounds(polyline.getBounds());

    stops.forEach(stop => {
      if (Array.isArray(stop.coords) && typeof stop.coords[0] === 'number') {
        L.marker(stop.coords).addTo(mapInstance).bindPopup(`🛑 ${stop.name}`);
      }
    });

  } catch (err) {
    console.error("🚨 Failed to draw route:", err);
    loadBasicMap();
  }
}

//Search and click draw
function searchAndDrawRoute(queryInput = null) {
  const inputEl = document.getElementById('routeSearch');
  const query = (queryInput || inputEl.value).trim().toLowerCase();
  const cards = document.querySelectorAll('.route-card');

  let found = false;
  cards.forEach(card => {
    const titleEl = card.querySelector('h3');
const title = titleEl?.textContent?.toLowerCase() || '';
const match = title.includes(query);

    card.style.display = match ? 'block' : 'none';
    if (match) found = true;
  });

  if (found && query) {
    drawRouteOnMap(query);
  } else {
    loadBasicMap();
  }
}

// Load all route cards
async function loadRoutes() {
  const loadingEl = document.getElementById('loading');
  const container = document.getElementById('routes-container');
  if (!loadingEl || !container) return;

  loadingEl.style.display = 'flex';
  try {
    const res = await fetch('http://localhost:3000/live-routes');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const routes = await res.json();
    container.innerHTML = '';
    loadingEl.style.display = 'none';

routes.forEach(route => {
  const card = document.createElement('div');
  card.className = 'route-card';
  card.innerHTML = `
    <h3>${route.RouteCode || 'N/A'} - ${route.RouteName || 'Unnamed Route'}</h3>
    <p>Status: ${route.Status || 'Unknown'}</p>
    <p>Next Arrival: ${route.NextArrival || 'N/A'}</p>
  `;
  container.appendChild(card);
});

  } catch (err) {
    loadingEl.textContent = "❌ Failed to load routes";
    console.error("loadRoutes() error:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadRoutes();

  const searchInput = document.getElementById('routeSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => searchAndDrawRoute());
  }

  if (document.getElementById('map')) {
    loadBasicMap();
  }
});

//Add data in search bar automatically
document.addEventListener('click', (e) => {
  const card = e.target.closest('.route-card');
  if (card) {
    const routeName = card.querySelector('h3')?.textContent;
    const searchBox = document.getElementById('routeSearch');
    if (routeName && searchBox) {
      searchBox.value = routeName;
      searchAndDrawRoute(routeName);
    }
  }
});

// AI Assistant 
function togglePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;

  popup.classList.toggle('open');
}
//clear button
function clearResponses() {
  const aiResponses = document.getElementById('aiResponses');
  if (aiResponses) {
    aiResponses.innerHTML = '';
  }
}

async function getAISuggestion() {
  const input = document.getElementById('aiInput').value.trim();
  const responseBox = document.getElementById('aiResponses');

  if (!input) {
    responseBox.innerHTML = `<p class="error-msg">Please enter a question.</p>`;
    return;
  }

  // Show a loading message
  const loading = document.createElement('div');
  loading.className = 'live-update-card';
  loading.innerHTML = `<h4>Loading...</h4><p>Getting AI suggestion...</p>`;
  responseBox.appendChild(loading);

  try {
    const res = await fetch('http://localhost:3000/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();

    if (data && data.reply) {
      loading.remove();
      const aiCard = document.createElement('div');
      aiCard.className = 'live-update-card';
      aiCard.innerHTML = `<h4>AI Suggestion</h4><p>${data.reply}</p>`;
      responseBox.appendChild(aiCard);
    } else {
      loading.innerHTML = `<h4>Error</h4><p>No response from AI.</p>`;
    }
  } catch (error) {
    loading.innerHTML = `<h4>Error</h4><p>${error.message}</p>`;
  }
}

async function showLiveUpdates() {
  const responseBox = document.getElementById('aiResponses');
  responseBox.innerHTML = ''; 

  // Show loading message
  const loading = document.createElement('div');
  loading.className = 'live-update-card';
  loading.innerHTML = `<h4>Loading...</h4><p>Fetching latest route updates...</p>`;
  responseBox.appendChild(loading);

  try {
    const res = await fetch('http://localhost:3000/live-routes');
    const data = await res.json();

    loading.remove();

    if (!data || data.length === 0) {
      responseBox.innerHTML = `<p class="error-msg">No live routes available right now.</p>`;
      return;
    }

    // Loop through each route and display updates
    data.forEach(route => {
      const updateCard = document.createElement('div');
      updateCard.className = 'live-update-card';
      updateCard.innerHTML = `
        <h4>${route.RouteName || 'Unnamed Route'} (${route.RouteCode || 'No Code'})</h4>
        <p>Status: ${route.Status || 'No info'}</p>
        <p>Stops: ${route.Stops?.length || 0}</p>
      `;
      responseBox.appendChild(updateCard);
    });
  } catch (err) {
    loading.innerHTML = `<h4>Error</h4><p>Could not load live updates. ${err.message}</p>`;
  }
}

// Display Bus schedule
async function loadSchedule() {
  const list = document.getElementById('scheduleList');
  if (!list) return;

  list.innerHTML = '<li>Loading schedule...</li>';

  try {
    const res = await fetch('http://localhost:3000/schedule');
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = '<li>No schedules available</li>';
      return;
    }

    list.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.RouteName}</strong>: ${item.NextArrival}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('❌ Failed to load schedule:', err);
    list.innerHTML = '<li>Error loading schedule</li>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSchedule();
});


//feedback form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const statusMsg = document.getElementById('feedbackStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      try {
        const res = await fetch('http://localhost:3000/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();

        if (res.ok) {
          statusMsg.textContent = data.message;
          statusMsg.style.color = 'lightgreen';
          form.reset();

          // Fade after 3 seconds
          setTimeout(() => {
            statusMsg.textContent = '';
          }, 3000);
        } else {
          throw new Error(data.detail || 'Server error');
        }

      } catch (err) {
        console.error('❌ Feedback error:', err);
        statusMsg.textContent = '❌ Failed to send feedback';
        statusMsg.style.color = 'red';
        setTimeout(() => {
          statusMsg.textContent = '';
        }, 3000);
      }
    });
  }
});

