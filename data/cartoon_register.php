<?php
/*
*接收客户端提交的uname和upwd，执行INSERT，插入到数据库，返回{"code": 200, "uid":3}或{"code": 401, "msg":"uname required"}或{"code":402,"msg": "upwd required"}
*/
header('Content-Type: application/json');

@$n = $_REQUEST['uname'] or die('{"code":401,"msg":"uname required"}');
@$p = $_REQUEST['upwd'] or die('{"code":402,"msg":"upwd required"}');

require('init.php');
$sql = "INSERT INTO user_list VALUES(NULL,'$n','$p')";
$result = mysqli_query($conn,$sql);

//INSERT: 成功返回true，失败返回的false
if($result){    //SQL执行成功
    //获取刚刚执行的INSERT语句产生的自增编号
    $uid = mysqli_insert_id($conn);
    $data = [ 'code'=>200, 'uid'=>$uid ];
    echo json_encode( $data );
}else {         //SQL执行失败
    echo '{"code":501, "msg":"sql err"}';
}

