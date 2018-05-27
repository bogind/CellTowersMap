function open_legend(){
				
				var legendstring = "<div><span><h3>Beer Sheva Time Variation</h3><button id='legendbut2' type='button' title='Close legend' onclick='close_legend()'>&#9746</button></span>"+
					"<p>The map shows time variation between real-time bus location data and bus schedules." +
					"real-time data was collected over a week in July 2017 the data was collected using the <b>R</b> programming language, </p>" +
					"<p>with HTTP POST querying Israel's Ministery Of Transportation's server to query the server and recieve" +
					"a response containing the <a href='http://user47094.vs.easily.co.uk/siri/documentation.html'>SIRI</a> data transfer protocol." +
					"More informatin about the study can be found <a href='http://raphael.geography.ad.bgu.ac.il/GAMESLab/190-2/estimation-of-public-transportation-service-reliability/'>HERE</a>.</p>" +
					"<p><center>______________________________________________________________________</center></p>" +
					"<p>The popup for each hexagon states the number " +
					"of observations collected and compared within it, " +
					"the mean time variation inside the hexagon and " +
					"the range of time varition in minutes between the smallest" +
					"(earliset compared to schedule) and largest observation in the area.</p>" +
					"<p> gray hexagons will have no observations, and therefore no popup.</p>" +
					"<p><center>______________________________________________________________________</center></p>" +
					"<p>As you may have noticed both the Legend is expandable and the</br>" +
					"Layer+Tile list are collapsable, the data layer can be turned off</br>" +
					"and more tile layers are available for viewing. </p>" +
					"<p><b>*The update for the second project</b> are the buttons to the left, "+
					"they add a partial GeoJSON on top of the data layer to show areas where most of the buses are late or early. "+
					"A third button removes the partial GeoJSON</p>"+ 
					"<p><center>______________________________________________________________________</center></p>" +
					"<b>Mean Time Variation by color: </b><br><br>" +
					"<span><mark style='background-color: rgba(179, 0, 0,1); color: rgba(179, 0, 0,1);'>XX</mark><span><b>Late</b> (More than 1 Minute)</span></span>" +
					"</br><span><mark style='background-color: #33ccff; color: #33ccff;'>XX</mark><span><b>On Time</b></span></span>" +
					"</br><span><mark style='background-color: #2eb82e; color: #2eb82e;'>XX</mark><span><b>Early</b> (More than 1 Minute)</span></span>" +
					"</br><span><mark style='background-color: gray; color: gray;'>XX</mark><span style ="+'align:'+'left'+";'><b>No Observations</b></span></span>"+
					"</div>";
				$("#legend").html(legendstring);
				$("#legend").css({'line-height': '18px',
									'color': '#333333',
									'font-family': "'Open Sans', Helvetica, sans-serif",
									'padding': '6px 8px',
									'background-color': 'rgba(255,255,255,0.8)',
									'box-shadow': '0 0 15px rgba(0,0,0,0.2)',
									'border-radius': '5px',
									'position': 'fixed',
									'left': '30%',
									'top': '12%',
									'width': '600px',
									'display': 'block'});
				$("#container").css('width', '600px');
				$("#legendbut").css('display' , 'none');
				$("#legendbut2").css({'align': 'right',
									  'position': 'absolute',
									  'top': '7px',
									  'right': '5px'});
}

function close_legend(){
	$("#legendbut").css('display' , 'block');
	$("#legend").css('display' , 'none');
}