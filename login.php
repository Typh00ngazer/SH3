<?php

session_start();

if(isset($_SESSION['id']) ){
	header("Location: /");
}

if (empty($_POST['email']) || empty($_POST['password'])) {
	$message = 'Make sure all fields are filled out';
	goto end;
}
	
$email = $_POST['email'];
$password = $_POST['password'];

require 'php/db.php';

//check if account exists in db
$sql = "SELECT id, `username`, email, `password`, ip FROM users WHERE email = '$email'";
$query = $conn->query($sql);
$result = $query->fetch_assoc();
if (empty($result)) {
	$message = 'Invalid login attempt';
	goto end;
}

if(password_verify($password, $result['password'])) {
	$_SESSION['id'] = $result['id'];
	$_SESSION['username'] = $result['username'];
	$_SESSION['email'] = $result['email'];
	$_SESSION['ip'] = $result['ip'];
	header("Location: /");
} else {
	$message = 'Sorry, those credentials do not match';
}
end:

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
		
		<input type="text" placeholder="Enter your email" name="email" required>
		<input type="password" placeholder="and password" name="password" required>

		<input type="submit">

	</form>

</body>
</html>
