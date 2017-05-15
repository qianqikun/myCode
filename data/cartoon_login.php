<?php
header("content-type:application/json;charset='utf-8';");
@$uname = $_REQUEST['uname'] or die('{"code":-2, "msg":"用户名不能为空"}');
@$upwd = $_REQUEST['upwd'] or die('{"code":-3, "msg":"密码不能为空"}');
$output = ['data'=>null];
require('init.php');
$sql = "SELECT uid FROM user_list WHERE uname='$uname' AND upwd='$upwd'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
if($row===null){	//查询结果集中没有记录
	echo '{"code":-1,"msg":"用户名或密码错误"}';
}else {  //查询结果集中有记录
	$uid = $row[0];
	$output = [
		'code'=>1,
		'msg'=>'登录成功',
		'uname'=>$uname,
		'uid'=>$uid
	];
	echo json_encode($output);
}