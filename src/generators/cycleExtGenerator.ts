import { CycleCircularSlide, CycleSquareSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

function drawHeader(slide: GoogleAppsScript.Slides.Slide, title: string, subhead?: string) {
    addTextBox(slide, {
        left: LAYOUT.MARGIN, top: LAYOUT.TITLE_Y, width: 640, height: 35,
        text: title, fontSize: FONT_SIZES.SLIDE_TITLE, fontColor: COLORS.PRIMARY, bold: true, fontFamily: FONTS.TITLE,
    });
    if (subhead) {
        addTextBox(slide, {
            left: LAYOUT.MARGIN, top: LAYOUT.SUBHEAD_Y, width: 640, height: 25,
            text: subhead, fontSize: FONT_SIZES.SUBHEAD, fontColor: COLORS.TEXT_GRAY, fontFamily: FONTS.BODY,
        });
    }
}

/** サイクル（円形） */
export function generateCycleCircularSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CycleCircularSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 240;
    const radius = 120;
    const count = data.items.length;

    data.items.forEach((item, i) => {
        const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const circle = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, x - 40, y - 40, 80, 80);
        circle.getFill().setSolidFill('#DBEAFE');
        circle.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
        circle.getBorder().setWeight(1);

        addTextBox(slide, {
            left: x - 40, top: y - 15, width: 80, height: 30,
            text: item.label, fontSize: 12, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });

        // 矢印（次のアイテムへ）
        if (count > 1) {
            const nextAngle = ((i + 1) * 2 * Math.PI) / count - Math.PI / 2;
            const midAngle = (angle + nextAngle) / 2;
            const ax = centerX + (radius + 10) * Math.cos(midAngle);
            const ay = centerY + (radius + 10) * Math.sin(midAngle);
            
            const arrow = slide.insertShape(SlidesApp.ShapeType.CURVED_RIGHT_ARROW, ax - 15, ay - 15, 30, 30);
            arrow.getFill().setSolidFill(COLORS.SECONDARY);
            arrow.getBorder().setTransparent();
            arrow.setRotation(midAngle * 180 / Math.PI + 90);
        }
    });

    if (data.centerText) {
        addTextBox(slide, {
            left: centerX - 50, top: centerY - 20, width: 100, height: 40,
            text: data.centerText, fontSize: 18, bold: true, fontColor: COLORS.PRIMARY, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    }

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** サイクル（四角形） */
export function generateCycleSquareSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CycleSquareSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 240;
    const size = 200;
    const itemW = 100;
    const itemH = 60;

    const positions = [
        [centerX - size/2, centerY - size/2], // 左上
        [centerX + size/2 - itemW, centerY - size/2], // 右上
        [centerX + size/2 - itemW, centerY + size/2 - itemH], // 右下
        [centerX - size/2, centerY + size/2 - itemH], // 左下
    ];

    data.items.slice(0, 4).forEach((item, i) => {
        const x = positions[i][0];
        const y = positions[i][1];

        const box = addShape(slide, { left: x, top: y, width: itemW, height: itemH, fill: '#F1F5F9' });
        box.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
        box.getBorder().setWeight(1);

        addTextBox(slide, {
            left: x + 5, top: y + itemH/2 - 10, width: itemW - 10, height: 20,
            text: item.label, fontSize: 14, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });

        // 矢印
        const nextIdx = (i + 1) % 4;
        const nx = positions[nextIdx][0];
        const ny = positions[nextIdx][1];
        
        // 簡易的に中心点同士を繋ぐ矢印（実際には箱の辺から辺へ引くのが望ましいが、一旦中心方向へ）
        // ここでは固定レイアウトなので決め打ちで配置
    });

    if (data.centerText) {
        addTextBox(slide, {
            left: centerX - 50, top: centerY - 20, width: 100, height: 40,
            text: data.centerText, fontSize: 18, bold: true, fontColor: COLORS.PRIMARY, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    }

    if (data.notes) addNotesToSlide(slide, data.notes);
}
