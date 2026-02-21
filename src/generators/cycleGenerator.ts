import { CycleSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

const CYCLE_COLORS = [COLORS.CYCLE_1, COLORS.CYCLE_2, COLORS.CYCLE_3, COLORS.CYCLE_4];

/**
 * サイクル図スライドを生成する
 */
export function generateCycleSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: CycleSlide,
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

    // サイクル図の配置
    const centerX = 230;
    const centerY = 245;
    const radius = 110;
    const nodeSize = 75;
    const items = data.items;

    // 中央テキスト
    if (data.centerText) {
        const centerNode = addShape(slide, {
            left: centerX - 45,
            top: centerY - 45,
            width: 90,
            height: 90,
            fill: COLORS.PRIMARY,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        centerNode.getText().setText(data.centerText);
        centerNode
            .getText()
            .getTextStyle()
            .setFontSize(11)
            .setForegroundColor(COLORS.TEXT_WHITE)
            .setBold(true)
            .setFontFamily(FONTS.BODY);
        centerNode.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });
    }

    // 各ノードを円周上に配置（上を0度として時計回り）
    items.forEach((item, index) => {
        const angle = (index / items.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - nodeSize / 2;
        const y = centerY + radius * Math.sin(angle) - nodeSize / 2;
        const color = CYCLE_COLORS[index % CYCLE_COLORS.length];

        // ノード
        const node = addShape(slide, {
            left: x,
            top: y,
            width: nodeSize,
            height: nodeSize,
            fill: color,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        // ラベルは短縮（Planなどのキーワード部分）
        const shortLabel = item.label.split('（')[0].split('(')[0];
        node.getText().setText(shortLabel);
        node.getText()
            .getTextStyle()
            .setFontSize(10)
            .setForegroundColor(COLORS.TEXT_WHITE)
            .setBold(true)
            .setFontFamily(FONTS.BODY);
        node.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        // ノード間の矢印テキスト
        if (items.length > 1) {
            const nextAngle = ((index + 0.5) / items.length) * 2 * Math.PI - Math.PI / 2;
            const arrowX = centerX + (radius + 10) * Math.cos(nextAngle) - 10;
            const arrowY = centerY + (radius + 10) * Math.sin(nextAngle) - 10;
            addTextBox(slide, {
                left: arrowX,
                top: arrowY,
                width: 20,
                height: 20,
                text: '▸',
                fontSize: 14,
                fontColor: COLORS.TEXT_GRAY,
                fontFamily: FONTS.BODY,
                alignment: SlidesApp.ParagraphAlignment.CENTER,
            });
        }

        // サイドに詳細テキスト
        addTextBox(slide, {
            left: 420,
            top: LAYOUT.CONTENT_Y + 15 + index * 68,
            width: 260,
            height: 60,
            text: `${item.label}\n${item.subLabel}`,
            fontSize: FONT_SIZES.CARD_DESC,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });

        // カラーバー
        addShape(slide, {
            left: 413,
            top: LAYOUT.CONTENT_Y + 15 + index * 68,
            width: 4,
            height: 50,
            fill: color,
        });
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
