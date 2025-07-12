<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Speedo-mile</title>
  <link class="web-icon" rel="shortcut icon" type="web icon" href="https://img.icons8.com/ios-filled/50/000000/bus.png">
  <!--Leaflet CSS -->
   <link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

 <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav>
    <div class="logo">
      <img src="https://img.icons8.com/ios-filled/50/000000/bus.png" alt="Bus Logo" />
      Speedo-mile
    </div>
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="Route.html">Routes</a></li>
      <li><a href="Schedule.html">Schedule</a></li>
      <li><a href="Contact.html">Contact</a></li>
    </ul>
  </nav>
<div class="search-container">
  <input type="text" id="routeSearch" placeholder="🔍 Search for a route...">
</div>

  <main id="routes-container">
   <div id="routeDetails" class="route-card"></div>
    <div id="loading" class="loading-container">
  <div class="bus-loader">🚌 Loading routes...</div>
</div>
  </main>
  <section class="feedback-section">
  <h2 class="form-heading">📝 Send Feedback</h2>
  <div class="feedback-form-container">
    <form id="feedbackForm">
      <input type="text" id="name" placeholder="Your Name" required />
      <input type="email" id="email" placeholder="Your Email" required />
      <textarea id="message" placeholder="Enter your feedback..." required></textarea>
      <button type="submit">Submit Feedback</button>
      <p id="feedbackStatus" class="feedback-message"></p>
    </form>
  </div>
</section>

  <div class="btn-container">
    <button onclick="togglePopup('aiPopup')">AI</button>
  </div>
  <div class="popup-bar" id="aiPopup">
  <div class="popup-bar-header">
    <span>AI Assistant</span>
    <button class="close-btn" onclick="togglePopup('aiPopup')">&times;</button>
  </div>
  <div class="popup-bar-content">
 <p>Need help planning your trip?</p>
<input id="aiInput" placeholder="Ask something..." />

<div class="button-row">
   <button id="aiBtn" onclick="getAISuggestion()">🧠 Get Suggestion</button>
  <button onclick="showLiveUpdates()">🛰️ Live Route Update</button>
</div>
<button onclick="clearResponses()" id="clear-btn">🧹 Clear Results</button>
<div id="aiResponses" class="ai-responses"></div>
  </div>
  <footer>
    &copy; 2025 Speedo-mile | All Rights Reserved
  </footer>
  <!-- Leaflet JS -->
  <script
  src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
></script>
  <script src="script.js"></script>
</body>
</html>
