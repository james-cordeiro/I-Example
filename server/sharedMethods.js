Meteor.methods({
	'createGreetDocument': function(jobId) {

		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (! userId || userType === 'company') {
			throw new Meteor.Error("not-authorized");
		}

		if (userId && userType === 'candidate') {
			var firstName = Meteor.user().profile.firstName
			var lastName = Meteor.user().profile.lastName
			var jobDoc = Jobs.findOne({_id: jobId})
			var companyId = jobDoc.company_id
			var jobTitle = jobDoc.title
			var scopeInstance = jobDoc.scope
			var i
			var len = scopeInstance.length

			for ( i =  0; i < len; i++) {
				scopeInstance[i].response = ""
			}


			var newDocument = Greets.insert({
					'job_id': jobId,
					'job_title': jobTitle,
					'company_id': companyId,
					'candidate_id': userId, 
					'candidate_name': firstName + " " + lastName,
					'createdAt': new Date(),
					'createdBy': userId,
					'handShake': false, 
					'handShakeAt': "", 
					'handShakeBy': "",
					'messages': [],
					'scopeInstance': scopeInstance,
					'scopeCompleted': false,
					'scopeCompletedAt': "",
					'closedReason': "",
					'closedAt': "",
					'closed': false,
					'closedBy': "",
					'company_notified': false,
					'candidate_notified': false
				},
				function(error, docId) {
					if (! error && docId) {
						return docId;
					}
					else {
						return error;
					}
				});

			Jobs.update({ _id: jobId }, { $addToSet: {'subscribers': userId} },
				function(error, numOfDocsAffected) {
					if (! error) {
						return;
					}
					else {
						console.log(error)
						return;
					}
				});
		}
	},
	updateChatMessage: function(message, greetsIdInSession) {
		if (! this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

		var userId = this.userId
		var name = Meteor.user().profile.firstName

		Greets.update({
			'_id': greetsIdInSession
		}, {
				$push:{
					'messages':{
						name: name,
						userId: userId,
						text: message,
						createdAt: new Date()
					}
				}
			},
			function(error, numOfDocsAffected) {
				if (!error && numOfDocsAffected === 1) {
					return;
				}
				else {
					throw new Meteor.Error(error);
				}
			})
	},
	handshaken: function(greetId) {
		if (! this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		
		var userId = this.userId
		var userType = Meteor.user().profile.userType
		var handShakeAt = new Date()

		if (userId) {
			Greets.update({
				'_id': greetId, company_id: userId
			}, {
				$set: { 'handShake': true, 'handShakeAt': handShakeAt, 'handShakeBy': userId }
			});
			

			var greetDoc = Greets.findOne({ '_id': greetId })
			var greetCreatedAt = greetDoc.createdAt
			var greetCreatedBy = greetDoc.createdBy
			var greetClosedAt = greetDoc.closedAt
			var greetHandShakeBy = greetDoc.handShakeBy

			// company hanshakes candidate who created the greet.
			//calculate company response rate - if createdBy is not company id,
			// handShakeBy is UserId, method/call is by userType' company', and greet 
			//is not yet closed

			if (userType === 'company' && greetCreatedBy !== userId && greetHandShakeBy === userId && !greetClosedAt ) {
				var diff = (handShakeAt - greetCreatedAt)
				console.log('diff: ' + diff)

				Meteor.users.update({ '_id': userId }, { $push: {'profile.stats.responseRateMS': diff} },
					function(error, numOfDocsAffected) {
						if (! error && numOfDocsAffected === 1) {
							return;
						}
						else {
							console.log(error)
						}
					});
			}

		}
	},
	closeGreet: function(greetId) {

		if (! this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		
		var userId = this.userId
		var userType = Meteor.user().profile.userType
		var closeDate = new Date()

		if (userId) {

			Greets.update({
				'_id': greetId, company_id: userId
			}, {
				$set: { 'closed': true, 'closedAt': closeDate , 'closedBy': userId }
			});
			
			var greetDoc = Greets.findOne({ '_id': greetId })
			var greetCreatedAt = greetDoc.createdAt
			var greetCreatedBy = greetDoc.createdBy
			var greetHandShake = greetDoc.handShake
			var greetClosedAt = greetDoc.closedAt

			// company closes greet without hanshaking:
			// calculate company response rate - if  createdBy is not company id,
			// handShake is false, method/call is company, greet is closed

			if (userType === 'company' && greetCreatedBy !== userId && !greetHandShake && greetClosedAt) {
				var diff = (greetClosedAt - greetCreatedAt)
				console.log('diff: ' + diff)

				Meteor.users.update({ '_id': userId }, { $push: {'profile.stats.responseRateMS': diff} },
					function(error, numOfDocsAffected) {
						if (! error && numOfDocsAffected === 1) {
							return;
						}
						else {
							console.log(error)
						}
					});
			}
		}
	},
	removeGreetDoc: function(greetId) {
		if (! this.userId ) {
			throw new Meteor.Error("not-authorized");
		}
		var userId = this.userId

		if (userId) {
			//remove greet document
			Greets.remove({_id: greetId},
				function(error, result) {
					if (!error) {
						return;
					}
					else {
						throw new Meteor.Error(error)
					}
				})
		}
	},
	feedbackSend: function(text) {
		if (! this.userId ) {
			throw new Meteor.Error("not-authorized");
		}

		var userId = this.userId
		var user = Meteor.users.findOne(userId)
		var userType = user.profile.userType
		var email = user.emails[0].address
		console.log('usertpe and email is  ' + userType + " " + email)


		if (userId) {

			Feedback.insert({
				'text': text,
				'userId': userId,
				'userType': userType,
				'createdAt': new Date(),
				'email': email
			},
			function(error, result) {
				if (! error) {
					return;
				}
				else {
					throw new Meteor.Error(error)
				}
			});
		}
	}

})