document.addEventListener('keydown', function (e) {
  if (e.altKey && e.key === 's') {
    let selectedText = window.getSelection().toString();
    if (selectedText) {
      chrome.runtime.sendMessage({ action: 'saveText', text: selectedText, url: window.location.href }, function(response) {
        if (response.success) {
          showNotification("Note saved successfully!");
        }
      });
    }
  }
});

function showNotification(message) {
  let notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  notification.style.color = 'white';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  notification.textContent = message;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
