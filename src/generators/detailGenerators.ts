import { CaptureListSlide, CaptureZoomSlide, PriceTableSlide, TableDetailSlide, QaSectionSlide, CaseStudyInfoSlide } from '../domain/slideTypes';
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

/** 操作画面一覧（キャプチャリスト） */
export function generateCaptureListSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CaptureListSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.items.length;
    const itemW = 140;
    const itemH = 60;
    const gap = 20;

    // The `centerX` and `cap` variables seem to be misplaced from `generateCaptureZoomSlide`.
    // They are removed from here to maintain correctness.

    data.items.slice(0, 4).forEach((item, i) => {
        const x = LAYOUT.MARGIN;
        const y = LAYOUT.CONTENT_Y + i * (itemH + gap);
        const card = addShape(slide, { left: x, top: y, width: 640, height: itemH, fill: '#F8FAFC' });
        card.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
        card.getBorder().setWeight(1);
        
        addTextBox(slide, {
            left: x + 10, top: y + 10, width: 620, height: 40,
            text: (i + 1) + '. ' + item, fontSize: 12, bold: true, alignment: SlidesApp.ParagraphAlignment.START
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 新機能ポイント（キャプチャズーム） */
export function generateCaptureZoomSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CaptureZoomSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const mainX = LAYOUT.MARGIN;
    const mainY = 150;
    const mainW = 400;
    const mainH = 240;

    // メイン画面
    const screen = addShape(slide, { left: mainX, top: mainY, width: mainW, height: mainH, fill: '#FFFFFF' });
    screen.getBorder().getLineFill().setSolidFill(COLORS.TEXT_GRAY);
    screen.getBorder().setWeight(1);

    // ズームポイント
    const zoomX = mainX + 450;
    const zoomY = 150;
    const zoomSize = 200;
    
    const zoomCircle = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, zoomX, zoomY, zoomSize, zoomSize);
    zoomCircle.getFill().setSolidFill('#FFFFFF');
    zoomCircle.getBorder().getLineFill().setSolidFill(COLORS.SECONDARY);
    zoomCircle.getBorder().setWeight(3);

    addTextBox(slide, {
        left: zoomX + 20, top: zoomY + 80, width: zoomSize - 40, height: 40,
        text: data.zoomPoint, fontSize: 16, bold: true, fontColor: COLORS.SECONDARY, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    // コネクタ（ズーム線）
    // The `centerX` variable was undefined. Assuming it should be related to `mainX` or `zoomX`.
    // The original line `LAYOUT.CONTENT_Y + 50` and `LAYOUT.CONTENT_Y + 20` also seem arbitrary.
    // This line is commented out as its intended logic is unclear without further context.
    // slide.insertLine(SlidesApp.LineCategory.STRAIGHT, LAYOUT.MARGIN + 300, LAYOUT.CONTENT_Y + 50, centerX + 40, LAYOUT.CONTENT_Y + 20);

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** プラン比較 */
export function generatePriceTableSlide(presentation: GoogleAppsScript.Slides.Presentation, data: PriceTableSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const count = data.plans.length;
    const planW = (640 - (count - 1) * 15) / count;
    const y = 180;
    const h = 220;

    data.plans.forEach((plan, i) => {
        const x = LAYOUT.MARGIN + i * (planW + 15);
        const isHighlight = i === 1; // 2番目を推奨プランとする

        const box = addShape(slide, { left: x, top: y, width: planW, height: h, fill: isHighlight ? '#FEF2F2' : '#F8FAFC' });
        box.getBorder().getLineFill().setSolidFill(isHighlight ? COLORS.PRIMARY : COLORS.TEXT_GRAY);
        box.getBorder().setWeight(isHighlight ? 2 : 1);

        addTextBox(slide, {
            left: x, top: y + 10, width: planW, height: 30,
            text: plan, fontSize: 14, bold: true, fontColor: isHighlight ? COLORS.PRIMARY : COLORS.TEXT_DARK, alignment: SlidesApp.ParagraphAlignment.CENTER
        });

        addTextBox(slide, {
            left: x + 10, top: y + 50, width: planW - 20, height: 100,
            text: '・機能A\n・機能B\n・機能C', fontSize: 11
        });

        const btn = addShape(slide, { left: x + 20, top: y + 170, width: planW - 40, height: 30, fill: isHighlight ? COLORS.PRIMARY : COLORS.TEXT_GRAY });
        addTextBox(slide, { left: x + 20, top: y + 175, width: planW - 40, height: 20, text: 'Select', fontSize: 12, fontColor: '#FFFFFF', bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 機能詳細一覧 */
export function generateTableDetailSlide(presentation: GoogleAppsScript.Slides.Presentation, data: TableDetailSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const table = slide.insertTable(5, 2, LAYOUT.MARGIN, 180, 640, 200);
    // Set header text and style outside the loop to avoid repetition
    table.getCell(0, 0).getText().setText('項目').getTextStyle().setFontSize(12).setBold(true);
    table.getCell(0, 1).getText().setText('内容').getTextStyle().setFontSize(12).setBold(true);

    for (let i = 0; i < 5; i++) {
        // Access cells correctly for content rows (i+1 for rows after header)
        // The original code was setting header text in the loop and then overwriting it.
        // Assuming the loop is for content rows, starting from row 1.
        if (i > 0) { // Skip the header row for content population
            table.getCell(i, 0).getText().setText(`機能カテゴリー ${i}`).getTextStyle().setBold(true);
            table.getCell(i, 1).getText().setText('詳細な機能説明がここに入ります。多機であることをアピール。');
        }
    }

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** よくあるご質問 */
export function generateQaSectionSlide(presentation: GoogleAppsScript.Slides.Presentation, data: QaSectionSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const startY = 180;
    const gap = 20;

    data.items.slice(0, 2).forEach((item, i) => { // Changed to slice(0, 2) as per instruction
        const y = 150 + i * 110; // Adjusted y calculation as per instruction
        
        // Q
        addTextBox(slide, { left: LAYOUT.MARGIN, top: y, width: 40, height: 30, text: 'Q', fontSize: 20, bold: true, fontColor: COLORS.PRIMARY });
        addTextBox(slide, { left: LAYOUT.MARGIN + 45, top: y, width: 580, height: 30, text: item.q, fontSize: 14, bold: true });

        // A
        addTextBox(slide, { left: LAYOUT.MARGIN, top: y + 35, width: 40, height: 30, text: 'A', fontSize: 20, bold: true, fontColor: COLORS.SECONDARY });
        addTextBox(slide, { left: LAYOUT.MARGIN + 45, top: y + 35, width: 580, height: 50, text: item.a, fontSize: 12 });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 導入事例 */
export function generateCaseStudyInfoSlide(presentation: GoogleAppsScript.Slides.Presentation, data: CaseStudyInfoSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const x = LAYOUT.MARGIN;
    const y = 180;
    const w = 640;
    const h = 200;

    addShape(slide, { left: x, top: y, width: w, height: h, fill: '#F1F5F9' });
    
    addTextBox(slide, { left: x + 20, top: y + 20, width: 100, height: 30, text: '課題', fontSize: 16, bold: true, fontColor: '#B91C1C' });
    addTextBox(slide, { left: x + 130, top: y + 20, width: 480, height: 50, text: data.issue, fontSize: 14 });

    addShape(slide, { left: x + 20, top: y + 80, width: w - 40, height: 1, fill: COLORS.TEXT_GRAY });

    addTextBox(slide, { left: x + 20, top: y + 100, width: 100, height: 30, text: '結果', fontSize: 16, bold: true, fontColor: '#059669' });
    addTextBox(slide, { left: x + 130, top: y + 100, width: 480, height: 50, text: data.result, fontSize: 18, bold: true, fontColor: '#059669' });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
