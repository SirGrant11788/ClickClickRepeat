let isRecording = false;

chrome.browserAction.onClicked.addListener(function(tab) {
    if (isRecording) {
      // stop recording
      isRecording = false;
      chrome.browserAction.setIcon({path: "icon_off.png"});
      chrome.tabs.sendMessage(tab.id, { action: 'stopRecording' });
    } else {
      // start recording
      isRecording = true;
      chrome.browserAction.setIcon({path: "icon_on.png"});
      chrome.tabs.sendMessage(tab.id, { action: 'startRecording' });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "mousemove") {
    if (isRecording) {
      // record the mouse movement
    }
  } else if (request.type == "keypress") {
    if (isRecording) {
      // record the key press
    }
  }
});

let sessions = [];

function recordSession(session) {
    sessions.push(session);
    chrome.storage.sync.set({'sessions': sessions}, function() {
        console.log('Session recorded successfully!');
    });
}

function replaySession(session) {
    // code to replay the session's mouse movements and key presses
}

function deleteSession(index) {
    sessions.splice(index, 1);
    chrome.storage.sync.set({'sessions': sessions}, function() {
        console.log('Session deleted successfully!');
    });
}

chrome.storage.sync.get('sessions', function(data) {
    if (data.sessions) {
        sessions = data.sessions;
    }
});
