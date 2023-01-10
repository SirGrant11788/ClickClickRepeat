// Add event listeners to the buttons
document.getElementById("start-button").addEventListener("click", startRecording);
document.getElementById("stop-button").addEventListener("click", stopRecording);

// Send a message to the background script to start recording
function startRecording() {
  document.getElementById("start-button").disabled = true;
  document.getElementById("stop-button").disabled = false;
  chrome.runtime.sendMessage({ type: "startRecording" });
}

// Send a message to the background script to stop recording
function stopRecording() {
  document.getElementById("start-button").disabled = false;
  document.getElementById("stop-button").disabled = true;
  chrome.runtime.sendMessage({ type: "stopRecording" });
  refreshSessions();
}

// Refresh the list of recorded sessions
function refreshSessions() {
  chrome.storage.local.get(["sessions"], function(result) {
    let sessions = result.sessions || [];
    let sessionsDiv = document.getElementById("sessions");
    sessionsDiv.innerHTML = "";
    sessions.forEach(function(session) {
      let sessionDiv = document.createElement("div");
      sessionDiv.innerHTML =
        session.id +
        ": " +
        new Date(session.events[0].timeStamp).toLocaleString() +
        " - " +
        new Date(
          session.events[session.events.length - 1].timeStamp
        ).toLocaleString();
      let replayButton = document.createElement("button");
      replayButton.innerHTML = "Replay";
      replayButton.classList.add("replay-button");
      replayButton.addEventListener("click", function() {
        replaySession(session.id);
      });
      let deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", function() {
        deleteSession(session.id);
      });
      sessionDiv.appendChild(replayButton);
      sessionDiv.appendChild(deleteButton);
      sessionsDiv.appendChild(sessionDiv);
    });
  });
}

// Replay a recorded session
function replaySession(sessionId) {
  chrome.runtime.sendMessage({ type: "replaySession", sessionId: sessionId });
}

// Delete a recorded session
function deleteSession(sessionId) {
  chrome.storage.local.get(["sessions"], function(result) {
    let sessions = result.sessions || [];
    let updatedSessions = sessions.filter(function(session) {
      return session.id != sessionId;
    });
    chrome.storage.local.set({ sessions: updatedSessions }, function() {
      refreshSessions();
    });
  });
}

// // Initialize the list of recorded sessions
// refreshSessions();
