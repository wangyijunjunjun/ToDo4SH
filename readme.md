todo
========

this is a test project from nex(wangyijun)

to run this project , follow the steps below


###Step02

make sure your computer has these things installed

 * nodejs
 * mysql
 

###Step01:
####1)configurate your mysql 
```
create database todo;
```

```
use todo;
create table todoList;
```

####2)change the codes in server/app.js

```
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'nex',
    password : 'edghuli',
    database : 'todo'
});
```
write down your user and password

###Step02:
####1)get into server
```
cd path/server
node app.js
```

####2)get into client
```
cd path/client
grunt
```

###3)enjoy it!

