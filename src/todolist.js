export class TodoList {
    constructor(renderHtml){
        this.todoMap = new Map();
        this.renderHtml = renderHtml;
    }

    markTodo(id, isChecked) {
        let task = this.todoMap.get(id);
        task.checked = !isChecked;
        this.todoMap.set(id, task);
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

    render() {
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