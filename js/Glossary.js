// JavaScript Document
	
/* Page level event listeners. */
$(document).ready(function () 
{
	console.log("document.ready: glossary");
    document.addEventListener('deviceready', onDeviceReady, false);
});
	
function onDeviceReady() {

    $('#HomeButton').on("click", function () {
       location.href = "MainMenu.html"
    })

    $('#BackButton').on("click", function () {
        location.href = "MainMenu.html";
    });

    $("#sorter li").click(function () {

        var top,
			letter = $(this).text(),
            divider = $(".ui-li-divider:contains('" + letter + "')");

        if (divider.length > 0) {
            top = divider.offset().top;
            $.mobile.silentScroll(top - $('.ui-content').offset().top);
        } else {
            return false;
        }
    });

}