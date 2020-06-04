// JavaScript Document

var BIRM = BIRM || {};

(function (){

    /* Page level event listeners. */
    var arrayNotes;

    $(document).ready(function () {
        console.log("Notes.DocumentReady: Notes document is ready.");
        document.addEventListener('deviceready', onDeviceReady, false);
    });
	
	

    function onDeviceReady() {
        console.log("Notes.onDeviceReady: Device is ready.");

        $("#MenuOptions").on('click', function () {
            $('#LeftOptionsMenu').popup('open', { positionTo: 'origin' });
        });

        $('#HomeButton').on("click", function () {
            location.href = "MainMenu.html";
        })

        $('#BackButton').on("click", function () {
            location.href = "MainMenu.html";
        });

        $('#NotesAdd').on("click", function () {
            console.log("Notes.NotesAddClickEvent: Add notes button clicked.");
            $('#LeftOptionsMenu').popup('close');
            setTimeout(function () {
                window.localStorage.setItem("Note", '0');
                location.href = "NotesDetail.html";
            }, 1);
        });

        $('#NotesDelete').on("click", function () {
            console.log("Notes.NotesDeleteClickEvent: Delete notes button clicked.");

            $('#LeftOptionsMenu').popup('close');

            var iNumChecked = $("input:checked").length;
            var iTotalNotes = parseInt($('#count').html());
   
            if (iNumChecked > 0) {
                console.log("Notes.NotesDeleteClickEvent: Delete note.");
                if ($('#chkAll').is(':checked') || iNumChecked === iTotalNotes) {                                     
					 ShowConfirmation('Confirmation',
                                 'Are you sure you want to delete all of your notes?',
                                 function (buttonIndex) {
                                     if (buttonIndex === 2) {
                                          deleteNotes($("input:checked"));										  
                                     }
                                 },
                                 ['No', 'Yes']
                	);
                }
                else {                    
					 ShowConfirmation('Confirmation',
                                 'Are you sure you want to delete the selected note(s)?',
                                 function (buttonIndex) {
                                     if (buttonIndex === 2) {
                                          deleteNotes($("input:checked"));										  
                                     }
                                 },
                                 ['No', 'Yes']
                	);
                }
            }
            else {
                console.log("Notes.NotesDeleteClickEvent: No checkboxes are checked.");
                ShowAlert('Notification', 'Please select a note.')
            }

        });

        $('#btnDeleteConfirm').on("click", function () {
            deleteNotes($("input:checked"));
        });

        $('#btnOK').on("click", function () {
            LoadNotes();
        });

        LoadNotes();
    }

    function LoadNotes() {

        try {
            console.log("NoteList.LoadNotes: Loading the field notes.");
           
            var oFieldNote = new BIRM.Note();
            oFieldNote.getNoteList(createNoteList);
        }
        catch (err) {
            //Handle errors here
            console.log('Note.LoadNotes: ' + err.message);
        }

    }

    function errorGettingNotesList() {
        ShowAlert('Notification', 'An error occurred getting the notes list.');
    }
					

    function createNoteList(Transaction, NotesList) {

        console.log("NoteList.createNotesList: Building the notes list.");
        console.log("NoteList.createNotesList: Database contained "+ NotesList.rows.length + " notes.");

        var sNote = '';
        if (NotesList.rows.length != null && NotesList.rows.length != 0) {
            console.log("NoteList.createNotesList: Starting to build the notes list.");

            iNotesCount = NotesList.rows.length;
            $('#count').text('(' + iNotesCount + ')');
           
            $('#notes-list').empty();
            $('#notes-list').find("ul[data-role='listview']").listview();

                //sNote = '<ul id="NotesContent" data-role="listview" class="noindent" data-theme="b">';
            sNote += '<ul data-role="listview" data-count-theme="a">';
 
            //sNote += '<li><input type="checkbox" id="chkAll" data-value="All" data-role="none"/> Select All Notes</li>';
	            sNote += '<li data-icon="false"><a><span><label style="padding: 0x 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup">';
	            sNote += '<input type="checkbox" id="chkAll" data-role="none" /></fieldset></label></span> Select All Notes </a></li>';

                var i = 0;
                for (i = 0; i < iNotesCount; i++) {
                    var row = NotesList.rows.item(i);
                    var oNote = new BIRM.Note(row['NoteID'],row['Title'],row['Date'],row['Time'],row['Location'],row['Notes']);
					
                    var dDate = new Date(oNote.NoteDate.replace(/-/g, '/') + ' ' + oNote.NoteTime);
					var formattedDate = (dDate.getMonth() + 1).toString() + '/' + dDate.getDate().toString() + '/' + dDate.getFullYear().toString();
					var formattedTime = formatTime(dDate).toString();
					
                    sNote += '<li data-icon="false"><a><span><label style="padding: 0x 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup">';
					sNote += '<input type="checkbox" id="NotesList" data-value="' + oNote.NoteID + '" data-role="none" /></fieldset></label></span><span class="noteTitle" id="note_' + i + '" data-value="' + oNote.NoteID + '"  >' + oNote.NoteTitle + '</span><span class="ui-li-count">' + formattedDate + ' ' + formattedTime + '</span></a></li>';
					
					//sNote += '<li data-icon="false"><a><span><label style="padding: 0x 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup">';
					//sNote += '<input type="checkbox" id="NotesList" data-value="' + oNote.NoteID + '" data-role="none" /></fieldset></label></span><span class="noteTitle" id="note_' + i + '" data-value="' + oNote.NoteID + '"  >' + oNote.NoteTitle + '</span><span class="ui-li-count">' + formattedDate + '</span></a></li>';
					
                    //sNote += '<li><input type="checkbox" id="NotesList" data-value="' + oNote.NoteID + '" data-role="none"/><p class="title" data-value="' + oNote.NoteID + '">' + oNote.NoteTitle + '</p><p class="date" data-value="' + oNote.NoteID + '">' + oNote.NoteDate + '</p> <p class="divider"> | </p><p class="time" data-value="' + oNote.NoteID + '"> 5:30 PM </p></li>';
                }

                sNote += '</ul>';
               $('#notes-list').append(sNote);
               $('#notes-list').find("ul[data-role='listview']").listview();
			
               $("#notes-list a").on('click', function (evt) {
					evt.stopPropagation();
				});
				
				$(".noteTitle").click(function() {
					console.log('onshowNote: Opening note ' + $(this).attr("data-value"));
                    window.localStorage.setItem("Note", $(this).attr("data-value"));
                    window.location = 'NotesDetail.html';
				});

                $('#chkAll').on("click", function () {
                    console.log("Notes.NotesCheckAllClickEvent: All notes checkbox clicked.");
                    $('li #NotesList').prop('checked', this.checked);
                })
        }
        else {
            console.log("NoteList.createNotesList: Letting user know that no notes exist in the database.");

            $('#notes-list').empty();
            $('#count').text('(0)');
        }

    }

    function formatTime(date) {
        var now = new Date(date);
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        var ap = "AM";
        if (hour > 11) { ap = "PM"; }
        if (hour > 12) { hour = hour - 12; }
        if (hour == 0) { hour = 12; }
        if (minute < 10) { minute = "0" + minute; }
        var timeString = hour + ':' + minute + " " + ap;
        return timeString;
    }

    function deleteNotes(NoteArray) {
        console.log("Notes.deleteNotes: Deleting a note or notes using the note object.");

        if (NoteArray.length > 0) {
            arrayNotes = new Array();
            $.each(NoteArray, function () {
                arrayNotes.push(this);
            })
            deleteNoteItem(arrayNotes.pop());
        }

    }

    function deleteNoteItem(NoteItem) {
        console.log("Notes.deleteNoteItem: Deleting a specific note using the note object.");

        try {
            var oFieldNote = new BIRM.Note();
            oFieldNote.deleteNote(NoteItem, noteDeleted, noteNotDeleted);
        }
        catch (e) {
            console.log('Note.deleteNoteItem: Error: ' + e.message);
        }
    }

    function noteDeleted() {
        console.log("Notes.noteDeleted: The note has been deleted.");

        try {
            if (arrayNotes.length > 0) {
                deleteNoteItem(arrayNotes.pop());
            }
            else {
                LoadNotes()
                //ShowAlert('Notification', 'Your note(s) have been successfully deleted.', LoadNotes());
            }
        }
        catch (e) {
            ShowAlert('Notification', 'Could not delete the note(s).');
        }
    }

    function noteNotDeleted() {
        ShowAlert('Notification', 'An error occurred deleting the note(s).');
    }

    function ShowAlert(Title, Alert, Callback) {
		var oBIRMApp = new BIRM.BIRMApp();
		oBIRMApp.ShowAlert(Title, Alert, Callback);		
	}
	
	function ShowConfirmation(Title, Alert, Callback, Buttons) {		
		var oBIRMApp = new BIRM.BIRMApp();
		oBIRMApp.ShowConfirmation(Title, Alert, Callback, Buttons);		
	}
		
		

    BIRM.Note = function () {
    }

    BIRM.Note = function (NoteID, NoteTitle, NoteDate, NoteTime, NoteLocation, NoteDescription) {
        this.NoteID = NoteID
        this.NoteTitle = NoteTitle;
        this.NoteDate = NoteDate;
        this.NoteTime = NoteTime;
        this.NoteLocation = NoteLocation;
        this.NoteDescription = NoteDescription;
    };

    BIRM.Note.prototype.getNoteList = function (successCallback, errorCallback) {
        console.log("Note.getNoteList: Calling database to get the notes list.");
        var oDB = new BIRM.Database();
        oDB.getNoteList(successCallback, errorCallback);
    };

    BIRM.Note.prototype.getNote = function (Note, successCallback, errorCallback) {

    };

    BIRM.Note.prototype.createNote = function (Note, successCallback, errorCallback) {

    };

    BIRM.Note.prototype.updateNote = function (Note, successCallback, errorCallback) {

    };

    BIRM.Note.prototype.deleteNote = function (NoteItem, successCallback, errorCallback) {
        console.log("Note.deleteNote: Calling database to delete the note.");
        var NoteID = $(NoteItem).attr('data-value');
        var oDB = new BIRM.Database();
        oDB.deleteNote(NoteID, successCallback, errorCallback);
    };

}());