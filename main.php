<?php

$config_file = "config.json";

$config = file_get_contents($config_file);
if ($config === false) {
    echo "Cannot read file ".$config_file.", exiting...";
    die();
}

$json_config = json_decode($config, true);
if ($json_config === null) {
    echo "Cannot transform json to array, exiting...";
    die();
}

$servers = $json_config["servers"];
$servers_count = count($servers);

//echo "Found ".$servers_count." nagios servers.\n";

$summary = [];

for($i = 0; $i < $servers_count; $i++){
//    echo "Requesting statuses to ".$servers[$i]["name"]." (".$servers[$i]["host"].")\n";
    $request_url = $servers[$i]["protocol"]."://".$servers[$i]["host"].":".$servers[$i]["port"]."/".$servers[$i]["api_path"];
    $request = file_get_contents($request_url);
    $request_object= json_decode($request, true);
    $request_object["server"] = $servers[$i];
    array_push($summary, $request_object);
}

$summary = json_encode($summary);
echo $summary;

?>