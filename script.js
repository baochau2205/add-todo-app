let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(){
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;

  if(input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    completed: false,
    priority: priority
  });

  input.value = "";
  renderTasks();
}

function deleteTask(index){
  tasks.splice(index,1);
  renderTasks();
}

function toggleTask(index){
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function editTask(index){
  let newText = prompt("Edit task:", tasks[index].text);
  if(newText){
    tasks[index].text = newText;
    renderTasks();
  }
}

function setFilter(f){
  filter = f;
  renderTasks();
}

function getFilteredTasks(){
  let search = document.getElementById("searchInput").value.toLowerCase();

  return tasks.filter(t => {

    let matchFilter =
      filter === "all" ||
      (filter === "active" && !t.completed) ||
      (filter === "completed" && t.completed);

    let matchSearch = t.text.toLowerCase().includes(search);

    return matchFilter && matchSearch;
  });
}

/* DRAG & DROP */
let draggedIndex = null;

function dragStart(index){
  draggedIndex = index;
}

function dropTask(index){
  let temp = tasks[draggedIndex];
  tasks.splice(draggedIndex,1);
  tasks.splice(index,0,temp);
  renderTasks();
}

function renderTasks(){
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let data = getFilteredTasks();

  data.forEach((task,index) => {

    let li = document.createElement("li");

    if(task.completed) li.classList.add("completed");
    li.classList.add(task.priority);

    li.draggable = true;

    li.ondragstart = () => dragStart(index);
    li.ondrop = () => dropTask(index);
    li.ondragover = (e) => e.preventDefault();

    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>

      <div class="actions">
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">X</button>
      </div>
    `;

    list.appendChild(li);
  });

  save();
}

renderTasks();