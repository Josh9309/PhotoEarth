 "use strict";

	var API_KEY = "3be812106eb834ac4a2ea2f727aa56cd";
	var FLICKR_URL ="https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=" + API_KEY + "&per_page=10&format=json&jsoncallback=jsonLoaded"; 
	
	var value;
	  
	function init(){
		document.querySelector("#search").onclick = getData;
	}
	
	// MY FUNCTIONS
	function getData(){
		// build up our URL string
		var url = FLICKR_URL; 
		
		// get value of form field
		value = document.querySelector("#searchterm").value;
		
		// get rid of any leading and trailing spaces
		value = value.trim();
		
		// if there's no band to search then bail out of the function
		if(value.length < 1) return;
		
		document.querySelector("#dynamicContent").innerHTML = "<b>Searching for " + value + "</b>";
		
		// replace spaces the user typed in the middle of the term with %20
		// %20 is the hexadecimal value for a space
		value = encodeURI(value); 
		
		// call the web service, and download the file
		console.log("loading " + url);
		$("#content").fadeOut(1000);
		$.ajax({
		  dataType: "jsonp",
		  url: url,
		  data: null,
		  success: jsonLoaded
		});
	}
	  
	function jsonLoaded(obj){
		console.log("obj = " +obj);
		console.log("obj stringified = " + JSON.stringify(obj));
		
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
		console.log("All photos.length = " + allPhotos.length);
		var bigString = "";
		for(var i =0; i < allPhotos.length; i++){
			var photo = allPhotos[i];
			
			var flickr_Photo_url = "https://farm" +photo.farm +".staticflickr.com/"+photo.server +"/"+photo.id+"_"+photo.secret +"_m.jpg"  
			bigString += "<img src='"+ flickr_Photo_url +"'/>";
		}
		
		document.querySelector("#dynamicContent").innerHTML = bigString;
		$("#dynamicContent").fadeIn(500);
	}	