$(document).ready(function(e){

	var $categories = [];
	var plans = [];

 	
 	$categories = ajaxCall("/course_table_json/category.json");
	$plans = ajaxCall("/course_table_json/structure_plan.json");
	$majors = ajaxCall("/course_table_json/structure_major.json");
	$tracks = ajaxCall("/course_table_json/structure_track.json");

	$plans.forEach(function($plan) {
		console.log($plan);
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