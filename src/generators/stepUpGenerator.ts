import { StepUpSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * 階段式ステップスライドを生成する
 */
export function generateStepUpSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: StepUpSlide,
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

    // 階段ステップ配置
    const items = data.items;
    const totalWidth = 640;
    const stepWidth = totalWidth / items.length;
    const maxHeight = 260;
    const baseY = LAYOUT.CONTENT_Y + maxHeight + 10;

    items.forEach((item, index) => {
        const x = LAYOUT.MARGIN + index * stepWidth;
        const stepHeight = ((index + 1) / items.length) * maxHeight;
        const y = baseY - stepHeight;

        // アクセントの濃淡
        const opacity = 0.4 + (index / items.length) * 0.6;
        const r = Math.round(59 * opacity + 255 * (1 - opacity));
        const g = Math.round(130 * opacity + 255 * (1 - opacity));
        const b = Math.round(246 * opacity + 255 * (1 - opacity));
        const fillColor =
            '#' +
            r.toString(16).padStart(2, '0') +
            g.toString(16).padStart(2, '0') +
            b.toString(16).padStart(2, '0');

        // ステップブロック
        addShape(slide, {
            left: x,
            top: y,
            width: stepWidth - 3,
            height: stepHeight,
            fill: fillColor,
        });

        // ステップ番号
        addTextBox(slide, {
            left: x + 5,
            top: y + 8,
            width: stepWidth - 13,
            height: 20,
            text: `STEP ${index + 1}`,
            fontSize: 9,
            fontColor: index >= items.length / 2 ? COLORS.TEXT_WHITE : COLORS.PRIMARY,
            bold: true,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });

        // ステップタイトル
        addTextBox(slide, {
            left: x + 5,
            top: y + 28,
            width: stepWidth - 13,
            height: 25,
            text: item.title,
            fontSize: FONT_SIZES.CARD_TITLE - 1,
            fontColor: index >= items.length / 2 ? COLORS.TEXT_WHITE : COLORS.PRIMARY,
            bold: true,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });

        // ステップ説明（高さに余裕があれば）
        if (stepHeight > 80) {
            addTextBox(slide, {
                left: x + 5,
                top: y + 55,
                width: stepWidth - 13,
                height: stepHeight - 65,
                text: item.desc,
                fontSize: FONT_SIZES.SMALL,
                fontColor: index >= items.length / 2 ? COLORS.TEXT_WHITE : COLORS.TEXT_GRAY,
                fontFamily: FONTS.BODY,
                alignment: SlidesApp.ParagraphAlignment.CENTER,
            });
        }
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
