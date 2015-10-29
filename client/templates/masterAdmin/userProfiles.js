Template.userProfiles.onCreated(function() {
	this.subscribe("masterAdmin-allUsers");
})

Template.userProfiles.onRendered(function() {

})


Template.userProfiles.events({
/*	'click #userTypesCandidate': function(events) {
		Session.set('userType', 'candidate')
	},
	'click #userTypesCompany': function(events) {
		Session.set('userType', 'company')
	}*/
})



Template.usersCandidates.helpers({
	usersCandidates: function() {
		return Meteor.users.find({ 'profile.userType': 'candidate' });
	},
	candidateCount: function() {
		return Meteor.users.find({ 'profile.userType': 'candidate' }).count();
	},
	singleCanUserDisplay: function() {
		return Meteor.users.findOne({ '_id': Session.get('userIdCandidate') });
	}
})

Template.usersCandidates.events({
	'click #name': function() {
		var userId = this._id
		Session.set('userIdCandidate', userId);
	},
	'click [data-toggle="offcanvas"]': function() {
		$('.row-offcanvas').toggleClass('active')

	}
})




Template.usersCompany.events({
	'click #name': function() {
		var userId = this._id
		Session.set('userIdCompany', userId);
	},
	'click [data-toggle="offcanvas"]': function() {
		$('.row-offcanvas').toggleClass('active');

	}
})



Template.usersCompany.helpers({
	usersCompany: function() {
		return Meteor.users.find({ 'profile.userType': 'company' });
	},
	companyCount: function() {
		return Meteor.users.find({ 'profile.userType': 'company' }).count();
	},
	singleComUserDisplay: function() {
		return Meteor.users.findOne({ '_id': Session.get('userIdCompany') });
	}
})