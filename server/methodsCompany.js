Meteor.methods({
	updateCompanyInformation: function(companyObj) {
		if (! this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType === 'company') {

		Meteor.users.update({ _id: userId }, { $set: {'profile.company': companyObj} },
			function(error, numOfDocsAffected){
				if (! error && numOfDocsAffected == 1) {
					console.log("company updated")
					return;
				}
				else {
					throw new Meteor.Error('company not updated', error);
				}
			});
		}

	},
	createJobPost: function(jobDoc) {
		if (! this.userId ) {
			throw new Meteor.Error("not-authorized");
		}
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType === 'company') {



			var expirationDate = new Date()
			var daysTillExpiration = 45 // SET THIS TO 45!!!!!!
			expirationDate.setDate(expirationDate.getDate() + daysTillExpiration);

			var company = Meteor.users.findOne({_id: this.userId})

			jobDoc.jobCreatedAt = new Date()
			jobDoc.company_id = userId
			jobDoc.unsubscribers = []
			jobDoc.subscribers = []
			jobDoc.companyLocation = company.profile.company.location
			jobDoc.companyName = company.profile.company.name
			jobDoc.published = true
			jobDoc.expirationDate = expirationDate

		var newJobId = Jobs.insert(jobDoc,
			function(error, docId) {
				if (! error && docId) {
					console.log('new job doc id is ' + docId)
					return docId
				}
				else {
					console.log('err in insertjobdoc')
					throw new Meteor.Error(error)
				}
			});
		
		}
	}

})



