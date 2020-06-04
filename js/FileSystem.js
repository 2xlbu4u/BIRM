// JavaScript Document
var BIRM = BIRM || {};

//var sFullPath;
var sRootDirectory;
var oFileSystem;

(function (){
	BIRM.FileSystem = function() { };
	
	var sAppDirectory = 'gov.dot.birm';
	
	var EventListener;
	
	var onGetDirectorySuccess = function(dir){
		//alert('directory created ' + dir.name);
		//alert('path + file ' + dir.fullPath + '/ch1.epub');
		//sFile = dir.fullPath + '/ch1.epub';
		sFullPath = dir.fullPath;
		//alert('The full path ' + sFullPath);
		//alert('The root directory ' + sRootDirectory);
		//$(this).trigger('onDirFound');
		//dir.getFile('ch1.epub', {create: true, exclusive: false}, gotFile, fail);
	}
	
	var  onGetDirectoryFail = function(error) {
		alert('Error creating directory ' + error.code);
	}
								
	var gotFile = function(fileEntry){
		//alert('got the file ' + fileEntry.name);
		//sFile = fileEntry.name;
	}
	
	var fail = function (evt){
		alert('failed to get file' + evt.target.error.code);
		alert('Download File in fail');
	}
	
	
	BIRM.FileSystem.prototype.AppFullPath = function() {
		return sFullPath;
	};
	
	//BIRM.FileSystem.prototype.RootDirectory = function() {
	//	return sRootDirectory;
	//};
	
	BIRM.FileSystem.prototype.AppDirectory = function() {
		return sAppDirectory;
	};
	
	var onInitFs = function() {
		//alert('done with fs');
	}
	
	var errorHandler = function() {
		alert('Error');
	}
	
	/**
	 * Gets a directory
	 * @param {String} location on the device where the apps files will be stored
	 * @param {String} create the directory if it does not exist
	 * @param {Function} successCallback is called with the new DirectoryEntry from JQuery.getDirectory
	 * @param {Function} errorCallback is called with the error from JQuery.getDirectory
	 */	
	BIRM.FileSystem.prototype.getDirectory = function (DirectoryName, Create, successCallback, errorCallback) {
	
		try {
				
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
							function(fileSystem){ // success get file system
								sRootDirectory = fileSystem.root;							
								sRootDirectory.getDirectory(DirectoryName, {create: Create, exclusive: false}, successCallback, errorCallback);					
							}, function(evt){ // error get file system
								alert("File System Error: "+evt.target.error.code);
							}
						);
		}
		catch(e) {
			alert('FileSystem.getDirectory: An error occurred getting ' + DirectoryName + '. (' + e.message + '.');
		}
	};
	
	BIRM.FileSystem.prototype.getFile = function (FileName, Create, successCallback, errorCallback) {
	//	alert('getBIRMDocument');
		try {
		
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
							function(fileSystem){ // success get file system
								sRootDirectory = fileSystem.root;
								sRootDirectory.getFile(FileName, {create: Create, exclusive: false}, successCallback, errorCallback);			
							}, function(evt){ // error get file system
								alert("File System Error: "+evt.target.error.code);
							}
						);
		}
		catch(e) {
		    alert('FileSystem.getFile: An error occurred getting ' + FileName + '. (' + e.message + '.');
		}	
	};
	
	//Private function to get the file
	BIRM.FileSystem.prototype.getFileSystem = function () {
	    try {
	        
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
							function(fileSystem){ // success get file system
								oFileSystem = fileSystem;
								//alert('FileSytem.getFileSystem: The fileSystem root is ' + sRootDirectory);
								//alert('FileSytem.getFileSystem: The fileSystem root2 is ' + fileSystem.root);								
								//alert('the app directory in getFileSystem ' + sAppDirectory);
								//sRootDirectory.getDirectory(sAppDirectory, {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);
							}, function(evt){ // error get file system
								alert("File System Error: "+evt.target.error.code);
							}
						);
		}
		catch(e) {
		    alert('FileSystem:getFileSystem: An error occurred. (' + e.message + ')');
		}

	    return oFileSystem;
	}

	BIRM.FileSystem.prototype.GetFiles = function (DirectoryName, successCallback, errorCallback) {

	    console.log('FileSystem.GetFiles: Getting the specific files in ' + DirectoryName + '.');

	    try {
	        if (DirectoryName !== '') {
	            var arrDirs = DirectoryName.split('/');
	            var sRootDir = arrDirs[0];
	            var sEPUBSDir = arrDirs[1];
	            this.getDirectory(sRootDir, true, function (dirEntry) {
	                console.log('FileSystem.GetFiles: The root directory is ' + dirEntry.fullPath + '.');
	                dirEntry.getDirectory(sEPUBSDir, { create: true, exclusive: false }, function (dirEPUBSEntry) {
	                    console.log('FileSystem.GetFiles: The EPUB directory is ' + dirEPUBSEntry.fullPath + '.');
	                    var directoryReader = dirEPUBSEntry.createReader();
	                    directoryReader.readEntries(successCallback, errorCallback);
	                },
                    function (error) { alert('FileSystem.GetFiles: Error Code: ' + error.code); }
                    );
	            },
                errorCallback);
	        }
	        else {
	            throw 'The directory name is an empty string.';
	        }
	    }
	    catch (e) {
	        alert('FileSystem:GetFiles: An error occurred getting file in ' + DirectoryName + '. (' + e.message + ')');
	    }
	}

}());