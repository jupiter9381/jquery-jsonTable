$(document).ready(function(){
	$data = ajaxCall("course_table_json/lo.json");

	$lang = 'de';
	$leftColumns = $data['left_data'];
	$topColumns = $data['top_data'];

	$topData = [];
	$tdNum = 0;
	$topColumns.forEach($top => { 

		$name = $top['sname'][$lang];

		$details = $top['detail']['outcome_one'];
		$top_detail = [];
		$details.forEach(($detail, $key) => {
			$top_detail.push({'name': $detail[$lang], 'lid': $top['lid'], '_id': $top['_id'], 'index': $tdNum});
			$tdNum++;
		})
		$topData.push({'name': $name, 'detail': $top_detail});
	});

	$leftData = [];
	$leftColumns.forEach($left => {
		$name = $left['sname'][$lang];
		$leftData.push({'name': $name, 'lid': $left['lid'], '_id': $left['_id']});
	});
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

	$(".export_btn").click(function(e){
		$total = {};
		$total.left_data = $leftColumns;
		$total.top_data = $topColumns;

		$tr_leaf = $("#lo_management tr.leaf");
		$lo_val = [];
		for($i = 0; $i < $tr_leaf.length; $i++){
			$td_array = $($tr_leaf[$i]).find("td");
			for($j = 1; $j < $td_array.length; $j++){
				$status = $($($td_array[$j]).find("div")[0]).attr('status');
				$top_lid = $($($td_array[$j]).find("div")[0]).attr('top-lid');
				$top_id = $($($td_array[$j]).find("div")[0]).attr('top-id');
				$left_lid = $($($td_array[$j]).find("div")[0]).attr('left-lid');
				$left_id = $($($td_array[$j]).find("div")[0]).attr('left-id');
				$index = $($($td_array[$j]).find("div")[0]).attr('top-index');
				
				if($status == "blank") {
					$val = 0;
				} else if ($status == "black") {
					$val = 1;
				} else if ($status == "grey") {
					$val = 2;
				} else {
					$val = 3;
				}
				$item = {
					"abet_lo_id": $left_lid,
					"abet_skill_id": $left_id,
					"ohec_lo_id": $top_lid,
					"ohec_skill_id": $top_id,
					"ohec_outcome_index": $index,
					"value": $val
				};
				$lo_val.push($item);
			}
		}
		$total.mapping_data = $lo_val;
		$.ajax({ 
		    url: "function.php", 
		    dataType: 'json', 
		    data: {data: $total, method: 'lo_generate'},
		    method: "post",
		    async: false, 
		    success: function(data){ 
		    	console.log(data)
		    } 
		});
	});

});

function drawBody($leftData) {
	$html = $("#lo_management tbody").html();

	console.log($topData);
	$leftData.forEach($left => {
		$html += "<tr class='leaf'>";
		$html += "<td>"+$left['name']+"</td>";
		$topData.forEach($top => {
			$top['detail'].forEach($detail => {
				$html += "<td><div class='cicle' status='blank' style='border: 1px solid #fff; padding: 10px 11px; background: white; border-radius: 50%; margin-left: auto; margin-right: auto; width: 1%;' top-lid='"+$detail['lid']+"' top-id='"+$detail['_id']+"' left-lid='"+$left['lid']+"' left-id='"+$left['_id']+"' top-index='"+$detail['index']+"'></div></td>";
			});
		});
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
			$html += "<td>"+$detail['name']+"</td>";	
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