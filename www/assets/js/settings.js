'use strict'

$(function () {
  $('#finish').bind('click', saveSettings);

  $("#save-personal-data").bind('click', saveData(["name"]));
  $("#save-travel-data").bind('click', saveData(["totalVacDays", "openVacDays"]));

  // hoodie.store.findOrAdd('settings', "user-settings", {})
  // .done(function(settings) {
  //   setData(settings)
  // })
})

var saveData = function(args) {
  return function() {
    var self = $(this);
    var success = self.siblings(".save-success");

    var updatedData = {}
    $.each(args, function(i,arg) {
      updatedData[arg] = val(arg);
    });

    console.log('💚💚💚', updatedData);

    // HACK
    updatedData['daterange-vacation'] = $('[name="daterange-vacation[]"]').map(function(){return $(this).val();}).get();
    updatedData['daterange-work'] = $('[name="daterange-work[]"]').map(function(){return $(this).val();}).get();

    for (let [key, value] of Object.entries(updatedData)) {
      localStorage.setItem(key, value)
    }


    // hoodie.store.update('settings', "user-settings", updatedData)
    // .done(function(settings) {
    //   success.toggleClass("hidden")
    //   setTimeout(function() {
    //     success.toggleClass("hidden")
    //   }, 2000);
    // })

    return false;
  }
}

function val(id, value) {
  if (value) {
      $("#"+id).val(value);
  } else {
      return $("#"+id).val();
  }
}
function getData() {
  return {
    name:        val("name"),
    totalVacDays:  val("totalVacDays"),
    openVacDays:     val("openVacDays"),
  };
}
function setData(settings) {
  val("name", settings.name),

  val("totalVacDays", settings.totalVacDays),
  val("openVacDays", settings.openVacDays),

  settings['daterange-vacation'].forEach(function(range) {
    var $el = $(
      '<div class="input-group" style="margin-bottom:5px">' +
        '<input disabled type="text" class="form-control" name="daterange-vacation[]" value="' + range + '" />' +
        '<span class="input-group-btn">' +
          '<button class="btn btn-default" type="button" name="remove-range">&times;</button>' +
        '</span>' +
      '</div>'
    )
    $el.find('[name="remove-range"]').on('click', function() {
      $el.remove()
    })
    $('#list-daterange-vacation').append($el)
  })

  settings['daterange-work'].forEach(function(range) {
    var $el = $(
      '<div class="input-group" style="margin-bottom:5px">' +
        '<input disabled type="text" class="form-control" name="daterange-work[]" value="' + range + '" />' +
        '<span class="input-group-btn">' +
          '<button class="btn btn-default" type="button" name="remove-range">&times;</button>' +
        '</span>' +
      '</div>'
    )
    $el.find('[name="remove-range"]').on('click', function() {
      $el.remove()
    })
    $('#list-daterange-work').append($el)
  })
}

var saveSettings = function saveSettings(e) {
  e.preventDefault();

  var data = getData();

  console.log('🥵🥵🥵🥵', data);

  for (let [key, value] of Object.entries(data)) {
      localStorage.setItem(key, value)
  }

  location.href = "dashboard.html";
}
