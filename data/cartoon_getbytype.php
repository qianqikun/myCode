<?php
header("content-type:application/json");
@$type = $_REQUEST['type'];
if(empty($type)){
    echo '{}';
    return;
}
$output = ['data'=>null];
require('init.php');
$sql = "SELECT * FROM cartoon_list WHERE type = '$type'";
$result = mysqli_query($conn,$sql);
$output['data']=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo json_encode($output['data']);