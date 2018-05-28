function open_legend(){
				
				var legendstring = "<div><span><h3>Check how many Cellular Towers are in an area</h3><button id='legendbut2' type='button' title='Close legend' onclick='close_legend()'>&#9746</button></span>"+
					"<p>The map allows you to check how many cellular antenas are within 500 meters from every point you click"+
					" all you have to do is click on the buttn to add the buffers and click on the map to check a selected location.<br> </p>" +
					"<i style='background:#b30000'></i><span>גולן טלקום</span>"
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
									'top': '5%',
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