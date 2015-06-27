'use strict'

// initialize Hoodie
var hoodie  = new Hoodie();

// on ready calls all binds
$(function () {
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
  })
  return false;
}

// return results
var result = function result(event) {
  var e = event.target;
  var urlReq = e.getAttribute('data-url');

  $.ajax({
  url: urlReq
})
  .done(function( data ) {
    
      console.log( data );
  });
}