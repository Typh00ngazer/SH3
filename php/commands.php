<?php

session_start();

require 'db.php';

$name = $_SESSION['username'];
$myID = $_SESSION['id'];
$command = $_POST['command'];

if (strpos($command, 'connect') === 0 && preg_match('~[0-9]+~', $command)) {
    if ($conn->connect_error) {die("Connection failed: " . $conn->connect_error);}
    $commandIP = trim(str_replace("connect", "", $command));
    $sql1 = "SELECT id,ip FROM users WHERE ip ='$commandIP'";
    $sql2 = "SELECT ip FROM users WHERE username='$name'";
    $sql3 = "SELECT `Name`,IP FROM NPC WHERE `IP`='$commandIP'";
    $query1 = $conn->query($sql1);
    $query2 = $conn->query($sql2);
    $query3 = $conn->query($sql3);

    while($result1 = $query1->fetch_assoc()){
        $IP = $result1['ip'];
        $DefID = $result1['id'];
    }

    while($result2 = $query2->fetch_assoc()){
        $currentIP = $result2['ip'];
    }

    while($result3 = $query3->fetch_assoc()){
        $IP = $result3['IP'];
        $DefID = $result3['Name'];
    }

    if (isset($IP) && $currentIP === $IP) {
        $valid = 'no';
        $access = "bash: " . $IP . ": You already have access to your own ip<br><br>";
    } else if (isset($IP)) {
        $valid = 'yes';

        $sql = "SELECT `level` FROM filesystem WHERE `location` = '$DefID' AND `type` = 'firewall'";
        $query = $conn->query($sql);
        $firewalls = array();
        while($result = $query->fetch_assoc()){
            array_push($firewalls, intval($result['level']));
        }
        if (empty($firewall)) {
            $firewall = 0;
        } else {
            $firewall = max($firewalls);
        }
        $sql = "SELECT `level` FROM filesystem WHERE `location` = '$myID' AND `type` = 'waterwall'";
        $query = $conn->query($sql);
        $waterwalls = array();
        while($result = $query->fetch_assoc()){
            array_push($waterwalls, intval($result['level']));
        }
        if (empty($waterwall)) {
            $waterwall = 0;
        } else {
            $waterwall = max($waterwalls);
        }
        
        if ($firewall <= $waterwall) {
            $date = date("m-d-y H:m:s");
            $query3 = "INSERT INTO `log`(`id`, `logType`, `info`, `LoggedIP`, `ipTo`, `currentDate`) VALUES (DEFAULT,'Auth','Warning: A unknown ip has connected to the server','$currentIP','$IP',CURRENT_TIMESTAMP());";
            $query3 .= "INSERT INTO `log`(`id`, `logType`, `info`, `LoggedIP`, `ipTo`, `currentDate`) VALUES (DEFAULT,'server connect','Successfully established a connection to $IP','localhost','$currentIP',CURRENT_TIMESTAMP());";
            $query3 .= "UPDATE users SET ConnTo = '$IP' WHERE id = '$myID'";
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
        $access = "bash: " . $commandIP . ": Invalid IP<br><br>";
    }

    $echo = ['command' => "connect", 'ip' => $commandIP, 'valid' => $valid, 'access' => $access];
    echo json_encode($echo);

} else if (strpos($command, 'ls') === 0) {
    if ($conn->connect_error) {die("Connection failed: " . $conn->connect_error);}
    $sql = "SELECT ConnTo FROM users WHERE username = '$name'";
    $query = $conn->query($sql);
    while($result = $query->fetch_assoc()){
        $command = $result['ConnTo'];
    }
    if (preg_match('~[0-9]+~', $command)) {
        $sql1 = "SELECT id FROM users WHERE ip = '$command'";
        $sql2 = "SELECT `Name` FROM NPC WHERE ip = '$command'";
        $query1 = $conn->query($sql1);
        $query2 = $conn->query($sql2);
        while($result1 = $query1->fetch_assoc()){
            $DefID = $result1['id'];
        }
        while($result2 = $query2->fetch_assoc()){
            $DefID = $result2['Name'];
        }
        $sql= "SELECT * FROM filesystem WHERE `location` = '$DefID'";
    } else {
        $sql= "SELECT * FROM filesystem WHERE `location` = '$myID'";
    }
    $query = $conn->query($sql);
    $files = array();
    while($result = $query->fetch_assoc()){
        array_push($files, $result);
    }
    if (!$files) {
        $files = "None";
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
            $sql = "SELECT id FROM users WHERE ip = '$connTo'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                $DefID = $result['id'];
            }

            $sql = "SELECT `Name` FROM NPC WHERE IP = '$connTo'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                $DefID = $result['Name'];
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
            $sql = "SELECT `name` FROM filesystem WHERE `location` = '$myID' AND id = '$rm'";
            $query = $conn->query($sql);
            $fileExist = array();
            while($result = $query->fetch_assoc()){
                array_push($fileExist, intval($result));
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
            $sql = "SELECT id FROM users WHERE ip ='$connTo'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                $DefID = $result['id'];
            }

            $sql = "SELECT `Name` FROM NPC WHERE IP = '$connTo'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                $DefID = $result['Name'];
            }

            $sql = "SELECT * FROM filesystem WHERE `location` = '$DefID' AND `name` = '$rm'";
            $query = $conn->query($sql);
            $fileExist = array();
            while($result = $query->fetch_assoc()){
                array_push($fileExist, intval($result));
            }
            if (sizeof($fileExist) > 1) {
                $fileExist = "There is more then 1 file named " . $rm;
            } else if (sizeof($fileExist) < 1) {
                $fileExist = "The file " . $rm . " dosen't exist";
            } else {
                $sql = "DELETE FROM `filesystem` WHERE `location` = '$DefID' AND `name` = '$rm'";
                if (mysqli_query($conn, $sql)) {
                    $fileExist = $rm . " has been deleted";
                } else {
                    $fileExist = "Error: " . $sql . "<br>" . mysqli_error($conn);
                }
            }
        } else {
            $sql = "SELECT `name` FROM filesystem WHERE `location` = '$myID' AND `name` = '$rm'";
            $query = $conn->query($sql);
            $fileExist = array();
            while($result = $query->fetch_assoc()){
                array_push($fileExist, intval($result));
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
            $sql = "SELECT `name`,`level`,size,`type` FROM filesystem WHERE `location` = '$myID' AND `id` = '$ul'";
            $query = $conn->query($sql);
            $fileExist = array();
            while($result = $query->fetch_assoc()){
                array_push($fileExist, intval($result['level']));
                $fileName = $result['name'];
                $fileType = $result['type'];
                $fileLevel = $result['level'];
                $fileSize = $result['size'];
            }
            if (count($fileExist) > 1) {
                $upload = "There is more then 1 file named " . $ul;
            } else if (count($fileExist) < 1) {
                $upload = "The file " . $ul . " dosen't exist";
            } else {
                $sql = "SELECT id FROM users WHERE ip ='$connTo'";
                $query = $conn->query($sql);
                while($result = $query->fetch_assoc()){
                    $DefID = $result['id'];
                }

                $sql = "SELECT `Name` FROM NPC WHERE IP = '$connTo'";
                $query = $conn->query($sql);
                while($result = $query->fetch_assoc()){
                    $DefID = $result['Name'];
                }

                $sql = "SELECT `level` FROM filesystem WHERE `location` = '$DefID' AND `name` = '$fileName'";
                $query = $conn->query($sql);
                $fileExist1 =  array();
                while($result = $query->fetch_assoc()){
                    array_push($fileExist1, intval($result['level']));
                }
                if (empty($fileExist1) || !in_array($fileExist[0], $fileExist1)) {
                    $sql = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
                    VALUES (DEFAULT, '$myID', '$fileName', '$fileType', '$fileLevel', '$fileSize', '$DefID')";
                    if (mysqli_multi_query($conn, $sql)) {
                        $upload = "success";
                    } else {
                        $upload = "Error: " . $sql . "<br>" . mysqli_error($conn);
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
            $sql = "SELECT `name`,`level`,size,`type` FROM filesystem WHERE `location` = '$myID' AND `name` = '$ul'";
            $query = $conn->query($sql);
            $fileExist = array();
            while($result = $query->fetch_assoc()){
                array_push($fileExist, intval($result['level']));
                $fileType = $result['type'];
                $fileLevel = $result['level'];
                $fileSize = $result['size'];
            }
            if (count($fileExist) > 1) {
                $upload = "There is more then 1 file named " . $ul;
            } else if (count($fileExist) < 1) {
                $upload = "The file " . $ul . " dosen't exist";
            } else {
                $sql = "SELECT id FROM users WHERE ip ='$connTo'";
                $query = $conn->query($sql);
                while($result = $query->fetch_assoc()){
                    $DefID = $result['id'];
                }
                $sql = "SELECT `Name` FROM NPC WHERE IP = '$connTo'";
                $query = $conn->query($sql);
                while($result = $query->fetch_assoc()){
                    $DefID = $result['Name'];
                }
                $sql = "SELECT `level` FROM filesystem WHERE `location` = '$DefID' AND `name` = '$ul'";
                $query = $conn->query($sql);
                $fileExist1 =  array();
                while($result = $query->fetch_assoc()){
                    array_push($fileExist1, intval($result['level']));
                }
                if (empty($fileExist1) || !in_array($fileExist[0], $fileExist1)) {
                    $sql = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
                    VALUES (DEFAULT, '$myID', '$ul', '$fileType', '$fileLevel', '$fileSize', '$DefID')";
                    if (mysqli_multi_query($conn, $sql)) {
                        $upload = "success";
                    } else {
                        $upload = "Error: " . $sql . mysqli_error($conn);
                    }
                } else {
                    $upload = "The person you are trying to upload to already has " . $ul;
                }
            }
        }
    }
    $echo = ['command' => 'ul', 'upload' => $upload];
    echo json_encode($echo);
} else if (strpos($command, 'dl') === 0 || strpos($command, 'download') === 0 || strpos($command, 'dlid') === 0 || strpos($command, 'downloadid') === 0) {
    $sql = "SELECT ConnTo FROM users WHERE username='$name'";
    $query = $conn->query($sql);
    while($result = $query->fetch_assoc()){
        $connTo = $result['ConnTo'];
    }

    if ($connTo === Null) {
        $download = "You are not currently connected to anyone";
    } else {
        $sql = "SELECT id FROM users WHERE ip ='$connTo'";
        $query = $conn->query($sql);
        while($result = $query->fetch_assoc()){
            $DefID = $result['id'];
        }

        $sql = "SELECT `Name` FROM NPC WHERE IP = '$connTo'";
        $query = $conn->query($sql);
        while($result = $query->fetch_assoc()){
            $DefID = $result['Name'];
        }
        if (strpos($command, 'dlid') === 0 || strpos($command, 'downloadid') === 0) {
            $commands = array('dlid', 'downloadid');
            $dl = trim(strtolower(str_replace($commands, '', $command)));
            $sql = "SELECT `name`,`level`,size FROM filesystem WHERE `location` = '$DefID' AND id = '$dl'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                $fileName = $result['name'];
                $fileLevel = $result['level'];
                $fileSize = $result['size'];
            }
            if (isset($fileLevel)) {
                $sql = "SELECT `level` FROM filesystem WHERE `location` = '$myID' AND `name` = '$fileName'";
                $query = $conn->query($sql);
                while($result = $query->fetch_assoc()){
                    $fileLevel1 = $result['level'];
                }

                if(!isset($fileLevel1)){
                    $fileLevel1 = 0;
                    $sql = "INSERT INTO `filesystem`(`id`, `creator`, `name`, `type`, `level`, `size`, `location`) VALUES (DEFAULT,'$DefID','$fileName','$fileName','$fileLevel','$fileSize','$myID')";
                } else {
                    $sql = "UPDATE filesystem SET `level` = '$fileLevel', size = '$fileSize' WHERE `location` = '$myID' AND `id` = '$dl'";
                }
                if ($fileLevel > $fileLevel1) {
                    if (mysqli_query($conn, $sql)) {
                        $download = $dl . " has been downloaded". $fileLevel . " " . $fileLevel1;
                    } else {
                        $download = "Error: " . $sql . "<br>" . mysqli_error($conn);
                    }
                } else {
                    $download = "You already have a equal to or greater than virsion of that file";
                }
            } else {
                $download = "The file you are trying to download does not exist";
            }
        } else {
            $commands = array('dl', 'download');
            $dl = trim(strtolower(str_replace($commands, '', $command)));
            $sql = "SELECT `level`,`size` FROM `filesystem` WHERE `location` = '$DefID' AND `name` = '$dl'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                $fileLevel = $result['level'];
                $fileSize = $result['size'];
            }
            if (isset($fileLevel)) {
                $sql = "SELECT `level` FROM filesystem WHERE `location` = '$myID' AND `name` = '$dl'";
                $query = $conn->query($sql);
                while($result = $query->fetch_assoc()){
                    $fileLevel1 = $result['level'];
                }
                if(!isset($fileLevel1)){
                    $fileLevel1 = 0;
                    $sql = "INSERT INTO `filesystem`(`id`, `creator`, `name`, `type`, `level`, `size`, `location`) VALUES (DEFAULT,'$DefID','$dl','$dl','$fileLevel','$fileSize','$myID')";
                } else {
                    $sql = "UPDATE filesystem SET `level` = '$fileLevel', size = '$fileSize' WHERE `location` = '$myID' AND `name` = '$dl'";
                }
                if ($fileLevel > $fileLevel1) {
                    if (mysqli_query($conn, $sql)) {
                        $download = $dl . " has been downloaded";
                    } else {
                        $download = "Error: " . $sql . "<br>" . mysqli_error($conn);
                    }
                } else {
                    $download = "You already have a equal to or greater than virsion of that file";
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
        $sql= "SELECT username,ActivationDate,ConnTo FROM users WHERE ip ='$whois'";
        $query = $conn->query($sql);

        while($result = $query->fetch_assoc()){
            $username = $result['username'];
            $ActivationDate = $result['ActivationDate'];
            $ConnTo = $result['ConnTo'];
        }

        $sql= "SELECT `Name`,CPU FROM NPC WHERE IP ='$whois'";
        $query = $conn->query($sql);

        while($result = $query->fetch_assoc()){
            $NpcName = $result['Name'];
            $NpcCPU = $result['CPU'];
        }
    }

    if (!isset($username) || !isset($NpcName)) {
        $sql= "SELECT username,ActivationDate,ConnTo FROM users WHERE username ='$whois'";
        $query = $conn->query($sql);

        while($result = $query->fetch_assoc()){
            $username = $result['username'];
            $ActivationDate = $result['ActivationDate'];
            $ConnTo = $result['ConnTo'];
        }

        $sql= "SELECT CPU FROM NPC WHERE `Name` ='$whois'";
        $query = $conn->query($sql);

        while($result = $query->fetch_assoc()){
            $NpcName = $whois;
            $NpcCPU = $result['CPU'];
        }
    }

    if (isset($username)) {
        if ($ConnTo === Null) {$ConnTo = "No one";}
        $echo = ['command' => "whois", 'whois' => 'Username: ' . $username . '<br>Activation Date: ' . $ActivationDate . '<br>ConnTo: ' . $ConnTo];
    } else if (isset($NpcName)){
        $echo = ['command' => "whois", 'whois' => 'Name: ' . $NpcName . '<br>CPU: ' . $NpcCPU];
    } else {
        $echo = ['command' => "whois", 'whois' => 'Invalid Whois Name/IP'];
    }
    echo json_encode($echo);
} else if (strpos($command, 'gen npc') === 0) {
    $NpcName = trim(str_replace('gen npc', '', $command));
    if ($NpcName != "") {
        $randIP = mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255);
        $date = date("y-m-d H:m:s");
        $currentIP = $randIP;
        $query = "INSERT INTO NPC (id, `Name`, IP, CPU) 
        VALUES (DEFAULT, '$NpcName', '$randIP', '500');";
        $query .= "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, `size`, `location`) 
        VALUES (DEFAULT, '0', '$NpcName', 'firewall', 'firewall', '1', '1', '$NpcName')";
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
        $sql = "SELECT id FROM users WHERE username='$name'";
        $query = $conn->query($sql);

        while($result = $query->fetch_assoc()){
            $myID = $result['id'];
        }

        $sql = "UPDATE market SET Amount = '$AmountAfter' WHERE `Name` = '$Name'";
        if (mysqli_query($conn, $sql)) {
            $sql = "SELECT id,`name`,amount FROM inventory WHERE `name` ='$Name'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                $invID = $result['id'];
                $invName = $result['name'];
                $invAmount = $result['amount'];
            }

            if(isset($invID)) {
                $total = $invAmount + $reAmount;
                $sql = "UPDATE inventory SET amount = '$total' WHERE `name` = '$Name' AND `location` = '$myID'";
                if (mysqli_query($conn, $sql)) {
                    $error = "None";
                } else {
                    $error = "SQL Error: " . $sql . "<br>" . mysqli_error($conn);
                }
            } else {
                $sql = "INSERT INTO `inventory`(`id`, `name`, `amount`, `location`) VALUES (DEFAULT,'$Name','$reAmount','$myID')";
                if (mysqli_query($conn, $sql)) {
                    $error = "None";
                } else {
                    $error = "SQL Error: " . $sql . "<br>" . mysqli_error($conn);
                }
            }
        } else {
            $error = "SQL Error: " . $sql . "<br>" . mysqli_error($conn);
        }
        $echo = ['command' => 'buy', 'error' => $error, 'success' => 'yes', 'name' => $Name, 'amount' => $reAmount];
    }
    echo json_encode($echo);
} else if (strpos($command, 'Finances') === 0) {
    $sql = "SELECT `addr`,`amount`,`bankIP` FROM Finances WHERE `location` = '$myID'";
    $query = $conn->query($sql);
    $BankAccs = [];
    while ($result = $query->fetch_assoc()){
        array_push($BankAccs, $result['addr'], $result['amount'], $result['bankIP']);
    }

    if($BankAccs) {
        //player has bank acc
        $echo = ['command' => 'Finances', 'success' => 'yes', 'accounts' => $BankAccs];
    } else {
        //make a bank acc for them
        $randAcc = mt_rand(0, 255000);
        $sql = "INSERT INTO `Finances`(`id`, `addr`, `amount`, `bankIP`, `location`) VALUES (DEFAULT,'$randAcc','20000', '19.15.6.235', '$myID')";
        if (mysqli_query($conn, $sql)) {
            $sql = "SELECT `addr`,`amount`,`bankIP` FROM Finances WHERE `location` = '$myID'";
            $query = $conn->query($sql);
            while($result = $query->fetch_assoc()){
                array_push($BankAccs, $result['addr'], $result['amount'], $result['bankIP']);
            }
            $echo = ['command' => 'Finances', 'success' => 'yes', 'accounts' => $BankAccs];
        } else {
            $error = "SQL Error: " . $sql . "<br>" . mysqli_error($conn);
            $echo = ['command' => 'Finances', 'success' => 'no', 'error' => $error];
        }
    }
    echo json_encode($echo);
} else if (strpos($command, 'list') === 0) {
    $sql = "SELECT * FROM NPC";
    $query = $conn->query($sql);
    $NPCs = [];
    $Players = [];

    while ($result = $query->fetch_assoc()){
        array_push($NPCs, $result['Name'], $result['IP'], $result['CPU']);
    }

    $sql = "SELECT username,ip FROM users";
    $query = $conn->query($sql);

    while ($result = $query->fetch_assoc()){
        array_push($Players, $result['username'], $result['ip']);
    }

    $echo = ['command' => 'list', 'npcs' => $NPCs, 'players' => $Players];
    echo json_encode($echo);
} else if ($command == 'stats' || $command == 'cpu' || $command == 'network' || $command == 'harddrive' || $command == 'nas') {
    $sql = "SELECT * FROM stats WHERE id = '$myID'";
    $query = $conn->query($sql);

    if ($command == 'stats') {
        $requested = [];
        while ($result = $query->fetch_assoc()){
            array_push($requested, $result['rank'], $result['rep'], $result['cpu'], $result['network'], $result['harddrive'], $result['nas']);
        }
        $echo = ['command' => 'stats', 'stats' => $requested];
    } else {
        while ($result = $query->fetch_assoc()){
            $requested = $result["$command"];
        }
        $echo = ['command' => 'stat', 'name' => $command, 'stat' => $requested];
    }
    echo json_encode($echo);
} else {
    $echo = ['command' => 'none'];
    echo json_encode($echo);
}
$conn->close();
?>
