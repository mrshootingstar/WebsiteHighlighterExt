document.addEventListener('DOMContentLoaded', function () {
  let notesContainer = document.getElementById('notesContainer');
  let clearNotesButton = document.getElementById('clearNotes');
  let exportNotesButton = document.getElementById('exportNotes');

  function displaySavedNotes(notes) {
    notesContainer.innerHTML = '';
    for (let url in notes) {
      let section = document.createElement('section');
      let h2 = document.createElement('h2');
      let a = document.createElement('a');
      a.textContent = url;
      a.href = url;
      a.target = '_blank';
      h2.appendChild(a);
      section.appendChild(h2);
      let ul = document.createElement('ul');
      notes[url].forEach((note, index) => {
        let li = document.createElement('li');
        li.textContent = note;
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', function () {
          deleteNote(url, index);
        });
        li.appendChild(deleteButton);
        ul.appendChild(li);
      });
      section.appendChild(ul);
      notesContainer.appendChild(section);
    }
  }

  function deleteNote(url, index) {
    chrome.storage.local.get({ savedNotes: {} }, function (result) {
      let savedNotes = result.savedNotes;
      if (savedNotes[url]) {
        savedNotes[url].splice(index, 1);
        if (savedNotes[url].length === 0) {
          delete savedNotes[url];
        }
        chrome.storage.local.set({ savedNotes: savedNotes }, function () {
          displaySavedNotes(savedNotes);
        });
      }
    });
  }

  // Retrieve and display saved notes
  chrome.storage.local.get({ savedNotes: {} }, function (result) {
    displaySavedNotes(result.savedNotes);
  });

  // Clear saved notes
  clearNotesButton.addEventListener('click', function () {
    chrome.storage.local.set({ savedNotes: {} }, function () {
      displaySavedNotes({});
    });
  });

  // Export saved notes
  exportNotesButton.addEventListener('click', function () {
    chrome.storage.local.get({ savedNotes: {} }, function (result) {
      let notesText = '';
      for (let url in result.savedNotes) {
        notesText += `URL: ${url}\n`;
        result.savedNotes[url].forEach(note => {
          notesText += `  - ${note}\n`;
        });
        notesText += '\n';
      }
      let blob = new Blob([notesText], { type: 'text/plain' });
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = 'saved_notes.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
  });
});
