(function(){
  // Inject CSS for crosscolor shadows (applies to multiple possible class names)
  try{
    var css = '\n/* Crosscolor shadows */\n.crosscolor:not(.pope),\n.cross-color:not(.pope),\n.cross_color:not(.pope),\n.cross:not(.pope),\n.usercolor:not(.pope),\n.user-color:not(.pope),\n.color-dot:not(.pope),\n.bonzi-color:not(.pope),\n.bonzi-color *:not(.pope) {\n  box-shadow: 0 4px 12px rgba(0,0,0,0.35), 0 0 8px rgba(0,0,0,0.12) inset;\n  transition: box-shadow 160ms ease, filter 160ms ease;\n}\n/* optional subtle colored glow when currentColor is meaningful */\n.crosscolor:not(.pope),\n.cross-color:not(.pope),\n.cross_color:not(.pope),\n.cross:not(.pope),\n.usercolor:not(.pope),\n.user-color:not(.pope),\n.color-dot:not(.pope),\n.bonzi-color:not(.pope) {\n  filter: drop-shadow(0 0 6px rgba(0,0,0,0.18));\n}\n';
    var s = document.createElement('style');
    s.type = 'text/css';
    s.appendChild(document.createTextNode(css));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(s);
  }catch(e){}
})();

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
