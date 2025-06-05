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


 
    fetch('/mybookings')
      .then(response => {
        if (!response.ok) throw new Error("Not logged in or session expired");
        return response.json();
      })
      .then(bookings => {
        const tbody = document.querySelector('#bookingsTable tbody');
        if (bookings.length === 0) {
          const row = document.createElement('tr');
          row.innerHTML = `<td colspan="4">No bookings found</td>`;
          tbody.appendChild(row);
        } else {
          bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${booking.name}</td>
              <td>${booking.email}</td>
              <td>${booking.date}</td>
              <td>${booking.service}</td>
            `;
            tbody.appendChild(row);
          });
        }
      })
      .catch(error => {
        const tbody = document.querySelector('#bookingsTable tbody');
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">${error.message}</td>`;
        tbody.appendChild(row);
      });
  