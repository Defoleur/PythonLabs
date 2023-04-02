document.addEventListener("DOMContentLoaded", function() {
const navbar = document.getElementById("navigation");
navbar.innerHTML = `
  <a class="navbar-brand" href="#">EventCD🗓️</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse w-100 order-3 dual-collapse2" id="navbarNavAltMarkup">
    <div class="navbar-nav navbar-nav-left d-none d-sm-block">
      <a class="nav-item nav-link">Add new event!</a>
    </div>
      <div class="navbar-nav navbar-nav-left d-none d-sm-block">
      <a class="nav-item nav-link" href="CreatedEventsPage.html">Search for events!</a>
    </div>
    <div class="navbar-nav navbar-nav-right ml-auto">
      <a class="nav-item nav-link"><img class="profile-pic" src="./Images/mikey.png" alt="My Profile Picture"></a>
    </div>
    <div class="navbar-nav d-none d-sm-block">
      <a class="nav-item nav-link" href="ProfilePage.html">${sessionStorage.getItem("username")}</a>
    </div>
  </div>
`})