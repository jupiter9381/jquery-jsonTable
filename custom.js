$(document).ready(function(e){

	var $categories = [];
	var plans = [];

	$.getJSON("/course_table_json/category.json", function(data) {
		$category = data;
	});

	$.getJSON("/course_table_json/structure_plan.json", function(data) {
		$plans = data;
		console.log($plans);
	});
});