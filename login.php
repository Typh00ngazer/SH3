<?php

session_start();

if(isset($_SESSION['id']) ){
	header("Location: WebTerminal.php");
}

require 'php/db.php';

if(!empty($_POST['email']) && !empty($_POST['password'])):
	
	$email = $_POST['email'];
	$password = $_POST['password'];

	$sql = "SELECT id, `username`, email, `password`, ip FROM users WHERE email = '$email'";
	$query = $conn->query($sql);
    while($result = $query->fetch_assoc()){
		$user['id'] = $result['id'];
		$user['username'] = $result['username'];
		$user['email'] = $result['email'];
		$user['ip'] = $result['ip'];
		$DBpass = $result['password'];
    }

	$message = '';

	if($DBpass == true && password_verify($password, $DBpass) ){

		$_SESSION['id'] = $user['id'];
		$_SESSION['username'] = $user['username'];
		$_SESSION['email'] = $user['email'];
		$_SESSION['ip'] = $user['ip'];
		header("Location: WebTerminal.php");

	} else {
		$message = 'Sorry, those credentials do not match';
	}

endif;

?>

<!DOCTYPE html>
<html>
<head>
	<title>Login Below</title>
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

	<h1>Login</h1>
	<span>or <a href="register.php">register here</a></span>

	<form action="login.php" method="POST">
		
		<input type="text" placeholder="Enter your email" name="email">
		<input type="password" placeholder="and password" name="password">

		<input type="submit">

	</form>

</body>
</html>