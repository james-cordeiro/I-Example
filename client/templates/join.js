var USER_TYPE = 'user_type_selection'
var ERRORS_JOIN = 'join_errors'
var errorStates = initErrorStates()
reactify()




function reactify() {
    //set up reactivity for form as a whole
    Tracker.autorun(setFormState)

    //set uo reactivity for eachf field
    for (var key in errorStates.keys) {
        Tracker.autorun(setFieldState.bind({}, key))
    }
}


// set up an instance of ReactiveDict suitable
// for initial and future validation
// (for display purposes, fields start *not* in error)
function initErrorStates(){
    var states = new ReactiveDict();
    
    states.set(1, false);
    states.set(2, false);
    states.set(3, false);
    states.set(4, false);
    
    states.allValid = function(){
        for(var key in states.keys){
            if(states.get(key)==true)
                return false;
        }
        return true;
    }
    return states;
}

//function for individual field
function setFieldState(key){
    var inError = errorStates.get(key);
    var methodName = inError ? "addClass" : "removeClass";
    var label = $("[for=input_" + key + "]");
    label[methodName]("error");
}


function setFormState(){
    var style = errorStates.allValid() ? "hidden" : "visible";
    console.log('this is setFormState style: ' + style)
    $("#error-messages").css("visibility", style);
}


// setting errors for any ids lacking a value, or more specific
//its run when user clicks submit
function validateFields(){

    for(var key in errorStates.keys){
        errorStates.set(key, false);
        var answer= $("#input_" + key).val();

        if(!answer){
            errorStates.set(key, true);
        }
    }
    var password = $("#input_4").val();
    if (password.length < 6) {
            errorStates.set(4, true);
        }
}



function validateHandler(event, template) {
    validateFields()

    var errors = {}
    
    var isAllValid = errorStates.allValid()

    var userType = Session.get(USER_TYPE)

    if (userType !== "candidate" && userType !== "company") {
            errors.userType = 'are you a candidate or company?';
        }

        Session.set(ERRORS_JOIN, errors);
        if (_.keys(errors).length) {
            return;
        }
        // all fields are valid and userype is selected
        //then create new account
    if (isAllValid && userType) {
        console.log('is all valid : ' + isAllValid + " is userype : " +  userType)


        var firstName = template.find('#input_1').value,
            lastName = template.find('#input_2').value,
            email = template.find('#input_3').value,
            password = template.find('#input_4').value,
            profile = {
                firstName: firstName,
                lastName: lastName,
                userType: userType
            }

        Accounts.createUser({
            email: email,
            password: password,
            profile: profile
        },
        function(error) {
            if (error) {
                console.log(error.reason)
                var serverError = {error: error.reason}
                Session.set(ERRORS_JOIN, serverError)
            }
            else {
                Router.go('home')
                //ENSURE CANDIDATE CANNOT GO TO COMPANY TEMPLATES VIA THE BROWSER ADDRESS BAR
            }
        });
    } //end  if (isAllValid && userType

}



Template.join.onCreated(function() {
    Session.set(USER_TYPE, "")
});

Template.join.onRendered(function() {
    Tracker.autorun(setFormState)
});



Template.join.helpers({
    userTypeSel: function() {
        return Session.get(USER_TYPE)
    },
    errorJoinMessages: function() {
        if (Session.get(ERRORS_JOIN)) {
            return _.values(Session.get(ERRORS_JOIN));
        }
    }
})


Template.join.events({
	'click button#candidate': function(event, template) {
		$("button#candidate").addClass("active");
		$("button#company").removeClass("active");
        Session.set(USER_TYPE, 'candidate')
        console.log(Session.get(USER_TYPE))
    },
	'click button#company': function(template) {
		$("button#company").addClass("active");
    	$("button#candidate").removeClass("active");
        Session.set(USER_TYPE, 'company')
        console.log(Session.get(USER_TYPE))
    },
    'submit .form-join': _.debounce(function(event, template) {
        event.preventDefault();
        validateHandler(event, template);
    }, 2000, true)
})


