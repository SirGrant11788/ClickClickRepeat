// Keep track of whether the extension is currently recording or not
let isRecording = false;

// Keep track of the current session being recorded
let currentSession = {
  id: Date.now(),
  events: []
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case "startRecording":
      startRecording();
      break;
    case "stopRecording":
      stopRecording();
      break;
    case "replaySession":
      replaySession(message.sessionId);
      break;
  }
});

// Start recording keyboard input and mouse clicks
function startRecording() {
  isRecording = true;

  // Listen for keydown events and store them in the current session
  document.addEventListener("keydown", function(event) {
    if (isRecording) {
      currentSession.events.push({
        type: "keydown",
        code: event.code,
        timeStamp: event.timeStamp
      });
    }
  });

  // Listen for mousedown events and store them in the current session
  document.addEventListener("mousedown", function(event) {
    if (isRecording) {
      currentSession.events.push({
        type: "mousedown",
        x: event.clientX,
        y: event.clientY,
        timeStamp: event.timeStamp
      });
    }
  });
}

// Stop recording keyboard input and mouse clicks and store the current session
function stopRecording() {
  isRecording = false;

  // Save the current session
  // Retrieve the list of sessions from storage
  chrome.storage.local.get(["sessions"], function(result) {
    let sessions = result.sessions || [];
    // Add the current session to the list
    sessions.push(currentSession);
    // Update the list of sessions in storage
    chrome.storage.local.set({ sessions: sessions });
  });
}

// Replay a session by replaying its stored events
function replaySession(sessionId) {
  // Retrieve the session from storage
  chrome.storage.local.get(["sessions"], function(result) {
    let sessions = result.sessions || [];
    let session = sessions.find(function(session) {
      return session.id == sessionId;
    });

    if (session) {
      // Replay the events in the session
      session.events.forEach(function(event) {
        switch (event.type) {
          case "keydown":
            // Create a new keydown event and dispatch it
            let keydownEvent = new KeyboardEvent("keydown", {
              code: event.code,
              bubbles: true,
              cancelable: true
            });
            document.dispatchEvent(keydownEvent);
            break;
          case "mousedown":
            // Create a new mousedown event and dispatch it
            let mousedownEvent = new MouseEvent("mousedown", {
              clientX: event.x,
              clientY: event.y,
              bubbles: true,
              cancelable: true
            });
            document.dispatchEvent(mousedownEvent);
            break;
        }
      });
    }
  });
}
