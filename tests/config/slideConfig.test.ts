import { updateConfig, COLORS, FONTS } from '../../src/config/slideConfig';
import { PresentationSettings } from '../../src/domain/slideTypes';

describe('slideConfig', () => {
    describe('updateConfig', () => {
        const makeSettings = (partial: Partial<PresentationSettings>): PresentationSettings => ({
            presetName: 'test',
            themeColor: '',
            fontFamily: '',
            footerText: '',
            outputFolderUrl: '',
            ...partial,
        });

        it('should update PRIMARY color when themeColor is provided', () => {
            const settings = makeSettings({ themeColor: '#FF5733' });
            updateConfig(settings);
            expect(COLORS.PRIMARY).toBe('#FF5733');
        });

        it('should not change PRIMARY color when themeColor is empty', () => {
            // 空のthemeColorは変更しない
            const before = COLORS.PRIMARY;
            const settings = makeSettings({ themeColor: '' });
            updateConfig(settings);
            // 空文字列は falsy なので変更されないはず
            expect(COLORS.PRIMARY).toBe(before);
        });

        it('should update TITLE, BODY, and CAPTION font when fontFamily is provided', () => {
            const settings = makeSettings({ fontFamily: 'Roboto' });
            updateConfig(settings);
            expect(FONTS.TITLE).toBe('Roboto');
            expect(FONTS.BODY).toBe('Roboto');
            expect(FONTS.CAPTION).toBe('Roboto');
        });

        it('should not change fonts when fontFamily is empty', () => {
            // 先にフォントを設定しておく
            updateConfig(makeSettings({ fontFamily: 'Noto Sans JP' }));
            const before = FONTS.TITLE;

            // 空文字列では変更されないはず
            updateConfig(makeSettings({ fontFamily: '' }));
            expect(FONTS.TITLE).toBe(before);
        });
    });
});
