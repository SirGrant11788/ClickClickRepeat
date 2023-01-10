document.addEventListener("mousemove", function(event) {
  chrome.runtime.sendMessage({
    type: "mousemove",
    x: event.clientX,
    y: event.clientY
  });
});

document.addEventListener("keypress", function(event) {
  chrome.runtime.sendMessage({
    type: "keypress",
    key: event.key
  });
});
