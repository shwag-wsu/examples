import { Toast } from 'bootstrap';

export function setupAlertSSE() {
  const eventSource = new EventSource('/api/alerts/stream');
  const toastLiveExample = document.getElementById('liveToast');
  

  eventSource.addEventListener("alert", (e) => {
    const alert = JSON.parse(e.data);
    console.log("Received alert:", alert);

    // Render in alert list if exists
    const list = document.getElementById("alertsList");
    
    if (list) {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `[${alert.level}] ${alert.message}`;
      list.prepend(li);

    }
    if (toastLiveExample) {
      const toastAlert = document.getElementById("live_alert");
      toastAlert.innerText= alert.message;
      const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample);
      toastBootstrap.show();
    }
  });

 

  eventSource.onerror = (err) => {
    console.warn("SSE connection error:", err);
  };
}