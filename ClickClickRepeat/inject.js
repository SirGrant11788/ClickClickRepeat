// Send a message to the background script to start recording
chrome.runtime.sendMessage({ type: "startRecording" });

// Listen for messages from the background script to stop recording
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type == "stopRecording") {
    // Stop recording
    document.removeEventListener("keydown", keydownListener);
    document.removeEventListener("mousedown", mousedownListener);
  }
  if (message.type == "startRecording") {
    // Start recording
    document.addEventListener("keydown", keydownListener);
    document.addEventListener("mousedown", mousedownListener);
  }
});

// Listen for keydown events and send them to the background script
function keydownListener(event) {
  chrome.runtime.sendMessage({
    type: "keydown",
    code: event.code,
    timeStamp: event.timeStamp
  });
}


// Listen for mousedown events and send them to the background script
function mousedownListener(event) {
  chrome.runtime.sendMessage({
    type: "mousedown",
    x: event.clientX,
    y: event.clientY,
    timeStamp: event.timeStamp
  });
}

