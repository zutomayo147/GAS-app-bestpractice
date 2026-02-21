import { Todo } from './todoTypes';

const TODOS_KEY = 'todo_app_data';

export class TodoService {
    /**
     * Get all todos from CacheService, fallback to PropertiesService
     */
    static getTodos(): Todo[] {
        const cache = CacheService.getUserCache();
        const cachedData = cache?.get(TODOS_KEY);

        if (cachedData) {
            try {
                return JSON.parse(cachedData) as Todo[];
            } catch (error) {
                console.warn('Failed to parse cached todos', error);
                // Continue to properties service if cache parsing fails
            }
        }

        const properties = PropertiesService.getUserProperties();
        const data = properties.getProperty(TODOS_KEY);

        if (!data) return [];

        try {
            const todos = JSON.parse(data) as Todo[];
            // Update cache after reading from properties
            cache?.put(TODOS_KEY, data, 21600); // Cache for 6 hours (max)
            return todos;
        } catch (error) {
            console.error('Failed to parse todos from PropertiesService', error);
            return [];
        }
    }

    /**
     * Save todos to both CacheService and PropertiesService
     */
    static saveTodos(todos: Todo[]): void {
        const dataStr = JSON.stringify(todos);

        // Save to properties
        const properties = PropertiesService.getUserProperties();
        properties.setProperty(TODOS_KEY, dataStr);

        // Save to cache
        const cache = CacheService.getUserCache();
        try {
            cache?.put(TODOS_KEY, dataStr, 21600);
        } catch (error) {
            console.warn('Failed to update cache', error);
        }
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
