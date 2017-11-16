<!DOCTYPE html>
<!--[if IE 7]><html lang="sv" class="no-js lt-ie10 lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html lang="sv" class="no-js lt-ie10 lt-ie9"><![endif]-->
 

<!--[if IE 9]><html lang="sv" class="no-js lt-ie10"><![endif]-->
<!--[if gt IE 9]><!--><html lang="sv" class="no-js"><!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="sv">
    <meta http-equiv="cleartype" content="on">
    <meta http-equiv="imagetoolbar" content="no">
    <title>Sweco Map</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="icon" href="../Images/favicon.ico?v23" type="image/x-icon" />
   
    <link rel="shortcut icon" href="../Images/favicon.ico?v23" type="image/x-icon" />
 
    <link rel="apple-touch-icon-precomposed" href="../Images/logotype.png">
    <link rel="stylesheet" href="https://cdn.geo24.io/swecomap/1.16.1/css/cube/style.css">
    <link rel="stylesheet" href="https://cdn.geo24.io/swecomap/1.16.1/lib/sweetalert/sweetalert.css">
    <link rel="logotype" href="https://cdn.geo24.io/swecomap/1.16.1/img/logotype.png">
    <link rel="marker" href="https://cdn.geo24.io/swecomap/1.16.1/img/marker.png">
   
    <script src="https://cdn.geo24.io/smcube/1.3.0/lib/modernizr/modernizr.js"></script>
    
    <style type="text/css">        
        #s4-titlerow{ 
            display: none !important;
        }
        /* Fix/patch for issue 116 in Sweco Map*/
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

</head>  
   
<body>
<!--[if lt IE 9]>
    <p class="chromeframe"><i class="fa fa-exclamation-circle"></i> Uppgradera din webbl&auml;sare f&ouml;r att l&auml;sa webbplatsen. <a href="http://browsehappy.com/" target="_blank">Surfa lyckligt, ladda ner en modern webbl&auml;sare h&auml;r <i class="fa fa-angle-right"></i></a></p>
<![endif]-->
    
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/openlayers/ol.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/proj4/proj4.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/jquery/jquery.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/bootstrap/bootstrap.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/bootstrap-select/bootstrap-select.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/sweetalert/sweetalert.min.js"></script>
    
    <script src="https://cdn.geo24.io/smcube/1.3.0/lib/bootstrap-switch/bootstrap-switch.min.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/typeahead.js/typeahead.bundle.min.js"></script>
   
    <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/spin.js/spin.js"></script>
    <script src="https://cdn.geo24.io/swecomap/1.16.1/swecomap.min.js"></script>
  <%-- <script src="../Scripts/app1.js" type="text/javascript"></script>  --%>
   <script type="text/javascript">
       //console.log("Default.aspx");
   </script>
    
</body>
</html>