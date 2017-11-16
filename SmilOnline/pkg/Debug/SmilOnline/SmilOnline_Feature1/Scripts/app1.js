//------------------------------------ Variables and help-functions ------------------------------------------

var DefaultConfigFile = 'Baskarta.jsn';
var web;
var hostweburl;
var appweburl;
var saveConfigFileNameUrl = "/sites/smilonline/Assets/savetest.jsn";
var saveConfigFileName = 'Baskarta.jsn';
var saveConfigFileName1 ;

function sharepointReady() {
    console.log('sharepointReady');
    hostweburl =
         decodeURIComponent(
             smilOnline.getQueryStringParameter('SPHostUrl')
     );
    appweburl =
        decodeURIComponent(
            smilOnline.getQueryStringParameter('SPAppWebUrl')
     );
    saveConfigFileName1 = decodeURIComponent(
            smilOnline.getQueryStringParameter('config')
     );
    if (saveConfigFileName1!== 'undefined' ) {
        saveConfigFileName = saveConfigFileName1;
        DefaultConfigFile = saveConfigFileName1;
        console.log(saveConfigFileName)
    
    }

}


// ------------------------------------- Setup config-dropdown -----------------------------------------

function setupConfigDropdown() {
    //console.log('app1.setupConfigDropdown()');
    var promise = getAllConfigFiles();
    promise.done(function (allFilesInfo) {
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
        setConfigSelections(allFilesInfo);
    }).fail(function (err) {
        console.error(err);
        alert('Operation failed: ' + JSON.stringify(err));
    });
}

function getAllConfigFiles() {
    //console.log('app1.getAllConfigFiles()');
    // //console.log('getAllConfigFiles');
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
                var fResult = fileInfo(f);
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
function fileInfo(f) {
   // //console.log('fileInfo()');
    var deferred = $.Deferred();

    var executor = new SP.RequestExecutor(appweburl);
    var itemid = f.ID;
    var url = appweburl +
        "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('assets')/Items(" + itemid + ")/File?@target='"+hostweburl+"'";
    executor.executeAsync({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var obj = JSON.parse(data.body);
            var fileInfo = obj.d;
            deferred.resolve(fileInfo);
        },
        error: function (err) {
            deferred.reject('Fail: ' + JSON.stringify(err));
        }
    });

    return deferred;
}

// ------------------------------------- Event-handler for config-dropdown -----------------------------------------
function handleConfigSelectChange(e) {
    //console.log('app1.handleConfigSelectChange()');
    var value = e.target.value;
    var text = e.target.text;
    //Changes the order in the drop-down list - shows the current at the top
    //Saves the selected config for next reload of dropdown
    selectedfile = value.substring(value.lastIndexOf('/') + 1).replace(/\..+$/, '');
    selectedfileurl = value;
    saveConfigFileNameurl = selectedfileurl;
    saveConfigFileName = saveConfigFileNameurl.substring(saveConfigFileNameurl.lastIndexOf('/') + 1);
    //Removes old ifram and makes a new
    var $iframe = $('<iframe></iframe>')
    var $oldIframe = $("#frameMap");
    $iframe.insertAfter($oldIframe);
    $oldIframe.remove();
    $iframe.attr('id', 'frameMap');
    
    $iframe.attr('src', 'Default.aspx');
    $iframe.on('load', function () {   
        swecomap = $('#frameMap')[0].contentWindow.swecomap;     
        setupMainMap(reloadedMap, value);       
    });
}

function reloadedMap() {

   // setConfigSelections();
}
function SaveConfig() {
    ////console.log('SaveConfig');
    SaveConf();
}

function SaveConf() {
    var config = swecomap.client.getConfig();
    var bytes2 = JSON.stringify(config, null, "\t");
    if (confirm("Vill du spara konfigurationen som " + saveConfigFileName)) {
        copyDataTo(bytes2, saveConfigFileNameUrl, false, saveConfigDone);
    }
    return false;
}

function saveConfigDone() {
    tempAlert(saveConfigFileName + ' sparas');
   
}

function tempAlert(msg) {
    var el = document.createElement("div");
    el.setAttribute("style", "position:absolute;top:" + 65 + "px;left:" + pos.left + "px;background-color:white; ");

    el.innerHTML = msg;
    setTimeout(function () {
        el.parentNode.removeChild(el);
    }, 3000);
    document.body.appendChild(el);
}
var pos;
function Sparatile() {

    var ifm1 = document.getElementById('frameMap');
    var innerDoc = ifm1.contentDocument || ifm1.contentWindow.document;
    var element1 = $(innerDoc).find('.btn.btn-default.btn-sm:first ');
    element1.attr('title', "\xC4ndringen sparas till " + saveConfigFileName);
    pos = element1.position();// för att visa "config.json sparas" bredvid spara knapp
}

function copyDataTo(binarydata, targetUrl, update, callback) {
    var digest = $("#__REQUESTDIGEST").val();
    var index = targetUrl.lastIndexOf('/');
    var body = "";
    for (var i = 0; i < 1000; i++) {
        var ch = i % 256;
        body = body + String.fromCharCode(binarydata);
    }
        var fileName = saveConfigFileName;
    var folderUrl = targetUrl.substring(0, index);
   // //console.log("fileName=" + fileName + ", folderUrl=" + folderUrl);
    var fileContentUrl = update ?
        (appweburl + "/_api/SP.AppContextSite(@target)/web/getfilebyserverrelativeurl('" + targetUrl + "')/$value?@target='" + hostweburl + "'") :
        (appweburl + "/_api/SP.AppContextSite(@target)/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/add(url='" + fileName + "',overwrite=true)?@target='" + hostweburl + "'");
 
    ////console.log("fileContentUrl=" + fileContentUrl);
   var postheaders = {
        "Accept": "application/json; odata=verbose",
      "X-RequestDigest": digest
    };
    if (update) {
        postheaders["X-HTTP-Method"] = "PUT";
    }
    var executor = new SP.RequestExecutor(appweburl);
    var info = {
        url: fileContentUrl,
        method: "POST",
        headers: postheaders,
        contentType: "application/json;odata=verbose",
        "content-length":binarydata.length,
        binaryStringRequestBody: true,
        data: JSON.stringify({ '__metadata': { 'type': 'SP.List' }, 'Title': 'New title' }),
        body: binarydata,
        success: function (data) {
            callback();
        },
        error: function (err) {
            alert('config could not be saved: ' + JSON.stringify(err));
            callback();
        }
    };
    executor.executeAsync(info);
   }


//------------------------------------------- Populate config-dropdown in Sweco Map ------------------------------
var allfiles = [];
var allfilesurl = [];
var selectedfile = null;
var selectedfileurl = null;

function setConfigSelections() {    
    var ifm1 = document.getElementById('frameMap');
    var innerDoc = ifm1.contentDocument || ifm1.contentWindow.document;
    var element1 = $(innerDoc).find('.navbar.navbar-default.navbar-north:first .btn-group:first');
    var $select = $('<select id="selectMap" class="btn btn-default btn-sm" style="Margin-right:5px; ">Select Map</select>');
    $select.bind('change', handleConfigSelectChange.bind(this));
    $Save = $('<button type="button" id="resizemap" Title= "Spara kartkonfigurationen" class="btn btn-default btn-sm" style="Margin:5px; height:20;"><span class="glyphicon glyphicon-floppy-disk"></span></button>');
    $Save.bind('mouseover', Sparatile.bind(this));// för att byta titel när man valja config filen
    $Save.bind('click', SaveConfig.bind(this));
    element1.replaceWith( $Save,$select);
    var ifm1 = document.getElementById('frameMap');
    var innerDoc = ifm1.contentDocument || ifm1.contentWindow.document;
    var element2 = $(innerDoc).find('#selectMap');
    var option = document.createElement("option");
    //set previously selected first
    if (selectedfile != null) {
        element2.append($('<option>', { value: selectedfileurl, text: selectedfile }));
          }
       for (var i = 0; i < allfiles.length; i = i + 1) {
        if (allfiles[i] != selectedfile) {
            element2.append($('<option>', { value: allfilesurl[i], text: allfiles[i] }));
        }
    }
}

//-------------------------------------- SMIL Online ----------------------------------------

$("#titleAreaRow").hide();
$("#DeltaWebPartAdderUpdatePanelContainer").hide();
var smilOnline = smilOnline || {};

var swecomap;

smilOnline.getQueryStringParameter = function (paramToRetrieve) {
    var params1 = document.URL.split("?")[1].split("&");
    var strParams = "";
    debugger;
    for (var i = 0; i < params1.length; i = i + 1) {
        var singleParam = params1[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
};

var initMainMap = function (callback) {
    selectedfile = 'Select Map';
    selectedfileurl = '';
    sharepointReady();
    var serverRelativeUrl = hostweburl.substring(hostweburl.indexOf('/sites'));
    var startConfig = serverRelativeUrl + "/assets/" + DefaultConfigFile;
    //console.log('initMainMap() - hostweburl='+hostweburl+', serverRelativeUrl=' + serverRelativeUrl + ', startConfig=' + startConfig)
    ////console.log('startConfig', startConfig);
    swecomap = $('#frameMap')[0].contentWindow.swecomap;
    setupMainMap(callback, startConfig);
}

function temptest() {
    var hostweburl = decodeURIComponent(smilOnline.getQueryStringParameter('SPHostUrl'));
    var appweburl = decodeURIComponent(smilOnline.getQueryStringParameter('SPAppWebUrl'));
    //console.log('hostweburl=' + hostweburl + ', appweburl=' + appweburl);


    var scriptbase = hostweburl + "/_layouts/15/";
    $.getScript(scriptbase + 'SP.RequestExecutor.js', function () {
        var executor = new SP.RequestExecutor(appweburl);

        var filePath = '/sites/smilonline/assets/Baskarta.jsn';
        executor.executeAsync(
        {
            url: appweburl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + filePath + "')/$value?@target='" + hostweburl + "'",
            type: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                //console.log('Callback from getting config json=' + data.body);
                var serverConfig = JSON.parse(data.body);
            },
            error: function (xhr) {
                alert(xhr.status + ": " + xhr.statusText)
            }
        });
    });

}

var fixConfigNavbars = function (serverConfig) {
    if (serverConfig.navbars == undefined) {
        serverConfig["navbars"] = { "north": { "visible": true }, "south": { "visible": true } }
    }

    if (serverConfig.header == undefined) {
        serverConfig["header"] = { "items": [{ "type": "logotype", "url": "https://cdn.geo24.io/swecomap/1.16.1/img/logotype.png" }, { "type": "custom" }] }
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

var setupMainMap = function (callback, configpath) {
    //temptest();
    //return;
    //console.log('app1.setupMainMap(' + configpath + ')');

    var hostWebUrl = decodeURIComponent(smilOnline.getQueryStringParameter("SPHostUrl"));

    var scriptbase = hostWebUrl + "/_layouts/15/";
    var mapConfig = {};
    //debugger;
    $.getScript(scriptbase + 'SP.RequestExecutor.js', function () {
        //console.log('appweburl=' + appweburl + ', hostweburl=' + hostweburl);
        var config = decodeURIComponent(smilOnline.getQueryStringParameter('config'));
        //var appweburl = decodeURIComponent(smilOnline.getQueryStringParameter("SPAppWebUrl"));
      //  var hostweburl = decodeURIComponent(smilOnline.getQueryStringParameter("SPHostUrl"));
        var executor = new SP.RequestExecutor(appweburl);
        var serverRelativeUrl = hostweburl.substring(hostweburl.indexOf('/sites'));
        var url = appweburl + "/_api/SP.AppContextSite(@target)/web/getfilebyserverrelativeurl('" + configpath + "')/$value?@target='" + hostweburl + "'";
        
        //console.log('getting config from '+url+' ..');
      
        executor.executeAsync({
            url: url,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                //console.log('Callback from getting config json='+data.body);
                var serverConfig = JSON.parse(data.body);
                fixConfigNavbars(serverConfig);

                $.extend(mapConfig, serverConfig);
                //console.log('mapConfig=' + JSON.stringify(mapConfig));
                //mapConfig.print = true;
                
                smilOnline.loadLayers(mapConfig, appweburl, hostweburl, executor, function (_config) {
                    //console.log('app1.setupMainMap - smilOnline.loadLayers callback');

                    setupConfigDropdown();

                    //console.log('create new swecomap.Client ...');
                    swecomap.client = new swecomap.Client({
                        config: _config,
                        jwt: 'ABC',
                        callback: function (client) {                         
                           
                            var onSelect = function (e) {
                                $('#selection').text("User selected a feature");
                                var feature = e.element;
                                feature.on('change', function (e) {
                                    $('#modification').text("User modified a feature");
                                });
                            };
                            client.select.getFeatures().on('add', onSelect);

                            var onDeselect = function (e) {
                                var feature = e.element;
                                var text = feature.getRevision() > 1 ? "modified " : " ";
                                $('#selection').text("User deselected a " + text + "feature");
                            };

                            client.select.getFeatures().on('remove', onDeselect);
                        }
                    });

                    callback();
                });
               
            },
            error: function (err) {
                console.error(JSON.stringify(err));
                alert('Failed to load config ' + configpath);
            }
        }
    );
    });

    //debugger;
    $(window).resize(function windowResize() {
        setDimensions();
    });
    //- mapframe dimensions   
    var setDimensions = function () {
        var mapHeight = $(document).height() - $('#titleAreaRow').height() - $('#s4-ribbonrow').height()- 70;//-140
        $('#frameMap').height(mapHeight);
        $('#frameMap').css('padding', 0);//10
        $('#frameMap').width('100%');
        $('#frameMap').css('border', 'solid ligthgray;');
        
    };
    setDimensions(); $('#select1').html('<option> congiguration1111111</option>', '<option> congiguration1111111</option>', '<option> congiguration1111111</option>', '<option> congiguration1111111</option>');
};
//debugger;
smilOnline.request = function (executor, url, callback) {
    //debugger;
    executor.executeAsync({
        url: url,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
        success: function (data) {
            callback(data);
        }
    });
};
//debugger;
smilOnline.loadLayers = function (config, appweburl, hostweburl, executor, callback) {
    //console.log('smilOnline.loadLayers');
    //debugger;
    // 1. Load lists havingex Geoemtry column
    var url = appweburl + "/_api/SP.AppContextSite(@target)/web/lists?$select=Title,BaseType&@target='" + hostweburl + "'";
    var layers = [];
    smilOnline.request(executor, url, function (data) {
        var json = JSON.parse(data.body);
        smilOnline.getLayers(config, appweburl, hostweburl, executor, json.d.results, layers, function (config, geoLists) {

            smilOnline.getFeatures(config, appweburl, hostweburl, executor, geoLists, function (config) {
                callback(config);
            });
        });
    });
};

smilOnline.getFeatures = function (config, appweburl, hostweburl, executor, layers, callback) {
    //console.log('smilOnline.getFeatures');
    //debugger;
    if (layers.length === 0) {
     
    callback(config);
        return;
    }
    var layerName = layers[0].layerTitle;
    var isDocumentLibrary = layers[0].isDocumentLibrary;
    var url = '';
    if (isDocumentLibrary) {
        url = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + layerName + "')/items?$expand=File&@target='" + hostweburl + "'";
    }
    else {
        url = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + layerName + "')/items?@target='" + hostweburl + "'";
    }
    if (layers.length > 0) {
        smilOnline.request(executor, url, function getFeature(resp) {
            var data = JSON.parse(resp.body);
            var configLayer = smilOnline.createConfigLayers(config, hostweburl, layerName, isDocumentLibrary, data.d);

            var geoJson = new ol.format.GeoJSON();
            if (configLayer) {
                config.layers.push(configLayer);
            }

            layers.splice(0, 1);
            if (layers.length > 0) {
                smilOnline.getFeatures(config, appweburl, hostweburl, executor, layers, callback);
            }
            else {
                callback(config);
            }
        });
    }
    else {
        callback();
    }
};

smilOnline.createConfigLayers = function (config, hostweburl, layerName, isDocumentLibrary, items) {
    //console.log('smilOnline.createConfigLayers');
    //debugger;
    var wktParser = new ol.format.WKT();
    var jsonWriter = new ol.format.GeoJSON();
    var source = new ol.source.Vector();

    var layer = {
        type: 'Vector',
        name: layerName,
        source: {
            type: 'GeoJSON'

        },
        metadata: {
            "identify": true
        }
    };

    var features = [];
    items.results.forEach(function (item) {
        var geometry = item.Geometry;
        if (geometry && /^POINT|^POLYGON|^LINESTRING/i.test(geometry)) { //check that it seems to be a valid geometry
            var geom = wktParser.readGeometry(geometry);
            var urlToItem = hostweburl + "/" + (!isDocumentLibrary ? "Lists/" : "") + layerName + (isDocumentLibrary ? "/Forms" : "") + "/DispForm.aspx?ID=" + item.ID;
            var feature = new ol.Feature({
                geometry: geom,
                name: item.Title || item.File.Name,
                url: '<a href="' + urlToItem + '" target="_blank">...</a>'
            });
            features.push(feature);
        }
    });
    layer.source = {
        type: 'Vector', object: jsonWriter.writeFeatures(features)

    };
    return layer;
};

smilOnline.getLayers = function (config, appweburl, hostweburl, executor, lists, layers, callback) {
    //console.log('smilOnline.getLayers');
    //debugger;
    var title = lists[0].Title;
    var url2 = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + title + "')?$Select=Title,BaseType,Fields/Title&$expand=Fields&@target='" + hostweburl + "'";
    smilOnline.request(executor, url2, function (data) {
        var json = JSON.parse(data.body);
        //filter data

        var hasGeometryField = json.d.Fields.results.filter(function (f) {
            return f.Title === "Geometry";
        });
        if (hasGeometryField.length > 0) {
            layers.push({ layerTitle: json.d.Title, isDocumentLibrary: json.d.BaseType === 1 });
        }
        lists.splice(0, 1);
        if (lists.length > 0) {
            smilOnline.getLayers(config, appweburl, hostweburl, executor, lists, layers, callback);
        } else {
            callback(config, layers);
        }
     
    
    });

   
    
};
function favcon() {

    
    var link = document.createElement('link');
  

    link.rel = 'shortcut icon';
   
    link.href = '../Images/favicon.ico?rev=23';
    link.type = 'type="image/x-icon';
    link.ID = 'favicon';

    document.getElementsByTagName('head')[0].appendChild(link);
};
//------------------------------------------------------------------------------
$(document).ready(function () {
    favcon();
    document.title = document.getElementById('ctl00_BackToParentLink').text;
   // sharepointReady();
});




