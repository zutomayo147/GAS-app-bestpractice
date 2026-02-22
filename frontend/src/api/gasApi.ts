/**
 * Type-safe Promise-based wrapper around google.script.run.
 *
 * Centralising GAS calls here:
 *  - avoids repeating withSuccessHandler / withFailureHandler boilerplate
 *  - makes it easy to swap the transport layer (e.g. during local dev)
 *  - enforces runtime type validation on every response
 */

import type { Todo } from '../types/todo';

/* ------------------------------------------------------------------ */
/* Type guards                                                          */
/* ------------------------------------------------------------------ */

function isTodo(value: unknown): value is Todo {
    return (
        value !== null &&
        typeof value === 'object' &&
        typeof (value as Todo).id === 'string' &&
        typeof (value as Todo).title === 'string' &&
        typeof (value as Todo).completed === 'boolean' &&
        typeof (value as Todo).createdAt === 'number'
    );
}

function isTodoArray(value: unknown): value is Todo[] {
    return Array.isArray(value) && value.every(isTodo);
}

/* ------------------------------------------------------------------ */
/* Helper: check whether the GAS runtime is available                  */
/* ------------------------------------------------------------------ */

function isGasAvailable(): boolean {
    return (
        typeof window !== 'undefined' &&
        typeof (window as Window & typeof globalThis).google !== 'undefined' &&
        !!(window as Window & typeof globalThis).google?.script?.run
    );
}

/* ------------------------------------------------------------------ */
/* Internal Promise wrapper                                             */
/* ------------------------------------------------------------------ */

/**
 * Calls a GAS function by name and returns a Promise.
 * Falls back to `null` in local dev (non-GAS) environments.
 */
function callGas(method: string, ...args: unknown[]): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!isGasAvailable()) {
            reject(new Error('GAS runtime not available'));
            return;
        }
        const runner = (window as Window & typeof globalThis).google.script.run;
        (
            runner
                .withSuccessHandler((res: string) => resolve(res))
                .withFailureHandler((err: Error) => reject(err)) as Record<string, (...a: unknown[]) => void>
        )[method](...args);
    });
}

/* ------------------------------------------------------------------ */
/* Public API                                                           */
/* ------------------------------------------------------------------ */

/** Fetch all todos. Returns an empty array in local dev. */
export async function getTodos(): Promise<Todo[]> {
    if (!isGasAvailable()) {
        // Mock data for local development
        return [{ id: '1', title: 'Start using the ToDo app', completed: false, createdAt: Date.now() }];
    }
    const raw = await callGas('getTodos');
    const parsed: unknown = JSON.parse(raw);
    if (!isTodoArray(parsed)) {
        throw new Error('Unexpected response format for getTodos');
    }
    return parsed;
}

/** Add a todo. Validates title length before sending. Returns the new Todo. */
export async function addTodo(title: string): Promise<Todo> {
    const trimmed = title.trim();
    if (trimmed.length === 0) throw new Error('タイトルを入力してください。');
    if (trimmed.length > 500) throw new Error('タイトルは500文字以内で入力してください。');

    if (!isGasAvailable()) {
        // Mock for local dev
        return { id: Math.random().toString(), title: trimmed, completed: false, createdAt: Date.now() };
    }
    const raw = await callGas('addTodo', trimmed);
    const parsed: unknown = JSON.parse(raw);
    if (!isTodo(parsed)) {
        throw new Error('Unexpected response format for addTodo');
    }
    return parsed;
}

/** Toggle a todo's completed state. */
export async function toggleTodo(id: string): Promise<void> {
    if (!isGasAvailable()) return;
    await callGas('toggleTodo', id);
}

/** Delete a todo. */
export async function deleteTodo(id: string): Promise<void> {
    if (!isGasAvailable()) return;
    await callGas('deleteTodo', id);
}
