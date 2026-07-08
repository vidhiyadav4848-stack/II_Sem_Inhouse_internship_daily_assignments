<?php
$servername = "localhost";
$username = "root";
$password = "8116vidhiyadav";
$database = "industrial_traning"; // Make sure this database exists in your phpMyAdmin

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
// echo "Connected successfully to the database!"; // Note: Is line ko baad mein hata dena warna har page par dikhegi
?>