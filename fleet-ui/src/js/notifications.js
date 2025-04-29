export function showAlert(message) {
    const notificationArea = document.getElementById('notificationArea');
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.role = 'alert';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    notificationArea.appendChild(alert);
  
    setTimeout(() => {
      alert.remove();
    }, 4000);
  }