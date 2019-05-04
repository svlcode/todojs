import './node_modules/jquery/dist/jquery.js'
const todosUrl = "http://localhost:3000/api/todos/";

export class TodoList {
    
    

    constructor(renderHtml, showSelectionBtn, setSelectionBtnHtml, showDeleteBtn) {
        this.todoMap = new Map();
        this.renderHtml = renderHtml;
        this.showSelectionBtn = showSelectionBtn;
        this.setSelectionBtnHtml = setSelectionBtnHtml;
        this.showDeleteBtn = showDeleteBtn;
        this.updateBtnStates();

        let promise =$.get(todosUrl);
        promise.then(
            tasks => {
                tasks.forEach((task) => {
                    this.todoMap.set(task.id, {
                        id : task.id,
                        text: task.text,
                        checked : task.checked
                    });
                });
                this.render();
            },
            error => console.log('error...' + error)
        );
    }

    checkSelectDeselectBtn() {
        if(this.todoMap.size === 0) {
            this.showSelectionBtn(false);
        }
        else {
            let allChecked = this.areAllTodosChecked();
            if(allChecked) {
                this.setSelectionBtnHtml('<span class="glyphicon glyphicon-ban-circle gi-2x"></span> Deselect All');
            }
            else {
                this.setSelectionBtnHtml('<span class="glyphicon glyphicon-ok-circle gi-2x"></span> Select All');
            }
            this.showSelectionBtn(true);
        }
    }

    checkDeleteBtn() {
        if(this.todoMap.size === 0) {
            this.showDeleteBtn(false);
        }
        else {
            let anyTodoChecked = this.isAnyTodoChecked();
            this.showDeleteBtn(anyTodoChecked);
        }
    }

    isAnyTodoChecked() {
        for (var todo of this.todoMap.values()) {
            if(todo.checked)
                return true;
        }
        return false;
    }
    areAllTodosChecked() {
        let allChecked = true;
        for (var todo of this.todoMap.values()) {
            if(!todo.checked)
                allChecked = false;
        }
        return allChecked;
    }

    markTodo(id, isChecked) {
        this.checkUncheckTodo(id, !isChecked);
    }

    checkUncheckTodo(id, check, skipRender) {
        let task = this.todoMap.get(id);
        if(task) {
            task.checked = check;
            $.ajax({
                type: 'PUT',
                url: todosUrl + id,
                contentType: 'application/json',
                data: JSON.stringify(task),
                success: (todo) => {
                                    this.todoMap.set(id, task);
                                    if(!skipRender)
                                        this.render();
                                }
            });
            
        }
    }

    selectDeselectAll() {
        let allAreChecked = this.areAllTodosChecked();
        if (allAreChecked) {
            this.todoMap.forEach((todo, key) => {
                this.checkUncheckTodo(key, false, true);
            });
            
        }
        else {
            this.todoMap.forEach((todo, key) => {
                this.checkUncheckTodo(key, true, true);
            });
        }
        
        this.render();
    }

    addTodo(description = "Empty Task") {
        
        let data = { id: "", text: description, checked: false };
        
        $.ajax({
            type: 'POST',
            url: todosUrl,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (todo) => {
                                this.todoMap.set(todo.id, {
                                    id : todo.id,
                                    text: todo.text,
                                    checked : todo.checked
                                })
                                this.render();
                            }
          });
    }

    clean(){
        this.todoMap.forEach((todo, key) => {
            if(todo.checked) {
                this.todoMap.delete(key);
                $.ajax({
                    type: 'DELETE',
                    url: todosUrl + key,
                    success: (response) => {
                        console.log(response);
                    }
                })
            }
        });
        this.render();
    }


    getTodoItemHtmlTemplate(todo, id) {
        return `<li 
                    class="todo-item ${(todo.checked ? "checked" : "")}" 
                    data-key="${id}"
                > 
                    <input 
                        type="checkbox" 
                        data-key="${id}" 
                        ${(todo.checked ? "checked" : "")}
                    /> 
                        ${todo.text} 
                </li>`;
    }

    updateBtnStates() {
        this.checkSelectDeselectBtn();
        this.checkDeleteBtn();
    }

    render() {
        this.updateBtnStates();
        let template = this.getTodoListHtmlTemplate();
        this.renderHtml(template);
    }

    getTodoListHtmlTemplate() {
        let todoElements = [];
        this.todoMap.forEach((todo, key) => {
            todoElements.push(this.getTodoItemHtmlTemplate(todo, key));
        });
        return todoElements.join(" ");
    }
}