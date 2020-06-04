// JavaScript Document
var BIRM = BIRM || {};

(function (){

    var db = window.openDatabase("BIRM", "1.0", "BIRM", 200000);

    BIRM.Database = function () { };
	
	BIRM.Database.prototype.PreInitializeDatabase = function(successCallback, errorCallback){
		console.log('Database.PreInitializeDatabase');
	    try {
			db.transaction(this.createTermsTables, errorCallback, successCallback);
		}
		catch(err) {
			console.log('Database.PreInitializeDatabase: Error creating database. ' + err.message);
		}
		
	} 

	BIRM.Database.prototype.InitializeDatabase = function(){
		console.log('Database.InitializeDatabase');
		var bSuccess = true;
		try {			
			db.transaction(this.createTables, errorCB, successCB);
		}
	    catch (err) {
	        console.log('Database.PreInitializeDatabase: Error creating database. ' + err.message);
			bSuccess = false;
		}
		
		return bSuccess;
	} 
	
	BIRM.Database.prototype.createTermsTables = function(tx) {
	
		console.log("Database.createTermsTables: Creating tblAgreement.");
		tx.executeSql('CREATE TABLE IF NOT EXISTS tblAgreement (Agree INTEGER, Show INTEGER);' , []);

	}
	
	BIRM.Database.prototype.createTables = function(tx) {

	    console.log("Database.createTables: Creating tblConfiguration.");
	    //tx.executeSql('DROP TABLE tblFieldNotes', []);
	    tx.executeSql('CREATE TABLE IF NOT EXISTS tblFieldNotes (NoteID INTEGER PRIMARY KEY, Title VARCHAR, Date VARCHAR, Time VARCHAR, Location VARCHAR, Notes VARCHAR);', []);
	    tx.executeSql('CREATE TABLE IF NOT EXISTS tblConfiguration (ConfigID INTEGER PRIMARY KEY, Key VARCHAR, Value VARCHAR);', []);
	    tx.executeSql('select * from tblConfiguration;', [], 
            function (transaction, results) {
                console.log("Database.createTables: The number of records in tblConfiguration is " + results.rows.length + ".");
                if (results.rows.length === 0) {
                    console.log("Database.createTables: Inserting configuration data.")
                    tx.executeSql('INSERT INTO tblConfiguration (Key, Value) VALUES ("DownloadConfig", NULL)');
                    tx.executeSql('INSERT INTO tblConfiguration (Key, Value) VALUES ("FirstUseSetupComplete", "false")');
                }
                else {
                    console.log("Database.createTables: Configuration data already exists.")
                    console.log("Database.createTables: {Key:" + results.rows.item(0)['Key'] + ":Value:" + results.rows.item(0)['Value'] + "}");
                    console.log("Database.createTables: {Key:" + results.rows.item(1)['Key'] + ":Value:" + results.rows.item(1)['Value'] + "}");
                }
            }, 
            errorHandler);
	}

	BIRM.Database.prototype.deleteAgreement = function(){
		try {
			console.log("Database.deleteAgreement: Deleting agreement data.");
			
			var query = "Delete FROM tblAgreement";
			db.transaction(function(transaction){
			    transaction.executeSql(query, [], function (transaction, results){
			        if (!results.rowsAffected)  {
			        }
			    }, errorHandler);
			});
		}
		catch(e){
			alert(e);
			
		} 
	}
	
	BIRM.Database.prototype.createAgreement = function(var1, successCallback, errorCallback) {
		
		console.log("Database.createAgreement: Creating agreement data.");
	    
		if(var1==1){
			try {
			 var getShow = 0;
			 var  Fl = document.getElementById('chkShow').value;
			 
			  if ( Fl == 'True') 
				{
				   getShow=1;
				}
			 
			 
			 
			 this.deleteAgreement();
			 var query = "insert into tblAgreement (Agree,Show) values (?,?);"; 
			 
			 db.transaction(function(transaction)
			 {
			     transaction.executeSql(query, [var1, getShow], successCallback, errorCallback);				 
			 }, errorHandler);
			} 
			catch (e) 
			{
				alert("Error: " + e + ".");
			}
		}
		else {
			alert("error so redirect to terms.");
		}	
	}
	
	BIRM.Database.prototype.getAgreement = function(successCallback){

		console.log("Database.getAgreement: Getting agreement data.");
		try {
			 var query = "SELECT * FROM tblAgreement WHERE Agree=1;";
			 db.transaction(function(transaction)
			 {
			     transaction.executeSql(query, [], successCallback, errorHandler);
			 }, errorHandler);
		} 
		catch (e) 
		{
			alert("Error: " + e + ".");
		}	
	}

	BIRM.Database.prototype.showAgreement = function(successCallback){

		console.log("Database.showAgreement: Getting show agreement data.");
		try {			
			 var query = "SELECT * FROM tblAgreement WHERE Agree=1 and Show=1;"; 
			 db.transaction(function(transaction)
			 {
			     transaction.executeSql(query, [], successCallback, errorHandler);
			 }, errorHandler);
		} 
		catch (e) 
		{
			alert("Error: " + e + ".");
		}
	}

	BIRM.Database.prototype.getDownloadConfig = function (successCallback, errorCallback) {

	    console.log("Database.getDownloadConfig: Getting download configuration data.");
	    getConfigurationSettingByKey('DownloadConfig', successCallback, errorCallback);
	}

	BIRM.Database.prototype.saveDownloadConfig = function(ConfigSetting, successCallback, errorCallback) {
		
	    console.log("Database.saveDownloadConfig: Saving download preferences data.");
        saveConfigurationSetting('DownloadConfig', ConfigSetting, successCallback, errorCallback);

	}

	BIRM.Database.prototype.getFirstUseSetupComplete = function(Key, successCallback){

		console.log("Database.getFirstUseSetupComplete: Getting first use setup complete configuration data.");
		getConfigurationSettingByKeyAndValue('FirstUseSetupComplete', Key, successCallback, errorCallback);

	}
	
	BIRM.Database.prototype.showFirstUseSetup = function(successCallback, errorCallback){

		console.log("Database.showFirstUseSetup: Getting first use setup to validate showing setup screen.");
		getConfigurationSettingByKeyAndValue('FirstUseSetupComplete', 'true', successCallback, errorCallback);
		
	}
	
	BIRM.Database.prototype.saveFirstUseComplete = function(Value, successCallback, errorCallback) {
		
		console.log("Database.saveFirstUseComplete: Saving first use completed status.");
		saveConfigurationSetting('FirstUseSetupComplete', Value, successCallback, errorCallback);

	}
						
	function errorCB(err) {
		console.log("Database.errorCB - Error processing SQL: " + err);
	}
	
	function successCB() {
		console.log("Database.successCB - Database created successfully.");
	}
	
	var errorHandler = function(error)
	{
		alert("Error: " + error.code);
		return true;
	}

	var getConfigurationSettingByKey = function(Key, successCallback, errorCallback) {
	    console.log("Database.getConfigurationSettingByKey: Getting configuration setting.");
	    try {
	        var query = "SELECT * FROM tblConfiguration WHERE Key=?;";
	        console.log("Database.getConfigurationSettingByKey: " + query + ".");
	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [Key], successCallback, errorHandler);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert("Database.getConfigurationSettingByKey: Error - " + e + ".");
	    }
	}

	function getConfigurationSettingByKeyAndValue(Key, Value, successCallback, errorCallback) {
	    console.log("Database.getConfigurationSettingByKeyAndValue: Getting configuration setting.");
	    try {
	        var query = "SELECT * FROM tblConfiguration WHERE Key=? AND Value=?;";
	        console.log("Database.getConfigurationSettingByKeyAndValue: " + query + ".");
	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [Key, Value], successCallback, errorHandler);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert("Database.getConfigurationSettingByKeyAndValue: Error - " + e + ".");
	    }
	}

	var saveConfigurationSetting = function(Key, Value, successCallback, errorCallback) {

	    try {
	        var query = "update tblConfiguration set Value=? where Key=?;";
	        console.log("Database.saveConfigurationSetting: " + query + ".");
	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [Value,Key], successCallback, errorCallback);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert("Database.saveConfigurationSetting: Error - " + e + ".");
	    }
	}

	BIRM.Database.prototype.getNoteList = function (successCallback, errorCallback) {

		
	  
	    console.log("Database.getNoteList: Getting the list of notes.");
	    try {
	        var query = "SELECT * FROM tblFieldNotes;";

	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [], successCallback, errorCallback);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert("Error: " + e + ".");
	    }
	}

	BIRM.Database.prototype.getNote = function (Note, successCallback, errorCallback) {

	    console.log("Database.getNoteList: Getting the list of notes.");
	    try {
	        var gNoteID = Note.NoteID;

	        var query = "SELECT * FROM tblFieldNotes WHERE NoteID=?;";

	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [gNoteID], successCallback, errorCallback);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert("Error: " + e + ".");
	    }
	}

	BIRM.Database.prototype.createNote = function (Note, successCallback, errorCallback) {

	    console.log("Database.createNote: Creating note data.");
	    try {
	        var sTitle = Note.NoteTitle;
	        var sDate = Note.NoteDate;
	        var sTime = Note.NoteTime;
	        var sLocation = Note.NoteLocation;
	        var sNote = Note.NoteDescription;

	        var query = "INSERT INTO tblFieldNotes (Title, Date, Time, Location, Notes) values (?,?,?,?,?);";

	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [sTitle,sDate,sTime,sLocation,sNote], successCallback, errorCallback);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert("Error: " + e + ".");
	    }
		
	    console.log("Database.createNote: Note data created. time is: " + sTime);
	}

	BIRM.Database.prototype.updateNote = function (Note, successCallback, errorCallback) {

	    console.log("Database.updateNote: Updating note data.");
	    try {

	        var gNoteID = Note.NoteID;
	        var sTitle = Note.NoteTitle;
	        var sDate = Note.NoteDate;
	        var sTime = Note.NoteTime;
	        var sLocation = Note.NoteLocation;
	        var sNote = Note.NoteDescription;

	        var query = "UPDATE tblFieldNotes SET Title=?, Date=?,  Time=?, Location=?, Notes=? WHERE NoteID=?;";
	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [sTitle,sDate,sTime,sLocation,sNote, gNoteID], successCallback, errorHandler);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert("Error: " + e + ".");
	    }
	}

	BIRM.Database.prototype.deleteNote = function (NoteID, successCallback, errorHandler) {
	    try {
	        console.log("Database.deleteNote: Deleting note data.");

	        var query = "Delete FROM tblFieldNotes WHERE NoteID=?;";
	        db.transaction(function (transaction) {
	            transaction.executeSql(query, [NoteID], successCallback, errorHandler);
	        }, errorHandler);
	    }
	    catch (e) {
	        alert(e);
	    }
	}

}());