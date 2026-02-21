import { ClosingSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * 締めスライドを生成する
 */
export function generateClosingSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: ClosingSlide,
): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

    // 背景を濃紺にする
    slide.getBackground().setSolidFill(COLORS.PRIMARY);

    // 上部装飾ライン
    addShape(slide, {
        left: 260,
        top: 120,
        width: 200,
        height: 3,
        fill: COLORS.ACCENT,
    });

    // メインテキスト
    addTextBox(slide, {
        left: 60,
        top: 140,
        width: 600,
        height: 80,
        text: 'Thank You',
        fontSize: FONT_SIZES.BIG_TITLE,
        fontColor: COLORS.TEXT_WHITE,
        bold: true,
        fontFamily: FONTS.TITLE,
        alignment: SlidesApp.ParagraphAlignment.CENTER,
    });

    // サブテキスト
    addTextBox(slide, {
        left: 60,
        top: 220,
        width: 600,
        height: 40,
        text: 'ご清聴ありがとうございました',
        fontSize: FONT_SIZES.TITLE_DATE,
        fontColor: COLORS.ACCENT_LIGHT,
        fontFamily: FONTS.BODY,
        alignment: SlidesApp.ParagraphAlignment.CENTER,
    });

    // 下部装飾ライン
    addShape(slide, {
        left: 260,
        top: 275,
        width: 200,
        height: 3,
        fill: COLORS.ACCENT,
    });

    // 装飾ドット
    for (let i = 0; i < 5; i++) {
        addShape(slide, {
            left: 310 + i * 25,
            top: 310,
            width: 6,
            height: 6,
            fill: COLORS.ACCENT,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
    }

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
