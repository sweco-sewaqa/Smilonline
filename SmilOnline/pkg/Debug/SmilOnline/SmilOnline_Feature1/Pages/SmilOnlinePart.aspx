<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title>SMIL Online</title>

    <link rel="stylesheet" href="https://cdn.geo24.io/swecomap/1.16.1/css/cube/style.css">
    <link rel="stylesheet" href="https://cdn.geo24.io/swecomap/1.16.1/lib/sweetalert/sweetalert.css">
    <link rel="logotype" href="https://cdn.geo24.io/swecomap/1.16.1/img/logotype.png">
    <link rel="marker" href="https://cdn.geo24.io/swecomap/1.16.1/img/marker.png">
   
    <style type="text/css">        
        .ol-control button {
	        min-width : 20px;
            margin-left:0px;
        }
        .ol-gps button {
	        min-width : 20px;
            margin-left:0px;
        }
        .navbar-north{
            top:0px;
        }

        .smilonline-btn
        {
            min-width:20px;
        }

        .btn-group > .smilonline-btn {
            margin-left: 0;
            margin-right: 0;
        }
        #fullscreenimg {
            margin-top: 2px;
            margin-bottom: 4px;
        }
        /* Fix/patch for issue 116 & 177 in Sweco Map*/
        .navbar-north .navbar-right{
            left:auto;
            bottom:auto;
            top:0px;
            right:10px;
        }
        .btn-group{
            margin-left:5px;
        }
        /* Fix for Map layers overlay on top-buttons */
        .navbarNorth.navbarSouth .right{
               margin-top:45px;
        }
    </style>

    <script src="https://cdn.geo24.io/smcube/1.3.0/lib/modernizr/modernizr.js"></script>
    <!-- ABOVE -->
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/jquery/jquery.min.js" type="text/javascript"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/openlayers/ol.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/spin.js/spin.js" type="text/javascript"></script>

    <!-- Below -->
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/proj4/proj4.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/bootstrap/bootstrap.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/bootstrap-select/bootstrap-select.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/sweetalert/sweetalert.min.js"></script>    
    <script src="https://cdn.geo24.io/smcube/1.3.0/lib/bootstrap-switch/bootstrap-switch.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/typeahead.js/typeahead.bundle.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/swecomap.min.js"></script>
    <script src="../Scripts/webpart.js" type="text/javascript"></script>

</head>
<body>
    <p id="message">
        <!-- The following content will be replaced with the user name when you run the app - see App.js -->
        initializing...
    </p>
</body>
</html>
