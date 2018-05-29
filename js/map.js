
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
				

// Function to create the style for the GeoJSON layer
		
			
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
		else {return "#800080"}; // cellcom towers
	}			
				
	// Read GeoJSON into a named variable, add the popup function and the styling function

	var BsStats;
	var LayersControl;
	var cartoDBUserName = "bogind";
	var sqlQuery = null;
	var polygons = null;
	var url = "https://" + cartoDBUserName +".carto.com/api/v2/sql?format=GeoJSON&q="
	var sqlQuery = "SELECT id, company, type_, intensity  FROM cell_towers";
	var cellTowers;
	var cellTowerBuffer;
	var turfbuffer;
	var polygons = [];
	var countbuffers = [];
	var clicked;
	var turfcoords;
	var turfpoint;
	var turfbuffer;
	var polygons = [];
	var inrange = [0];
	var info = L.control();

	
	// Load geojson layer, add as circle markers, add styling,
	// create buffers and invisible polygons used to calculate the inside value.
	// after all that add controls for basemaps and layer to map

	$.getJSON("data/celltowers.geojson", function(data) {
		
		   cellTowers = L.geoJSON(data, {
					//onEachFeature: function (feature, layer) {
						//layer.bindPopup(feature.properties.company);
					//},
					pointToLayer: function(geoJsonPoint, latlng) {
						return L.circleMarker(latlng);
					},
					style: function style(feature) {
						return {
							fillColor: getColor(feature.properties.company),
							weight: 1,
							opacity: 1,
							radius: 5,
							color: "black",
							fillOpacity: 0.8
						};
					},
					interactive: false
				}).addTo(map);
								var buffered = turf.buffer(cellTowers.toGeoJSON(), 0.5, {units: 'kilometers'});
								cellTowerBuffer = L.geoJSON(buffered);
									turfbuffer = cellTowerBuffer.toGeoJSON()
									for(i in turfbuffer.features){
										polygons.push(turfbuffer.features[i].geometry.coordinates);
									}
									turfbuffer = turf.polygons(polygons);
		
				var LayersControl = {
				"cell Towers":cellTowers
					};	
					
			// Add Control objects to map
			// Had to move that here because ajax was too fast for the output to be caught outside
			
			L.control.layers(baseMaps, LayersControl).addTo(map);
			return([ LayersControl, cellTowers]);
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
				
				
	// messing around with different sizes of buffers, 
	// not used because i don't really know how to calculate that.

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


	
	// add info control to map
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};
	info.setPosition('bottomleft');

	// create function to update the info control
	
	info.update = function () {
		this._div.innerHTML = '<center><h5>Number of Cellular antennas<br> within 0.5 Kilometers:</h5>' +  (
		'<br><font size="5"><u>' + inrange[0]+'</u></font></center>');
	};
	
	// create the control to ad the buffer to the map
	// only add because it's created as a hidden layer when the map is loaded.
	
	L.Control.addbuffer = L.Control.extend(
					{
						options:
						{
							position: 'topleft',
						},
						onAdd: function (map) {
							var controlDiv = L.DomUtil.create('input', 'leaflet-draw-toolbar leaflet-bar');
							controlDiv.type="button";
							controlDiv.title = "Create Buffers to see cell tower range (500 meters)";
							controlDiv.value = 'Buffer On/Off';
							controlDiv.style.backgroundColor = 'white';     
							controlDiv.style.height = '30px';
							controlDiv.style.width = '85px';
							L.DomEvent
							.addListener(controlDiv, 'click', function () {
							
							if(map.hasLayer(cellTowerBuffer)){
								map.removeLayer(cellTowerBuffer);
							}else{
								cellTowerBuffer.addTo(map);
							}


							});

							return controlDiv;
						}
					});
					
	var addbuffer = new L.Control.addbuffer();
	map.addControl(addbuffer);


	info.addTo(map);

	// create function to update the clicked value of the info.
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
		
		
			countbuffers = []
		for(i in turfbuffer.features){
			  countbuffers.push(turf.booleanWithin(turfpoint, turfbuffer.features[i]));
		}
					
		inrange[0] = countbuffers.reduce(function(acc, val) { return acc + val; });
		info.update();
				
		console.log(inrange[0]);
	};

	map.on('click', onMapClick);

	// create legend for celltowers
	
	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend')


			div.innerHTML += "<p><i style='background:#b30000'></i>גולן טלקום</p>" 
			div.innerHTML += "<p><i style='background:#4d94ff'></i>פלאפון</p>" 
			div.innerHTML += "<p><i style='background:#ffa31a'></i>הוט מובייל</p>" 
			div.innerHTML += "<p><i style='background:#00e6e6'></i>P.H.I (פרטנר והוט)</p>" 
			div.innerHTML += "<p><i style='background:#800080'></i>סלקום</p>" 
			


		return div;
	};

	legend.addTo(map);

	// create and add dropdown menu
	
	var dropdown = L.control({position: "topright"});
	dropdown.onAdd = function (map) {
		var div = L.DomUtil.create("div", "dropdown");
		div.innerHTML = '\
			<select id="company_sel">\
			<option value="כל החברות">\
				כל החברות\
			</option>\
			<option value="גולן טלקום">\
				גולן טלקום\
			</option>\
			<option value="פלאפון">\
				פלאפון\
			</option>\
			<option value="הוט מובייל">\
				הוט מובייל\
			</option>\
			<option value="P.H.I">\
				P.H.I (פרטנר והוט)\
			</option>\
			<option value="סלקום">\
				סלקום\
			</option>\
		</select>\
		';
		return div;
	};
	dropdown.addTo(map);

	$("#company_sel").on("change", function() {
		
		var valueSelected = $("#company_sel").val();
		
		cellTowers.eachLayer(function (layer) { 
		if(valueSelected == 'כל החברות'){
			layer.setStyle({ fillOpacity : 0.75,
								weight: 1}) 
		}else{
			  if(layer.feature.properties.company == valueSelected) {    
				layer.setStyle({ fillOpacity : 1,
									weight: 1}) 
			  }
			  if(layer.feature.properties.company != valueSelected) {    
				layer.setStyle({ fillOpacity : 0.001,
									weight: 0}) 
			  }
			  
		}
			});
		
	});
	
	// change visibility by zoom level
	// need to add a change in visibility by mapbounds
	
	map.on('zoom', function() {
		cellTowers.eachLayer(function (layer) { 
		if(map.getZoom() >= 13){
			layer.setStyle({ weight: 1,
							opacity: 1,
							radius : 5}) 
				 }else{layer.setStyle({ weight: 0.3,
										opacity: 0.3,
										radius : 0.8}) }
			});
	});
