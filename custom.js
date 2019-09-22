$(document).ready(function(e){

	var $categories = [];
	var plans = [];

 	
 	$all_categories = ajaxCall("/course_table_json/category_desc.json");
 	$categories = ajaxCall("/course_table_json/category.json");
	$plans = ajaxCall("/course_table_json/structure_plan.json");
	$majors = ajaxCall("/course_table_json/structure_major.json");
	$tracks = ajaxCall("/course_table_json/structure_track.json");

	$lang_id = 1;
	$rows = [];
	$plan_row = ["Plan"];
	$major_row = ["Major"];
	$track_row = ["Track"];
	$tdNum = 0;
	$plans.forEach(function($plan) {
		$majors.forEach(function($major) {
			if($major['plan_id'] == $plan['_id']){
				$tracks.forEach(function($track){
					if($track['major_id'] == $major['_id'] && $track['plan_id'] == $plan['_id']){
						$tdNum++;
						$plan_row.push($plan['plan_name'][$lang_id]);
						$major_row.push($major['major_name'][$lang_id]);
						$track_row.push($track['track_name']);
					}
				});
			}
		});
	});
	$rows.push($plan_row);
	$rows.push($major_row);
	$rows.push($track_row);

	drawTable($rows);

	console.log($tdNum);



	$categories.forEach(function($category){
		$catRow = [];
		if($category['parent_id'] == "0"){
			$_id = $category['_id'];
			$cat_detail = $all_categories.filter(cat => cat['cat_id'] == $_id && cat['lang_id'] == $lang_id)[0];
			$catRow = [$cat_detail['name']];
			drawCatTable($cat_detail['name'], $tdNum);
			$parent_id = $_id;
			while() {

			}
		}
	});



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
	$html = $("table").html();
	$rows.forEach(function($row){
		$html += "<tr>";
		for($i = 0; $i < $row.length; $i ++){
			$html += "<td>"+$row[$i]+"</td>"
		}
		$html += "</tr>";
	});
	$("table").html($html);
}

function drawCatTable($name, $num) {
	$html = $("table").html();
	$html += "<tr>";
	$html += "<td>" + $name +"</td>";
	for(var i = 0; i < $num; i++){
		$html += "<td>" + "<input type='text' class='form-control'"+"</td>";
	}
	$html += "</tr>";
	$("table").html($html);
}