$(document).ready(function(e){

	var $categories = [];
	var plans = [];

 	
 	$categories = ajaxCall("/course_table_json/category.json");
	$plans = ajaxCall("/course_table_json/structure_plan.json");
	$majors = ajaxCall("/course_table_json/structure_major.json");
	$tracks = ajaxCall("/course_table_json/structure_track.json");

	console.log($plans);
	console.log($majors);
	console.log($tracks);

	$rows = [];
	$row = [];
	$plans.forEach(function($plan) {
		$majors.forEach(function($major) {
			if($major['plan_id'] == $plan['_id']){
				$tracks.forEach(function($track){
					if($track['major_id'] == $major['_id'] && $track['plan_id'] == $plan['_id']){
						$row.push($plan['plan_name'][1]);
					}
				});
			}
		});
	});
	$rows.push($row);

	drawTable($rows);
});

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

function drawTable($rows) {
	$html = "";
	$rows.forEach(function($row){
		$html += "<tr>";
		for($i = 0; $i < $row.length; $i ++){
			$html += "<td>"+$row[$i]+"</td>"
		}
		$html += "</tr>";
	});
	$("table").html($html);
}