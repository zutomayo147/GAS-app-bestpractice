import { TodoService } from './todoService';

declare let global: any;

global.doGet = (_e: any) => {
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
