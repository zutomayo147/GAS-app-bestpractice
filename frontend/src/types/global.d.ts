export {};

declare global {
    interface Window {
        google: {
            script: {
                run: GasRunner;
            };
        };
    }
}

/**
 * Typed interface for google.script.run.
 * Listing each method explicitly prevents accidentally calling non-existent GAS functions
 * and documents the public API surface.
 */
interface GasRunner {
    withSuccessHandler(callback: (response: string) => void): GasRunner;
    withFailureHandler(callback: (error: Error) => void): GasRunner;
    getTodos(): void;
    addTodo(title: string): void;
    toggleTodo(id: string): void;
    deleteTodo(id: string): void;
}
