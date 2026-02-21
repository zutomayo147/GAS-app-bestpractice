import { PyramidSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

const PYRAMID_COLORS = [COLORS.PYRAMID_1, COLORS.PYRAMID_2, COLORS.PYRAMID_3];

/**
 * ピラミッドスライドを生成する
 */
export function generatePyramidSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: PyramidSlide,
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

    // ピラミッド描画
    const levels = data.levels;
    const pyramidTop = LAYOUT.CONTENT_Y + 15;
    const totalHeight = 270;
    const levelHeight = totalHeight / levels.length;
    const centerX = 230;
    const maxWidth = 280;
    const minWidth = 120;

    levels.forEach((level, index) => {
        const y = pyramidTop + index * levelHeight;
        const widthRatio = (index + 1) / levels.length;
        const width = minWidth + (maxWidth - minWidth) * widthRatio;
        const x = centerX - width / 2;
        const color = PYRAMID_COLORS[index % PYRAMID_COLORS.length];

        // 台形をRECTANGLEで近似
        const shape = addShape(slide, {
            left: x,
            top: y,
            width: width,
            height: levelHeight - 5,
            fill: color,
        });

        shape.getText().setText(level.title);
        shape.getText()
            .getTextStyle()
            .setFontSize(FONT_SIZES.CARD_TITLE)
            .setForegroundColor(COLORS.TEXT_WHITE)
            .setBold(true)
            .setFontFamily(FONTS.BODY);
        shape.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        // 右にラベル
        addTextBox(slide, {
            left: centerX + maxWidth / 2 + 30,
            top: y + 5,
            width: 280,
            height: levelHeight - 10,
            text: level.description,
            fontSize: FONT_SIZES.CARD_DESC,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
