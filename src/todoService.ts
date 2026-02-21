import { Todo } from './todoTypes';

const TODOS_KEY = 'todo_app_data';

export class TodoService {
    /**
     * Get all todos from PropertiesService
     */
    static getTodos(): Todo[] {
        const properties = PropertiesService.getUserProperties();
        const data = properties.getProperty(TODOS_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data) as Todo[];
        } catch {
            return [];
        }
    }

    /**
     * Save todos to PropertiesService
     */
    static saveTodos(todos: Todo[]): void {
        const properties = PropertiesService.getUserProperties();
        properties.setProperty(TODOS_KEY, JSON.stringify(todos));
    }

    /**
     * Add a new todo
     */
    static addTodo(title: string): Todo {
        const todos = this.getTodos();
        const newTodo: Todo = {
            id: Utilities.getUuid(),
            title,
            completed: false,
            createdAt: Date.now(),
        };
        todos.push(newTodo);
        this.saveTodos(todos);
        return newTodo;
    }

    /**
     * Toggle a todo's completed status
     */
    static toggleTodo(id: string): Todo | null {
        const todos = this.getTodos();
        const index = todos.findIndex((t) => t.id === id);
        if (index === -1) return null;

        todos[index].completed = !todos[index].completed;
        this.saveTodos(todos);
        return todos[index];
    }

    /**
     * Delete a todo
     */
    static deleteTodo(id: string): boolean {
        const todos = this.getTodos();
        const initialLength = todos.length;
        const newTodos = todos.filter((t) => t.id !== id);

        if (newTodos.length !== initialLength) {
            this.saveTodos(newTodos);
            return true;
        }
        return false;
    }
}
