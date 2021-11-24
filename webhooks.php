<?php

// 接收post参数
$requestBody = file_get_contents("php://input");
if (empty($requestBody)) {
    exit('data null！');
}

// Content type = application/json
$content = json_decode($requestBody, true);

// 验证 Webhooks 配置的 Secret，也可以不验证
if (empty($content['password']) || $content['password'] != 'easyjava@cn') {
	exit('password error');
}

// 项目存放物理路径，也就是站点的访问地址
$path = "/www/wwwroot/easyjava.cn/EasyCode/";

// 判断需要下拉的分支上是否有提交，我们这里的分支名称为 main
if ($content['ref'] == 'refs/heads/main') {

    // 执行脚本 git pull，拉取分支最新代码
    $res = shell_exec("cd {$path} && git pull origin main 2>&1"); // 当前为www用户

    // 记录日志 ($content 返回的是一整个对象，可以按需获取里面的内容，写入日志)
    $res_log = '------------------------->' . PHP_EOL;
    $res_log .= '用户 ' . $content['pusher']['name'] . ' 于 ' . date('Y-m-d H:i:s') . ' 向项目【' . $content['repository']['name'] . '】分支【' . $content['ref'] . '】PUSH ' . $content['commits'][0]['message'] . PHP_EOL;
    $res_log .= $res . PHP_EOL;

    // 追加方式，写入日志文件
    file_put_contents("git_webhook_log.txt", $res_log, FILE_APPEND);
}
echo 'done';