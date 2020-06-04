var _CallBack;

// The callback will return an array.
function startNotesImport(AttachmentFilePath, CallBack, CurrentTheme) {

    // Make sure the callback is a function​
    if (typeof CallBack !== "function") {
        // Execute the callback function and pass the parameters to it​
        alert('The callback is not a valid function.');
        return false;
    }
    _CallBack = CallBack;
    copyNotesFile(null, AttachmentFilePath);

    return true;

    function copyNotesFile(FileEntryObject, AttachmentFilePath) {
        try {
         //   alert('Starting to copy attached notes file.');

            window.resolveLocalFileSystemURL(encodeURI(AttachmentFilePath),
                function (fileEntry) {
                    function win(file) {
                        var reader = new FileReader();
                        reader.onloadend = function (evt) {

                            var arrayImportedNotes = new Array();
                            arrayImportedNotes = JSON.parse($.trim(evt.target.result));
                            fileEntry.remove(function () { _CallBack(arrayImportedNotes); }, function () { alert('error'); });
                        };
                        reader.readAsText(file);
                    };

                    var fail = function (evt) {
                        console.log(error.code);
                    };

                    fileEntry.file(win, fail);

                }, function (error) {
                    //alert('about to resolve this files errors');
                    alert(error.code);
                });

        }
        catch (e) {
            alert(e.msg);
        }
    }

}

//Export Code
function startNotesExport(NotesArray, CurrentTheme) {

    try {
        showSpinner('Export Notes', 'Exporting...', CurrentTheme);
        createExportFile(NotesArray);
    }
    catch (e) {

    }

    function createExportFile(NotesArray) {

        console.log('Creating Export File');

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) { // success get file system
                sRootDirectory = fileSystem.root;

                // Get the app's directory
                console.log('Getting app directory.');
                sRootDirectory.getDirectory('gov.fhwa.birm', { create: true, exclusive: false },
                    function (dirEntry) {

                        console.log('App diretory exists.');
                        // Get the export directory
                        try {
                            console.log('Getting export directory.');
                            dirEntry.getDirectory('Exports', { create: true, exclusive: false },
                                function (dirEntry) {
                                    console.log('Export directory exists.')
                                    var sJSON = JSON.stringify(NotesArray);
                                    writeNotesFile(sJSON, dirEntry);
                                },
                                function (evt) {
                                    alert("File System Error: " + evt.target.error.code);
                                }
                            );
                        }
                        catch (ev) {
                            //app.hideProgress();
                            alert("File System Error: " + evt.target.error.code);
                        }

                    },
                    function (evt) {
                        alert("File System Error: " + evt.target.error.code);
                    }
                );
            }, function (evt) { // error get file system;
                alert("File System Error: " + evt.target.error.code);
            }
        );

    }

    function writeNotesFile(NotesContent, DirectoryEntryObject) {

        try {
            console.log('Writing notes file.');
            var dtCurDate = new Date();
            var formattedDate = dtCurDate.getFullYear().toString() + '_' + dtCurDate.getDate().toString() + '_' + (dtCurDate.getMonth() + 1).toString() + '_' + dtCurDate.getHours().toString() + '_' + dtCurDate.getMinutes().toString() + '_' + dtCurDate.getMilliseconds().toString();
            DirectoryEntryObject.getFile('NotesExport_' + formattedDate + '.birm', { create: true }, function (entry) {
                console.log('NotesExport.json exists.');

                function win(file) {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                      //  alert('Read NotesExport.json success.');
                     //   alert('The notes content -----> ' + NotesContent);

                        function win(writer) {
                            writer.onwriteend = function (evt) {
                                console.log("Truncating the file was successful.");
                                writer.onwriteend = function (evt) {
                                    setTimeout(function () {
                                        setTimeout(function () {
                                            console.log('The content was exported.');
                                            hidespin();
                                            $.prompt("Your notes have successfully been exported. Please wait while the BIRM App starts your email client and attaches your exported notes. This process may take up to 30 seconds to complete.", {
                                                title: "Export Notes",
                                                buttons: { "Ok": true },
                                                top: "30%",
                                                submit: function (e, v, m, f) {
                                                    if (v) {
                                                        createEmail(entry);
                                                        $.prompt.close();
                                                    }
                                                }
                                            })
                                        }, 2500);
                                    }, 2000);

                                }
                                writer.write(NotesContent);
                            }
                            writer.truncate(0);
                        }

                        var fail = function (evt) {
                            alert(error.code);
                        };

                        entry.createWriter(win, fail);

                    };
                    reader.readAsText(file);
                };

                var fail = function (evt) {
                    alert(error.code);
                };

                entry.file(win, fail);

            }, function (e) { alert('Get File Error.'); });
        }
        catch (e) {

        }
    }

    function createEmail(FileEntryObject) {

        try {
            console.log('Creating email');

            try {
                cordova.plugins.email.open({
                    subject: 'BIRM Notes Export',
                    attachments: FileEntryObject.toURL()
                });
            } 
            catch (e) {
                $.prompt("Your device has not been setup to send and receive emails.", {
                    title: "Notes Export?",
                    buttons: { "Ok": true },
                    top: "30%",
                    submit: function (e, v, m, f) {
                        if (v) {
                            e.preventDefault();
                            $.prompt.close();
                        }
                    }
                })
                //alert('Your device has not been setup to send and receive emails.');
            }



            //cordova.plugins.email.isAvailable(

            //    function (isAvailable) {
            //        if (isAvailable) {
            //            cordova.plugins.email.open({
            //                subject: 'BIRM Notes Export',
            //                attachments: FileEntryObject.toURL()
            //            });
            //        } else {
            //            alert('Your device has not been setup to send and receive emails.');
            //        }

            //    }

            //);

        }
        catch (e) {
            alert('Error sending email.');
        }

    }

    function showSpinner(title, msg, showtheme) {

        var currentSpinnerTheme = 'c';

        if (showtheme === 'a') {
            currentSpinnerTheme = 'b';
        }

        if (showtheme === 'b') {
            currentSpinnerTheme = 'a';
        }

        var $this = $(this),
                theme = $this.jqmData("theme") || currentSpinnerTheme,
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

    function hidespin() {
        $.mobile.loading("hide");
    }
}