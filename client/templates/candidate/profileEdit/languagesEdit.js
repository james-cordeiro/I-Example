var LANGUAGES = 'languages_array'

Template.languagesEdit.onCreated(function() {
	var languagesArray = Meteor.user().profile.myProfile.languages
	Session.setPersistent(LANGUAGES, languagesArray)
})

/*Template.languagesEdit.onDestroyed(function() {
	if (Session.get(LANGUAGES)) {
		Meteor.call('updateLanguages', Session.get(LANGUAGES))
	}
})*/

Template.languagesEdit.onRendered(function() {
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
            $('.languages').val("")
        }
    });
})

Template.languagesEdit.helpers({
	languages: function() {
		return Session.get(LANGUAGES)
	}
})

Template.languagesEdit.events({
	'click a i.deleteLanguage': function(event){
        event.preventDefault();
        var languageName = this.name
        var languagesArr = Session.get(LANGUAGES)

        var newLanguagesArr = _.reject(languagesArr, function(el) {
            return el.name === languageName; })

        Session.setPersistent(LANGUAGES, newLanguagesArr);
    },
    'keydown .languages': function(event) {
        if ((27 === event.which) || (13 === event.which)) {
            event.preventDefault();
            event.target.blur();
        }
    },
    'click .saveLanguages': function(event) {
		event.preventDefault()
		console.log('you clicked saveLanguages')

		Meteor.call('updateLanguages', Session.get(LANGUAGES),
			function(error, result) {
				if (! error) {
					Router.go('profilePageCandidate')
				}
			});
	}
})


