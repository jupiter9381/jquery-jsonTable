<?php 
	if($_POST['method'] == 'generate') {
		$table_data = $_POST['data'];

		$data = array();
		array_push($data, $table_data);
		$fp = fopen('results.json', 'w');
		fwrite($fp, json_encode($data));
		fclose($fp);
		echo json_encode(array("result" => "success"));
	}

	if($_POST['method'] == 'lo_generate') {
		$table_data = $_POST['data'];

		$data = array();
		array_push($data, $table_data);
		$fp = fopen('lo_results.json', 'w');
		fwrite($fp, json_encode($data));
		fclose($fp);
		echo json_encode(array("result" => "success"));
	}
?>