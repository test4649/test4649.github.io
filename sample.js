(function(){
  window.setInterval(function(){
    var totalViewable = $sf.ext.inViewPercentage();
    var elem = document.getElementById("inview");
    elem.innerHTML = "Viewable: " + totalViewable + "%";
  }, 50);
})();
