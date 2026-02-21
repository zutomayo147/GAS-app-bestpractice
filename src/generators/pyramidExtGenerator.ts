import { PyramidUpSlide, PyramidDownSlide, TreeDiagramSlide } from '../domain/slideTypes';
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

/** ピラミッド（上向き） */
export function generatePyramidUpSlide(presentation: GoogleAppsScript.Slides.Presentation, data: PyramidUpSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.levels.length;
    const centerX = 360;
    const startY = 150;
    const fullHeight = 240;
    const fullWidth = 360;

    data.levels.forEach((level, i) => {
        const h = fullHeight / count;
        const y = startY + (count - 1 - i) * h;
        
        // 台形を模した等辺三角形（実際には各層を台形で描画するのが理想）
        // 簡易的に重なった三角形と、その上のテキストで表現
        const levelW = (fullWidth * (i + 1)) / count;
        const triangle = slide.insertShape(SlidesApp.ShapeType.TRIANGLE, centerX - levelW/2, startY + (count - 1 - i) * (fullHeight/count), levelW, (fullHeight * (i + 1)) / count);
        triangle.getFill().setSolidFill(COLORS.PRIMARY);
        // Note: GAS API Fill does not have setAlpha. Skipping alpha.
        triangle.getBorder().setTransparent();

        addTextBox(slide, {
            left: centerX + levelW/2 + 20, top: startY + (count - 1 - i) * h + h/2 - 15, width: 200, height: 30,
            text: `${level.title}: ${level.description}`, fontSize: 12, bold: true
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** ピラミッド（下向き） */
export function generatePyramidDownSlide(presentation: GoogleAppsScript.Slides.Presentation, data: PyramidDownSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.levels.length;
    const centerX = 360;
    const startY = 150;
    const fullHeight = 240;
    const fullWidth = 360;

    data.levels.forEach((level, i) => {
        const h = fullHeight / count;
        const levelW = (fullWidth * (count - i)) / count;
        const triangle = slide.insertShape(SlidesApp.ShapeType.TRIANGLE, centerX - levelW/2, startY + i * h, levelW, (fullHeight * (count - i)) / count);
        triangle.setRotation(180);
        triangle.getFill().setSolidFill(COLORS.SECONDARY);
        // Note: GAS API Fill does not have setAlpha. Skipping alpha.
        triangle.getBorder().setTransparent();

        addTextBox(slide, {
            left: centerX + levelW/2 + 20, top: startY + i * h + h/2 - 15, width: 200, height: 30,
            text: `${level.title}: ${level.description}`, fontSize: 12, bold: true
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** ツリー図（ロジックツリー） */
export function generateTreeDiagramSlide(presentation: GoogleAppsScript.Slides.Presentation, data: TreeDiagramSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const startX = LAYOUT.MARGIN;
    const startY = 200;
    const rootW = 120;
    const rootH = 60;

    // ルート（タイトル）
    const root = addShape(slide, { left: startX, top: startY, width: rootW, height: rootH, fill: COLORS.PRIMARY });
    addTextBox(slide, { left: startX, top: startY + 15, width: rootW, height: 30, text: data.title, fontSize: 14, fontColor: '#FFFFFF', bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });

    const childX = startX + rootW + 60;
    const childW = 150;
    const childH = 50;
    const gap = 20;

    data.items.forEach((item, i) => {
        const y = startY + (i - (data.items.length - 1) / 2) * (childH + gap);
        const child = addShape(slide, { left: childX, top: y, width: childW, height: childH, fill: '#F1F5F9' });
        child.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
        child.getBorder().setWeight(1);
        
        addTextBox(slide, {
            left: childX + 5, top: y + 5, width: childW - 10, height: 20,
            text: item.title, fontSize: 12, bold: true
        });
        addTextBox(slide, {
            left: childX + 5, top: y + 25, width: childW - 10, height: 20,
            text: item.desc, fontSize: 10, fontColor: COLORS.TEXT_GRAY
        });

        // コネクタ（擬似的な線）
        slide.insertLine(SlidesApp.LineCategory.BENT, 
            root.getLeft() + root.getWidth(), startY + rootH / 2, 
            childX, y + childH / 2);
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
