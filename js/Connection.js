// JavaScript Document


var BIRM = BIRM || {};

(function ($){
	
	document.addEventListener("offline", onOffline, false);
	
	function onOffline() {
		//window.location = 'NoConnection.html';
	}
	
	//BIRM.Connection = function() { };

	BIRM.Connection.prototype.GetConnectionType = function() {
		console.log("Connection.GetConnectionType: Getting the device's connection type.");		
		var networkState = navigator.network.connection.type;

		var states = {};
		states[Connection.UNKNOWN] = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI] = 'WiFi connection';
		states[Connection.CELL_2G] = 'Cell 2G connection';
		states[Connection.CELL_3G] = 'Cell 3G connection';
		states[Connection.CELL_4G] = 'Cell 4G connection';
		states[Connection.CELL] = 'Cell generic connection';
		states[Connection.NONE] = 'No network connection';

		console.log("Connection.GetConnectionType: The connection type is " + networkState + ".");
		return states[networkState];
	}
	
	BIRM.Connection.prototype.IsConnected = function() {
		
		console.log("Connection.IsConnected: Checking to see if the mobile device is connected to a mobile network of WiFi.");
		var bConnected = true;
		var networkState = navigator.network.connection.type;
		if (networkState == 'unknown' && networkState == 'none') {
			bConnected = false;
		}

		console.log("Connection.IsConnected: The device connection is " + bConnected + ".");
		
		return bConnected;
	}
	
}());