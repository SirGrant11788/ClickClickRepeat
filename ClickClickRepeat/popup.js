document.querySelector("#start-stop-button").addEventListener("click", function() {
  if (this.innerHTML == "Start") {
    this.innerHTML = "Stop";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'startRecording' });
});
  } else {
    this.innerHTML = "Start";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'stopRecording' });
});
  }
});

let sessions = [];

function addSessionToList(session) {
  // create the list item element
  let li = document.createElement("li");
  li.innerHTML = session.name;

  // create the replay button
  let replayButton = document.createElement("button");
  replayButton.innerHTML = "Replay";
  replayButton.addEventListener("click", function() {
    replaySession(session);
  });
  li.appendChild(replayButton);

  // create the delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener("click", function() {
    let index = sessions.indexOf(session);
    deleteSession(index);
    this.parentNode.remove();
  });
  li.appendChild(deleteButton);

  // add the list item to the list
  sessionList.appendChild(li);

  // add the session to the array
  sessions.push(session);
}

function replaySession(session) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'replaySession' });
});
}

function deleteSession(index) {
  chrome.storage.sync.get('sessions', function(data) {
      if (data.sessions) {
        sessions = data.sessions;
        sessions.splice(index, 1);
        chrome.storage.sync.set({'sessions': sessions}, function() {
            console.log('Session deleted successfully!');
        });
      }
  });
}
