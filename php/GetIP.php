<?php
$name = $userInfo['nickname'];

require('db.php');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql_u = "SELECT * FROM users WHERE username='$name'";
$res_u = mysqli_query($conn, $sql_u);
  
if (mysqli_num_rows($res_u) > 0) {
    $query = $conn->query($sql_u);
    while($result = $query->fetch_assoc()){
        $currentIP = $result['ip'];
    }
} else {
    $randIP = mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255);
    $date = date("y-m-d H:m:s");
    $currentIP = $randIP;
    $query = "INSERT INTO users (id, username, ActivationDate, ip, ConnTo) 
    VALUES (DEFAULT, '$name', '$date', '$randIP', Null)";
    if (mysqli_query($conn, $query)) {
            //pass
    } else {
        echo "Error: " . $query . "<br>" . mysqli_error($conn);
    }
    $sql1 = "SELECT id FROM users WHERE username='$name'";
    $query = $conn->query($sql1);
    while($result = $query->fetch_assoc()){
        $myID = $result['id'];
    }
    $query1 = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
    VALUES (DEFAULT, '0', 'firewall', 'firewall', '1', '1', '$myID');";
    $query1 .= "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
    VALUES (DEFAULT, '0', 'waterwall', 'waterwall', '1', '1', '$myID');";
    if (mysqli_multi_query($conn, $query1)) {
        //pass
    } else {
        echo "Error: " . $query1 . "<br>" . mysqli_error($conn);
    }
}

$conn->close();
?>