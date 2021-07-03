<?php

session_start();

if( isset($_SESSION['id']) ){
	header("Location: /");
}

require 'php/db.php';

$message = '';

if(!empty($_POST['email']) && !empty($_POST['password']) && !empty($_POST['name'])) {

	$username = $_POST['name'];
	$email = $_POST['email'];
	$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
	$date = date("y-m-d H:m:s");
	$randIP = mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255);
	
	// Enter the new user in the database
	$sql = "INSERT INTO users (id, username, email, `password`, ActivationDate, ip, ConnTo) 
    VALUES (DEFAULT, '$username', '$email', '$password', '$date', '$randIP', Null)";
	$exe = $conn->prepare($sql);

	if($exe->execute() ) {
		$sql = "SELECT id FROM users WHERE email = '$email'";
		$query = $conn->query($sql);

		while($result = $query->fetch_assoc()){
			$myID = $result['id'];
		}

		$sql = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
		VALUES (DEFAULT, '0', 'firewall', 'firewall', '1', '1', '$myID');";
		$sql .= "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
		VALUES (DEFAULT, '0', 'waterwall', 'waterwall', '1', '1', '$myID');";
		if (mysqli_multi_query($conn, $sql)) {
			$message = 'Successfully created new user';
    	} else {
			$message = 'Successfully failed to create a new user';
		}
	} else {
		$message = 'Sorry there must have been an issue creating your account';
	}
}

?>

<!DOCTYPE html>
<html>
<head>
	<title>Register Below</title>
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<link href='http://fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet' type='text/css'>
</head>
<body>

	<div class="header">
		<a href="/">SH3?</a>
	</div>

	<?php if(!empty($message)): ?>
		<p><?= $message ?></p>
	<?php endif; ?>

	<h1>Register</h1>
	<span>or <a href="login.php">login here</a></span>

	<form action="register.php" method="POST">
		
		<input type="text" placeholder="Enter a Nickname" name="name">
		<input type="text" placeholder="Enter your email" name="email">
		<input type="password" placeholder="and password" name="password">
		<input type="password" placeholder="confirm password" name="confirm_password">
		<input type="submit">

	</form>

</body>
</html>