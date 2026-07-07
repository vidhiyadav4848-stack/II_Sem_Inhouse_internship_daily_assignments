<?php
$servername = "localhost";
$username = "root";
$password = "8116vidhiyadav";
$dbname = "registration";

$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully to the database!";
?>