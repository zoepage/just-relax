'use strict'

$(function () {
  $('#finish').bind('click', saveSettings);

  var id = "user-settings";

  hoodie.store.find('settings', id)
  .done(function(settings) {
    setData(settings)
  })
})

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

    vacDays:     val("vacDays"),
    budget:      val("budget"),
    distance:    val("distance"),
    travelMode:  val("travelMode"),

    favDestination: val("favDestination"),
    kids:    val("kids"),
    adults:  val("adults"),
    dog:     val("dog")
  };
}
function setData(settings) {
  val("name", settings.name),

  val("vacDays", settings.vacDays),
  val("budget", settings.budget),
  val("distance", settings.distance),
  val("travelMode", settings.travelMode),

  val("favDestination", settings.favDestination),
  val("kids", settings.kids),
  val("adults", settings.adults),
  val("dog", settings.dog)
}

var saveSettings = function saveSettings(e) {
  var id = "user-settings";

  e.preventDefault();

  var data = getData();

  hoodie.store.findOrAdd('settings', id, {})
  .done(function(obj) {
    hoodie.store.update('settings', id, data)
    .done(function(settings) {
      location.href = "dashboard.html";
    })
    .fail(function(err) {
      alert("Something went wrong saving your settings.");
    });
  })

  return false;
}
