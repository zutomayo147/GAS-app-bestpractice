import { TodoService } from './todoService';
import { isValidTitle, isValidId, MAX_TITLE_LENGTH } from './validation';

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
 * Validates that the title is a non-empty string within the allowed length.
 */
global.addTodo = (title: string) => {
    if (!isValidTitle(title)) {
        throw new Error(`Invalid title: must be a non-empty string (max ${MAX_TITLE_LENGTH} characters).`);
    }
    return JSON.stringify(TodoService.addTodo(title.trim()));
};

/**
 * Frontend API: Toggle a todo
 * Validates that the id is a valid UUID v4 to prevent arbitrary key manipulation.
 */
global.toggleTodo = (id: string) => {
    if (!isValidId(id)) {
        throw new Error('Invalid id: must be a valid UUID v4.');
    }
    return JSON.stringify(TodoService.toggleTodo(id));
};

/**
 * Frontend API: Delete a todo
 * Validates that the id is a valid UUID v4 to prevent arbitrary key manipulation.
 */
global.deleteTodo = (id: string) => {
    if (!isValidId(id)) {
        throw new Error('Invalid id: must be a valid UUID v4.');
    }
    return JSON.stringify({ success: TodoService.deleteTodo(id) });
};
