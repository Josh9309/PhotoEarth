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
	var marker = new google.maps.Marker({position: position, map:map});
	marker.setTitle(title);
	
	//Add a listener for the click event
	google.maps.event.addListener(marker, 'click', function(e){
		makeInfoWindow(this.position, this.title);
	});
	
	markers.push(marker);
	zoomOnFirstResult();
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
	if(markers[0] == null)return;
	//set the center of the map to the position of the first marker
	map.setCenter(markers[0].getPosition());
	map.setZoom(10);
}
