<?php
include('db_connect.php');

$name = mysqli_real_escape_string($conn, $_POST['name']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$phone = mysqli_real_escape_string($conn, $_POST['phone']);
$dob = mysqli_real_escape_string($conn, $_POST['dob']);
$branch = mysqli_real_escape_string($conn, $_POST['branch']);

$errors = [];
$success = "";

// Validation
if ($name === '') {
    $errors['name'] = 'Name is required.';
    echo "Name is required.<br>";
}

if ($email === '') {
    $errors['email'] = 'Email is required.';
    echo "Email is required.<br>";
}

// Database Insertion
if (empty($errors)) {
    $sql = "INSERT INTO `people` (`name`, `email`, `phone`, `branch`, `time`, `dob`) VALUES ('$name', '$email', '$phone', '$branch', current_timestamp(), '$dob')";

    if (mysqli_query($conn, $sql)) {
        echo "New record created successfully.<br>";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
}

// File Upload Logic
if (isset($_FILES['myfile']) && $_FILES['myfile']['error'] == 0) {
    $folderPath = "uploads/";
    
    // Create folder if it doesn't exist
    if(!is_dir($folderPath)) {
        mkdir($folderPath, 0777, true);
    }

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
    $extension = strtolower(pathinfo($_FILES['myfile']['name'], PATHINFO_EXTENSION));
    $maxSize = 5 * 1024 * 1024; // 5MB limit

    if(!in_array($extension, $allowedExtensions)) {
        echo "Error: Only JPG, PNG, GIF, and PDF files are allowed.<br>";
    } elseif ($_FILES['myfile']['size'] > $maxSize) {
        echo "Error: File size exceeds the 2MB limit.<br>";
    } else {
        $newFileName = uniqid() . '.' . $extension;
        $destination = $folderPath . $newFileName;

        if (move_uploaded_file($_FILES['myfile']['tmp_name'], $destination)) {
            echo "File uploaded successfully: " . $newFileName . "<br>";
        } else {
            echo "Error uploading file.<br>";
        }
    }
}
?>