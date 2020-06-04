// JavaScript Document

var BIRM = BIRM || {};



(function (){
	
    /* Page level event listeners. */
    $(document).ready(function () {
        console.log('terms DocumentReady');
        document.addEventListener('deviceready', onDeviceReady, false);
    });

    function onDeviceReady() {
        $('#btnAccept').click(function () {
            var oTerm = new BIRM.Terms();
            oTerm.Accept(1);
        });

        $('#btnDecline').click(function () {
            var oTerm = new BIRM.Terms();
            oTerm.Accept(2);
        });
    }

	BIRM.Terms = function () { };

	var onAcceptedTerms;
	var onAcceptedTermsError;
	var sAppDirectory = "gov.dot.birm";
			
	var onDirectoryError = function(error) {
		console.log("Terms.onDirectoryError: Error creating directory.");
	}
	
	var onCreateDirectory = function(error) {
		console.log("Terms.onCreateDirectory: Directory had to be created.");
		if (error.code = FileError.NOT_FOUND_ERR) {
			var oFS = new BIRM.FileSystem();
			oFS.getDirectory(sAppDirectory, true, onDirectorySuccess, onDirectoryError);
		}
	}

	var onDirectorySuccess = function (dirEntry) {
		console.log("Terms.onDirectorySuccess: Directory was successfully created.");
		window.location.href = "Setup.html";
		//$.mobile.changePage("Setup.html");
	}
	
	var onDirectoryExists = function(dirEntry) {
		console.log("Terms.onDirectoryExists: Directory exists.");
		window.location.href = "Setup.html";
		//$.mobile.changePage("Setup.html");
	}
				
	var onAcceptedInsertSuccess = function() {
		console.log("Terms.onAcceptedInsertSuccess : Terms accepted and inserted into database.");
		var oDB = new BIRM.Database();
		oDB.InitializeDatabase();
		
		var oFS = new BIRM.FileSystem();
		oFS.getDirectory(sAppDirectory, false, onDirectoryExists, onCreateDirectory);
	}

	var onAcceptedInsertError = function() {
		console.log("Terms.onAcceptedInsertError : Terms accepted but error occurred inserting into database.");
	}
	
	BIRM.Terms.prototype.Accepted = function(successCallback) {
		console.log("Terms.Accepted: Validating terms of service have been accepted.");		
		var oDB = new BIRM.Database();
		oDB.getAgreement(successCallback)
	}

	BIRM.Terms.prototype.showTerms = function(successCallback) {
		console.log("Terms.showTerms: Determines if terms of service need to be shown.");
		var oDB = new BIRM.Database();
		oDB.showAgreement(successCallback);
	}
		
	BIRM.Terms.prototype.Accept = function(accepted) {
	    console.log("Terms.Accept: Save the accept terms of service selection to database.");
        if (accepted === 1) {
		    var oDB = new BIRM.Database();
		    oDB.createAgreement(accepted, onAcceptedInsertSuccess, onAcceptedInsertError);
        } else {
            //alert('Please accept the terms of use to use the BIRM Mobile App.');
            navigator.app.exitApp();
        }
	}
	
}());
 