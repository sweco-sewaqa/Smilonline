<style type="text/css">
.fullScreen {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>

<script type="text/javascript" src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript">
    //http://www.webdesignerdepot.com/2013/03/how-to-use-the-fullscreen-api/
	//https://www.sitepoint.com/use-html5-full-screen-api/
	function fullScreen(element) {
	  if(element.requestFullScreen) {
		element.requestFullScreen();
	  } else if(element.webkitRequestFullScreen ) {
		element.webkitRequestFullScreen();
	  } else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();	  
	  } else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	  }	  
	}	  
	
	function fullScreenCancel() {
	  if(document.requestFullScreen) {
		document.requestFullScreen();
	  } else if(document .webkitRequestFullScreen ) {
		document.webkitRequestFullScreen();
	  } else if(document .mozRequestFullScreen) {
		document.mozRequestFullScreen();
	  } else if (document.msRequestFullscreen) {
		document.msRequestFullscreen();
	  }
	}
	
	function mapFullscreen(full, senderId) {
		var iframes=$('iframe');
		//console.log('mapFullscreen('+full+', '+senderId+') - iframes=#'+iframes.length);
		$(iframes).each(function (index, value) { 
			var src =$(this).attr('src');
			var match = src && src.indexOf('SenderId='+senderId)>0; //src.indexOf('://apps-')>0;
			//console.log('src=' + src+' => match='+match);
			if(match)
			{
				if(full)
					this.className = "fullScreen";
				else
					this.className = "";
				//src.className = "fullScreen";
			}
		});		
	}
	
	function setupMessageListen(){
		//console.log('setupMessageListen');
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

		// Listen to message from child window
		eventer(messageEvent,function(e) {
			var key = e.message ? "message" : "data";
			var data = e[key];
			//console.log('received post message from '+e.origin+' with data='+data);
			if(0==data.indexOf('fullscreen')){
				var senderId = data.substring(11);
				mapFullscreen(true, senderId);
			}else if(0==data.indexOf('normscreen')){
				var senderId = data.substring(11);
				mapFullscreen(false, senderId);
			}
		},false);
	}

	//console.log('Hello FullscreenWP');
	$( document ).ready(function() {	
		//document.getElementsByTagName("iframe")[0].className = "fullScreen";
		setupMessageListen();
	});
</script>

<button id="mapfull" type="button" onclick="fullScreen(document.getElementsByTagName('iframe')[0])" >Full</button><br/>
<button id="mapbig" type="button" onclick="mapFullscreen()" >Big</button><br/>
