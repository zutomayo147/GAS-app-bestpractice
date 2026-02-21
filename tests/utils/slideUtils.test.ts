import { ptToEmu } from '../../src/utils/slideUtils';
import { PT_TO_EMU } from '../../src/config/slideConfig';

describe('slideUtils', () => {
    describe('ptToEmu', () => {
        it('should correctly convert pt to EMU', () => {
            const pt = 10;
            const expectedEmu = 10 * PT_TO_EMU; // PT_TO_EMU is 12700
            
            const result = ptToEmu(pt);
            
            expect(result).toBe(expectedEmu);
        });

        it('should correctly handle 0 pt', () => {
             const result = ptToEmu(0);
             expect(result).toBe(0);
        });

        it('should correctly handle decimal pt', () => {
             const pt = 10.5;
             const expectedEmu = 10.5 * PT_TO_EMU;
             
             const result = ptToEmu(pt);
             
             expect(result).toBe(expectedEmu);
        });
    });
});
