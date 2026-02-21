import { BulletCardsSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * カード型箇条書きスライドを生成する
 */
export function generateBulletCardsSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: BulletCardsSlide,
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
        fontColor: COLORS.PRIMARY,
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

    // カード配置
    const items = data.items;
    const cardWidth = (640 - (items.length - 1) * LAYOUT.CARD_GAP) / items.length;
    const cardHeight = 250;
    const startY = LAYOUT.CONTENT_Y + 10;

    items.forEach((item, index) => {
        const x = LAYOUT.MARGIN + index * (cardWidth + LAYOUT.CARD_GAP);

        // カード背景
        addShape(slide, {
            left: x,
            top: startY,
            width: cardWidth,
            height: cardHeight,
            fill: COLORS.CARD_BG,
        });

        // カード上部のアクセントライン
        addShape(slide, {
            left: x,
            top: startY,
            width: cardWidth,
            height: 4,
            fill: COLORS.ACCENT,
        });

        // アイコン風の番号バッジ
        const badge = addShape(slide, {
            left: x + cardWidth / 2 - 18,
            top: startY + 20,
            width: 36,
            height: 36,
            fill: COLORS.ACCENT,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        badge.getText().setText(String(index + 1));
        badge.getText()
            .getTextStyle()
            .setFontSize(16)
            .setForegroundColor(COLORS.TEXT_WHITE)
            .setBold(true)
            .setFontFamily(FONTS.BODY);
        badge.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        // カードタイトル
        addTextBox(slide, {
            left: x + 10,
            top: startY + 70,
            width: cardWidth - 20,
            height: 40,
            text: item.title,
            fontSize: FONT_SIZES.CARD_TITLE,
            fontColor: COLORS.PRIMARY,
            bold: true,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });

        // カード説明
        addTextBox(slide, {
            left: x + 10,
            top: startY + 115,
            width: cardWidth - 20,
            height: 120,
            text: item.desc,
            fontSize: FONT_SIZES.CARD_DESC,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
