'use strict'

// initialize Hoodie
// var hoodie = new Hoodie();

// on ready calls all binds
$(function () {
  // if (hoodie.account.username) {
  //   hoodie.store.find('settings', 'user-settings')
  //     .done(function(settings) {
  //       $('#username').append(settings.name || hoodie.account.username)
  //       $('h2.welcoming').append(settings.name || hoodie.account.username)
  //     })
  //     .fail(function() {
  //       $('#username').append(hoodie.account.username)
  //       $('h2.welcoming').append(hoodie.account.username)
  //       // console.log((!$('#main') && hoodie.account.username == undefined))
  //       // location.href = 'index.html';
  //     })
  // }

  if ($('#dashboard')) {
    const settings = {
      name: localStorage.getItem('name'),
      totalVacDays: localStorage.getItem('totalVacDays'),
      openVacDays: localStorage.getItem('openVacDays'),
    }

    animateDays(vacDays(settings), workDays());

  }
})

// animation of work/vac days in dashboard
function animateDays(vacDay, workDay) {
  var overlay = $('.day-ani')
  var factorWorkDays = factorForAni(workDay.total, workDay.left);
  var factorVacDays = factorForAni(vacDay.total, vacDay.left);

  var vacW = 125 - (125 * factorVacDays);
  var workW = 125 - (125 * factorWorkDays);

  var label = createLabel(vacDay, workDay)
  $('#vac-days').addClass(label).animate({
    'border-width': vacW
  }, 1400, function () {
    $('.vac-days.overlay').append(vacDay.left + ' / ' + vacDay.total).fadeIn();
  });

  $('#work-days').addClass(label).animate({
    'border-width': workW
  }, 1400, function () {
    $('.work-days.overlay').append(workDay.left + ' / ' + workDay.total).fadeIn();
  });

}

function factorForAni(total, left) {
  console.log("factorForAni", total, left, left / total);
  return left / total;
}

function createLabel(vacDay, workDay) {
  var vac = vacDay.left / vacDay.total;
  var work = workDay.left / workDay.total;

  var fac = Math.abs(vac - work);

  if (fac < 0.2) {
    return 'green';
  } else if (fac < 0.4) {
    return 'orange';
  } else {
    return 'red';
  }
}

var workDays = function workDays() {
  return {
    total: totalWorkDays(dates),
    left: leftWorkDays(dates).leftWorkDays
  };
}

var vacDays = function vacDays(settings) {
  var v = parseInt(settings.openVacDays || 0, 10);
  var t = parseInt(settings.totalVacDays || 0, 10);
  if (t < v) t = v;

  return {
    total: t,
    left: v
  };
}

function deserializeDaterange(str) {
  var start = moment(str.split(' - ')[0])
  var end = moment(str.split(' - ')[1])

  return {
    from: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
    days: end.diff(start, 'days')
  }
}

// return results
var result = function result(event) {
  var e = event.target;
  // hoodie.store.find("settings", "user-settings")
  //   .then(function(s) {
  //     var blockedVac = s['daterange-vacation']
  //     var blockedWork = s['daterange-work']
  //     blockedVac = blockedVac || []
  //     blockedWork = blockedWork || []
  //     blockedVac = blockedVac.map(deserializeDaterange)
  //     blockedWork = blockedWork.map(deserializeDaterange)

  //     var engine = recommender({
  //       dates: dates,
  //       lastVacation: moment(),
  //       blockedWork: blockedVac,
  //       blockedVac: blockedWork
  //     });

  //     var scores = engine.scores()
  //     $('#dashboard').fadeOut().addClass('hide');
  //   })
}
