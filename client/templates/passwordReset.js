Template.passwordReset.events({
  'click button.recover': _.debounce(function(event, template){
    console.log('clicked')
    event.preventDefault();
    var email = template.find('#recovery-email').value;

    Accounts.forgotPassword({email:email}, function(error){
      if (error) {
        alert('unable to send Reset link');
      }
      else {
      	 Router.go('/resetPassword/emailSent')
      }
    });
  }, 5000, true)
});