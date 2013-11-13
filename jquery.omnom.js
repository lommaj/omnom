//scode helper jquery plugin
//written by John Lomma
//5/7/2012
/*

full page method - for html5 header/footer links can be done seperately using a selector during binding for <header> and <footer>, non html5 will have to do that in the settings passed.

ajax method - needs to be able to identify if its inside a top nav or footer (find parent <footer>)

if class= customLinkText = get linktext from name.

*/
jQuery.omnom || (function ($) {
    //set default options
    var defaults = {
        //if querystring is passed, that will be used for analytics.  This is used for dynamic pages like products.aspx?p=d3100
        pageName: "",
        querystring: null,
        sectionTemplate: null
    }

    //------------------------------------------------------------------
    //support functions
    //------------------------------------------------------------------
    function GetLocalVars() {
        var locVar = "";
        var url = location.pathname;
        var trackUrl = new Array();
        trackUrl = url.split("/");
        var truncSec = new Array();
        for (i = 1; i < trackUrl.length; i++) {
            truncSec[i] = trackUrl[i].substr(0, 5)
            if (truncSec[i].indexOf('.') != -1) {
                truncSec[i] = truncSec[i].substring(0, truncSec[i].indexOf('.'))
            }
        }
        locVar = truncSec.join('+').replace(/\+/, "");
        return locVar;
    }
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    function defineExitLinks() {
        //this adds a class 'external' and causes the external link to open in a new tab/window
        $("a[href*='http://']:not([href*='" + location.hostname + "']),[href*='https://']:not([href*='" + location.hostname + "'])")
        .addClass("external")
        .attr("target", "_blank");

    }
    //------------------------------------------------------------------
    //support functions
    //------------------------------------------------------------------

    $.omnom = function (options) {
        var options = $.extend(defaults, options);
        //fire page name
        s.pageName = options.pageName;
        s.t();
        defineExitLinks();
        $('a').live('click', function (e) {
            if (doAnaltics($(this), options)) {
                return true;
            } else {
                e.preventDefault();
                return false;
            }
        }); //end $('a').live();
    } //end $.analytics()
    $.customLinkType = function (object, linkType, linkText, options) {
        //should add options for type: custom, external, etc all that can be called from script.  options should be optional.
        doAnalticsCustom(object, linkType, linkText, options);

    }
    function doAnalticsCustom(object, linkType, linkText, options) {
        var _analyticString = "";
        var localVars = GetLocalVars();
        //setup variables for each link
        var $this = object;

        //NEED TO REFACTOR FROM HERE

        var linkText = linkText;
        //remove white space
        linkText = $.trim(linkText);

        //if [name] attribute is empty, use title
        if (linkText.length == 0) {
            linkText = 'invalid string';
        }
        linkText = (linkText != null ?
                    linkText.replace(/ /g, '+').replace(/&/g, 'and').replace(/[^a-zA-Z 0-9:\.\/_-]/g, '_').replace(/__/g, '').toLowerCase() :
                        "noLinkText");

        // only first 100 chars
        linkText = linkText.substr(0, 100)

        if (options != null && options != 'undefined') {

            if (options.querystring != null) {
                var queryStringValue = getUrlVars()[options.querystring];
                //check to see querystring is defined and filled
                if (typeof queryStringValue === "undefined" || queryStringValue.length == 0) { } else { localVars = localVars + "+" + queryStringValue.substr(0, 5); }
            }
        }
        //finalize analytic string
        //_analyticString = (options.pageName.length > 0) ? options.pageName + '+' : '';
        _analyticString = localVars + '||' + linkText;
        //console.log(_analyticString);
        //detect link type
        //var thisLink = $this.attr('href');


        //RE: REFACTOR TO HERE make a getlinktext function. kthanks


        //check custom link
        //NEED TO CHECK IF THIS STARTS WITH # SO #Jumps WORK!
        if (linkType == "custom") {
            setTimeout(function () {
                s.tl($this, 'o', _analyticString);
            }, 0);
            return false;
        }
        else if (linkType == "external") {
            s.tl($this, 'e', _analyticString);
            return true;
        }
        //check exit link
        else if (linkType == 'media') {
            s.tl($this, 'o', _analyticString);
            //var l = $(this).attr('href'); ??  need to do forwarding option
            //setTimeout(window.location = l, 200);
            //console.log("external");
            return false;
        }       
    }
    function doAnaltics(_this, options) {
        var $this = _this;

        //string that will be submitted to omniture.            
        var _analyticString = "";
        var localVars = GetLocalVars();
        //setup variables for each link
        var linkCode = $this.attr('name');
        var linkText = $this.text();
        //remove white space
        linkText = $.trim(linkText);
        //if [name] attribute is empty, use title
        if (linkText.length == 0) {
            linkText = $this.children('[alt]').attr('alt') + "+image";
        }
        linkText = (linkText != null ?
                    linkText.replace(/ /g, '+').replace(/&/g, 'and').replace(/[^a-zA-Z 0-9:\.\/_-]/g, '_').replace(/__/g, '').toLowerCase() :
                        "noLinkText");

        if (linkCode) {
            linkCode = linkCode.replace(/ /g, '_').replace(/&/g, 'and').replace(/[^a-zA-Z 0-9:\.\/+_-]/g, '_').replace(/__/g, '').toLowerCase();
            linkText = linkText + '+' + linkCode;
        }
        // only first 100 chars
        linkText = linkText.substr(0, 100)

        if (options.querystring != null) {
            var queryStringValue = getUrlVars()[options.querystring];
            //check to see querystring is defined and filled
            if (typeof queryStringValue === "undefined" || queryStringValue.length == 0) { } else { localVars = localVars + "+" + queryStringValue.substr(0, 5); }
        }

        //add section templating options            
        if (options.sectionTemplate != null) {
            for (i = 0; i < options.sectionTemplate.length; i++) {
                if ($this.closest(options.sectionTemplate[i].selector).length) {
                    linkText = linkText + "+" + options.sectionTemplate[i].reportingValue;
                }
            }
        }

        //finalize analytic string
        //_analyticString = (options.pageName.length > 0) ? options.pageName + '+' : '';
        _analyticString = localVars + '||' + linkText;
        //console.log(_analyticString);
        //detect link type
        var thisLink = $this.attr('href');

        //check custom link
        //NEED TO CHECK IF THIS STARTS WITH # SO #Jumps WORK!
        if (thisLink == "#" || $this.hasClass('telephone')) {
            setTimeout(function () {
                s.tl($this, 'o', _analyticString);
            }, 0);
            //console.log("custom");           
            return false;
        }
        else if ($this.hasClass('external')) {
            s.tl($this, 'e', _analyticString);
            return true;
        }
        //check exit link
        else if ($this.hasClass('media')) {
            s.tl($this, 'o', _analyticString);
            var l = $this.attr('href');
            setTimeout(function () { window.location = l }, 500);
            //console.log("external");
            return false;
        }
        //check sprop link exists
        else {
            var newHref = ($this.attr('href').indexOf("?") >= 0) ? $this.attr('href') + "&lid=" + _analyticString : $this.attr('href') + "?lid=" + _analyticString;
            //console.log("lid");
            window.location = newHref;
            return false;
        }
    }
    
})(jQuery);
