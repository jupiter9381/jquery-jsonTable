$(document).ready(function(e){

	var $categories = [];
	var plans = [];

	$lang_id = 1;
 	
 	$all_categories = ajaxCall("/course_table_json/category_desc.json");
 	$categories = ajaxCall("/course_table_json/category.json");
	$plans = ajaxCall("/course_table_json/structure_plan.json");
	$majors = ajaxCall("/course_table_json/structure_major.json");
	$tracks = ajaxCall("/course_table_json/structure_track.json");
	$courses = ajaxCall("/course_table_json/course.json");

	drawCourseTable($courses);

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

	$categories.forEach(function($category){
		$catRow = [];
		if($category['parent_id'] == "0"){
			$_id = $category['_id'];
			$cat_detail = $all_categories.filter(cat => cat['cat_id'] == $_id && cat['lang_id'] == $lang_id)[0];
			$catRow = [$cat_detail['name']];
			drawCatTable($cat_detail['name']);
			$parent_id = $_id;
			$is_leaf = false;
			while(!$is_leaf) {
				$cat_detail = $categories.filter(cat => cat['parent_id'] == $parent_id);
				if($cat_detail.length == 0) {
					$is_leaf = true;
					drawLeafTable();
				}else {
					$parent_id = $cat_detail[0]['_id'];
					$_id = $cat_detail[0]['_id'];
					$cat_detail = $all_categories.filter(cat => cat['cat_id'] == $_id && cat['lang_id'] == $lang_id)[0];
					drawCatTable($cat_detail['name'])
				}
			}
		}
	});
	$selectedRow = "";
	$('#course_management tr td').on('click', 'button', function (){
		$selectedRow = $(this).parent().parent();
	});

	$('#course_list tbody tr td').on('click', '.add_course', function (){
		$index = $(this).attr('course-index');
		drawCourse($index, $selectedRow);
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
	$html = $("#course_management").html();
	$rows.forEach(function($row){
		$html += "<tr>";
		for($i = 0; $i < $row.length; $i ++){
			$html += "<td>"+$row[$i]+"</td>"
		}
		$html += "</tr>";
	});
	$("#course_management").html($html);
}

function drawCatTable($name) {
	$html = $("#course_management").html();
	$html += "<tr>";
	$html += "<td>" + $name +"</td>";
	for(var i = 0; i < $tdNum; i++){
		$html += "<td>" + "<input type='text' class='form-control'"+"</td>";
	}
	$html += "</tr>";
	$("#course_management").html($html);
}
function drawLeafTable(){
	$html = $("#course_management").html();
	$html += "<tr>";
	$html += "<td>" + "<button class='btn btn-primary' data-toggle='modal' data-target='#courseModal'>Add Course</button" +"</td>";
	for(var i = 0; i < $tdNum; i++){
		$html += "<td></td>";

	}
	$html += "</tr>";
	$("#course_management").html($html);
}
function drawCourse($index, $obj){
	$course = $courses[$index];
	$html = "";
	$html += "<tr class='leaf'>";
	$html += "<td>" + $course['course_code'] + " "+ $course['name'][$lang_id] + "</td>";
	for(var i = 0; i < $tdNum; i++){
		$html += "<td><div class='cicle' status='blank' style='border: 1px solid #fff; padding: 10px 11px; background: white; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;'></div></td>";
	}
	$html += "</tr>";
	$($html).insertBefore($obj);
	$("#courseModal").modal('toggle');

	$('#course_management tr.leaf').on('click', 'td', function (){
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
}
function drawCourseTable($courses){
	$html = "";
	for($i = 0; $i < $courses.length; $i++){
		$html += "<tr>";
		$html += "<td><button type='button' class='btn btn-primary add_course' course-index='"+$i+"'>Add</button></td>";
		$html += "<td>" + $courses[$i]['course_code'] + "</td>";
		$html += "<td>" + $courses[$i]['name'][$lang_id] + "</td>";
		$html += "</tr>";
	}
	$("#course_list tbody").html($html);
}