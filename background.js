chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveText') {
    chrome.storage.local.get({ savedNotes: {} }, function (result) {
      let savedNotes = result.savedNotes;
      if (!savedNotes[message.url]) {
        savedNotes[message.url] = [];
      }
      savedNotes[message.url].push(message.text);
      chrome.storage.local.set({ savedNotes: savedNotes }, function () {
        console.log('Text saved:', message.text, 'from', message.url);
        sendResponse({ success: true });
      });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
