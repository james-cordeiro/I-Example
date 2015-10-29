var POSITIONS = 'positiona_array'

Template.positionsEdit.onCreated(function() {
	var positionsArray = Meteor.user().profile.myProfile.positions

	if (positionsArray) {
		Session.setPersistent(POSITIONS, positionsArray)
	}
	else {
		var positionsArr = []
		positionsArr.push({
			id: Random.id([6]),
			company: "",
			company_id: "",
			dateStart: {
				month: "",
				year: ""
			},
			dateEnd: {
				month: "",
				year: ""
			},
			sector: "",
			title: "",
			summary: [],
			tags: []
		})
		Session.setPersistent(POSITIONS, positionsArr)

	}
})


Template.positionsEdit.onDestroyed(function() {
	updatePositions()
})


Template.positionsEdit.helpers({
	positions: function() {
		return Session.get(POSITIONS);
	},
	parentHelper: function(parentContext) {
		return parentContext.id;
	}
})

Template.positionsEdit.events({
	'click .addPosition': function() {
		var positionsArr = Session.get(POSITIONS)
		positionsArr.push({
			id: Random.id([6]),
			company: "",
			company_id: "",
			dateStart: {
				month: "",
				year: ""
			},
			dateEnd: {
				month: "",
				year: ""
			},
			sector: "",
			title: "",
			summary: [],
			tags: []
		});

		Session.setPersistent(POSITIONS, positionsArr);
	},
	'click .savePositions': function(event) {
		event.preventDefault()
		console.log('you clicked savePositions')
		updatePositions();

	},
	'keyup .startMonth, keyup .startYear': _.throttle(function(event) {
		event.preventDefault()
		var objId = this.id
		var data = event.target.value
		var field = event.target.name
		var positionsArr = Session.get(POSITIONS)
		var i
		var len = positionsArr.length

		for (i = 0;  i < len; i++) {
			if (positionsArr[i].id === objId) {
				console.log('id matched')
				positionsArr[i]['dateStart'][field] = data;
				break;
			}
		}
		Session.setPersistent(POSITIONS, positionsArr)
	},1000),
	'keyup .endMonth, keyup .endYear': _.throttle(function(event) {
		event.preventDefault();
		var objId = this.id
		var data = event.target.value
		var field = event.target.name
		var positionsArr = Session.get(POSITIONS)
		var i
		var len = positionsArr.length

		for (i = 0;  i < len; i++) {
			if (positionsArr[i].id === objId) {
				positionsArr[i]['dateEnd'][field] = data;
				break;
			}
		}
		Session.setPersistent(POSITIONS, positionsArr)
	},1000),
	'keyup .tags': function(event) {
        event.preventDefault()
        var text = event.currentTarget.value
        $('.tags').val(text.replace(/[^A-Za-z0-9-]/g,''));
    },///here
    'keydown .tags': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
            var text = event.target.value
            var positionsArray = Session.get(POSITIONS)
            var objId = this.id
            var i
            var posLength = positionsArray.length

            if (text) {
            	for (i = 0; i < posLength; i++) {

            		if (positionsArray[i].id === objId) {
            			var tagsArr = positionsArray[i]['tags'];
            			var tagsArrLength = tagsArr.length

            			if (tagsArrLength <= 4) {
            				positionsArray[i]['tags'].push({ value : text})
            				Session.setPersistent(POSITIONS, positionsArray );
            				event.currentTarget.value = "";
            				break;
            			}
            			else if (tagsArrLength > 4) {
            				event.currentTarget.value = "";
            			}
            		}

            	}
            }
        }
    },
    'click .removeTag': function(event) {
        event.preventDefault();
        var text = this.value
        console.log(text)
        var positionsArray = Session.get(POSITIONS)
        var objId = $(event.currentTarget).data('objid')
        var i
        var posLength = positionsArray.length

        for (i = 0; i < posLength; i++) {
        	if (positionsArray[i].id === objId) {

        		console.log('matched pos array')
        		positionsArray[i]['tags'] = _.without(positionsArray[i]['tags'], _.findWhere(positionsArray[i]['tags'], { value: text }));
        		break;
        	}	
        }
        Session.setPersistent(POSITIONS, positionsArray);
    },
	'keyup .title, keyup .company, change .sector': _.throttle(function(event) {
		event.preventDefault();
		var objId = this.id
		var data = event.target.value
		var field = event.target.name
		var positionsArr = Session.get(POSITIONS)
		var i
		var len = positionsArr.length

		for (i = 0;  i < len; i++) {

			if (positionsArr[i].id === objId) {
				positionsArr[i][field] = data;
				break;
			}
		}
		Session.setPersistent(POSITIONS, positionsArr)

	}, 1000),
	'keydown .summary': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
			var objId = this.id
			console.log(objId)
			var text = event.target.value

            if (text) {
            	var positionsArr = Session.get(POSITIONS)

            	var i
            	var len = positionsArr.length

            	for (i = 0;  i < len; i++) {

            		if (positionsArr[i].id === objId) {
            			positionsArr[i]['summary'].push({value: text})
            			break;
            		}
            	}
            	event.currentTarget.value = "";

                Session.setPersistent(POSITIONS, positionsArr)
            }
        }
    },
    'click .removeSummaryItem': function(event) {
    	event.preventDefault();
    	var text = this.value
    	var objId = $(event.currentTarget).data('objid')
    	var positionsArr = Session.get(POSITIONS)
    	var i
    	var posLen = positionsArr.length

    	for (i = 0;  i < posLen; i++) {
    		if (positionsArr[i].id === objId) {
    			//2.
    			positionsArr[i]['summary'] = _.without(positionsArr[i]['summary'], _.findWhere(positionsArr[i]['summary'], { value: text }));
    		}
    	}
    	Session.setPersistent(POSITIONS, positionsArr);
    }
})


function updatePositions() {
	var positionsArray = Session.get(POSITIONS)
	var i
	var len = positionsArray.length
	var cleanedPosArr = []

	for (i = 0; i < len; i++) {
		var company = positionsArray[i].company,
		title = positionsArray[i].title,
		dateStartMonth = positionsArray[i].dateStart.month,
		dateStartYear = positionsArray[i].dateStart.year,
		dateEndMonth = positionsArray[i].dateEnd.month,
		dateEndYear = positionsArray[i].dateEnd.year,
		sector = positionsArray[i].sector,
		summary = positionsArray[i].summary,
		tags = positionsArray[i].tags

		if (company == false && title == false && dateStartMonth == false && dateStartYear == false && dateEndMonth == false && dateEndYear == false && sector == false && summary == false && tags == false) {
		}
		else {
			cleanedPosArr.push(positionsArray[i]);
		}
	}
	Meteor.call('updatePositions', cleanedPosArr,
		function(error, result) {
			if (!error) {
				Router.go('profilePageCandidate')
			}
		});
}
