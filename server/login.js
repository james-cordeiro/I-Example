var CONSUMER_KEY_GR = '3Z2Pi2fYL70I1zv9sM8Zw' 
var CONSUMER_SECRET_GR = 'rt6nsoxhh16eaRFL6AqLgvzkyQAKKF5utPKNVztv3Mo'

Accounts.onLogin(function(user){
	var userId = user.user._id

	if (user.user.profile.userType == 'candidate') {

			var hasBeenExt = Meteor.users.findOne({_id: userId}).profile.goodreads.extracted

			console.log('has goodreads been extracted before?  ' + hasBeenExt )

					if (hasBeenExt == true) {
						var goodreadsObj = Meteor.users.findOne({_id: userId}).profile.goodreads
						var currentDate = new Date()
						var futureExtractionDate = goodreadsObj.futureExtractionDate
						var permExpiresOn = goodreadsObj.permData.expiresOn

						//has user passed goodreads extraction date?
						var passedExtrationDate = (futureExtractionDate - currentDate) < 0
						console.log(passedExtrationDate)
						// has the permTokens Expired?
						var permTokenNotExpired = (permExpiresOn - currentDate) < 0
						console.log(permTokenNotExpired)

						//if candidate has passed extraction date and token have NOt expired
						// returve perm tokens, get books shelves, and run the proceeding
						if (passedExtrationDate == true && permTokenNotExpired == true) {

							var permTokens = retrievePermTokens(userId)
							var goodreadsSeven = getBookShelves(permTokens)
							var goodreadsEight = createBookObjectsInsertAndOrReference(goodreadsSeven, userId)
							var goodreadsNine = updateExtractedDate(userId)
							return;
						}
						else if (permTokenNotExpired == true) {
							// notify user that htye must sign into goodre
						}

					}
					else {
						//user never extracted their goodreads profile'
					}
	}
	else if (user.user.profile.userType === 'company') {
		console.log("co login")
	}

});

function retrievePermTokens(userId) {
	var permData = Meteor.users.findOne(userId).profile.goodreads.permData;
	return permData;
}


//7. get users book shelves
function getBookShelves(permData) {
	var f = new future()

	var oauth = {
		consumer_key: CONSUMER_KEY_GR,
		consumer_secret: CONSUMER_SECRET_GR,
		token: permData.token,
		token_secret: permData.token_secret
	}

	var url = 'https://www.goodreads.com/review/list.xml?v=2' + qs.stringify({key:CONSUMER_KEY_GR, id:permData.userIdGR/*, shelf:'read,currently-reading'*/})

	request.get({url:url, oauth:oauth}, 
		function(error, response, body) {
			if(!error && response.statusCode === 200) {

				var options = {
					object: true,
					reversible: false,
		            coerce: true,
		            sanitize: true,
		            trim: true,
		            arrayNotation: false
		        }

		        var bookShelveData = parser.toJson(body, options)
		        return f['return'](bookShelveData)
			}
			else {
				throw new Meteor.Error(error)
			}
		})
	return f.wait();
}


// 8. resultEight - create books object, insert if new along with user
// check isbn13 does not already exists in collection. if true, then insert user as 'subscriber'
//if isbn13 does not exists, create new book document
//if isbn13 === 'nil', create new book and set isbn13 to ''
function createBookObjectsInsertAndOrReference(bookShelveData, userId) {

	deleteSubscriptions(userId)

	var len = bookShelveData.GoodreadsResponse.reviews.review.length;
	var i 
	for (i = 0; i < len; i++) {
		var isbn13In = bookShelveData.GoodreadsResponse.reviews.review[i].book.isbn13
		var titleIn = bookShelveData.GoodreadsResponse.reviews.review[i].book.title
		var bookPageIn = bookShelveData.GoodreadsResponse.reviews.review[i].book.link

		var isbn13InIsNotNumber = isNaN(isbn13In)
		var typeOf = typeof(isbn13In)

		if (! isbn13InIsNotNumber) {
			var isbn13Exist = Books.find({isbn13: isbn13In}, {limit: 1}).count()>0
			console.log('isbn13Exist :' +  isbn13Exist)

					if (! isbn13Exist) {
					//isbn13 does not exists, create a new book document and subscribe the user to it
						var newBookDocument = {
							isbn13: bookShelveData.GoodreadsResponse.reviews.review[i].book.isbn13,
							isbn: bookShelveData.GoodreadsResponse.reviews.review[i].book.isbn,
							imgLg: bookShelveData.GoodreadsResponse.reviews.review[i].book.image_url,
							title: bookShelveData.GoodreadsResponse.reviews.review[i].book.title,
							bookPage: bookShelveData.GoodreadsResponse.reviews.review[i].book.link,
							subscribers: [userId]
						}

						Books.insert(newBookDocument,
							function(error, docId){
								if (! error && docId) {

								}
								else {
									throw new Meteor.Error(error)
								}
							});
						
					}
					else if (isbn13Exist) {
						//find the bookd doc and subscribe the user to it
						var bookDocumentId = Books.findOne({ isbn13: isbn13In })._id

						Books.update({ _id: bookDocumentId }, { $addToSet: {'subscribers': userId} },
							function(error, numAffectedDocs){
								if (! error && numAffectedDocs == 1) {
								}
								else {
									throw new Meteor.Error(error)
								}
							});

					}
		}//end if (isbn13InIsNotNumber)
		else if (isbn13InIsNotNumber) {
			var existsWithFieldMatching = Books.findOne({ title: titleIn, bookPage: bookPageIn })

				if (existsWithFieldMatching) {

					Books.update({ _id: existsWithFieldMatching._id }, { $addToSet: {'subscribers': userId} },
						function(error, numAffectedDocs){
							if (! error && numAffectedDocs == 1) {
							}
							else {
								throw new Meteor.Error(error)
							}
						});
				}
				else {
					var newBookDoc = {
						isbn13: " ",
						isbn: " ",
						imgLg: bookShelveData.GoodreadsResponse.reviews.review[i].book.image_url,
						title: bookShelveData.GoodreadsResponse.reviews.review[i].book.title,
						bookPage: bookShelveData.GoodreadsResponse.reviews.review[i].book.link,
						subscribers: [userId]
					}

					Books.insert(newBookDoc,
						function(error, docId){
							if(!error && docId) {
							}
							else {
								throw new Meteor.Error(error)
							}
						});
				}
		}
	} //END FOR LOOP
	return;
}



function deleteSubscriptions(userId) {
	Books.update({ 'subscribers': userId }, { $pull: {'subscribers': userId} }, { multi: true },
			function(error, numAffectedDocs){
				if(!error) {
				}
				else {
					throw new Meteor.Error(error)
				}
			});
}

// 9.
function updateExtractedDate(userId){
	var extractedDate = new Date()
	var futureExtractionDate = new Date()
	var daysTillRenewal = 25
	futureExtractionDate.setDate(futureExtractionDate.getDate() + daysTillRenewal);

	Meteor.users.update({ _id: userId }, { $set: {'profile.goodreads.extractedDate': extractedDate, 'profile.goodreads.extracted': true, 'profile.goodreads.futureExtractionDate': futureExtractionDate} },
		function(error, numAffectedDocuments){
			if (! error && numAffectedDocuments == 1) {
				return 'updateComplete';
			}
			else {
				throw new Meteor.Error('func: insertBookRefsAndDateExtracted failed ' + error)
			}
		})

}




