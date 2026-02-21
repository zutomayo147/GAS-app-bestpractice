import { AgendaSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * アジェンダスライドを生成する
 */
export function generateAgendaSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: AgendaSlide,
): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

    // 背景
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);

    // 左サイドバー装飾
    addShape(slide, {
        left: 0,
        top: 0,
        width: 5,
        height: 405,
        fill: COLORS.ACCENT,
    });

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

    // アジェンダアイテム
    const startY = LAYOUT.CONTENT_Y + 5;
    const itemHeight = 50;

    data.items.forEach((item, index) => {
        const y = startY + index * itemHeight;

        // 番号バッジ
        const badge = addShape(slide, {
            left: LAYOUT.MARGIN,
            top: y,
            width: 32,
            height: 32,
            fill: COLORS.ACCENT,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        badge.getText().setText(String(index + 1));
        badge.getText().getTextStyle().setFontSize(14).setForegroundColor(COLORS.TEXT_WHITE).setBold(true).setFontFamily(FONTS.BODY);
        badge.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        // アイテムテキスト
        addTextBox(slide, {
            left: LAYOUT.MARGIN + 45,
            top: y + 2,
            width: 580,
            height: 30,
            text: item,
            fontSize: FONT_SIZES.BODY + 2,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });

        // 区切りライン（最後以外）
        if (index < data.items.length - 1) {
            addShape(slide, {
                left: LAYOUT.MARGIN + 45,
                top: y + 40,
                width: 580,
                height: 1,
                fill: COLORS.BG_LIGHT,
            });
        }
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
