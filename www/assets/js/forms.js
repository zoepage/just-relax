$(function() {
  $("button.btn").bind('click', function(event) {
    var e = event.target;
    var id = e.getAttribute("data-next");

    if (id >= 4) {
      href.location = 'dashboard.html';
    } else {
      $("#data-setup" + (id - 1)).fadeOut().addClass("hide");
      $("#data-setup" + id).removeClass("hide").fadeIn();
      return false;
    }
  })
})

$(function() {
  $('#daterangeVacation').daterangepicker({
    format: 'YYYY-MM-DD',
    minDate: moment().format('YYYY-MM-DD'),
    maxDate: moment().add(365, 'days').format('YYYY-MM-DD'),
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().add(14, 'days').format('YYYY-MM-DD'),
    dateLimit: {days: 14}
  });

  $('#addDaterangeVacation').on('click', function() {
    var $val = $('#daterangeVacation')
    if(!$val.val()) {
      return
    }

    $el = $(
      '<div class="input-group" style="margin-bottom:5px">' +
        '<input disabled type="text" class="form-control" name="daterange-vacation[]" value="' + $val.val() + '" />' +
        '<span class="input-group-btn">' +
          '<button class="btn btn-default" type="button" name="remove-range">&times;</button>' +
        '</span>' +
      '</div>'
    )
    $el.find('[name="remove-range"]').on('click', function() {
      $el.remove()
    })
    $('#list-daterange-vacation').append($el)
    $val.val('')
  })

  $('#daterangeWork').daterangepicker({
    format: 'YYYY-MM-DD',
    minDate: moment().format('YYYY-MM-DD'),
    maxDate: moment().add(365, 'days').format('YYYY-MM-DD'),
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().add(14, 'days').format('YYYY-MM-DD'),
    dateLimit: {days: 14}
  });

  $('#addDaterangeWork').on('click', function() {
    var $val = $('#daterangeWork')
    if(!$val.val()) {
      return
    }

    $el = $(
      '<div class="input-group" style="margin-bottom:5px">' +
        '<input disabled type="text" class="form-control" name="daterange-work[]" value="' + $val.val() + '" />' +
        '<span class="input-group-btn">' +
          '<button class="btn btn-default" type="button" name="remove-range">&times;</button>' +
        '</span>' +
      '</div>'
    )
    $el.find('[name="remove-range"]').on('click', function() {
      $el.remove()
    })
    $('#list-daterange-work').append($el)
    $val.val('')
  })
});