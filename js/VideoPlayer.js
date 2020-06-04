// JavaScript Document
//var BIRM = BIRM || {};
//
//(function (){

    /* Page level event listeners. */
    $(document).ready(function () {
        console.log("VideoList.DocumentReady: Video document is ready");
        alert("VideoList.DocumentReady: Video document is ready.");
        document.addEventListener('deviceready', onDeviceReady, false);

    });

    function onDeviceReady() {

        alert("VideoList.onDeviceReady");

        //$('#BackButton').on("click", function () {
        //    history.back();
        //});
        //
        //$('#HomeButton').on("click", function () {
        //    location.href = "MainMenu.html";
        //});

        vidSwap();
	}
 
    function vidSwap() {
        var sVideo = window.localStorage.getItem("Video");
        alert('svid is ' + sVideo);
        if (sVideo.indexOf('www.youtube.com/embed') > 0) {
            //$('#pl1').hide();
            //$('#pl2').show();
            //var myVideo1 = document.getElementsByTagName('iframe');
            //myVideo1.src = sVideo;
            //var svideo = '<iframe id="player2" height="80%" width="100%" frameborder="0" src="' + sVideo + '"  ></iframe>';
            //$('#pl2').append(svideo);
        }
        else {
            $('#pl2').hide();
            $('#pl1').show();
            var myVideo = document.getElementsByTagName('video')[0];
            $('#player source').attr('src', sVideo);
            $('video, audio').mediaelementplayer({
                // if set, overrides <video width>
                videoWidth: 10,
                // if set, overrides <video height>
                videoHeight: 10,
                // force iPad's native controls
                iPadUseNativeControls: true,
                // force iPhone's native controls
                iPhoneUseNativeControls: true,
                // force Android's native controls
                AndroidUseNativeControls: true
            });
        }
    }

//}());