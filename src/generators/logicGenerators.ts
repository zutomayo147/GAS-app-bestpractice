import { FormulaLogicSlide, MultiplyEffectSlide, AddCombinationSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

function drawHeader(slide: GoogleAppsScript.Slides.Slide, title: string, subhead?: string) {
    addTextBox(slide, {
        left: LAYOUT.MARGIN, top: LAYOUT.TITLE_Y, width: 640, height: 35,
        text: title, fontSize: FONT_SIZES.SLIDE_TITLE, fontColor: COLORS.TEXT_DARK, bold: true, fontFamily: FONTS.TITLE,
    });
    if (subhead) {
        addTextBox(slide, {
            left: LAYOUT.MARGIN, top: LAYOUT.SUBHEAD_Y, width: 640, height: 25,
            text: subhead, fontSize: FONT_SIZES.SUBHEAD, fontColor: COLORS.TEXT_GRAY, fontFamily: FONTS.BODY,
        });
    }
}

/** 数式ロジック */
export function generateFormulaLogicSlide(presentation: GoogleAppsScript.Slides.Presentation, data: FormulaLogicSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const x = 80;
    const y = 200;
    const w = 560;
    const h = 100;

    const box = addShape(slide, { left: x, top: y, width: w, height: h, fill: '#F8FAFC' });
    box.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
    box.getBorder().setWeight(2);

    addTextBox(slide, {
        left: x + 20, top: y + 25, width: w - 40, height: 50,
        text: data.formula, fontSize: 28, bold: true, fontColor: COLORS.PRIMARY, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 相乗効果 */
export function generateMultiplyEffectSlide(presentation: GoogleAppsScript.Slides.Presentation, data: MultiplyEffectSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerY = 240;
    const startX = 60;
    const boxW = 140;
    const boxH = 80;
    const gap = 40;
    const centerX = 720 / 2;

    const box1 = addShape(slide, { left: centerX - 250, top: centerY - 40, width: 200, height: 80, fill: '#EFF6FF' });
    box1.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
    box1.getBorder().setWeight(1);

    addTextBox(slide, {
        left: centerX - 280, top: centerY - 40, width: 150, height: 80,
        text: data.items[0] || '', fontSize: 18, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    data.items.slice(0, 2).forEach((item, i) => {
        const x = startX + i * (boxW + gap);
        addShape(slide, { left: x, top: centerY - 40, width: boxW, height: boxH, fill: '#EFF6FF' });
        addTextBox(slide, { left: x, top: centerY - 15, width: boxW, height: 30, text: item, fontSize: 12, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });

        if (i === 0) {
            addTextBox(slide, { left: x + boxW, top: centerY - 20, width: gap, height: 40, text: '×', fontSize: 24, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });
        }
    });

    const resultX = startX + 2 * (boxW + gap);
    addTextBox(slide, { left: resultX - gap, top: centerY - 20, width: gap, height: 40, text: '=', fontSize: 24, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });
    
    const resultBox = addShape(slide, { left: centerX + 120, top: centerY - 50, width: 180, height: 100, fill: '#FEF3C7' });
    resultBox.getBorder().getLineFill().setSolidFill('#F59E0B');
    resultBox.getBorder().setWeight(2);
    addTextBox(slide, { left: resultX, top: centerY - 15, width: 180, height: 30, text: data.result, fontSize: 18, bold: true, fontColor: '#B45309', alignment: SlidesApp.ParagraphAlignment.CENTER });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 足し算構成 */
export function generateAddCombinationSlide(presentation: GoogleAppsScript.Slides.Presentation, data: AddCombinationSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.items.length;
    const totalW = 600;
    const startX = (720 - totalW) / 2;
    const y = 200;
    const h = 100;

    data.items.forEach((item, i) => {
        const w = (totalW - (count - 1) * 30) / count;
        const x = startX + i * (w + 30);
        
        addShape(slide, { left: x, top: y, width: w, height: h, fill: '#F1F5F9' });
        addTextBox(slide, { left: x + 5, top: y + 35, width: w - 10, height: 30, text: item, fontSize: 14, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });

        if (i < count - 1) {
            addTextBox(slide, { left: x + w, top: y + 30, width: 30, height: 40, text: '+', fontSize: 20, alignment: SlidesApp.ParagraphAlignment.CENTER });
        }
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
