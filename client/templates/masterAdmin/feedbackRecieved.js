Template.feedbackRecieved.onCreated(function() {
	this.subscribe("masterAdmin-feedback");
})

Template.feedbackRecieved.helpers({
	feedback: function() {
		return Feedback.find({},{
			sort: { 'createdAt': -1 }
		});
	}
});

Template.feedbackRecieved.events({
	'click #deleteFeedback': function(event) {
		event.preventDefault();
		var docId = this._id
		console.log(docId)

		Meteor.call('deleteFeedback', docId,
			function(error, result) {
				if (error) {
					return;
				}
			});	
	} 

})