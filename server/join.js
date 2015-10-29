Accounts.onCreateUser(function(options, user){
	var userId = user._id
	var userType = options.profile.userType
	var newEmail = user.emails[0].address
	var validEamilTest = validateEmail(newEmail)
	var emailAlreadyExist = Meteor.users.find({"emails.address": newEmail}, {limit: 1}).count()>0

	if (! validEamilTest) {
		throw new Meteor.Error(403, "email address in invalid");
	}

	if(emailAlreadyExist === true) {
		throw new Meteor.Error(403, "email is already registered with Inpelo");
	}

	if(! userType) {
		throw new Meteor.Error(403, "please select company or candidate as a user");
	}

	if (userType === 'company'){

		profile = options.profile

		profile.company = {
			name: "",
			description: "",
			location: {
	    		'countryName': "",
	    		'countryCode': "",
	    		'street': "",
	    		'city': ""
	    	}
		}

		profile.notifications = {
			greets: true
		}

		profile.stats = {
			responseRateMS: []
		}

		user.profile = profile

		return user;
	}

	if (options.profile.userType === 'candidate') {

		profile = options.profile

	    profile.myProfile = {
	    	positions: [],
	    	educations: [],
	    	publications: [],
	    	languages: [],
	    	location: {
	    		'countryName': "",
	    		'countryCode': "",
	    		'city': ""
	    	},
	    	insights: []
	    }

	    profile.goodreads = {
	    	extracted: false,
	    	autoRenew: true,
	    	extractedDate: ' ',
	    	futureExtractionDate: ' ',
	    	permData: {
	    		createdAt: ' ',
	    		expiresOn: ' '
	    	}
	    }

	    profile.notifications = {
			greets: true
		}

		user.profile = profile

		return user;
	}

})


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}



