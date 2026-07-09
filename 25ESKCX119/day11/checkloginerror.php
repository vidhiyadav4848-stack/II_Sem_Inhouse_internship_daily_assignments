<?php
$error = "";

$email ="";
$password ="";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);
    
    if ($email == "" || $password == "") {
        $error = "All fields are required.";
        echo $error;
    } else {
        //insert
        $selectQuery = "Select * from user where email='$email' and password = '$password'";
        $result = mysqli_query($conn, $selectQuery);
        $user = mysqli_fetch_assoc($result);

        if($user){
            header("Location: dashboard.php");
            exit();
        } else {
            echo "Invalid Credentials";
            echo "Error: " . mysqli_error($conn);
        }
    }
}
?>