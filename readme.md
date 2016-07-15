todo
========

请按照如下步骤配置项目


###第0步

安装如下两个软件

 * nodejs
 * mysql

###第一步
####1)配置数据库
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

###3)enjoy it!
