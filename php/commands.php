<?php

session_start();

// if(isset($_SESSION['id']) ){
// 	header("Location: /");
// }

require 'db.php';

$name = $_SESSION['username'];
$command = $_POST['command'];
// $echo = ['command' => $command, 'test' => $test];
// echo json_encode($echo);

if (strpos($command, 'connect') === 0 && preg_match('~[0-9]+~', $command)) {
    if ($conn->connect_error) {die("Connection failed: " . $conn->connect_error);}
    $commandIP = trim(str_replace("connect", "", $command));
    $sql= "SELECT id,ip FROM users WHERE ip ='$commandIP'";
    $sql_u = "SELECT id,ip FROM users WHERE username='$name'";
    $query1 = $conn->query($sql_u);
    $query2 = $conn->query($sql);

    while($result1 = $query1->fetch_assoc()){
        $currentIP = $result1['ip'];
        $myID = $result1['id'];
    }
    while($result2 = $query2->fetch_assoc()){
        $IP = $result2['ip'];
        $DefID = $result2['id'];
    }

    if ($currentIP === $IP) {
        $valid = 'no';
        $access = "bash: " . $IP . ": You already have access to your own ip<br><br>";
    } else if ($IP != "") {
        $valid = 'yes';

        $sql4 = "SELECT `level` FROM filesystem WHERE `location` = '$DefID' AND `type` = 'firewall'";
        $query4 = $conn->query($sql4);
        $firewalls = array();
        while($result1 = $query4->fetch_assoc()){
            array_push($firewalls, intval($result1['level']));
        }
        $firewall = max($firewalls);
        if (empty($firewall)) {$firewall = 0;}
        $sql3 = "SELECT `level` FROM filesystem WHERE `location` = '$myID' AND `type` = 'waterwall'";
        $query3 = $conn->query($sql3);
        $waterwalls = array();
        while($result2 = $query3->fetch_assoc()){
            array_push($waterwalls, intval($result2['level']));
        }
        $waterwall = max($waterwalls);
        if (empty($waterwall)) {$waterwall = 0;}
        
        if ($firewall <= $waterwall) {
            $date = date("m-d-y H:m:s");
            $query3 = "INSERT INTO `log`(`id`, `logType`, `info`, `LoggedIP`, `ipTo`, `currentDate`) VALUES (DEFAULT,'Auth','Warning: A unknown ip has connected to the server','$currentIP','$IP',CURRENT_TIMESTAMP());";
            $query3 .= "INSERT INTO `log`(`id`, `logType`, `info`, `LoggedIP`, `ipTo`, `currentDate`) VALUES (DEFAULT,'server connect','Successfully established a connection to $IP','localhost','$currentIP',CURRENT_TIMESTAMP());";
            $query3 .= "UPDATE users SET ConnTo = '$IP' WHERE ip = '$currentIP'";
            if (mysqli_multi_query($conn, $query3)) {
                $access = "bash: " . $IP . ": connection established<br><br>";
            } else {
                $access = "Error: " . $query3 . "<br>" . mysqli_error($conn);
            }
        } else {
            $valid = 'no';
            $access = "Access denied<br><br>";
        }
    } else {
        $valid = 'no';
        $access = "bash: " + $IP + ": Invalid IP<br><br>";
    }

    $echo = ['command' => "connect", 'ip' => $IP, 'valid' => $valid, 'access' => $access];
    echo json_encode($echo);

} else if (strpos($command, 'ls') === 0) {
    if ($conn->connect_error) {die("Connection failed: " . $conn->connect_error);}
    $sql1= "SELECT id,ConnTo FROM users WHERE username = '$name'";
    $query = $conn->query($sql1);
    while($result = $query->fetch_assoc()){
        $command = $result['ConnTo'];
        $myID = $result['id'];
    }
    if (preg_match('~[0-9]+~', $command)) {
        $sql1= "SELECT id FROM users WHERE ip = '$command'";
        $query1 = $conn->query($sql1);
        while($result1 = $query1->fetch_assoc()){
            $connID = $result1['id'];
        }
        $sql= "SELECT * FROM filesystem WHERE `location` = '$connID'";
    } else {
        $sql= "SELECT * FROM filesystem WHERE `location` = '$myID'";
    }
    $query2 = $conn->query($sql);
    $files = array();
    while($result = $query2->fetch_assoc()){
        array_push($files, $result);
    }

    $echo = ['command' => 'ls', 'files' => $files];
    echo json_encode($echo);
    
} else if (strpos($command, 'bye') === 0) {
    $sql_u = "SELECT ip FROM users WHERE username='$name'";
    $query1 = $conn->query($sql_u);
    while($result1 = $query1->fetch_assoc()){
        $currentIP = $result1['ip'];
    }

    $query = "UPDATE users SET ConnTo = Null WHERE ip = '$currentIP'";
    if (mysqli_query($conn, $query)) {
        //pass
    } else {
        echo "Error: " . $query . "<br>" . mysqli_error($conn);
    }
    
    $echo = ['command' => 'bye'];
    echo json_encode($echo);

} else if (strpos($command, 'rm') === 0 || strpos($command, 'remove') === 0 || strpos($command, 'rmid') === 0 || strpos($command, 'removeid') === 0 || strpos($command, 'deleteid') === 0) {
    $sql = "SELECT ConnTo FROM users WHERE username = '$name'";
    $query = $conn->query($sql);
    while($result = $query->fetch_assoc()){
        $connTo = $result['ConnTo'];
    }

    if (strpos($command, 'rmid') === 0 || strpos($command, 'removeid') === 0 || strpos($command, 'deleteid') === 0) {
        $commands = array('rmid', 'removeid', 'deleteid');
        $rm = trim(strtolower(str_replace($commands, '', $command)));

        if ($connTo != Null) {
            $sql1 = "SELECT id FROM users WHERE ip ='$connTo'";
            $query1 = $conn->query($sql1);
            while($result1 = $query1->fetch_assoc()){
                $DefID = $result1['id'];
            }

            $sql2 = "SELECT `level` FROM filesystem WHERE `location` = '$DefID' AND `id` = '$rm'";
            $query2 = $conn->query($sql2);
            $fileExist = array();
            while($result2 = $query2->fetch_assoc()){
                array_push($fileExist, intval($result2['level']));
            }
            if (sizeof($fileExist) < 1) {
                $fileExist = "There is no file with the id of " . $rm;
            } else {
                $query3 = "DELETE FROM `filesystem` WHERE `location` = '$DefID' AND `id` = '$rm'";
                if (mysqli_query($conn, $query3)) {
                    $fileExist = $rm . " has been deleted";
                } else {
                    $fileExist = "Error: " . $query3 . "<br>" . mysqli_error($conn);
                }
            }
        } else {
            $sql1 = "SELECT id FROM users WHERE username = '$name'";
            $query1 = $conn->query($sql1);
            while($result1 = $query1->fetch_assoc()){
                $myID = $result1['id'];
            }

            $sql2 = "SELECT `name` FROM filesystem WHERE `location` = '$myID' AND id = '$rm'";
            $query2 = $conn->query($sql2);
            $fileExist = array();
            while($result2 = $query2->fetch_assoc()){
                array_push($fileExist, intval($result2));
            }

            if (sizeof($fileExist) < 1) {
                $fileExist = "There is no file with the id of " . $rm;
            } else {
                $query3 = "DELETE FROM `filesystem` WHERE `location` = '$myID' AND `id` = '$rm'";
                if (mysqli_query($conn, $query3)) {
                    $fileExist = $rm . " has been deleted";
                } else {
                    $fileExist = "Error: " . $query3 . "<br>" . mysqli_error($conn);
                }
            }
        }
    } else {
        $commands = array('rm', 'remove', 'delete');
        $rm = trim(strtolower(str_replace($commands, '', $command)));

        if ($connTo != Null) {
            $sql1 = "SELECT id FROM users WHERE ip ='$connTo'";
            $query1 = $conn->query($sql1);
            while($result1 = $query1->fetch_assoc()){
                $DefID = $result1['id'];
            }
            $sql2 = "SELECT * FROM filesystem WHERE `location` = '$DefID' AND `name` = '$rm'";
            $query2 = $conn->query($sql2);
            $fileExist = array();
            while($result2 = $query2->fetch_assoc()){
                array_push($fileExist, intval($result2));
            }
            if (sizeof($fileExist) > 1) {
                $fileExist = "There is more then 1 file named " . $rm;
            } else if (sizeof($fileExist) < 1) {
                $fileExist = "The file " . $rm . " dosen't exist";
            } else {
                $query3 = "DELETE FROM `filesystem` WHERE `location` = '$DefID' AND `name` = '$rm'";
                if (mysqli_query($conn, $query3)) {
                    $fileExist = $rm . " has been deleted";
                } else {
                    $fileExist = "Error: " . $query3 . "<br>" . mysqli_error($conn);
                }
            }
        } else {
            $sql1 = "SELECT id FROM users WHERE username = '$name'";
            $query1 = $conn->query($sql1);
            while($result1 = $query1->fetch_assoc()){
                $myID = $result1['id'];
            }

            $sql2 = "SELECT `name` FROM filesystem WHERE `location` = '$myID' AND `name` = '$rm'";
            $query2 = $conn->query($sql2);
            $fileExist = array();
            while($result2 = $query2->fetch_assoc()){
                array_push($fileExist, intval($result2));
            }

            if (sizeof($fileExist) > 1) {
                $fileExist = "There is more then 1 file named " . $rm;
            } else if (sizeof($fileExist) < 1) {
                $fileExist = "The file " . $rm . " dosen't exist";
            } else {
                $query3 = "DELETE FROM `filesystem` WHERE `location` = '$myID' AND `name` = '$rm'";
                if (mysqli_query($conn, $query3)) {
                    $fileExist = $rm . " has been deleted";
                } else {
                    $fileExist = "Error: " . $query3 . "<br>" . mysqli_error($conn);
                }
            }
        }
    }
    $echo = ['command' => 'rm', 'fileExist' => $fileExist];
    echo json_encode($echo);
} else if (strpos($command, 'ul') === 0 || strpos($command, 'upload') === 0 || strpos($command, 'ulid') === 0 || strpos($command, 'uploadid') === 0) {
    $sql = "SELECT id,ConnTo FROM users WHERE username='$name'";
    $query = $conn->query($sql);
    while($result = $query->fetch_assoc()){
        $myID = $result['id'];
        $connTo = $result['ConnTo'];
    }
    if (strpos($command, 'ulid') === 0 || strpos($command, 'uploadid') === 0) {
        $commands = array('ulid', 'uploadid');
        $ul = trim(strtolower(str_replace($commands, '', $command)));

        if ($connTo === Null) {
            $upload = "You are not currently connected to anyone";
        } else {
            $sql1 = "SELECT `name`,`level`,size,`type` FROM filesystem WHERE `location` = '$myID' AND `id` = '$ul'";
            $query1 = $conn->query($sql1);
            $fileExist = array();
            while($result1 = $query1->fetch_assoc()){
                array_push($fileExist, intval($result1['level']));
                $fileName = $result1['name'];
                $fileType = $result1['type'];
                $fileLevel = $result1['level'];
                $fileSize = $result1['size'];
            }
            if (count($fileExist) > 1) {
                $upload = "There is more then 1 file named " . $ul;
            } else if (count($fileExist) < 1) {
                $upload = "The file " . $ul . " dosen't exist";
            } else {
                $sql2 = "SELECT id FROM users WHERE ip ='$connTo'";
                $query2 = $conn->query($sql2);
                while($result2 = $query2->fetch_assoc()){
                    $DefID = $result2['id'];
                }
                $sql3 = "SELECT `level` FROM filesystem WHERE `location` = '$DefID' AND `name` = '$fileName'";
                $query3 = $conn->query($sql3);
                $fileExist1 =  array();
                while($result3 = $query3->fetch_assoc()){
                    array_push($fileExist1, intval($result3['level']));
                }
                if (empty($fileExist1) || !in_array($fileExist[0], $fileExist1)) {
                    $query4 = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
                    VALUES (DEFAULT, '$myID', '$fileName', '$fileType', '$fileLevel', '$fileSize', '$DefID')";
                    if (mysqli_multi_query($conn, $query4)) {
                        $upload = "success";
                    } else {
                        $upload = "Error: " . $query4 . "<br>" . mysqli_error($conn);
                    }
                } else {
                    $upload = "The person you are trying to upload to already has " . $fileName;
                }
            }
        }
    } else if (strpos($command, 'ul') === 0 || strpos($command, 'upload') === 0) {
        $commands = array('ul', 'upload');
        $ul = trim(strtolower(str_replace($commands, '', $command)));

        if ($connTo === Null) {
            $upload = "You are not currently connected to anyone";
        } else {
            $sql1 = "SELECT `name`,`level`,size,`type` FROM filesystem WHERE `location` = '$myID' AND `name` = '$ul'";
            $query1 = $conn->query($sql1);
            $fileExist = array();
            while($result1 = $query1->fetch_assoc()){
                array_push($fileExist, intval($result1['level']));
                $fileType = $result1['type'];
                $fileLevel = $result1['level'];
                $fileSize = $result1['size'];
            }
            if (count($fileExist) > 1) {
                $upload = "There is more then 1 file named " . $ul;
            } else if (count($fileExist) < 1) {
                $upload = "The file " . $ul . " dosen't exist";
            } else {
                $sql2 = "SELECT id FROM users WHERE ip ='$connTo'";
                $query2 = $conn->query($sql2);
                while($result2 = $query2->fetch_assoc()){
                    $DefID = $result2['id'];
                }
                $sql3 = "SELECT `level` FROM filesystem WHERE `location` = '$DefID' AND `name` = '$ul'";
                $query3 = $conn->query($sql3);
                $fileExist1 =  array();
                while($result3 = $query3->fetch_assoc()){
                    array_push($fileExist1, intval($result3['level']));
                }
                if (empty($fileExist1) || !in_array($fileExist[0], $fileExist1)) {
                    $query4 = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
                    VALUES (DEFAULT, '$myID', '$ul', '$fileType', '$fileLevel', '$fileSize', '$DefID')";
                    if (mysqli_multi_query($conn, $query4)) {
                        $upload = "success";
                    } else {
                        $upload = "Error: " . $query4 . "<br>" . mysqli_error($conn);
                    }
                } else {
                    $upload = "The person you are trying to upload to already has " . $ul;
                }
            }
        }
    }
    $echo = ['command' => 'ul', 'upload' => $upload];
    echo json_encode($echo);
} else if (strpos($command, 'dl') === 0 || strpos($command, 'download') === 0) {
    $commands = array('dl', 'download');
    $dl = trim(strtolower(str_replace($commands, '', $command)));
    if ($dl === "firewall" || $dl === "waterwall" || $dl === "antivirus" || $dl === "malware") {
        $sql = "SELECT ConnTo FROM users WHERE username='$name'";
        $query = $conn->query($sql);
        while($result = $query->fetch_assoc()){
            $connTo = $result['ConnTo'];
        }

        if ($connTo === Null) {
            $download = "You are not currently connected to anyone";
        } else {
            $sql2 = "SELECT username FROM users WHERE ip ='$connTo'";
            $query2 = $conn->query($sql2);
            while($result2 = $query2->fetch_assoc()){
                $connToName = $result2['username'];
            }
            $sql1 = "SELECT $dl FROM filesystem WHERE username = '$connToName'";
            $query1 = $conn->query($sql1);
            while($result1 = $query1->fetch_assoc()){
                $fileExist = $result1["$dl"];
            }
            if (strval($fileExist) != "0") {
                $sql3 = "SELECT $dl FROM filesystem WHERE username = '$name'";
                $query3 = $conn->query($sql3);
                while($result3 = $query3->fetch_assoc()){
                    $fileExist1 = $result3["$dl"];
                }
                if (intval($fileExist) > intval($fileExist1)) {
                    $query4 = "UPDATE filesystem SET $dl = '$fileExist' WHERE username = '$name'";
                    if (mysqli_query($conn, $query4)) {
                        $download = $dl . " has been downloaded";
                    } else {
                        $download = "Error: " . $query4 . "<br>" . mysqli_error($conn);
                    }
                } else {
                    $download = "You already have a greater virsion of that file";
                }
            } else {
                $download = "The file you are trying to download does not exist";
            }
        }
    }
    $echo = ['command' => 'dl', 'download' => $download];
    echo json_encode($echo);
} else if (strpos($command, 'whois') === 0) {
    $whois = trim(strtolower(str_replace('whois', '', $command)));
    if (preg_match('~[0-9]+~', $whois)) {
        $sql= "SELECT * FROM users WHERE ip ='$whois'";
        $query = $conn->query($sql);
    
        while($result = $query->fetch_assoc()){
            $username = $result['username'];
            $ActivationDate = $result['ActivationDate'];
            $ConnTo = $result['ConnTo'];
        }
        if ($username != "" && $ActivationDate != "") {
            if ($ConnTo === Null) {$ConnTo = "No one";}
            $echo = ['command' => "whois", 'whois' => 'Username: ' . $username . '<br>Activation Date: ' . $ActivationDate . '<br>ConnTo: ' . $ConnTo];
            echo json_encode($echo);
        } else {
            $echo = ['command' => "whois", 'whois' => 'Invalid IP'];
            echo json_encode($echo);
        }
    } else {
        $sql= "SELECT * FROM users WHERE username ='$name'";
        $query = $conn->query($sql);
    
        while($result = $query->fetch_assoc()){
            $username = $result['username'];
            $ActivationDate = $result['ActivationDate'];
            $ConnTo = $result['ConnTo'];
        }

        if ($ConnTo === Null) {$ConnTo = "No one";}
        $echo = ['command' => 'whois', 'whois' => 'Username: ' . $username . '<br>Activation Date: ' . $ActivationDate . '<br>ConnTo: ' . $ConnTo];
        echo json_encode($echo);
    }
} else if (strpos($command, 'gen npc') === 0) {
    $NpcName = 'NPC_' . trim(str_replace('gen npc', '', $command));
    if (str_replace('NPC_', '', $NpcName) != "") {
        $randIP = mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255);
        $date = date("y-m-d H:m:s");
        $currentIP = $randIP;
        $query = "INSERT INTO users (id, username, ActivationDate, ip) 
        VALUES (DEFAULT, '$NpcName', '$date', '$randIP');";
        $query .= "INSERT INTO filesystem (id, username, firewall, waterwall, antivirus, malware) 
        VALUES (DEFAULT, '$NpcName', '1', '1', '0', '0')";
        if (mysqli_multi_query($conn, $query)) {
            $echo = ['command' => 'gen npc', 'npc' => "made npc successfully"];
            echo json_encode($echo);
        } else {
            $echo = ['command' => 'gen npc', 'npc' => "Error: " . $query . "<br>" . mysqli_error($conn)];
            echo json_encode($echo);
        }
    } else {
        $echo = ['command' => 'gen npc', 'npc' => "smh"];
        echo json_encode($echo);
    }
} else if (strpos($command, 'recovery') === 0) {
    $sql = "SELECT id FROM users WHERE username='$name'";
    $query = $conn->query($sql);
    while($result = $query->fetch_assoc()){
        $myID = $result['id'];
    }

    $sql1 = "SELECT `type`,`level` FROM filesystem WHERE `location` = '$myID' AND `type` = 'firewall'";
    $query1 = $conn->query($sql1);
    while($result1 = $query1->fetch_assoc()){
        $firewall = $result1;
    }

    $sql2 = "SELECT `type`,`level` FROM filesystem WHERE `location` = '$myID' AND `type` = 'waterwall'";
    $query2 = $conn->query($sql2);
    while($result2 = $query2->fetch_assoc()){
        $waterwall = $result2;
    }

    $recovery = "";
    if (empty($waterwall)) {
        $query3 = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
        VALUES (DEFAULT, '0', 'waterwall', 'waterwall', '1', '1', '$myID')";
        if (mysqli_multi_query($conn, $query3)) {
            $recovery = "recoverd waterwall";
        } else {
            $recovery = "Error: " . $query3 . "<br>" . mysqli_error($conn);
        }
    }
    if (empty($firewall)) {
        $query4 = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
        VALUES (DEFAULT, '0', 'firewall', 'firewall', '1', '1', '$myID');";
        if (mysqli_multi_query($conn, $query4)) {
            if($recovery === "") {
                $recovery = "recoverd firewall";
            } else {
                $recovery = "recoverd firewall and waterwall";
            }
        } else {
            $recovery = "Error: " . $query4 . "<br>" . mysqli_error($conn);
        }
    }
    if ($recovery === "") {
        $recovery = "recovered nothing";
    }
    $echo = ['command' => 'recovery', 'recovery' => $recovery];
    echo json_encode($echo);
    
} else if (strpos($command, 'blackmarket') === 0) {
    $sql= "SELECT * FROM market";
    $query = $conn->query($sql);
    $selling = Array();

    while($result = $query->fetch_assoc()){
        array_push($selling, $result['Name'], $result['Price'], $result['Amount']);
    }

    $echo = ['command' => 'blackmarket', 'selling' => $selling];
    echo json_encode($echo);
} else if (strpos($command, 'Buy=') === 0) {
    $command = trim(str_replace("Buy=", "", $command));
    $command = explode(",", $command);
    $Name = $command[0];
    $reAmount = $command[1];
    $sql= "SELECT * FROM market WHERE `Name` = '$Name'";
    $query = $conn->query($sql);

    while($result = $query->fetch_assoc()){
        $ItemMax = $result['Amount'];
        $ItemPrice = $result['Price'];
    }

    $AmountAfter = $ItemMax - $reAmount;
    if ($AmountAfter < 0) {
        $echo = ['command' => 'buy', 'success' => 'no', 'name' => $Name, 'amount' => $reAmount];
    } else {
        $query1= "UPDATE market SET Amount = '$AmountAfter' WHERE `Name` = '$Name'";
        if (mysqli_query($conn, $query1)) {
            $error = "None";
        } else {
            $error = "SQL Error: " . $query1 . "<br>" . mysqli_error($conn);
        }
        $echo = ['command' => 'buy', 'error' => $error, 'success' => 'yes', 'name' => $Name, 'amount' => $reAmount];
    }
    echo json_encode($echo);
}
$conn->close();
?>