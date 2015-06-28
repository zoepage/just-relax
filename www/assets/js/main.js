'use strict'

// initialize Hoodie
var hoodie = new Hoodie();

// on ready calls all binds
$(function() {
  if (hoodie.account.username) {
    hoodie.store.find('settings', 'user-settings')
      .done(function(settings) {
        $('#username').append(settings.name || hoodie.account.username)
        $('h2.welcoming').append(settings.name || hoodie.account.username)
      })
      .fail(function() {
        $('#username').append(hoodie.account.username)
        $('h2.welcoming').append(hoodie.account.username)
        // console.log((!$('#main') && hoodie.account.username == undefined))
        // location.href = 'index.html';
      })
  }

  if($('#dashboard')) {
    hoodie.store.find('settings', 'user-settings')
    .done(function(settings) {
      animateDays(vacDays(settings), workDays());
    });
  }
  $('#logout').bind('click', signOutUsr);
  $('#sign-up').bind('submit', submitSignUp);
  $('#go-on-vacation').bind('click', result);
})

// animation of work/vac days in dashboard
function animateDays(vacDay, workDay) {
  var overlay = $('.day-ani')
  var factorWorkDays = factorForAni(workDay.total, workDay.left);
  var factorVacDays = factorForAni(vacDay.total, vacDay.left, workDay.total, workDay.left);

  $('#vac-days').addClass(createLabel(factorVacDays)).animate({
    'border-width': (1.25 * factorVacDays)
  }, 1400, function() {
    $('.vac-days.overlay').append(vacDay.left + ' / ' + vacDay.total).fadeIn();
  });

  $('#work-days').addClass(createLabel(factorWorkDays)).animate({
    'border-width': (1.25 * factorWorkDays)
  }, 1400, function() {
    $('.work-days.overlay').append(workDay.left + ' / ' + workDay.total).fadeIn();
  });

 }

function factorForAni(total, left) {
  var factor = ((-(left / total) * 100) + 100);
  return factor;
} 

function createLabel(fac) {
  if(fac < 33) {
    return 'red';
  } else if (fac >= 33 && fac < 66) {
    return 'orange';
  } else {
    return 'green';
  }
}

// sign-in on main page
var submitSignUp = function submitSignUp() {
  var usr = $('#email').val();
  var pwd = $('#pwd').val();

  hoodie.account.signIn(usr, pwd).done(function() {
    if (hoodie.account.username) {
      location.href = 'dashboard.html';
    }
  }).fail(function() {
    hoodie.account.signUp(usr, pwd, pwd)
      .done(function() {
        if (hoodie.account.username) {
          location.href = 'settings-init.html';
        }
      })
      .fail(function() {
        alert('Your credentials are wrong!');
      })
  })
  return false;
}

var signOutUsr = function signOutUsr() {
  hoodie.account.signOut().done(function() {
    location.href = 'index.html';
  })
}

var workDays = function workDays() {
  return {
    total: totalWorkDays(dates),
    left: leftWorkDays(dates).leftWorkDays
  };
}

var vacDays = function vacDays(settings) {
  return {
    total: parseInt(settings.totalVacDays || 0, 10),
    left:  parseInt(settings.vacDays || 0, 10)
  };
}

var buildUrl = function buildUrl(from, to) {
  var base = "http://justrelax.rrbone.io/booking/holiday?"

  var urlReq = base + "from=" + from + "&to=" + to;

  return hoodie.store.find("settings", "user-settings")
    .then(function(s) {
      urlReq += "&location=" + s.favDestination;

      var adults = parseInt(s.adults, 10);
      var kids = parseInt(s.kids, 10);
      var budget = parseInt(s.budget, 10);

      if (adults > 0) {
        urlReq += "&adults=" + adults;
      }
      if (kids > 0) {
        urlReq += "&kids=" + kids;
      }
      if (budget > 0) {
        urlReq += "&budget=" + budget;
      }

      return urlReq;
    })
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
  hoodie.store.find("settings", "user-settings")
    .then(function(s) {
      var blockedVac = s['daterange-vacation']
      var blockedWork = s['daterange-work']
      blockedVac = blockedVac || []
      blockedWork = blockedWork || []
      blockedVac = blockedVac.map(deserializeDaterange)
      blockedWork = blockedWork.map(deserializeDaterange)

      var engine = recommender({
        dates: dates,
        lastVacation: moment(),
        blockedWork: blockedVac,
        blockedVac: blockedWork
      });

      var scores = engine.scores()
      var recommends = engine.blocks(scores);

      for (var i = 1; i <= 3; i++) {
        (function(i) {
          var from = recommends[i - 1].start.date;
          var to = recommends[i - 1].end.date;
          buildUrl(from, to).then(function(urlReq) {
            $.ajax({
              url: urlReq
            })
              .done(function(data) {
                var dom = $(".output");
                var res = data.results;

                var f = moment(from).format("DD.MM.YYYY");
                var t = moment(to).format("DD.MM.YYYY");
                $(".output-option-" + i).text(
                  "Option " + i + ": " + f + " - " + t
                )

                $(".output").fadeIn().removeClass('hide');

                res.slice(0, 3).forEach(function(obj) {
                  var li = '<li><a class="btn btn-lage btn-danger r" href="' + obj.link + '" target="_blank">' + obj.price + ' € / p. n. &amp; p. <br /> Book now!</a> <img class="l" src="' + obj.image + '"/> <h3 class="l">' + obj.name + '<br /><small>' + obj.city + '</small></h3></li>'
                  $(".output-" + i).append(li).fadeIn().removeClass('hide');
                  ;
                })
              });
          });
        })(i);
      }
      $('#dashboard').fadeOut().addClass('hide');
    })
}
