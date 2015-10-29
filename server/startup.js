Meteor.startup(function() {

	process.env.MAIL_URL = 'smtp://postmaster%40mail.inpelo.com:b98dafa5c17651c510a68a35112b5bb3@smtp.mailgun.org:587';
    Accounts.emailTemplates.from = "inpelo@inpelo.com";
    Accounts.emailTemplates.sitename = "Inpelo";


	Accounts.emailTemplates.verifyEmail.subject = function(user) {
		return 'Email Verification';
    };

    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
      return 'Welcome ' + user.profile.name, 'Verify your Inpelo account by clicking this link: ' + url;
    };

    Accounts.emailTemplates.resetPassword.subject = function(user) {
		return 'Reset Password';
    };

    Accounts.emailTemplates.resetPassword.text = function(user, url) {
      return 'Hello ' + user.profile.name, ' Click the url below to reset your password ' + url;
    };

    companyGreetsNotification.start();
    candidateGreetsNotification.start();
});

Accounts.validateLoginAttempt(function(attempt) {
    if (! attempt.allowed) {
        return false;
    }

    if (attempt.allowed) {
        var emailVeri = attempt.user.emails[0].verified
        var accCreated = attempt.user.createdAt
        var currentDate = new Date()
        var passed2days = (currentDate - accCreated) > 172800000


        if (emailVeri) {
            return true;
        }

        if (! emailVeri && !passed2days) {
            return true;
        }

        if (! emailVeri && passed2days) {
            throw new Meteor.Error(403, 'Please verify your Inpelo account by clicking the link sent to your email address')
        }
    }
});




Accounts.config({
	sendVerificationEmail: true,
	forbidClientAccountCreation: false,
	loginExpirationInDays: null
});
/*cronTime: '0 9 * * 2,3,6 ',*/
var companyGreetsNotification = new CronJob({
    cronTime: '0 0 9 * * 1,3,5',
    onTick: Meteor.bindEnvironment(function() {
        var companyIds = []
        var greetIds = []
        Greets.find({'handShake': false, 'closed': false, 'company_notified': false}).forEach(function(doc) {

            if (doc.company_id !== doc.createdBy) {
                companyIds.push(doc.company_id)
                greetIds.push(doc._id)
            }
        });
            Greets.update({ '_id': { $in: greetIds } },
            { $set: { 'company_notified': true } },
            { multi: true },
            function(error, numOfDocsAffected) {
                if (error) {
                    console.log(error)
                }
            });
        var uniqueIds = _.uniq(companyIds)
        console.log(uniqueIds)

        var emailsArr = []
        var i
        var len = uniqueIds.length

        for ( i = 0; i < len; i++) {
            console.log('you have reached the for loop')
            var userId = uniqueIds[i]
            var user = Meteor.users.findOne({'_id': userId}, {'emails': 1, 'profile.notifications': 1})
            var email = user.emails[0].address
            console.log(email)
            var consent = user.profile.notifications.greets

            if (email && consent === true) {
                emailsArr.push(email)
            }
        }

        var z
        var emailsLen = emailsArr.length
        console.log('email length is :' + emailsLen)

        for ( z = 0; z < emailsLen; z++) {
            var to = emailsArr[z]

            Email.send({
                to: to,
                from: 'inpelo@inpelo.com',
                subject: 'new greet(s) recieved',
                text: 'You have recieved greets. Sign into https://www.inpelo.com/login and respond accordingly.Thank you'
            });
        }
    }),
    start: false,
    timeZone: "Europe/London"
});


// candidate recieves email notification when company 'handShakes' and scope not completed
var candidateGreetsNotification = new CronJob({
    cronTime: '0 0 11 * * 1,3,5,6',
    onTick: Meteor.bindEnvironment(function() {
        var candidateIds = []
        var greetIds = []
        Greets.find({ 'handShake': true, 'closed': false, 'scopeCompleted': false, 'candidate_notified': false }).forEach(function(doc) {

            if (doc.candidate_id === doc.createdBy) {
                candidateIds.push(doc.candidate_id)
                greetIds.push(doc._id)
            }
        });

            Greets.update({
                '_id': { $in: greetIds }
            }, {
                $set: { 'candidate_notified': true }
            }, { multi: true },
            function(error, numOfDocsAffected) {
                if (error) {
                    console.log(error)
                }
            });

        var uniqueIds = _.uniq(candidateIds)
        var emailsArr = []
        var i
        var len = uniqueIds.length

        for (i = 0; i < len; i++) {
            var userId = uniqueIds[i]
            var user = Meteor.users.findOne({'_id': userId}, {'emails': 1, 'profile.notifications': 1})
            var email = user.emails[0].address;
            console.log(email)
            var consent = user.profile.notifications.greets

            if (email && consent === true) {
                emailsArr.push(email)
            }
        }
        var z
        var emailsLen = emailsArr.length

        for (z = 0; z < emailsLen; z++) {
            var to = emailsArr[z]
            Email.send({
                to: to,
                from: 'inpelo@inpelo.com',
                subject: 'new handshake(s) recieved',
                text: 'You have recieved a handShake. Sign into https://www.inpelo.com/login and view the scope and text directly to the person who posted the job.Thank you'
            });
        }
    }),
    start: false,
    timeZone: "Europe/London"
});



