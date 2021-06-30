<?php
$command = $_POST['command'];
require('db.php');
$command = explode(",", $command);
if ($command[0] === "0") {
    $localIP = $command[1];
    $sql= "SELECT * FROM `log` WHERE ipTo ='$localIP'";
    $query = $conn->query($sql);

    while($row = mysqli_fetch_assoc($query)){
        $logs[] = $row;
    }

    $Logs = ['logs' => $logs, 'rANDl' => 'false'];
    echo json_encode($Logs);
} else {
    //make remote and local log $command[0] = defender ip and $command[1] = attacker ip
    $attackerIP = $command[1];
    $defenderIP = $command[0];
    $sql_L= "SELECT * FROM `log` WHERE ipTo ='$attackerIP'";
    $sql_R= "SELECT * FROM `log` WHERE ipTo ='$defenderIP'";
    $query1 = $conn->query($sql_L);
    $query2 = $conn->query($sql_R);

    while($row = mysqli_fetch_assoc($query1)){
        $logsL[] = $row;
    }
    while($row = mysqli_fetch_assoc($query2)){
        $logsR[] = $row;
    }

    $Logs = ['logsL' => $logsL,'logsR' => $logsR, 'rANDl' => 'true'];
    echo json_encode($Logs);
}
?>