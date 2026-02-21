import { HeaderCardsSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

const CARD_ACCENT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

/**
 * ヘッダー付きカードスライドを生成する
 */
export function generateHeaderCardsSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: HeaderCardsSlide,
): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);

    // タイトル
    addTextBox(slide, {
        left: LAYOUT.MARGIN,
        top: LAYOUT.TITLE_Y,
        width: 640,
        height: 35,
        text: data.title,
        fontSize: FONT_SIZES.SLIDE_TITLE,
        fontColor: COLORS.TEXT_DARK,
        bold: true,
        fontFamily: FONTS.TITLE,
    });

    // サブヘッド
    if (data.subhead) {
        addTextBox(slide, {
            left: LAYOUT.MARGIN,
            top: LAYOUT.SUBHEAD_Y,
            width: 640,
            height: 25,
            text: data.subhead,
            fontSize: FONT_SIZES.SUBHEAD,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
        });
    }

    // カードグリッド配置
    const columns = data.columns || 2;
    const totalWidth = 640;
    const gap = LAYOUT.CARD_GAP;
    const cardWidth = (totalWidth - (columns - 1) * gap) / columns;
    const items = data.items;
    const rows = Math.ceil(items.length / columns);
    const cardHeight = Math.min(130, (280 - (rows - 1) * gap) / rows);
    const startY = LAYOUT.CONTENT_Y + 10;

    items.forEach((item, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = LAYOUT.MARGIN + col * (cardWidth + gap);
        const y = startY + row * (cardHeight + gap);
        const accentColor = CARD_ACCENT_COLORS[index % CARD_ACCENT_COLORS.length];

        // カード背景
        addShape(slide, {
            left: x,
            top: y,
            width: cardWidth,
            height: cardHeight,
            fill: COLORS.CARD_BG,
        });

        // 上部アクセントライン
        addShape(slide, {
            left: x,
            top: y,
            width: cardWidth,
            height: 4,
            fill: accentColor,
        });

        // カードタイトル
        addTextBox(slide, {
            left: x + 12,
            top: y + 12,
            width: cardWidth - 24,
            height: 28,
            text: item.title,
            fontSize: FONT_SIZES.CARD_TITLE,
            fontColor: COLORS.TEXT_DARK,
            bold: true,
            fontFamily: FONTS.BODY,
        });

        // カード説明
        addTextBox(slide, {
            left: x + 12,
            top: y + 42,
            width: cardWidth - 24,
            height: cardHeight - 55,
            text: item.desc ?? '',
            fontSize: FONT_SIZES.CARD_DESC,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
