document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) {
    fetch('navbar.html')
      .then(response => response.text())
      .then(html => {
        placeholder.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading navbar:', error);
      });
  }
});
