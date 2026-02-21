import { ProcessSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * プロセス手順スライドを生成する
 */
export function generateProcessSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: ProcessSlide,
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

    // ステップ配置
    const steps = data.steps;
    const totalWidth = 640;
    const arrowWidth = 20;
    const availableWidth = totalWidth - (steps.length - 1) * arrowWidth;
    const stepWidth = availableWidth / steps.length;
    const stepHeight = 220;
    const startY = LAYOUT.CONTENT_Y + 25;

    steps.forEach((step, index) => {
        const x = LAYOUT.MARGIN + index * (stepWidth + arrowWidth);

        // ステップ番号バッジ
        const badge = addShape(slide, {
            left: x + stepWidth / 2 - 20,
            top: startY,
            width: 40,
            height: 40,
            fill: COLORS.ACCENT,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        badge.getText().setText(String(index + 1));
        badge.getText()
            .getTextStyle()
            .setFontSize(18)
            .setForegroundColor(COLORS.TEXT_WHITE)
            .setBold(true)
            .setFontFamily(FONTS.BODY);
        badge.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        // ステップカード
        addShape(slide, {
            left: x,
            top: startY + 50,
            width: stepWidth,
            height: stepHeight - 50,
            fill: COLORS.CARD_BG,
        });

        // ステップテキスト
        addTextBox(slide, {
            left: x + 5,
            top: startY + 65,
            width: stepWidth - 10,
            height: stepHeight - 70,
            text: step,
            fontSize: FONT_SIZES.CARD_DESC,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });

        // 矢印（最後以外）
        if (index < steps.length - 1) {
            const arrowX = x + stepWidth;
            addTextBox(slide, {
                left: arrowX,
                top: startY + stepHeight / 2 - 5,
                width: arrowWidth,
                height: 30,
                text: '→',
                fontSize: 20,
                fontColor: COLORS.ACCENT,
                bold: true,
                fontFamily: FONTS.BODY,
                alignment: SlidesApp.ParagraphAlignment.CENTER,
            });
        }
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
