/*
 Copyright 2012 OCAD University
 Copyright 2012 OCAD Gaurav Aggarwal

 Licensed under the Educational Community License (ECL), Version 2.0 or the New
 BSD license. You may not use this file except in compliance with one these
 Licenses.

 You may obtain a copy of the ECL 2.0 License and BSD License at
 https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
 */
// Declare dependencies
/*global fluid:true, jQuery*/

jQuery(document).ready(function () 
{
	console.log("document.ready: epubReaderDemo");
    // extended to include my custom UI option i.e. pageMode
    showSpinner('Loading Document', 'Loading Chapter...', 'a');
    document.addEventListener("deviceready", onDeviceReady, false); 
});

var initOrientation;
var initHeaderHeight;
var secondHeaderHeight;
var iOrientationChanges = 0;

function onDeviceReady() {

    $("#MenuOptions").on('click', function () {
        var menuX = $('#MenuOptions').position().left + $('#MenuOptions').outerWidth(true);
        var menuY = $('#MenuOptions').position().top + $('#MenuOptions').outerHeight(true);
        $('#OptionsMenu').popup('open', { x: menuX, y: menuY, positionTo: 'origin' });
    });

    $(".photopopup").on({
        popupbeforeposition: function () {
            var maxWidth = $(window).width() * .90 + "px";
            var maxHeight = $(window).height() * .50 + "px";
            $(".photopopup img").css("max-width", maxWidth);
            $(".photopopup img").css("max-height", maxHeight);
        }
    });


    $("#EPUBNotes").on({
        popupbeforeposition: function () {
            var maxWidth = $(window).width() * .90 + "px";
            var maxHeight = $(window).height() * .75 + "px";
            $("#EPUBNotes").css("max-width", maxWidth);
            $("#EPUBNotes").css("max-height", maxHeight);
        }
    });

    $('#HomeButton').click(function () {
        location.href = "MainMenu.html"
    });

    $('#btnChapters').click(function () {
        location.href = "EPUBChapters.html"
    });

    $('#MenuButton').click(function () {
        $('#menu').trigger('open');
    });

    $('#btnShowNotes').on('click', function (evt) {
        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            $('#EPUBNotes').popup('open', { y: 100 });
        }, 400);
    });

    $('#btnShowBookmarks').on('click', function (evt) {
        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            $('#EPUBBookmarks').popup('open');
        }, 400);
    });

    $('#btnChangeFont').on('click', function (evt) {
        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            $('#EPUBBookmarks').popup('open');
        }, 400);
    });

    $('#btnSmallText').on('click', function (evt) {
        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            showSpinner('Font Resizing', 'Resizing Font...', 'a');
            //$('#FontMenu').popup('close');
            setTimeout(function () {
                $('#min-text-size').val(1.2).change();
                $('#save').click();
                $.mobile.loading("hide");
            }, 400);
        }, 300);
    });

    $('#btnMediumText').click(function (evt) {
        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            showSpinner('Font Resizing', 'Resizing Font...', 'a');
            setTimeout(function () {
                $('#min-text-size').val(1.3).change();
                $('#save').click();
                $.mobile.loading("hide");
            }, 400);
        }, 300);

    });

    $('#btnLargeText').click(function (evt) {
        evt.preventDefault();

        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            showSpinner('Font Resizing', 'Resizing Font...', 'a');
            setTimeout(function () {
                $('#min-text-size').val(1.5).change();
                $('#save').click();
                $.mobile.loading("hide");
            }, 400);
        }, 300);

    });

    $('#btnXLargeText').click(function (evt) {
        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            showSpinner('Font Resizing', 'Resizing Font...', 'a');
            setTimeout(function () {
                $('#min-text-size').val(1.7).change();
                $('#save').click();
                $.mobile.loading("hide");
            }, 400);
        }, 300);

    });

    $('#btnXXLargeText').click(function (evt) {
        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            showSpinner('Font Resizing', 'Resizing Font...', 'a');
            setTimeout(function () {
                $('#min-text-size').val(2.0).change();
                $('#save').click();
                $.mobile.loading("hide");
            }, 400);
        }, 300);

    });

    var searchvisible = 0;
    $("#btnShowSearch").click(function (e) {


        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            //This stops the page scrolling to the top on a # link.
            e.preventDefault();

            if (searchvisible === 0) {
                //Search is currently hidden. Slide down and show it.
                $("#searchbar-manual").slideDown(200);
                $('#btnShowSearch a').html('Hide Search');
                searchvisible = 1; //Set search visible flag to visiFble.
            } else {
                //Search is currently showing. Slide it back up and hide it.
                $("#searchbar-manual").slideUp(200);
                $('#btnShowSearch a').html('Show Search');
                searchvisible = 0;
            }
        }, 400);


    });

    $('#btnChangeContrast').click(function () {

        $("#OptionsMenu").popup('close');
        setTimeout(function () {
            showSpinner('Changing Background', 'Changing Background...', 'a');

            if (window.localStorage.getItem('theme') === undefined || window.localStorage.getItem('theme') === null) {
                $('.flc-uiOptions-theme').val("wb").change();
                $.mobile.changeGlobalTheme("b");
                window.localStorage.setItem('theme', 'b');
            }
            else if (window.localStorage.getItem('theme') === 'b') {
                $('.flc-uiOptions-theme').val("default").change();
                $.mobile.changeGlobalTheme("a");
                window.localStorage.setItem('theme', 'a');
            }
            else if (window.localStorage.getItem('theme') === 'a') {
                $('.flc-uiOptions-theme').val("wb").change();
                $.mobile.changeGlobalTheme("b");
                window.localStorage.setItem('theme', 'b')
            }

            setTimeout(function () {
                $('#save').click();
                $.mobile.loading('hide');
            }, 400);

        }, 300);

    });


    function setBIRMTheme() {

        alert(window.localStorage.getItem('theme'));


    }

    // Raj - Get this code for changing the themes
    // Dynamically changes the theme of all UI elements on all pages,
    // also pages not yet rendered (enhanced) by jQuery Mobile.
    $.mobile.changeGlobalTheme = function (theme) {
        // These themes will be cleared, add more
        // swatch letters as needed.
        var themes = " a b c d e";

        // Updates the theme for all elements that match the
        // CSS selector with the specified theme class.
        function setTheme(cssSelector, themeClass, theme) {
            $(cssSelector)
                .removeClass(themes.split(" ").join(" " + themeClass + "-"))
                .addClass(themeClass + "-" + theme)
                .attr("data-theme", theme);
        }

        // Add more selectors/theme classes as needed.
        setTheme(".ui-mobile-viewport", "ui-overlay", theme);
        setTheme("[data-role='page']", "ui-body", theme);
        setTheme("[data-role='page']", "ui-page-theme", theme);
        setTheme("[data-role='header']", "ui-bar", theme);
        setTheme("[data-role='content']", "ui-content", theme);
        setTheme("[data-role='content']", "ui-body", theme);
        setTheme("[data-role='listview'] > li", "ui-bar", theme);
        setTheme("[data-role='listdivider'] > li", "ui-bar", theme);
        setTheme("[data-role='controlgroup']", "ui-group-theme", theme);
        //setTheme(".ui-btn", "ui-btn-up", theme);
        //setTheme(".ui-btn", "ui-btn-hover", theme);
        setTheme("[data-role='popup']", "ui-body", theme);
        setTheme("[data-role='popup']", "ui-overlay", theme);
        setTheme(".ui-loader", "ui-overlay", theme);
        setTheme(".ui-loader", "ui-body", theme);
    };
    // Raj - Get this code for changing the themes

    $(document).on("pagecontainertransition", function () {
        handleScreenSize(null);
    });

    $(window).on("resize", function () {
        handleScreenSize(null);
    })

    $(window).on("orientationchange", function (evt) {
        handleScreenSize(evt.orientation);
    })

    //$('#currentChapterName').append(window.localStorage.getItem('CurrentChapterName'));

    handleScreenSize(null);
    loadEPUBReader();
}

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

function handleScreenSize(orientation) {

    var initHeader;
    var screen = 0;
    var header = 0;
    var footer = 0;
    var contentCurrent = 0;
    var content = 0;

    var screen = $.mobile.getScreenHeight();
    var header = $('.ui-header').outerHeight();
    var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height() + $('.fl-epubReader-progressIndicator').height();
    var content = screen - header - contentCurrent;
    $("#BIRMContent").height(content);

}

function loadEPUBReader() {

    fluid.staticEnvironment.uiEnhancer = fluid.uiEnhancer(".fl-epubReader-bookContainer", {
        components: {
            pageMode: {
                type: "fluid.uiEnhancer.classSwapper",
                container: "{uiEnhancer}.container",
                options: {
                    classes: "{uiEnhancer}.options.classnameMap.pageMode"
                }
            },
            settingsStore: {
                options: {
                    defaultSiteSettings: {
                        pageMode: "scroll"  ///Alex scroll
                    }
                }
            }
        },
        classnameMap: {
            "pageMode": {
                "split": "fl-font-uio-times",
                "scroll": "fl-font-uio-times"
            }
        }
    });

    var sPage;
    var epubReader;
    if (window.localStorage.getItem("Chapter") == null) {
        sPage = "ch1.epub"
        epubReader = fluid.epubReader(".fl-epubReader-container", { book: { epubPath: sPage } });
    }
    else {
        sPage = window.localStorage.getItem("Chapter");
        epubReader = fluid.epubReader(".fl-epubReader-container", { book: { epubPath: sPage } });
    }

}