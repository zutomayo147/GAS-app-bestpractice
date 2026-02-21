export {};

declare global {
    interface Window {
        google: {
            script: {
                run: {
                    withSuccessHandler: (callback: (response: string) => void) => unknown;
                    withFailureHandler: (callback: (error: Error) => void) => unknown;
                } & Record<string, unknown>;
            };
        };
    }
}
