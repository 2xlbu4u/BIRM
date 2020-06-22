// JavaScript Document
var BIRM = BIRM || {};

(function (){

	/* Page level event listeners. */
    $(document).ready(function () {
        console.log("EPUBChapters.DocumentReady: Video list document is ready.");
        document.addEventListener('deviceready', onDeviceReady, false);
    });

	function onDeviceReady() {
	    console.log("EPUBChapters.onDeviceReady: Chapter list document is ready.");

	    $('a').on('onclick', function (evt) {
	        evt.preventDefault();
	        alert('click');
	    });

	    $("#MenuOptions").on('click', function () {
	        $('#LeftOptionsMenu').popup('open', { positionTo: 'origin' });
	    });

	    $('#HomeButton').on("click", function (evt) {
	        evt.preventDefault();
	        window.location.href = "MainMenu.html";
	    });

	    $('#BackButton').on("click", function () {
	        //location.href = "MainMenu.html";
	    });

	    $('#btnDeleteChapter').on("click", function (evt) {
	        $("#OptionsMenu").popup('close');

	        var arrSelectedChapters = $("input:checked");

	        if (arrSelectedChapters.length === 0) {
	            ShowAlert('Notification', 'Please select the chapters you wish to remove.', function () { });
	            //showNotification('Please select the chapters you wish to remove.', null);
	        }
	        else {
	            ShowConfirmation('Confirmation',
                                 'Are you sure you want to delete the selected chapter(s)?',
                                 function (buttonIndex) {
                                     if (buttonIndex === 2) {
                                         startRemoveChapters();
                                     }
                                 },
                                 ['No', 'Yes']
                );
	            //$('#popupConfirmDelete').popup('open', {positionTo: 'window'});
	        }
        });

	    $('#btnExport').on("click", function () {
	        $("#OptionsMenu").popup('close');

	        var arrSelectedChapters = $("input:checked");
            if (arrSelectedChapters.length === 0) {
                ShowAlert('Notification', 'Please select the chapters you wish to export.', function () { });
                //showNotification('Please select the chapters you wish to export.', null);
            }
            else {

                setTimeout(function () {

                    $('#popupExportDialog').popup('open');
                    $("#toEmailAsk").show();
                    if (!(window.localStorage.getItem("email"))) {
                        $("#fromEmailAsk").show();
                    } else {
                        // $("#fromEmailAsk").hide();
                    }

                    $("#exportSubmitButton").click(function (evt) {

                        evt.preventDefault();

                        var toEmail = $("#toEmailBox").val();
                        if (toEmail.length < 3) {
                            //showNotification("Must enter valid 'to' email", null);
                            ShowAlert('Validation', 'Please enter a valid email.', function () { });
                            return;
                        }
                        else {
                            window.localStorage.setItem("toEmail", $("#toEmailBox").val());
                        }

                        if ($("#fromEmailBox").val().length > 3) {
                            window.localStorage.setItem("email", $("#fromEmailBox").val());
                        }

                        if (!(window.localStorage.getItem("email"))) {
                            //showNotification("Must have 'from' email", null);
                            ShowAlert('Validation', 'Please enter a valid email.', function () { });
                            return;
                        };

                        var exportFileName = $('#fileNameBox').val();
                        if (exportFileName.length === 0) {
                            ShowAlert('Validation', 'Please enter a filename.', function () { });
                            return;
                        } else {
                            window.localStorage.setItem("exportFileName", $("#fileNameBox").val());
                        }

                        setTimeout(function () {
                            $('#popupExportDialog').popup('close');
                            setTimeout(function () {
                                showSpinner('Note Export Progress', 'Exporting ...', 'a');
                                startExport();
                            }, 400);
                        }, 300);
                    });

                }, 300);
            }
	    });

	    $('#btnImport').on('click', function(){
	        $("#OptionsMenu").popup('close');

	        var arrDownloadedChapters = $('[id="Chapter"]');
	        if (arrDownloadedChapters.length === 0) {
	            ShowAlert('Notification', 'You do not have any BIRM chapters downloaded on this device to perform a notes import.', function () { });
	        } else {
	            setTimeout(function () {
	                //$("#emailAsk").show();
	                $('#popupNotesDialog').popup('open');
	                //$("#loadingDiv").text("Loading...");
	                //$("#notesList").html("");
	            }, 300);
	        }
	    	console.log("import clicked");
	    });

	    $('#submitEmail').click(function (evt) {

	        try {

	            evt.preventDefault();

	            console.log('the email entered is ' + $("#emailAskBox").val());
	            $("#loadingDiv").show();
	            window.localStorage.setItem("email", $("#emailAskBox").val());
	            console.log('local storage email is ' + window.localStorage.getItem("email"));

	            //get list of notes
	            jQuery.support.cors = true;
	            $.ajax({
	                type: "GET",
	                contentType: "application/json; charset=utf-8",
	                url: "http://test.ideationinc.com/BIRMPush/import.php",
	                data: { name: $("#emailAskBox").val() },
	                dataType: "json",
	                success: function (data) {
	                    if (data["errors"] || (data["list"] == null)) {
	                        $("#loadingDiv").text("No notes.");

	                    } else {
	                        var listHTML = "";
	                        for (var key in data["list"]) {
	                            listHTML += "<li><a class='noteFile' href='#' file='" + data["list"][key] + "'>" + data["list"][key].substr(0, (data["list"][key].length - 5)) + "</a></li>";
	                        }
	                        $("#loadingDiv").hide();
	                        $("#notesList").html(listHTML);

	                        $('.noteFile').click(function (e) {

	                            console.log("start importing");
	                            var filename = $(this).attr("file");

	                            //retrieve note file
	                            setTimeout(function () {
	                                $('#popupNotesDialog').popup('close');
	                                setTimeout(function () {
	                                    showSpinner('Note Import Progress', 'Importing ...', 'a');
	                                }, 400);
	                            }, 300);

	                            $.ajax({
	                                type: "GET",
	                                url: "http://test.ideationinc.com/BIRMPush/" + window.localStorage.getItem("email") + "/inbox/" + filename,
	                                dataType: 'JSON',
	                                success: function (data) {
	                                    console.log('got file from server');
	                                    $("#loadingDiv").hide();
	                                    arrChapterContent = new Array();
	                                    //alert(data);
	                                    //alert(JSON.stringify(data));
	                                    startImport(data);
	                                },
	                                error: function (a, string, thrown) {
	                                    console.log('ajax get file ' + string);
	                                    console.log('ajax get file ' + thrown);
	                                    console.log('ajax get file ' + a);
	                                }
	                            });

	                        });

	                    }
	                },
	                error: function (a, string, thrown) {
	                    console.log('ajax get file list string ' + string);
	                    console.log('ajax get file list thrown ' + thrown);
	                    console.log('ajax get file list a ' + a);
	                }
	            });

	        }
	        catch (e) {
	            alert('the error is ' + e);
	        }
	    });

	    $('#submitEmail2').click(function(evt){

	        try {

	            evt.preventDefault();

	    	console.log('the email entered is ' + $("#emailAskBox").val());
	    	$("#loadingDiv").show();
	    	window.localStorage.setItem("email", $("#emailAskBox").val());
            console.log('local storage email is ' + window.localStorage.getItem("email"));
	    	
            //get list of notes
            jQuery.support.cors = true;
	    	$.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
	    		url: "http://test.ideationinc.com/BIRMPush/import.php",
	    		data: {name: $("#emailAskBox").val()},
	    		dataType: "json",
	    		success: function(data){
	    			if (data["errors"] || (data["list"] == null)) {
	    				$("#loadingDiv").text("No notes.");

	    			} else{
	                //$('#notesList').empty();
	                //$('#notesList').find("ul[data-role='listview']").listview();
	                var listHTML = '<ul data-role="listview" class="ui-fhwa-popup-content-list">';
	    				for(var key in data["list"]){
	    						listHTML += "<li><a class='noteFile' href='#' file='" +  data["list"][key] + "'>" + data["list"][key].substr(0, (data["list"][key].length-5)) + "</a></li>";
	    				}
	    				listHTML += '</ul>';
	    				$("#loadingDiv").hide();

	    				$("#notesList").append(listHTML);
                        //$('#notesList').find("ul[data-role='listview']").listview();
                        //$("#notesList").html(listHTML);

						$('.noteFile').click(function(e){

                            console.log("start importing");
							var filename = $(this).attr("file");

						    //retrieve note file
							setTimeout(function () {
							    $('#popupNotesDialog').popup('close');
							    setTimeout(function () {
							        showSpinner('Note Import Progress', 'Importing ...', 'a');
							    }, 400);
							}, 300);

							$.ajax({
							    type: "GET",
							    url: "http://test.ideationinc.com/BIRMPush/" + window.localStorage.getItem("email") + "/inbox/" + filename,
							    dataType: 'JSON',
							    success: function (data) {
							        console.log('got file from server');
							        //startImport(data);

							        $("#loadingDiv").hide();
							        //have json file, now what?
							        //startImport???

							        var oBIRMApp = new BIRM.BIRMApp();
							        //setRootDirectory();

							        console.log('getting file system');
							        var oFS = new BIRM.FileSystem();

							        //var NoteJson = [{"noteId":"test note","noteChapter":{"value":"OEBPS/birm-ch-1.xhtml","name":"Chapter 1 Bridge Inspection Programs"},"notedText":"Test note","notedItemHTML":"<p class=\"body\">In the years since the Federal Highway Administrationâ€™s landmark publication, <em class=\"Body_italic\">Bridge Inspectorâ€™s Training Manual 90 (Manual 90),</em> bridge inspection and inventory programs of state and local governments have formed an important basis for formal bridge management programs. During the 1990â€™s, the state DOTâ€™s implemented comprehensive bridge management systems, which rely heavily on accurate, consistent bridge inspection data.</p>","notedItemKey":"1401392221206-71a0bd2d-e96d-4841-9401-ba7ed4a3e420"}];
							        //at some point make dict/list of chapters I need

							        //obvi should at some point worry about other chapters
							        oFS.getFile('gov.dot.birm/EPUBS/ch1/notes.json', true, function (entry) {
							            console.log("hey");
							            function win(file) {
							                var reader = new FileReader();
							                reader.onloadend = function (evt) {
							                    console.log("read success");
							                    console.log(JSON.parse(evt.target.result));
							                    var origNotesJson = JSON.parse(evt.target.result);
							                    //should at some point worry about note conflicts

							                    var newNotes = origNotesJson.concat(data);
							                    console.log(newNotes);

							                    function win(writer) {
							                        writer.onwriteend = function (evt) {
							                            console.log("truncate success");
							                            writer.onwriteend = function (evt) {
							                                setTimeout(function () {
							                                    closeProgress();
							                                    setTimeout(function () {
							                                        //showNotification('The import process has successfully completed.', 'btnOkImport');
							                                        ShowAlert('Notification',
                                                                              'The import process has successfully completed.',
                                                                              function (evt) {
                                                                                  evt.preventDefault();
                                                                                  window.location.reload(true);
                                                                              }
                                                                    );

							                                        //$('#btnOkImport').on('click', function (evt) {
							                                        //    evt.preventDefault();
							                                        //    window.location.reload(true);
							                                        //});

							                                    }, 2500);
							                                }, 2000);
							                                
							                            }
							                            writer.write(JSON.stringify(newNotes));
							                        }
							                        writer.truncate(0);
							                    }

							                    var fail = function (evt) {
							                        console.log(error.code);
							                    };

							                    entry.createWriter(win, fail);

							                    //if I have to, actually write this to fileSystem or whatever
							                    window.localStorage.setItem("ch1/notes", newNotes);

							                };
							                reader.readAsText(file);
							            };

							            var fail = function (evt) {
							                console.log(error.code);
							            };

							            entry.file(win, fail);

							        }, onGotFilesError);


							    },
							    error: function (a, string, thrown) {
							        console.log('ajax get file ' + string);
							        console.log('ajax get file ' + thrown);
							        console.log('ajax get file ' + a);
							    }
							});

						});
			
	    			}
	    		},
	    		error: function(a, string, thrown){

	    			console.log('ajax get file list string ' + string);
	    			console.log('ajax get file list thrown ' + thrown);
	    			console.log('ajax get file list a ' + a);
	    		}
	    	});

            }
            catch(e) {
                alert('the error is ' + e);
            }
	    });

	    $('#SelectFile').on("click", function () {
	        //location.href = 'FileChooser.html';
	    });

	    $(document).on('onFileSelected', function (evt, File) {

	        console.log("EPUBChapters.onFileSelected: The user selected " + File.dirEntry.toURL() + "/" + File.fileEntry + ".");

	        var dirEntry = File.dirEntry;
	        var fileEntry = File.fileEntry;

	        startImport(dirEntry, fileEntry);
	    });

	    LoadChapters();

	}

	function onGotFiles(dirEntries) {
	    console.log("EPUBChapters.onGotFiles: " + dirEntries.length + " entries found.");
		var oChapters = oBIRMApp.BIRMChapters;
	}
	
	function onGotFilesError() {
		alert('Please download the appropriate BIRM chapters.');
	}

	function LoadChapters() {

	    console.log("EPUBChapters.LoadChapters: Loading the BIRM chapters.");

	    try {
	        var iChapterCount = 0;
	        window.localStorage.setItem("Chapter", '');
	        window.localStorage.setItem("CurrentChapterName", '');

	        var oBIRMApp = new BIRM.BIRMApp();
	        var BIRMChapters = oBIRMApp.BIRMChapters;

	        if (BIRMChapters != null) {

	            iChapterCount = BIRMChapters.length;
	            $('#count').text('(' + iChapterCount + ')');
	            var sChapter = '';

	            var arrFiles = null;
	            oBIRMApp.GetEPUBDocuments(function (dirEntries) {
	                $('#ChapterContent').empty();
	                $('#ChapterContent').find("ul[data-role='listview']").listview();

	                sChapter = '<ul data-role="listview" data-split-icon="gear" data-split-theme="a" data-count-theme="a">';
	                arrFiles = dirEntries;

	                var i = 0;
	                for (i = 0; i < BIRMChapters.length; i++) {
	                    var bDownloaded = true;
	                    var sFullPathToFile = '';
	                    var sImg = '';

	                    if (arrFiles != null) {
                            
	                        // Make sure all EPUB parts have been downloaded for multi-part EPUBS.
	                        var result;
	                        if (BIRMChapters[i].FileName.indexOf(';') > -1) {
	                            var arrFileList = new Array();
	                            arrFileList = BIRMChapters[i].FileName.split(';');

	                            $.each(arrFileList, function () {
	                                var sFileItem = $.trim(this);
	                                result = $.grep(arrFiles, function (e) { return e.name === sFileItem; });
	                                if (result.length === 0) {
	                                    bDownloaded = false;
	                                }
	                                else {
	                                    // Get the primary chapter part for the link click event below.
	                                    if (sFileItem.indexOf('pt1') > -1) {
	                                        sFullPathToFile = result[0].toURL();
	                                    }
	                                }

	                            });
	                        }
	                        else {
	                            result = $.grep(arrFiles, function (e) { return e.name == BIRMChapters[i].FileName; });
	                            sLinkFileName = BIRMChapters[i].FileName;
	                            if (result.length === 0) {
	                                bDownloaded = false;
	                            }
                                else {
	                                sFullPathToFile = result[0].toURL();
	                            }
	                        }

                            if (bDownloaded) {
                                console.log("EPUBChapters.LoadChapters: Chapter has been previously downloaded. (" + BIRMChapters[i].FileName + ").")
                                //sImg = '<div class="downloaded-icon"><a href="#" data-rel="popup"><img src="img/downloaded-40-blue.png" alt="chapter has been downloaded" /></a></div><div class="size" style="float: right;">' + BIRMChapters[i].Size + ' MB</div>'
                                sImg = '<span class="ui-li-count">' + BIRMChapters[i].Size + ' MB</span><a href="#" class="ui-icon-BIRMDownloaded" data-rel="popup"></a>';
                                //sChapter += '<li><input type="checkbox" id="NotesList" data-value="' + BIRMChapters[i].FileName + '" data-role="none"/><div class="ChapterName"><a href="#" id="Chapter" data-value="' + sFullPathToFile + '">' + BIRMChapters[i].DisplayName + '</a></div>' + sImg + '</li>';
                                //sChapter += '<li data-icon="false"><input type="checkbox" style="float: left;" id="NotesList" data-value="' + BIRMChapters[i].FileName + '" data-role="none"/><a href="#" id="Chapter" data-value="' + sFullPathToFile + '">' + BIRMChapters[i].DisplayName + '' + sImg + '</a></li>';
                                sChapter += '<li data-icon="false"><a><span><label style="padding: 0x 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup"><input type="checkbox" id="NotesList" data-value="' + BIRMChapters[i].FileName + '" data-role="none" /></fieldset></label></span><span id="Chapter" data-value="' + sFullPathToFile + '">' + BIRMChapters[i].DisplayName + '</span>' + sImg + '</a></li>';
	                        }
	                        else {
                                console.log("EPUBChapters.LoadChapters: Chapter has NOT been previously downloaded. (" + BIRMChapters[i].FileName + ").")
                                //sImg = '<div class="download-icon" data-inline="true" data-textvisible="true" data-textonly="false"><a href="#" id="download_' + i + '" data-value="' + BIRMChapters[i].FileName + '" onclick="DownloadChapter(this);"><img src="img/download-40-gray-ko.png" alt="chapter needs to be downloaded"/></a></div><div class="size">' + BIRMChapters[i].Size + ' MB</div>';
                                sImg = '<span class="ui-li-count">' + BIRMChapters[i].Size + ' MB</div><a href="#" id="download_' + i + '" class="ui-icon-BIRMDownload" data-value="' + BIRMChapters[i].FileName + '" onclick="DownloadChapter(this);"></a>';
                                //sChapter += '<li><input type="checkbox" style="float: left;" id="NotesList" data-value="' + BIRMChapters[i].FileName + '" data-role="none" disabled /><div class="ChapterName">' + BIRMChapters[i].DisplayName + '</div>' + sImg + '</li>';
                                //sChapter += '<li data-icon="false"><a href="#">' + BIRMChapters[i].DisplayName + '' + sImg + '</a></li>';
                                sChapter += '<li data-icon="false"><a><span><label style="padding: 0x 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup"><input type="checkbox" id="NotesList" data-value="' + BIRMChapters[i].FileName + '" data-role="none" disabled/></fieldset></label></span><span>' + BIRMChapters[i].DisplayName + '</span>' + sImg + '</a></li>';
	                        }
                        }
                        else {
	                        console.log("EPUBChapters.LoadChapters: Chapter has NOT been previously downloaded. (" + BIRMChapters[i].FileName + ").")
	                        //sImg = '<div class="download-icon" data-inline="true" data-textvisible="true" data-textonly="false"><a href="#" id="download_' + i + '" data-value="' + BIRMChapters[i].FileName + '" onclick="DownloadChapter(this);"><img src="img/download-40-gray-ko.png" alt="chapter needs to be downloaded"/></a></div><div class="size">' + BIRMChapters[i].Size + ' MB</div>';
	                        sImg = '<div class="ui-li-count">' + BIRMChapters[i].Size + ' MB</div><a href="#" id="download_' + i + '" class="ui-icon-BIRMDownload" data-value="' + BIRMChapters[i].FileName + '" onclick="DownloadChapter(this);"><img src="img/download-40-gray-ko.png" alt="chapter needs to be downloaded"/></a>';
	                        //sChapter += '<li><div class="ChapterName">' + BIRMChapters[i].DisplayName + '</div>' + sImg + '</li>';
	                        //sChapter += '<li data-icon="false"><a href="#">' + BIRMChapters[i].DisplayName + '' + sImg + '</a></li>';
	                        sChapter += '<li data-icon="false"><a><span><label style="padding: 0x 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup"><input type="checkbox" id="NotesList" data-value="' + BIRMChapters[i].FileName + '" data-role="none" disabled/></fieldset></label></span><span>' + BIRMChapters[i].DisplayName + '</span>' + sImg + '</a></li>';
                        }
 	                }

	                sChapter += '</ul>';
	                $('#ChapterContent').append(sChapter);
	                $('#ChapterContent').find("ul[data-role='listview']").listview();

	                $("#ChapterContent a").on('click', function (evt) {
	                    evt.stopPropagation();
	                });

	                $("#ChapterContent").find("span[id='Chapter']").click(function () {
	                    var sSelectedEPUB = $(this).attr("data-value");
	                    var arrMultiFile;
	                    if ($(this).attr("data-value").indexOf(';') > -1) {
	                        arrMultiFile = $(this).attr("data-value").split(';');
	                        if (arrMultiFile.length > 0) {
	                            sSelectedEPUB = arrMultiFile[0];
	                        }
	                    }
	                    window.localStorage.setItem("Chapter", sSelectedEPUB);
	                    window.localStorage.setItem("CurrentChapterName", $(this).text());
	                    window.location = 'birm.html';
	                });

	           },
                function () { alert('window.An error occurred.'); });
	        }

	    }
	    catch (err) {
	        //Handle errors here
	        alert('EPUBChapters.LoadChapters: ' + err.message);
	    }
	}

    var oEPUBRoot;
    var oImportRoot;
	var arrChapterContent;
	var arrDirectories;
	var arrChapter;
	var arrANotes;
	var sSearchTerm;
	var oBIRMApp;
    var sImportedContent;

    var arrImportNotes = new Array();

    function startRemoveChapters() {
        oBIRMApp = new BIRM.BIRMApp();
        setRootDirectory2(function() {
            removeChapters($("input:checked"));
        });
    }

    var arrChapterFiles;
    function removeChapters(ChapterArray) {
        console.log("EPUBChapters.removeChapters: Removing chapter content.");

        if (ChapterArray.length > 0) {
            arrChapterContent = new Array();
            $.each(ChapterArray, function () {
                arrChapterContent.push(this);
            })
            deleteChapterItems(arrChapterContent.pop());
        }
    }

    function deleteChapterItems(ChapterItem) {

        console.log('EPUBChapters.deleteChapterItems: Looping through chapters selected for deletion.');

        arrChapterFiles = new Array();
        var sChapterName = $(ChapterItem).attr('data-value');
        if (sChapterName.indexOf(';') > -1) {
            arrChapterFiles = sChapterName.split(';');
        }
        else {
            arrChapterFiles.push(sChapterName);
        }
        var sBIRMChapter = sChapterName.substr(0, arrChapterFiles[0].lastIndexOf('.'));
        deleteFile(arrChapterFiles.pop(), sBIRMChapter);

    }

    function deleteFile(File, Directory) {

        console.log('EPUBChapters.deleteFile: Deleting file ' + File + '.');

        oEPUBRoot.getFile(File, { create: false }, function (fileEntry) {
            fileEntry.remove(function () {
                if (arrChapterFiles.length === 0) {
                    deleteDirectory(Directory);
                }
                else {
                    deleteFile(arrChapterFiles.pop(), Directory);
                }
            }, function () { alert('EPUBChapters.deleteFile: The chapter file does not exist.'); });
        }, function (error) { console.log('EPUBChapters.deleteFile: The chapter directory does not exist.'); getChapterDirectories(arrDirectories.pop()); });

    }

    function deleteDirectory(Chapter) {

        console.log('EPUBChapters.deleteDirectory: Deleting chapter directory ' + Chapter + '.');

        oEPUBRoot.getDirectory(Chapter, { create: false }, function (dirEntry) {
            console.log('EPUBChapters.deleteDirectory: The chapter directory exists.');

            dirEntry.removeRecursively(function () {
                console.log('EPUBChapters.deleteDirectory: The number of directory entries remaining to be removed is ' + arrChapterContent.length + '.');
                if (arrChapterContent.length > 0) {
                    deleteChapterItems(arrChapterContent.pop());
                }
                else {
                    console.log('EPUBChapters.deleteDirectory: All selected chapter directories have been deleted.');
                    window.location.reload(true);
                    //showNotification('The selected chapters have been removed.', 'btnOkDelete');
                    //ShowAlert('Notification', 'The selected chapters have been removed.', function () { window.location.reload(true); });

                    //$('#btnOkDelete').on("click", function (evt) {
                    //    evt.preventDefault();
                    //    window.location.reload(true);
                    //});

                }

            }, function () { alert('EPUBChapters.deleteDirectory: The chapter directory could not be deleted.'); });
        }, function () { alert('EPUBChapters.deleteDirectory: The chapter file could not be deleted.'); });

    }

    function deleteChapterItem(ChapterItem) {
        console.log("EPUBChapters.deleteChapterItem: Deleting a specific chapter.");

        try {

            var sChapterName = $(ChapterItem).attr('data-value');
            var sBIRMChapter = sChapterName.substr(0, sChapterName.lastIndexOf('.'));

            oEPUBRoot.getFile(sChapterName, { create: false }, function(fileEntry) {
                fileEntry.remove(function() {
                    oEPUBRoot.getDirectory(sBIRMChapter, { create: false }, function (dirEntry) {
	                    console.log('EPUBChapters.deleteChapterItem: The chapter directory exists.');

                        dirEntry.removeRecursively(function() {
                	        console.log('EPUBChapters.deleteChapterItem: The number of directory entries remaining to be removed is ' + arrChapterContent.length + '.');
	                        if (arrChapterContent.length > 0) {
	                            deleteChapterItem(arrChapterContent.pop());
	                        }
	                        else {
	                            console.log('EPUBChapters.startImport.getChapterDirectories: All selected chapter directories have been deleted.');
	                            ShowAlert('Notification',
                                          'The selected directories have been removed.',
                                          function (evt) {
                                              evt.preventDefault();
                                              window.location.reload(true);
                                          }
                                );
	                            //showNotification('The selected directories have been removed.', 'btnOkDelete');

	                            //$('#btnOkDelete').on("click", function (evt) {
	                            //    evt.preventDefault();
	                            //    window.location.reload(true);
	                            //});

	                        }

                        }, function() { alert('EPUBChapters.deleteChapterItem: The chapter directory could not be deleted.'); });
                    }, function() { alert('EPUBChapters.deleteChapterItem: The chapter file could not be deleted.'); });
                }, function() {alert('EPUBChapters.deleteChapterItem: The chapter file does not exist.');});
	        }, function (error) { console.log('EPUBChapters.deleteChapterItem: The chapter directory does not exist.'); getChapterDirectories(arrDirectories.pop()); });
        }
        catch (e) {
            alert('EPUBChapters.deleteChapterItem: Error: ' + e.message);
        }
    }

        var startImport = function (ImportData) {
        console.log('EPUBChapters.startImport: Starting the import process.');

        try {

            oBIRMApp = new BIRM.BIRMApp();
            setRootDirectory();
            oBIRMApp.GetEPUBDocuments(function (dirEntries) {
                console.log('EPUBChapters.startImport.GetEPUBDocuments: ' + dirEntries.length + ' directory entries were retrieved.');
                var BIRMChapters = oBIRMApp.BIRMChapters;
                arrDirectories = BIRMChapters;
                arrANotes = new Array();
                console.log('EPUBChapters.startImport.GetEPUBDocuments: ' + arrDirectories.length + ' chapters were retrieved.');
               getChapterDirectories(arrDirectories.pop(), ImportData);


                
                //arrJSON = getImportFileNotes();

                //arrImportNotes = buildImportNotes(arrJSON);

                //notesImport(arrImportNotes.pop());

            }, onGetDirectoriesFailed);

			

        }
        catch (e) {
            alert('EPUBChapters.startImport: An error occurred. ' + e.message);
        }
    };

//    var startImport = function (ImportDirectory, ImportFile) {
//        console.log('EPUBChapters.startImport: Starting the import process.');

//        try {

//            // arrChapterContent = new Array();
//            // arrDirectories = new Array();
//            // arrChapter = new Array();
//            // //sSearchTerm = SearchTerm;

//            // var arrJSON = new Array();

//            oBIRMApp = new BIRM.BIRMApp();


//            setRootDirectory();
//            oBIRMApp.GetEPUBDocuments(function (dirEntries) {
//                console.log('EPUBChapters.startImport.GetEPUBDocuments: ' + dirEntries.length + ' directory entries were retrieved.');
//                var BIRMChapters = oBIRMApp.BIRMChapters;
//                //arrDirectories = BIRMChapters;
//                //console.log('EPUBChapters.startImport.GetEPUBDocuments: ' + arrDirectories.length + ' chapters were retrieved.');
//               // getChapterDirectories(arrDirectories.pop(), ImportDirectory, ImportFile);


//                
//                //arrJSON = getImportFileNotes();

//                //arrImportNotes = buildImportNotes(arrJSON);

//                //notesImport(arrImportNotes.pop());

//            }, onGetDirectoriesFailed);

//			

//        }
//        catch (e) {
//            alert('EPUBChapters.startImport: An error occurred. ' + e.message);
//        }
//    };



 var getChapterDirectoriesImport = function (Chapter, data) {
	        console.log('EPUBChapters.startImport.getChapterDirectories: Getting the EPUB chapter directories to perform importing.' + Chapter);
	        try {

	            var bReturn = false;
	            var i;

	            if (Chapter != null) {

	                sBIRMChapter = Chapter.FileName;
	                sBIRMChapter = sBIRMChapter.substr(0, sBIRMChapter.lastIndexOf('.'));
	                console.log('EPUBChapters.startImport.getChapterDirectories: The chapter to be retrieved is ' + sBIRMChapter + '.');
	                oEPUBRoot.getDirectory(sBIRMChapter, { create: false }, function (dirEntry) {
	                    console.log('EPUBChapters.startImport.getChapterDirectories: The chapter directory exists.');
	                    arrChapterContent.push({ Chapter: Chapter, dir: dirEntry });

	                    console.log('EPUBChapters.startImport.getChapterDirectories: The number of directory entries remaining to be read is ' + arrDirectories.length + '.');
	                    if (arrDirectories.length > 0) {
	                        getChapterDirectories(arrDirectories.pop());
	                    }
	                    else {
	                        console.log('EPUBChapters.startImport.getChapterDirectories: All chapter content has been retrieved.');
	                        buildImportNotes(data);
	                    }

	                }, function (error) { console.log('EPUBChapters.startImport.getChapterDirectories: The chapter directory does not exist.'); getChapterDirectories(arrDirectories.pop()); });
	            }
	        }
	        catch (err) {
	            alert('EPUBChapters.startImport.getChapterDirectories: An error occurred during the search process. (' + err.message + ')');
	        }

	    }

        
	    var getChapterDirectories = function (Chapter, ImportData) {
	        console.log('EPUBChapters.startImport.getChapterDirectories: Getting the EPUB chapter directories to perform importing.' + Chapter);
	        try {

	            var bReturn = false;
	            var i;

	            if (Chapter != null) {
	                sBIRMChapter = Chapter.FileName;
	                sBIRMChapter = sBIRMChapter.substr(0, sBIRMChapter.lastIndexOf('.'));
	                console.log('EPUBChapters.startImport.getChapterDirectories: The chapter to be retrieved is ' + sBIRMChapter + '.');
	                oEPUBRoot.getDirectory(sBIRMChapter, { create: false }, function (dirEntry) {
	                    console.log('EPUBChapters.startImport.getChapterDirectories: The chapter directory exists.');
                        //getChapterNotes(Chapter, ImportData, dirEntry);
	                    arrChapterContent.push({ Chapter: Chapter, dir: dirEntry });

	                    console.log('EPUBChapters.startImport.getChapterDirectories: The number of directory entries remaining to be read is ' + arrDirectories.length + '.');
	                    if (arrDirectories.length > 0) {
	                        getChapterDirectories(arrDirectories.pop(), ImportData);
	                    }
	                    else {
	                        console.log('EPUBChapters.startImport.getChapterDirectories: All chapter content has been retrieved.');
	                        //getImportFileNotes(ImportDirectory, ImportFile);
                            buildImportNotes(ImportData);
	                    }

	                }, function (error) { console.log('EPUBChapters.startImport.getChapterDirectories: The chapter directory does not exist.'); getChapterDirectories(arrDirectories.pop(), ImportData); });
	            }
	        }
	        catch (err) {
	            alert('EPUBChapters.startImport.getChapterDirectories: An error occurred during the search process. (' + err.message + ')');
	        }

	    }

        var getChapterNotes = function(Chapter, ImportData, ChapterDir) {

        	sBIRMChapter = Chapter.FileName;
	        sBIRMChapter = sBIRMChapter.substr(0, sBIRMChapter.lastIndexOf('.'));

            ChapterDir.getFile(ChapterDir.toURL() + '/notes.json', { create: true }, function(entry){
			    console.log("Found the notes file for the chapter.");
			    function win(file) {
				    var reader = new FileReader();
				    reader.onloadend = function (evt) {
					    console.log("read success");
					    console.log(evt.target.result);
					    var origNotesJson = JSON.parse(evt.target.result);
					    //should at some point worry about note conflicts
					    
                        //var result = $.grep(ImportData, function(e) { e.NoteChapter.name === Chapter.FileName } );
                        //if (result.length > 0) {
                            var newNotes = origNotesJson.concat(ImportData);
					        console.log(newNotes);

					        function win(writer) {
						        writer.onwriteend = function(evt) {
							        console.log("truncate success");
							        writer.onwriteend = function(evt){										        	
								        console.log("write success");
							        }
								    writer.write(JSON.stringify(newNotes));
						        }
						        writer.truncate(0);
					        }

					        var fail = function(evt) {
						        console.log(error.code);
					        };

					        entry.createWriter(win, fail);
                        //}
				    };
				    reader.readAsText(file);
			    };

			    var fail = function (evt) {
				    console.log(error.code);
			    };

			    entry.file(win, fail);

		    }, onGotFilesError);

        }

//	    var getChapterDirectories = function (Chapter, ImportDirectory, ImportFile) {
//	        console.log('EPUBChapters.startImport.getChapterDirectories: Getting the EPUB chapter directories to perform importing.' + Chapter);
//	        try {

//	            var bReturn = false;
//	            var i;

//	            if (Chapter != null) {

//	                sBIRMChapter = Chapter.FileName;
//	                sBIRMChapter = sBIRMChapter.substr(0, sBIRMChapter.lastIndexOf('.'));
//	                console.log('EPUBChapters.startImport.getChapterDirectories: The chapter to be retrieved is ' + sBIRMChapter + '.');
//	                oEPUBRoot.getDirectory(sBIRMChapter, { create: false }, function (dirEntry) {
//	                    console.log('EPUBChapters.startImport.getChapterDirectories: The chapter directory exists.');
//	                    arrChapterContent.push({ Chapter: Chapter, dir: dirEntry });

//	                    console.log('EPUBChapters.startImport.getChapterDirectories: The number of directory entries remaining to be read is ' + arrDirectories.length + '.');
//	                    if (arrDirectories.length > 0) {
//	                        getChapterDirectories(arrDirectories.pop(), ImportDirectory, ImportFile);
//	                    }
//	                    else {
//	                        console.log('EPUBChapters.startImport.getChapterDirectories: All chapter content has been retrieved.');
//	                        getImportFileNotes(ImportDirectory, ImportFile);
//	                    }

//	                }, function (error) { console.log('EPUBChapters.startImport.getChapterDirectories: The chapter directory does not exist.'); getChapterDirectories(arrDirectories.pop(), ImportDirectory, ImportFile); });
//	            }
//	        }
//	        catch (err) {
//	            alert('EPUBChapters.startImport.getChapterDirectories: An error occurred during the search process. (' + err.message + ')');
//	        }

//	    }

//	    var getImportFileNotes = function (ImportDirectory, ImportFile) {

//	        console.log('EPUBChapters.startImport.getImportFileNotes: Getting the import file notes.');

//	        //oEPUBRoot.getDirectory('Import', { create: true }, function (dirEntry) {
//	       // console.log('EPUBChapters.startImport.getImportFileNotes: Got the import directory.');
//	        ImportDirectory.getFile(ImportFile, { create: false }, function (fileEntry) {
//	            //dirEntry.getFile(ImportFile, { create: false }, function (fileEntry) {
//	                console.log('EPUBChapters.startImport.getImportFileNotes: Got the notes file for importing. (' + fileEntry.fullPath + ')');

//	                fileEntry.file(function (file) {
//	                    console.log('EPUBChapters.startImport.getImportFileNotes: Got the file for importing. (' + '' + ')');
//	                    var reader = new FileReader();
//	                    reader.onload = function (evt) {
//	                        console.log('EPUBChapters.startImport.getImportFileNotes: onload.' + evt.target.result);
//	                        if (evt.target.result) {

//	                            var arrJSON = new Array();
//	                            var arrJSON = $.parseJSON(evt.target.result);
//	                            console.log('EPUBChapters.startImport.getImportFileNotes: Calling buildImportNotes.');
//	                            buildImportNotes(arrJSON)
//                                //return arrJSON
//	                        }

//	                    };

//	                    reader.onerror = function () {
//	                        alert('EPUBChapters.startImport.getImportFileNotes: An error occurred getting the json content.');
//	                    }

//	                    try {
//	                        console.log('EPUBChapters.startImport.getImportFileNotes: Reading as text.');
//	                        reader.readAsText(file);
//	                    }
//	                    catch (e) {
//	                        alert('EPUBChapters.startImport.getImportFileNotes: An error occurred getting the json content. ' + e.message);
//	                    }

//	                }, function (error) { alert('EPUBChapters.startImport.getImportFileNotes: Error getting file. ' + error.code + ' : ' + error.name); });
//	            }, onGetDirectoriesFailed);
//	        //}, onGetDirectoriesFailed);

//	    }

        var buildImportNotes = function (NotesArray) {

            console.log('EPUBChapters.startImport.buildImportNotes: Building the import notes.');
            try {

                //NotesArray = [{ "noteId": "test 1", "noteChapter": { "value": "OEBPS/birm-ch-1.xhtml", "name": "Chapter 1 Bridge Inspection Programs" }, "notedText": "Test 1", "notedItemKey": "1397612827069-e01d94db-80b3-4baa-99bd-95930cde0572" }, { "noteId": "test 2", "noteChapter": { "value": "OEBPS/birm-ch-1.xhtml", "name": "Chapter 1 Bridge Inspection Programs" }, "notedText": "Test 2", "notedItemKey": "1397613071155-280defa0-e802-4334-b3d1-554a6ef270dd" }];
                // Create array for writing to the chapter and notes files. The array
                // includes the chapter xhtml filename, the notes to be imported for that chapter,
                // and the notes filename.
                var arrChapters = new Array();
                $.each(NotesArray, function () {
                    arrChapters.push(this.noteChapter.value);
                });
                console.log('EPUBChapters.startImport.buildImportNotes: ' + arrChapters.length + ' returned chapters.');

                var arrUniqueChapters = new Array();
                arrUniqueChapters = $.grep(arrChapters, function (v, k) {
                    var sChapter = v;
                    console.log('EPUBChapters.startImport.buildImportNotes: v ' + sChapter + '.');
                    console.log('EPUBChapters.startImport.buildImportNotes: k ' + k + '.');
                    console.log('EPUBChapters.startImport.buildImportNotes: inArray ' + $.inArray(sChapter, arrChapters) + '.');
                    return $.inArray(sChapter, arrChapters) === k;
                });
                console.log('EPUBChapters.startImport.buildImportNotes: ' + arrUniqueChapters.length + ' unique chapters.');

                var arrANotes = new Array();
                arrANotes = buildUniqueChapters(arrUniqueChapters, NotesArray);
                console.log('EPUBChapters.startImport.buildImportNotes: The notes array has been returned with ' + arrANotes.length + ' notes.');

                //oJSON = ('[{"noteId":"test 1","noteChapter":{"value":"OEBPS/birm-ch-1.xhtml","name":"Chapter 1 Bridge Inspection Programs"},"notedText":"Test 1","notedItemKey":"1397612827069-e01d94db-80b3-4baa-99bd-95930cde0572"},{"noteId":"test 2","noteChapter":{"value":"OEBPS/birm-ch-1.xhtml","name":"Chapter 1 Bridge Inspection Programs"},"notedText":"Test 2","notedItemKey":"1397613071155-280defa0-e802-4334-b3d1-554a6ef270dd"}]');
                // Update the chapter xhtml and notes.json files for downloaded chapters.
                var chapter;
                var note;
                var json;

                var arrTempNotes = new Array();
                $.each(arrChapterContent, function (cIndex) {
                    chapter = this.dir;
                    console.log('EPUBChapters.startImport.buildImportNotes: The chapter is ' + chapter.toURL() + '.');

                    var chReader = chapter.createReader();
                    chReader.readEntries(function (chEntries) {

                        var sFileName;
                        var arrJSON = new Array();

                        // Get the JSON objects from the import file.
                        $.each(arrANotes, function (nIndex) {
                            note = this;
                            json = this.Notes;

                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON chapter is ' + note.ChapterFile + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notes file is ' + note.NotesFile + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteId is ' + json[0].noteId + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteChapter is ' + json[0].noteChapter + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteChapter value is ' + json[0].noteChapter.value + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteChapter name is ' + json[0].noteChapter.name + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notedText is ' + json[0].notedText + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notedItemKey is ' + json[0].notedItemKey + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notedItemKey is ' + json[0].notedItemHTML + '.');

                            // Build the JSON object for the current chapter.
                            //var chReader = chapter.createReader();
                            //chReader.readEntries(function (chEntries) {
                            var result = $.grep(chEntries, function (e) { return e.name === note.ChapterFile });

                            console.log('EPUBChapters.startImport.buildImportNotes: The search for ' + note.ChapterFile + ' found ' + result.length + '.');
                            if (result.length === 1) {
                                console.log('EPUBChapters.startImport.buildImportNotes: The chapter directory to be saved is ' + chapter.toURL() + '.');
                                note.ChapterDirectory = chapter;
                                arrTempNotes.push(note);
                            }

                            // Done reading through the chapters and the notes to build import array
                            //console.log('EPUBChapters.startImport.buildImportNotes: Chapter index is ' + cIndex + '.');
                            //console.log('EPUBChapters.startImport.buildImportNotes: Notes index is ' + nIndex + '.');
                            if (cIndex === (arrChapterContent.length - 1) && nIndex === (arrANotes.length - 1)) {
                                console.log('EPUBChapters.startImport.buildImportNotes: Done building notes array for importing.');
                                    arrANotes = new Array();
                                    $.merge(arrANotes, arrTempNotes);
                                    notesImport(arrANotes.pop());
                            }

                            //}, function (error) { alert('EPUBChapters.startImport.buildImportNotes: Read chapter directory error. (' + error.message + ')'); });

                        });

                    }, function (error) { alert('EPUBChapters.startImport.buildImportNotes: Read chapter directory error. (' + error.message + ')'); });

                    //return arrNotes;

                });

            }
            catch (e) {
                alert('EPUBChapters.startImport.buildImportNotes: ' + e.message);
            }


        }


        var buildImportNotesOld = function (NotesArray) {

            console.log('EPUBChapters.startImport.buildImportNotes: Building the import notes.');

            // Create array for writing to the chapter and notes files. The array
            // includes the chapter xhtml filename, the notes to be imported for that chapter,
            // and the notes filename.
            var arrChapters = new Array();
            $.each(NotesArray, function () {
                arrChapters.push(this.noteChapter.value);
            });
            console.log('EPUBChapters.startImport.buildImportNotes: ' + arrChapters.length + ' returned chapters.');

            var arrUniqueChapters = new Array();
            arrUniqueChapters = $.grep(arrChapters, function (v, k) {
                var sChapter = v;
                console.log('EPUBChapters.startImport.buildImportNotes: v ' + sChapter + '.');
                console.log('EPUBChapters.startImport.buildImportNotes: k ' + k + '.');
                console.log('EPUBChapters.startImport.buildImportNotes: inArray ' + $.inArray(sChapter, arrChapters) + '.');
                return $.inArray(sChapter, arrChapters) === k;
            });
            console.log('EPUBChapters.startImport.buildImportNotes: ' + arrUniqueChapters.length + ' unique chapters.');

            arrANotes = buildUniqueChapters(arrUniqueChapters, NotesArray);
            console.log('EPUBChapters.startImport.buildImportNotes: The notes array has been returned with ' + arrANotes.length + ' notes.');

            getChapterImportNotes(arrChapterContent.pop());

        }

        var getChapterImportNotes = function (CurrentChapter) {

            try {

                if (CurrentChapter !== null) {
                    // Update the chapter xhtml and notes.json files for downloaded chapters.
                    var chapter;
                    var note;
                    var json;

                    chapter = CurrentChapter.dir;
                    console.log('EPUBChapters.startImport.getChapterImportNotes: Getting the import notes for ' + chapter.toURL() + '.');

                    var chReader = chapter.createReader();
                    chReader.readEntries(function (chEntries) {

                        var sFileName;
                        var arrJSON = new Array();

                        // Get the JSON objects from the import file.
                        $.each(arrANotes, function (nIndex) {
                            note = this;
                            json = this.Notes;

                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON chapter is ' + note.ChapterFile + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notes file is ' + note.NotesFile + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteId is ' + json[0].noteId + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteChapter is ' + json[0].noteChapter + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteChapter value is ' + json[0].noteChapter.value + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON noteChapter name is ' + json[0].noteChapter.name + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notedText is ' + json[0].notedText + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notedItemKey is ' + json[0].notedItemKey + '.');
                            console.log('EPUBChapters.startImport.buildImportNotes: The JSON notedItemKey is ' + json[0].notedItemHTML + '.');

                            // Build the JSON object for the current chapter.
                            var result = $.grep(chEntries, function (e) { return e.name === note.ChapterFile });

                            console.log('EPUBChapters.startImport.buildImportNotes: The search for ' + note.ChapterFile + ' found ' + result.length + '.');
                            if (result.length === 1) {
                                console.log('EPUBChapters.startImport.buildImportNotes: The chapter directory to be saved is ' + chapter.toURL() + '.');
                                note.ChapterDirectory = chapter;
                                notesImport(note);
                            }

                        });

                        if (arrChapterContent.length > 0) {
                            getChapterImportNotes(arrChapterContent.pop());
                        }
                        else {
                            getChapterImportNotes(null);
                        }

                    }, function (error) { alert('EPUBChapters.startImport.buildImportNotes: Read chapter directory error. (' + error.message + ')'); });
                }
                else {
                    //if (arrChapterContent.length === 0) {
                        closeProgress();
                        var sAlert = 'The note import process successfully completed.';
                        var sTitle = 'Notes Importing';
                        if (navigator.platform.indexOf('Win') > -1) {
                            window.alert(sAlert, function () { }, sTitle);
                        }
                        else {
                            navigator.notification.alert(sAlert, function () { }, sTitle);
                        }
                    //}
                }
            }
            catch (e) {
                closeProgress();
                var sAlert = e.message;
                var sTitle = 'Import Error';
                if (navigator.platform.indexOf('Win') > -1) {
                    window.alert(sAlert, function () { }, sTitle);
                }
                else {
                    navigator.notification.alert(sAlert, function () { }, sTitle);
                }
            }

        }

	    var buildUniqueChapters = function (UniqueChapters, JSONArray) {

	        console.log('EPUBChapters.startImport.buildUniqueChapters: Building the unique chapters from notes.json file.');

	        // Get the unique chapters from the notes import file.
	        var arrNotes = new Array();
	        for (var i = 0; i < UniqueChapters.length; i++) {
	            var item = UniqueChapters[i];

	            // First get the unique chapters that have notes.
	            //if ($.inArray(item, result) === -1) {
	                console.log('EPUBChapters.startImport.buildUniqueChapters: The chapter with notes is ' + item + '.');
	                // Once we have the unique chapter, create an array with the unique chapter name and all the notes
	                // to be imported for that chapter.
	                var foundresult = $.grep(JSONArray, function (e) { return e.noteChapter.value === item });

	                // Load the notes object
	                console.log('EPUBChapters.startImport.buildUniqueChapters: The search for ' + item + ' found ' + foundresult.length + '.');
                    if (foundresult.length > 0 ) {
	                    var sFileName = item.substr(item.lastIndexOf('/') + 1, item.length);
	                    console.log('EPUBChapters.startImport.buildUniqueChapters: The chapter filename is ' + sFileName + '.');

	                    var oNotes = {
	                        ChapterDirectory: null,
	                        ChapterFile: null,
	                        NotesFile: null,
	                        Notes: null
	                    };

	                    oNotes.ChapterFile = sFileName;
	                    oNotes.NotesFile = 'notes.json';
	                    oNotes.Notes = foundresult;
	                    arrNotes.push(oNotes);
                    }
	            //}
	        }

	        return arrNotes;
	    }

	    var notesImport = function (Note) {

	        try {
	            console.log('EPUBChapters.startImport.notesImport: Starting the notes import process.');

	            var oDirectory = Note.ChapterDirectory;
	            var sNotesFile = Note.NotesFile;
	            var sNotes = Note.Notes;

	            console.log('EPUBChapters.startImport.notesImport: The chapter file is ' + Note.ChapterFile + '.');
	            console.log('EPUBChapters.startImport.notesImport: The notes directory is ' + oDirectory.fullPath + '.');
	            console.log('EPUBChapters.startImport.notesImport: The notes file is ' + sNotesFile + '.');
	            console.log('EPUBChapters.startImport.notesImport: The notes item HTML is ' + sNotes.notedItemHTML + '.');

	            // if the notes.json file already exists, do not create the file.
                // if the notes.json file does not exist, create it.
	            oDirectory.getFile(sNotesFile, { create: false }, function (fileEntry) {
	                console.log('EPUBChapters.startImport.notesImport: The notes file already exists.');
	                writeNotes(fileEntry, Note, true);
	            },
                function () {
                    oDirectory.getFile(sNotesFile, { create: true }, function (fileEntry) {
                        console.log('EPUBChapters.startImport.notesImport: The notes file had to be created.');
                        writeNotes(fileEntry, Note, false);
                    }, function () { alert('Error creating file.');});
                });
                //oDirectory.getFile(sNotesFile, { create: true }, function (fileEntry) {
	            //    console.log('EPUBChapters.startImport.notesImport: The notes file already exists.');
	            //    writeNotes(fileEntry, Note, true);
	            //},
                //function () {
                //    alert('EPUBChapters.startImport.notesImport: Error.');
                //});
	        }
	        catch (e) {
	            alert('EPUBChapters.startImport.notesImport: ' + e.message);
	        }

	    }

	    var writeNotesOld = function (NotesFile, Note, Append) {

	        console.log('EPUBChapters.startImport.writeNotes: Writing the notes to notes.json. ' + Note.Notes[0].notedItemHTML);
	        try {
	            NotesFile.createWriter(function (writer) {
	                writer.onwrite = function (evt) {
	                    NotesFile.getParent(function (parent) {
	                        console.log('EPUBChapters.startImport.writeNotes: The note just before readChapterFile is ' + Note.Notes[0].notedItemHTML + '.');
	                        console.log('EPUBChapters.startImport.writeNotes: The note just before readChapterFile is ' + Note.Notes[0].notedText + '.');
	                        readChapterFile(parent, Note);
	                    }, function () { alert('Could not get parent directory.'); });
	                };

	                // If the notes.json file already exists, we are appending the new json to the file.
	                // If the notes.json files does not already exist, we just write to the file.
	                var fail = function (evt) { console.log(error); }


	                if (Append === true) {
	                    function win(file) {
	                        var reader = new FileReader();

	                        reader.onloadend = function (evt) {
	                            console.log("hey");
	                            console.log(evt);
	                            console.log(evt.target);
	                            console.log(evt.target.result);
	                            console.log(evt.target.results);

	                            if (evt.target.results) {
	                                var arrExistingNotes = $.parseJSON(evt.target.results);

	                                console.log('EPUBChapters.startImport.writeNotes: The number of existing notes in notes.json is ' + arrExistingNotes.length + '.');

	                                // Seeking to length - 1 to account for the closing ] in notes.json.
	                                console.log('EPUBChapters.startImport.writeNotes: The number of notes being appended to notes.json is ' + Note.Notes.length + '.');
	                                $.each(Note.Notes, function () {
	                                    var sImportNote = JSON.stringify(this.notedText);
	                                    var sImportNoteLocation = this.notedItemHTML;
	                                    var sNotes = '';
	                                    var bFound = false;

	                                    $.each(arrExistingNotes, function () {
	                                        console.log('EPUBChapters.startImport.writeNotes: The existing notes in notes.json is ' + arrExistingNotes + '.');
	                                        var sExistingNote = this.notedText;
	                                        var sExistingNoteLocation = this.notedItemHTML;
	                                        console.log('EPUBChapters.startImport.writeNotes: The current note that has been read is ' + sExistingNote + '.');
	                                        console.log('EPUBChapters.startImport.writeNotes: The current note item HTML is ' + sExistingNoteLocation + '.');
	                                        if (sImportNoteLocation === sExistingNoteLocation) {
	                                            bFound = true;
	                                            sNotes += ',' + sExistingNote + ' ' + sImportNote;
	                                        }

	                                    });

	                                    if (bFound === false) {
	                                        sNotes += ',' + sImportNote;
	                                    }

	                                    this.notedText = sNotes;
	                                });

	                                console.log('EPUBChapters.startImport.writeNotes: The notes just before writing are ' + sNotes + '.');

	                                writer.seek(0);
	                                writer.write(Note.Notes);
	                            }
	                        }
	                        console.log('EPUBChapters.startImport.writeNotes: Reading the notes file ' + NotesFile.toURL() + '.');
	                        reader.readAsText(file);
	                    }

	                    NotesFile.file(win, fail);


	                }
	                else {
	                    console.log('EPUBChapters.startImport.writeNotes: The notes are not being appended to notes.json.');
	                    writer.write(Note.Notes);
	                }
	            }, function () { alert('Could not create writer.'); });

	        }
	        catch (err) {
	            alert('EPUBChapters.startImport.writeNotes: An error occurred. (' + e.message + ')');
	        }
	    }

	    var writeNotes = function (NotesFile, Note, Append) {

	        console.log('EPUBChapters.startImport.writeNotes: Writing the notes to notes.json. ' + Note.Notes[0].notedItemHTML);
	        console.log('EPUBChapters.startImport.writeNotes: Writing notes for the chapter file. ' + Note.ChapterFile + '.');
	        console.log('EPUBChapters.startImport.writeNotes: The note just before readChapterFile is ' + Note.Notes[0].notedText + '.');

	        try {
	            var oNote;

	        NotesFile.createWriter(function (writer) {
	            writer.onwrite = function (evt) {
	                writer.onwrite = function (evt) {
	                    console.log('notes file ' + NotesFile.fullPath);
	                    NotesFile.getParent(function (parent) {
	                        readChapterFile(parent, Note);
	                    }, function () { alert('Could not get parent directory.'); });
	                };
	                console.log('writing notes ' + JSON.stringify(Note.Notes));
	                writer.write(JSON.stringify(Note.Notes));
	            };

	            // If the notes.json file already exists, we are appending the new json to the file.
                // If the notes.json files does not already exist, we just write to the file.
	            var fail = function(evt){console.log(error);}


	            if (Append === true) {
	                function win(file) {
	                	var reader = new FileReader();

	                	reader.onloadend = function (evt) {
		                	console.log("hey"); 
		                	//console.log(evt);
		                	//console.log(evt.target);
		                	console.log(evt.target.result);
		                	//console.log(evt.target.results);

		                    if (evt.target.result) {
		                        var arrExistingNotes = $.parseJSON(evt.target.result);

		                        console.log('EPUBChapters.startImport.writeNotes: The number of existing notes in notes.json is ' + arrExistingNotes.length + '.');

		                        // Seeking to length - 1 to account for the closing ] in notes.json.
		                        console.log('EPUBChapters.startImport.writeNotes: The number of notes being appended to notes.json is ' + Note.Notes.length + '.');
		                        $.each(Note.Notes, function () {
		                            //var sImportNote = JSON.stringify(this.notedText);
		                            var sImportNote = this.notedText;
		                            var sImportNoteLocation = this.notedItemHTML;
		                            var sNotes = '';
		                            var bFound = false;

		                            $.each(arrExistingNotes, function () {
		                                console.log('EPUBChapters.startImport.writeNotes: The existing notes in notes.json is ' + arrExistingNotes + '.');
		                                var sExistingNote = this.notedText;
		                                var sExistingNoteLocation = this.notedItemHTML;
		                                console.log('EPUBChapters.startImport.writeNotes: The current note that has been read is ' + sExistingNote + '.');
		                                console.log('EPUBChapters.startImport.writeNotes: The current note item HTML is ' + sExistingNoteLocation + '.');
		                                if (sImportNoteLocation === sExistingNoteLocation) {
		                                    bFound = true;
		                                    //sNotes += ',' + sExistingNote + ' ' + sImportNote;
		                                    this.notedText = sExistingNote.concat('\n' + sImportNote);
		                                }
		                            });

		                            if (bFound === false) {
		                                arrExistingNotes.push(this);
		                            }

		                            //this.notedText = sNotes;
		                        });

		                        console.log('EPUBChapters.startImport.writeNotes: The notes just before writing are ' + JSON.stringify(arrExistingNotes) + '.');

		                        //oNote = Note;
		                        Note.Notes = arrExistingNotes;

		                        writer.truncate(0);
		                        //writer.seek(0);
		                        //writer.write(Note.Notes);
		                    }
		                }
		                console.log('EPUBChapters.startImport.writeNotes: Reading the notes file ' + NotesFile.toURL() + '.');
		                reader.readAsText(file); 
	            }

	            NotesFile.file(win, fail);


	            }
	            else {
	                console.log('EPUBChapters.startImport.writeNotes: The notes are not being appended to notes.json.');
	                //writer.write(Note.Notes);
	                //oNote = Note;
	                writer.truncate(0);
	            }
	        }, function () { alert('Could not create writer.'); });

	        }
	        catch (err) {
	            alert('EPUBChapters.startImport.writeNotes: An error occurred. (' + e.message + ')');
	        }
	    }

	    var readChapterFile = function (Directory, Note) {

	        console.log('EPUBChapters.startImport.readChapterFile: Reading the EPUB chapter file ' + Note.ChapterFile + '.');

	        Directory.getFile(Note.ChapterFile, { create: false }, function (fileEntry) {
	            fileEntry.file(function (file) {
	                console.log('EPUBChapters.startImport.readChapterFile: The chapter file has been found and retrieved.');
	                var reader = new FileReader();
	                reader.onloadend = function (evt) {
	                    if (evt.target.result) {
	                        try {
	                            //alert('EPUBChapters.startImport.readChapterFile: The content has been updated.');
	                            var domCode = $.parseXML(evt.target.result),
                                    $bodyElm = $(domCode).find('body *');
	                            $.each(Note.Notes, function () {
	                                var Note = this;
	                                
	                                //alert('EPUBChapters.startImport.readChapterFile: note.notedItemHTML is ' + Note.notedItemHTML);
	                                var sItemHTML = Note.notedItemHTML
	                                //var regExp = new RegExp(Note.notedItemHTML, 'i');
	                                //if (regExp.test($(bodyElm).text())) {
	                                    //alert('EPUBChapters.startImport.readChapterFile: The content has been found for updating the node.');
	                                    //var oNode = $(Note.notedItemHTML).find("p");
	                                   // alert('EPUBChapters.startImport.readChapterFile: oNode is ' + oNode);
	                                
	                                    //alert('EPUBChapters.startImport.readChapterFile: The bodyElm html is ' + $bodyElm.html() + '.');
	                                    $bodyElm.each(function () {
	                                        // Remove the xmlns attribute to compare the noted item's HTML
                                            // with the current node.
	                                        var DOCElement = $(this);
	                                        //alert('EPUBChapters.startImport.readChapterFile: The DOCElement is ' + DOCElement.html() + '.');
	                                        var RawDOMElement = this;
	                                        if (DOCElement.children().length !== 0) {
	                                            DOCElement.contents().filter(function () {
	                                                var ElementNode = $(this);
	                                                var RawElementNode = this;
	                                                var sHTML;
	                                                //alert('EPUBChapters.startImport.readChapterFile: node type. ' + RawElementNode.nodeType);
	                                                if (RawElementNode.nodeType === 1) {
	                                                    //alert('EPUBChapters.startImport.readChapterFile: node innerHTML . ' + RawElementNode.innerHTML);
	                                                    //alert('EPUBChapters.startImport.readChapterFile: node outerHTML . ' + RawElementNode.outerHTML);
	                                                    sHTML = $('<div/>');
                                                        sHTML.append(ElementNode.prop('outerHTML'));
	                                                    //var $HTML = $(sHTML).find('*').removeAttr('xmlns');
	                                                    $(sHTML).find('*').removeAttr('xmlns');
	                                                    ////alert('EPUBChapters.startImport.readChapterFile: node sHTML parsed . ' + sHTML.html());
	                                                    ////alert('EPUBChapters.startImport.readChapterFile: note html. ' + sItemHTML);

	                                                    if (sHTML.text() === $(sItemHTML).text()) {
	                                                        //alert('EPUBChapters.startImport.readChapterFile: Found where to insert the note in the chapter content.');
	                                                        ElementNode.attr("notekey", Note.notedItemKey);
	                                                        //alert('EPUBChapters.startImport.readChapterFile: HTML after key added is . ' + ElementNode.prop('outerHTML'));
	                                                    }
	                                                }
	                    

	                                                //if ($.trim(this.nodeValue) !== '' &&  this.nodeValue === oNode) {


	                                                    ////alert('The content is ' + evt.target.result + '.');
	                                                    //var sHTML = evt.target.result;
	                                                    //var sHTMLLen = sHTML.length;
	                                                    ////$('_idParaDest-1').attr('notekey', )
	                                                    //var sIndex = sHTML.indexOf('<p id="_idParaDest-1" class="chapter-number">');
	                                                    //var sFoundStrLen = '<p id="_idParaDest-1" class="chapter-number">'.length;
	                                                    ////alert(sIndex);
	                                                    //var s1 = sHTML.substr(0, sIndex - 1);
	                                                    //var s2 = sHTML.substr(sIndex, sHTMLLen);
	                                                    //////var domCode = $(evt.target.result);
	                                                    //////var domCode = $($.parseXML(evt.target.result));
	                                                    ////console.log('EPUBChapters.startImport.readChapterFile: The domCode is ' + domCode.html() + '.');
	                                                    ////var bodyElm = domCode.find('.chapter-number');
	                                                    ////alert('EPUBChapters.startImport.readChapterFile: The bodyElm is ' + bodyElm.length + '.');
	                                                    ////alert('EPUBChapters.startImport.readChapterFile: Setting div.');
	                                                    ////var noteKey = $('<div/>');
	                                                    ////alert('EPUBChapters.startImport.readChapterFile: The chapter file value is ' + Note.ChapterFile + '.');
	                                                    //var sKey = '';
	                                                    //for (x = 0; x < Note.Notes.length; x++) {
	                                                    //    var oNote = Note.Notes[x];
	                                                    //    sKey += '<p notekey="' + oNote.notedItemKey + '" ></p>';
	                                                    //    //alert('EPUBChapters.startImport.readChapterFile: The noteKey value is ' + oNote.notedItemKey + '.');
	                                                    //    //noteKey.attr('noteKey', oNote.notedItemKey);
	                                                    //    //alert('EPUBChapters.startImport.readChapterFile: Prepending the imported notes.');
	                                                    //    //domCode.find('.chapter-number').prepend(noteKey);
	                                                    //    //bodyElm.prepend(noteKey);
	                                                    //}
	                                                    //var s = s1 + sKey + s2;
	                                                    

	                                                //}
	                                            });
	                                        }
	                                    });
	                                //};
	                            });
	                            //alert('EPUBChapters.startImport.readChapterFile: Calling write chapter file.' + $bodyElm.html());
	                            //$(domCode).find('body').html($bodyElm.html());

	                            //var xmlFinalDoc = $.parseXML(domCode);
	                            var xmlString;
	                            if (window.ActiveXObject) {
	                                xmlString = domCode.xml;
	                            }
	                                // code for Mozilla, Firefox, Opera, etc.
	                            else {
	                                xmlString = (new XMLSerializer()).serializeToString(domCode);
	                            }
	                            //alert('EPUBChapters.startImport.readChapterFile: Calling write chapter file.' + xmlString);
	                            writeChapterFile(fileEntry, xmlString);
	                        }
	                        catch (e) {
	                            alert('EPUBChapters.startImport.readChapterFile: An error occurred. (' + e.message + ')');
	                        }

	                    }
	                };
	                reader.readAsText(file);

	            }, onGetDirectoriesFailed);
	        }, onGetDirectoriesFailed);
	    }

	    var writeChapterFile = function (FileEntry, HTMLContent) {

	        console.log('EPUBChapters.startImport.writeChapterFile: Adding notes and references to the chapter file.');
	        FileEntry.createWriter(function (writer) {
	            writer.onwrite = function () {
	                    if (arrANotes.length > 0) {
	                        notesImport(arrANotes.pop());
	                    }
	                    else {
	                        closeProgress();
	                        var sAlert = 'The note import process successfully completed.';
	                        var sTitle = 'Notes Importing';
	                        if (navigator.platform.indexOf('Win') > -1) {
	                            window.alert(sAlert, function () { }, sTitle);
	                        }
	                        else {
	                            navigator.notification.alert(sAlert, function () { }, sTitle);
	                        }
	                    }
	                }
	                writer.write(HTMLContent);
	            }, function (error) { alert('File writer could not be create.'); });
	    }


	var startExport = function (SearchTerm) {
	    console.log('epubChapters.startExport: Starting export.');

	    arrChapterContent = new Array();
	    arrDirectories = new Array();
	    arrChapter = new Array();
	    sSearchTerm = SearchTerm;
	    var arrSelectedChapters = $("input:checked");

        oBIRMApp = new BIRM.BIRMApp();
        setRootDirectory();
        oBIRMApp.GetEPUBDocuments(function (dirEntries) {
	        var BIRMChapters = oBIRMApp.BIRMChapters;
            $.each(arrSelectedChapters, function() {
                var sChapterName = $(this).attr('data-value');
                var result = $.grep(BIRMChapters, function (e) { return e.FileName == sChapterName; });
                if (result.length > 0) {
                    arrDirectories.push({ DisplayName:result[0].Displayname, FileName:result[0].FileName, YoutubeID:result[0].YoutubeID, Size:result[0].Size });
                }
            });
	        getFileContent(arrDirectories.pop(), 'notes.json');

	    }, onGetDirectoriesFailed);

	};

	var onGetDirectoriesFailed = function (error) {
	    alert('Search.onGetDirectoriesFailed: An error occurred while getting the directories. (Error Code: ' + error.code + ')');
	}

	var setRootDirectory = function () {
	    console.log('EPUBChapters.setRootDirectory: Setting the root directory.');
	    try {
	        var sAppRoot = oBIRMApp.AppDirectory;
	        var sEPUBRoot = oBIRMApp.EPUBDirectory;

	        var oFS = new BIRM.FileSystem();
	        oFS.getDirectory(sAppRoot, true, function (dirEntry) {
	            console.log('EPUBChapters.setRootDirectory: Got the root directory. (' + dirEntry.toURL() + ')');
	            dirEntry.getDirectory(sEPUBRoot, { create: true }, function (epubEntry) {
	                console.log('EPUBChapters.setRootDirectory: Got the EPUB directory. (' + epubEntry.toURL() + ')');
	                oEPUBRoot = epubEntry;
	            }, onGetDirectoriesFailed);
	        }, onGetDirectoriesFailed);
	    }
	    catch (error) {
	        alert('EPUBChapters.setRootDirectory: An error occurred. (' + error.message + ')');
	    }
	}

    var setRootDirectory2 = function (callback) {
	    console.log('EPUBChapters.setRootDirectory: Setting the root directory.');
	    try {
	        var sAppRoot = oBIRMApp.AppDirectory;
	        var sEPUBRoot = oBIRMApp.EPUBDirectory;

	        var oFS = new BIRM.FileSystem();
	        oFS.getDirectory(sAppRoot, true, function (dirEntry) {
	            console.log('EPUBChapters.setRootDirectory: Got the root directory. (' + dirEntry.toURL() + ')');
	            dirEntry.getDirectory(sEPUBRoot, { create: true }, function (epubEntry) {
	                console.log('EPUBChapters.setRootDirectory: Got the EPUB directory. (' + epubEntry.toURL() + ')');
	                oEPUBRoot = epubEntry;
                    callback();
	            }, onGetDirectoriesFailed);
	        }, onGetDirectoriesFailed);
	    }
	    catch (error) {
	        alert('EPUBChapters.setRootDirectory: An error occurred. (' + error.message + ')');
	    }
	}

	var getFileContent = function (Chapter, File) {
		    console.log('Search.getFileContent: Getting the file content to perform the searching process.');
		    try {

		        var i;

		        if (Chapter != null) {
		            sBIRMChapter = Chapter.FileName;
		            sBIRMChapter = sBIRMChapter.substr(0, sBIRMChapter.lastIndexOf('.'));
		            console.log('Search.getFileContent: The chapter to be retrieved is ' + sBIRMChapter + '.');
		            oEPUBRoot.getDirectory(sBIRMChapter, { create: false }, function (dirEntry) {
		                console.log('Search.getFileContent: The chapter directory exists.');
		                var chReader = dirEntry.createReader();
		                chReader.readEntries(function (chEntries) {
		                    var x;
		                    for (x = 0; x < chEntries.length; x++) {
		                        console.log('Search.getFileContent: The chapter entry is ' + chEntries[x].name + '.');
		                        console.log('Search.getFileContent: The filename passed in to search for is ' + File + '.');
		                        if (chEntries[x].name === File) {
		                            alert('Search.getFileContent: The notes file was found.');
		                            arrChapterContent.push({ Chapter: Chapter, chapterfile: chEntries[x].name, dir: dirEntry });
		                        }
		                    }

		                    console.log('Search.getFileContent: Directories remaining to search ' + arrDirectories.length + '.');
		                    if (arrDirectories.length > 0) {
		                        getFileContent(arrDirectories.pop(), File);
		                    }
		                    else {
		                        console.log('Search.getFileContent: All chapter content has been retrieved.');
		                        searchChapters(arrChapterContent);
		                    }

		                }, function (error) { alert('read chapter directory error'); });
		            }, function (error) { console.log('Search.getFileContent: The chapter directory does not exist.'); getFileContent(arrDirectories.pop(), File); });
		        }
		    }
		    catch (err) {
		        alert('Search.getFileContent: An error occurred during the search process. (' + err.message + ')');
		    }
		}

	var searchChapters = function (Files) {

	    console.log('Search.searchChapters: Searching chapters. ' + arrChapterContent.length);
	    try {
	        var oFiles = new Array();
	        oFiles = arrChapterContent;
	    }
	    catch (err) {
	        alert('Search.searchChapters: An error occurred during the search process. (' + err.message + ')');
	    }

	    var readChapters = function (File, callback) {
	        console.log('Search.readChapters: Reading in the chapter content and storing in an array for processing.');
	        var chEntry = File.dir;

	        chEntry.getFile(File.chapterfile, { create: false }, function (fileEntry) {
	            console.log('Search.readChapters: The file entry is ' + fileEntry.toURL() + '.');
	            fileEntry.file(function (file) {
	                console.log('Search.readChapters: The chapter file content has been found and retrieved. (' + file.name + ')');
	                var reader = new FileReader();
	                reader.onloadend = function (evt) {
	                    if (evt.target.result) {
	                        var sContentString = evt.target.result;
	                        //alert('the content before stringify is ' + sContentString);
	                        //sContentString = sContentString.substr(1, sContentString.length - 2);
	                        //alert('the content after stringify is ' + sContentString);
	                        arrChapter.push({ Chapter: File.Chapter, content: sContentString });
	                    }

	                    if (oFiles.length > 0) {
	                        readChapters(oFiles.pop(), callback);
	                    }
	                    else {
	                        console.log('Search.readChapters: The chapter file content has been found and read. (' + file.name + ')');
	                        callback(arrChapter);
	                    }
	                };
	                reader.readAsText(file);
	            }, function (error) { alert('Search.readChapters: An error occurred while getting the file. (Error Code: ' + error.code + ')'); })
	        }, function (error) { alert('Search.readChapters: An error occurred while getting the file. (Error Code: ' + error.code + ')'); })

	    }

	    readChapters(oFiles.pop(), function (ChapterContent) {

	        console.log('EPUBChapters.searchChapters: Reading the chapter content and performing the actual search on the content.');
	        try {

	            var sContent = '';
	            ChapterContent.forEach(function (Chapter) {
	                var arrContentTemp = new Array();
                    if (sContent.length > 0) {
                        arrContentTemp = JSON.parse($.trim(sContent));
                    }
                    //alert('arrContentTemp.length ' + arrContentTemp.length);

	                var arrTemp = new Array();
	                arrTemp = JSON.parse($.trim(Chapter.content));
	                //alert('arrTemp.length ' + arrTemp.length);

	                var arrCombined = new Array();
	                arrCombined[0] = $.merge(arrContentTemp, arrTemp);

	                //alert('string before stringify ' + arrCombined[0]);
	                sContent = JSON.stringify(arrCombined[0]);
	                //alert('string after stringify ' + sContent);

	                //sContent = $.trim(sContent) + $.trim(Chapter.content);
	            });
	            //sContent = JSON.parse('[' + sContent + ']');
	            //alert('complete exported JSON ' + sContent);

	            if (sContent !== null) {
	                
	                //do ajax request to send to person
	                var toEmail = window.localStorage.getItem("toEmail");
	        		console.log("did exporting");
	        		console.log(sContent);

                    var dnow = new Date();
                    var outStr = dnow.getFullYear().toString() + '_' + (dnow.getMonth() + 1).toString() + '_' + dnow.getDate().toString() + '_' + dnow.getHours().toString() + '_' + dnow.getMinutes().toString() + '_' + dnow.getSeconds().toString();
                    alert('the out string ' + outStr);
                    var outFileName = window.localStorage.getItem("exportFileName") + '.json';  //'notes_' + outStr + '.json';
                    //var outFileName = 'notes_for_demo.json';
                    alert('the filename ' + outFileName);
	                $.ajax({
                        type: "POST",
	                	url: "http://test.ideationinc.com/BIRMPush/export.php",
	                	data: {from: window.localStorage.getItem("email"), to: window.localStorage.getItem("toEmail"), json: sContent, filename: outFileName }
	                }).done(function(data){
	                	console.log(data);

	                	if (data == "success") {
	                	    setTimeout(function () {
	                	        closeProgress();
	                	        setTimeout(function () {
	                	            ShowAlert('Notification',
                                              'The export file was successfully sent.',
                                              function (evt) {
                                                  evt.preventDefault();
                                                  window.location.reload(true);
                                              }
                                    );
	                	            //showNotification('The export file was successfully sent.', 'btnOkExport');

	                	            //$('#btnOkExport').on('click', function (evt) {
	                	            //    evt.preventDefault();
	                	            //    window.location.reload(true);
	                	            //});

	                	        }, 400);
	                	    }, 300);
	                	}
	                });



//	                oEPUBRoot.getFile('notes_export.json', { create: true }, function (fileEntry) {
//	                    fileEntry.createWriter(function (writer) {
//	                        writer.onwrite = function () {
//	                            alert('The export file was successfully created.');
//	                        }
//	                        writer.write(sContent);



//	                    }, function (error) { alert('File writer could not be create.'); });
//	                }, function (error) { alert('The export file could not be created');});

	            } else {
	                //showNotification('No notes have been saved for exporting.', null);
	                ShowAlert('Notification',
                              'No notes have been saved for exporting.',
                              function (evt) { }
                    );
	            }
	        }
	        catch (e) {
	            alert('Search.searchChapters: An error occurred while performing the search. (Error Code: ' + e.message + ')');
	        }
	    });

	}

	/* Page level event listeners. */


	BIRM.EPUBChapter = function() { };	

	/**
	 * Initializes the BIRM mobile application
	 *
	 */	
	BIRM.EPUBChapter.prototype.GetChapters = function () {

		console.log('EPUBChapter.GetChapters: Getting EPUB chapters.');
		var oBIRMApp = new BIRM.BIRMApp();
		oBIRMApp.GetEPUBDocuments(onGotChapters, onGotChaptersError);
	
	};
	
			
}());

function showSpinner(title, msg, showtheme) {

    $('#popupProgress h1').html(title);
    $('#popupProgress h3').html(msg);

    var $this = $(this),
    theme = $this.jqmData("theme") || showtheme,
    msgText = $this.jqmData("msgtext") || msg,
    textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
    textonly = !!$this.jqmData("textonly");
    html = $this.jqmData("html") || '';
    $.mobile.loading("show", {
        text: msgText,
        textVisible: true,
        theme: theme,
        textonly: false,
        html: html
    });

}

function closeProgress() {
    $.mobile.loading("hide");
}

function isConnected() {

    var bIsConnected = true;
    var oNetConn = new BIRM.Connection();

    return bIsConnected;
}

function getConnectionType() {

    console.log('EPUBChapters.getConnectionType: Getting the connection type.')
    var oNetConn = new BIRM.Connection();
    var sConnType = oNetConn.GetConnectionType();
    console.log('Video.getConnectionType: The connection type is ' + sConnType + '.')
    return sConnType;

}

function showPrompt(ConfigSetting) {

    console.log('EPUBChapters.showPrompt: Checking to show prompt.')
    var bShowPrompt = false;
    var sConfigSetting = ConfigSetting;
    var sConnType = getConnectionType();

    console.log('EPUBChapters.showPrompt: The download configuration setting is ' + sConfigSetting);
    console.log('EPUBChapters.showPrompt: The connection type is ' + sConnType);
    if (sConfigSetting.toLowerCase() === 'alwaysask') {
        bShowPrompt = true;
    }
    else {
        if (sConnType.toLowerCase().indexOf('cell') > -1 && sConfigSetting.toLowerCase() === 'wifi') {
            bShowPrompt = true;
        }
    }

    console.log('EPUBChapters.showPrompt: Show prompt is ' + bShowPrompt + '.')
    return bShowPrompt;
}

function DownloadChapter(obj) {

    sVideo = $('#' + obj.id).attr("data-value");
    console.log('EPUBChapters.DownloadVideo: The video to be downloaded is ' + sVideo + '.')
    if (isConnected) {

        var sConnType = getConnectionType();
        var sConfigSetting = '';
        var oDB = new BIRM.Database();
        console.log('EPUBChapters.getDownloadConfigSetting: Get the download configuration setting.')
        oDB.getDownloadConfig(function (transaction, results) {
            if (results.rows.length > 0) {
                sConfigSetting = results.rows.item(0)['Value'];
                var bShowPrompt = showPrompt(sConfigSetting);

                if (bShowPrompt) {
                    //$('#popupDownloadWarning').popup('open');
                    ShowConfirmation('Warning',
                                     'When performing a download, it is recommended to use a WiFi connection.\n\nContinue downloading?',
                                     function (buttonIndex) {
                                         if (buttonIndex === 2) {
                                             startDownload();
                                         }
                                     },
                                     ['No', 'Yes']
                    );
                }
                else {
                    console.log("Setup.DownloadEPUB: Downloading video " + sVideo + ".");
                    startDownload();
                }

            }
        }, function () { alert('An error occurred.'); });
    }
    else {
        alert('No internet connection exist for downloading the video.');
    }
}

var sServerURL;
var oEPUBDir;
var arrDownloadList;
function startDownload() {

    console.log("EPUBChapters.startDownload: Starting the download process.");
    showSpinner('Download Progress', 'Downloading...', 'a');
    //navigator.notification.activityStart('Download Progerss', 'Downloading...');

    var oBIRMApp = new BIRM.BIRMApp();
    var sAppDirectory = oBIRMApp.AppDirectory;
    var sEPUBDirectory = oBIRMApp.EPUBDirectory;
    sServerURL = oBIRMApp.EPUBDownloadServerURL;

    console.log("EPUBChapters.startDownload: The AppDirectory was set to " + sAppDirectory + ".");
    console.log("EPUBChapters.startDownload: The ServerURL was set to " + sServerURL + ".");
    try {
        var oFS = new BIRM.FileSystem();
        oFS.getDirectory(sAppDirectory, true, function (dirEntry) {
            console.log('EPUBChapters.startDownload: Directory ' + dirEntry.toURL() + ' created or exists.');
            dirEntry.getDirectory(sEPUBDirectory, { create: true, exclusive: false }, function (dirEPUBEntry) {
                console.log('EPUBChapters.startDownload: Directory ' + dirEPUBEntry.toURL() + ' created or exists.');

                oEPUBDir = dirEPUBEntry;
                arrDownloadList = new Array();
                arrDownloadList = sVideo.split(';');
                processDownloads(sServerURL, dirEPUBEntry, arrDownloadList.pop());
                //var oDL = new BIRM.Download();
                //oDL.DownloadEPUB(sServerURL, dirEPUBEntry, sVideo, onDownloadSuccess, onDownloadError);

            }, function () { });
        }, function () { });
    }
    catch (e) {
        closeProgress();
        console.log("EPUBChapters.DownloadVideo: Error - " + e.message + ".");
    }

}

function processDownloads(serverURL, EPUBDir, download) {

    try {
        var oDL = new BIRM.Download();
        oDL.DownloadEPUB(sServerURL, oEPUBDir, download, onDownloadSuccess, onDownloadError);
    }
    catch (e) {

    }
}

function onDownloadSuccess(entry) {
    console.log("EPUBChapters.onDownloadSuccess: Download was successful.");

    if (!window.FileReader || !window.ArrayBuffer) {
        alert("You will need a recent browser to use this demo :(");
        return;
    }

    try {

        console.log('EPUBChapters.onDownloadSuccess: Getting the directory for the downloaded file.');

        var sFileNoExt = entry.name.split('.');
        var bMultiPart = false;

        // Handle multi-part file names so that all files are extracted in
        // the same chapter directory.
        if (sFileNoExt[0].indexOf('-pt') > -1) {
            sFileNoExt = sFileNoExt[0].split('-');
            bMultiPart = true;
        }

        entry.getParent(function (dirDownloadEntry) {
            console.log('parent directory is ' + dirDownloadEntry.toURL());

            dirDownloadEntry.getDirectory(sFileNoExt[0], { create: true, exclusive: false }, function (dirEntry) {
                entry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (evt) {
                        try {
                            var zip = new JSZip(this.result);

                            $.each(zip.files, function (index, zipEntry) {
                                console.log('EPUBChapters.onDownloadSuccess: The EPUB entry in the EPUB file is ' + zipEntry.name + '.');
                                var unZippedFile = zip.file(zipEntry.name);

                                if (unZippedFile != undefined || unZippedFile != null) {
                                    var sExt = zipEntry.name.substr(zipEntry.name.lastIndexOf('.') + 1, zipEntry.name.length);

                                    if (sExt === 'xhtml' || sExt === 'html') {
                                        var sFileName = zipEntry.name.substr((zipEntry.name.lastIndexOf('/') + 1), zipEntry.name.length);
                                        var sEPUBDir = zipEntry.name.substr(0, zipEntry.name.lastIndexOf('/'));

                                        console.log('EPUBChapters.onDownloadSuccess: The directory for unpacking is ' + dirEntry.toURL() + '.');
                                        if ((bMultiPart === false) || (bMultiPart === true && sFileName.substr(0, 2).toLowerCase !== "toc")) {
                                            dirEntry.getFile(sFileName, { create: true, exclusive: false }, function (fileEntry) {
                                                fileEntry.createWriter(
                                                    function (writer) {
                                                        writer.onwriteend = function (evt) {
                                                            console.log("EPUBChapters.onDownloadSuccess.writer.onwriteend: Wrote the contents of the file " + sFileName + ".");
                                                        };
                                                        writer.write(unZippedFile.asText());
                                                    }, function (error) { alert('EPUBChapters.onDownloadSuccess: Create file writer error: ' + error.code); }
                                                )
                                            }, function (error) { alert('get file error in IF ' + error.code); }
                                            );
                                        }
                                    }
                                }
                            });

                            // Recursive call to process multiple downloads.
                            if (arrDownloadList.length === 0) {
                                closeProgress();
                                //navigator.notification.activityStop();
                                window.location.reload(true);
                            }
                            else {
                                processDownloads(sServerURL, oEPUBDir, arrDownloadList.pop());
                            }

                        }
                        catch (err) {
                            closeProgress();
                            //navigator.notification.activityStop();
                            alert('reader.onloadend: Error: ' + err.message);
                        }
                    }
                    reader.readAsBinaryString(file);
                }, function (error) { alert('Error getting file. ' + error.code); });
            }, function (error) { alert('Error getting directory. ' + error.code); });
        }, function (error) {alert('getParent: ' + error.code);});
    }
    catch (err) {
        alert('An error occurred during dowload and copy.' + err.message);
    }

}

function gotDirectory(dirEntry) {
    alert('got the directory in createdirs callback function' + dirEntry.toURL());
}

function onDownloadError(error) {
    console.log("EPUBChapters.onDownloadError: Error Code:" + error.code + ". Download was not successful.");
    closeProgress();
    var oBIRMApp = new BIRM.BIRMApp();
    var sSupportEmail = oBIRMApp.SupportEmail;
    oBIRMApp.ShowAlert('Chapter Download',
                       'The BIRM chapter could not be downloaded because the server is not available or the chapter does not exist. Please contact BIRM Support at ' + sSupportEmail + '.',
                       function () {
                          window.location.reload(true);
                        }
    );
}

function showNotification(msg, btn) {

    if (btn !== null) {
        $('#popupNotification a').attr('id', btn);
    }
    $('#popupNotification h3').html(msg);
    $('#popupNotification').popup('open', { positionTo: 'window' });
}

function ShowAlert(Title, Alert, Callback) {

    var oBIRMApp = new BIRM.BIRMApp();
    oBIRMApp.ShowAlert(Title, Alert, Callback);

}

function ShowConfirmation(Title, Alert, Callback, Buttons) {

    var oBIRMApp = new BIRM.BIRMApp();
    oBIRMApp.ShowConfirmation(Title, Alert, Callback, Buttons);

}