(function(){
  function onContext(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    try{
      if (target && target.matches && (target.matches('#settings_btn') || target.matches('#themes_btn') || target.matches('.settings-button') || target.matches('.fa-cog'))){
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        var menu = document.getElementById('settings_menu');
        if(menu){
          var left = (typeof e.pageX !== 'undefined') ? e.pageX : (e.clientX + (window.scrollX||window.pageXOffset||0));
          var top  = (typeof e.pageY !== 'undefined') ? e.pageY : (e.clientY + (window.scrollY||window.pageYOffset||0));
          menu.style.left = left + 'px';
          menu.style.top  = top + 'px';
          menu.style.display = 'block';
        }
        return false;
      }
    }catch(err){
      // safe fallback
    }
  }
  if(document.addEventListener) document.addEventListener('contextmenu', onContext, true);
  else if(document.attachEvent) document.attachEvent('oncontextmenu', onContext);
})();
