async function loadRouteDetails() {
  const params = new URLSearchParams(window.location.search);
  const routeId = params.get('id');

  if (!routeId) {
    document.getElementById('routeDetails').innerHTML = "❌ Route ID not found!";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/route/${routeId}`);
    const route = await res.json();

    const container = document.getElementById('routeDetails');
    container.innerHTML = `
      <h3>🚌 ${route.RouteCode} - ${route.RouteName}</h3>
     <p><strong>Status:</strong> ${route.Status}</p>
     <p><strong>Next Arrival:</strong> ${route.NextArrival}</p>
 
    `;
  } catch (err) {
    document.getElementById('routeDetails').innerHTML = "❌ Error loading details.";
  }
}

window.onload = loadRouteDetails;
