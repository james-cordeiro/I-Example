var ERRORS_KEY = 'signinErrors';

/*Template.login.onCreated(function() {
  Session.set(ERRORS_KEY, {});
})*/


Template.login.helpers({
  errorLoginMessages: function() {
    if (Session.get(ERRORS_KEY)) {
      return _.values(Session.get(ERRORS_KEY));
    }
  }
/*  serverError: function() {
    return Session.get('SERVER_ERROR')
  },*/
/*  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }*/
});



Template.login.events({
  'submit, click .submit': function(event, template) {
    event.preventDefault();
    
    var email = template.find('#email').value
    var password = template.find('#password').value
    var errors = {}

    if (! email) {
      errors.email = 'Email is required';
    }

    if (! password) {
      errors.password = 'Password is required';
    }
    //Retrieve all the names of the object's own enumerable properties
    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
    
    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        var error = {error: error.reason}
        Session.set(ERRORS_KEY, error);
      }
      else {
        Router.go('home');
      }
    });
  }
});


