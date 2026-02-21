import { TodoService } from './todoService';

// Extend the global object to hold GAS entry points properly
declare global {
    var doGet: (e: GoogleAppsScript.Events.DoGet) => GoogleAppsScript.HTML.HtmlOutput;
    var getTodos: () => string;
    var addTodo: (title: string) => string;
    var toggleTodo: (id: string) => string;
    var deleteTodo: (id: string) => string;
}

global.doGet = (_e: GoogleAppsScript.Events.DoGet) => {
    return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('React ToDo App')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
};

/**
 * Frontend API: Get all todos
 */
global.getTodos = () => {
    return JSON.stringify(TodoService.getTodos());
};

/**
 * Frontend API: Add a new todo
 */
global.addTodo = (title: string) => {
    return JSON.stringify(TodoService.addTodo(title));
};

/**
 * Frontend API: Toggle a todo
 */
global.toggleTodo = (id: string) => {
    return JSON.stringify(TodoService.toggleTodo(id));
};

/**
 * Frontend API: Delete a todo
 */
global.deleteTodo = (id: string) => {
    return JSON.stringify({ success: TodoService.deleteTodo(id) });
};
