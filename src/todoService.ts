import { Todo } from './todoTypes';

const TODOS_KEY = 'todo_app_data';

/**
 * Runtime type guard: checks that a parsed value is a valid Todo array.
 * This prevents broken / tampered storage data from propagating through the app.
 */
function isTodoArray(value: unknown): value is Todo[] {
    if (!Array.isArray(value)) return false;
    return value.every(
        (item) =>
            item !== null &&
            typeof item === 'object' &&
            typeof (item as Todo).id === 'string' &&
            typeof (item as Todo).title === 'string' &&
            typeof (item as Todo).completed === 'boolean' &&
            typeof (item as Todo).createdAt === 'number',
    );
}

export class TodoService {
    /**
     * Get all todos from CacheService, fallback to PropertiesService.
     * Applies runtime type validation after parsing to guard against corrupted data.
     */
    static getTodos(): Todo[] {
        const cache = CacheService.getUserCache();
        const cachedData = cache?.get(TODOS_KEY);

        if (cachedData) {
            try {
                const parsed: unknown = JSON.parse(cachedData);
                if (isTodoArray(parsed)) {
                    return parsed;
                }
                // Cached data is structurally invalid — remove it and fall through
                console.warn('Cached todos failed type validation; evicting cache entry.');
                cache?.remove(TODOS_KEY);
            } catch (error) {
                console.warn('Failed to parse cached todos; evicting cache entry.', error);
                cache?.remove(TODOS_KEY);
            }
        }

        const properties = PropertiesService.getUserProperties();
        const data = properties.getProperty(TODOS_KEY);

        if (!data) return [];

        try {
            const parsed: unknown = JSON.parse(data);
            if (!isTodoArray(parsed)) {
                // Stored data is structurally invalid — reset to prevent data poisoning
                console.error('Stored todos failed type validation; resetting storage.');
                properties.deleteProperty(TODOS_KEY);
                return [];
            }
            // Warm up cache after reading from properties
            cache?.put(TODOS_KEY, data, 21600); // Cache for 6 hours (max)
            return parsed;
        } catch (error) {
            console.error('Failed to parse todos from PropertiesService; resetting storage.', error);
            properties.deleteProperty(TODOS_KEY);
            return [];
        }
    }

    /**
     * Save todos to both CacheService and PropertiesService.
     */
    static saveTodos(todos: Todo[]): void {
        const dataStr = JSON.stringify(todos);

        // Persist to properties (authoritative store)
        const properties = PropertiesService.getUserProperties();
        properties.setProperty(TODOS_KEY, dataStr);

        // Update cache (best-effort)
        const cache = CacheService.getUserCache();
        try {
            cache?.put(TODOS_KEY, dataStr, 21600);
        } catch (error) {
            console.warn('Failed to update cache', error);
        }
    }

    /**
     * Add a new todo.
     * The caller (index.ts) is responsible for validating the title before calling this.
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
     * Toggle a todo's completed status.
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
     * Delete a todo.
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
