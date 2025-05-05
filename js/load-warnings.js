document.addEventListener("DOMContentLoaded", function () {
  fetch('partials/warnings.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load warnings.html');
      }
      return response.text();
    })
    .then(html => {
      const placeholder = document.getElementById('warnings-placeholder');
      if (placeholder) {
        placeholder.innerHTML = html;
      }
    })
    .catch(error => {
      console.error('Error loading warning content:', error);
    });
});
