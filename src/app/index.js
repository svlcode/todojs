
import {TodoList} from './todolist.js';


let todoList = document.querySelector(".todo-list");
let todoInput = document.querySelector(".todoInput");
let removeButton = document.getElementById("remove");
let selectionBtn = document.getElementById("selectAll");
const List = new TodoList(renderHtml, showSelectionBtn, setSelectionBtnHtml, (show) => {
    showElement(removeButton, show);
});

window.addEventListener("load", function() {
    bindEvents();
});


function renderHtml(html){
    todoList.innerHTML = html;
}

function showSelectionBtn(show) {
    showElement(selectionBtn, show);
}

function showElement(element, show) {
    if(show) {
        element.style.display = 'inline';
    }
    else {
        element.style.display = 'none';
    }
}

function setSelectionBtnHtml(html) {
    selectionBtn.innerHTML = html;
}

function bindEvents() {
    todoInput.onkeyup = (e) => {
        if(e.keyCode === 13) {
            let task = e.target.value;
            if(task.trim() !== "") {
                List.addTodo(task);
            }
            
            todoInput.value = "";
        }
    };

    todoList.onmouseup = (e) => {
        if (e.target.checked !== undefined) {
            let id = e.target.getAttribute("data-key");
            List.markTodo(id, e.target.checked);
        }
    };

    removeButton.onclick = () => {
        List.clean();
    }

    selectionBtn.onclick = () => {
        List.selectDeselectAll();
    }
}