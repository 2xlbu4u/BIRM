// JavaScript Document
var BIRM = BIRM || {};

(function (){
	
	BIRM.Download = function () { };
	
	var sURL;
	var oEPUBDirectory;
	var sFileName;
	var onDownloadSuccess;
	var onDownloadError;
	
	/**
	 * Downloads files from a URL
	 *
	 * @param {String} URL to the location where the EPUB documents exist
	 * @param {String} location on the device where the downloaded file will be stored
	 * @param {Function} successCallback is called with the new entry from FileTransfer
	 * @param {Function} errorCallback is called with the error from FileTransfer
	 */	
	BIRM.Download.prototype.DownloadEPUB = function (URL, EPUBDirectory, FileName, successCallback, errorCallback) {
	    console.log('Download.DownloadEPUB: Preparing to download ' + FileName + ' to device.');
	
		sURL = URL;
		oEPUBDirectory = EPUBDirectory;
		sFileName = FileName;
		onDownloadSuccess = successCallback;
		onDownloadError = errorCallback;

		console.log("Download.DownloadEPUB: " + oEPUBDirectory.toURL());
		//	alert("Download.DownloadEPUB: " + sAppDirectory);
		//var oFS = new BIRM.FileSystem();
		//var sAppDirectory = oFS.AppDirectory;
	    //oFS.getDirectory(sAppDirectory, false, onDirectoryExists, onCreateDirectory);
		Download(oEPUBDirectory);
					
	};

	BIRM.Download.prototype.DownloadAttachment = function (URL, EPUBDirectory, FileName, successCallback, errorCallback) {
	    console.log('Download.DownloadAttachment: Preparing to download ' + FileName + ' to device.');

	    sURL = URL;
	    oEPUBDirectory = EPUBDirectory;
	    sFileName = FileName;
	    onDownloadSuccess = successCallback;
	    onDownloadError = errorCallback;

	    console.log("Download.DownloadAttachment: " + EPUBDirectory.toURL());
	    DownloadAttachment(oEPUBDirectory);
	};

	var onDirectoryExists = function(dirEntry) {
	    console.log("Download.onDirectorySuccess: Diretory was successfully created or already exists and file can be downloaded.");
	//	alert("Download.onDirectorySuccess: Diretory was successfully created or already exists and file can be downloaded.");
		Download(dirEntry);			
	}

	var onCreateDirectory = function() {
	    console.log("Download.onCreateDirectory: Directory must be created.");
		var oFS = new BIRM.FileSystem();
		oFS.getDirectory(sAppDirectory, true, onDirectoryExists, onCreateDirectoryError);				
	}
	
	var onCreateDirectoryError = function() {
		console.log("Download.onCreateDirectoryError: The directory could not be created.");
//		alert("Download.onCreateDirectoryError: The directory could not be created.");
	}
	
	function Download(dirEntry) {
	  
		var sFullPath = dirEntry.toURL();
		sFullPath = sFullPath + sFileName;
		sURL = sURL + sFileName;

		console.log("Download.Download: Downloading " + sFileName + " from " + sURL + " to " + sFullPath + ".");
		var oFileTransfer = new FileTransfer();

		var initDom = $('.ui-loader h1').html();
		oFileTransfer.onprogress = function (progressEvent) {
		    if (progressEvent.lengthComputable) {
		        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
		        $('.ui-loader h1').html(initDom + perc + "%");
		    }
		};

		oFileTransfer.download(sURL, sFullPath, onDownloadSuccess, onDownloadError, 'Content-Type:application/epub+zip');
	}
	
	function DownloadAttachment(dirEntry) {

	    var sFullPath = dirEntry.toURL();
	    sFullPath = sFullPath + sFileName;

	    console.log("Download.Download: Downloading " + sFileName + " from " + sURL + " to " + sFullPath + ".");
	    var oFileTransfer = new FileTransfer();
	    oFileTransfer.download(sURL, sFullPath, onDownloadSuccess, onDownloadError, 'Content-Type:application/epub+zip');
	}

}());