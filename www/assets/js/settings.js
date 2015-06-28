'use strict'

$(function () {
  $('#finish').bind('click', saveSettings);

  $("#save-personal-data").bind('click', saveData(["name"]));
  $("#save-travel-data").bind('click', saveData(["totalVacDays", "vacDays", "budget", "distance", "travelMode"]));
  $("#save-important-information").bind('click', saveData(["favDestination", "kids", "adults", "dog"]));

  hoodie.store.findOrAdd('settings', "user-settings", {})
  .done(function(settings) {
    setData(settings)
  })
})

var saveData = function(args) {
  return function() {
    var self = $(this);
    var success = self.siblings(".save-success");

    var updatedData = {}
    $.each(args, function(i,arg) {
      updatedData[arg] = val(arg);
    });

    // HACK
    updatedData['daterange-vacation'] = $('[name="daterange-vacation[]"]').map(function(){return $(this).val();}).get();
    updatedData['daterange-work'] = $('[name="daterange-work[]"]').map(function(){return $(this).val();}).get();

    hoodie.store.update('settings', "user-settings", updatedData)
    .done(function(settings) {
      success.toggleClass("hidden")
      setTimeout(function() {
        success.toggleClass("hidden")
      }, 2000);
    })

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
    vacDays:       val("vacDays"),
    budget:        val("budget"),
    distance:      val("distance"),
    travelMode:    val("travelMode"),

    favDestination: val("favDestination"),
    kids:    val("kids"),
    adults:  val("adults"),
    dog:     val("dog")
  };
}
function setData(settings) {
  val("name", settings.name),

  val("totalVacDays", settings.totalVacDays),
  val("vacDays", settings.vacDays),
  val("budget", settings.budget),
  val("distance", settings.distance),
  val("travelMode", settings.travelMode),

  val("favDestination", settings.favDestination),
  val("kids", settings.kids),
  val("adults", settings.adults),
  val("dog", settings.dog)

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

  hoodie.store.findOrAdd('settings', "user-settings", {})
  .done(function(obj) {
    hoodie.store.update('settings', "user-settings", data)
    .done(function(settings) {
      location.href = "dashboard.html";
    })
    .fail(function(err) {
      alert("Something went wrong saving your settings.");
    });
  })

  return false;
}
