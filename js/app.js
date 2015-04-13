$(function (){


	var map;
	var ubc_lat = 49.2611,
		ubc_long = -123.2531;
	var ubc_latlong;
	var points = [];


	// Foursquare Options URL
	var time_options = '&time=any';
	var day_options = '&day=any';
	var CLIENT_ID = 'KPS2K54XLQM1G4JVL3DBMZ0CQTZKEAIMYIC5UHCVR0NI2KRM';
	var CLIENT_SECRET = 'OHO4BCL1FHIGBA0PXGFEJDRQBAEPPBX3L2WJ43HNBXCGH4RZ';
	var type = '&section=food';
	var VERSION = 20130815;
	var api = 'explore?'
	var URL = 'https://api.foursquare.com/v2/venues/' + api 
				+ '&ll=' + ubc_lat + ',' + ubc_long
				+ time_options 
				+ day_options 
				+ type
				+ '&client_id=' + CLIENT_ID 
				+ '&client_secret=' + CLIENT_SECRET
				+ '&v=' + VERSION;




	function initialize() {
	  var mapOptions = {
	    zoom: 6
	  };
	  map = new google.maps.Map(document.getElementById('map-canvas'),
	      						mapOptions);
	  ubc_latlong = new google.maps.LatLng(ubc_lat, ubc_long);

	  // Try HTML5 geolocation
	  if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(on_success_geolocation, function() {
	      handle_no_geolocation(true);
	    });
	  } else {
	    // Browser doesn't support Geolocation
	    handle_no_geolocation(false);
	  }
	}


	$.ajax({
		type: 'GET',
		url: URL,
		success: on_success_foursquare_request,
		error: on_error_foursquare_request
	});

	// ---------------- Setting up listeners ---------------- 
	$('#center-ubc').click(handle_center_on_ubc);

	// ---------------- Functions --------------------------
	function handle_no_geolocation(errorFlag) {
	  if (errorFlag) {
	    var content = 'Error: The Geolocation service failed.';
	  } else {
	    var content = 'Error: Your browser doesn\'t support geolocation.';
	  }

	  var options = {
	    map: map,
	    position: ubc_latlong,
	    content: content
	  };

	  var infowindow = new google.maps.InfoWindow(options);
	  map.setCenter(options.position);
	}
	function on_success_geolocation(position){
		var latitdue 
		var pos = new google.maps.LatLng(position.coords.latitude,
		                                 position.coords.longitude);
		console.log()
		var infowindow = new google.maps.InfoWindow({
		  map: map,
		  position: pos,
		  content: 'Location found using HTML5.'
		});

		map.setCenter(pos);
	}
	function handle_center_on_ubc(){
		map.setCenter(ubc_latlong);
	}
	function on_success_foursquare_request(object){
		console.log(object.response);
		parse_response(object);
		var points_google_array = new google.maps.MVCArray(points);
		heatmap = new google.maps.visualization.HeatmapLayer({
		    data: points_google_array
	    });
	    heatmap.setMap(map);
	}
	function on_error_foursquare_request(err) {
		console.log("Error retrieving places from foursquare");
	}
	function parse_response(object){
		var resp = object.response;
		console.log(resp.groups);
		var group = resp.groups[0];
		var items = group.items;
		for (var i = 0; i < items.length; i++){
			var item = items[i];
			var venue = item.venue;
			// var name = 

			var location = venue.location;
			var lat = location.lat;
			var lng = location.lng;
			var google_latlng = new google.maps.LatLng(lat, lng);
			points.push(google_latlng);
			var rating = venue.rating;
			console.log(rating);
		}
	}
	// ---------------- Google maps stuff ----------------
	google.maps.event.addDomListener(window, 'load', initialize);
});