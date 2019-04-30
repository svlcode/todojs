export class TodoList {
    constructor(renderHtml, showSelectionBtn, setSelectionBtnHtml, showDeleteBtn) {
        this.todoMap = new Map();
        this.renderHtml = renderHtml;
        this.showSelectionBtn = showSelectionBtn;
        this.setSelectionBtnHtml = setSelectionBtnHtml;
        this.showDeleteBtn = showDeleteBtn;
        this.updateBtnStates();
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
        let task = this.todoMap.get(id);
        task.checked = !isChecked;
        this.todoMap.set(id, task);
        this.render();
    }

    selectDeselectAll() {
        let allAreChecked = this.areAllTodosChecked();
        if (allAreChecked) {
            this.todoMap.forEach((todo, key) => {
                todo.checked = false;
            });
        }
        else {
            this.todoMap.forEach((todo, key) => {
                todo.checked = true;
            });
        }
        
        this.render();
    }

    addTodo(text = "Empty Task") {
        let id = Date.now() + "";
        this.todoMap.set(id, {
            id : id,
            text: text,
            checked : false
        });
        this.render();
    }

    clean(){
        this.todoMap.forEach((todo, key) => {
            if(todo.checked) {
                this.todoMap.delete(key);
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