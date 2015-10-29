
Meteor.publish('jobs-homePage', function() {
	var user = Meteor.users.findOne(this.userId)
	var newDate = new Date();

	if (user && user.profile.userType === 'candidate') {

		return Jobs.find({
			'unsubscribers': { $nin: [user._id] },
			'subscribers': { $nin: [user._id] },
			'expirationDate': { $gt: newDate }
		}, {
			fields: { 'scope': 0, 'unsubscribers': 0, 'subscribers': 0 },
			sort: { 'jobCreatedAt': -1 }
		});
	}
	else {
		//company and non-loggedin 
		return Jobs.find({
			'expirationDate': { $gt: newDate }
		}, {
		fields: { 'scope': 0, 'unsubscribers': 0, 'subscribers': 0 },
		sort: { 'jobCreatedAt': -1 }
	});
	}
});


Meteor.publish("books-subscribed", function () {
	var user = Meteor.users.findOne(this.userId)

	if (user && user.profile.userType === 'candidate') {
		return Books.find({ 'subscribers': user._id }, {
				fields: { 'title': 1, 'bookPage': 1, 'imgLg': 1 }
			});
	}
});



Meteor.publish('greetsContext', function() {
	var user = Meteor.users.findOne(this.userId)

	if (user && user.profile.userType === 'company') {

		var usersIdArray = []

		var greetsComCursor =  Greets.find({'company_id': user._id});

		Greets.find({ 'company_id': user._id }).forEach(function(doc) {
			usersIdArray.push(doc.candidate_id)
		});

		var usersCursor = Meteor.users.find({ _id: {$in: usersIdArray} }, {
			fields: {
				'profile.myProfile': 1,
				'profile.firstName': 1,
				'profile.lastName': 1
			}
		});

		var booksCursor = Books.find({ subscribers: {$in: usersIdArray} }, { fields: {'title': 1, 'bookPage': 1, 'imgLg': 1, 'subscribers': 1} });

		var jobsCursor = Jobs.find({ 'company_id': user._id }, {
			fields: { 'unsubscribers': 0, 'subscribers': 0, 'scope': 0 }
		});

		return [greetsComCursor, usersCursor, jobsCursor, booksCursor];
	}

	// OBSERVERCHANGES TO THE 'SCOPECOMPLETED' AND 'COMPLETEDAT'
	//observe this.adedd to the greets cursor
	if (user && user.profile.userType === 'candidate') {
		var jobsCursor = Jobs.find({ 'subscribers': {$in: [user._id]} }, {
			fields: { 'unsubscribers': 0, 'subscribers': 0, 'scope': 0 }
		})
		var greetsCursor =  Greets.find({ 'candidate_id': user._id });

		return [jobsCursor, greetsCursor];
	}
})
// company name and location is in job doc, so the embeded company_id in greets can server for a dynamic url 
//that takes you to the ful copmay profile page.

Meteor.publish("single-company", function(id) {
	return Meteor.users.find({ '_id': id }, {
		fields: { 'profile.company': 1, 'profile.stats.responseRateMS': 1 }
	});
})


Meteor.publish("company-jobs-created", function() {
	var user = Meteor.users.findOne(this.userId)

	if (user && user.profile.userType === 'company') {
		return Jobs.find({ 'company_id': this.userId });
	}
})




/*********************************************/
				/*MASTER ADMIND*/
/*********************************************/
Meteor.publish('masterAdmin-feedback', function() {
	var user = Meteor.users.findOne(this.userId)

	if (user && user.profile.userType === 'masterAdmin') {

		return Feedback.find({},{
			sort: { 'createdAt': -1 }
		});
	}
	else {
		return [];
	}
});

Meteor.publish('masterAdmin-allUsers', function() {
	var user = Meteor.users.findOne(this.userId)

	if (user && user.profile.userType === 'masterAdmin') {
		return Meteor.users.find({});
	}
	else {
		return [];
	}
});








