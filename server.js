var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var config = require('./config')
const uuid = require('uuid');
const { db } = require('./config')


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

mongoose.Promise = Promise

//this should be called from a config file
var dbUrl = config.db.url;

//this is the data model that will be sent to mongoDB
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

var Task = mongoose.model('Task',{
    taskId: {type: String, default: uuid.v4},
    taskName: String,
    taskDescription: String,
    taskCategory: String,
    taskCompleted: Boolean,
    taskDueDate: Date,
    taskCreated: Date
})


app.get('/tasks', (req, res)=> {
    Task.find({}, (err, tasks) => {
        res.send(tasks);
    })
})

app.get('/categories', (req, res) => {
    Task.find().distinct('taskCategory', (err,categories) =>{
        res.send(categories)
    })
})

app.get('/tasks/:category',(req, res)=>{
    var category = req.params.category
    Task.find({taskCategory: category}, (err, tasks) =>{
        res.send(tasks)
    })
})

app.post('/tasks', async (req, res)=>{
    try{
        var task = new Task(req.body)

        var savedTask = await task.save()

        console.log('Task ' + task.taskName + ' Saved')

        io.emit('task', req.body)

        res.sendStatus(200)
    } catch (taskError){
        res.sendStatus(500)
        return console.error(taskError)
    } finally {
        console.log('Post Task Called')
    }

})

app.post('/complete', async (req, res)=>{
    try{
        var id = req.body.id;
        Task.find({taskId: id}, (err,task)=>{
            task[0].taskCompleted = true;
            task[0].save()
        })
    }
    catch (taskError){
        console.log(taskError)
        res.sendStatus(500)
        return console.error(taskError)
    } finally {
        console.log("Post Task Update Called")
    }
})

app.post('/remove', async (req, res)=>{
    try{
        var id = req.body.id;
        Task.find({taskId: id}, (err,task)=>{
            task[0].remove();
        })
    }
    catch (taskError){
        console.log(taskError)
        res.sendStatus(500)
        return console.error(taskError)
    } finally {
        console.log("Post Remove Task Called")
    }
})

io.on('connection', (socket) => {
    console.log('A User Has Connected')
})

//{useMongoClient: true} parameter no longer needed with mongoDb v5.x
mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connection')
    if (err != null){
        console.log(err);
    }
    else{
        console.log("Connection Successful.")
    }
})

var server = http.listen(3000, () => {
    console.log('server is listening on port ', server.address().port)
})