
var socket = io()

$(() => {
    $("#sendTask").click(() => {
        var date = new Date()
        var task = {
            //taskID gets created at the mongodb.
            taskName: $("#taskName").val(),
            taskDescription: $("#taskDescription").val(),
            taskCategory: $("#taskCategory").val(),
            taskDueDate: $("#taskDueDate").val(),
            taskCreated: date.toISOString(),
            taskCompleted: false
        }
        postTask(task)
    })
    getTasks()
    getCategories()
})

socket.on('task', addTask)

var taskCounter = 0;

function addTask(task) {
    $("#tasks").append(
        `<div id="${task.taskId}"class="card w-100">
        <div class="card-body">
            <h5 class="card-title">${task.taskName}</h5>
            <p class="card-text">${task.taskDescription}</p>
            <button class="btn btn-success btn-sm" onclick="markComplete('${task.taskId}')"><span class="material-icons">done_outline</span></button>
            <button class="btn btn-dark btn-sm" onclick="removeTask('${task.taskId}')"><span class="material-icons">delete_outline</span></button>
        </div>
        </div>
        <br>`
    )
    if(task.taskCompleted){
        // console.log("Loaded Complete Task;")
        $(`#${task.taskId}`).css({
            'background-color': 'green',
            'color': 'white'
        });
    }
    taskCounter++;
    addTaskCount(taskCounter)
}

function appendCategory(category){
    $("#category-area").append(
        `<h6 class="display-5">${category}</h6>`
    )
}

function markComplete(id){
    $(`#${id}`).css({
        'background-color': 'green',
        'color': 'white'
    });
    var body = {id: id};
    $.post('http://localhost:3000/complete', body)
    
}

function removeTask(id){
    $(`#${id}`).remove();
    var body = {id: id};
    $.post('http://localhost:3000/remove', body)
    taskCounter--;
    addTaskCount(taskCounter)
}

function getTasks() {
    $.get('http://localhost:3000/tasks', (data) => {
        data.forEach(addTask);
    })
}

function getCategories() {
    $.get('http://localhost:3000/categories', (data) =>{
        data.forEach(appendCategory)
    })
}


function postTask(task) {
    $.post('http://localhost:3000/tasks', task);
}

function addTaskCount(taskCounter) {
    if (taskCounter > 0){
        $(`#taskCount`).text(taskCounter);
    }
}