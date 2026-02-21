import { PresentationSettings } from '../domain/slideTypes';

/** スライドサイズ（pt） */
export const SLIDE_WIDTH = 720;
export const SLIDE_HEIGHT = 405;

/** EMU変換定数 */
export const PT_TO_EMU = 12700;
export const INCH_TO_EMU = 914400;

/** デフォルトカラー定義 */
const DEFAULT_COLORS = {
    PRIMARY: '#bebebe',
    PRIMARY_LIGHT: '#2D4A7A',
    ACCENT: '#3B82F6',
    SECONDARY: '#EF4444', // ACCENTの対の色として常用する
    ACCENT_LIGHT: '#60A5FA',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    SECTION_BG: '#1E3A5F',
    BG_WHITE: '#FFFFFF',
    TEXT_WHITE: '#FFFFFF',
    TEXT_DARK: '#1F2937',
    TEXT_GRAY: '#6B7280',
    BG_LIGHT: '#F3F4F6',
    CARD_BG: '#F8FAFC',
    COMPARE_LEFT: '#EF4444',
    COMPARE_RIGHT: '#3B82F6',
    CYCLE_1: '#3B82F6',
    CYCLE_2: '#10B981',
    CYCLE_3: '#F59E0B',
    CYCLE_4: '#EF4444',
    PYRAMID_1: '#1B2A4A',
    PYRAMID_2: '#2D4A7A',
    PYRAMID_3: '#3B82F6',
};

/** 現在のカラー設定（可変） */
let currentColors = { ...DEFAULT_COLORS };

/** カラーパレットへのアクセサ */
export const COLORS = new Proxy(currentColors, {
    get: (target, prop: keyof typeof DEFAULT_COLORS) => target[prop] || DEFAULT_COLORS[prop],
});

/** デフォルトフォント定義 */
const DEFAULT_FONTS = {
    TITLE: 'Noto Sans JP',
    BODY: 'Noto Sans JP',
    CAPTION: 'Noto Sans JP',
};

/** 現在のフォント設定（可変） */
let currentFonts = { ...DEFAULT_FONTS };

/** フォントへのアクセサ */
export const FONTS = new Proxy(currentFonts, {
    get: (target, prop: keyof typeof DEFAULT_FONTS) => target[prop] || DEFAULT_FONTS[prop],
});

/**
 * 設定を更新する
 */
export function updateConfig(settings: PresentationSettings): void {
    if (!settings) return;

    // カラー更新
    if (settings.themeColor) {
        currentColors.PRIMARY = settings.themeColor;
        // 簡易的に明色を作成（実際にはHSL変換などが望ましいが、一旦単純な置換や固定値で代用）
        // ここではPRIMARYが変更された場合のみ、関連する色も更新するロジックを入れる場所
    }

    // フォント更新
    if (settings.fontFamily) {
        currentFonts.TITLE = settings.fontFamily;
        currentFonts.BODY = settings.fontFamily;
        currentFonts.CAPTION = settings.fontFamily;
    }
}

/** フッターテキスト（設定保持用） */
export const GLOBAL_SETTINGS = {
    footerText: '',
};

/** フォントサイズ（pt） */
export const FONT_SIZES = {
    /** スライドタイトル */
    SLIDE_TITLE: 28,
    /** サブヘッド */
    SUBHEAD: 14,
    /** 本文 */
    BODY: 12,
    /** 小テキスト */
    SMALL: 10,
    /** セクション番号 */
    SECTION_NO: 60,
    /** セクションタイトル */
    SECTION_TITLE: 32,
    /** カードタイトル */
    CARD_TITLE: 14,
    /** カード説明 */
    CARD_DESC: 11,
    /** タイトルスライドメイン */
    TITLE_MAIN: 36,
    /** タイトルスライド日付 */
    TITLE_DATE: 16,
    /** 大タイトル */
    BIG_TITLE: 44,
} as const;

/** マージン・パディング（pt） */
export const LAYOUT = {
    MARGIN: 40,
    PADDING: 20,
    CARD_GAP: 15,
    TITLE_Y: 30,
    SUBHEAD_Y: 65,
    CONTENT_Y: 95,
} as const;
