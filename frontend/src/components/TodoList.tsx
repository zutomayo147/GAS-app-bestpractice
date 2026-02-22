import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import * as gasApi from '../api/gasApi';

/* ------------------------------------------------------------------ */
/* Simple inline error toast                                            */
/* ------------------------------------------------------------------ */

interface ErrorBannerProps {
    message: string;
    onDismiss: () => void;
}

function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
    return (
        <div
            role="alert"
            className="flex items-center justify-between gap-2 px-4 py-3 mb-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm"
        >
            <span>{message}</span>
            <button
                onClick={onDismiss}
                aria-label="エラーを閉じる"
                className="shrink-0 text-red-500 hover:text-red-700"
            >
                ✕
            </button>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* TodoList                                                             */
/* ------------------------------------------------------------------ */

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const showError = (msg: string) => setErrorMessage(msg);
    const clearError = () => setErrorMessage(null);

    /** Load all todos from GAS (or mock in local dev). */
    const loadTodos = useCallback(async () => {
        setIsLoading(true);
        clearError();
        try {
            const data = await gasApi.getTodos();
            setTodos(data);
        } catch (err) {
            console.error('Failed to load todos:', err);
            showError('タスクの読み込みに失敗しました。ページを再読み込みしてください。');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const title = inputValue.trim();
        if (!title) return;

        setInputValue(''); // Optimistic clear
        clearError();

        try {
            const newTodo = await gasApi.addTodo(title);
            setTodos((prev) => [...prev, newTodo]);
        } catch (err) {
            console.error('Failed to add todo:', err);
            setInputValue(title); // Revert on error
            showError(err instanceof Error ? err.message : 'タスクの追加に失敗しました。');
        }
    };

    const handleToggle = async (id: string) => {
        // Optimistic update
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
        clearError();

        try {
            await gasApi.toggleTodo(id);
        } catch (err) {
            console.error('Failed to toggle todo:', err);
            // Revert on error
            setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
            showError('タスクの更新に失敗しました。');
        }
    };

    const handleDelete = async (id: string) => {
        const previousTodos = [...todos];
        // Optimistic update
        setTodos((prev) => prev.filter((t) => t.id !== id));
        clearError();

        try {
            await gasApi.deleteTodo(id);
        } catch (err) {
            console.error('Failed to delete todo:', err);
            setTodos(previousTodos); // Revert on error
            showError('タスクの削除に失敗しました。');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Tasks</h1>

            {errorMessage && <ErrorBanner message={errorMessage} onDismiss={clearError} />}

            <form onSubmit={handleAdd} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?"
                    maxLength={500}
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
