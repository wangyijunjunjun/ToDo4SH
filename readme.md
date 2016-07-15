todo
========

请按照如下步骤配置项目


###第0步

安装如下两个软件

 * nodejs
 * mysql

###第一步
####1)配置数据库
之前你需要启动数据库，并登录

```
create database todo;
```

```
use todo;
```
```
CREATE TABLE `todoList` (
  `id` int(11) NOT NULL,
  `created` bigint(20) NOT NULL,
  `isComplete` tinyint(4) NOT NULL DEFAULT '0',
  `label` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

接着，你可以添加一条数据来测试todo数据库和todoList表是否创建成功

####2)修改 server/app.js

```
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'username',
    password : 'yourpass',
    database : 'todo'
});
```
修改你的your user and password

###Step02:
####1)进入server
```
cd path/server
node app.js
```

####2)进入client
```
cd path/client
grunt
```

###3)跑起来了，你可以添加，删除，修改你的todolist了


注意：请务必核实数据库的库名和表名是否正确，以及务必注意需要去server/app.js中修改代码，填入你的数据库username和password
