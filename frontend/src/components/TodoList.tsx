import { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

declare const google: unknown;

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadTodos = () => {
        setIsLoading(true);
        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withSuccessHandler((response: string) => {
                    const parsed = JSON.parse(response);
                    setTodos(parsed);
                    setIsLoading(false);
                })
                .withFailureHandler((error: unknown) => {
                    console.error('Failed to load todos:', error);
                    setIsLoading(false);
                })
                .getTodos();
        } else {
            // Mock data for local testing
            setTodos([{ id: '1', title: 'Start using the ToDo app', completed: false, createdAt: Date.now() }]);
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        // eslint-disable-next-line
        loadTodos();
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const title = inputValue.trim();
        setInputValue(''); // Optimistic clear

        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withSuccessHandler((response: string) => {
                    const newTodo = JSON.parse(response);
                    setTodos((prev) => [...prev, newTodo]);
                })
                .withFailureHandler((error: unknown) => {
                    console.error('Failed to add todo:', error);
                    setInputValue(title); // revert on error
                })
                .addTodo(title);
        } else {
            const newTodo: Todo = {
                id: Math.random().toString(),
                title,
                completed: false,
                createdAt: Date.now(),
            };
            setTodos((prev) => [...prev, newTodo]);
        }
    };

    const handleToggle = (id: string) => {
        // Optimistic UI update
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withFailureHandler((error: unknown) => {
                    console.error('Failed to toggle todo:', error);
                    // Revert on error
                    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
                })
                .toggleTodo(id);
        }
    };

    const handleDelete = (id: string) => {
        // Optimistic UI update
        const previousTodos = [...todos];
        setTodos((prev) => prev.filter((t) => t.id !== id));

        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withFailureHandler((error: unknown) => {
                    console.error('Failed to delete todo:', error);
                    // Revert on error
                    setTodos(previousTodos);
                })
                .deleteTodo(id);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Tasks</h1>

            <form onSubmit={handleAdd} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Add
                </button>
            </form>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : todos.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No tasks yet. Add one above!</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {todos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
                        ))}
                    </ul>
                )}
            </div>

            {!isLoading && todos.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                    {todos.filter((t) => t.completed).length} of {todos.length} tasks completed
                </div>
            )}
        </div>
    );
}
