Router.onBeforeAction(function(){
    if ( Meteor.loggingIn() ) {
        this.render('genLoading');
    }
    else {
        this.next();
    }
});


Router.configure({
    layoutTemplate: 'parent'
});
//does not have to be logged in
Router.route('/', function () {
    this.render('home');
    }, {
        name: 'home'
});


Router.route('/companyView/:company_id', {
  // this template will be rendered until the subscriptions are ready
  loadingTemplate: 'genLoading',
  name: 'companyView',

  waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe("single-company", this.params.company_id);
  },

  action: function () {
    if (this.ready()) {
        this.render('companyView', {data: {company: Meteor.users.findOne({_id: this.params.company_id})}});
    }
  }
});


//does not have to be logged in
Router.route('/join/', function () {
    this.render('join');
    }, {
    name: 'join'
});
//does not have to be logged in
Router.route('/login/', function () {
  this.render('login');
    }, {
    name: 'login'
});

//does not have to be logged in
Router.route('/resetPassword', function () {
  this.render('passwordReset');
    }, {
    name: 'passwordReset'
});

Router.route('/resetPassword/emailSent', function () {
  this.render('passwordEmailSent');
    }, {
    name: 'passwordEmailSent'
});

Router.route('/feedback', function () {
    this.render('feedback');
    }, {
    name: 'feedback'
});


/*CANDIDATE*/
Router.route('/candidate/myProfile/', function () {
  this.render('profilePageCandidate');
    }, {
    name: 'profilePageCandidate'
});


Router.route('/candidate/myProfile/personalEdit', {
    name: 'personalEdit',
    onBeforeAction: function () {
        if (Meteor.user() && Meteor.user().profile) {
            this.next()
        }
    // return one handle, a function, or an array
  },

  action: function () {
    if (this.ready()) {
        this.render('personalEdit');
    }
    else {
      this.render('genLoading')
    }
  }
});


Router.route('/candidate/myProfile/positionsEdit', {
    name: 'positionsEdit',
    onBeforeAction: function () {
        if (Meteor.user() && Meteor.user().profile.myProfile.positions) {
            this.next()
        }
    // return one handle, a function, or an array
  },

  action: function () {
    if (this.ready()) {
        this.render('positionsEdit');
    }
    else {
      this.render('genLoading')
    }
  }
});


Router.route('/candidate/myProfile/educationsEdit', {
    name: 'educationsEdit',
    onBeforeAction: function () {
        if (Meteor.user() && Meteor.user().profile.myProfile.educations) {
            this.next()
          }
  },
  action: function () {
    if (this.ready()) {
        this.render('educationsEdit');
    }
  }
});


Router.route('/candidate/myProfile/languagesEdit', {
    name: 'languagesEdit',
    onBeforeAction: function () {

        if (Meteor.user() && Meteor.user().profile.myProfile.languages) {
            this.next()
        }
  },
  action: function () {
    if (this.ready()) {
        this.render('languagesEdit');
    }
  }
});

Router.route('/candidate/myProfile/booksEdit', function () {
  this.render('booksEdit');
    }, {
    name: 'booksEdit'
});

Router.route('/goodreadsLoading/', function () {
  this.render('goodreadsLoading');
    }, {
    name: 'goodreadsLoading',
    data: function() {
        var authorize = this.params.query.authorize
        Session.set('recievedParam1', authorize)

        var paramVal = Session.get('recievedParam1');

        if ( paramVal === '1') {
          setTimeout(callGoodreadsPartTwo, 9000)
        }
    }
});

Router.route('/candidate/interests/', function () {
  this.render('interestsPageCandidate');
    }, {
    name: 'interestsPageCandidate'
}); 


function callGoodreadsPartTwo() {
  Meteor.call('goodreadsPartTwo', function(error) {
    if(error) {
        console.log(error)
    }
    else {
        Router.go('profilePageCandidate')
    }
})
}


/**************** company ****************/

Router.route('/company/ourProfile/', function () {
  this.render('profilePageCompany');
    }, {
    name: 'profilePageCompany'
});

Router.route('/company/ourProfile/edit', function () {
  this.render('profileCompanyEdit');
    }, {
    name: 'profileCompanyEdit'
});


Router.route('/company/createJob/', {
    name: 'createJob',
    onBeforeAction: function() {
        var user = Meteor.user()
        var userCompany = Meteor.user().profile.company
        
        if (user && userCompany.name && userCompany.description && userCompany.location.countryName && userCompany.location.countryCode && userCompany.location.city && userCompany.location.street) {
            this.next()
        }
        else {
          this.render('profileCompleteReqCompany');
        }
    },
    action: function () {
    if (this.ready()) {
        this.render('createJob');
    }
    else {
      this.render('genLoading')
    }
  }
});


Router.route('/company/interests/', function () {
  this.render('interestsPageCompany');
    }, {
    name: 'interestsPageCompany'
});

/**************** masterAdmin ****************/

Router.route('/masterAdmin/feedbackRecieved/', function () {
  this.render('feedbackRecieved');
    }, {
    name: 'feedbackRecieved'
});

Router.route('/masterAdmin/userProfiles/', function () {
  this.render('userProfiles');
    }, {
    name: 'userProfiles'
});