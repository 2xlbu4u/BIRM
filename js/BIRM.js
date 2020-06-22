// JavaScript Document
//ks 03/24/2016 removed videos - 49 Row PropMg final, 74 Contractor Payroll Final, 56 Internal controls final. Added Tutorial videos - Annotation, Display, glossary, Highlights, Images, Notes and Bookmarks, Search, Shareable Notes, TOC, Videos. LoadVideos()
//ks 03/24/2016 changed the download link for sVideoDownloadServerURL.
//ks 04/06/2016 Replaced link and rename for 87 NBIS final video


var BIRM = BIRM || {};

(function (){

	BIRM.BIRMApp = function () { };	

	BIRM.Document = function(displayName, fileName, youtubeID,size) { 
		this.DisplayName = displayName;
		this.FileName = fileName;
		this.YoutubeID = youtubeID;
		this.Size= size
	};

	var sAppDirectory = 'gov.dot.birm';
	var sEPUBDirectory = 'EPUBS';
    var sVideoDirectory = 'Videos'
    var sImportDirectory = 'Import';
    var sImageDirectory = 'Images';
    var sEPUBDownloadServerURL = 'http://downloads.ideationinc.com/FHWA/BIRM/EPUBS/';
    var sVideoDownloadServerURL = 'http://www.fhwa.dot.gov/bridge/birm/';
	var sBIRM_Chapter1 = 'ch1.epub';
	var sChapterNameFormat = 'birm-ch';
	var bInitSuccess = true;
	var sSupportEmail = 'NHICustomerService@dot.gov'
	var sFAQURL = 'http://www.fhwa.dot.gov/BIRM-FAQ';
	var sBIRMVersion = '0.11.0.16968';
	
	var onDirectorySuccess = function (dirEntry) {
		console.log("BIRMApp.onDirectorySuccess: Diretory was successfully created.");
		dirEntry.getDirectory(sImportDirectory, {create:true}, function(importDir) {
			console.log("BIRMApp.onCreateImportDirectory: Import directory had to be created.");
		}, onDirectoryError);		
	}

	var onCreateDirectory = function(error) {
		console.log("BIRMApp.onCreateDirectory: Directory had to be created.");
		if (error.code = FileError.NOT_FOUND_ERR) {
			var oFS = new BIRM.FileSystem();
			oFS.getDirectory(sAppDirectory, true, onDirectorySuccess, onDirectoryError);
		}
	}

	var onDirectoryExists = function(dirEntry) {
		console.log("BIRMApp.onDirectoryExists: Directory exists.");
		dirEntry.getDirectory(sImportDirectory, {create:true}, function(importDir) {
			console.log("BIRMApp.onCreateImportDirectory: Import directory had to be created.");
		}, onDirectoryError);
	}
		
	var onDirectoryError = function(error) {
		console.log("BIRMApp.onDirectoryError: Error creating directory.");
	}
	
	var onDownLoadSuccess = function(entry) {
		console.log("BIRMApp.onDownLoadSuccess: Successfully downloaded file.");
	}
	
	var onDownLoadError = function(error) {
		console.log("BIRMApp.onDownloadError: Error downloading file.");
	}

	var onInitFs = function() {
		
		console.log("BIRMApp.onInitFs: FileSystem was successfully created.");
		var oDB = new BIRM.Database();
		oDB.PreInitializeDatabase(onInitDBSuccess, onInitDBError);	
	}
	
	var errorHandler = function(error) {
		console.log("BIRMApp.errorHandler: FileSystem was not successfully created.");
	}

	var LoadChapters = function() {

		console.log("BIRMApp.LoadChapters: Preloading BIRM EPUB chapters.")
		var Chapters = new Array();
		Chapters.push(new BIRM.Document('Chapter 1: Bridge Inspection Programs', 'ch1.epub', '', '.10'));
		Chapters.push(new BIRM.Document('Chapter 2: Safety Fundamentals for Bridge Inspectors', 'ch2.epub', '', '1.6'));
		Chapters.push(new BIRM.Document('Chapter 3: Basic Bridge Terminology', 'ch3.epub', '', '3'));
		Chapters.push(new BIRM.Document('Chapter 4: Bridge Inspection Reporting', 'ch4.epub', '', '2.3'));
		Chapters.push(new BIRM.Document('Chapter 5: Bridge Mechanics', 'ch5.epub', '', '.50'));
		Chapters.push(new BIRM.Document('Chapter 6: Bridge Materials', 'ch6.epub', '', '18.6'));
		Chapters.push(new BIRM.Document('Chapter 7: Inspection And Evaluation Of Bridge Decks And Areas Adjacent To Bridge Decks', 'ch7.epub', '', '1.6'));
		Chapters.push(new BIRM.Document('Chapter 8: Inspection And Evaluation Of Timber Superstructures', 'ch8.epub', '', '.80'));
		Chapters.push(new BIRM.Document('Chapter 9: Inspection And Evaluation Of Concrete Superstructures', 'ch9.epub', '', '6.5'));
		Chapters.push(new BIRM.Document('Chapter 10: Inspection And Evaluation Of Steel Superstructures', 'ch10.epub', '', '10.1'));
		Chapters.push(new BIRM.Document('Chapter 11: Inspection And Evaluation Of Bridge Bearings', 'ch11.epub', '', '.70'));
		Chapters.push(new BIRM.Document('Chapter 12: Inspection And Evaluation Of Substructures', 'ch12.epub', '', '2'));
		Chapters.push(new BIRM.Document('Chapter 13: Inspection And Evaluation Of Waterways', 'ch13.epub', '', '3.2'));
		Chapters.push(new BIRM.Document('Chapter 14: Characteristics, Inspection And Evaluation Of Culverts', 'ch14.epub', '', '2.5'));
	 	Chapters.push(new BIRM.Document('Chapter 15: Advanced Inspection Methods', 'ch15.epub', '', '.90'));
	 	Chapters.push(new BIRM.Document('Chapter 16: Complex Bridges', 'ch16.epub', '', '2.6'));
	 	Chapters.push(new BIRM.Document('Appendix A', 'appendix-a.epub', '', '.50'));
	 	Chapters.push(new BIRM.Document('Appendix B', 'appendix-b.epub', '', '.01'));
	 	Chapters.push(new BIRM.Document('Bibliography', 'bibliography.epub', '', '.09'));
	 	//Chapters.sort()

		return Chapters;
	}

	var LoadVideos = function() {
	    //ks 03/24/2016 removed videos - 49 Row PropMg final, 74 Contractor Payroll Final, 56 Internal controls final. Added Tutorial videos - Annotation, Display, glossary, Highlights, Images, Notes and Bookmarks, Search, Shareable Notes, TOC, Videos. 
        //ks 04/06/2016 Replaced link and rename for 87 NBIS final video
		console.log("BIRMApp.LoadVideos: Preloading BIRM videos.")
		var Videos = new Array();
		
		Videos.push(new BIRM.Document('BIRM Tutorials: Annotation', 'BIRM-Tutorials-Annotation-sm.mp4', 'https://www.youtube.com/watch?v=egz_egNN32Y', '33'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Display', 'BIRM-Tutorials-Display-sm.mp4', 'https://www.youtube.com/watch?v=MTocxAZhDIw', '41'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Glossary', 'BIRM-Tutorials-Glossary-sm.mp4', 'https://www.youtube.com/watch?v=vhhksmgkagM', '17'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Highlights', 'BIRM-Tutorials-Highlights-sm.mp4', 'https://www.youtube.com/watch?v=LYFHg_inC48', '30'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Images', 'BIRM-Tutorials-Images-sm.mp4', 'https://www.youtube.com/watch?v=YHP_UeWb9t0', '16'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Notes and Bookmarks', 'BIRM-Tutorials-NotesBookmarks-sm.mp4', 'https://www.youtube.com/watch?v=leWApJ2tZNM', '13'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Search', 'BIRM-Tutorials-Search-sm.mp4', 'https://www.youtube.com/watch?v=b0h_yRjuzhc', '13'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Shareable Notes', 'BIRM-Tutorials-ShareableNotes-sm.mp4', 'https://www.youtube.com/watch?v=gGGw95xyUdw', '34'));
		Videos.push(new BIRM.Document('BIRM Tutorials: TOC', 'BIRM-Tutorials-TOC-sm.mp4', 'https://www.youtube.com/watch?v=RRNBq_aNZ24', '15'));
		Videos.push(new BIRM.Document('BIRM Tutorials: Videos', 'BIRM-Tutorials-Videos-sm.mp4', 'https://www.youtube.com/watch?v=dqyM-zjJvuc', '22'));
		Videos.push(new BIRM.Document('National Bridge Inspection Standards', '87_NBIS_Final.mp4', 'https://www.youtube.com/watch?v=uwa4y5dRBro', '77'));
		Videos.sort()

		return Videos;
	}
		
	var onInitDBSuccess;
	var onInitDBError;
	
	BIRM.BIRMApp.prototype.EPUBDownloadServerURL = sEPUBDownloadServerURL;
	BIRM.BIRMApp.prototype.VideoDownloadServerURL = sVideoDownloadServerURL;
	BIRM.BIRMApp.prototype.AppDirectory = sAppDirectory;
	BIRM.BIRMApp.prototype.EPUBDirectory = sEPUBDirectory;
	BIRM.BIRMApp.prototype.EPUBDirectoryFullPath = sAppDirectory + '/' + sEPUBDirectory;
	BIRM.BIRMApp.prototype.VideoDirectory = sVideoDirectory;
	BIRM.BIRMApp.prototype.VideoDirectoryFullPath = sAppDirectory + '/' + sVideoDirectory;
	BIRM.BIRMApp.prototype.ImportDirectory = sImportDirectory;
	BIRM.BIRMApp.prototype.ImportDirectoryFullPath = sAppDirectory + '/' + sImportDirectory;
    BIRM.BIRMApp.prototype.ImageDirectory = sImageDirectory;
	BIRM.BIRMApp.prototype.BIRMChapters = LoadChapters();
	BIRM.BIRMApp.prototype.BIRMVideos = LoadVideos();
	BIRM.BIRMApp.prototype.ChapterNameFormat = sChapterNameFormat;
	BIRM.BIRMApp.prototype.SupportEmail = sSupportEmail;
	BIRM.BIRMApp.prototype.FAQURL = sFAQURL;
	BIRM.BIRMApp.prototype.Version = sBIRMVersion;
	
	BIRM.BIRMApp.prototype.AllocateFileSystem = function() {
		
	    console.log('BIRMApp.AllocateFileSystem: FileSystem allocated check due to running app in webkit.');
	    onInitFs();

		//if (! navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		//	console.log('BIRMApp.AllocateFileSystem: FileSystem space required allocation due to running app in webkit.');			
		//	window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
		//		window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler); 
		//		}, function(e) {
		//			alert('Error', e);
		//	});
		//}
		//else {
		//	console.log('BIRMApp.AllocateFileSystem: App running on mobile device so FileSystem does not require allocation.');			
		//	onInitFs();
		//}
		
	}
	
	/**
	 * Initializes the BIRM mobile application
	 *
	 */	
	BIRM.BIRMApp.prototype.PreInitialize = function (successCallback, errorCallback) {

		console.log('BIRMApp.PreInitialize: Setting up filesystem and database.');
		onInitDBSuccess = successCallback;
		onInitDBError = errorCallback;
		this.AllocateFileSystem();
		this.BIRMChapters;
		this.BIRMVideos;
	};
		
	/**
	 * Initializes the BIRM mobile application
	 *
	 */	
	BIRM.BIRMApp.prototype.Initialize = function () {
	
	    console.log('BIRMApp.Initialize: Setting up database.');
		var oDB = new BIRM.Database();
		if (! oDB.PreInitializeDatabase()) {
			bInitSuccess = false;
		}
			
		var oFS = new BIRM.FileSystem();
		oFS.getDirectory(sAppDirectory, false, onDirectoryExists, onCreateDirectory);
		
	};

	BIRM.BIRMApp.prototype.GetEPUBDocuments = function (successCallback, errorCallback) {
	    console.log('BIRMApp.GetEPUBDocuments: Getting the EPUB Documents.');
	    GetFiles(sAppDirectory + '/' + sEPUBDirectory, successCallback, errorCallback);
	}

	BIRM.BIRMApp.prototype.GetVideos = function (successCallback, errorCallback) {
	    console.log('BIRMApp.GetVideos: Getting the videos.');
	    GetFiles(sAppDirectory + '/' + sVideoDirectory, successCallback, errorCallback);
	}

	BIRM.BIRMApp.prototype.ShowAlert = function (Title, Alert, Callback) 
	{
		console.log("BIRMApp.ShowAlert: platform: " + navigator.platform);		
	    var sAlert = Alert;
	    var sTitle = Title;
	    // Check is performed per PhoneGap's suggested implementation for Windows.
	    if (navigator.platform.indexOf('Win') > -1) {
	        window.alert(sAlert, Callback, sTitle);
	    }
	    else {
	        navigator.notification.alert(sAlert, Callback, sTitle);
	    }
	}

	BIRM.BIRMApp.prototype.ShowConfirmation = function (Title, Alert, Callback, Buttons) {
		console.log("BIRMApp.ShowConfirmation: platform: " + navigator.platform);				
	    var sAlert = Alert;
	    var sTitle = Title;
	    // Check is performed per PhoneGap's suggested implementation for Windows.
	    if (navigator.platform.indexOf('Win') > -1) {
	        window.confirm(sAlert, Callback, sTitle, Buttons);
	    }
	    else {
	        navigator.notification.confirm(sAlert, Callback, sTitle, Buttons);
	    }
	}

	function GetFiles(DirectoryPath, successCallback, errorCallback) {
	    console.log('BIRMApp.GetFiles: Getting the specific files as called from the strongly typed function.');
	    var oFS = new BIRM.FileSystem();
	    //oFS.GetFiles(sAppDirectory, successCallback, errorCallback);
	    oFS.GetFiles(DirectoryPath, successCallback, errorCallback);
	}

}());