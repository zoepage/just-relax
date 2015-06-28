'use strict'

// initialize Hoodie
var hoodie  = new Hoodie();

// on ready calls all binds
$(function () {
  if(hoodie.account.username) {
    hoodie.store.find('settings', 'user-settings')
    .done(function(settings) {
      $('#username').append(settings.name || hoodie.account.username)
      $('#about h2').append(settings.name || hoodie.account.username )
    })
    .fail(function() {
      $('#username').append(hoodie.account.username)
      $('#about h2').append(hoodie.account.username)
      // console.log((!$('#main') && hoodie.account.username == undefined))
    // location.href = 'index.html';
    })
  }
  $('#logout').bind('click', signOutUsr);
  $('#sign-up').bind('submit', submitSignUp);
  $('#go-on-vacation').bind('click', result);
})


// sign-in on main page
var submitSignUp = function submitSignUp(){
  var usr = $('#email').val();
  var pwd = $('#pwd').val();

  hoodie.account.signIn(usr, pwd).done(function(){
    if(hoodie.account.username) {
      location.href = 'dashboard.html';
    }
  }).fail(function () {
    hoodie.account.signUp(usr, pwd, pwd)
      .done(function(){
      if(hoodie.account.username) {
        location.href = 'settings-init.html';
      }
    })
    .fail(function () {
      alert('Your credentials are wrong!');
    })
  })
  return false;
}

var signOutUsr = function signOutUsr () {
  hoodie.account.signOut().done(function () {
    location.href = 'index.html';
  })
}

// return results
var result = function result(event) {
  var e = event.target;
  var urlReq = e.getAttribute('data-url');

  var base = "http://justrelax.rrbone.io/booking/holiday?"

  var scores = window.engine.scores()
  var recommends = window.engine.blocks(scores);

  for (var i=1; i<=3; i++) {
    (function(i) {
      var from = recommends[i-1].start.date;
      var to = recommends[i-1].end.date;
      var location = "Deutschland";
      var urlReq = base +
        "from=" + from +
        "&to=" + to +
        "&location=" + location;
      $.ajax({
        url: urlReq
      })
      .done(function( data ) {
        var dom = $(".output");
        var res = data.results;

        var f = moment(from).format("DD.MM.YYYY");
        var t = moment(to).format("DD.MM.YYYY");
        $(".output-option-"+i).text(
          "Option " + i + ": " + f + " - " + t
        )

        res.slice(0,3).forEach(function (obj) {
          var li = '<li><a class="btn btn-lage btn-danger r" href="' + obj.link + '" target="_blank">' + obj.price + ' € / p. n. &amp; p. <br /> Book now!</a> <img class="l" src="' + obj.image + '"/> <h3 class="l">' + obj.name + '<br /><small>' + obj.city + '</small></h3></li>'
          $(".output-"+i).append(li).fadeIn().removeClass('hide');;
        })
      });
    })(i);
  }
  $(".output").fadeIn().removeClass('hide');
  $('#dashboard').fadeOut().addClass('hide');
}

if (window.recommender) {
  window.engine = recommender({
    dates: dates,
    lastVacation: moment(),
    blockedWork: [
      {
        from: '2015-06-28',
        to: '2015-06-30',
        days: 3
      }
    ],
    blockedVac: [
      {
        from: '2015-07-03',
        to: '2015-07-13',
        days: 2
      }
    ]
  })
}
