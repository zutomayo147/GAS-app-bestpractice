import { ParallelHorizontalSlide, ParallelVerticalSlide, ParallelMultipleSlide, AreaRangeSlide, OverlapInfoSlide, InclusionHierSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * 共通のタイトルとサブヘッドを描画する
 */
function drawHeader(slide: GoogleAppsScript.Slides.Slide, title: string, subhead?: string) {
    addTextBox(slide, {
        left: LAYOUT.MARGIN,
        top: LAYOUT.TITLE_Y,
        width: 640,
        height: 35,
        text: title,
        fontSize: FONT_SIZES.SLIDE_TITLE,
        fontColor: COLORS.TEXT_DARK,
        bold: true,
        fontFamily: FONTS.TITLE,
    });

    if (subhead) {
        addTextBox(slide, {
            left: LAYOUT.MARGIN,
            top: LAYOUT.SUBHEAD_Y,
            width: 640,
            height: 25,
            text: subhead,
            fontSize: FONT_SIZES.SUBHEAD,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
        });
    }
}

/** パラレル（横並び） */
export function generateParallelHorizontalSlide(presentation: GoogleAppsScript.Slides.Presentation, data: ParallelHorizontalSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.items.length;
    const gap = 15;
    const totalGap = gap * (count - 1);
    const width = (640 - totalGap) / count;
    const y = LAYOUT.CONTENT_Y;
    const h = 200;

    data.items.forEach((item, i) => {
        const x = LAYOUT.MARGIN + i * (width + gap);
        const card = addShape(slide, { left: x, top: y, width: width, height: h, fill: '#F8FAFC' });
        
        addTextBox(slide, {
            left: x + 10, top: y + 10, width: width - 20, height: 30,
            text: item.title, fontSize: FONT_SIZES.CARD_TITLE, fontColor: COLORS.PRIMARY, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
        addTextBox(slide, {
            left: x + 10, top: y + 45, width: width - 20, height: h - 55,
            text: item.desc, fontSize: FONT_SIZES.CARD_DESC, fontColor: COLORS.TEXT_DARK
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** パラレル（縦並び） */
export function generateParallelVerticalSlide(presentation: GoogleAppsScript.Slides.Presentation, data: ParallelVerticalSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.items.length;
    const gap = 10;
    const totalGap = gap * (count - 1);
    const height = Math.min(60, (250 - totalGap) / count);
    const x = LAYOUT.MARGIN;
    const width = 640;

    data.items.forEach((item, i) => {
        const y = LAYOUT.CONTENT_Y + i * (height + gap);
        addShape(slide, { left: x, top: y, width: width, height: height, fill: '#F8FAFC' });
        
        addTextBox(slide, {
            left: x + 10, top: y + (height/2 - 10), width: 150, height: 20,
            text: item.title, fontSize: FONT_SIZES.CARD_TITLE, fontColor: COLORS.PRIMARY, bold: true
        });
        addTextBox(slide, {
            left: x + 170, top: y + 5, width: width - 180, height: height - 10,
            text: item.desc, fontSize: FONT_SIZES.CARD_DESC, fontColor: COLORS.TEXT_DARK
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** パラレル（複数） */
export function generateParallelMultipleSlide(presentation: GoogleAppsScript.Slides.Presentation, data: ParallelMultipleSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const cols = 2;
    const count = data.items.length;
    const gap = 15;
    const width = (640 - gap) / cols;
    const height = 100;

    data.items.forEach((item, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = LAYOUT.MARGIN + col * (width + gap);
        const y = LAYOUT.CONTENT_Y + row * (height + gap);

        addShape(slide, { left: x, top: y, width: width, height: height, fill: '#F8FAFC' });
        addTextBox(slide, {
            left: x + 10, top: y + 10, width: width - 20, height: 25,
            text: item.title, fontSize: FONT_SIZES.CARD_TITLE, fontColor: COLORS.PRIMARY, bold: true
        });
        addTextBox(slide, {
            left: x + 10, top: y + 40, width: width - 20, height: height - 50,
            text: item.desc, fontSize: FONT_SIZES.CARD_DESC, fontColor: COLORS.TEXT_DARK
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** カバー範囲 */
export function generateAreaRangeSlide(presentation: GoogleAppsScript.Slides.Presentation, data: AreaRangeSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.ranges.length;
    const x = LAYOUT.MARGIN;
    const y = LAYOUT.CONTENT_Y + 50;
    const width = 640;
    const height = 100;

    const mainRect = addShape(slide, { left: x, top: y, width: width, height: height, fill: '#EEF2FF' });
    mainRect.getBorder().setTransparent().setWeight(0);
    
    const stepWidth = width / count;
    data.ranges.forEach((range, i) => {
        const rx = x + i * stepWidth;
        addTextBox(slide, {
            left: rx, top: y + height/2 - 15, width: stepWidth, height: 30,
            text: range, fontSize: FONT_SIZES.CARD_TITLE, fontColor: COLORS.PRIMARY, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
        if (i < count - 1) {
            // 区切り線代わりの小さなシェイプ
            addShape(slide, { left: rx + stepWidth - 0.5, top: y + 20, width: 1, height: height - 40, fill: '#C7D2FE' });
        }
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 共通基盤（オーバーラップ） */
export function generateOverlapInfoSlide(presentation: GoogleAppsScript.Slides.Presentation, data: OverlapInfoSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 240;
    const radius = 80;

    // 簡易的に3つの重なりを表現（アイテム数に関わらず3つの円を配置し、中央に共通項を書くイメージ）
    const colors = ['#FEE2E2', '#DBEAFE', '#D1FAE5'];
    [[centerX - 50, centerY - 30], [centerX + 50, centerY - 30], [centerX, centerY + 40]].forEach((pos, i) => {
        const circle = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, pos[0] - radius, pos[1] - radius, radius * 2, radius * 2);
        circle.getFill().setSolidFill(colors[i % 3]);
        // Note: To set alpha, we usually need solid fill with alpha, 
        // but GAS Slides API doesn't directly support Fill.setAlpha().
        circle.getBorder().setTransparent();
    });

    if (data.items.length > 0) {
        addTextBox(slide, {
            left: centerX - 60, top: centerY - 15, width: 120, height: 30,
            text: data.items.join('\n'), fontSize: 12, fontColor: COLORS.PRIMARY, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    }

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** グループ構成（包含関係） */
export function generateInclusionHierSlide(presentation: GoogleAppsScript.Slides.Presentation, data: InclusionHierSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const x = LAYOUT.MARGIN + 40;
    const y = LAYOUT.CONTENT_Y + 20;
    const w = 560;
    const h = 200;

    const parentBox = addShape(slide, { left: x, top: y, width: w, height: h, fill: '#F1F5F9' });
    parentBox.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
    parentBox.getBorder().setWeight(2);

    addTextBox(slide, {
        left: x + 10, top: y + 10, width: w - 20, height: 30,
        text: data.parent, fontSize: FONT_SIZES.CARD_TITLE, fontColor: COLORS.PRIMARY, bold: true
    });

    const childW = (w - 60) / data.children.length;
    data.children.forEach((child, i) => {
        const cx = x + 20 + i * (childW + 20);
        const cy = y + 60;
        const childBox = addShape(slide, { left: cx, top: cy, width: childW, height: 100, fill: '#FFFFFF' });
        childBox.getBorder().getLineFill().setSolidFill(COLORS.SECONDARY);
        childBox.getBorder().setWeight(1);
        
        addTextBox(slide, {
            left: cx + 5, top: cy + 35, width: childW - 10, height: 30,
            text: child, fontSize: 14, fontColor: COLORS.TEXT_DARK, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
