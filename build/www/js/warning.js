function hidewarning12warning() {
  var x = document.getElementById("page_warning");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
// is this even used? possibly like 2022 or something?
// it's one of the remains of the censored version of bwr that was made for my siblings
function showunder12warning() { // wtf?
  $('#page_contentwarning').show('slow');
  msg = new SpeechSynthesisUtterance();
  synth = window.speechSynthesis;
  voices = window.speechSynthesis.getVoices();
  msg.text = "CONTENT WARNING! User made content in this website may not be suitable for users under the age of 12, or people who have parents who can't handle swearing. Continue Anyway?"
  synth.speak(this.msg);
}
function hideumute() {
  var x = document.getElementById("page_mute");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
function hideadmin() {
  var x = document.getElementById("page_achieve");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// --- added: prevent document contextmenu when right-clicking settings button ---
;(function(){
  function showSettingsMenuAt(px, py){
    var menu = document.getElementById('settings_menu');
    if (!menu) return;
    menu.style.left = px + 'px';
    menu.style.top = py + 'px';
    menu.style.display = 'block';
  }

  // jQuery handler if available
  if (window.jQuery) {
    $(document).on('contextmenu', '#settings_btn, .settings-button, .fa-cog', function(e){
      e.preventDefault();
      e.stopPropagation();
      showSettingsMenuAt(e.pageX, e.pageY);
    });
  } else {
    // plain JS fallback
    document.addEventListener('DOMContentLoaded', function(){
      var sel = document.querySelector('#settings_btn, .settings-button, .fa-cog');
      if (!sel) return;
      sel.addEventListener('contextmenu', function(e){
        e.preventDefault();
        e.stopPropagation();
        showSettingsMenuAt(e.pageX, e.pageY);
      });
    });
  }
})();
