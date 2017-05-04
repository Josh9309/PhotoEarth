"use strict";

var API_KEY = "3be812106eb834ac4a2ea2f727aa56cd";
var FLICKR_URL ="https://api.flickr.com/services/rest/?method=";

var value;
var bigString = ""; //this is the string of html append to dynamic content div

function init(){
	document.querySelector("#search").onclick = getFlickrPlace;
	var mapOptions = {
		center: {lat:39.828127, lng:-98.579404},
		zoom: 3
	};
	
	map = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);
}

function getFlickrPlace(){
	//build url require for getting places
	var placeUrl = "https://api.flickr.com/services/rest/?method=flickr.places.find&api_key=";
	
	placeUrl += API_KEY;
	
	// get value of form field
	var query = document.querySelector("#searchterm").value;
	
	// get rid of any leading and trailing spaces
	query = query.trim();
	
	// if there's no band to search then bail out of the function
	if(query.length < 1) return;
	
	document.querySelector("#dynamicContent").innerHTML = "<b>Searching for " + query + "</b>";
	
	// replace spaces the user typed in the middle of the term with %20
	// %20 is the hexadecimal value for a space
	query = encodeURI(query); 
	
	//add the query to the place url request
	placeUrl +="&query=";
	
	placeUrl += query;
	
	//add the json format and callback request
	placeUrl += "&format=json&jsoncallback=jsonPlaceLoaded";
	
	//console.log("loading " +placeUrl);
	$("#content").fadeOut(1000);
	$.ajax({
		dataType: "jsonp",
		url: placeUrl,
		data: null,
		success: jsonPlaceLoaded
	});
}

function jsonPlaceLoaded(obj){
  //console.log("obj = " +obj);
  //console.log("obj stringified = " + JSON.stringify(obj));
  
  // if there's an error, print a message and return
  if(obj.error){
	var status = obj.status;
	var description = obj.description;
	document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
	$("#dynamicContent").fadeIn(500);
	return; // Bail out
  }
  
  // if there are no results, print a message and return
  if(obj.total_items == 0){
	var status = "No results found";
	document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i></p>";
	$("#dynamicContent").fadeIn(500);
	return; // Bail out
  }
  
  var allPlaces = obj.places.place;
  //console.log("places:" + allPlaces.length);
  
  if(allPlaces.length == 0){
	document.querySelector("#dynamicContent").innerHTML = "<p><i>" + "Sorry Could not find that location. Please Try Again." + "</i></p>";
	$("#dynamicContent").fadeIn(500);
	return;
  }
  getFlickrLocationPhotos(allPlaces[0]);
  
  bigString = "";
  
  bigString += "<h3><i>" + "Showing Photo Results for " + allPlaces[0]._content + "</i></h3>"
}

function getFlickrLocationPhotos(place){
	// build up our URL string
	var url = FLICKR_URL +"flickr.photos.search&api_key="; 
	
	url += API_KEY;
	
	//give request the place id
	url += ("&place_id" + place.place_id);
	
	//request that photos are geo tagged
	url += ("&has_geo=true");
	
	//give request the latitude
	url += ("&lat=" + place.latitude);
	
	//give request the longitude
	url += ("&lon=" + place.longitude);
	
	//limit the request to 10 phots per page
	url += "&per_page=20";
	
	url += "&format=json&jsoncallback=jsonLocationPhotosLoaded";
	
	document.querySelector("#dynamicContent").innerHTML = "<b>Searching for " + place._content + "</b>"; 
	
	// call the web service, and download the file
	console.log("loading " + url);
	$("#content").fadeOut(1000);
	$.ajax({
	  dataType: "jsonp",
	  url: url,
	  data: null,
	  success: jsonLocationPhotosLoaded
	});
}
  
function jsonLocationPhotosLoaded(obj){
	//console.log("obj = " +obj);
	//console.log("obj stringified = " + JSON.stringify(obj));
	
	// if there's an error, print a message and return
	if(obj.error){
		var status = obj.status;
		var description = obj.description;
		document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
		$("#dynamicContent").fadeIn(500);
		return; // Bail out
	}
	
	// if there are no results, print a message and return
	if(obj.total_items == 0){
		var status = "No results found";
		document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i><p>" + "<p><i>";
		$("#dynamicContent").fadeIn(500);
		return; // Bail out
	}
	
	var allPhotos = obj.photos.photo;
	//console.log("All photos.length = " + allPhotos.length);
  	clearMarkers();
	markers = []; //clear old markers
	for(var i =0; i < allPhotos.length; i++){
		var photo = allPhotos[i];
		console.log(allPhotos[i]);
		
		getFlickrPhotoInfo(photo.id);
		
	  	bigString += "<div class='photoDiv'>";
		var flickr_Photo_url = "https://farm" +photo.farm +".staticflickr.com/"+photo.server +"/"+photo.id+"_"+photo.secret +"_m.jpg"  
		bigString += "<img src='"+ flickr_Photo_url +"'/>";
	  	bigString += "</div>";
	}
	
	document.querySelector("#dynamicContent").innerHTML = bigString;
	$("#dynamicContent").fadeIn(500);
}	

function getFlickrPhotoInfo(photoID){
	var PhotoInfoURL = FLICKR_URL + "flickr.photos.getInfo&api_key=";
	
	//give request the api key
	PhotoInfoURL += API_KEY;
	
	//give the request the id of the flickr photo
	PhotoInfoURL += ("&photo_id=" + photoID);
	
	//tell the request to return json format and to callback jsonPhotoInfoLoaded
	PhotoInfoURL += "&format=json&jsoncallback=jsonPhotoInfoLoaded";
	
	// call the web service, and download the file
	//console.log("loading " + PhotoInfoURL);
	$("#content").fadeOut(1000);
	$.ajax({
	  dataType: "jsonp",
	  url: PhotoInfoURL,
	  data: null,
	  success: jsonPhotoInfoLoaded
	});
}

function jsonPhotoInfoLoaded(obj){
	//console.log("obj = " +obj);
	//console.log("obj stringified = " + JSON.stringify(obj));
	
	// if there's an error, print a message and return
	if(obj.error){
		var status = obj.status;
		var description = obj.description;
		document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
		$("#dynamicContent").fadeIn(500);
		return; // Bail out
	}
	
	// if there are no results, print a message and return
	if(obj.total_items == 0){
		var status = "No results found";
		document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i><p>" + "<p><i>";
		$("#dynamicContent").fadeIn(500);
		return; // Bail out
	}
	
	//store photo info
	var photoInfo = obj.photo;
	
	var latitude = Number(photoInfo.location.latitude);
	var longitude = Number(photoInfo.location.longitude);
  	
  //
	console.dir(latitude);
	console.dir(longitude);
	if(latitude && longitude){
		addMarker(latitude, longitude , "" + photoInfo.title._content);
	}
	
}