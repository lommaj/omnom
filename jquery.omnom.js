//scode helper jquery plugin
//written by John Lomma
//5/7/2012
/*
need to be able to specify order of parts used for tag generation and add your own selectors for templating your tags and their lengths
*/
(function ($) {
    //set default options
    var defaults = {
        //if querystring is passed, that will be used for analytics.  This is used for dynamic pages like products.aspx?p=d3100
        querystring: null,
        sectionTemplate: null
    };

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
    };
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    };
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

        var localVars = GetLocalVars();
        defineExitLinks();
        $('a').live('click', function () {
            var $this = $(this);
            //string that will be submitted to omniture.            
            var _analyticString = "";

            //setup variables for each link
            var linkCode = $this.attr('name');
            var linkText = $this.text();
            //remove white space
            linkText = $.trim(linkText);
            //if [name] attribute is empty, use title
            if (linkText.length == 0) {
                linkText = $this.children('[title]').attr('title') + "+image";
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
            _analyticString = localVars + '--' + linkText;

            //detect link type
            var thisLink = $this.attr('href');

            //check custom link
            if (thisLink == "#") {
                //console.log(_analyticString);
                s.tl(this,'o',_analyticString);
            }
            //check exit link
            else if ($this.hasClass('external')) {
                //console.log(_analyticString);
                s.tl(this,'e',_analyticString);
            }
            //check sprop link exists
            else {
               
                var newHref = ($this.attr('href').indexOf("?") >= 0) ? $this.attr('href') + "&lid=" + _analyticString : $this.attr('href') + "?lid=" + _analyticString;
                
                window.location = newHref;
            }
            return false;
        }); //end $('a').live();
    }; //end $.analytics() 




    /* for ajax data i.e: $('#somesection').analytics() or any other chainable/selector scenario 
    $.fn.analytics = function (options) {
    var options = $.extend(defaults, options);

    return this.each(function () {
    //be safe
    var $this = $(this);


    });
    }; //end $.fn.analytics()
    
    */
})(jQuery);