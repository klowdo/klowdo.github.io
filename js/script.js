(function () {
  var  open = false;
  var sidenav = document.getElementById("sidenav")
  document.getElementById('hamburger').addEventListener("click", function(){
    if (open) {
      sidenav.style.height = "50px";

    }else {
      sidenav.style.height = "180px";
    }
    open = !open;
  });
  window.onresize = function(event) {
    if (window.innerWidth > 450) {
      sidenav.style.height = "";
      open = false;
    }
};
  /* Set the width of the side navigation to 250px */

})();
