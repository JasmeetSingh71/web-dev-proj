const toggleBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.add(`${savedTheme}-theme`);
toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    const newTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
});


window.addEventListener("DOMContentLoaded", () => {
  fetch('/session-user')
    .then(response => response.json())
    .then(data => {
      if (data.username) {
        // Logged in: hide login/register, show logout
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
        // document.getElementById('logout-link').style.display = 'inline-block';
      }
    })
    .catch(err => console.error('Error checking session:', err));
});



   const params= new URLSearchParams(window.location.search);

  if (params.get("error") === "login") {
    alert("Please register or log in to book a service.");
  }

  if (params.get("success") === "true") {
    alert("Booking saved successfully!");
  }


  const params3 = new URLSearchParams(window.location.search);

if (params3.get("error") === "notfound") {
  alert("User not found. Please register first.");
}

if (params3.get("error") === "invalid") {
  alert("Incorrect password.");
}