(function (Reflux, TodoActions, global) {
    'use strict';

    // some variables and helpers for our fake database stuff
    var todoCounter = 0;


    function getItemByKey(itemKey) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json; charset=utf-8");

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
        };

        fetch("http://localhost:8080/todoList/" + itemKey, myInit)
            .then(function (response) {
                if (response.ok) {
                    return response.json().then(function (json) {
                        global.todoListStore.queryItem = json[0];
                    })
                }
            }, function (err) {
                alert("对不起,您的数据库连接失败,请检查您的数据库连接." +
                    "（请按照readme.md文件来配置数据库并修改Server内的app.js内的数据库用户名和密码）");
            });
    }

    function addTodoItem(label) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json; charset=utf-8");

        var myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify({
                "id": todoCounter++,
                "created": (new Date()).getTime(),
                "isComplete": "0",
                "label": label
            })
        };

        fetch("http://localhost:8080/todoList", myInit)
            .then(function (response) {
                if (response.ok) {
                    getAllItems();
                }

            }, function (err) {
                alert("对不起,您的数据库连接失败,请检查您的数据库连接." +
                    "（请按照readme.md文件来配置数据库并修改Server内的app.js内的数据库用户名和密码）");
            });
    }

    function getAllItems() {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json; charset=utf-8");

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
        };

        fetch("http://localhost:8080/todoList", myInit)
            .then(function (response) {
                if (response.ok) {
                    return response.json().then(function (json) {

                        global.todoListStore.list = json;
                        global.todoListStore.updateList(global.todoListStore.list);
                    })
                }
            }, function (err) {
                alert("对不起,您的数据库连接失败,请检查您的数据库连接." +
                    "（请按照readme.md文件来配置数据库并修改Server内的app.js内的数据库用户名和密码）");
            });

    }

    function init() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json; charset=utf-8");

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
        };

        fetch("http://localhost:8080/todoList", myInit)
            .then(function (response) {
                if (response.ok) {
                    return response.json().then(function (json) {

                        global.todoListStore.list = json;
                        global.todoListStore.updateList(global.todoListStore.list);

                        //拿到list中最大的id
                        var maxId = global.todoListStore.list[global.todoListStore.list.length - 1].id;
                        todoCounter = maxId+1;

                    })
                }
            }, function (err) {
                alert("对不起,您的数据库连接失败,请检查您的数据库连接." +
                    "（请按照readme.md文件来配置数据库并修改Server内的app.js内的数据库用户名和密码）");
            });
    }

    function updateTodoItem(itemKey, isComplete, label) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json; charset=utf-8");

        var myInit = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            body: JSON.stringify({
                "id": itemKey,
                "isComplete": isComplete,
                "label": label
            })
        };

        fetch("http://localhost:8080/todoList", myInit)
            .then(function (response) {
                if (response.ok) {
                    getAllItems();
                }
            }, function (err) {
                alert("对不起,您的数据库连接失败,请检查您的数据库连接." +
                    "（请按照readme.md文件来配置数据库并修改Server内的app.js内的数据库用户名和密码）");
            });
    }

    function deleteTodoItem(itemKey) {

        //删除操作
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var myInit = {
            method: 'DELETE',
            headers: myHeaders,
            mode: 'cors',
        };

        var correctItemkey = itemKey;
        var url = "http://localhost:8080/todoList/" + correctItemkey;

        fetch(url, myInit)
            .then(function (response) {
                if (response.ok) {
                    getAllItems();
                }
            }, function (err) {
                alert("对不起,您的数据库连接失败,请检查您的数据库连接." +
                    "（请按照readme.md文件来配置数据库并修改Server内的app.js内的数据库用户名和密码）");
            });
    }

    global.todoListStore = Reflux.createStore({
        list: [{id: 0, created: 333, isComplete: 0, label: "欢迎使用Todos,请先配置您的数据库"}],
        queryItem: [{}],

        // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
        listenables: [TodoActions],
        //编辑item
        onEditItem: function (itemKey, newLabel) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json; charset=utf-8");

            var myInit = {
                method: 'GET',
                headers: myHeaders,
                mode: 'cors',
            };

            fetch("http://localhost:8080/todoList/" + itemKey, myInit)
                .then(function (response) {
                    if (response.ok) {
                        return response.json().then(function (json) {
                            global.todoListStore.queryItem = json[0];
                            global.todoListStore.queryItem.label = newLabel;

                            updateTodoItem(global.todoListStore.queryItem.id, global.todoListStore.queryItem.isComplete, global.todoListStore.queryItem.label);

                        })
                    }
                });

        },
        onAddItem: function (label) {
            addTodoItem(label);
        },

        onRemoveItem: function (itemKey) {
            deleteTodoItem(itemKey);

            // this.updateList(_.filter(this.list, function (item) {
            //     return item.id !== itemKey;
            // }));
        },

        //toggle切换item状态
        onToggleItem: function (itemKey) {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json; charset=utf-8");

            var myInit = {
                method: 'GET',
                headers: myHeaders,
                mode: 'cors',
            };

            fetch("http://localhost:8080/todoList/" + itemKey, myInit)
                .then(function (response) {
                    if (response.ok) {
                        return response.json().then(function (json) {
                            global.todoListStore.queryItem = json[0];

                            if (global.todoListStore.queryItem.isComplete === 0) {
                                global.todoListStore.queryItem.isComplete = 1;
                            } else if (global.todoListStore.queryItem.isComplete === 1) {
                                global.todoListStore.queryItem.isComplete = 0;
                            }

                            updateTodoItem(global.todoListStore.queryItem.id, global.todoListStore.queryItem.isComplete, global.todoListStore.queryItem.label);

                        })
                    }
                }, function (err) {
                    alert("对不起,您的数据库连接失败,请检查您的数据库连接." +
                        "（请按照readme.md文件来配置数据库并修改Server内的app.js内的数据库用户名和密码）");
                });
        },
        onToggleAllItems: function (checked) {
            this.updateList(_.map(this.list, function (item) {
                item.isComplete = checked ? 1 : 0;

                updateTodoItem(item.id, item.isComplete, item.label);
                return item;
            }));
        },
        onClearCompleted: function () {
            this.updateList(_.filter(this.list, function (item) {

                if (item.isComplete === 1) {
                    deleteTodoItem(item.id);
                }
                return !(item.isComplete === 1);
            }));
        },

        updateList: function (list) {
            this.list = list;
            this.trigger(list);
        },

        getInitialState: function () {
            init();

            //这里有一个bug,应该在init的时候,拿到最大的id,然后设置count值


            return this.list;
        }
    });

})(window.Reflux, window.TodoActions, window);
