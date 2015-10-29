Template.jobList.helpers({
	allJobs: function() {
		var user = Meteor.user()
		if (user && user.profile.userType === 'candidate') {

			return Jobs.find({
				'unsubscribers': { $nin: [user._id] },
				'subscribers': { $nin: [user._id] },
				'expirationDate': { $gt: new Date() }
			}, {
				 fields: { 'scope': 0, 'unsubscribers': 0, 'subscribers': 0 },
				 sort: { 'jobCreatedAt': -1 }
			});

		}

		return Jobs.find({
			'expirationDate': { $gt: new Date() }
		}, { 
			fields: {'scope': 0, 'unsubscribers': 0, 'subscribers': 0}, 
			sort: {'jobCreatedAt': -1}
		});
	}
})

Template.jobItem.events({
	'click #unsubscribeUserFromJob': function(){
		console.log(this)
		var jobId = this._id;

			Meteor.call('unsubscribeUserFromJob', jobId,
				function(error, result) {
				if (!error) {
					return;
				}
				else {
					console.log(error)
				}
			});
	}
});


Template.foldOrGreet.events({
	'click #unsubscribeUserFromJob': function(){
		console.log(this)
		var jobId = this._id;

			Meteor.call('unsubscribeUserFromJob', jobId,
				function(error, result) {
				if (! error) {
					return;
				}
				else {
					console.log(error)
				}
			});
	},
	'click #greet': function() {
		var jobId = this._id
		console.log(this)

		Meteor.call('createGreetDocument', jobId,
			function(error, result){
				if (! error) {
					console.log(result)
				}
				else {
					console.log(error)
				}
		})
	}
})


Template.foldOrGreetNotLoggedIn.events({
	'click #unsubscribeNotLoggedIn, click #greetNotLoggedIn': function() {
		Router.go('join')
	}
})