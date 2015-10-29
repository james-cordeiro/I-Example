Template.feedback.events({
	'click #feedbackSend': function(event, template) {
		event.preventDefault();

		var text = template.find('#feedback').value

		if (text) {

			Meteor.call("feedbackSend", text,
				function(error, result) {
					if (! error) {
						document.getElementById('feedback').value = "";
						Router.go('home');
					}
					else {
						console.log(error)
					}
				});
		}

	}
})