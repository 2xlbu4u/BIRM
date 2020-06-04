// JavaScript Document

var BIRM = BIRM || {};

(function (){

    var oNote;
    var iNoteID;

    /* Page level event listeners. */
    $(document).ready(function () {
        console.log("NoteDetail.DocumentReady: Notes document is ready.");
        document.addEventListener('deviceready', onDeviceReady, false);
    });

    function onDeviceReady() {
        console.log("NoteDetail.onDeviceReady: Device is ready.");

         $('#BackButton').on("click", function () {
            console.log("NoteDetail.BackClickEvent: Back button clicked.");
            location.href = 'NotesList.html';
        });

        $('#DoneButton').on("click", function () {
            console.log("NoteDetail.DoneClickEvent: Add notes button clicked.");
            createFieldNote();
        });

        $('#btnOK').on("click", function (evt) {
            console.log("NoteDetail.btnOkClickEvent: Ok button clicked.");
            evt.preventDefault();
            location.href = "NotesList.html";
        });

        iNoteID = window.localStorage.getItem("Note");
        if (iNoteID !== '0') {
            getNote();
            $('.ui-header h1').html('View/Edit Note');
        } else {
            var dDate = new Date();
            $('#txtDate').val(getDateString(dDate));
            $('.ui-header h1').html('New Note');
        }
    }
	
		function ShowAlert(Title, Alert, Callback) {
			var oBIRMApp = new BIRM.BIRMApp();
			oBIRMApp.ShowAlert(Title, Alert, Callback);
		
		}
		
		function ShowConfirmation(Title, Alert, Callback, Buttons) {
		
			var oBIRMApp = new BIRM.BIRMApp();
			oBIRMApp.ShowConfirmation(Title, Alert, Callback, Buttons);
		
		}


    function getNote() {

        try {
            console.log("NotesDetail.getNote: Calling database to get the field note.");

            var oDB = new BIRM.Database();
            oNote = new BIRM.Note(iNoteID, null, null, null, null);
            oDB.getNote(oNote, loadNote, errorGettingNote);

        }
        catch (err) {
            //Handle errors here
            ShowAlert('Developer Notification', 'NotesDetail.getNote: ' + err.message);
        }

    }

    function loadNote(Transaction, Note) {
        console.log("NotesDetail.loadNote: Loading the note object.");

        try {
            if (Note.rows.length != null && Note.rows.length != 0) {
                var row = Note.rows.item(0);
            
                oNote = new BIRM.Note(row['NoteID'], row['Title'], row['Date'], row['Time'], row['Location'], row['Notes']);
                $('#txtTitle').val(oNote.NoteTitle);
                var dDate = new Date(oNote.NoteDate);
                $('#txtDate').val(getDateString(dDate));
                $('#txtLocation').val(oNote.NoteLocation);
                $('#txtNote').val(oNote.NoteDescription);
            }
        }
        catch (e) {
            ShowAlert('Developer Notification', 'NotesDetail.loadNote: An error occurred loading the note. (' + e.message + ')');
        }
    }

    function errorGettingNote() {
        ShowAlert('Developer Notification', 'An error occurred getting the note.');
    }

    function createFieldNote() {
        console.log("NotesDetail.createNote: Creating or updating note using the note object.");

        try {
			var d = new Date();
			var curr_date = d.getDate();
			var curr_month = d.getMonth() + 1; //Months are zero based
			var curr_year = d.getFullYear();
			var curr_hour = d.getHours();
			var curr_minute = (d.getMinutes()<10?'0':'') + d.getMinutes();
			var noteDate = curr_year + "-" + curr_month + "-" + curr_date;
			var noteTime = curr_hour + ":" + curr_minute;
			
			oNote = new BIRM.Note(iNoteID, $('#txtTitle').val(), $('#txtDate').val(), noteTime, $('#txtLocation').val(), $('#txtNote').val());
			
            //oNote = new BIRM.Note(iNoteID, $('#txtTitle').val(), $('#txtDate').val(), $('#txtLocation').val(), $('#txtNote').val());
			var oDB = new BIRM.Database();
            if (iNoteID === '0') {
                if (validateForm()) {
                    oDB.createNote(oNote, noteSaved, noteNotSaved);
                }
            }
            else {
                oDB.updateNote(oNote, noteSaved, noteNotSaved);
            }
        }
        catch(e) {
            ShowAlert('Developer Notification', 'NotesDetail.createNote: An error occurred creating the note. (' + e.message + ')');
        }
    }

    function getDateString(date) {
        var dDate = new Date(date);
        var sFullYear = dDate.getFullYear();
        var sMonth = (dDate.getMonth() + 1);
        var sDay = dDate.getDate();
        if (sMonth < 10) { sMonth = '0' + sMonth };
        if (sDay < 10) { sDay = '0' + sDay };
        var formattedDate = sFullYear + '-' + sMonth + '-' + sDay;
        return formattedDate;
    }

    function validateForm() {
        console.log("NotesDetail.validateForm: Validating form data.");

        var bValidForm = true;
        var sErrorMessage;

        if ($('#txtTitle').val() === '') {
            sErrorMessage = 'Please enter a title.';
            bValidForm = false;
        }

        if ($('#txtData').val() === '') {
            if (sErrorMessage !== '') {
                sErrorMessage += '\nPlease enter a date.';
            }
            else {
                sErrorMessage += 'Please enter a date.';
            }
            bValidForm = false;
        }

        if (bValidForm === false) {
            ShowAlert('Application Error', sErrorMessage);
        }

        return bValidForm;
    }

    function noteSaved() {
        ShowAlert('Notification', 'The note was successfully saved.', function () { location.href = "NotesList.html"; });
    }

    function noteNotSaved() {
        ShowAlert('Notification', 'An error occurred saving the note.', function () { location.href = "NotesList.html"; });
    }

	function ShowAlert(Title, Alert, Callback) {
		var oBIRMApp = new BIRM.BIRMApp();
		oBIRMApp.ShowAlert(Title, Alert, Callback);	
	}
	
	function ShowConfirmation(Title, Alert, Callback, Buttons) {	
		var oBIRMApp = new BIRM.BIRMApp();
		oBIRMApp.ShowConfirmation(Title, Alert, Callback, Buttons);	
	}


}());