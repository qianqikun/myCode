<?php
header("content-type:application/json");
@$page=$_REQUEST['page'];
require('init.php');
if($page===null){	//客户端未提交要显示的页号
	$page = 1;
}else {				//客户端提交了页号，默认是字符串
	$page = intval($page);	//字符串解析为整数
}

$output = [
	'recordCount'=>0,	//总记录数
	'pageSize'=>6,		//页面大小
	'pageCount'=>0,		//总页数
	'pageNum'=>$page,	//当前显示的页号
	'data'=>null		//当前页中的数据
];
$sql = "SELECT COUNT(*) FROM cartoon_list";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
$output['recordCount'] = intval($row[0]);
$output['pageCount'] = ceil( $output['recordCount'] / $output['pageSize'] );
$sum = intval($output['pageNum'] * $output['pageSize']);
if($sum>$output['recordCount']){
    $sum = $output['recordCount'];
}
$sql = "SELECT * FROM cartoon_list LIMIT 0,$sum";
$result = mysqli_query($conn, $sql);
$output['data']=mysqli_fetch_all($result,MYSQLI_ASSOC);

echo json_encode($output['data']);