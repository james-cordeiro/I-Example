Template.profilePageCandidate.onCreated(function () {
  this.subscribe("books-subscribed")
})

Template.profileCandidateMapped.events({
	'click #positionsEdit': function() {
		Router.go('positionsEdit')
	},
	'click #educationsEdit': function() {
		Router.go('educationsEdit')
	},
	'click #languagesEdit': function() {
		Router.go('languagesEdit')
	},
	'click #booksEdit': function() {
		Router.go('booksEdit')
	},
	'click #personalEdit': function() {
		Router.go('personalEdit')
	}
})

Template.books.helpers({
	booksHelper: function() {
		return Books.find({}, { fields: {'title': 1, 'bookPage': 1, 'imgLg': 1} });
	}
})



/*****************************************
                 EDITING
*****************************************/

