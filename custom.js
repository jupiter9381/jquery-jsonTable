$(document).ready(function(e){

	var $categories = [];
	var plans = [];

	$lang_id = 1;
 		

 	//$all_categories = ajaxCall("course_table_json/category_desc.json");
 	$categories = ajaxCall("course_table_json/category.json");
	$plans = ajaxCall("course_table_json/structure_plan.json");
	$majors = ajaxCall("course_table_json/structure_major.json");
	$tracks = ajaxCall("course_table_json/structure_track.json");
	$courses = ajaxCall("course_table_json/course.json");

	$structure = ajaxCall("course_table_json/structure.json");

	$selectedCourse = [];
	$courses.forEach(function($course){$selectedCourse.push(false)});

	$course_values = [];

	drawCourseTable($courses);

	$rows = [];
	$plan_row = ["Plan"];
	$major_row = ["Major"];
	$track_row = ["Track"];
	$tdNum = 0;
	$structure.forEach(function($plan){
		$majors = $plan['has_major'];
		$majors.forEach(function($major){
			$tracks = $major['has_track'];
			$tracks.forEach(function($track){
				$tdNum++;
				$plan_row.push($plan['plan_name'][$lang_id]);
				$major_row.push($major['major_name'][$lang_id]);
				$track_row.push($track['track_name']);
			})
		});
	});
	/*$plans.forEach(function($plan) {
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
	});*/
	$rows.push($plan_row);
	$rows.push($major_row);
	$rows.push($track_row);

	drawTable($rows);


	$categories.forEach(function($category){
		$catRow = [];
		if($category['parent_id'] == "0"){
			$_id = $category['_id'];
			//$cat_detail = $all_categories.filter(cat => cat['cat_id'] == $_id && cat['lang_id'] == $lang_id)[0];
			$cat_detail = $category['subjectcategorydesc'];
			$catRow = [$cat_detail['name']];
			drawCatTable($cat_detail);
			$parent_id = $_id;
			$is_leaf = false;
			while(!$is_leaf) {
				$cat_detail = $categories.filter(cat => cat['parent_id'] == $parent_id);
				
				if($cat_detail.length == 0) {
					$is_leaf = true;
					drawLeafTable($parent_id);
				}else {
					for($j = 0; $j < $cat_detail.length; $j++){
						$parent_id = $cat_detail[$j]['_id'];
						$_id = $cat_detail[$j]['_id'];
						//$cat_item = $all_categories.filter(cat => cat['cat_id'] == $_id && cat['lang_id'] == $lang_id)[0];
						$cat_item = $cat_detail[$j]['subjectcategorydesc'];
						drawCatTable($cat_item);
					}
				}
			}
		}
	});
	$selectedRow = "";
	$leaf_id = "";
	$('#course_management tr td').on('click', 'button', function (){
		$selectedRow = $(this).parent().parent();
		$leaf_id = $selectedRow.attr('leaf-id');
		drawCourseTable($courses);
	});

	$('body').on('click', '#course_list .add_course', function (){
		$index = $(this).attr('course-index');
		drawCourse($index, $selectedRow);
	});

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
	$('body').on('click', 'button.remove_course', function (){
		$index = $(this).attr('course-index');
		$selectedCourse[$index] = false;
		$(this).parent().parent().remove();
	});

	$(".export_btn").click(function(e){
		$total = {};
		$total.structure = $structure;
		$total.category = $categories;
		$total.course = $courses;

		$tr_categories = $("#course_management tr.category");
		$cat_val = [];
		for($i = 0; $i < $tr_categories.length; $i++){
			$values = [];
			$td_array = $($tr_categories[$i]).find("td");
			for($j = 1; $j < $td_array.length; $j++){
				$values.push($($($td_array[$j]).find("input")[0]).val());
			}
			$data = {cat_id: $($tr_categories[$i]).attr('cat-id'), cat_name: $($td_array[0]).html(), values: $values};
			$cat_val.push($data);
		}
		$total.cat_val = $cat_val;

		$tr_courses = $("#course_management tr.leaf");
		$course_val = [];
		for($i = 0; $i < $tr_courses.length; $i++){
			$values = [];
			$td_array = $($tr_courses[$i]).find("td");
			for($j = 1; $j < $td_array.length - 1; $j++){
				$values.push($($($td_array[$j]).find("div")[0]).attr('status'));
			}
			$data = {leaf_id: $($tr_courses[$i]).attr('leaf-id'), leaf_name: $($td_array[0]).html(), values: $values, course_id: $($tr_courses[$i]).attr('course-id')};
			$course_val.push($data);
		}
		
		$total.course_val = $course_val;
		$.ajax({ 
		    url: "function.php", 
		    dataType: 'json', 
		    data: {data: $total, method: 'generate'},
		    method: "post",
		    async: false, 
		    success: function(data){ 
		    	console.log(data)
		    } 
		});

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


function drawCatTable($detail) {
	$html = $("#course_management").html();
	$html += "<tr class='category' cat-id='"+$detail['cat_id']+"'>";
	$html += "<td>" + $detail['name'] +"</td>";
	for(var i = 0; i < $tdNum; i++){
		$html += "<td>" + "<input type='text' class='form-control'"+"</td>";
	}
	$html += "</tr>";
	$("#course_management").html($html);
}
function drawLeafTable($parent_id){
	$html = $("#course_management").html();
	$html += "<tr class='course' leaf-id='"+$parent_id+"'>";
	$html += "<td>" + "<button class='btn btn-primary' data-toggle='modal' data-target='#courseModal'>Add Course</button" +"</td>";
	for(var i = 0; i < $tdNum; i++){
		$html += "<td></td>";

	}
	$html += "</tr>";
	$("#course_management").html($html);
}
function drawCourse($index, $obj){
	$course = $courses[$index];
	$selectedCourse[$index] = true;
	$html = "";
	$html += "<tr class='leaf' leaf-id='"+$leaf_id+"' course-id='"+$course['_id']+"'>";
	$html += "<td>" + $course['course_code'] + " "+ $course['name'][$lang_id] + "</td>";
	for(var i = 0; i < $tdNum; i++){
		$html += "<td><div class='cicle' status='blank' style='border: 1px solid #fff; padding: 10px 11px; background: white; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;'></div></td>";
	}
	$html += "<td><button class='btn btn-info remove_course' course-index='"+$index+"'>Remove</button></td>";
	$html += "</tr>";
	$($html).insertBefore($obj);
	$("#courseModal").modal('toggle');

	
}
function drawCourseTable($courses){
	$html = "";
	for($i = 0; $i < $courses.length; $i++){
		$html += "<tr>";
		if($selectedCourse[$i]==false){
			$html += "<td><button type='button' class='btn btn-primary add_course' course-index='"+$i+"'>Add</button></td>";
		} else {
			$html += "<td></td>";
		}
		
		$html += "<td>" + $courses[$i]['course_code'] + "</td>";
		$html += "<td>" + $courses[$i]['name'][$lang_id] + "</td>";
		$html += "</tr>";
	}
	$("#course_list tbody").html($html);
}