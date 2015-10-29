Meteor.methods({

	unsubscribeUserFromJob: function(jobId) {
		if (! this.userId ) {
			throw new Meteor.Error("not-authorized");
		}
		console.log('jobId is :' + jobId)
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType === 'candidate') {
			updater(Jobs, {_id: jobId }, {$addToSet: {'unsubscribers': userId}});
		}
	},
	updateScopeResponse: function(greetsIdInSession, scopeId, value) {
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (! userId ) {
			throw new Meteor.Error("not-authorized");
		}

		if (userId && userType === 'candidate') {
			var value = value
			var regex = /\s+/gi
			var wordCount = value.trim().replace(regex, ' ').split(' ').length;
			console.log(wordCount + value)

			if ( wordCount <= 1000 ) {
				 Greets.update({ '_id': greetsIdInSession, 'candidate_id': userId, 'scopeInstance': {$elemMatch: {'id': scopeId}} }, { $set: {'scopeInstance.$.response': value} })
				 return;
			}
			else {
				throw new Meteor.Error(403, 'you exceeded the maximuum words required');
			}
		}
	},
	setScopeToComplete: function(greetsIdInSession) {
		if (! this.userId ) {
			throw new Meteor.Error("not-authorized");
		}
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType === 'candidate') {
			Greets.update({
				'_id': greetsIdInSession,
				'candidate_id': userId}, {
					$set: {
						'scopeCompleted': true,
						'scopeCompletedAt': new Date()}
					},
					function(error, numOfDocsAffected) {
						if (! error && numOfDocsAffected === 1) {
							return;
						}
						else {
							throw new Meteor.Error(error)
						}
					});
		}
	},
	/************ candidate profile updating ***********/
	updateCandidatePersonal: function(locationObj, firstName, lastName, specialityArr) {
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType ==='candidate') {

			Meteor.users.update({ '_id': userId }, {$set: {
				'profile.myProfile.location': locationObj,
				'profile.firstName': firstName,
				'profile.lastName': lastName,
				'profile.myProfile.speciality': specialityArr
			}},
				function(error, numOfDocsAffected) {
					if (! error && numOfDocsAffected === 1 ) {
						console.log('updated personalInfo')
						return;
					}
				});
		}

	},
	updatePositions: function(positions) {
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType ==='candidate') {

			Meteor.users.update({ '_id': userId }, { $set: {'profile.myProfile.positions': positions} },
				function(error, numOfDocsAffected) {
					if (! error && numOfDocsAffected === 1 ) {
						return;
					}
				});
		}
	},
	updateEducations: function(educations) {
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType === 'candidate') {

			Meteor.users.update({ '_id': userId }, { $set: {'profile.myProfile.educations': educations} },
				function(error, numOfDocsAffected) {
					if (! error && numOfDocsAffected === 1 ) {
						console.log('updated educations')
						return;
					}
				});
		}
	},
	updateLanguages: function(languages) {
		var userId = this.userId
		var userType = Meteor.user().profile.userType

		if (userId && userType ==='candidate') {

			Meteor.users.update({ '_id': userId }, { $set: {'profile.myProfile.languages': languages} },
				function(error, numOfDocsAffected) {
					if (! error && numOfDocsAffected === 1 ) {
						console.log('updated languages')
						return;
					}
				});
		}
	}
})





function finder(collName, query, projection) {
	var col = collName
	var query = query
	var projection = projection

	var projection = col.find(query,projection);
	return projection;
}

function updater(collName, query, update, options) {
	var col = collName
	var query = query
	var update = update
	var options = options

	col.update(query, update, options,
		function(error, numOfDocsAffected) {
			if (! error) {
				console.log('done update')
				return;
			}
			else {
				return Meteor.Error(error)
			}
		})
};

