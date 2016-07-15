/** @jsx React.DOM */

(function (React, ReactRouter, Reflux, TodoActions, todoListStore, global) {

    var TodoItem = React.createClass({
        propTypes: {
            label: React.PropTypes.string.isRequired,
            isComplete: React.PropTypes.number.isRequired,
            id: React.PropTypes.number
        },
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function () {
            return {};
        },
        handleToggle: function (evt) {
            TodoActions.toggleItem(this.props.id);
        },
        handleEditStart: function (evt) {
            evt.preventDefault();

            this.setState({
                isEditing: true,
                editValue: this.props.label
            }, function () {
                this.refs.editInput.getDOMNode().focus();
            });
        },
        handleValueChange: function (evt) {
            var text = this.state.editValue;
            if (evt.which === 13 && text) {
                this.refs.editInput.getDOMNode().blur();
            }
            else if (evt.which === 27) {
                this.setState({isEditing: false}, function () {
                    this.refs.editInput.getDOMNode().blur();
                });
            }
        },
        handleBlur: function () {
            var text = this.state.editValue;

            if (this.state.isEditing && text) {
                TodoActions.editItem(this.props.id, text);
            }

            this.setState({isEditing: false});
        },
        handleDestroy: function () {
            TodoActions.removeItem(this.props.id);
        },
        render: function () {
            var classes = React.addons.classSet({
                "completed": this.props.isComplete,
                "editing": this.state.isEditing
            });
            return (
                <li className={classes}>
                    <div className="view">
                        <input className="toggle" type="checkbox" checked={this.props.isComplete===1}
                               onChange={this.handleToggle}/>
                        <label onDoubleClick={this.handleEditStart}>{this.props.label}</label>
                        <button className="destroy" onClick={this.handleDestroy}></button>
                    </div>
                    <input ref="editInput" className="edit" valueLink={this.linkState("editValue")}
                           onKeyUp={this.handleValueChange} onBlur={this.handleBlur}/>
                </li>
            );
        }
    });

    var TodoMain = React.createClass({
        mixins: [ReactRouter.State],
        propTypes: {
            list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        },
        toggleAll: function (evt) {
            TodoActions.toggleAllItems(evt.target.checked);
        },
        render: function () {
            var filteredList;
            switch (this.getPath()) {
                case "/completed":
                    filteredList = _.filter(this.props.list, function (item) {
                        if (item.isComplete === 0) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                    break;
                case "/active":
                    filteredList = _.filter(this.props.list, function (item) {
                        if (item.isComplete === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    break;
                default:
                    filteredList = this.props.list;
            }
            var classes = React.addons.classSet({
                "hidden": this.props.list.length < 1
            });
            return (
                <section id="main" className={classes}>
                    <input id="toggle-all" type="checkbox" onChange={this.toggleAll}/>
                    <label htmlFor="toggle-all">Mark all as complete</label>
                    <ul id="todo-list">
                        { filteredList.map(function (item) {
                            return <TodoItem label={item.label} isComplete={item.isComplete} id={item.id}
                                             key={item.id}/>;
                        })}
                    </ul>
                </section>
            );
        }
    });

    var TodoHeader = React.createClass({
        handleValueChange: function (evt) {
            var text = evt.target.value;
            if (evt.which === 13 && text) {
                TodoActions.addItem(text);
                evt.target.value = "";
            } else if (evt.which === 27) {
                evt.target.value = "";
            }
        },
        render: function () {
            return (
                <header id="header">
                    <h1>TODO</h1>
                    <h3>王又由</h3>
                    <input id="new-todo" placeholder="What needs to be done?" autoFocus
                           onKeyUp={this.handleValueChange}/>
                </header>
            );
        }
    });

    var TodoFooter = React.createClass({
        propTypes: {
            list: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        },
        render: function () {
            var nbrcompleted = _.filter(this.props.list, "isComplete").length,
                nbrtotal = this.props.list.length,
                nbrincomplete = nbrtotal - nbrcompleted,
                clearButtonClass = React.addons.classSet({hidden: nbrcompleted < 1}),
                footerClass = React.addons.classSet({hidden: !nbrtotal}),
                completedLabel = "Clear completed (" + nbrcompleted + ")",
                itemsLeftLabel = nbrincomplete === 1 ? " item left" : " items left";
            return (
                <footer id="footer" className={footerClass}>
                    <span id="todo-count"><strong>{nbrincomplete}</strong>{itemsLeftLabel}</span>
                    <ul id="filters">
                        <li>
                            <ReactRouter.Link activeClassName="selected" to="All">All</ReactRouter.Link>
                        </li>
                        <li>
                            <ReactRouter.Link activeClassName="selected" to="Active">Active</ReactRouter.Link>
                        </li>
                        <li>
                            <ReactRouter.Link activeClassName="selected" to="Completed">Completed</ReactRouter.Link>
                        </li>
                    </ul>
                    <button id="clear-completed" className={clearButtonClass}
                            onClick={TodoActions.clearCompleted}>{completedLabel}</button>
                </footer>
            );
        }
    });

    var TodoApp = React.createClass({

        mixins: [Reflux.connect(todoListStore, "list")],

        render: function () {
            return (
                <div>
                    <TodoHeader />
                    <ReactRouter.RouteHandler list={this.state.list}/>
                    <TodoFooter list={this.state.list}/>
                </div>
            );
        }
    });
    var routes = (
        <ReactRouter.Route handler={TodoApp}>
            <ReactRouter.Route name="All" path="/" handler={TodoMain}/>
            <ReactRouter.Route name="Completed" path="/completed" handler={TodoMain}/>
            <ReactRouter.Route name="Active" path="/active" handler={TodoMain}/>
        </ReactRouter.Route>
    );

    ReactRouter.run(routes, function (Handler) {
        React.render(<Handler/>, document.getElementById("todoapp"));
    });

})(window.React, window.ReactRouter, window.Reflux, window.TodoActions, window.todoListStore, window);
