import { FlowHorizontalSlide, FlowVerticalSlide, CaptureFlowSlide } from '../domain/slideTypes';
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

/** フロー（横） */
export function generateFlowHorizontalSlide(presentation: GoogleAppsScript.Slides.Presentation, data: FlowHorizontalSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.steps.length;
    const arrowGap = 10;
    const totalGap = arrowGap * (count - 1);
    const stepW = (640 - totalGap) / count;
    const y = 200;
    const h = 80;

    data.steps.forEach((step, i) => {
        const x = LAYOUT.MARGIN + i * (stepW + arrowGap);
        const box = addShape(slide, { left: x, top: y, width: stepW, height: h, fill: '#F8FAFC' });
        box.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
        box.getBorder().setWeight(1);
        
        addTextBox(slide, {
            left: x + 5, top: y + 20, width: stepW - 10, height: 40,
            text: step, fontSize: 14, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });

        if (i < count - 1) {
            const arrowX = x + stepW;
            const arrow = slide.insertShape(SlidesApp.ShapeType.RIGHT_ARROW, arrowX, y + h/2 - 10, arrowGap, 20);
            arrow.getFill().setSolidFill(COLORS.SECONDARY);
            arrow.getBorder().setTransparent();
        }
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** フロー（縦） */
export function generateFlowVerticalSlide(presentation: GoogleAppsScript.Slides.Presentation, data: FlowVerticalSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.steps.length;
    const gap = 15;
    const stepH = Math.min(50, (300 - (count * gap)) / count);
    const x = 200;
    const w = 320;

    data.steps.forEach((step, i) => {
        const y = LAYOUT.CONTENT_Y + i * (stepH + gap);
        const box = addShape(slide, { left: x, top: y, width: w, height: stepH, fill: '#F8FAFC' });
        box.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
        box.getBorder().setWeight(1);
        
        addTextBox(slide, {
            left: x + 10, top: y + stepH/2 - 10, width: w - 20, height: 20,
            text: step, fontSize: 14, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });

        if (i < count - 1) {
            const arrow = slide.insertShape(SlidesApp.ShapeType.DOWN_ARROW, x + w/2 - 10, y + stepH, 20, gap);
            arrow.getFill().setSolidFill(COLORS.SECONDARY);
            arrow.getBorder().setTransparent();
        }
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 申し込み手順（キャプチャフロー） */
export function generateCaptureFlowSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CaptureFlowSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    // 画面キャプチャを模した四角形とフローを組み合わせる
    const count = data.steps.length;
    const capW = 120;
    const capH = 180;
    const gap = 40;
    const startX = 360 - ((count * capW + (count - 1) * gap) / 2);

    data.steps.forEach((step, i) => {
        const x = startX + i * (capW + gap);
        const y = 200;

        // モック画面
        const screen = addShape(slide, { left: x, top: y, width: capW, height: capH, fill: '#FFFFFF' });
        screen.getBorder().getLineFill().setSolidFill(COLORS.TEXT_GRAY);
        screen.getBorder().setWeight(1);
        
        // 画面内のダミー要素
        addShape(slide, { left: x + 10, top: y + 10, width: capW - 20, height: 10, fill: '#E2E8F0' });
        addShape(slide, { left: x + 10, top: y + 30, width: capW - 20, height: 80, fill: '#F1F5F9' });
        addShape(slide, { left: x + 20, top: y + 140, width: capW - 40, height: 20, fill: COLORS.PRIMARY });

        // ステップ番号とテキスト
        addTextBox(slide, {
            left: x, top: y + capH + 10, width: capW, height: 40,
            text: `${i + 1}. ${step}`, fontSize: 11, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });

        if (i < count - 1) {
            const arrow = slide.insertShape(SlidesApp.ShapeType.RIGHT_ARROW, x + capW + 5, y + capH/2 - 15, gap - 10, 30);
            arrow.getFill().setSolidFill(COLORS.SECONDARY);
            arrow.getBorder().setTransparent();
        }
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
