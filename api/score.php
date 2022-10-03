<?php
header('Content-Type: text/plain');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if(!isset($_GET['method'])){
    exit('Malformed request');
}

$method = $_GET['method'];

if($method == 'read'){
    echo file_get_contents('score.txt');
    exit();
}else if($method == 'clear' or $method == 'reset'){
    file_put_contents('score.txt', '');
    exit('OK');
}else if($method == 'register' or $method == 'add'){
    if(!isset($_GET['user']) or !isset($_GET['score']) or !isset($_GET['time'])){
        exit('Malformed request');
    }
    $user = $_GET[ 'user'];
    $score = $_GET['score'];
    $time = $_GET[ 'time'];
    $newLine = "$user,$score,$time";

    $lines = explode("\n", file_get_contents('score.txt'));
    $newLines = array();
    $found = false;

    foreach($lines as $line){
        $parts = explode(',', $line);

        if($parts[0] == $user){
            array_push($newLines, $newLine);
            $found = true;
        }else{
            if(strlen($line) > 2) array_push($newLines, $line);
        }
    }

    if(!$found) array_push($newLines, $newLine);

    $newContent = implode("\n", $newLines);
    file_put_contents('score.txt', $newContent);

    exit('OK');
}