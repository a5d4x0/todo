var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

//指定模板目录
app.set('views', path.join(__dirname, 'views'));
//指定模板类型
app.set('view engine', 'ejs');
//解析HTTP请求体
app.use(bodyParser.json());
//指定静态资源目录
app.use(express.static('public'));

//数据集合
var todos = [
    { id: 1, task: 'The first task', status: 'wait', tags: [{name: 'study'}, {name: 'game'}], date: '2016-4-17', times: '今日待办'},
    { id: 2, task: 'The second task', status: 'doing', tags: [{name: 'study'}, {name: 'game'}], date: '2016-4-18', times: ''},
    { id: 3, task: 'The third task', status: 'done', tags: [{name: 'study'}, {name: 'game'}], date: '2016-4-19', times: '今日待办'}
];

app.get('/', (req, res, next) => {
    res.render('index');
});

//获取所有todos
app.get('/api/todos', (req, res, next) => {
    res.json(todos);
});

//获取单个todo
app.get('/api/todos/:id', (req, res, next) => {
    const searchTodo = todos.filter(todo => todo.id == req.params.id)[0];
    return res.json(searchTodo);
});

//新增todo
app.post('/api/todos', (req, res, next) => {
    const body = req.body;
    const d = new Date;
    let todo = {
        id: todos[todos.length - 1].id + 1,
        task: body.task,
        times: body.times,
        tags: body.tags.split(',').map(name => ({name})),
        date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
        status: 'wait'
    };
    todos.push(todo);
    return res.json(todo);
});

//删除todo
app.delete('/api/todos/:id', (req, res, next) => {
    const searchTodo = todos.filter(todo => todo.id == req.params.id)[0];
    console.log(searchTodo.times);
    todos.splice(todos.indexOf(searchTodo), 1);
    return res.send(searchTodo);
});

//修改单个todo（全量）
app.put('/api/todos/:id', (req, res, next) => {
    let searchTodo = todos.filter(todo => todo.id == req.params.id)[0];
    todos.splice(todos.indexOf(searchTodo), 1, req.body);
    return res.json(req.body);
});

//修改单个todo（部分）
app.patch('/api/todos/:id', (req, res, next) => {
    let searchTodo = todos.filter(todo => todo.id == req.params.id)[0];
    Object.assign(searchTodo, req.body);
    return res.json(searchTodo);
});

app.listen(8080);
console.log('app started');
