import { TitleSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * タイトルスライドを生成する
 */
export function generateTitleSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: TitleSlide,
): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

    // 背景を濃紺にする
    slide.getBackground().setSolidFill(COLORS.PRIMARY);

    // 左サイドの装飾バー
    addShape(slide, {
        left: 0,
        top: 0,
        width: 8,
        height: 405,
        fill: COLORS.ACCENT,
    });

    // アクセントの横ライン
    addShape(slide, {
        left: 60,
        top: 175,
        width: 100,
        height: 3,
        fill: COLORS.ACCENT,
    });

    // メインタイトル
    const titleLines = data.title.split('\n');
    addTextBox(slide, {
        left: 60,
        top: 185,
        width: 600,
        height: 120,
        text: titleLines.join('\n'),
        fontSize: FONT_SIZES.TITLE_MAIN,
        fontColor: COLORS.TEXT_WHITE,
        bold: true,
        fontFamily: FONTS.TITLE,
    });

    // 日付
    if (data.date) {
        addTextBox(slide, {
            left: 60,
            top: 320,
            width: 300,
            height: 30,
            text: data.date,
            fontSize: FONT_SIZES.TITLE_DATE,
            fontColor: COLORS.ACCENT_LIGHT,
            fontFamily: FONTS.BODY,
        });
    }

    // 右下の装飾ドット
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            addShape(slide, {
                left: 620 + i * 20,
                top: 340 + j * 20,
                width: 6,
                height: 6,
                fill: COLORS.ACCENT,
                shapeType: SlidesApp.ShapeType.ELLIPSE,
            });
        }
    }

    // スピーカーノート
    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
