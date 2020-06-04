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
/*global fluid_1_4:true, jQuery*/

var fluid_1_4 = fluid_1_4 || {};

/*
* jQuery Highlight plugin
*
* Based on highlight v3 by Johann Burkard
* http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
*
* Code a little bit refactored and cleaned (in my humble opinion).
* Most important changes:
*  - has an option to highlight only entire words (wordsOnly - false by default),
*  - has an option to be case sensitive (caseSensitive - false by default)
*  - highlight element tag and class names can be specified in options
*
* Usage:
*   // wrap every occurrance of text 'lorem' in content
*   // with <span class='highlight'> (default options)
*   $('#content').highlight('lorem');
*
*   // search for and highlight more terms at once
*   // so you can save some time on traversing DOM
*   $('#content').highlight(['lorem', 'ipsum']);
*   $('#content').highlight('lorem ipsum');
*
*   // search only for entire word 'lorem'
*   $('#content').highlight('lorem', { wordsOnly: true });
*
*   // don't ignore case during search of term 'lorem'
*   $('#content').highlight('lorem', { caseSensitive: true });
*
*   // wrap every occurrance of term 'ipsum' in content
*   // with <em class='important'>
*   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
*
*   // remove default highlight
*   $('#content').unhighlight();
*
*   // remove custom highlight
*   $('#content').unhighlight({ element: 'em', className: 'important' });
*
*
* Copyright (c) 2009 Bartek Szopka
*
* Licensed under MIT license.
*
*/

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (re, options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        if ($(this).text() === re) {
            var parent = this.parentNode;
            parent.replaceChild(this.firstChild, this);
            parent.normalize();
        }
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function (word, i) {
        return word != '';
    });
    words = jQuery.map(words, function (word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

(function ($, fluid) {

    var sSelectedSection = '';
    var sUserSelection = '';

    /* Add fluid logging */
    fluid.setLogging(false);

    /* TinyMCE Editor Component using Rich Text Inline Edit API */
    fluid.defaults('fluid.epubReader.bookHandler.editor', {
        gradeNames: ['fluid.viewComponent', 'autoInit'],
        selectors: {
            editActivationButton: '{epubReader}.options.selectors.editActivationButton',
            chapterContent: '{epubReader}.options.selectors.chapterContent',
            editorSaveButton: '{epubReader}.options.selectors.editorSaveButton',
            editorCancelButton: '{epubReader}.options.selectors.editorCancelButton',
            chapterStyle: '{epubReader}.options.selectors.chapterStyle',
            chapterStyleElement: '{epubReader}.options.selectors.chapterStyleElement'
        },
        width: '100%',
        height: '100%',
        finalInitFunction: 'fluid.epubReader.bookHandler.editor.finalInit'
    });

    fluid.epubReader.bookHandler.editor.finalInit = function (that) {

        var makeButtons = function (editor) {
            $(that.options.selectors.editorSaveButton, editor.container).click(function () {
                editor.finish();
                return false;
            });

            $(that.options.selectors.editorCancelButton, editor.container).click(function () {
                editor.cancel();
                return false;
            });
        },
            // Create a TinyMCE-based Rich Inline Edit component.
            tinyEditor = fluid.inlineEdit.tinyMCE(that.container, {
                tinyMCE: {
                    width: that.options.width,
                    height: that.options.height,
                    theme: 'advanced',
                    theme_advanced_toolbar_location: 'top'
                },
                strings: {
                    // To hide edit button placed just above the editing region
                    textEditButton: ''
                },
                defaultViewText: '',
                listeners: {
                    onBeginEdit: function () {
                        // disable edit button
                        that.locate('editActivationButton').attr('disabled', 'disabled');
                        /*
                         A workaround for TinyMCE issue
                         Details - TinyMCE select all visible elements and make them available for editing
                         irrespective of the fact that some ancestor of element might be hidden.

                        that.locate('chapterContent').find(':hidden').each(function () {
                            $(this).find('*').hide();
                        });
                         */
                        // Initialize TinyMCE editor with updated chapter content
                        //tinyEditor.updateModelValue(that.locate('chapterContent').html(), null);
                    },
                    afterInitEdit: function (editor) {
                        // Apply current chapter styles to TinyMCE editor
                        //editor.dom.addClass(editor.dom.select('body'), that.options.selectors.chapterStyleElement.slice(1));
                        //editor.dom.add(editor.dom.select('head'), 'style', {type: 'text/css'}, that.locate('chapterStyle').find('style').text());
                    },
                    afterFinishEdit: function (newValue, oldValue, editNode, viewNode) {
                        // enable edit button
                        that.locate('editActivationButton').removeAttr('disabled');
                    }
                },
                useTooltip: false
            });
        makeButtons(tinyEditor);

        that.attachEditor = function () {
            tinyEditor.edit();
        };
        /* Attach click handler for custom edit button */
        that.locate('editActivationButton').click(function () {
            that.attachEditor();
        });
    };

    fluid.defaults('fluid.epubReader.bookHandler.parser', {
        gradeNames: ['fluid.viewComponent', 'autoInit'],
        selectors: {
            contentTitle: '{bookHandler}.options.selectors.contentTitle',
            tocSelector: '{bookHandler}.options.selectors.tocSelector'
        },
        epubVersion: 2,
        finalInitFunction: 'fluid.epubReader.bookHandler.parser.finalInit'
    });

    fluid.epubReader.bookHandler.parser.finalInit = function (that) {

        var oebps_dir = '',
            opf_file = '',
            ncx_file = '';

        /* Open the container file to find the resources */
        that.getContainerFile = function (f) {
            opf_file = $(f).find('rootfile').attr('full-path');

            // Get the OEpBS dir, if there is one
            if (opf_file.indexOf('/') !== -1) {
                oebps_dir = opf_file.substr(0, opf_file.lastIndexOf('/'));
            }
            return opf_file;
        };

        /* Open the TOC, get the first item and open it */
        that.getTOC = function (f) {

            var table = {
                names: [],
                values: []
            }, nav_tag, content_tag, text_tag;

            // ePub 2 compatibility to parse toc.ncx file
            if (that.options.epubVersion === 2) {

                // Some ebooks use navPoint while others use ns:navPoint tags
                nav_tag = 'ns\\:navPoint';
                content_tag = 'ns\\:content';
                text_tag = 'ns\\:text';

                if ($(f).find('ns\\:navPoint').length === 0) {
                    nav_tag = 'navPoint';
                    content_tag = 'content';
                    text_tag = 'text';
                }

                $(f).find(nav_tag).each(
                    function () {
                        var s = $(this).find(text_tag + ':first').text(),
                            a = oebps_dir + '/' + $(this).find(content_tag).attr('src');

                        // If 's' has a parent navPoint, indent it
                        if ($(this).parent()[0].tagName.toLowerCase() === nav_tag) {
                            s = '&nbsp;&nbsp;' + s;
                        }
                        table.names.push(s);
                        table.values.push(a);
                    }
                );

                $(f).find(nav_tag).each(
				function () {

				    var s = $('<span/>').text(
							$(this).find(text_tag + ':first').text());
				    var a = $('<a/>').attr(
							'href',
							oebps_dir
							+ '/'
							+ $(this).find(content_tag).attr(
							'src'));
				    // If 's' has a parent navPoint, indent it
				    if ($(this).parent()[0].tagName.toLowerCase() == nav_tag) {
				        s.addClass('indent');
				    }
				    s.appendTo(a);
				    a.appendTo($('<li/>').appendTo('#toc'));
				});
            }

            // ePub 3 compatibility to parse toc.xhtml file
            if (that.options.epubVersion === 3) {
                $(f).filter('nav').find('li').each(
                    function () {

                        var p = $(this).find('a:first').attr('href').split("#");
                        page = p[0];
                        var s = $(this).find('a:first').text(),
                        a = oebps_dir + '/' + page
                        // If 's' has a parent navPoint, indent it
                        if ($(this).parent().parent()[0].tagName.toLowerCase() === 'li') {
                            s = '&nbsp;&nbsp;' + s;
                        }
                        table.names.push(s);
                        table.values.push(a);

                    }
                );
            }

            var oUL;
            oUL = $(f).filter('nav').html();
            var te = $(oUL).filter('ol:first').html();
            gtoc = te;
            $('#toc').append(gtoc);
            loadMenu();
            return { table: table, currentSelection: table.values[0] };

        };

        /* Open the OPF file and read some useful metadata from it */
        that.opf = function (f) {

            // Get the document title
            var title = $(f).find('title').text(), // Safari
                author = $(f).find('creator').text(),
                // Get the NCX
                opf_item_tag = 'opf\\:item',
                epub_version_tag = 'opf\\:package';

            that.locate('contentTitle').html(title + ' by ' + author);

            // Firefox
            if (title === null || title === '') {
                that.locate('contentTitle').html($(f).find('dc\\:title').text() + ' by ' + $(f).find('dc\\:creator').text());
            }


            if ($(f).find('opf\\:item').length === 0) {
                opf_item_tag = 'item';
                epub_version_tag = 'package';
            }

            that.options.epubVersion = parseInt($('<div/>').append($(f)).find(epub_version_tag).attr('version'), 10);

            $(f).find(opf_item_tag).each(function () {
                // Cheat and find the first file ending in NCX
                // modified to include ePub 3 support
                if ($(this).attr('href').indexOf('.ncx') !== -1 || $(this).attr('id').toLowerCase() === 'toc') {
                    ncx_file = oebps_dir + '/' + $(this).attr('href');
                }
            });
            return ncx_file;
        };
    };

    fluid.defaults('fluid.epubReader.bookHandler', {
        gradeNames: ['fluid.viewComponent', 'autoInit'],
        components: {
            parser: {
                type: 'fluid.epubReader.bookHandler.parser',
                container: '{bookHandler}.container'
            },
            navigator: {
                type: 'fluid.epubReader.bookHandler.navigator',
                container: '{bookHandler}.container'
            },
            editor: {
                type: 'fluid.epubReader.bookHandler.editor',
                container: '{bookHandler}.container'
            }
        },
        selectors: {
            contentTitle: '{epubReader}.options.selectors.contentTitle',
            remaining: '{epubReader}.options.selectors.remaining',
            chapterStyle: '{epubReader}.options.selectors.chapterStyle',
            chapterContent: '{epubReader}.options.selectors.chapterContent',
            tocSelector: '{epubReader}.options.selectors.tocSelector',
            bookContainer: '{epubReader}.options.selectors.bookContainer',
            addBookmarkButton: '{epubReader}.options.selectors.addBookmarkButton',
            addNoteButton: '{epubReader}.options.selectors.addNoteButton',
            nextButton: '{epubReader}.options.selectors.nextButton',
            previousButton: '{epubReader}.options.selectors.previousButton',
            nextChapterButton: '{epubReader}.options.selectors.nextChapterButton',
            previousChapterButton: '{epubReader}.options.selectors.previousChapterButton',
            downloadButton: '{epubReader}.options.selectors.downloadButton',
            searchField: '{epubReader}.options.selectors.searchField',
            searchForm: '{epubReader}.options.selectors.searchForm',
            searchButton: '{epubReader}.options.selectors.searchButton'
        },
        events: {
            onUIOptionsUpdate: null,
            onPageModeRestore: null,
            onDownloadRequest: null
        },
        keyboardShortcut: {
            bookmarkKey: '{epubReader}.options.keyboardShortcut.bookmarkKey',
            noteKey: '{epubReader}.options.keyboardShortcut.noteKey',
            nextNavigationKey: '{epubReader}.options.keyboardShortcut.nextNavigationKey',
            previousNavigationKey: '{epubReader}.options.keyboardShortcut.previousNavigationKey',
            nextChapterNavigationKey: '{epubReader}.options.keyboardShortcut.nextChapterNavigationKey',
            previousChapterNavigationKey: '{epubReader}.options.keyboardShortcut.previousChapterNavigationKey',
            editKey: '{epubReader}.options.keyboardShortcut.editKey'
        },
        listeners: {
            onDownloadRequest: '{filefacilitator}.downloadEpubFile'
        },
        finalInitFunction: 'fluid.epubReader.bookHandler.finalInit'
    });

    fluid.epubReader.bookHandler.finalInit = function (that) {

        var bookmarkKeyboardHandler = function (e) {
            var code = e.keyCode || e.which;
            if (code === that.options.keyboardShortcut.bookmarkKey && e.shiftKey) {
                // prevent input texbox to be filled with B
                e.preventDefault();
                that.addBookmarkHandler();
            }
        },
            notesKeyboardHandler = function (e) {
                var code = e.keyCode || e.which;
                if (code === that.options.keyboardShortcut.noteKey && e.shiftKey) {
                    // prevent input texbox to be filled with N
                    e.preventDefault();
                    that.addNoteHandler();
                }
            };

        /* moved to tap event below */
        that.locate('bookContainer').mousedown(function (evt) {
            that.locate('bookContainer').fluid('activate');
        });

        // keyboard accessibility for reading region
        //that.locate('bookContainer').fluid('tabbable');
        // autofocus on book container
        //that.locate('bookContainer').focus(function () {
        //    $('html, body').animate({ scrollTop: $(this).offset().top }, 500);
        //});

        //  TOC Click Event	
        $('#toc').click(function (evt) {
            page = evt.srcElement.getAttribute('href');
            var p = page.split("#");
            page = p[0];

            if (gch === "OEBPS/" + page) {
                $("nav#menu").trigger("close.mm");
                setTimeout(function () {
                    that.navigator.navigateTo("OEBPS/" + page, "id", '#' + p[1]);
                }, 600);
            }
            return false;
        });

        /*
		$('#searchMenu').click(function (evt) {
            // save any pending changes in current chapter
            fluid.epubReader.utils.showNotification('Please Wait', 'info', 1000);
            $(this).attr('disabled', 'disabled');
            that.navigator.saveAll();
			
            $(this).removeAttr('disabled');
            fluid.epubReader.utils.showNotification('Download Available', 'info');
        });
        */

        $.event.special.swipe.scrollSupressionThreshold = 50; // More than this horizontal displacement, and we will suppress scrolling.
        $.event.special.swipe.horizontalDistanceThreshold = window.devicePixelRatio >= 2 ? 15 : 30; // Swipe horizontal displacement must be more than this.
        $.event.special.swipe.durationThreshold = 1000;  // More time than this, and it isn't a swipe.
        $.event.special.swipe.verticalDistanceThreshold = window.devicePixelRatio >= 2 ? 15 : 30; // Swipe vertical displacement must be less than this.

        //$('#BIRMContent').on('swipeleft', OnSwipeLeft);
        //$('#BIRMContent').on('swiperight', OnSwipeRight);
        $('.highlight').on('click', OnHighlightClick);

        //$('#BIRMContent').on("vmouseup", OnVMouseUp);

        //$('#BIRMContent').on('touchend', OnVMouseUp);
        //$('#BIRMContent').on('touchend', OnVMouseUp);

        $('#BIRMContent').on('tap', OnTapHold);
        //$('#BIRMContent').on("touchcancel", function(evt) {evt.preventDefault();});

        function OnTapHold(event) {

            try {
                //event.preventDefault();
                //event.stopPropagation();

                //var oTarget = $(event);
                //var oAnchor = oTarget.parent();
                //var sAnchor = oTarget.parent().get(0).tagName;

                sUserSelection = that.getSelection();
                window.localStorage.setItem('UserSelection', sUserSelection);
                //that.createMenu(event.target);
                //if (sUserSelection !== '') {
                //    $('#btnNavigateURL').hide();
                //    $('#btnEnlargeImage').hide();
                //    $('#btnHighlight').show();
                //    $('#btnRemoveHighlight').hide();
                //    $('#btnBookmark').hide();
                //    $('#btnNotes').hide();
                //    $('#DocMenu').popup('open');
                //}
            }
            catch (e) {
                alert(e);
            }
        }

        $('#btnNavigateURL').click(function (evt) {
            $('#DocMenu').popup('close');
            setTimeout(function () {
                if ($('#btnNavigateURL').attr('data-value').indexOf('http') > -1) {
                    window.open(encodeURI($.trim($('#btnNavigateURL').attr('data-value'))), '_system', 'location=yes');
                }
                else {
                    var arrURL = $.trim($('#btnNavigateURL').attr('data-value')).split('#');
                    var sNavURL = arrURL[0];
                    var sNavigateTo = arrURL[1];
                    if (sNavURL === page) {
                        that.navigator.navigateTo("OEBPS/" + page, "id", sNavigateTo);
                    } else {
                        showSpinner('Loading Document', 'Loading Chapter...', 'a');
                        var arrChapter = new Array();
                        arrChapter = sNavURL.split('.');
                        if (arrChapter.length === 2) {
                            arrChapter = arrChapter[0].split('-');
                            if (arrChapter.length === 3) {
                                var sChapterNumber = arrChapter[2];
                                window.localStorage.setItem('Chapter', 'ch' + sChapterNumber + '.epub');
                                var oLink = { page: sNavURL, anchor: '#' + sNavigateTo };
                                window.localStorage.setItem('FollowLinkEvent', JSON.stringify(oLink));
                                window.location = 'birm.html';
                            }
                        }
                    }
                }
            }, 300);
        });

        $('#btnEnlargeImage').click(function (evt) {
            setTimeout(function () {
                $('#DocMenu').popup('close');
                setTimeout(function () {
                    $('#popupPhotoLandscape').popup('open');
                }, 400);
            }, 300);
        });

        $('#btnBookmark').click(function (evt) {
            setTimeout(function () {
                $('#DocMenu').popup('close');
                setTimeout(function () {
                    that.addBookmarkHandler();
                }, 400);
            }, 300);
        });

        $('#btnNotes').click(function (evt) {
            setTimeout(function () {
                $('#DocMenu').popup('close');
                setTimeout(function () {
                    that.addNoteHandler();
                }, 400);
            }, 300);
        });

        // Highlight code - called when the user performs tap hold on a word.
        that.getSelection = function () {
            var sSelectedText = '';
            var range;

            try {
                if (window.getSelection) {
                    sSelectedText = window.getSelection();
                    alert('window.getSelection ' + sSelectedText );
                } else if (document.getSelection) {
                    alert('document.getSelection');
                    sSelectedText = document.getSelection();
                } else if (document.selection) {
                    alert('document.selection');
                    sSelectedText = document.selection.createRange().text;
                }

                if (sSelectedText !== '') {
                }
            }
            catch (e) {
                alert('highlight error ' + e);
            }

            return sSelectedText;
        }

        that.highlightUserSelection = function (selection) {
            alert('selection is ' + selection);
            $('p').highlight(selection.toString());
            $('.highlight').css({ backgroundColor: "#FFFF88" });
            that.navigator.saveAll();
        }

        that.unhighlightUserSelection = function (selection) {
            $('p').unhighlight(selection.toString());
            that.navigator.saveAll();
        }

        function OnVMouseUp(event) {
            alert('onmouseup');
            sUserSelection = that.getSelection();
            if ($.type(sUserSelection) !== 'undefined' && $.type(sUserSelection) !== 'null') {
                window.localStorage.setItem('UserSelection', sUserSelection);
            }
        }

        that.createMenu = function (target) {

            try {
                alert('create menu');

            var oTarget = $(target);
            var oAnchor = oTarget.parent();
            var sAnchor = oTarget.parent().get(0).tagName;
            var oImg = oTarget;
            var sImg = oTarget.get(0).tagName;

            var bShowMenu = false;
            $('#btnBookmark').hide();
            $('#btnNotes').hide();
            $('#btnNavigateURL').hide();
            $('#btnEnlargeImage').hide();
            $('#btnHighlight').hide();
            $('#btnRemoveHighlight').hide();

            if (sAnchor === 'A') {
                $('#btnNavigateURL').show();
                $('#btnNavigateURL').attr('data-value', oAnchor.attr('href'));
            }

            if (sImg === 'IMG') {
                if (oTarget.attr('id') !== 'NoteSelector' && oTarget.attr('id') !== 'BookmarkSelector') {
                    $('#btnEnlargeImage').show();
                    $('#popupPhotoLandscape').find('img').attr('src', oImg.attr('src'));
                }
            }

            if (!oTarget.hasClass('fl-epubReader-Note')) {
                $('#btnNotes').show();
            }

            if (!oTarget.hasClass('fl-epubReader-Bookmark')) {
                $('#btnBookmark').show();
            }

            if (oTarget.attr('id') === 'NoteSelector' || oTarget.attr('id') === 'BookmarkSelector') {
                if (!oTarget.parent().hasClass('fl-epubReader-Note')) {
                    $('#btnNotes').show();
                }

                if (!oTarget.parent().hasClass('fl-epubReader-Bookmark')) {
                    $('#btnBookmark').show();
                }
            }

            //sUserSelection = that.getSelection();
            //if ($.type(sUserSelection) !== 'undefined' && $.type(sUserSelection) !== 'null') {
            //    window.localStorage.setItem('UserSelection', sUserSelection);
                //}
            alert('create menu ' + window.localStorage.getItem('UserSelection').toString());
            if (window.localStorage.getItem('UserSelection') !== '') {
                $('#btnHighlight').show();
            }

            if (oTarget.hasClass('highlight')) {
                window.localStorage.setItem('UserSelection', oTarget.text());
                $('#btnRemoveHighlight').show();
            }

            if ($('#DocMenu li a').is(':visible')) {
                $('#DocMenu').popup('open');
            }

        }
                    catch (e) {
                        alert(e);
                    }

        }

        that.menuOptions = function (option) {
            if (option === "RH") {
                $('#btnBookmark').hide();
                $('#btnNotes').hide();
                $('#btnHighlight').hide();
                $('#btnRemoveHighlight').show();
            }
            else if (option === "H") {
                $('#btnBookmark').hide();
                $('#btnNotes').hide();
                $('#btnHighlight').show();
                $('#btnRemoveHighlight').hide();
            }
            else {
                $('#btnBookmark').show();
                $('#btnNotes').show();
                $('#btnHighlight').show();
                $('#btnRemoveHighlight').hide();
            }
        }

        function OnHighlightClick(event) {

            try {
                //alert('OnHighlightClick');
                sUserSelection = $(this).text();
                //alert(sUserSelection);

                //event.preventDefault();
                //event.stopPropagation();

                that.menuOptions('RH');
                //$("#context-menu-3").css({ top: posY + "px", left: posX + "px" }).show();
                $('#DocMenu').popup('open');
            }
            catch (err) {
                alert('Could not display menu to remove highlight. Error: ' + err);
            }

        }

        $('#btnHighlight').click(function (evt) {
            try {
                sUserSelection = window.localStorage.getItem('UserSelection');
                if (sUserSelection !== '') {
                    that.highlightUserSelection(sUserSelection);
                    window.localStorage.setItem('UserSelection', '');
                }
            }
            catch (err) {
                alert("Error highlighting the user's selection. Error: " + err);
            }
            finally {
                $('#DocMenu').popup('close');
            }
        });
        $('#btnRemoveHighlight').click(function (evt) {
            try {
                sUserSelection = window.localStorage.getItem('UserSelection');
                if (sUserSelection !== '') {
                    that.unhighlightUserSelection(sUserSelection);
                }
            }
            catch (err) {
                alert("Error highlighting the user's selection. Error: " + err);
            }
            finally {
                $('#DocMenu').popup('close');
            }
        });
        that.locate('addBookmarkButton').click(function (evt) {
            that.addBookmarkHandler();
        });
        // notes add button
        that.locate('addNoteButton').click(function (evt) {
            that.addNoteHandler();
        });
        // next button event for navigation
        /*
        that.locate('nextButton').click(function (evt) {
            that.navigator.next();
        });
		 $('#nextButton').click(function (evt) {
            that.navigator.next();
		 });
        */
        function OnSwipeLeft(event) {
            that.navigator.next();
        }
        // previous button event for navigation
        /*
        that.locate('previousButton').click(function (evt) {
            that.navigator.previous();
        });
		$('#previousButton').click(function (evt) {
            that.navigator.previous();
		});
        */
        function OnSwipeRight(event) {
            that.navigator.previous();
        }
        // next chapter button event for navigation
        that.locate('nextChapterButton').click(function (evt) {
            that.navigator.next_chapter();
        });
        /*
		 $('#nextChapterButton').click(function (evt) {
            //that.navigator.next_chapter();
        });

        //previous chapter button event for navigation
        that.locate('previousChapterButton').click(function (evt) {
            that.navigator.previous_chapter();
        });
        */
        /*
		$('#previousChapterButton').click(function (evt) {
            //that.navigator.previous_chapter();
        });
        */
        $('#searchForm').submit(function (evt) {
            evt.preventDefault();
            that.searchHandler();
        });
        $('#searchButton').click(function (evt) {
            evt.preventDefault();
            if ($('#searchField').val() === '') {
                var sAlert = 'Please enter a search term.';
                var sTitle = 'BIRM Search';
                if (device.platform.indexOf('Win') > -1) {
                    window.alert = navigator.notification.alert;
                    window.alert(sAlert,
                        function () { },
                        sTitle);
                }
                else {
                    navigator.notification.alert(sAlert,
                        function () { },
                        sTitle);
                }
            } else {
                that.searchHandler();
            }
        });
        //download book click handler
        that.locate('downloadButton').click(function (evt) {
            // save any pending changes in current chapter
            fluid.epubReader.utils.showNotification('Please Wait', 'info', 1000);
            $(this).attr('disabled', 'disabled');
            that.navigator.saveAll();
            that.events.onDownloadRequest.fire();
            $(this).removeAttr('disabled');
            fluid.epubReader.utils.showNotification('Download Available', 'info');
        });
        // shift + keys for navigation and edit
        //that.locate('bookContainer').bind('keydown', function (e) {
        //    var code = e.keyCode || e.which;
        //    if (code  === that.options.keyboardShortcut.nextNavigationKey  && e.shiftKey) {
        //        that.navigator.next();
        //    }
        //    if (code  === that.options.keyboardShortcut.previousNavigationKey  && e.shiftKey) {
        //        that.navigator.previous();
        //    }
        //    if (code  === that.options.keyboardShortcut.nextChapterNavigationKey  && e.shiftKey) {
        //        that.navigator.next_chapter();
        //    }
        //    if (code  === that.options.keyboardShortcut.previousChapterNavigationKey  && e.shiftKey) {
        //        that.navigator.previous_chapter();
        //    }
        //    if (code  === that.options.keyboardShortcut.editKey  && e.shiftKey) {
        //        that.editor.attachEditor();
        //    }
        //});

        // to activate individual elements
        that.locate('bookContainer').fluid('activatable', function (evt) {
            that.locate('bookContainer').fluid('selectable', {
                selectableSelector: that.options.selectors.chapterContent + ' :visible',
                onSelect: function (evt) {

                    that.locate('bookContainer').find(evt).bind('keydown', bookmarkKeyboardHandler);
                    that.locate('bookContainer').find(evt).bind('keydown', notesKeyboardHandler);
                    that.createMenu(evt);

                },
                onUnselect: function (evt) {
                    that.locate('bookContainer').find(evt).unbind('keydown', bookmarkKeyboardHandler);
                    that.locate('bookContainer').find(evt).unbind('keydown', notesKeyboardHandler);
                }
            });
        });

        that.searchHandler = function () {
            that.navigator.searchNext($('#searchField').val());
        };

        that.addNoteHandler = function () {
            var tempForm,
                currentSelectable,
                dialogOffset;
            try {
                currentSelectable = that.locate('bookContainer').fluid('selectable.currentSelection');
            } catch (e) {
                console.log('Caught an exception for invalid note addition');
            }
            if (!currentSelectable) {
                var sAlert = 'Please make a selection to create a note.';
                var sTitle = 'Validation Error';
                if (device.platform.indexOf('Win') > -1) {
                    window.alert = navigator.notification.alert;
                    window.alert(sAlert, function () { }, sTitle);
                }
                else {
                    navigator.notification.alert(sAlert, function () { }, sTitle);
                }
                return;
            }

            var noteAnchor = $(currentSelectable[0]);
            noteAnchor.addClass('fl-epubReader-Note');
            //var oImg = $('<img />');
            //oImg.attr('src', 'img/manual-icons/notes-manual-40-blue-ko.png');
            //oImg.attr('id', 'NoteSelector');
            //noteAnchor.prepend(oImg);

            $('#notesForm').popup('open', { positionTo: '.ui-header' });
            $('#btnCancelNote').on('click', function () {
                //$('#notesForm').popup('open', { positionTo: '.ui-header' });
                $('#notesForm').find('input').val('');
                $('#notesForm').find('textarea').val('');
                //noteAnchor.find(oImg).remove();
                noteAnchor.removeClass('fl-epubReader-Note');
                $('#btnSaveNote').off('click');
                $('#btnCancelNote').off('click');
            });

            $('#btnSaveNote').on('click', function () {
                var noteIdVal = $.trim($('#notesForm').find('input').val()),
                    noteTextVal = $.trim($('#notesForm').find('textarea').val());

                if (noteIdVal.length === 0 || noteTextVal.length === 0 ||
                    noteIdVal === 'Enter Note Title...' || noteTextVal === 'Enter Note Description...') {
                    var sAlert = 'Please ensure all data has been entered.';
                    var sTitle = 'Validation Error';
                    if (device.platform.indexOf('Win') > -1) {
                        window.alert = navigator.notification.alert;
                        window.alert(sAlert, function () { }, sTitle);
                    }
                    else {
                        navigator.notification.alert(sAlert, function () { }, sTitle);
                    }
                } else {


                    if (that.navigator.addNote(noteIdVal, noteTextVal, currentSelectable)) {
                        that.navigator.saveAll();

                        // Save the page with the embedded notes.
                        var sAlert = 'The note has been successfully saved.';
                        var sTitle = 'Save Note';
                        if (device.platform.indexOf('Win') > -1) {
                            window.alert = navigator.notification.alert;
                            window.alert(sAlert,
                                function () {
                                    $('#notesForm').find('input').val('');
                                    $('#notesForm').find('textarea').val('');
                                },
                                sTitle);
                        }
                        else {
                            navigator.notification.alert(sAlert,
                                function () {
                                    $('#notesForm').find('input').val('');
                                    $('#notesForm').find('textarea').val('');
                                },
                                sTitle);
                        }
                        $('#notesForm').popup('close');
                        $('#btnSaveNote').off('click');
                        $('#btnCancelNote').off('click');
                        $('#btnShowNotes').removeClass('ui-state-disabled');
                    } else {
                        var sAlert = 'A note already exists.';
                        var sTitle = 'Validation Error';
                        if (device.platform.indexOf('Win') > -1) {
                            window.alert = navigator.notification.alert;
                            window.alert(sAlert, function () { }, sTitle);
                        }
                        else {
                            navigator.notification.alert(sAlert, function () { }, sTitle);
                        }
                    }
                }
            });
        };

        that.addBookmarkHandler = function () {
            var tempForm,
                currentSelectable,
                dialogOffset;
            try {
                currentSelectable = that.locate('bookContainer').fluid('selectable.currentSelection');

            } catch (e) {
                console.log('Caught an exception for invalid bookmark addition');
            }
            if (!currentSelectable) {
                var sAlert = 'Please make a selection to create a bookmark.';
                if (device.platform.indexOf('Win') > -1) {
                    window.alert = navigator.notification.alert;
                    window.alert(sAlert, function () { }, 'Validation Error');
                }
                else {
                    navigator.notification.alert(sAlert, function () { }, 'Validation Error');
                }
                return;
            }

            $(currentSelectable[0]).addClass('fl-epubReader-Bookmark');
            $('#btnEditBookMark').hide();
            $('#btnSaveBookMark').show();
            $('#bookMarkForm').popup('open', { positionTo: 'window' });
            $('#btnCancelBookmark').on('click', function () {
                $(currentSelectable[0]).removeClass('fl-epubReader-Bookmark');
                $('#bookmarkTitle').val('');
            });
            $('#btnSaveBookMark').on('click', function () {
                var bookmarkTitle = $.trim($('#bookmarkTitle').val());

                if (bookmarkTitle.length === 0 || bookmarkTitle.length === 0 || bookmarkTitle === 'Enter Bookmark...') {
                    var sAlert = 'Please enter a bookmark identifier.';
                    var sTitle = 'Validation Error';
                    if (device.platform.indexOf('Win') > -1) {
                        window.alert = navigator.notification.alert;
                        window.alert(sAlert, function () { }, sTitle);
                    }
                    else {
                        navigator.notification.alert(sAlert, function () { }, sTitle);
                    }
                } else {
                    if (that.navigator.addBookmark(bookmarkTitle, currentSelectable)) {
                        that.navigator.saveAll();

                        var sAlert = 'The bookmark has been successfully saved.';
                        var sTitle = 'Save Bookmark';
                        if (device.platform.indexOf('Win') > -1) {
                            window.alert = navigator.notification.alert;
                            window.alert(sAlert,
                                function () {
                                    $('#bookmarkTitle').val('');
                                },
                                sTitle);
                        }
                        else {
                            navigator.notification.alert(sAlert,
                                function () {
                                    $('#bookmarkTitle').val('');
                                },
                                sTitle);
                        }
                        $('#bookMarkForm').popup('close');
                        $('#btnSaveBookMark').off('click');
                        $('#btnShowBookmarks').removeClass('ui-state-disabled');
                    } else {
                        var sAlert = 'This bookmark already exists.';
                        var sTitle = 'Validation Error';
                        if (device.platform.indexOf('Win') > -1) {
                            window.alert = navigator.notification.alert;
                            window.alert(sAlert, function () { }, sTitle);
                        }
                        else {
                            navigator.notification.alert(sAlert, function () { }, sTitle);
                        }
                    }
                }
            });
        };
    };
    /*=========================================================================================================*/
    fluid.defaults('fluid.epubReader', {
        gradeNames: ['fluid.rendererComponent', 'autoInit'],
        components: {
            filefacilitator: {
                type: 'fluid.epubReader.fileFacilitator',
                options: {
                    listeners: {
                        afterEpubReady: '{epubReader}.parseEpub'
                    }
                }
            },
            bookhandle: {
                type: 'fluid.epubReader.bookHandler',
                container: '{epubReader}.container'
            },
            uiController: {
                type: 'fluid.epubReader.uiController'
            }
        },
        selectors: {
            contentTitle: '.flc-epubReader-chapter-title',
            remaining: '.flc-epubReader-progressIndicator-completed',
            remainingWrapper: '.fl-epubReader-progressIndicator',
            chapterStyle: '.flc-epubReader-chapter-styles',
            chapterStyleElement: '.flc-epubReader-chapter-StyleElement',
            chapterContent: '.flc-epubReader-chapter-content',
            tocSelector: '.flc-epubReader-toc',
            tocContainer: '.fl-epubReader-tocContainer',
            bookmarkContainer: '.fl-epubReader-bookmarkContainer',
            bookmarkRow: '.flc-epubReader-bookmark-tableRow',
            bookmarkTitle: '.flc-epubReader-bookmark-title',
            bookmarkChapter: '.flc-epubReader-bookmark-chapter',
            bookmarkEdit: '.flc-epubReader-bookmark-edit',
            bookmarkDelete: '.flc-epubReader-bookmark-delete',
            bookmarkGoTO: '.flc-epubReader-bookmark-goTo',
            addBookmarkButton: '.flc-epubReader-addBookmark',
            notesContainer: '.fl-epubReader-notesContainer',
            noteRow: '.flc-epubReader-note-tableRow',
            noteId: '.flc-epubReader-note-id',
            noteChapter: '.flc-epubReader-note-chapter',
            noteEdit: '.flc-epubReader-note-edit',
            noteDelete: '.flc-epubReader-note-delete',
            addNoteButton: '.flc-epubReader-addNote',
            bookContainer: '.fl-epubReader-bookContainer',
            uiOptionsContainer: '.flc-epubReader-uiOptions-container',
            uiOptionsButton: '.fl-epubReader-uiOptions-button',
            navigationContainer: '.fl-epubReader-navigationContaniner',
            navigationButton: '.fl-epubReader-navigation-button',
            epubControls: '.flc-uiOptions-epub-controls',
            slidingTabsSelector: '.fl-epubReader-tabsPanel',
            nextButton: '.flc-epubReader-nextButton',
            previousButton: '.flc-epubReader-previousButton',
            nextChapterButton: '.flc-epubReader-nextChapterButton',
            previousChapterButton: '.flc-epubReader-previousChapterButton',
            editorSaveButton: '.flc-inlineEdit-saveButton',
            editorCancelButton: '.flc-inlineEdit-cancelButton',
            editActivationButton: '.flc-epubReader-editor-activateButton',
            downloadButton: '.flc-epubReader-downloadButton',
            searchForm: '.fl-epubReader-search-form',
            searchField: '.flc-epubReader-search-field',
            searchButton: '.flc-epubReader-search-button',
            searchResult: '.flc-epubReader-highlighted',
            currentSearchResult: '.flc-epubReader-highlighted-current'
        },
        uiOptionsTemplatePath: 'ePubReader/uiOptions/',
        events: {
            onReaderReady: null
        },
        keyboardShortcut: {
            bookmarkKey: 66,
            noteKey: 78,
            nextNavigationKey: 40,
            previousNavigationKey: 38,
            nextChapterNavigationKey: 39,
            previousChapterNavigationKey: 37,
            editKey: 69
        },
        strings: {
            uiOptionShowText: '+ Personalize',
            uiOptionHideText: '- Personalize',
            navigationShowText: '+ Manage',
            navigationHideText: '- Manage'
        },
        book: {
            isBase64: false
        },
        constraints: {
            maxImageHeight: 200,
            maxImageWidth: 200
        },
        preInitFunction: 'fluid.epubReader.preInitFunction',
        finalInitFunction: 'fluid.epubReader.finalInit'
    });

    fluid.epubReader.preInitFunction = function (that) {

        that.parseEpub = function () {

            var opf_file = that.bookhandle.parser.getContainerFile(that.filefacilitator.getDataFromEpub('META-INF/container.xml')),
            ncx_file = that.bookhandle.parser.opf(that.filefacilitator.getDataFromEpub(opf_file));
            that.bookhandle.navigator.toc.setModel(that.bookhandle.parser.getTOC(that.filefacilitator.getDataFromEpub(ncx_file)));
            that.filefacilitator.getDataFromEpubFileOnDevice('bookmark.json', function (bookmark_data) {
                console.log('in bookmark function');
                if (bookmark_data !== null) {
                    console.log('we have data');
                    $('#btnShowBookmarks').addClass('ui-state-disabled');
                    var bookmarkList = JSON.parse(bookmark_data);
                    if (bookmarkList.length > 0) {
                        $('#btnShowBookmarks').removeClass('ui-state-disabled');
                        that.bookhandle.navigator.bookmarks.setModel(bookmark_data);
                    }
                }
                that.filefacilitator.getDataFromEpubFileOnDevice('notes.json', function (note_data) {
                    console.log('in notes function');
                    $('#btnShowNotes').addClass('ui-state-disabled');
                    if ($.type(note_data) !== 'null') {
                        console.log('we have data');
                        that.bookhandle.navigator.notes.setModel(note_data);
                        //parse the note_data
                        //loop through and add them all
                        var noteList = JSON.parse(note_data);

                        if (noteList.length > 0) {
                            $('#btnShowNotes').removeClass('ui-state-disabled');
                        }
                        
                        for (var ii = 0; ii < noteList.length; ii++) {
                            var noteID = noteList[ii].noteId;
                            var noteText = noteList[ii].notedText;
                            var notedItemHTML = noteList[ii].notedItemHTML;

                            // check for corrupted json before searching for the note element
                            //alert(noteID.length + ' ' + noteText.length + ' ' + notedItemHTML.length);
                            if (noteID.length > 0 && noteText.length > 0 && notedItemHTML.length > 0) {
                                var textToLookFor = $(notedItemHTML).text();
                                var notedElement = $("p:contains('" + textToLookFor + "')");

                                that.bookhandle.navigator.addNote(noteID, noteText, notedElement);
                            }
                        };
                    }
                    //console.log('before onReaderReady.fire');
                    //that.events.onReaderReady.fire();
                });
            });
            //}
        };

        that.loadContent = function (page) {

            var p = page.split("#");
            page = p[0];
            gch = p[0]

            that.filefacilitator.getDataFromEpubFileOnDevice(page, function (epub_data) {
                that.bookhandle.navigator.loadChapter(that.filefacilitator.preProcessChapter(that.filefacilitator.getDataFromEpub(page), that.filefacilitator.getFolder(page)));
            });
        };
    };

    fluid.epubReader.finalInit = function (that) {
        // Parsing ebook onload
        // This is the trigger to get everything started in epubReader
        //if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        //    that.filefacilitator.getEpubFile(that.options.book.epubPath);
        //}
        //else {
        that.filefacilitator.getDeviceEpubFile(that.options.book.epubPath);
        //}

    };

})(jQuery, fluid_1_4);