Template.parent.onCreated(function () {
	return Meteor.user() && Meteor.user().profile.userType;
});


Template.candidate.events({
      'click .js-logout': function() {
        Meteor.logout();
    }
});


Template.company.events({
      'click .js-logout': function() {
        Meteor.logout();
    }
});

Template.masterAdmin.events({
      'click .js-logout': function() {
        Meteor.logout();
    }
});