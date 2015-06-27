$(function(){
  $("button.btn").bind('click', function(event){
      var e = event.target;
      var id = e.getAttribute("data-next");

      if (id >= 4) {
        href.location = 'dashboard.html';
      } else {
      $("#data-setup" + (id -1)).fadeOut().addClass("hide");
      $("#data-setup" + id).removeClass("hide").fadeIn();
      return false;
      }
    })
})

