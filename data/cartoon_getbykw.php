<?php
header("content-type:application/json");
@$kw = $_REQUEST['kw'];
if(empty($kw)){
    echo '{}';
    return;
}
$output = ['data'=>null];
require('init.php');
$sql = "SELECT * FROM cartoon_list WHERE name like '%$kw%' or description like '%$kw%'";
$result = mysqli_query($conn,$sql);
$output['data']=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo json_encode($output['data']);