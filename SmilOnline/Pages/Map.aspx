<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
   <style type="text/css">        
        #s4-ribbonrow {
            display:none;
        }
        #s4-titlerow{
            display:none !important;
        }
        .ms-core-deltaSuiteLinks{
            display:none;
        }
        #s4-bodyContainer{
            padding-bottom:0px;
        }

        #contentRow {
            padding: 0px;
        }
        #contentBox {
            margin: 0px;
        }
   </style>

   <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
         
   <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/jquery/jquery.min.js" type="text/javascript"></script>
   <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/openlayers/ol.min.js" type="text/javascript"></script>
     
   <script src="../Scripts/app1.js" type="text/javascript"></script>
   <script src="https://cdn.geo24.io/swecomap/1.16.1/lib/spin.js/spin.js" type="text/javascript"></script>

   
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
   
    <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="full" Title="loc:full" />
    <script type="text/javascript">
        var spinner = new Spinner().spin(document.body);
        var stopSpin = function () {
            spinner.stop();
        }

       // //console.log("Map.aspx");
    </script>
         
    <iframe src="Default.aspx" id="frameMap" onload="initMainMap(stopSpin)" ></iframe>   
</asp:Content>
 