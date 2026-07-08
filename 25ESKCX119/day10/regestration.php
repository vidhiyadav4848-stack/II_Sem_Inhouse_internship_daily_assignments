<?php
include("header.php");
?>

<div class="container mt-5" style="max-width:400px;">
    <form action="checkRegestrationformError.php" method="post">
        <h3 class="mb-3">Register</h3>
        
        <input type="text" name="name" class="form-control mb-3" placeholder="Name">
        <input type="email" name="email" class="form-control mb-3" placeholder="Email">
        <input type="password" name="password" class="form-control mb-3" placeholder="Password">
        
        <button type="submit" class="btn btn-success w-100">Submit</button>
    </form>
</div>

<?php 
include("footer.php"); 
?>