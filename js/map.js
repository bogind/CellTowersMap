
// create map object
				
				var map = L.map('map', 
				{center: [31.251155, 34.790096], 
				zoom: 13});
				
				
// Add OpenStreetMap and thunderforest tile layers variables
				
	var OSM = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
					
	var Thunderforest_neighbourhood = L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=278544e7c2664b7cb3d23b7433e96f5c', {
		attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		apikey: '278544e7c2664b7cb3d23b7433e96f5c'
		}).addTo(map);
					
	var Thunderforest_transport_dark = L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=278544e7c2664b7cb3d23b7433e96f5c',{
		apikey: '278544e7c2664b7cb3d23b7433e96f5c'
		});
				
				
// creating a group layer for the tiles
				
	var baseMaps = {
		"<span style='color: #777777'>Open Street Map</span>": OSM,
		"<span style='color: #478547'>Thunderforest neighbourhood</span>": Thunderforest_neighbourhood,
		"<span style='color: #478547'>Thunderforest <span style='color: #2b2b73'>Transport</span></span>": Thunderforest_transport_dark
		};
				
// Function to create the popups for the GeoJSON layer
				
	function onEachFeature(feature, layer) {
		if (feature.properties && feature.properties.NUM_timedi) {
			layer.bindPopup(
				"<b># of Obs: </b>" + 
				feature.properties.NUM_timedi + 
				"</br><b> Mean Time Variation: </b>" + 
				// rounded to create more informative popups
				Math.round(feature.properties.AVG_timedi*10)/10 + 
				" Minutes" + 
				"</br> <b>Range of obs: </b>" + 
				feature.properties.Range +
				" Minutes");
			}
		}

// Function to create the style for the GeoJSON layer
		
	function style(feature) {
		if(feature.properties.NUM_timedi > 0){
			if(feature.properties.AVG_timedi <= -1) {
				return {color: "#2eb82e", fillOpacity: 0.3, weight: 0.2};
			}	
			else if(feature.properties.AVG_timedi >= 1){				
				return {color: "#b30000", fillOpacity: 0.3, weight: 0.2};
			}
			else if(feature.properties.AVG_timedi < 1 && feature.properties.AVG_timedi > -1){
				return {color: "#33ccff", fillOpacity: 0.3, weight: 0.2};
			}
		}
		else{
			return {color: "gray", fillOpacity: 0.6, weight: 0.3};
			}
		}
			
function getColor(d) {
    if(d == "גולן טלקום"){ 
		return "#b30000";
	}
	else if(d == "P.H.I"){
		return "#00e6e6";
	}
	else if(d == "פלאפון"){
		return "#4d94ff";
	}
	else if(d == "הוט מובייל") {
		return "#ffa31a";
	}
	else {return "#800080"};
}			
				
// Read GeoJSON into a named variable, add the popup function and the styling function
	var BsStats;
	var BS;
	var cartoDBUserName = "bogind";
	var sqlQuery = null;
	var polygons = null;
	var url = "https://" + cartoDBUserName +".carto.com/api/v2/sql?format=GeoJSON&q="
	var sqlQuery = "SELECT * FROM cell_towers";
	var cellTowers;
			
	$.getJSON("../data/BsStat.geojson", function(data) { 
		var BsStats;
		BsStats = L.geoJSON(data,
						{onEachFeature: onEachFeature,
						style: style
						});
					

		
			$.getJSON(url + sqlQuery, function(data) {
		
		   cellTowers = L.geoJSON(data, {
					onEachFeature: function (feature, layer) {
						layer.bindPopup(feature.properties.company);
					},
					pointToLayer: function(geoJsonPoint, latlng) {
						return L.circleMarker(latlng);
					},
					style: function style(feature) {
						return {
							fillColor: getColor(feature.properties.company),
							weight: 1,
							opacity: 1,
							color: "black",
							fillOpacity: 0.5
						};
					}
				}).addTo(map);
		
				var BS = {
				"<span style='color: #008ae6'>Be'er Sheva Mean Time Variation</span>": BsStats,
				"cell Towers":cellTowers
					};	
			// Add Control objects to map
			// Had to move that here because ajax was too fast for the output to be caught outside
			L.control.layers(baseMaps, BS).addTo(map);
	});
	return([BsStats, BS, cellTowers]);
		});
	
// Add Measure tool in a Control object
				
	var measureControl = new L.Control.Measure({
		primaryLengthUnit: 'meters',
		secondaryLengthUnit: 'kilometers',
		primaryAreaUnit: 'sqmeters',
		secondaryAreaUnit: 'hectares'
		});
				
				
	measureControl.addTo(map);

	L.control.mousePosition().addTo(map);
				
		

		function buffersize(type,intensity){
			if(type == "מתקן גישה אלחוטי"){
				return 100 + intensity * 5;
			}
			else if(type == "אתר זעיר חיצוני"){
				return 50 + intensity * 2;
			}
			else if(type == "אנטנה משתפלת"){
				return 200 + intensity * 3;
			}
			else if(type == "תורן על הגג"){
				return 300 + intensity * 3;
			}
			else if(type == "אתר זעיר פנימי"){
				return 50 + intensity * 2;
			}
			else if(type == "תורן קרקעי"){
				return 500 + intensity * 5;
			}
			else if(type == "אנטנת עוקץ"){
				return 500 + intensity * 6;
			}
			else {
				return 200;
			}
	
		};


	var cellTowerBuffer;
	var turfbuffer;
	var polygons = [];
	var countbuffers = [];
	L.Control.addbuffer = L.Control.extend(
					{
						options:
						{
							position: 'topleft',
						},
						onAdd: function (map) {
							var controlDiv = L.DomUtil.create('input', 'leaflet-draw-toolbar leaflet-bar');
							controlDiv.type="button";
							controlDiv.title = "Create Buffers to see cell tower range (fictional, i don't really know how to calculate that)";
							controlDiv.value = 'Buffer';
							controlDiv.style.backgroundColor = 'white';     
							controlDiv.style.height = '30px';
							controlDiv.style.width = '65px';
							L.DomEvent
							L.DomEvent
							.addListener(controlDiv, 'click', function () {
							
							if(map.hasLayer(cellTowers)){
									var buffered = turf.buffer(cellTowers.toGeoJSON(), 0.5, {units: 'kilometers'});
									cellTowerBuffer = L.geoJSON(buffered).addTo(map);
									turfbuffer = cellTowerBuffer.toGeoJSON()
									for(i in turfbuffer.features){
										polygons.push(turfbuffer.features[i].geometry.coordinates);
									}
									turfbuffer = turf.polygons(polygons);
									
								};


							});

							return controlDiv;
						}
					});
					
	var addbuffer = new L.Control.addbuffer();
	map.addControl(addbuffer);

	L.Control.removebuffer = L.Control.extend(
					{
						options:
						{
							position: 'topleft',
						},
						onAdd: function (map) {
							var controlDiv = L.DomUtil.create('input', 'leaflet-draw-toolbar leaflet-bar');
							controlDiv.type="button";
							controlDiv.title = "delete the Buffers to see cell tower range (fictional, i don't really know how to calculate that)";
							controlDiv.value = 'Clear Buffer';
							controlDiv.style.backgroundColor = 'white';     
							controlDiv.style.height = '30px';
							controlDiv.style.width = '65px';
							L.DomEvent
							L.DomEvent
							.addListener(controlDiv, 'click', function () {
							
								sqlQuery = "";
			
							// Remove Other versions of layer
								if(map.hasLayer(cellTowerBuffer)){
									map.removeLayer(cellTowerBuffer);
								};
							
								// Get GeoJSON with SQL query

							});

							return controlDiv;
						}
					});
					
	var removebuffer = new L.Control.removebuffer();
	map.addControl(removebuffer);
	
	var clicked;
var turfcoords;
var turfpoint;
var turfbuffer;
var polygons = [];
var inrange = [0];
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function () {
    this._div.innerHTML = '<h5>Number of Cellular antennas within 0.5 Kilometers:</h5>' +  (
	'<br>' + inrange[0]);
};

info.addTo(map);
function onMapClick(e) {
	if(map.hasLayer(clicked)){
					map.removeLayer(clicked);
			};
	clicked = L.latLng(e.latlng);
	clicked = L.marker(clicked);
	clicked = clicked.toGeoJSON();
	turfcoords = clicked;
	turfpoint = turf.point(turfcoords.geometry.coordinates)
	inrange = [0]
	if(map.hasLayer(clicked)){
				map.removeLayer(clicked);
		};
	clicked = L.geoJSON(clicked).addTo(map)
	
	if(map.hasLayer(cellTowerBuffer)){
		countbuffers = []
					for(i in turfbuffer.features){
				  countbuffers.push(turf.booleanWithin(turfpoint, turfbuffer.features[i]));
				}
				
				inrange[0] = countbuffers.reduce(function(acc, val) { return acc + val; });
				info.update();
			};
			console.log(inrange[0]);
};
map.on('click', onMapClick);

