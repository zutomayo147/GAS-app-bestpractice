import { extractFolderId } from '../../src/services/slideService';

describe('slideService', () => {
    describe('extractFolderId', () => {
        it('should extract folder ID from a standard Google Drive folder URL', () => {
            // 標準的なGoogle DriveフォルダURL
            const url = 'https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ12345';
            const result = extractFolderId(url);
            expect(result).toBe('1aBcDeFgHiJkLmNoPqRsTuVwXyZ12345');
        });

        it('should extract folder ID from a Google Drive URL with query params', () => {
            // クエリパラメータ付きURL
            const url = 'https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ12345?usp=sharing';
            const result = extractFolderId(url);
            expect(result).toBe('1aBcDeFgHiJkLmNoPqRsTuVwXyZ12345');
        });

        it('should return null for a short or invalid URL', () => {
            // 短すぎるIDや無効なURL
            const result = extractFolderId('https://example.com/short/abc123');
            expect(result).toBeNull();
        });

        it('should return null for an empty string', () => {
            const result = extractFolderId('');
            expect(result).toBeNull();
        });
    });
});
