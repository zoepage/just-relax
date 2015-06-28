'use strict'

// initialize Hoodie
var hoodie  = new Hoodie();

// on ready calls all binds
$(function () {
  if(hoodie.account.username) {
    $('#username').append(hoodie.account.username)
    $('#about h2').append(hoodie.account.username )
  }
  $('#logout').bind('click', signOutUsr)
  $('#sign-up').bind('submit', submitSignUp)
  $('#go-on-vacation').bind('click', result)
})


// sign-in on main page
var submitSignUp = function submitSignUp(){
  var usr = $('#email').val();
  var pwd = $('#pwd').val();

  hoodie.account.signIn(usr, pwd).done(function(){
    if(hoodie.account.username) {
      location.href = 'dashboard.html'
    }
  }).fail(function () {
    hoodie.account.signUp(usr, pwd, pwd).done(function(){
    if(hoodie.account.username) {
      location.href = 'dashboard.html'
    }
  })
  })
  return false;
}

var signOutUsr = function signOutUsr () {
  hoodie.account.signOut()
  location.href = 'index.html'
}

// return results
var result = function result(event) {
  var e = event.target;
  var urlReq = e.getAttribute('data-url');

  $.ajax({
    url: urlReq
  })
  .done(function( data ) {
    var dom = $("#output");
    var res = data.results;

    res.forEach(function (obj) {
      var li = '<li><a class="btn btn-lage btn-danger r" href="' + obj.link + '" target="_blank">' + obj.price + ' € / p. n. &amp; p. <br /> Book now!</a> <img class="l" src="' + obj.image + '"/> <h3 class="l">' + obj.name + '<br /><small>' + obj.city + '</small></h3></li>'
      $("#output").append(li).fadeIn().removeClass('hide');
      $('#dashboard').fadeOut().addClass('hide');
    })
  });
}

if (window.recommender) {
  var engine = recommender({
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

  var scores = engine.scores()
  console.log(engine.blocks(scores))
}
