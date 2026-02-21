import { CompareScaleSlide, CompareItemSlide, CompareTableSlide, TransitionSlide, InteractionSlide } from '../domain/slideTypes';
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

/** 比較（スケール） */
export function generateCompareScaleSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CompareScaleSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 280;
    
    // 天秤のような簡易表現
    addShape(slide, { left: centerX - 150, top: centerY, width: 300, height: 4, fill: COLORS.TEXT_GRAY });
    addShape(slide, { left: centerX - 2, top: centerY, width: 4, height: 80, fill: COLORS.TEXT_GRAY });

    // 左
    addShape(slide, { left: centerX - 200, top: centerY - 100, width: 120, height: 100, fill: '#FEF2F2', shapeType: SlidesApp.ShapeType.ELLIPSE });
    addTextBox(slide, {
        left: centerX - 200, top: centerY - 70, width: 120, height: 30,
        text: data.leftTitle, fontSize: 16, fontColor: '#B91C1C', bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
    });
    addTextBox(slide, {
        left: centerX - 200, top: centerY + 10, width: 120, height: 60,
        text: data.leftItems.join('\n'), fontSize: 10, fontColor: COLORS.TEXT_DARK, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    // 右
    addShape(slide, { left: centerX + 80, top: centerY - 100, width: 120, height: 100, fill: '#EFF6FF', shapeType: SlidesApp.ShapeType.ELLIPSE });
    addTextBox(slide, {
        left: centerX + 80, top: centerY - 70, width: 120, height: 30,
        text: data.rightTitle, fontSize: 16, fontColor: '#1D4ED8', bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
    });
    addTextBox(slide, {
        left: centerX + 80, top: centerY + 10, width: 120, height: 60,
        text: data.rightItems.join('\n'), fontSize: 10, fontColor: COLORS.TEXT_DARK, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 比較（アイテム） */
export function generateCompareItemSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CompareItemSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const colW = 280;
    const y = LAYOUT.CONTENT_Y + 10;
    
    // 左
    addShape(slide, { left: LAYOUT.MARGIN, top: y, width: colW, height: 40, fill: '#FEE2E2' });
    addTextBox(slide, { left: LAYOUT.MARGIN, top: y + 5, width: colW, height: 30, text: data.leftTitle, fontSize: 16, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });
    data.leftItems.forEach((item, i) => {
        addTextBox(slide, { left: LAYOUT.MARGIN + 10, top: y + 50 + i * 30, width: colW - 20, height: 25, text: `・ ${item}`, fontSize: 12 });
    });

    // 右
    addShape(slide, { left: LAYOUT.MARGIN + colW + 40, top: y, width: colW, height: 40, fill: '#DBEAFE' });
    addTextBox(slide, { left: LAYOUT.MARGIN + colW + 40, top: y + 5, width: colW, height: 30, text: data.rightTitle, fontSize: 16, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });
    data.rightItems.forEach((item, i) => {
        addTextBox(slide, { left: LAYOUT.MARGIN + colW + 50, top: y + 50 + i * 30, width: colW - 20, height: 25, text: `・ ${item}`, fontSize: 12 });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 比較（テーブル） */
export function generateCompareTableSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CompareTableSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const rows = data.items.length + 1;
    const table = slide.insertTable(rows, 3, LAYOUT.MARGIN, LAYOUT.CONTENT_Y, 640, rows * 40);
    
    // ヘッダー
    table.getCell(0, 0).getText().setText('項目');
    table.getCell(0, 1).getText().setText('A社 (自社)');
    table.getCell(0, 2).getText().setText('B社 (他社)');
    
    for (let c = 0; c < 3; c++) {
        const cell = table.getCell(0, c);
        cell.getFill().setSolidFill(COLORS.PRIMARY);
        cell.getText().getTextStyle().setForegroundColor('#FFFFFF').setBold(true);
    }

    data.items.forEach((item, i) => {
        table.getCell(i + 1, 0).getText().setText(item.label);
        table.getCell(i + 1, 1).getText().setText(item.a);
        table.getCell(i + 1, 2).getText().setText(item.b);
        
        [0, 1, 2].forEach(c => {
            const text = table.getCell(i + 1, c).getText();
            text.getParagraphs().forEach(p => {
                p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
            });
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** ビフォーアフター（トランジション） */
export function generateTransitionSlide(presentation: GoogleAppsScript.Slides.Presentation, data: TransitionSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const y = 200;
    const boxW = 250;
    const boxH = 120;

    // Before
    addShape(slide, { left: LAYOUT.MARGIN, top: y, width: boxW, height: boxH, fill: '#F1F5F9' });
    addTextBox(slide, { left: LAYOUT.MARGIN, top: y - 30, width: boxW, height: 30, text: 'BEFORE', fontSize: 14, bold: true, fontColor: COLORS.TEXT_GRAY, alignment: SlidesApp.ParagraphAlignment.CENTER });
    addTextBox(slide, { left: LAYOUT.MARGIN + 10, top: y + 20, width: boxW - 20, height: boxH - 40, text: data.before, fontSize: 18, alignment: SlidesApp.ParagraphAlignment.CENTER });

    // 矢印
    const arrow = slide.insertShape(SlidesApp.ShapeType.RIGHT_ARROW, 360 - 30, y + boxH/2 - 20, 60, 40);
    arrow.getFill().setSolidFill(COLORS.SECONDARY);
    arrow.getBorder().setTransparent();

    // After
    addShape(slide, { left: 720 - LAYOUT.MARGIN - boxW, top: y, width: boxW, height: boxH, fill: '#ECFDF5' });
    addTextBox(slide, { left: 720 - LAYOUT.MARGIN - boxW, top: y - 30, width: boxW, height: 30, text: 'AFTER', fontSize: 14, bold: true, fontColor: '#059669', alignment: SlidesApp.ParagraphAlignment.CENTER });
    addTextBox(slide, { left: 720 - LAYOUT.MARGIN - boxW + 10, top: y + 20, width: boxW - 20, height: boxH - 40, text: data.after, fontSize: 18, bold: true, fontColor: '#059669', alignment: SlidesApp.ParagraphAlignment.CENTER });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** パートナーシップ（インタラクション） */
export function generateInteractionSlide(presentation: GoogleAppsScript.Slides.Presentation, data: InteractionSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 240;

    // 左
    addShape(slide, { left: centerX - 240, top: centerY - 40, width: 160, height: 80, fill: '#EFF6FF' });
    addTextBox(slide, { left: centerX - 240, top: centerY - 15, width: 160, height: 30, text: data.left, fontSize: 14, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });

    // 右
    addShape(slide, { left: centerX + 80, top: centerY - 40, width: 160, height: 80, fill: '#FDF2F8' });
    addTextBox(slide, { left: centerX + 80, top: centerY - 15, width: 160, height: 30, text: data.right, fontSize: 14, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });

    // 双方向矢印
    const arrow = slide.insertShape(SlidesApp.ShapeType.LEFT_RIGHT_ARROW, centerX - 70, centerY - 20, 140, 40);
    arrow.getFill().setSolidFill(COLORS.SECONDARY);
    arrow.getBorder().setTransparent();

    addTextBox(slide, {
        left: centerX - 100, top: centerY + 30, width: 200, height: 40,
        text: data.desc, fontSize: 12, fontColor: COLORS.TEXT_DARK, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
