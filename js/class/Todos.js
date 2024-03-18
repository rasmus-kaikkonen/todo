import { Task } from './Task.js';

class Todos {
    #tasks = [];
    #backend_url = '';

    constructor(backend_url) {
        this.#backend_url = backend_url;
    }

    getTasks = async() => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url)
            .then(response => response.json())
            .then((json) => {
                this.#readJson(json);
                resolve(this.#tasks);
            }, (error) => {
                reject(error);
            });
        })
    }

    addTask = async(text) => {
        return new Promise(async(resolve, reject) => {
            const json = JSON.stringify({description: text});
            fetch(this.#backend_url + '/new', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: json
            })
            .then((response) => response.json())
            .then((json) => {
                resolve(this.#addToArray(json.id, text));
            },(error) => {
                reject(error);
            })
        })
    }

    removeTask = async(id) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'DELETE'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(json.id);
                resolve(json.id);
            }, (error) => {
                reject(error);
            });
        });
    }

    #readJson = (tasksAsJson) => {
        tasksAsJson.forEach(node => {
            const task = new Task(node.id, node.description);
            this.#tasks.push(task);
        });
    }

    #addToArray = (id, text) => {
        const task = new Task(id, text);
        this.#tasks.push(task);
        return task;
    }

    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#tasks.filter(task => task.getId() !== id);
        this.#tasks = arrayWithoutRemoved;
    }
}

export { Todos }