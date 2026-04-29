<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Campus SafeHer</title>
  <link rel="stylesheet" href="css/style.css">
  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="dashboard-body">

  <!-- Navigation Bar -->
  <nav class="navbar">
    <div class="nav-brand">
      <i class="fa-solid fa-shield-halved"></i> Campus SafeHer
    </div>
    <div class="nav-links">
      <a href="home.html" class="active"><i class="fa-solid fa-house"></i> Home</a>
      <a href="sos.html"><i class="fa-solid fa-bell"></i> SOS Alert</a>
      <a href="route.html"><i class="fa-solid fa-map-location-dot"></i> Safe Route</a>
      <a href="emergency.html"><i class="fa-solid fa-truck-medical"></i> Emergency</a>
      <a href="report.html"><i class="fa-solid fa-file-signature"></i> Report</a>
      <!-- Admin Link hidden by default -->
      <a href="admin.html" id="nav-admin" class="hidden-role"><i class="fa-solid fa-user-shield"></i> Admin Panel</a>
    </div>
    <div class="nav-user">
      <a href="profile.html"><i class="fa-solid fa-user"></i> Profile</a>
      <button id="logout-btn" class="btn-outline" style="margin-left: 1rem;"><i class="fa-solid fa-right-from-bracket"></i></button>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="dashboard-main">
    <div class="welcome-banner">
      <h1 id="welcome-message">Loading...</h1>
      <p>Your safety is our priority. Access tools and resources instantly.</p>
    </div>

    <div class="quick-actions-grid">
      <!-- Quick Button 1 -->
      <a href="sos.html" class="action-card danger-card">
        <div class="action-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="action-content">
          <h2>Send SOS</h2>
          <p>Instantly alert campus security and your emergency contacts.</p>
        </div>
      </a>

      <!-- Quick Button 2 -->
      <a href="report.html" class="action-card warning-card">
        <div class="action-icon">
          <i class="fa-solid fa-bullhorn"></i>
        </div>
        <div class="action-content">
          <h2>Report Issue</h2>
          <p>Anonymously report incidents or suspicious activities.</p>
        </div>
      </a>

      <!-- Quick Button 3 -->
      <a href="emergency.html" class="action-card info-card">
        <div class="action-icon">
          <i class="fa-solid fa-truck-medical"></i>
        </div>
        <div class="action-content">
          <h2>Request Emergency Services</h2>
          <p>Direct contact with medical and emergency response teams.</p>
        </div>
      </a>
    </div>
  </main>

  <script src="js/config.js"></script>
  <script src="js/home.js"></script>
</body>
</html>
