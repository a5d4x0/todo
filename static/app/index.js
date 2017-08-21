import Stefan from '../framework';

fetch('/api/todos').then(response =>response.json())
.then(todos => {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    function changeStatus(id, status) {
        return fetch('/api/todos/' + id, {
            method: 'PATCH',
            body: JSON.stringify({
                status
            }),
            headers
        })
        .then(response =>response.json());
    }

    new Stefan({
        el: '#root', 
        data: {
            title: 'TODO LIST',
            addShow: 'hide',
            todos
        },
        handlers: {
            addTask: (e, data) => {
                data.addShow = 'show';
            },
            changeAddContent: (e, data) => {
                data.addContent = e.target.value;
            },
            changeAddTags: (e, data) => {
                data.addTags = e.target.value;
            },
            stateWait: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                changeStatus(todo.id, 'wait').then(ret => todo.status = ret.status);
            },
            stateDoing: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                changeStatus(todo.id, 'doing').then(ret => todo.status = ret.status);
            },
            stateDone: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                changeStatus(todo.id, 'done').then(ret => todo.status = ret.status);
            },
            submit: (e, data) => {
                e.preventDefault();
                fetch('/api/todos', {
                    method: 'POST',
                    body: JSON.stringify({
                        tags: data.addTags,
                        task: data.addContent
                    }),
                    headers
                })
                .then(response =>response.json())
                .then(todo => {
                    data.todos.push(todo);
                    data.addShow = 'hide';
                });
            },
            delTask: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                return fetch('/api/todos/' + todo.id, {
                    method: 'DELETE'
                })
                .then(response =>response.json())
                .then(delTodo => {
                    const searchTodo = data.todos.filter(todo => todo.id == delTodo.id)[0];
                    data.todos.splice(data.todos.indexOf(searchTodo), 1);
                });
            }
        }
    });
});