(function (Reflux, global) {
    "use strict";
    global.TodoActions = Reflux.createActions([
         "toggleItem",
        "toggleAllItems",
        "addItem",
        "removeItem",
        "clearCompleted",
        "editItem"
    ]);

})(window.Reflux, window);
