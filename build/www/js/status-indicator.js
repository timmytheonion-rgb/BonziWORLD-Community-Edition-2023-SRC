(function () {
  "use strict";

  var statusText = {
    typing: "is typing...",
    speaking: "is speaking...",
    commanding: "is commanding..."
  };
  var lastStatus = "";
  var typingTimer;

  // Get (or lazily create) the dedicated status span inside .bonzi_name.
  // It lives alongside .name-inner, so updateName() never touches it.
  function getStatusSpan(bonzi) {
    var $nameWrap = bonzi.$nametag.closest(".bonzi_name");
    var $span = $nameWrap.find(".bonzi-status-text");
    if (!$span.length) {
      $span = $("<span>").addClass("bonzi-status-text").css({
        display: "block"
      });
      $nameWrap.append($span);
    }
    return $span;
  }

  function sendStatus(status) {
    if (!window.bonzisocket || status === lastStatus) return;
    lastStatus = status;
    window.bonzisocket.sendToServer("status", { status: status });
  }

  function showStatus(data) {
    var bonzi = window.bonzis && window.bonzis[data.guid];
    if (!bonzi) return;

    var $span = getStatusSpan(bonzi);

    if (data.status === "idle") {
      $span.text("");
      return;
    }

    var text = statusText[data.status];
    if (!text) return;

    $span.text(text);
  }

  function bind() {
    if (!window.bonzisocket) {
      window.setTimeout(bind, 50);
      return;
    }

    var input = $("#chat_message");
    input.on("input.statusIndicator", function () {
      window.clearTimeout(typingTimer);
      var val = input.val();
      if (!val.length) {
        sendStatus("idle");
        return;
      }

      if (val.charAt(0) === "/") {
        sendStatus("commanding");
      } else {
        sendStatus("typing");
        typingTimer = window.setTimeout(function () {
          sendStatus("speaking");
        }, 800);
      }
    });

    window.bonzisocket.on("status", showStatus);

    // Wrap sendToServer so button/context-menu/drag commands also trigger
    // the right status.
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
        // Skip movement-only commands — users don't expect a status for those.
        var moveCommands = ["move", "movestart", "movefinish", "surf", "surfleave"];
        var cmdName = data && Array.isArray(data.list) ? data.list[0] : null;
        if (moveCommands.indexOf(cmdName) !== -1) return result;

        // Always show "commanding" and clear after 300 ms.
        // Reset lastStatus so the broadcast always fires.
        lastStatus = "";
        window.setTimeout(function () {
          sendStatus("commanding");
          window.setTimeout(function () {
            sendStatus("idle");
          }, 300);
        }, 0);
      }
      return result;
    };
  }

  $(bind);
}());
