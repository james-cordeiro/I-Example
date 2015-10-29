var ERRORS_POST = 'create-job-errors'

var TITLE = 'title_jc'
var SECTOR = 'sector_jc'
var PURPOSE = 'purpose_jc'
var SKILLSNREQ = 'skillsNreq_jc'
var TAGS = 'tags_jc'
var LANGUAGES = 'languages_jc'
var CURRENCY = "currency_jc"
var AMOUNT = "amount_jc"
var LOCATION = "location_jc"
var CONTRACT_TERM = "contract_term_jc"

var SCOPE_ARRAY = 'scope';


Template.createJobPost.onCreated(function(){
    Session.set(ERRORS_POST, {});
})


Template.createJobPost.helpers({
    title: function(){
        return Session.get(TITLE);
    },
    sector: function() {
        return Session.get(SECTOR);
    },
    purpose: function() {
            return Session.get(PURPOSE);
    },
    skillsAndReq: function() {
            return Session.get(SKILLSNREQ)
    },
    tags: function() {
            return Session.get(TAGS)
    },
    languages: function() {
        return Session.get(LANGUAGES);
    },
    currency: function() {
        return Session.get(CURRENCY);
    },
    amount: function() {
        return Session.get(AMOUNT);
    },
    location: function() {
        var locIsComAddress = Session.get(LOCATION)
        if (locIsComAddress === false) {
            return 'remotely';
        }
        if (locIsComAddress === true ) {
            return 'company address';
        }
    },
    contract_term: function() {
        return Session.get(CONTRACT_TERM);
    },
    errorJobPostMessages: function() {
        return _.values(Session.get(ERRORS_POST));
    }
})


Template.createJobPost.events({
    'keydown textarea': function(event) {
        if (27 === event.which) {
            event.preventDefault();
            event.target.blur()
        }
    },
    'keydown .title, keydown select': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
            event.target.blur()
        }
    },
    'keydown .purpose': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
            var string = event.target.value;

            if (string) {

                var purposeArr = Session.get(PURPOSE)
                console.log('purposeAr is : ' + purposeArr)

                if (! purposeArr) {
                    var purpArray = [];
                    purpArray.push({value: string});
                    Session.setPersistent(PURPOSE, purpArray);
                    console.log(purpArray);
                }
                else {
                    purposeArr.push({value: string});
                    Session.setPersistent(PURPOSE, purposeArr);
                }
                event.currentTarget.value = "";
            }
        }
    },
    'click .removePurposeItem': function() {
        var purposeVal = this.value;
        var purposeArray = Session.get(PURPOSE)
        console.log(purposeVal)

        var newPurposeArr = _.without(purposeArray, _.findWhere(purposeArray, { value: purposeVal }))

        Session.setPersistent(PURPOSE, newPurposeArr);

    },
	'keydown .skillsAndReq': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
            var string = event.target.value;

            if (string) {
                var sNrSessionArr = Session.get(SKILLSNREQ)

                if (! sNrSessionArr) {
                    var sNrArray = []
                    sNrArray.push({ value: string })
                    Session.setPersistent(SKILLSNREQ, sNrArray)
                }
                else {
                        sNrSessionArr.push({ value: string })
                        Session.setPersistent(SKILLSNREQ, sNrSessionArr)
                }
                event.currentTarget.value = "";
            }
        }
    },
    'click .removeSkillnReq': function() {
        var skillVal = this.value;
        var skillsNreqArr = Session.get(SKILLSNREQ)

        var newSnRArr = _.without(skillsNreqArr, _.findWhere(skillsNreqArr, { value: skillVal }))

        Session.setPersistent(SKILLSNREQ, newSnRArr);

    },
    'keyup .tags': function(event) {
        event.preventDefault()
        var text = event.currentTarget.value
        $('.tags').val(text.replace(/[^A-Za-z0-9-]/g,''));
        //tags
    },
    'keydown .tags': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
            var string = event.target.value;

            if (string) {

                var tagsSession = Session.get(TAGS)

                if (! tagsSession) {
                    var tagsArr = []
                    /*tagsArr.push({value: string})*/
                    tagsArr.push({ value: string })
                    Session.setPersistent(TAGS, tagsArr)
                }
                else if ( tagsSession.length <= 4) {
                        tagsSession.push({ value: string })
                        Session.setPersistent(TAGS, tagsSession)
                        console.log(Session.get(TAGS))
                }
                event.currentTarget.value = "";
            }
        }
    },
    'click .removeTag': function(event) {
        event.preventDefault()
        var tagVal = this.value
        var tagsInSession = Session.get(TAGS)
        var tagsInSessionUPDT = _.without(tagsInSession, _.findWhere(tagsInSession, { value: tagVal }))
        Session.setPersistent(TAGS, tagsInSessionUPDT);

    },
    'click .companyAddress': function(){
        $("button.companyAddress").addClass("active");
        $("button.remotely").removeClass("active");
        Session.setPersistent(LOCATION, true)
    },
    'click .remotely': function(){
        $("button.remotely").addClass("active");
        $("button.companyAddress").removeClass("active");
        Session.setPersistent(LOCATION, false)
    },
    'click .fixed': function(){
        $("button.fixed").addClass("active");
        $("button.sustained").removeClass("active");
        Session.setPersistent(CONTRACT_TERM, 'fixed')
    },
    'click .sustained': function(){
        $("button.sustained").addClass("active");
        $("button.fixed").removeClass("active");
        Session.setPersistent(CONTRACT_TERM, 'sustained')
    },
    'click a i.deleteLanguage': function(event){
        event.preventDefault();
        var languageToRemove = this.name
        var languagesArr = Session.get(LANGUAGES)

        var newLanguagesArr = _.reject(languagesArr, function(el) {
            return el.name === languageToRemove; })

        Session.setPersistent(LANGUAGES, newLanguagesArr);
    },
    'keyup .title[type=text]': _.throttle(function(event) {
        event.preventDefault();
        var title = event.currentTarget.value;
        console.log(title)
        Session.setPersistent(TITLE, title);
    }, 4000, {leading: false}),
    'change .sector': function(event) {
        event.preventDefault();
        var sector = event.currentTarget.value;
        console.log(sector)
        Session.setPersistent(SECTOR, sector);
    },
    //amount value Session update
    'keyup .amount': _.throttle(function(event) {
        event.preventDefault();
        var amount = event.currentTarget.value;
        var result = checkInputisNumber(amount);

        if (result === true) {
            Session.setPersistent(AMOUNT, amount);
        }
        else {
            alert("Must input numbers");
            event.currentTarget.value = " "
        }
    }, 500),
    'blur .amount': function(event) {
        event.preventDefault();
        event.currentTarget.value = "";
    },
    // inserting job into collection
    'click #submitJobPost': _.debounce(function(event){
        event.preventDefault()

        var errors = {},
        title = Session.get(TITLE),
        sector = Session.get(SECTOR),
        purpose = Session.get(PURPOSE),
        skillsAndReq = Session.get(SKILLSNREQ),
        tags = Session.get(TAGS),
        languages = Session.get(LANGUAGES),
        currency = Session.get(CURRENCY),
        amount = Session.get(AMOUNT),
        location = Session.get(LOCATION),
        contractTerm = Session.get(CONTRACT_TERM),
        entireScope = Session.get(SCOPE_ARRAY)

        console.log('languagesAr is: ' + languages)

        if (! title) {
            errors.title = 'what is the title of this position?';
        }

        if (! sector) {
            errors.title = 'which sector is this position in?';
        }

        if (! purpose ) {
            errors.purpose = 'List the purpose of this job?';
        }

        if (! skillsAndReq) {
            errors.skillsAndReq = 'List at least one skill set required for this position';
        }

        if (! tags) {
            errors.tags = 'include at least one tag';
        }

        if (! languages) {
            errors.languages = 'List at least one main spoken language required for this role';
            console.log('no lang selected')
        }

        if (typeof(currency) === 'undefined') {
            errors.currencyCode = 'which currency are you paying in?';
        }

        if (isNaN(amount)) {
            errors.amount = 'specify the salary amount';
        }

        if (typeof(location) === 'undefined' || typeof(location) === null) {
            errors.location = 'specify place of work';
        }

        if (typeof(contractTerm) === 'undefined') {
            errors.contract_term = "Is the contractd 'fixed' or 'sustained' ?"
        }

        if (! entireScope) {
            errors.entire_scope = "Create a 'scope' to guage detailed information about the candidate"
        }

        Session.set(ERRORS_POST, errors);
        if (_.keys(errors).length) {
            return;
        }

        var i
        var len = entireScope.length
        var entireScopeClean = []

        for (i = 0; i < len; i++) {
            if (entireScope[i].text) {
                entireScopeClean.push(entireScope[i])
            }
        }

        var jobDoc = {
            title: title,
            sector: sector,
            purpose: purpose,
            tags: tags,
            skillsAndReq: skillsAndReq,
            languages: languages,
            currency: currency,
            amount: amount,
            locIsComAddress: location,
            contractTerm: contractTerm,
            scope: entireScopeClean
        }

        Meteor.call('createJobPost', jobDoc, function(error, result) {
            if (! error) {
                Session.clearPersistent();
                Router.go('profilePageCompany')
                console.log('job created!!')
            }
            else {
                console.log(error)
            }
        })
    },5000, true)

})

//function to check if input is a number
function checkInputisNumber(value) {
  if (isNaN(value)) {
    return false;
    }
    else {
        console.log(value + " is a number")
        return true
    }
}


Template.createJob.onRendered(function(){
    //var new currency
var currencies = [
    { value: 'Afghan afghani', data: 'AFN' },
    { value: 'Albanian lek', data: 'ALL' },
    { value: 'Algerian dinar', data: 'DZD' },
    { value: 'European euro', data: 'EUR' },
    { value: 'Angolan kwanza', data: 'AOA' },
    { value: 'East Caribbean dollar', data: 'XCD' },
    { value: 'Argentine peso', data: 'ARS' },
    { value: 'Armenian dram', data: 'AMD' },
    { value: 'Aruban florin', data: 'AWG' },
    { value: 'Australian dollar', data: 'AUD' },
    { value: 'Azerbaijani manat', data: 'AZN' },
    { value: 'Bahamian dollar', data: 'BSD' },
    { value: 'Bahraini dinar', data: 'BHD' },
    { value: 'Bangladeshi taka', data: 'BDT' },
    { value: 'Barbadian dollar', data: 'BBD' },
    { value: 'Belarusian ruble', data: 'BYR' },
    { value: 'Belize dollar', data: 'BZD' },
    { value: 'West African CFA franc', data: 'XOF' },
    { value: 'Bhutanese ngultrum', data: 'BTN' },
    { value: 'Bolivian boliviano', data: 'BOB' },
    { value: 'Bosnia-Herzegovina konvertibilna marka', data: 'BAM' },
    { value: 'Botswana pula', data: 'BWP' },
    { value: 'Brazilian real', data: 'BRL' },
    { value: 'Brunei dollar', data: 'BND' },
    { value: 'Bulgarian lev', data: 'BGN' },
    { value: 'Burundi franc', data: 'BIF' },
    { value: 'Cambodian riel', data: 'KHR' },
    { value: 'Central African CFA franc', data: 'XAF' },
    { value: 'Canadian dollar', data: 'CAD' },
    { value: 'Cape Verdean escudo', data: 'CVE' },
    { value: 'Cayman Islands dollar', data: 'KYD' },
    { value: 'Chilean peso', data: 'CLP' },
    { value: 'Chinese renminbi', data: 'CNY' },
    { value: 'Colombian peso', data: 'COP' },
    { value: 'Comorian franc', data: 'KMF' },
    { value: 'Congolese franc', data: 'CDF' },
    { value: 'Costa Rican colon', data: 'CRC' },
    { value: 'Croatian kuna', data: 'HRK' },
    { value: 'Cuban peso', data: 'CUC' },
    { value: 'Czech koruna', data: 'CZK' },
    { value: 'Danish krone', data: 'DKK' },
    { value: 'Djiboutian franc', data: 'DJF' },
    { value: 'Dominican peso', data: 'DOP' },
    { value: 'Egyptian pound', data: 'EGP' },
    { value: 'Central African CFA franc', data: 'GQE' },
    { value: 'Eritrean nakfa', data: 'ERN' },
    { value: 'Estonian kroon', data: 'EEK' },
    { value: 'Ethiopian birr', data: 'ETB' },
    { value: 'Falkland Islands pound', data: 'FKP' },
    { value: 'Fijian dollar', data: 'FJD' },
    { value: 'CFP franc', data: 'XPF' },
    { value: 'Gambian dalasi', data: 'GMD' },
    { value: 'Georgian lari', data: 'GEL' },
    { value: 'Ghanaian cedi', data: 'GHS' },
    { value: 'Gibraltar pound', data: 'GIP' },
    { value: 'Guatemalan quetzal', data: 'GTQ' },
    { value: 'Guinean franc', data: 'GNF' },
    { value: 'Guyanese dollar', data: 'GYD' },
    { value: 'Haitian gourde', data: 'HTG' },
    { value: 'Honduran lempira', data: 'HNL' },
    { value: 'Hong Kong dollar', data: 'HKD' },
    { value: 'Hungarian forint', data: 'HUF' },
    { value: 'Icelandic krona', data: 'ISK' },
    { value: 'Indian rupee', data: 'INR' },
    { value: 'Indonesian rupiah', data: 'IDR' },
    { value: 'Iranian rial', data: 'IRR' },
    { value: 'Iraqi dinar', data: 'IQD' },
    { value: 'Israeli new sheqel', data: 'ILS' },
    { value: 'Jamaican dollar', data: 'JMD' },
    { value: 'Japanese yen', data: 'JPY' },
    { value: 'Jordanian dinar', data: 'JOD' },
    { value: 'Kazakhstani tenge', data: 'KZT' },
    { value: 'Kenyan shilling', data: 'KES' },
    { value: 'North Korean won', data: 'KPW' },
    { value: 'South Korean won', data: 'KRW' },
    { value: 'Kuwaiti dinar', data: 'KWD' },
    { value: 'Kyrgyzstani som', data: 'KGS' },
    { value: 'Lao kip', data: 'LAK' },
    { value: 'Latvian lats', data: 'LVL' },
    { value: 'Lebanese lira', data: 'LBP' },
    { value: 'Lesotho loti', data: 'LSL' },
    { value: 'Liberian dollar', data: 'LRD' },
    { value: 'Libyan dinar', data: 'LYD' },
    { value: 'Lithuanian litas', data: 'LTL' },
    { value: 'Macanese pataca', data: 'MOP' },
    { value: 'Macedonian denar', data: 'MKD' },
    { value: 'Malagasy ariary', data: 'MGA' },
    { value: 'Malawian kwacha', data: 'MWK' },
    { value: 'Malaysian ringgit', data: 'MYR' },
    { value: 'Maldivian rufiyaa', data: 'MVR' },
    { value: 'Mauritanian ouguiya', data: 'MRO' },
    { value: 'Mauritian rupee', data: 'MUR' },
    { value: 'Mexican peso', data: 'MXN' },
    { value: 'Moldovan leu', data: 'MDL' },
    { value: 'Mongolian tugrik', data: 'MNT' },
    { value: 'Moroccan dirham', data: 'MAD' },
    { value: 'Mozambican metical', data: 'MZM' },
    { value: 'Myanma kyat', data: 'MMK' },
    { value: 'Namibian dollar', data: 'NAD' },
    { value: 'Nepalese rupee', data: 'NPR' },
    { value: 'Netherlands Antillean gulden', data: 'ANG' },
    { value: 'New Zealand dollar', data: 'NZD' },
    { value: 'Nicaraguan cordoba', data: 'NIO' },
    { value: 'Nigerian naira', data: 'NGN' },
    { value: 'Norwegian krone', data: 'NOK' },
    { value: 'Omani rial', data: 'OMR' },
    { value: 'Pakistani rupee', data: 'PKR' },
    { value: 'Panamanian balboa', data: 'PAB' },
    { value: 'Papua New Guinean kina', data: 'PGK' },
    { value: 'Paraguayan guarani', data: 'PYG' },
    { value: 'Peruvian nuevo sol', data: 'PEN' },
    { value: 'Philippine peso', data: 'PHP' },
    { value: 'Polish zloty', data: 'PLN' },
    { value: 'Qatari riyal', data: 'QAR' },
    { value: 'Romanian leu', data: 'RON' },
    { value: 'Russian ruble', data: 'RUB' },
    { value: 'Rwandan franc', data: 'RWF' },
    { value: 'Saint Helena pound', data: 'SHP' },
    { value: 'Samoan tala', data: 'WST' },
    { value: 'Sao Tome and Principe dobra', data: 'STD' },
    { value: 'Saudi riyal', data: 'SAR' },
    { value: 'Serbian dinar', data: 'RSD' },
    { value: 'Seychellois rupee', data: 'SCR' },
    { value: 'Sierra Leonean leone', data: 'SLL' },
    { value: 'Singapore dollar', data: 'SGD' },
    { value: 'Slovak koruna', data: 'SKK' },
    { value: 'Solomon Islands dollar', data: 'SBD' },
    { value: 'Somali shilling', data: 'SOS' },
    { value: 'South African rand', data: 'ZAR' },
    { value: 'Sudanese pound', data: 'SDG' },
    { value: 'Sri Lankan rupee', data: 'LKR' },
    { value: 'Sudanese pound', data: 'SDG' },
    { value: 'Surinamese dollar', data: 'SRD' },
    { value: 'Swazi lilangeni', data: 'SZL' },
    { value: 'Swedish krona', data: 'SEK' },
    { value: 'Swiss franc', data: 'CHF' },
    { value: 'Syrian pound', data: 'SYP' },
    { value: 'New Taiwan dollar', data: 'TWD' },
    { value: 'Tajikistani somoni', data: 'TJS' },
    { value: 'Tanzanian shilling', data: 'TZS' },
    { value: 'Thai baht', data: 'THB' },
    { value: 'Paanga', data: 'TOP' },
    { value: 'Trinidad and Tobago dollar', data: 'TTD' },
    { value: 'Tunisian dinar', data: 'TND' },
    { value: 'Turkish new lira', data: 'TRY' },
    { value: 'Turkmen manat', data: 'TMM' },
    { value: 'Ugandan shilling', data: 'UGX' },
    { value: 'Ukrainian hryvnia', data: 'UAH' },
    { value: 'United Arab Emirates dirham', data: 'AED' },
    { value: 'British pound', data: 'GBP' },
    { value: 'United States dollar', data: 'USD' },
    { value: 'Uruguayan peso', data: 'UYU' },
    { value: 'Uzbekistani som', data: 'UZS' },
    { value: 'Vanuatu vatu', data: 'VUV' },
    { value: 'Venezuelan bolivar', data: 'VEB' },
    { value: 'Vietnamese dong', data: 'VND' },
    { value: 'Yemeni rial', data: 'YER' },
    { value: 'Zambian kwacha', data: 'ZMK' },
    { value: 'Zimbabwean dollar', data: 'ZWD' }
  ];
  
  // setup autocomplete function pulling from currencies[] array
  $('.currency').autocomplete({
    lookup: currencies,
    onSelect: function (suggestion) {
        var currencyObj = {
            name: suggestion.value,
            code: suggestion.data
        }

        Session.setPersistent(CURRENCY, currencyObj)
    }
  });
    //end new currency

	var availableLanguages = [
	"Abkhazian",
    "Afar",
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Aragonese",
    "Armenian",
    "Assamese",
    "Aymara",
    "Azerbaijani",
    "Bashkir",
    "Basque",
    "Bengali (Bangla)",
    "Bhutani",
    "Bihari",
    "Bislama",
    "Breton",
    "Bulgarian",
    "Burmese",
    "Byelorussian (Belarusian)",
    "Cambodian",
    "Catalan",
    "Cherokee",
    "Chewa",
    "Chinese",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Corsican",
    "Croatian",
    "Czech",
    "Danish",
    "Divehi",
    "Dutch",
    "Edo",
    "English",
    "Esperanto",
    "Estonian",
    "Faeroese",
    "Farsi",
    "Fiji",
    "Finnish",
    "Flemish",
    "French",
    "Frisian",
    "Fulfulde",
    "Galician",
    "Gaelic (Scottish)",
    "Gaelic (Manx)",
    "Georgian",
    "German",
    "Greek",
    "Greenlandic",
    "Guarani",
    "Gujarati",
    "Haitian Creole",
    "Hausa",
    "Hawaiian",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Ibibio",
    "Icelandic",
    "Ido",
    "Igbo",
    "Indonesian",
    "Interlingua",
    "Interlingue",
    "Inuktitut",
    "Inupiak",
    "Irish",
    "Italian",
    "Japanese",
    "Javanese",
    "Kannada",
    "Kanuri",
    "Kashmiri",
    "Kazakh",
    "Kinyarwanda (Ruanda)",
    "Kirghiz",
    "Kirundi (Rundi)",
    "Konkani",
    "Korean",
    "Kurdish",
    "Laothian",
    "Latin",
    "Latvian (Lettish)",
    "Limburgish ( Limburger)",
    "Lingala",
    "Lithuanian",
    "Macedonian",
    "Malagasy",
    "Malay",
    "Malayalam",
    "Maltese",
    "Maori",
    "Marathi",
    "Moldavian",
    "Mongolian",
    "Nauru",
    "Nepali",
    "Norwegian",
    "Occitan",
    "Oriya",
    "Oromo (Afaan Oromo)",
    "Papiamentu",
    "Pashto (Pushto)",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Quechua",
    "Rhaeto-Romance",
    "Romanian",
    "Russian",
    "Sami (Lappish)",
    "Samoan",
    "Sangro",
    "Sanskrit",
    "Serbian",
    "Serbo-Croatian",
    "Sesotho",
    "Setswana",
    "Shona",
    "Sichuan Yi",
    "Sindhi",
    "Sinhalese",
    "Siswati",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish",
    "Sundanese",
    "Swahili (Kiswahili)",
    "Swedish",
    "Syriac",
    "Tagalog",
    "Tajik",
    "Tamazight",
    "Tamil",
    "Tatar",
    "Telugu",
    "Thai",
    "Tibetan",
    "Tigrinya",
    "Tonga",
    "Tsonga",
    "Turkish",
    "Turkmen",
    "Twi",
    "Uighur",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Venda",
    "Vietnamese",
    "Volapük",
    "Wallon",
    "Welsh",
    "Wolof",
    "Xhosa",
    "Yi",
    "Yiddish",
    "Yoruba",
    "Zulu"];
        $('.languages').autocomplete({
        lookup: availableLanguages,
        onSelect: function (suggestion) {
            var languagesArr = Session.get(LANGUAGES)

            if (languagesArr) {
                languagesArr.push({ name: suggestion.value })
                Session.setPersistent(LANGUAGES, languagesArr)
            }
            else {
                 Session.setPersistent(LANGUAGES, [{ name: suggestion.value }]) 
             }
        }
    });
})





Template.scope.helpers({
    scopeArray: function(){
        var scopeArray = Session.get(SCOPE_ARRAY)
        return scopeArray;
    }
})

Template.scope.events({
    'click .addScope': function(event) {
        var errors = {}
        var scopeArrayIs = Session.get(SCOPE_ARRAY)

        if(! scopeArrayIs) {
            scopeArrayIs = []
            scopeArrayIs.push({
                 text: '',
                 maxWords: 50,
                 id: Random.id([5])
             });
            Session.setPersistent(SCOPE_ARRAY, scopeArrayIs);
        }

        else if (scopeArrayIs.length < 12) {
            scopeArrayIs.push({
                 text: '',
                 maxWords: 50,
                 id: Random.id([5])
              });
            Session.setPersistent(SCOPE_ARRAY, scopeArrayIs);
        }
        else {
            errors.scopeStatus = "12 requests is the maximum amount to send to the applicant"

            Session.set(ERRORS_POST, errors);
            if (_.keys(errors).length) {
            }
        }//
    },
    'change input[type=range]': function(event, template){
        event.preventDefault();
        var maxWords = event.currentTarget.value
        var maxWordsToNum = Number(maxWords)
        var objId = this.id
        var scopeArr = Session.get(SCOPE_ARRAY)
        var i;
        var len = scopeArr.length

        for (i = 0; i < len; i++) {
            if (scopeArr[i].id === objId) {
                scopeArr[i].maxWords = maxWordsToNum
                break;
            }
        }
        Session.setPersistent(SCOPE_ARRAY, scopeArr)
    },
    'keyup textarea[name=question]': _.throttle(function(event) {
        event.preventDefault();
        var scopeArray = Session.get(SCOPE_ARRAY)
        var text = event.currentTarget.value;
        console.log(text)
        var objId = this.id
        var i;
        var len = scopeArray.length

        for (i = 0; i < len; i++) {
            if (scopeArray[i].id === objId) {
                scopeArray[i].text = text
                break;
            }
        }
        Session.update(SCOPE_ARRAY, scopeArray);
    }, 1000, {leading: false}),
    'click .removeScope': function(event) {
        event.preventDefault();
        var selectedScopeId = this.id 
        var scopeArray = Session.get(SCOPE_ARRAY)

        var newScopeArray = _.reject(scopeArray, function(el) {
            return el.id === selectedScopeId; })

        Session.setPersistent(SCOPE_ARRAY, newScopeArray);
    }
})




    


