Template.profilePageCompany.events({
    'click #editCompanyProfile': function(event) {
        Router.go('profileCompanyEdit')
    }
})

Template.profilePageCompany.onCreated(function(){
  this.subscribe("company-jobs-created");
})

Template.profilePageCompany.helpers({
	userJobsCreated: function() {
		return Jobs.find({ 'company_id': Meteor.userId() });
	}
})

