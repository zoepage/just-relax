'use strict'

// initialize Hoodie
var hoodie  = new Hoodie();

$(function () {

  var submitSignUp = function submitSignUp(){
    var usr = $('#email').val();
    var pwd = $('#pwd').val();
    
    hoodie.account.signIn(usr, pwd).done(function(){
      if(hoodie.account.username) {
        location.href = 'http://127.0.0.1:6076/dashboard.html'
      }
    })

    return false;
  }
  
  $('#sign-up').bind('submit', submitSignUp)
})