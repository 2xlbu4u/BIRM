// JavaScript Document
var BIRM = BIRM || {};

(function (){

    /* Page level event listeners. */
    //var oBIRMApp;
    $(document).ready(function () {
        console.log("Video.DocumentReady: Video list document is ready.");
	    document.addEventListener('deviceready', onDeviceReady, false);
    });

    function onDeviceReady() {

        console.log("Video.onDeviceReady");

        $('#BackButton').on("click", function () {
            location.href = "MainMenu.html";
        });

        $('#HomeButton').on("click", function () {
            location.href = "MainMenu.html";
        });

        $('#VideoListButton').on("click", function () {
            location.href = "VideoList.html";
        });

        $('#btnDownloadWarning').on("click", function () {
            startDownload();
        });

        $('#btnOK').on("click", function (evt) {
            evt.preventDefault();
            window.location.reload(true);
        });
		
		

	    $('#btnDeleteChapter').on("click", function (evt) {
	        var arrSelectedVideos = $("input:checked");		
			
	        if (arrSelectedVideos.length === 0) {
	            ShowAlert('Notification', 'Please select the videos you wish to remove.', function () { });
	        }
	        else {
	            ShowConfirmation('Confirmation',
                                 'Are you sure you want to delete the selected video(s)?',
                                 function (buttonIndex) {
                                     if (buttonIndex === 2) {
                                         startRemoveVideos();
                                     }
                                 },
                                 ['No', 'Yes']
                );
	            //$('#popupConfirmDelete').popup('open', {positionTo: 'window'});
	        }
        });	
        LoadVideos();
	}
	
	function reloadWindow()
		{window.location.reload(true);}
	
	
	//start of video deletion	
	
	var onGetDirectoriesFailed = function (error) {
	    ShowAlert('Developer Notification', 'Search.onGetDirectoriesFailed: An error occurred while getting the directories. (Error Code: ' + error.code + ')');
	}

    var setRootDirectory2 = function (callback) {
	    console.log('BIRMvideos.setRootDirectory: Setting the root directory.');
	    try {
	        var sAppRoot = oBIRMApp.AppDirectory;
	        var sEPUBRoot = oBIRMApp.EPUBDirectory;
        	var sVideoDirectory = oBIRMApp.VideoDirectory;

	        var oFS = new BIRM.FileSystem();
	        oFS.getDirectory(sAppRoot, true, function (dirEntry) {
	            console.log('BIRMvideos.setRootDirectory: Got the root directory. (' + dirEntry.toURL() + ')');
	            dirEntry.getDirectory(sVideoDirectory, { create: true }, function (dirVideoEntry) {
	                console.log('BIRMvideos.setRootDirectory: Got the Video directory. (' + dirVideoEntry.toURL() + ')');
	                oEPUBRoot = dirVideoEntry;
                    callback();
	            }, onGetDirectoriesFailed);
	        }, onGetDirectoriesFailed);
	    }
	    catch (error) {
	        ShowAlert('Developer Notification', 'BIRMvideos.setRootDirectory: An error occurred. (' + error.message + ')');
	    }
	}	 
	

    function startRemoveVideos() {
		
        console.log("BIRMvideos.removeVideos: starting removal.");
        oBIRMApp = new BIRM.BIRMApp();
        setRootDirectory2(function() {
            removeVideos($("input:checked"));
        });
    }

    arrVideoFiles = new Array();
	
    function removeVideos(VideoArray) {
        console.log("BIRMvideos.removeVideos: Removing video content.");

        if (VideoArray.length > 0) {
            arrVideoContent = new Array();
            $.each(VideoArray, function () {
                arrVideoContent.push(this);
            })
        	console.log('BIRMvideos.removeVideos: There are ' + arrVideoContent.length + ' videos to remove.');
		   
			var i = 0;		
			for (i = 0; i < arrVideoContent.length; i++) {
				
				var sVideoName = $(arrVideoContent[i]).attr('data-value');	
				console.log('BIRMvideos.removeVideos: gonna add this file ' + sVideoName + ' to the list.');	
				
				if (sVideoName.indexOf(';') > -1) {
					arrVideoFiles = sVideoName.split(';');			
				}
				else {
					arrVideoFiles.push(sVideoName);
				}				
			}
			   
			var i = 0;		
			for (i = 0; i < arrVideoFiles.length; i++) {
				
			var sBIRMVideo = sVideoName.substr(0, arrVideoFiles[0].lastIndexOf('.'));
			deleteFile(arrVideoFiles.pop(), sBIRMVideo);
			}
        }
    }

  
    function deleteFile(File, Directory) {

        console.log('BIRMvideos.deleteFile: Deleting file ' + File + '.');
        console.log('BIRMvideos.deleteFile: From this dir ' + Directory + '.');

        oEPUBRoot.getFile(File, { create: false }, function (fileEntry) {
            fileEntry.remove(function () {				
				
                if (arrVideoFiles.length === 0) {
					 console.log('BIRMvideos.deleteFile: All files deleted');
                                window.location.reload(true);
	                            //ShowAlert('Notification','The selected videos have been removed.',function (evt) {evt.preventDefault();});					 
                }
                else {
                    deleteFile(arrVideoFiles.pop(), Directory);
					 console.log('BIRMvideos.deleteFile: File deleted: ' + File + '.');
                }
            }, function () { ShowAlert('Developer Notification', 'BIRMvideos.deleteFile: The video file does not exist.'); });
        }, function (error) { console.log('BIRMvideos.deleteFile: The video directory does not exist.'); getVideoDirectories(arrDirectories.pop()); });

    }


	//end of video deletion
	
	
	
	
	
	function onGotFiles(dirEntries) {

		/*console.log("Videos.onGotFiles: " + dirEntries.length + " entries found.");
		var oVideos = oBIRMApp.BIRMVideos;
		LoadVideos(dirEntries, oVideos);
        */
	}
	
	function onGotFilesError() {
		ShowAlert('Developer Notification', 'Please download the appropriate BIRM chapters.');
	}

	function LoadVideos() {
				
	    console.log("Video.LoadVideos: Loading the BIRM videos. (Bill)");
		
	    try {
	        var iVideoCount = 0;
	        window.localStorage.setItem("Video", '');
	        window.localStorage.setItem("VideoFileName", '');

	        var oBIRMApp = new BIRM.BIRMApp();
	        var BIRMVideos = oBIRMApp.BIRMVideos;

	        if (BIRMVideos != null) {

	            iVideoCount = BIRMVideos.length;
	         //   $('#count').text('(' + iVideoCount + ')');
	            var sVideo = '';

	            var arrFiles = null;
				oBIRMApp.GetVideos(function (dirEntries) {
	                $('#VideoContent').empty();
	                $('#VideoContent').find("ul[data-role='listview']").listview();
					
					
	                //sChapter = '<ul data-role="listview" data-split-icon="gear" data-split-theme="a" data-count-theme="a">';
	                // (original var)  sVideo = '<ul id="video-list"  data-inset="true" data-filter="true" data-filter-theme="z" data-divider-theme="c">';
	                sVideo = '<ul  data-role="listview" data-split-icon="gear" data-split-theme="a" data-count-theme="a" style=" margin:0px;">';
	                arrFiles = dirEntries;
					

	                var i = 0;
	                for (i = 0; i < BIRMVideos.length; i++) {
	                    var bDownloaded = false;
	                    var sFullPathToFile = '';
	                    var sImg = '';

	                    if (dirEntries != null) {
	                        var result = $.grep(dirEntries, function (e) { return e.name == BIRMVideos[i].FileName; });
	                        if (result.length === 1) {
	                            bDownloaded = true;
	                            sFullPathToFile = result[0].toURL();
								
								
								
                                console.log("Video.LoadVideos: Video has been previously downloaded. (" + BIRMVideos[i].FileName + ").")
                                console.log("Video.LoadVideos: The path to the previously downloaded. (" + sFullPathToFile + ").")
	                            
							// sChapter += '<li data-icon="false"><a><span><label style="padding: 0x 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup">
							 //					<input type="checkbox" id="NotesList" data-value="' + BIRMChapters[i].FileName + '" data-role="none" /></fieldset></label></span><span id="Chapter" data-value="' + sFullPathToFile + '">' + BIRMChapters[i].DisplayName + '</span>' + sImg + '</a></li>';
	                        
								
								
								 sImg = '<span class="ui-li-count">' + BIRMVideos[i].Size + ' MB</span><a href="#" class="ui-icon-BIRMDownloaded" data-rel="popup"></a>';
                                sVideo += '<li data-icon="false"><a><span><label style="padding: 0px 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup">';
	                            //sVideo += '<input type="checkbox" id="NotesList" data-value="' + BIRMVideos[i].FileName + '" data-role="none" /></fieldset></label></span><span id="vid_' + i + '" data-value="' + sFullPathToFile + '" onclick="onSelectTbl2(this);">' + BIRMVideos[i].DisplayName + '</span>' + sImg + '</a></li>';
                                sVideo += '<input type="checkbox" id="NotesList" data-value="' + BIRMVideos[i].FileName + '" data-role="none" /></fieldset></label></span><span id="Video" data-value="' + sFullPathToFile + '">' + BIRMVideos[i].DisplayName + '</span>' + sImg + '</a></li>';
	                        
	                           // sImg = '<div class="downloaded-icon"><a href="#"><img src="img/img_trans.png" alt=""/></a></div><div class="size"> ' + BIRMVideos[i].Size + ' MB</div>'
	                           // sVideo += '<li><a href="#" id="vid_' + i + '" data-value="' + sFullPathToFile + '" onclick="onSelectTbl2(this);">' + BIRMVideos[i].DisplayName + '</a>' + sImg + '</li>';
	                        }
	                        else {
	                            console.log("Video.LoadVideos: Video has NOT been previously downloaded. (" + BIRMVideos[i].FileName + ").")
                                console.log("Video.LoadVideos: The path to the previously NOT downloaded. (" + BIRMVideos[i].YoutubeID + ").")
	                           
							    sImg = '<span class="ui-li-count">' + BIRMVideos[i].Size + ' MB</div><a href="#" id="download_' + i + '" class="ui-icon-" data-value="' + BIRMVideos[i].FileName + " onClick='DownloadVideo("+$(this)+")'></a>";
                                sVideo += '<li data-icon="false"><a><span><label style="padding: 0px 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup">';
								sVideo += '<input type="checkbox" id="NotesList" data-value="' + BIRMVideos[i].YoutubeID + '" data-role="none" disabled/></fieldset></label></span><span id="vid_' + i + '" data-value="' + BIRMVideos[i].YoutubeID + "'onSelectTbl2("+$(this)+")';>"+ BIRMVideos[i].DisplayName + '</span>' + sImg + '</a></li>';
	                       
							    //sImg = '<div class="download-icon" data-inline="true" data-msgtext="" data-textvisible="true" data-textonly="false"><a href="#" id="download_' + i + '" data-value="' + BIRMVideos[i].FileName + '" onclick="DownloadVideo(this);"><img src="img/img_trans.png" alt=""/></a></div> <div class="size">' + BIRMVideos[i].Size + 'MB</div>';
	                            //sVideo += '<li><a href="#" id="vid_' + i + '" data-value="' + BIRMVideos[i].YoutubeID + '" onclick="onSelectTbl2(this);">' + BIRMVideos[i].DisplayName + '</a>' + sImg + '</li>';
	                        }
	                    }
	                    else {
	                        console.log("Video.LoadVideos: Video has NOT been previously downloaded. (" + BIRMVideos[i].FileName + ").")
                            console.log("Video.LoadVideos: The path to the previously NOT downloaded. (" + BIRMVideos[i].YoutubeID + ").")
	                       
						   sImg = '<span class="ui-li-count">' + BIRMVideos[i].Size + ' MB</div><a href="#" id="download_' + i + '" class="ui-icon-BIRMDownload" data-value="' + BIRMVideos[i].FileName + " onClick='DownloadVideo("+$(this)+")'></a>";
                           sVideo += '<li data-icon="false"><a><span><label style="padding: 0px 10px 0px 10px !important;margin: 0px 10px 0px 0px !important;border-width: 0px 1px 0px 0px !important;float:left;" data-corners="false"><fieldset data-role="controlgroup">';
						  sVideo += '<input type="checkbox" id="NotesList" data-value="' + BIRMVideos[i].YoutubeID + '" data-role="none" disabled/></fieldset></label></span><span id="vid_' + i + '" data-value="' + BIRMVideos[i].YoutubeID + "' onclick='onSelectTbl2("+$(this)+")';>" + BIRMVideos[i].DisplayName + "</span>' + sImg + '</a></li>'";
	                        
						    //sImg = '<div class="download-icon" data-inline="true" data-msgtext="" data-textvisible="true" data-textonly="false"><a href="#" id="download_' + i + '" data-value="' + BIRMVideos[i].FileName + '" onclick="DownloadVideo(this);"><img src="img/img_trans.png" alt=""/></a></div> <div class="size">' + BIRMVideos[i].Size + 'MB</div>';
	                        //sVideo += '<li><a href="#" id="vid_' + i + '" data-value="' + BIRMVideos[i].YoutubeID + '" onclick="onSelectTbl2(this);">' + BIRMVideos[i].DisplayName + '</a>' + sImg + '</li>';
	                    }
	                }

	                sVideo += '</ul>';
	                $('#VideoContent').append(sVideo);
	                $('#VideoContent').find("ul[data-role='listview']").listview();
	                $("#VideoContent a").on('click', function (evt) {
	                    evt.stopPropagation();
	                });

	                $("#VideoContent").find("span[id='Video']").click(function (evt) {
	                    onSelectTbl2(this);
	                });

	            },
					function () { ShowAlert('Developer Notification', 'An error occurred.'); });
	        }
	    }
	    catch (err) {
	        //Handle errors here
	        ShowAlert('Developer Notification', '"Videos.LoadVideos: ' + err);
	    }
	}

    /* remove function
    function LoadVideos(dirEntries, BIRMVideos) {

        try {
			 
		    console.log("EPUBChapters.LoadChapters: Loading the BIRM videos.");
            $('#VideoContent').empty();
            $('#VideoContent').find("ul[data-role='listview']").listview();
		 
            if (dirEntries != null) {
			 	console.log("EPUBChapters.LoadChapters: Directory entries exist.");
				var sChapter;// = '<ul id="video-list" data-role="listview"   class="noindent"  data-filter="true" ><li data-role="header"  > Video List <div class="downloaded-icon"> <label id="count"></label></div></li>  '
			 	    sChapter = '<ul id="video-list"  data-inset="true" data-filter="true" data-filter-theme="z" data-divider-theme="c"> <li  data-role="header">Video list</li>'   
			      //    sChapter =  '<ul id="ulist"   data-inset="true"  class="noindent"   ><li data-role="list-divider" id="list1"   > Video List  <div ><label id="count"></label></div>  </li>';       
		  	if (BIRMVideos != null) {
				var i;
				for (i=0; i<BIRMVideos.length; i++) {
					var sVideo = '';
					var iButtonID = null;
			    	 var path='';
				     var sImg='';
				    
						var result = $.grep(dirEntries, function(e){ return e.name == BIRMVideos[i].FileName; });
						 
							if (result.length == 1) {
							 	
								 for (ii=0; ii<dirEntries.length; ii++) {
									var result = $.grep(BIRMVideos, function(e){ return BIRMVideos[i].FileName == dirEntries[ii].name; });
									sImg='';
									if (result.length > 0) {
										    path =	dirEntries[ii].fullPath;										  
										//	sImg='<a href="#" ><img src="img/downloaded-40-blue.png"  alt="video has been downloaded" /></a>';
											sImg= '<div class="downloaded-icon"><a href="#"   ><img src="img/img_trans.png" alt=""/></a></div><div class="size"> '+BIRMVideos[i].Size+' MB</div> '
											break;
										}
									else{
											 path= '';
											 
										} 
								}
				            } 
							
					 	 if (path.length==0){
							  path=BIRMVideos[i].YoutubeID
						//	  class="show-page-loading-msg" data-inline="true" data-msgtext="" data-textvisible="true" data-textonly="false"
							  
						//	  <a href="#popupDialog" data-rel="popup" data-position-to="window" data-transition="pop"  id= ' + BIRMVideos[i].FileName + ' onclick="onSelectTbl1( this);">
							   sImg= '<div class="download-icon" data-inline="true" data-msgtext="" data-textvisible="true" data-textonly="false"><a href="#"  id= ' + BIRMVideos[i].FileName + ' onclick="onSelectTbl1( this);"> <img src="img/img_trans.png" alt=""/></a></div> <div class="size"> '+BIRMVideos[i].Size+'MB</div>'
				 			 }
						//	  ShowAlert('Developer Notification', 'file2  '+ BIRMVideos[i].YoutubeID  +'---' +path);
						 
 //<li data-value= ""><a href="#"  id="1"  onclick="onSelectTbl2(this);"> video 1 </a>  <div class="downloaded-icon"><a href="#"  ><img src="img/img_trans.png" alt=""/></a></div><div class="size"> 25 MB</div>   </li> 
		         // sChapter  = sChapter+  '<li data-value="' +  path + '"><a href="#"  id="' +  path + '" onclick="onSelectTbl2(this);"> ' +BIRMVideos[i].DisplayName + ' </a> '+ sImg +'   </li>'; 
							 
					 sChapter  = sChapter+  '<li data-value=""><a href="#"  id="' +  path + '" onclick="onSelectTbl2(this);"> ' +BIRMVideos[i].DisplayName + ' </a> '+ sImg +'   </li>'; 
				}				
            }
			/////////////////////////	
				 
				sChapter  += '</ul>';
				
			 //	ShowAlert('Developer Notification', sChapter);
                $('#VideoContent').append(sChapter);
                 $('#VideoContent').find("ul[data-role='listview']").listview();
				
			 		count1=$("#video-list li").size();
			 		count1= 'Total number: ' + count1 ;
			 		$('#count').text(count1);
		 	//	$('#VideoContent').find('li').click(function(){
		 		//	OpenVideo( $(this).attr("data-value"),$(this).attr("id") );
		 	  //   });
				
			 
            }

        }
        catch (err) {
            //Handle errors here
            ShowAlert('Developer Notification', '"EPUBChapters.LoadChapters: ' + err);
        }
    }
	 */

     function OpenVideo(sVideo,sid) {
        try {
			if(sVideo.indexOf('www.youtube.com/embed') >0){
				   var oNetConn = new BIRM.Connection();
						if (oNetConn.IsConnected) {
							
							var sConnType = oNetConn.GetConnectionType();
							//ShowAlert('Developer Notification', sConnType);
							if (sConnType != 'none') { 
							        var r=confirm("For download vodeo file click ok");
									 if (r==true)
									   {
											var oBIRMApp = new BIRM.Setup();
											oBIRMApp.DownloadVideo(sid);
												oBIRMApp = new BIRM.BIRMApp();
											oBIRMApp.GetEPUBDocuments(onGotFiles, onGotFilesError);
									   }
									 else
									   {
										  window.localStorage.setItem("Video",sVideo);
										  window.location = 'VideoPlayer.html';
									   } 
							}
							else{	
							   ShowAlert('Notification', 'Please consider turning on wifi to conserve your data plan minutes.', null);
								 }  
						}
						else {
							ShowAlert('Notification', 'No internet connection exist for downloading the BIRM chapters.', null);
						}
				}
			else{
				 window.localStorage.setItem("Video",sVideo);
			     window.location = 'VideoPlayer.html';
				}
			 
            
        }
        catch (err) {
            ShowAlert('Developer Notification', 'OpenVideo ' + err);
        }
    }
 
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

function hidespin(){
		 $.mobile.loading( "hide" );
}
	
    function isConnected() {

        var bIsConnected = true;
        var oNetConn = new BIRM.Connection();

        return oNetConn.IsConnected();
    }

    function getConnectionType() {

        console.log('Video.getConnectionType: Getting the connection type.')
        var oNetConn = new BIRM.Connection();
        var sConnType = oNetConn.GetConnectionType();
        console.log('Video.getConnectionType: The connection type is ' + sConnType + '.')
        return sConnType;

    }

/* remove function */
    function getDownloadConfigSetting() {

        console.log('Video.getDownloadConfigSetting: Getting download configuration setting.')
        var sConfigSetting = '';
        var oDB = new BIRM.Database();

        oDB.getDownloadConfig("DownloadConfig", function (transaction, results) {
            console.log('Video.getDownloadConfigSetting: The database returned ' + results.rows.length + '.')
            if (results.rows.length > 0) {
                console.log('the result is ' + results.rows.item(0)['Value']);
                sConfigSetting = results.rows.item(0)['Value'];
            }
        }, function () { ShowAlert('Developer Notification', 'An error occurred.'); });

        return sConfigSetting;

    }

    function showPrompt(ConfigSetting) {

        console.log('Video.showPrompt: Checking to show prompt.')
        var bShowPrompt = false;
        var sConfigSetting = ConfigSetting;
        var sConnType = getConnectionType();

        console.log('Video.showPrompt: The download configuration setting is ' + sConfigSetting);
        console.log('Video.showPrompt: The connection type is ' + sConnType);
        if (sConfigSetting.toLowerCase() === 'alwaysask') {
            bShowPrompt = true;
        }
        else {
            if (sConnType.toLowerCase().indexOf('cell') > -1 && sConfigSetting.toLowerCase() === 'wifi') {
                bShowPrompt = true;
            }
        }

        console.log('Video.showPrompt: Show prompt is ' + bShowPrompt + '.')
        return bShowPrompt;
    }

    function DownloadVideo(obj) {
        
        sVideo = $('#' + obj.attr("data-value"));
        console.log('Video.DownloadVideo: The video to be downloaded is ' + sVideo + '.')
        if (isConnected) {

            var sConnType = getConnectionType();
            var sConfigSetting = '';
            var oDB = new BIRM.Database();
            console.log('Video.getDownloadConfigSetting: Get the download configuration setting.')
            oDB.getDownloadConfig(function (transaction, results) {
                //ShowAlert('Developer Notification', 'Video.getDownloadConfigSetting: The database returned ' + results.rows.length + '.')
                if (results.rows.length > 0) {
                    //ShowAlert('Developer Notification', 'the result is ' + results.rows.item(0)['Value']);
                    sConfigSetting = results.rows.item(0)['Value'];
                    var bShowPrompt = showPrompt(sConfigSetting);

                    //var bShowPrompt = showPrompt();
                    if (bShowPrompt) {
                        $('#popupDownloadWarning').popup('open');
                    }
                    else {
                        //ShowAlert('Developer Notification', 'Please consider turning on wifi to conserve your data plan minutes.');

                        console.log("Setup.DownloadEPUB: Downloading video " + sVideo + ".");
                        startDownload();
                    }

                }
            }, function () { ShowAlert('Developer Notification', 'An error occurred.'); });
        }
        else {
            ShowAlert('Notification', 'No internet connection exist for downloading the video.', null);
        }
    }

    function startDownload() {

        console.log("Video.startDownload: Starting the download process.");
        showSpinner('Downloading Video', 'Downloading...', 'a');

        var oBIRMApp = new BIRM.BIRMApp();
        var sAppDirectory = oBIRMApp.AppDirectory;
        var sVideoDirectory = oBIRMApp.VideoDirectory;
        var sServerURL = oBIRMApp.VideoDownloadServerURL;

        console.log("Video.startDownload: The AppDirectory was set to " + sAppDirectory + ".");
        console.log("Video.startDownload: The ServerURL was set to " + sServerURL + ".");
        try {
            var oFS = new BIRM.FileSystem();
            oFS.getDirectory(sAppDirectory,
                             true,
                             function (dirEntry) {
                                 console.log('Video.startDownload: Directory ' + dirEntry.fullPath + ' created or exists.');
                                 dirEntry.getDirectory(sVideoDirectory,
                                                       { create: true, exclusive: false },
                                                       function (dirVideoEntry) {
                                                           console.log('Video.startDownload: Directory ' + dirVideoEntry.fullPath + ' created or exists.');
                                                           var oDL = new BIRM.Download();
                                                           oDL.DownloadEPUB(sServerURL, dirVideoEntry, sVideo, onDownloadSuccess, onDownloadError);
                                                       },
                                                       function () { }
                                 );
                             },
                            function () { }
            );

            //var oDL = new BIRM.Download();
            //oDL.DownloadEPUB(sServerURL, sAppDirectory, sVideo, onDownloadSuccess, onDownloadError);
        }
        catch (e) {
            //$('#popupDownloadingStatus').hide();
            hidespin();
            console.log("Video.DownloadVideo: Error - " + e.message + ".");
        }

    }

    function onDownloadSuccess(entry) {
        console.log("Setup.onDownloadSuccess: Download was successful.");
		window.location.reload(true);
        setInterval(function () {
            hidespin();
            setInterval(function () {
                ShowAlert('Notification', 'The video has been successfully downloaded.');
				reloadWindow();
            }, 400);
        }, 300);
    }

    function onDownloadError(error) {
        console.log("Video.onDownloadError: Error Code:" + error.code + ". Download was not successful.");
        hidespin();
        var oBIRMApp = new BIRM.BIRMApp();
        var sSupportEmail = oBIRMApp.SupportEmail;
        oBIRMApp.ShowAlert('Video Download',
                           'The video could not be downloaded because the server is not available or the chapter does not exist. Please contact BIRM Support at ' + sSupportEmail + '.',
                           function () {
                               window.location.reload(true);
                           }
        );
    }

	function onSelectTbl1(obj){
	//	ShowAlert('Developer Notification', 'test2   ' +sVideo);
	    console.log('onSelectTbl1: The value is ' + $('#' + obj.id).attr("data-value"));
	    //sVideo=obj.id;
	    sVideo = $('#' + obj.id).attr("data-value");
		try {
			
                  
 				   var oNetConn = new BIRM.Connection();
						if (oNetConn.IsConnected) {
							
							var sConnType = oNetConn.GetConnectionType();
				//			ShowAlert('Developer Notification', sConnType);
						//	if (sConnType  = 'wifi' ) { 
						        var r=confirm("For download vodeo file click ok");
									 if (r==true)
									   {
										   
										   
											var oBIRMApp = new BIRM.Setup();
											oBIRMApp.DownloadVideo(sVideo);
											showSpinner('Download Video', 'Downloading...', 'a');
										//	var scheckd =  window.localStorage.getItem("checkd");
										//	ShowAlert('Developer Notification', 'scheckd   '+scheckd );
											var tt= setInterval(function(){
													window.location = "VideoList.html";											 
												},5000);
										 	//  ShowAlert('Developer Notification', 'Video Available' + tt);
										//	 reloadscreen();
									 
									     	
									 	  // oBIRMApp = new BIRM.BIRMApp();
									 		//oBIRMApp.GetEPUBDocuments(onGotFiles, onGotFilesError);
									   }
									 
						//	}
						//	else{	
						//			ShowAlert('Developer Notification', 'Please consider turning on wifi to conserve your data plan minutes.');			 
									
						//		 }  
						}
						else {
							ShowAlert('Notification', 'No internet connection exist for downloading the BIRM chapters.');
						}
		       
        }


        catch (err) {
            ShowAlert('Developer Notification', 'OpenVideo ' + err);
        }
		}
		
		var successCallback = function() {
		//ShowAlert('Developer Notification', 'success');
	    }
		
		var errorCallback= function() {
		ShowAlert('Developer Notification', 'error');
	    }

		var errorHandler = function (transaction, error)
	{
		ShowAlert('Developer Notification', "Error: " + error.message);
		return true;
	}

		function onSelectTbl2(obj) {
			alert(obj);
			return;

		    console.log('onSelectTbl2: The value is ' + obj.attr("data-value"));
		    videopath = obj.attr("data-value");

		    try {

		        if (videopath.indexOf('www.youtube.com/embed') > 0) {
		            var oNetConn = new BIRM.Connection();

		            if (oNetConn.IsConnected) {
		                var sConnType = oNetConn.GetConnectionType();
		                console.log(' sConnType  ->' + sConnType);
		                var sConfigSetting = '';
		                var oDB = new BIRM.Database();
		                oDB.getDownloadConfig(function (transaction, results) {
		                    if (results.rows.length > 0) {
		                        //ShowAlert('Developer Notification', 'the result is ' + results.rows.item(0)['Value']);
		                        sConfigSetting = results.rows.item(0)['Value'];
		                    }
		                }, function () { });   // getDownloadConfigSetting();
		                //  ShowAlert('Developer Notification', 'results.rows.length  ' +results.rows.length);	

		                //	 	ShowAlert('Developer Notification', ' tes  ->' + tes);
		                if (sConnType != sConfigSetting) {
		                    window.localStorage.setItem("Video", videopath);
		                    window.location = 'VideoPlayer.html';
		                }
		                else {
		                    ShowAlert('Notification', 'Please consider turning on wifi to conserve your data plan minutes.', null);

		                }
		            }
		            else {
		                ShowAlert('Notification', 'No internet connection exist for downloading the BIRM chapters.', null);
		            }



		        }
		        else {
		            window.localStorage.setItem("Video", videopath);
		            window.location = 'VideoPlayer.html';
		        }


		    }
		    catch (err) {
		        ShowAlert('Developer Notification', 'OpenVideo ' + err);
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