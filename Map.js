var map;
var infowindow;
var markers = [];

//function setMap(newMap){
//	map = newMap;
//}
//
//function getMap(){
//	return map;
//}

function addMarker(latitude, longitude, title){
	var position = {lat:latitude, lng:longitude};
	
	while(true){
		debugger;
		var isDuplicate = false;
		for(var i = 0; i < markers.length; i++){
			var lat = markers[i].position.lat()
			if(position.lat == lat){
				isDuplicate = true;
				break;
			}
		}
		
		if(isDuplicate){
			
			position.lat += 0.00001;
			position.lng += 0.00008;
		}
		else{
			break;
		}
	}
	
	var marker = new google.maps.Marker({position: position, map:map});
	if(title == ""){
	  title = "UntitledImage";
	  marker.setTitle(title);
	}
  	else{
  		marker.setTitle(title);
	}
	//Add a listener for the click event
	google.maps.event.addListener(marker, 'click', function(e){
		makeInfoWindow(position, title);
	});
	
	markers.push(marker);
	zoomOnFirstResult();
  
  	//console.dir(marker);
}
  
function clearMarkers(){
	//close info window if it exists
	if(infowindow){
		infowindow.close();
	}
	
	//loop through markers array
	for(var i =0; i < markers.length; i++){
		//call .setMap(null) on each marker to remove it from map
		markers[i].setMap(null);
	}
	
	markers = [];
}

function makeInfoWindow(position, msg){
	//Close old Info Window if it exists
	if(infowindow){
		infowindow.close();
	}
	
	//Make a new Info Window
	infowindow = new google.maps.InfoWindow({
		map: map,
		position: position,
		content: "<b>" + msg + "</b>"
	});
}

function zoomOnFirstResult(){
	if(markers[2] == null)return;
	//set the center of the map to the position of the first marker
	map.setCenter(markers[2].getPosition());
	map.setZoom(12);
}

