<?php

session_start();

// if(isset($_SESSION['id']) ){
// 	header("Location: /");
// }

require 'db.php';

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
  
$name = $_SESSION['username'];
$command = $_POST['command'];

$randIP = mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255);
$sql= "UPDATE users SET ip= '$randIP' WHERE username= '$name'";
$newIP = $randIP;

if ($conn->query($sql) === TRUE) {
    $echo = ['command' => $command, 'currentIP' => $newIP];
    echo json_encode($echo);
} else {
    echo "Error updating record: " . $conn->error;
}

$conn->close();
?>