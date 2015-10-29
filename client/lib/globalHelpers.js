Template.registerHelper('formatTimeAgo', function(context, options) {
  if(context)
    return moment(context).fromNow(options);
});

Template.registerHelper('formatMonth', function(month, option) {
  if(month >= 1 && month <= 12 && Number(month)) {
  	return moment(month, "MM").format("MMM");
  }
  else if (!month && !Number(month) && option === false) {
  	return ;
  }
  else if (!month && !Number(month)) {
  	return 'present';
  }
});

Template.registerHelper('contractTerms', function(value){
	if(value === 'sustained') {
		return 'per anum';
	}
	else if(value === 'fixed') {
		return 'pro rata';
	}
})


Template.registerHelper('whoClosed', function(closedByVal) {
	if ( closedByVal === Meteor.userId() ) {
		return 'by you';
	}
})

Template.registerHelper('msToDuration', function(responseRateMSArr) {
	if (responseRateMSArr) {
		var sum = _.reduce(responseRateMSArr, function(memo, num){
		 return memo + num; 
		}, 0);
		// divied by number of elemnst in array
		var avg = (sum / responseRateMSArr.length)
		return moment.duration(avg).humanize();
	}
	else {
		return;
	}
	
})

Template.registerHelper('reverseArrOrder', function(array) {
	if (array) {
		return array.reverse();
	}
	else {
		return;
	}
})

Template.registerHelper('attenBackground', function(op1, op2, op3) {

	if (op1) {
		return 'inpelo-dark-background'
	}
	
	//if not closed, handhaked, scopeCompleted
	//if not closed, handhaked, scopeCompleted
	else if (!op1 && op2 && op3) {
		return 'inpelo-success-background';
	}

})


