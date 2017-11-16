//Links
//http://stackoverflow.com/questions/7130397/how-do-i-make-a-div-full-screen
//http://stackoverflow.com/questions/33768509/how-to-make-an-iframe-to-go-fullscreen-on-a-button-click
//http://sharepoint.stackexchange.com/questions/85442/app-part-iframe-width-to-100

var DefaultConfigFile = 'Baskarta.jsn';

function getQueryStringParameter(paramToRetrieve) {
    var params1 = document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params1.length; i = i + 1) {
        var singleParam = params1[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
};

var spinner = null;

function startSpin() {
    var target = document.getElementById('message');
    spinner = new Spinner().spin(target);
}

function stopSpin() {
    if(spinner != null)
        spinner.stop();
}

// Set the style of the client web part page to be consistent with the host web.
(function () {
    'use strict';

    //console.log("SmilOnlinePart js running...");
    var hostUrl = '';
    if (document.URL.indexOf('?') != -1) {
        var params = document.URL.split('?')[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var p = decodeURIComponent(params[i]);
            if (/^SPHostUrl=/i.test(p)) {
                hostUrl = p.split('=')[1];
                document.write('<link rel="stylesheet" href="' + hostUrl + '/_layouts/15/defaultcss.ashx" />');
                break;
            }
        }
    }
    if (hostUrl == '') {
        document.write('<link rel="stylesheet" href="/_layouts/15/1033/styles/themable/corev15.css" />');
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        //console.log('DOMContentLoaded');
        //console.log("spinner...");

        startSpin();
        setupMap(stopSpin);
    });
})();

var fixConfigNavbars = function (serverConfig) {
    if (serverConfig.navbars == undefined) {
        serverConfig["navbars"] = { "north": { "visible": true }, "south": { "visible": true } }
    }

    if (serverConfig.header == undefined) {
        serverConfig["header"] = { "items": [{ "type": "logotype", "url": "https://cdn.geo24.io/swecomap/1.16.1/img/logotype.png" }, { "type": "custom" }, { "type": "custom", "icon": "window-maximize", "url": "javascript:alert('happy')" }] }
    }
    else {

        if (serverConfig.header.items == undefined) {
            serverConfig["header"] = { "items": [{ "type": "logotype", "url": "https://cdn.geo24.io/swecomap/1.16.1/img/logotype.png" }, { "type": "custom" }] }
        }
        else {
            var logo = serverConfig.header.items;
            var typelogo = true;
            for (var i = 0; i < logo.length; i++) {
                if (logo[i].type = "logotype") {
                    typelogo = false;
                    serverConfig.header.items.splice(i, 1, { "type": "logotype", "url": "https://cdn.geo24.io/swecomap/1.16.1/img/logotype.png" }, { "type": "custom" });
                    break;
                }
            }
            if (typelogo) {
                serverConfig.header.items.push({ "type": "logotype", "url": "https://cdn.geo24.io/swecomap/1.16.1/img/logotype.png" }, { "type": "custom" });
            }
        }
    }
}

function fullscreen(elem) {
    //console.log('fullscreen()');

    var imgspan = elem.firstChild;
    //console.log('imgspan=' + imgspan.id + '/' + imgspan.className);
    //console.log('#$(#' + imgspan.id + ') => #' + $('#' + imgspan.id).length);
    //console.log('#$(.glyphicon-fullscreen) => #' + $('.glyphicon-fullscreen').length);
    //console.log('#$(.glyphicon-resize-small) => #' + $('.glyphicon-resize-small').length);
    var senderId = getQueryStringParameter('SenderId');
    //console.log('senderId=' + senderId);
    if (imgspan.className == 'glyphicon glyphicon-fullscreen') {
        //imgspan.className == 'glyphicon glyphicon-resize-small';
        //document.getElementById(imgspan.id).className = "glyphicon glyphicon-resize-small";
        $('#' + imgspan.id).attr('class', 'glyphicon glyphicon-resize-small');
        //console.log('After setting resize-small: ' + document.getElementById(imgspan.id).className);
        //console.log('posting message: fullscreen ' + senderId);
        parent.postMessage('fullscreen ' + senderId, '*');
    } else {
        //imgspan.className == 'glyphicon glyphicon-fullscreen';
        //document.getElementById(imgspan.id).className = "glyphicon glyphicon-fullscreen";
        $('#' + imgspan.id).attr('class', 'glyphicon glyphicon-fullscreen');
        //console.log('After setting fullscreen: ' + document.getElementById(imgspan.id).className);
        //console.log('posting message: normscreen ' + senderId);
        parent.postMessage('normscreen ' + senderId, '*');
    }
    //class="glyphicon glyphicon-fullscreen"
    //glyphicon-resize-small / glyphicon-fullscreen


}

//function setupListen() {
//    //console.log('setupListen');
//    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
//    var eventer = window[eventMethod];
//    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

//    // Listen to message from child window
//    eventer(messageEvent, function (e) {
//        //console.log('received message from ' + e.originalEvent.origin);
//        var origin = event.origin;
//        var key = e.message ? "message" : "data";
//        var data = e[key];
//        //console.log('data='+data);
//        if(data == 'setup'){
//            origin.postMessage('Right back at ya!');
//        }
//    }, false);

//}

function setupButtons() {
    //console.log('setupButtons()');
    var imaximize = '<i class="icon-window-maximize"></i>';
    var irestore = '<i class="icon-window-restore"></i>';

    //var ifm1 = document.getElementById('frameMap');
    ////console.log('ifm1=' + ifm1);
    //var innerDoc = ifm1.contentDocument || ifm1.contentWindow.document;
    var elementright = $('.navbar-form.navbar-right');

    //console.log('setup config files..');

    var promise = getAllConfigFiles();
    promise.done(function (allFilesInfo) {
        //console.log('setup config files promise returned with #' + allFilesInfo.length);
        var jsnfiles = 0;
        for (var i = 0; i < allFilesInfo.length; i++) {
            var temp = allFilesInfo[i].Name;

            if (temp.split('.').pop() == 'jsn' && temp.toLowerCase() != 'configitem.jsn') {
                var config_name = allFilesInfo[i].Name.replace(/\..+$/, '');//finds filename
                allfiles[jsnfiles] = config_name;
                allfilesurl[jsnfiles] = allFilesInfo[i].ServerRelativeUrl;
                ////console.log(jsnfiles + ':' + allfiles[jsnfiles] + '->' + allfilesurl[jsnfiles]);
                jsnfiles++;
            }
        }
        var selectionsHtml = setConfigSelectionsHtml();

        var html = '<div class="btn-group">' +
            selectionsHtml +
            '<button type="button" id="resizemap" Title="Öppna karta i större vy" class="btn btn-default btn-sm smilonline-btn" onclick="fullscreen(this)"><span id="fullscreenimg" class="glyphicon glyphicon-fullscreen"></span></button>' +
            '</div>';

        var buttons = $(html);
        //$(elementright).append(buttons);

        $(elementright).html(buttons);

    }).fail(function (err) {
        console.error(err);
        alert('setup config files operations failed: ' + JSON.stringify(err));
    });
}

var selectedfile = 'Select Map';
var selectedfileurl = null;
var allfiles = [];
var allfilesurl = [];

function setConfigSelectionsHtml() {
    //console.log('setConfigSelectionsHtml');
    var selectMapElement = '<select id="selectMap" class="btn btn-default btn-sm" style="Margin-right:5px;" onchange="handleConfigSelectChange(this);">Select Map';// $(innerDoc).find('#selectMap');
    if (selectedfile != null) {
        selectMapElement += '<option value="'+selectedfileurl+'">'+selectedfile+'</option>';
    }
    for (var i = 0; i < allfiles.length; i = i + 1) {
        if (allfiles[i] != selectedfile) {
            selectMapElement += '<option value="' + allfilesurl[i] + '">' + allfiles[i] + '</option>';
        }
    }

    selectMapElement += '</select>';
    //console.log('=> ' + selectMapElement);
    return selectMapElement;
}

//TODO!
function handleConfigSelectChange(e) {
    //console.log('webpart.handleConfigSelectChange()');
    if (e.selectedOptions == null || e.selectedOptions.length < 1)
        return;
    var value = e.selectedOptions[0].value;
    var text = e.selectedOptions[0].text;
    //console.log('value='+value+', text='+text);
    //Changes the order in the drop-down list - shows the current at the top
    //Saves the selected config for next reload of dropdown
    selectedfile = value.substring(value.lastIndexOf('/') + 1).replace(/\..+$/, '');
    selectedfileurl = value;
    saveConfigFileNameurl = selectedfileurl;
    saveConfigFileName = saveConfigFileNameurl.substring(saveConfigFileNameurl.lastIndexOf('/') + 1);

    startSpin();

    var $oldIframe = $("#frameMap");
    //console.log('oldIframe=#' + $oldIframe.length);
    setupMap(stopSpin);

    ////Removes old ifram and makes a new
    ////console.log('Removes old ifram and makes a new...');
    //var $iframe = $('<iframe></iframe>')
    //var $oldIframe = $("#frameMap");
    ////console.log('oldIframe=' + ($oldIframe ? $oldIframe : 'null'));
    ////console.log('insert new iframe...');
    //$iframe.insertAfter($oldIframe);
    ////console.log('remove old iframe...');
    //$oldIframe.remove();
    //$iframe.attr('id', 'frameMap');

    ////console.log('loading SmilOnlinePart.aspx..');
    //$iframe.attr('src', 'SmilOnlinePart.aspx');
    //$iframe.on('load', function () {
    //    //console.log('SmilOnlinePart.aspx loaded');
    //    swecomap = $('#frameMap')[0].contentWindow.swecomap;
    //    setupMap(stopSpin);
    //});
}




function getAllConfigFiles() {
    //console.log('webpart.getAllConfigFiles()');
    var appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
    var hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    var deferred = $.Deferred();
    var executor = new SP.RequestExecutor(appweburl);

    //Will unfortunately not return the file-url

    var url = appweburl +
        "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('assets')/items?@target='" + hostweburl + "'";

    ////console.log('Calling ' + url);
    executor.executeAsync({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var bindings = [];

            var obj = JSON.parse(data.body);
            var files = obj.d.results;
            for (var i in files) {
                var f = files[i];
                //   //console.log('created ' + f.Created);
                var fResult = fileInfo(appweburl, hostweburl, f);
                bindings.push(fResult);
            }

            $.when.apply($, bindings).done(function () {
                ////console.log('fileInfo => #' + arguments.length);
                var allFileInfo = [];
                var allFileInfourl = [];
                for (var i = 0; i < arguments.length; i++) {
                    var val = arguments[i];
                    allFileInfo.push(val);
                }

                deferred.resolve(allFileInfo);
                deferred.resolve(allFileInfourl);
            }).fail(function (e) {
                console.error(e);
                deferred.reject('Getting File Info failed! ' + JSON.stringify(e));
            });
        },
        error: function (err) {
            console.error(err);
            deferred.reject('Fail: ' + JSON.stringify(err));
        }
    });

    return deferred;
}

// Gets info for a specific file - will include Url
function fileInfo(appweburl, hostweburl, f) {
    //console.log('fileInfo('+f.ID+')');
    var deferred = $.Deferred();

    var executor = new SP.RequestExecutor(appweburl);
    var itemid = f.ID;
    var url = appweburl +
        "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('assets')/Items(" + itemid + ")/File?@target='" + hostweburl + "'";
    executor.executeAsync({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var obj = JSON.parse(data.body);
            var fileInfo = obj.d;
            //console.log('fileInfo => ' + JSON.stringify(obj.d));
            deferred.resolve(fileInfo);
        },
        error: function (err) {
            deferred.reject('Fail: ' + JSON.stringify(err));
        }
    });

    return deferred;
}



function setupMap(stopSpin) {
    //console.log("Part.setupMap()");
    var appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
    var hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    //console.log("appweburl=" + appweburl + ", hostweburl=" + hostweburl);

    var mapConfig = {};

    var scriptbase = hostweburl + "/_layouts/15/";
    //console.log("loading SP.RequestExecutor.js ..");
    $.getScript(scriptbase + 'SP.RequestExecutor.js', function () {

        var executor = new SP.RequestExecutor(appweburl);

        var serverRelativeUrl = hostweburl.substring(hostweburl.indexOf('/sites'));
        var defaultConfig = serverRelativeUrl + "/assets/" + DefaultConfigFile;

        var filePath = selectedfileurl == null ? defaultConfig : selectedfileurl;
        //console.log("defaultConfig="+defaultConfig+", selectedfileurl="+selectedfileurl+" => filePath="+filePath);
        var url = appweburl + "/_api/SP.AppContextSite(@target)/web/getfilebyserverrelativeurl('"+filePath+"')/$value?@target='" + hostweburl + "'";
        //console.log("loading config " + url + " ..");

        executor.executeAsync({
            url: url,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                var serverConfig = JSON.parse(data.body);
                fixConfigNavbars(serverConfig);
                $.extend(mapConfig, serverConfig);
                //console.log('mapConfig='+JSON.stringify(mapConfig));
                //mapConfig.print = false;
                //mapConfig.toolbar.drawtools = true;
                //console.log('Part - new swecomap.Client ...');
                stopSpin();
                //addMap(serverConfig);
                document.body.innerHTML = "";
                swecomap.client = new swecomap.Client({ config: mapConfig, jwt:'GHI' });
                setupButtons();
            },
            error: function () {
                //console.log('new swecomap failed: ' + arguments[0]);
            }
        });
    });
}


