$(document).ready(function(e){

	var $categories = [];
	var plans = [];

	$lang_id = 1;
 	
	$table_data = ajaxCall("results.json");
	$table_data = $table_data[0];

 	$all_categories = $table_data['all_categories'];
 	$categories = $table_data['category'];
	$plans = $table_data['plan'];
	$majors = $table_data['major'];
	$tracks = $table_data['track'];
	$courses = $table_data['course'];

	$cat_val = $table_data['cat_val'];

	$course_val = $table_data['course_val'];
	$selectedCourse = [];
	$courses.forEach(function($course){$selectedCourse.push(false)});

	$course_values = [];

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

			$index = $cat_val.findIndex($val => $val['cat_id'] == $cat_detail['cat_id']);

			drawCatTable($cat_detail, $cat_val[$index]);
			$parent_id = $_id;
			$is_leaf = false;
			while(!$is_leaf) {
				$cat_detail = $categories.filter(cat => cat['parent_id'] == $parent_id);
				if($cat_detail.length == 0) {
					$is_leaf = true;
					$course_rows = $course_val.filter($course => $course['leaf_id'] == $parent_id);
					$course_rows.forEach(function($item){
						drawExistingLeafTable($item);
					});
					drawLeafTable($parent_id);
				}else {
					for($j = 0; $j < $cat_detail.length; $j++){
						$parent_id = $cat_detail[$j]['_id'];
						$_id = $cat_detail[$j]['_id'];
						$cat_item = $all_categories.filter(cat => cat['cat_id'] == $_id && cat['lang_id'] == $lang_id)[0];
						$index = $cat_val.findIndex($val => $val['cat_id'] == $cat_item['cat_id']);
						drawCatTable($cat_item, $cat_val[$index]);
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
		$total.plan = $plans;
		$total.major = $majors;
		$total.track = $tracks;
		$total.category = $categories;
		$total.all_categories = $all_categories;
		
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
			$data = {leaf_id: $($tr_categories[$i]).attr('cat-id'), leaf_name: $($td_array[0]).html(), values: $values};
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


function drawCatTable($detail, $cat_val) {
	$html = $("#course_management").html();
	$html += "<tr class='category' cat-id='"+$detail['cat_id']+"'>";
	$html += "<td>" + $detail['name'] +"</td>";
	for(var i = 0; i < $tdNum; i++){
		$html += "<td>" + "<input type='text' class='form-control' value='"+$cat_val['values'][i]+"'"+"</td>";
	}
	$html += "</tr>";
	$("#course_management").html($html);
}
function drawExistingLeafTable($item) {
	$course = $item;
	$course_id = $item['course_id'];
	$leaf_id = $item['lead_id'];
	$values = $item['values'];
	//$index = $courses.filter(course => cat['cat_id'] == $_id && cat['lang_id'] == $lang_id)[0];
	$index = $courses.findIndex(course => course['_id'] == $course_id);
	$selectedCourse[$index] = true;
	$course = $courses[$index];
	$html = $("#course_management").html();
	$html += "<tr class='leaf' leaf-id='"+$leaf_id+"' course-id='"+$course_id+"'>";
	$html += "<td>" + $course['course_code'] + " "+ $course['name'][$lang_id] + "</td>";
	for(var i = 0; i < $tdNum; i++){
		if($values[i] == 'black'){
			$html += "<td><div class='cicle' status='blank' style='border: 1px solid #fff; padding: 10px 11px; background: black; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;'></div></td>";
		} else if ($values[i] == "white") {
			$html += "<td><div class='cicle' status='blank' style='border: 1px solid #000; padding: 10px 11px; background: white; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;'></div></td>";
		} else if($values[i] == "grey") {
			$html += "<td><div class='cicle' status='blank' style='border: 1px solid #000; padding: 10px 11px; background: grey; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;'></div></td>";
		} else if ($values[i] == "blank") {
			$html += "<td><div class='cicle' status='blank' style='border: 1px solid #fff; padding: 10px 11px; background: white; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;'></div></td>";
		}
		
	}
	$html += "<td><button class='btn btn-info remove_course' course-index='"+$index+"'>Remove</button></td>";
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
	$html += "<tr class='leaf' leaf-id='"+$leaf_id+"'>";
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