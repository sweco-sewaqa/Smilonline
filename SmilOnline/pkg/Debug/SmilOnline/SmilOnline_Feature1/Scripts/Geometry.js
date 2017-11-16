

var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    }
    return function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };
})();

var SMILOnline = function () {
    

    var basePath = 'https://cdn.geo24.io/smcube/1.3.0';

    var registerEditFormCallBack = function (formContext) {
        var element = document.getElementById(formContext.fieldSchema.Id + '_' + formContext.fieldName);
        var val = element.value;
        return val;
    };

    var loadScript = function (url, _id, callback) {
        var id = _id;
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback(id);
                }
            };
        } else {
            script.onload = function () {
                callback(id);
            };
        }
        script.src = url;
        document.body.appendChild(script);
    };


    var loadJQuery =function (_id, callback, _ctx) {
        var id = _id;
        var ctx = _ctx;
        document.onreadystatechange = function () {
            var state = document.readyState;
            if (state == 'complete') {
                loadScript( basePath + '/lib/jquery/jquery.min.js', id, function _loadJQueryCallback(id) {
                    callback(id, ctx);
                });
            }
        };

    };

    var currentCtx;

    var _viewList = function (ctx) {
        var wkt = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
        if (!/^POLYGON|^POINT|^LINESTRING/i.test(wkt)){
            return "<span></span>";
        }
        var src =  basePath + '/img/';
        src += /^POLYGON/i.test(wkt) ? 'polygon.png' : /^POINT/i.test(wkt) ? 'marker.png' : /^LINESTRING/i.test(wkt) ?'polyline.png' : '';
        
        return "<span data-wkt = " + wkt + "><img style='margin-left: 12px' src=" + src + " /></span>";
    };

    var _dataId = '';
    var _setDataId = function (id) {
        _dataId = id;
    };

    var _getDataId = function () {
        return _dataId;
    };

    var _form = function (ctx) {
        var uid = guid();
        var formContext = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
        formContext.registerGetValueCallback(formContext.fieldName, registerEditFormCallBack.bind(null, formContext));

        var dataId = (formContext.fieldSchema.Id + '_' + formContext.fieldName);
        SMILOnline.setDataId(dataId);
        var geom = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
        SMILOnline.setCurrentGeometry(geom);
       
        loadJQuery(uid, _formMap, ctx);
       
        var elem = '';
        elem += '<input type="text" id="' + dataId + '" /><br />';
        elem += '<div style="height: 400px; width: 400px;" id="' + uid + '">';
        return elem;
    };

    var _formMap = function (_id, ctx) {
        var id = _id;
        var view = basePath + '/index.html?view=' + ctx.BaseViewID;
        $('<iframe style="width: 100%; height: 100%;" src="' + view + '" id="frameMap" />').appendTo('#' + id);
    };

    var _displayForm = function (ctx) {
        currentCtx = ctx;
        var elemID = this.guid();
        var geom = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
        if (geom === '') {
            return '<span></span>';
        }
        var guid = this.guid();
        loadJQuery(elemID, _displayFormMap, guid);
        var elem = geom;
        elem += '<div style="height: 400px; width: 400px;" id="' + elemID + '"></div>';
        return elem;
    };

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent, function (e) {
        if (e.data === 'berofeInitMap') {
            var map = $('#frameMap')[0].contentWindow;
            var url = _spPageContextInfo.webAbsoluteUrl + '/assets/configItem.jsn';
            $.ajax({ url:  url }).done(function (data) {
                map.postMessage(data, '*');
            });
        }
        if (e.data === 'loaded') {
            var geometry = SMILOnline.getCurrentGeometry();
            //if (geometry === '') return;
            
            var map = $('#frameMap')[0].contentWindow;
            map.postMessage(geometry, '*');
            return;
        }
        if (/^POINT|^POLYGON|LINESTRING/i.test(e.data)){
            var wkt = JSON.stringify(e.data).replace("\"", "").replace("\"", "");
            var elemId = SMILOnline.getDataId();
            document.getElementById(elemId).value = wkt;
        }
    }, false);

    var _currentGeometry = '';

    var _setCurrentGeometry = function (geom) {
        _currentGeometry = geom;
    };

    var _getCurrentGeometry = function () {
        return _currentGeometry;
    };

    var _displayFormMap = function (_id) {
        var id = _id;
        var view = basePath + '/index.html?view=' + currentCtx.BaseViewID;
        var selector = '#' + id;
        var geometry = $(selector).prev().html();
        SMILOnline.setCurrentGeometry(geometry);
        $(selector).prev().hide(600);
        $('<iframe style="width: 100%; height: 100%;" src="' + view + '" id="frameMap" />').appendTo('#' + id);
    };

    return {
        viewList: _viewList,
        displayForm: _displayForm,
        editForm: _form,
        newForm: _form,
        getCurrentGeometry: _getCurrentGeometry,
        setCurrentGeometry: _setCurrentGeometry,
        setDataId: _setDataId,
        getDataId: _getDataId
    };
}();

(function () {

    var geometryContext = {};
    geometryContext.Templates = {};
    geometryContext.Templates.Fields = {
        'Geometry': {
            'View':  SMILOnline.viewList,
            'DisplayForm': SMILOnline.displayForm,
            'EditForm': SMILOnline.editForm,
            'NewForm': SMILOnline.newForm
        }
    };

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(
        geometryContext
    );
})();
