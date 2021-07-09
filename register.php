<?php

session_start();

if(isset($_SESSION['id'])){
	header("Location: /");
}

if (empty($_POST['name'] || empty($_POST['email']) || empty($_POST['password']) || empty($_POST['confirm_password']))) {
	$message = 'Invalid attempt';
	goto end;
}

require 'php/db.php';

$username = $_POST['name'];
$email = $_POST['email'];

//check if there is another user with the same name or email
$sql = "SELECT `username` FROM users WHERE username = '$username'";
$query = $conn->query($sql);
$result1 = $query->fetch_assoc();

$sql = "SELECT email FROM users WHERE email = '$email'";
$query = $conn->query($sql);
$result2 = $query->fetch_assoc();

if (!empty($result1)) {
	$message = 'Someone already is using that username';
	goto end;
} else if (!empty($result2)){
	$message = 'Someone already is using that email';
	goto end;
}

//if username and email is avaliable then create account
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
$date = date("y-m-d H:m:s");
$randIP = mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255) . "." . mt_rand(0, 255);

$sql = "INSERT INTO users (id, username, email, `password`, ActivationDate, ip, ConnTo) 
VALUES (DEFAULT, '$username', '$email', '$password', '$date', '$randIP', Null)";
$exe = $conn->prepare($sql);

if($exe->execute()) {
	$sql = "SELECT id FROM users WHERE email = '$email'";
	$query = $conn->query($sql);
	$result = $query->fetch_assoc();
	$myID = $result['id'];

	$sql = "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
	VALUES (DEFAULT, '0', 'firewall', 'firewall', '1', '1', '$myID');";
	$sql .= "INSERT INTO filesystem (id, creator, `name`, `type`, `level`, size, `location`) 
	VALUES (DEFAULT, '0', 'waterwall', 'waterwall', '1', '1', '$myID');";
	if (mysqli_multi_query($conn, $sql)) {
		$message = 'Successfully created new user';
	} else {
		$message = 'Sorry there must have been an issue creating your account';
	}
} else {
	$message = 'Sorry there must have been an issue creating your account';
}
end:

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
		
		<input type="text" placeholder="Enter a Nickname" name="name" required>
		<input type="text" placeholder="Enter your email" name="email" required>
		<input type="password" placeholder="and password" name="password" required>
		<input type="password" placeholder="confirm password" name="confirm_password" required>
		<input type="submit">

	</form>

</body>
</html>