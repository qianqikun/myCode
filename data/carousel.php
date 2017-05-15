<?php
header("content-type:application/json");
require('init.php');
$sql = "SELECT * FROM carousel_list";
$result = mysqli_query($conn,$sql);
$rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo json_encode($rows);