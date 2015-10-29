var ERRORS_SCOPE_UPDATE = 'errors_scopeInstance_update'

Template.interestsPageCandidate.onCreated(function() {
	this.subscribe("greetsContext");
	Session.set('joinType', 'greets')
	Session.set('layoutTemplate', "greetsTemplateCAN")
	Session.set(ERRORS_SCOPE_UPDATE, {})
})


Template.interestsPageCandidate.events({
	'click [data-toggle="offcanvas"]': function() {
		$('.row-offcanvas').toggleClass('active')
	},
	'click .joinTypeGreets': function() {
		Session.set('joinType', 'greets')
		Session.set('layoutTemplate', "greetsTemplateCAN")

	},
	'click .joinTypeHandshakes': function() {
		Session.set('joinType', 'handshakes')
		Session.set('layoutTemplate', "handshakesTemplateCAN")
	},
	'click ul.nav-pills li a.name':function(event, template) {
		event.preventDefault();
		var greetFocusedID = this._id
		Session.set('greetFocusedID', greetFocusedID)
		template.$('a.name').removeClass("selected-greet")
		$('a.' + greetFocusedID).addClass("selected-greet")
		scrollingText()
	}

})

Template.interestsPageCandidate.helpers({
	layoutTemplate: function() {
		var layoutTemplate = Session.get("layoutTemplate")

		if (layoutTemplate === 'greetsTemplateCAN') {
			return Template.greetsTemplateCAN
		}

		if (layoutTemplate === 'handshakesTemplateCAN') {
			return Template.handshakesTemplateCAN
		}

		if (layoutTemplate === 'plainTemplate') {
			return Template.plainTemplate
		}
	},
	docList: function() {
		var joinType = Session.get('joinType')

		if (joinType === 'greets') {
			console.log('joinType greets')

			return Greets.find({
				'candidate_id': Meteor.userId(),
				'handShake': false
			}, { 
				 sort: {createdAt: -1}
			});
		}

		if (joinType === 'handshakes') {
			console.log('joinType handshakes')

			return Greets.find({
				'candidate_id': Meteor.userId(),
				'handShake': true
			}, {
				 sort: {createdAt: -1}
			});
		}
	}

})


/**********************************************************/
					/*GREETS TEMPLATE*/
/**********************************************************/
Template.greetsTemplateCAN.helpers({
	greetFocused: function() {
		return Greets.findOne({
			'_id': Session.get('greetFocusedID'),
			'candidate_id': Meteor.userId(),
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
	jobFocsedJoin: function() {
		var greet = this
		var job = Jobs.findOne({_id: greet.job_id})
			return _.extend(greet, _.omit(job, '_id', job, 'company_id'));
	},
})


/**********************************************************/
					/*HANDSHAKE TEMPLATE*/
/**********************************************************/

Template.handshakesTemplateCAN.helpers({
	greetFocused: function() {
		scrollingText();
		return Greets.findOne({
			'_id': Session.get('greetFocusedID'),
			'candidate_id': Meteor.userId(),
			'handShake': true
		}, {
			fields: {
				'candidate_id': 1,
				'closed': 1,
				'closedAt': 1,
				'closedBy': 1,
				'company_id':1,
				'createdAt': 1,
				'createdBy': 1,
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
	jobFocsedJoin: function() {
		var greet = this
		var job = Jobs.findOne({ _id: greet.job_id })
			return _.extend(greet, _.omit(job, '_id', job, 'company_id'));
	}
})


Template.handshakesTemplateCAN.events({
	'click #deleteGreet': function(event) {
		event.preventDefault();
		var greetId = this._id

		Meteor.call('removeGreetDoc', greetId,
			function(error, result) {
				if (! error) {
					console.log('success deleteing greet')
					Session.set('greetFocusedID', "")
				}
				else {
					console.log(error)
				}
			})
	}
})


Template.scopeAnswering.helpers({
	errorScopeMessages: function() {
		return _.values(Session.get(ERRORS_SCOPE_UPDATE));
	}
})

Template.scopeAnswering.events({
	'keyup textarea[name=response]': _.throttle(function(event){
		event.preventDefault()
		var value = event.target.value
	    var greetsIdInSession = Session.get('greetFocusedID')
	    var scopeId = this.id
	    var target = 'span#wordCount' + scopeId
	    var maxWords = this.maxWords
	    var wordCount = counter(value, maxWords, target, scopeId)
	    console.log(wordCount)

    if (wordCount > 0 && wordCount <= maxWords) {
    	

    	Meteor.call('updateScopeResponse', greetsIdInSession, scopeId, value,
    		function(error, result){
		      if (! error){
		        console.log(result)
		      }
		      else {
		      	console.log(error)
		      	return Session.set(ERRORS_SCOPE_UPDATE, {'none': error.reason});
		      }
		    }) 

    }
    if(wordCount > maxWords){
    	var errors = {}
    	Session.set(ERRORS_SCOPE_UPDATE, errors);
    	if (_.keys(errors).length) {
    		return;
    	}
    }

  }, 10000, {leading: false}),
  'click #submitScope': _.debounce(function(event, template) {
  	event.preventDefault();
  	var greetsIdInSession = this._id
  	template.$('a.name').removeClass("selected-greet")

  	Meteor.call('setScopeToComplete', greetsIdInSession,
  		function(error, result) {
  			if (! error) {
  			}
  			else {
  				console.log(error)
  			}
  		})
  }, 2000, true)
})

Template.chatBox.onRendered(function() {
	console.log('scrolling on Rendered')
	scrollingText();
})

Template.chatBox.onDestroyed(function() {
	console.log('destroyed')
})


Template.chatBox.events({
	'keydown input#message': function (event) {
		if (event.which == 13) {
			var greetsIdInSession = this._id
			var message = document.getElementById('message').value;

			if (Meteor.user() && message) {
				sendChatMessage(message, greetsIdInSession)
				document.getElementById('message').value = "";

			}
		}
	},
	'click button#sendMessage': function(event) {
		var greetsIdInSession = this._id
		var message = document.getElementById('message').value;

		if (Meteor.user() && message) {
			sendChatMessage(message, greetsIdInSession)
			document.getElementById('message').value = "";
		}
	}
})


function sendChatMessage(message, greetsIdInSession) {
	Meteor.call('updateChatMessage', message, greetsIdInSession,
		function(error, result) {
			if (error) {
				console.log(error)
			}
		});
}

function counter(value, maxWords, target, scopeId) {
	var value = value;
	var maxWords = maxWords;
	var target = target;
	var regex = /\s+/gi;
	var scopeId = scopeId;
	var wordCount = value.trim().replace(regex, ' ').split(' ').length;
	$(target).html(wordCount)
    return wordCount;
}


function scrollingText() {
	var mydiv = document.getElementById("chat-box-main");
		if (mydiv) {
		$('#chat-box-main').scrollTop( $('#chat-box-main').prop("scrollHeight") );
		return;		
	}
}
