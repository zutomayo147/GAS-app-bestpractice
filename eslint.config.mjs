import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts', 'tests/**/*.ts'],
        languageOptions: {
            globals: {
                // GAS global objects
                PropertiesService: 'readonly',
                ContentService: 'readonly',
                Logger: 'readonly',
                SpreadsheetApp: 'readonly',
                DriveApp: 'readonly',
                DocumentApp: 'readonly',
                SlidesApp: 'readonly',
                FormApp: 'readonly',
                GmailApp: 'readonly',
                CalendarApp: 'readonly',
                UrlFetchApp: 'readonly',
                HtmlService: 'readonly',
                ScriptApp: 'readonly',
                Utilities: 'readonly',
                CacheService: 'readonly',
                LockService: 'readonly',
                Session: 'readonly',
                // Node/Jest globals for test files
                global: 'writable',
                describe: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly',
            },
        },
        rules: {
            'no-console': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    {
        ignores: ['node_modules/', 'dist/', 'webpack.config.js', 'jest.config.js'],
    },
);
