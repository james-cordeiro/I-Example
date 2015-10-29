var EDUCATIONS = 'educations_array'

Template.educationsEdit.onCreated(function() {
	var educationsArray = Meteor.user().profile.myProfile.educations

	if (educationsArray) {
		Session.setPersistent(EDUCATIONS, educationsArray)
	}
	else {
		var eduArray = []
			eduArray.push({
				id: Random.id([6]),
				institute: "",
				scopeOfStudy: "",
				yearStart: "",
				yearEnd: "",
				summary: []
			})
			Session.setPersistent(EDUCATIONS, eduArray)	
	}
	
})

Template.educationsEdit.onDestroyed(function() {
	saveEducations()
})

Template.educationsEdit.helpers({
	educations: function() {
		return Session.get(EDUCATIONS);
	},
	parentHelper: function(parentContext) {
		return parentContext.id;
	}
})

Template.educationsEdit.events({
	'click .addEducation': function() {
		var educationsArr = Session.get(EDUCATIONS)

		educationsArr.push({
			id: Random.id([6]),
			institute: "",
			scopeOfStudy: "",
			yearStart: "",
			yearEnd: "",
			summary: []
		})

		Session.setPersistent(EDUCATIONS, educationsArr)
	},
	'click .saveEducations': function(event) {
		event.preventDefault()
		console.log('you clicked saveEducations')
		saveEducations()



	},
	'keyup .yearStart, keyup .yearEnd': _.throttle(function(event) {
		event.preventDefault()
		var objId = this.id
		var data = event.target.value
		var field = event.target.name
		var educationsArr = Session.get(EDUCATIONS)
		var i
		var len = educationsArr.length

		for (i = 0;  i < len; i++) {
			if (educationsArr[i].id === objId) {
				console.log('id matched')
				educationsArr[i][field] = data;
				break;
			}
		}
		Session.setPersistent(EDUCATIONS, educationsArr)
	},1000),
	'keyup .institute, keyup .scopeOfStudy': _.throttle(function(event) {
		event.preventDefault();
		var objId = this.id
		var data = event.target.value
		var field = event.target.name
		var educationsArray = Session.get(EDUCATIONS)
		var i
		var len = educationsArray.length

		for (i = 0;  i < len; i++) {

			if (educationsArray[i].id === objId) {
				console.log('id matched')
				educationsArray[i][field] = data;
				break;
			}
		}
		Session.setPersistent(EDUCATIONS, educationsArray)

	}, 1000),
	'keydown .summary': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
			var objId = this.id
			var data = event.target.value
			var field = event.target.name

            if (data) {
            	var educationsArr = Session.get(EDUCATIONS)

            	var i
            	var len = educationsArr.length

            	for (i = 0;  i < len; i++) {

            		if (educationsArr[i].id === objId) {
            			educationsArr[i][field].push({ value: data })
            			break;
            		}
            	}
            	event.currentTarget.value = "";

                Session.setPersistent(EDUCATIONS, educationsArr)
            }
        }
    },
    'click a.removeSummaryItem': function(event) {
    	event.preventDefault();
    	var summaryVal = this.value
    	var objId = $(event.currentTarget).data('objid')
    	var field = event.currentTarget.name
    	var educationsArr = Session.get(EDUCATIONS)
    	var i
    	var z
    	var educationsLen = educationsArr.length

    	for (i = 0;  i < educationsLen; i++) {
    		if (educationsArr[i].id === objId) {
    			educationsArr[i][field] = _.without(educationsArr[i][field], _.findWhere(educationsArr[i][field], { value: summaryVal }));
    		}
    	}
    	Session.setPersistent(EDUCATIONS, educationsArr)
    }
})



function saveEducations() {
	var educationsArray = Session.get(EDUCATIONS)
	var i
	var len = educationsArray.length
	var cleanedEduArr = []

	for (i = 0; i < len; i++) {
		var institute = educationsArray[i].institute,
		summary = educationsArray[i].summary,
		yearStart = educationsArray[i].yearStart,
		yearEnd = educationsArray[i].yearEnd

		if (institute == false && summary == false && yearStart == false && yearEnd == false) {

		}
		else {
			cleanedEduArr.push(educationsArray[i])
		}
	}



	Meteor.call('updateEducations', cleanedEduArr,
		function(error, result) {
			if (! error) {
				Router.go('profilePageCandidate')
			}
		});
}