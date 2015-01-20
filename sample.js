(function(){
  window.setInterval(function(){
    var totalViewable = $sf.ext.inViewPercentage();
    var elem = document.getElementById("inview");
    document.write("Viewable: " + totalViewable + "%");
  }, 50);
})();
