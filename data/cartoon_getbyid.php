<?php
header("content-type:application/json");
@$id = $_REQUEST['id'];
if(empty($id)){
    echo '{}';
    return;
}
$output = ['data'=>null];
require('init.php');
$sql = "SELECT * FROM cartoon_list WHERE did = '$id'";
$result = mysqli_query($conn,$sql);
$output['data']=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo json_encode($output['data']);