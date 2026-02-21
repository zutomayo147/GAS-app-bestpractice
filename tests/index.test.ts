import { extractTitle } from '../src/index';
import { SlideData } from '../src/domain/slideTypes';

describe('index', () => {
    describe('extractTitle', () => {
        it('should return the title from the first title-type slide', () => {
            const jsonData: SlideData[] = [
                { type: 'title', title: 'テストプレゼン', date: '2026.01.01' },
            ];
            expect(extractTitle(jsonData)).toBe('テストプレゼン');
        });

        it('should return only the first line if the title contains a newline', () => {
            const jsonData: SlideData[] = [
                { type: 'title', title: '1行目のタイトル\n2行目のサブタイトル', date: '2026.01.01' },
            ];
            expect(extractTitle(jsonData)).toBe('1行目のタイトル');
        });

        it('should return the default value when no title-type slide exists', () => {
            const jsonData: SlideData[] = [
                { type: 'section', title: 'セクション1' },
            ];
            expect(extractTitle(jsonData)).toBe('New Presentation');
        });

        it('should return the default value for an empty array', () => {
            expect(extractTitle([])).toBe('New Presentation');
        });
    });
});
