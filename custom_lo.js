$(document).ready(function(){
	$data = ajaxCall("course_table_json/lo.json");

	$lang = 'de';
	$leftColumns = $data['left_data'];
	$topColumns = $data['top_data'];

	console.log($leftColumns);
	$topData = [];
	$tdNum = 0;
	$topColumns.forEach($top => { 

		$name = $top['sname'][$lang];

		$details = $top['detail']['outcome_one'];
		$top_detail = [];
		$details.forEach($detail => {
			$top_detail.push($detail[$lang]);
			$tdNum++;
		})
		$topData.push({'name': $name, 'detail': $top_detail});
	});

	$leftData = [];
	$leftColumns.forEach($left => {
		$name = $left['sname'][$lang];
		$leftData.push($name);
	}) ;
	drawHeader($topData);
	drawBody($leftData);


	$('body').on('click', 'tr.leaf td', function (){
		$status = $(this).children().attr('status');
		if($status == "blank") {
			$(this).children().attr({status: 'black'});
			$(this).children().css({'background': 'black', 'border-color': 'black'});
		} else if ($status == "black") {
			$(this).children().attr({status: 'grey'});
			$(this).children().css({'background': 'grey', 'border-color': 'black'});
		} else if($status == "grey") {
			$(this).children().attr({status: 'white'});
			$(this).children().css({'background': 'white', 'border-color': 'black'});
		} else if($status == "white") {
			$(this).children().attr({status: 'blank'});
			$(this).children().css({'background': 'white', 'border-color': 'white'});
		}
	});

});

function drawBody($leftData) {
	$html = $("#lo_management tbody").html();

	$leftData.forEach($left => {
		$html += "<tr class='leaf'>";
		$html += "<td>"+$left+"</td>";
		for($i = 0; $i < $tdNum; $i++) {
			$html += "<td><div class='cicle' status='blank' style='border: 1px solid #fff; padding: 10px 11px; background: white; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;'></div></td>";
		}
		$html += "</tr>";
	});
	$("#lo_management tbody").html($html);
}
function drawHeader($data) {
	$html = "";
	$html += "<tr>";
	$html += "<td rowspan='2'></td>";
	$data.forEach($top => {

		$html += "<td colspan='"+$top['detail'].length+"'>"+$top['name']+"</td>";
		
	});
	$html += "</tr>";

	$html += "<tr>";
	$data.forEach($top => {

		$top['detail'].forEach($detail => {
			$html += "<td>"+$detail+"</td>";	
		});
		
	});
	$html += "</tr>";

	$("#lo_management tbody").html($html);
}

function ajaxCall(url) {
	var data;
	$.ajax({ 
	    url: url,  
	    dataType: 'json', 
	    async: false, 
	    success: function(json){ 
	    	data = json;
	    } 
	});
	return data;
}