var CONSUMER_KEY_GR = '3Z2Pi2fYL70I1zv9sM8Zw' 
var CONSUMER_SECRET_GR = 'rt6nsoxhh16eaRFL6AqLgvzkyQAKKF5utPKNVztv3Mo'


// TO PERIODICALLY GET GOODREADS DATA, MAKE A NEW METHOD THAT INCLUDES
// NEW FUNCTION THAT GETS PERMDATA, THEN RUN FUNCTION 7.

//NEW BOOK DOCUMENTS ARE CREATED IF THE ISBN13 DOES NOT EXIST
//HOWEVER, SOMETIMES ISBN13 ARE OBJECTS ' isbn13: {nil: true} ' 
// BOOK OBJECTS ARE FOUND BY MATCHNG TITLE AND THE UNIQUE URL 'bookPage'
Meteor.methods({

	goodreadsPartOne: function() {
		var userId = this.userId
		var goodreadsOne = goodreadsRequestToken()
		var goodreadsTwo = storeTempToken(goodreadsOne.tempTokensObject, userId)
		return goodreadsOne.authenticateUrl;
	},

	goodreadsPartTwo: function() {
			var userId = this.userId
			/*var tempData = Meteor.users.findOne(userId).profile.goodreads.tempData;*/
			var goodreadsThree = retrieveTempTokens(userId)
			var goodreadsFour = exchangeTempTokenForPermTokens(goodreadsThree)
			var goodreadsFive = getUserGoodreadsId(goodreadsFour)
			var goodreadsSix = storePermTokensAndID(goodreadsFive, userId)
			var goodreadsSeven = getBookShelves(goodreadsSix)
			var goodreadsEight = createBookObjectsInsertAndOrReference(goodreadsSeven, userId)
			var goodreadsNine = updateExtractedDate(userId)
		return;
	}

})
// https://github.com/meteor/meteor/wiki/Meteor-Style-Guide

// 1. request tokens
function goodreadsRequestToken(){
	var f = new future()
	var url = 'http://www.goodreads.com/oauth/request_token'

	var oauth = {
			callback: 'http://localhost:3000/goodreadsLoading/',
			consumer_key: CONSUMER_KEY_GR,
			consumer_secret: CONSUMER_SECRET_GR
		}

	request.get({url:url,oauth: oauth},
		function(error, response, body) {

				if (! error && response.statusCode === 200) {
					var tempTokens = querystring.parse(body);

					var tempTokensObject = {
						oauth_token: tempTokens.oauth_token,
						oauth_token_secret: tempTokens.oauth_token_secret
					}

					var authenticateUrl = 'http://www.goodreads.com/oauth/authorize?' + qs.stringify({ oauth_token: tempTokens.oauth_token })
					var data = { tempTokensObject: tempTokensObject, authenticateUrl:authenticateUrl }
					return f['return'](data);
				}
				else {
					throw new Meteor.Error(error);
				}
			})
	return f.wait();
}


// 2. store temp token
function storeTempToken(temp_data, userId){
	Meteor.users.update({ _id: userId }, { $set: {'profile.goodreads.tempData': temp_data} })
}

// 3 retirve temptokens
function retrieveTempTokens(userId) {
	var tempData = Meteor.users.findOne(userId).profile.goodreads.tempData;
	return tempData;
}

// 4 exchange temp tokens for access tokens
function exchangeTempTokenForPermTokens(temp_data){
	console.log(temp_data)
	console.log("IS TEMP_DATA ABOVE? after the forst one")
	var f = new future()

	var url = 'http://www.goodreads.com/oauth/access_token'

	var oauth = {
		consumer_key: CONSUMER_KEY_GR,
		consumer_secret: CONSUMER_SECRET_GR,
		token: temp_data.oauth_token,
		token_secret: temp_data.oauth_token_secret
	}

	request.post({url:url, oauth:oauth},
		function(error, response, body) {
			if (! error && response.statusCode === 200) {
				var permTokens = querystring.parse(body)
				console.log(permTokens)
				console.log(typeof(permTokens))
				console.log("IN FUNC 4, IS PERM_TOKEN PRINTED ABOVE")
				return f['return'](permTokens);
			}
			else {
				/*throw new Meteor.Error(error)*/
				return f['return'](error);
			}
		})
	return f.wait();
}


// 5. get goodreads userId // also created permData object to store
function getUserGoodreadsId(perm_data){
	console.log(perm_data)
	console.log("IS perm_data ABOVE IM IN FUNC 5")
	var f = new future()
	var url = 'https://www.goodreads.com/api/auth_user'
	var perm_data = perm_data


	var oauth = {
		consumer_key: CONSUMER_KEY_GR,
		consumer_secret: CONSUMER_SECRET_GR,
        token: perm_data.oauth_token,
        token_secret: perm_data.oauth_token_secret
    }

    request.post({url:url, oauth:oauth},
    	function(error, response, body){
    		if (! error && response.statusCode === 200) {

    			var options = {
				    object: true,
				    reversible: false,
				    coerce: true,
				    sanitize: true,
				    trim: true,
				    arrayNotation: false
				}

				var bodyUserIdToJson = parser.toJson(body, options)
				var userIdGR = bodyUserIdToJson.GoodreadsResponse.user.id

				var permDataToStore = {
					token: perm_data.oauth_token,
					token_secret: perm_data.oauth_token_secret,
					userIdGR: userIdGR
				}
				return f['return'](permDataToStore);
    		}
    		else {
    			throw new Meteor.Error(error);
    		}
    	})
    return f.wait();
}


// 6. store temp token
function storePermTokensAndID(permData, userId){
	var f = new future()

	var createdAt = new Date()
	var expires = new Date()
	var numberOfDaysToAdd = 45;
	expires.setDate(expires.getDate() + numberOfDaysToAdd);

	var permDataWithDates = permData
	permDataWithDates.createdAt = createdAt 
	permDataWithDates.expiresOn = expires


	Meteor.users.update({ _id: userId }, { $set: {'profile.goodreads.permData': permDataWithDates} },
		function(error, numAffectedDocs){
			if (! error && numAffectedDocs == 1) {
				return f['return'](permData);
			}
			else {
				throw new Meteor.Error(error);
			}
		})
	return f.wait();
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

	var url = 'https://www.goodreads.com/review/list.xml?v=2' + qs.stringify({ key:CONSUMER_KEY_GR, id:permData.userIdGR })

	request.get({url:url, oauth:oauth}, 
		function(error, response, body) {
			if (! error && response.statusCode === 200) {

				var options = {
					object: true,
					reversible: false,
		            coerce: true,
		            sanitize: true,
		            trim: true,
		            arrayNotation: false
		        }

		        var bookShelveData = parser.toJson(body, options)
		        return f['return'](bookShelveData);
			}
			else {
				throw new Meteor.Error(error);
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
	for ( i = 0; i < len; i++) {
		var isbn13In = bookShelveData.GoodreadsResponse.reviews.review[i].book.isbn13
		var titleIn = bookShelveData.GoodreadsResponse.reviews.review[i].book.title
		var bookPageIn = bookShelveData.GoodreadsResponse.reviews.review[i].book.link

		var isbn13InIsNotNumber = isNaN(isbn13In)
		console.log('isbn13In: ' + isbn13In)
		var typeOf = typeof(isbn13In)
		console.log('typeOf isbn13In: ' + typeOf)
		console.log(isbn13InIsNotNumber + ' isNan ')

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
						var bookDocumentId = Books.findOne({isbn13: isbn13In})._id

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
							if (! error && docId) {
							}
							else {
								throw new Meteor.Error(error)
							}
						});
				}
		}
	} 
	return;
}



function deleteSubscriptions(userId) {
	Books.update({ 'subscribers': userId }, { $pull: {'subscribers': userId} }, { multi: true },
			function(error, numAffectedDocs){
				if (! error) {
					return;
				}
				else {
					throw new Meteor.Error(error);
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
				return;
			}
			else {
				throw new Meteor.Error('func: insertBookRefsAndDateExtracted failed ' + error);
			}
		})

}




