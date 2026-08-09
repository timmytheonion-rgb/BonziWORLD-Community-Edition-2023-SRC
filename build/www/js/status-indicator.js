(function () {
  "use strict";

  var statusText = {
    typing: "is typing...",
    speaking: "is speaking...",
    commanding: "is commanding..."
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
    var text = statusText[data.status];
    if (!bonzi) return;

    if (data.status === "idle") {
      bonzi.clearDialog();
      return;
    }
    if (!text) return;

    bonzi.cancel();
    bonzi.$dialogCont
      .text((bonzi.userPublic.name || "BonziBUDDY") + " " + text)
      .removeClass("bubble_greentext")
      .css("display", "block");
    bonzi.$dialog.show();
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

    // Wrap the existing send function so context-menu commands and button
    // sends use the same status indicator as typed commands.
    var sendToServer = window.bonzisocket.sendToServer;
    window.bonzisocket.sendToServer = function (eventName, data) {
      if (eventName === "talk" || eventName === "command") {
        window.clearTimeout(typingTimer);
      }
      var result = sendToServer.apply(window.bonzisocket, arguments);
      if (eventName === "talk") {
        window.setTimeout(function () { sendStatus("speaking"); }, 0);
      }
      if (eventName === "command") {
        window.setTimeout(function () { sendStatus("commanding"); }, 0);
      }
      return result;
    };
  }

  $(bind);
}());