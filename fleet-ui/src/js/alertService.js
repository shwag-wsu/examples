import { Toast } from 'bootstrap';


let alertCount = 0;

export function setupAlertSSE() {
  const eventSource = new EventSource('/api/alerts/stream');
  const alertList = document.getElementById("alertsListPopover");
  const alertBadge = document.getElementById("alertBadge");

  eventSource.addEventListener("alert", (e) => {
    const alert = JSON.parse(e.data);
    console.log("Received alert:", alert);

    if (alertList) {
      const li = document.createElement("div");
      li.className = "border-bottom py-1 small";
      li.innerHTML = `<strong>[${alert.type}]</strong> ${alert.message}`;
      alertList.prepend(li);
    }

    alertCount++;
    alertBadge.textContent = alertCount;
    alertBadge.classList.remove("d-none");
  });

  eventSource.onerror = (err) => {
    console.warn("SSE connection error:", err);
  };
}
/*

export function setupAlertSSE() {
  const eventSource = new EventSource('/api/alerts/stream');
  const toastLiveExample = document.getElementById('liveToast');
  

  eventSource.addEventListener("alert", (e) => {
    const alert = JSON.parse(e.data);
   // console.log("Received alert:", alert);

    // Render in alert list if exists
    const list = document.getElementById("alertsList");
    
    if (list) {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `[${alert.type}] ${alert.message}`;
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
} */