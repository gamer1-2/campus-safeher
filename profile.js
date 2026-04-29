<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campus SafeHer - Empowering Safety</title>
  <meta name="description" content="Campus SafeHer - A premium safety and tracking application for campus security.">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <div class="auth-container">
    <div class="auth-header">
      <h1>Campus SafeHer</h1>
      <p id="auth-subtitle">Welcome back! Please login to your account.</p>
    </div>

    <div id="message-container" class="message"></div>

    <!-- Login Form -->
    <form id="login-form" class="animate-enter">
      <div class="form-group">
        <label for="login-email">Email Address</label>
        <input type="email" id="login-email" class="form-control" placeholder="you@campus.edu" required>
      </div>
      <div class="form-group">
        <label for="login-password">Password</label>
        <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn-primary" id="login-btn">Sign In</button>
      <div class="auth-toggle">
        Don't have an account? <a href="#" id="show-register">Create one</a>
      </div>
    </form>

    <!-- Register Form -->
    <form id="register-form">
      <div class="form-group">
        <label for="reg-name">Full Name</label>
        <input type="text" id="reg-name" class="form-control" placeholder="Jane Doe" required>
      </div>
      <div class="form-group">
        <label for="reg-email">Email Address</label>
        <input type="email" id="reg-email" class="form-control" placeholder="you@campus.edu" required>
      </div>
      <div class="form-group">
        <label for="reg-password">Password</label>
        <input type="password" id="reg-password" class="form-control" placeholder="Create a strong password" required minlength="6">
      </div>
      <button type="submit" class="btn-primary" id="register-btn">Create Account</button>
      <div class="auth-toggle">
        Already have an account? <a href="#" id="show-login">Sign In</a>
      </div>
      <div class="auth-toggle" style="margin-top: 10px;">
        <a href="admin-login.html" class="text-sm" style="color: var(--secondary); opacity: 0.8;">Admin Portal</a>
      </div>
    </form>

  </div>

  <script src="js/config.js"></script>
  <script src="js/auth.js"></script>
</body>
</html>
