import { CompareSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * 比較スライドを生成する
 */
export function generateCompareSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: CompareSlide,
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

    const colWidth = 300;
    const colGap = 20;
    const leftX = LAYOUT.MARGIN;
    const rightX = LAYOUT.MARGIN + colWidth + colGap;
    const headerY = LAYOUT.CONTENT_Y + 5;

    // 左ヘッダー
    const leftHeader = addShape(slide, {
        left: leftX,
        top: headerY,
        width: colWidth,
        height: 35,
        fill: COLORS.COMPARE_LEFT,
    });
    leftHeader.getText().setText(data.leftTitle);
    leftHeader
        .getText()
        .getTextStyle()
        .setFontSize(FONT_SIZES.CARD_TITLE)
        .setForegroundColor(COLORS.TEXT_WHITE)
        .setBold(true)
        .setFontFamily(FONTS.BODY);
    leftHeader.getText().getParagraphs().forEach((p) => {
        p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });

    // 右ヘッダー
    const rightHeader = addShape(slide, {
        left: rightX,
        top: headerY,
        width: colWidth,
        height: 35,
        fill: COLORS.COMPARE_RIGHT,
    });
    rightHeader.getText().setText(data.rightTitle);
    rightHeader
        .getText()
        .getTextStyle()
        .setFontSize(FONT_SIZES.CARD_TITLE)
        .setForegroundColor(COLORS.TEXT_WHITE)
        .setBold(true)
        .setFontFamily(FONTS.BODY);
    rightHeader.getText().getParagraphs().forEach((p) => {
        p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    });

    // VS 中央ラベル
    addTextBox(slide, {
        left: leftX + colWidth,
        top: headerY,
        width: colGap,
        height: 35,
        text: 'VS',
        fontSize: 10,
        fontColor: COLORS.TEXT_GRAY,
        bold: true,
        fontFamily: FONTS.BODY,
        alignment: SlidesApp.ParagraphAlignment.CENTER,
    });

    // 左アイテム
    const itemStartY = headerY + 45;
    const itemH = 55;
    data.leftItems.forEach((item, index) => {
        const y = itemStartY + index * itemH;
        const card = addShape(slide, {
            left: leftX,
            top: y,
            width: colWidth,
            height: itemH - 5,
            fill: '#FEF2F2',
        });
        card.getText().setText(item);
        card.getText()
            .getTextStyle()
            .setFontSize(FONT_SIZES.CARD_DESC)
            .setForegroundColor(COLORS.TEXT_DARK)
            .setFontFamily(FONTS.BODY);
    });

    // 右アイテム
    data.rightItems.forEach((item, index) => {
        const y = itemStartY + index * itemH;
        const card = addShape(slide, {
            left: rightX,
            top: y,
            width: colWidth,
            height: itemH - 5,
            fill: '#EFF6FF',
        });
        card.getText().setText(item);
        card.getText()
            .getTextStyle()
            .setFontSize(FONT_SIZES.CARD_DESC)
            .setForegroundColor(COLORS.TEXT_DARK)
            .setFontFamily(FONTS.BODY);
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
