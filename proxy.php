<?php
// Cambia por tu API Key de NewsAPI
$apiKey = "fbc9235a922348bd833eaf0e8f0aa106";

// Endpoint de NewsAPI (Top headlines de México)
$url = "https://newsapi.org/v2/top-headlines?country=mx&apiKey=$apiKey";

// Usamos cURL para hacer la petición
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["status" => "error", "message" => curl_error($ch)]);
} else {
    header("Content-Type: application/json");
    echo $response;
}

curl_close($ch);
?>
