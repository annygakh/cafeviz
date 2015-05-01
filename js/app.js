$(function (){


	var map, map_div;
	var ubc_lat = 49.2611,
		ubc_long = -123.2531;
	var heatmap;

	var ubc_latlong;
	var points = [];
	var markers = [];


	var bounding_box;

	// Foursquare Options URL
	var time_options = '&time=any';
	var day_options = '&day=any';
	var CLIENT_ID = 'KPS2K54XLQM1G4JVL3DBMZ0CQTZKEAIMYIC5UHCVR0NI2KRM';
	var CLIENT_SECRET = 'OHO4BCL1FHIGBA0PXGFEJDRQBAEPPBX3L2WJ43HNBXCGH4RZ';
	var type = '&section=food';
	var VERSION = 20130815;
	var api = 'explore?';
	var radius = '&radus=' + 10000;
	var limit = '&limit=' + 50;
	var URL = 'https://api.foursquare.com/v2/venues/' + api 
				+ '&ll=' + ubc_lat + ',' + ubc_long
				+ time_options 
				+ day_options 
				+ type
				+ limit
				+ '&client_id=' + CLIENT_ID 
				+ '&client_secret=' + CLIENT_SECRET
				+ '&v=' + VERSION;


	var ZOOM_LEVEL = 13;

	function initialize() {
	  var mapOptions = {
	    zoom: ZOOM_LEVEL
	  };
	  map_div = document.getElementById('map-canvas');
	  map = new google.maps.Map(map_div,
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
	  // add google event listeners
	  google.maps.event.addListener(map, 'dragend', on_center_changed);
	}


	send_request(URL);

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
		var pos = new google.maps.LatLng(position.coords.latitude,
		                                 position.coords.longitude);
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
		    data: points_google_array,
		    radius: 30
	    });
	    // heatmap.setMap(null);
	    heatmap.setMap(map);
	}
	function make_url(center_of_map){
		console.log('remake_url');
		var new_lat = center_of_map.lat();
		var new_lng = center_of_map.lng();

		var new_url = 'https://api.foursquare.com/v2/venues/' + api 
					+ '&ll=' + new_lat + ',' + new_lng
					+ time_options 
					+ day_options 
					+ type
					+ radius
					+ limit
					+ '&client_id=' + CLIENT_ID 
					+ '&client_secret=' + CLIENT_SECRET
					+ '&v=' + VERSION;
		return new_url;

	}

	function on_center_changed(){
		var center_latlng = get_center_of_map();
		var new_url = make_url(center_latlng);
		var resp_obj = send_request(new_url);
		heatmap.setMap(null);
		delete_markers();
	}
	function get_center_of_map(){
		var curr_map_center = map.getCenter();
		return curr_map_center;
	}
	function send_request(new_url){
		$.ajax({
			type: 'GET',
			url: new_url,
			success: on_success_foursquare_request,
			error: on_error_foursquare_request
		});
	}
	function on_error_foursquare_request(err) {
		console.log("Error retrieving places from foursquare");
	}
	function parse_response(object){
		var resp = object.response;
		var group = resp.groups[0];
		var items = group.items;
		points = [];
		for (var i = 0; i < items.length; i++){
			var item = items[i];
			var venue = item.venue;
			var rating = venue.rating;

			var location = venue.location;
			var lat = location.lat;
			var lng = location.lng;
			var google_latlng = new google.maps.LatLng(lat, lng);
			var weight;
			weight = rating * 10;
			var obj_to_save = {
				location: google_latlng,
				weight: weight
			}
			save_to_points_array(obj_to_save);
			add_marker(google_latlng);
		}
	}
	function save_to_points_array(obj_to_save){
			points.push(obj_to_save);
	}
	function add_marker(google_latlng){
		var marker = new google.maps.Marker({
			position: google_latlng,
			map: map,
			opacity: 0.2
		})
		markers.push(marker);
	}

	// Sets the map on all markers in the array.
	function set_all_map(map) {
	  for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(map);
	  }
	}

	// Removes the markers from the map, but keeps them in the array.
	function clear_markers() {
	  set_all_map(null);
	}

	// Deletes all markers in the array by removing references to them.
	function delete_markers() {
	  clear_markers();
	  markers = [];
	}


	// ---------------- Google maps stuff ----------------
	google.maps.event.addDomListener(window, 'load', initialize);
	
});