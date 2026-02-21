import { hexToRgb } from '../../src/utils/colorUtils';

describe('colorUtils', () => {
    describe('hexToRgb', () => {
        it('should correctly convert a full hex color code to RGB', () => {
            const result = hexToRgb('#FF0000');
            expect(result).toEqual({ red: 1, green: 0, blue: 0 });

            const result2 = hexToRgb('#00FF00');
            expect(result2).toEqual({ red: 0, green: 1, blue: 0 });

            const result3 = hexToRgb('#0000FF');
            expect(result3).toEqual({ red: 0, green: 0, blue: 1 });
            
            const result4 = hexToRgb('#FFFFFF');
            expect(result4).toEqual({ red: 1, green: 1, blue: 1 });

            const result5 = hexToRgb('#000000');
            expect(result5).toEqual({ red: 0, green: 0, blue: 0 });
        });

        it('should handle hex codes without the hash symbol', () => {
             const result = hexToRgb('FF0000');
             expect(result).toEqual({ red: 1, green: 0, blue: 0 });
        });

        it('should convert mixed colors correctly', () => {
            const result = hexToRgb('#808080');
            // 128 / 255 = 0.5019607843137255
            expect(result.red).toBeCloseTo(0.50196, 4);
            expect(result.green).toBeCloseTo(0.50196, 4);
            expect(result.blue).toBeCloseTo(0.50196, 4);
        });
    });
});
