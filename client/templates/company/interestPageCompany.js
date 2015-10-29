Template.interestsPageCompany.onCreated(function() {
	this.subscribe("greetsContext");
	Session.set('joinType', 'greets')
	Session.set('layoutTemplate', "greetsTemplate")
})

Template.interestsPageCompany.onDestroyed(function() {
	/*Session.clear('joinType')
	Session.clear('layoutTemplate')*/
})

Template.interestsPageCompany.events({
	'click [data-toggle="offcanvas"]': function() {
		$('.row-offcanvas').toggleClass('active')
	},
	'click .jobsCreatedList': function(event) {
		event.preventDefault();
		var self = this
		var jobFocusedID = self._id
		var jobFocusedTitle = self.title
		Session.set('jobFocusedID', jobFocusedID)
		Session.set('jobFocusedTitle', jobFocusedTitle)
		// default populates joinType Session to joins 
		Session.set('joinType', 'greets')
		Session.set('layoutTemplate', "greetsTemplate")
	},
	'click .joinTypeGreets': function() {
		Session.set('joinType', 'greets')
		Session.set('layoutTemplate', "greetsTemplate")

	},
	'click .joinTypeHandshakes': function() {
		Session.set('joinType', 'handshakes')
		Session.set('layoutTemplate', "handshakesTemplate")
	},
	'click ul.nav-pills li a.name':function(event, template) {
		event.preventDefault();
		var greetFocusedID = this._id
		template.$('a.name').removeClass("selected-greet")
		$('a.' + greetFocusedID).addClass("selected-greet")

		Session.set('greetFocusedID', greetFocusedID)
		scrolling()
	}

})

Template.interestsPageCompany.helpers({
	jobsCreated: function() {
		return Jobs.find({'company_id': Meteor.userId()});
	},
	slctdJobPubl: function() {
		return Session.get('jobFocusedTitle');
	},
	layoutTemplate: function() {
		var layoutTemplate = Session.get("layoutTemplate")

		if (layoutTemplate === 'greetsTemplate') {
			return Template.greetsTemplate
		}

		if (layoutTemplate === 'handshakesTemplate') {
			return Template.handshakesTemplate
		}

		if (layoutTemplate === 'plainTemplate') {
			return Template.plainTemplate
		}
	},
	docList: function() { 
		var joinType = Session.get('joinType')

		if (joinType === 'greets') {

			return Greets.find({
				'job_id': Session.get('jobFocusedID'),
				'company_id': Meteor.userId(),
				'handShake': false,
				'scopeCompleted': false
			}, {
				sort: { createdAt: -1 }
			}); 
		}

		if (joinType === 'handshakes') {
			return Greets.find({
				'job_id': Session.get('jobFocusedID'),
				'company_id': Meteor.userId(),
				'handShake': true
			},{
				sort: { createdAt: -1 }
			});
		}
	}

})

Template.booksView.helpers({
	booksFocused: function() {
		var greet = this
		return Books.find({ subscribers: { $all: [greet.candidate_id] } });
	}
})

/**********************************************************/
					/*GREETS TEMPLATE*/
/**********************************************************/
Template.greetsTemplate.helpers({
	greetFocused: function() {
		return Greets.findOne({
			'_id': Session.get('greetFocusedID'),
			'job_id': Session.get('jobFocusedID'),
			'company_id': Meteor.userId(),
			'handShake': false,
			'scopeCompleted': false
		}, {
			fields: {
				'job_id': 1,
				'company_id': 1,
				'candidate_id': 1,
				'createdAt': 1,
				'createdBy': 1,
				'closed': 1,
				'closedAt': 1,
				'closedBy': 1
			},
			sort: {createdAt: -1}
		});
	},
	candidateProfileFocusedJoin: function() {
		var greet = this
		var candidatePorifle = Meteor.users.findOne({ _id: greet.candidate_id })
		return _.extend(greet, _.omit(candidatePorifle, '_id'));
	}
})

Template.greetsTemplate.events({
	'click #handshake': function() {
		var greetId = this._id

		Meteor.call('handshaken', greetId,
			function(error, result) {
				if ( ! error ) {
					Session.set('greetFocusedID', "")
				}
				else {
					console.log(error)
				}
			});
	},
	'click #closeGreet': function(event) {
		event.preventDefault();
		var greetId = this._id
		closeGreetDocument(greetId)


	},
	'click #deleteGreet': function(event) {
		event.preventDefault();
		var greetId = this._id
		Session.set('greetFocusedID', "")
		deleteGreetDocument(greetId)
	}
})


/**********************************************************/
					/*HANDSHAKE TEMPLATE*/
/**********************************************************/
Template.handshakesTemplate.helpers({
	handshakeFocused: function() {
		scrolling();
		return Greets.findOne({
			'_id': Session.get('greetFocusedID'),
			'job_id': Session.get('jobFocusedID'),
			'company_id': Meteor.userId(),
			'handShake': true
		}, {
			fields: {
				'candidate_id': 1,
				'candidate_name': 1,
				'closed': 1,
				'closedAt': 1,
				'company_id':1,
				'createdAt': 1,
				'createdBy': 1,
				'closedBy': 1,
				'handShake': 1,
				'handShakeAt': 1,
				'job_id': 1,
				'messages':1,
				'scopeCompleted': 1,
				'scopeCompletedAt': 1,
				'scopeInstance': 1
			},
			 sort: {createdAt: -1}
		});
	},
	candidateProfileFocusedJoinHS: function() {
		var greet = this
		var candidatePorifle = Meteor.users.findOne({ _id: greet.candidate_id })
		return _.extend(greet, _.omit(candidatePorifle, '_id'));
	}
})

Template.handshakesTemplate.events({
	'click #closeGreet': function(event) {
		event.preventDefault();
		var greetId = this._id
		closeGreetDocument(greetId)


	},
	'click #deleteGreet': function(event) {
		event.preventDefault();
		var greetId = this._id
		Session.set('greetFocusedID', "")
		deleteGreetDocument(greetId)
	}
})


/**********************************************************/
                       /*CHAT*/
/**********************************************************/
function scrolling() {
	var mydiv = document.getElementById("chat-box-main");
		if (mydiv) {
		$('#chat-box-main').scrollTop( $('#chat-box-main').prop("scrollHeight") );
		return;		
	}
}


Template.chatBoxCOM.onRendered(function() {
	console.log('scrolling on Rendered')
	scrolling();
})


Template.chatBoxCOM.events({
	'keydown input#message': function (event) {
		if (event.which == 13) {
			var greetsIdInSession = this._id
			var message = document.getElementById('message').value;

			if (Meteor.user() && message) {
				updateMessage(message, greetsIdInSession)
				document.getElementById('message').value = "";
			}
		}
	},
	'click button#sendMessage': function(event) {
		var greetsIdInSession = this._id
		var message = document.getElementById('message').value;
		if (Meteor.user() && message) {
			updateMessage(message, greetsIdInSession)
			document.getElementById('message').value = "";
		}
	}
});



function closeGreetDocument(greetId) {
	Meteor.call('closeGreet', greetId,
		function(error, result) {
			if (! error) {
				console.log('greet successfuly closed by company')
			}
			else {
				console.log(error)
			}
		})
} 


function deleteGreetDocument(greetId) {
	Meteor.call('removeGreetDoc', greetId,
		function(error, result) {
			if (! error) {
			}
			else {
				console.log(error)
			}
		})
}

function updateMessage(message, greetsIdInSession) {

	Meteor.call('updateChatMessage', message, greetsIdInSession,
		function(error, result) {
			if (error) {
				console.log(error)
			}
		});

}
