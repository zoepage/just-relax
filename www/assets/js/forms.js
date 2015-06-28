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

$(function() {
  $('input[name="daterange"]').daterangepicker({
    format: 'MM/DD/YYYY',
    minDate: '06/01/2015',
    maxDate: '06/30/2015',
    dateLimit: { days: 6 }
  });
});