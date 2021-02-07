<?php

$folder = "/var/www/html/zavodil.ru/akash/memes/";
$url = "https://akash.zavodil.ru/memes/";

$img = $_POST['imgBase64'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);

//saving
$year = date("Y");
$month = date("m");
$filename_year = $folder . $year;
$filename_year_month = $folder . $year . "/" . $month;

if (!file_exists($filename_year))
    mkdir($filename_year, 0777);
if (!file_exists($filename_year_month))
    mkdir($filename_year_month, 0777);

$fileName = time() . '.png';
file_put_contents($filename_year_month . "/" . $fileName, $fileData);

echo $url . $year . "/" . $month . "/" . $fileName;