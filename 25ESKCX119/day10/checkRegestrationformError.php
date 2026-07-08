<?php
// Database connection file ko yahan include kiya hai
include 'db_connect.php'; 

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Form se values lena aur security ke liye mysqli_real_escape_string use karna
    $name = mysqli_real_escape_string($conn, $_POST["name"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);

    // Check karna ki koi field khali to nahi hai
    if ($name == "" || $email == "" || $password == "") {
        $error = "All fields are required.";
        echo $error;
    } else {
        // Data ko 'user' table mein insert karne ki SQL query
        $sql = "INSERT INTO user (name, email, password) VALUES ('$name', '$email', '$password')";

        // Query ko execute karna
        if (mysqli_query($conn, $sql)) {
            // Agar data save ho gaya to success.php par bhej do
            header("Location: success.php");
            exit();
        } else {
            // Agar koi error aayi to show karega
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    }
}
?>