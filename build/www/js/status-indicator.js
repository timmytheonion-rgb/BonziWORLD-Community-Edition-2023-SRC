(function () {
  "use strict";

  var statusText = {
    typing: " • is typing...",
    speaking: " • is speaking...",
    commanding: " • is commanding..."
  };
  var lastStatus = "";
  var typingTimer;

  function sendStatus(status) {
    if (!window.bonzisocket || status === lastStatus) return;
    lastStatus = status;
    window.bonzisocket.sendToServer("status", { status: status });
  }

  function showStatus(data) {
    var bonzi = window.bonzis && window.bonzis[data.guid];
    if (!bonzi) return;

    if (data.status === "idle") {
      bonzi.updateName();
      return;
    }

    var suffix = statusText[data.status];
    if (!suffix) return;

    // Show status appended to name in the nametag; leave the speech bubble alone.
    var rawName = (bonzi.userPublic && bonzi.userPublic.name) ? bonzi.userPublic.name : "BonziBUDDY";
    bonzi.$nametag.text(rawName + suffix);
  }

  function bind() {
    if (!window.bonzisocket) {
      window.setTimeout(bind, 50);
      return;
    }

    var input = $("#chat_message");
    input.on("input.statusIndicator", function () {
      window.clearTimeout(typingTimer);
      if (!input.val().length) {
        sendStatus("idle");
        return;
      }

      sendStatus("typing");
      typingTimer = window.setTimeout(function () {
        sendStatus("speaking");
      }, 800);
    });

    window.bonzisocket.on("status", showStatus);

    // Wrap sendToServer so command actions (context menu, buttons) also
    // trigger the right status.
    var sendToServer = window.bonzisocket.sendToServer;
    window.bonzisocket.sendToServer = function (eventName, data) {
      if (eventName === "talk" || eventName === "command") {
        window.clearTimeout(typingTimer);
      }
      var result = sendToServer.apply(window.bonzisocket, arguments);
      if (eventName === "talk") {
        window.setTimeout(function () { sendStatus("idle"); }, 0);
      }
      if (eventName === "command") {
        window.setTimeout(function () { sendStatus("commanding"); }, 0);
      }
      return result;
    };
  }

  $(bind);
}());
