export {};

declare global {
  interface Window {
    google: {
      script: {
        run: {
          withSuccessHandler: (callback: (response: any) => void) => {
            withFailureHandler: (callback: (error: Error) => void) => {
              createPresentationFromFrontend: (jsonData: string, settingsJson: string) => void;
            };
          };
        };
      };
    };
  }
}
