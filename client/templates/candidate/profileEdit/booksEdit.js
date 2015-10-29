Template.booksEdit.events({
	'click #goodreadsLogoNotExtracted': function(event){
		event.preventDefault();
		$('#notExtractedGoodreadsModal').modal('show')
	},
	'click #acceptGoodreadsExtraction': function(event){
		event.preventDefault();
		$('#notExtractedGoodreadsModal').modal('hide')
		Meteor.call('goodreadsPartOne', function(error, result) {
			if (error) {
				console.log(error)
			}
			else {
				console.log(result)
				window.location = result
			}
		})
	}
})

