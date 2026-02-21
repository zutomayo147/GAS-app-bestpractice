import { TriangleSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

const TRIANGLE_COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

/**
 * 三角形ダイアグラムスライドを生成する
 */
export function generateTriangleSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: TriangleSlide,
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

    // 三角形配置（3つの要素を三角形に配置）
    // 頂点：上中央、左下、右下
    const centerX = 200;
    const baseY = LAYOUT.CONTENT_Y + 20;
    const triangleHeight = 250;
    const triangleWidth = 280;
    const nodeSize = 80;

    const positions = [
        { x: centerX - nodeSize / 2, y: baseY }, // 上
        { x: centerX - triangleWidth / 2 - nodeSize / 2, y: baseY + triangleHeight - nodeSize }, // 左下
        { x: centerX + triangleWidth / 2 - nodeSize / 2, y: baseY + triangleHeight - nodeSize }, // 右下
    ];

    // 接続線をシンプルな三角形で表現
    addShape(slide, {
        left: centerX - triangleWidth / 2 + 10,
        top: baseY + 30,
        width: triangleWidth - 20,
        height: triangleHeight - 60,
        fill: COLORS.BG_LIGHT,
        shapeType: SlidesApp.ShapeType.TRIANGLE,
    });

    data.items.forEach((item, index) => {
        if (index >= 3) return;

        const pos = positions[index];
        const color = TRIANGLE_COLORS[index];

        // ノード円
        const node = addShape(slide, {
            left: pos.x,
            top: pos.y,
            width: nodeSize,
            height: nodeSize,
            fill: color,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        node.getText().setText(item.title);
        node.getText()
            .getTextStyle()
            .setFontSize(12)
            .setForegroundColor(COLORS.TEXT_WHITE)
            .setBold(true)
            .setFontFamily(FONTS.BODY);
        node.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        // 説明テキスト（右側に配置）
        addTextBox(slide, {
            left: 400,
            top: baseY + index * 85 + 10,
            width: 280,
            height: 70,
            text: `${item.title}\n${item.desc}`,
            fontSize: FONT_SIZES.CARD_DESC,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });

        // 説明テキストの左にカラーバー
        addShape(slide, {
            left: 393,
            top: baseY + index * 85 + 10,
            width: 4,
            height: 50,
            fill: color,
        });
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
