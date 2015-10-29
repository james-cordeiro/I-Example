Meteor.methods({
	deleteFeedback: function(docId) {
		Feedback.remove({ '_id': docId },
			function(error, numOfDocsAffec) {
				if (! error & numOfDocsAffec === 1) {
					console.log(numOfDocsAffec)
					return;
				}
				else {
					console.log(error)
				}
			})
	}

})