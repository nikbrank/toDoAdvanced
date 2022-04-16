const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const list = document.querySelector("#items-list");
const template = document.querySelector("#list-item-template");
const LOCAL_STORAGE_PREFIX = "TODO-LIST";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();
todos.forEach(renderTodo); // todos.forEach((todo) => renderTodo(todo));

list.addEventListener("change", (e) => {
  if (!e.target.matches("[data-list-item-checkbox")) return;

  const parent = e.target.closest(".list-item");
  const todoId = parent.dataset.todoId;
  const todo = todos.find((t) => t.id === todoId);
  todo.complete = e.target.checked;

  saveTodos();
});

list.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return;

  const parent = e.target.closest(".list-item");
  const todoId = parent.dataset.todoId;
  todos = todos.filter((todo) => todo.id !== todoId);
  parent.remove();

  saveTodos();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoName = todoInput.value;

  if (todoName === "") return;
  const newTodo = {
    name: todoName,
    complete: false,
    id: new Date().valueOf().toString(),
  };
  todos.push(newTodo);
  renderTodo(newTodo);
  saveTodos();
  todoInput.value = "";

  // if (todoInput.value.length > 0) {
  //   renderTodo(todoName);
  // } else {
  //   e.preventDefault();
  // }
  // todoInput.value = "";
});

function renderTodo(todo) {
  const templateClone = template.content.cloneNode(true);
  const listItem = templateClone.querySelector(".list-item");
  listItem.dataset.todoId = todo.id;
  const textElement = templateClone.querySelector("[data-list-item-text");
  textElement.innerText = todo.name;
  const checkbox = templateClone.querySelector("[data-list-item-checkbox");
  checkbox.checked = todo.complete;
  list.appendChild(templateClone);
}

//Save todos
function saveTodos() {
  //Trenutno se todo-ovi cuvaju u htmlu, moramo ih sacuvati u js-u, zbog toga pravimo niz koji ce sadrzati sve todo-ove, const todos = []
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const todosString = localStorage.getItem(TODOS_STORAGE_KEY);
  return JSON.parse(todosString) || []; //Short circuiting, return this if theres empty array of objects. (or undefind, null, false)Ako korisnik ulazi prvi put i samim tim nije nista uneo izaci ce error, zato stavljamo || jer ako je prazan storage da nam vrati prazan niz, tj da ne bude errora
}

// function deleteTodo(templateClone) {
//   const deleteButton = templateClone.querySelector("[data-button-delete]");
//   deleteButton.addEventListener("click", () => {
//     console.log("deleted");
//     list.removeChild(templateClone);
//   });
// }
