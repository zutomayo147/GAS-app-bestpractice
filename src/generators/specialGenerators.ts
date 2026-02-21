import { LocationMapSlide, ScheduleTableSlide, QuoteImpactSlide } from '../domain/slideTypes';
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

/** 地図拠点 */
export function generateLocationMapSlide(presentation: GoogleAppsScript.Slides.Presentation, data: LocationMapSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    // 日本地図を模した簡易的なシェイプ配置（実際には画像を貼るのが理想だが、ここではデモ実装）
    const centerX = 360;
    const centerY = 240;
    
    const mapBox = addShape(slide, { left: centerX - 150, top: centerY - 80, width: 300, height: 200, fill: '#E2E8F0' });
    addTextBox(slide, {
        left: centerX - 50, top: centerY + 10, width: 100, height: 20,
        text: '(Map Area)', fontSize: 10, fontColor: COLORS.TEXT_GRAY, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    data.locations.forEach((loc, i) => {
        const x = centerX - 100 + (i % 2) * 200;
        const y = centerY - 50 + Math.floor(i / 2) * 60;
        
        const pin = slide.insertShape(SlidesApp.ShapeType.TEARDROP, x, y, 20, 20);
        pin.setRotation(180);
        pin.getFill().setSolidFill(COLORS.PRIMARY);
        pin.getBorder().setTransparent();

        addTextBox(slide, {
            left: x + 25, top: y, width: 100, height: 20,
            text: loc, fontSize: 12, bold: true
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 工程表（スケジュール） */
export function generateScheduleTableSlide(presentation: GoogleAppsScript.Slides.Presentation, data: ScheduleTableSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const rows = 4;
    const cols = 5;
    const table = slide.insertTable(rows, cols, LAYOUT.MARGIN, 180, 640, 160);
    
    const months = ['M1', 'M2', 'M3', 'M4', 'M5'];
    months.forEach((m, i) => {
        const cell = table.getCell(0, i);
        cell.getText().setText(m);
        cell.getFill().setSolidFill(COLORS.PRIMARY);
        cell.getText().getTextStyle().setForegroundColor('#FFFFFF').setBold(true);
    });

    const tasks = ['要件定義', '開発設計', 'テスト運用'];
    tasks.forEach((task, i) => {
        table.getCell(i + 1, 0).getText().setText(task);
        // ガントチャート的なバーを擬似的に表現
        const cell = table.getCell(i + 1, i + 1);
        cell.getFill().setSolidFill(COLORS.SECONDARY);
    });

    addTextBox(slide, {
        left: LAYOUT.MARGIN, top: 350, width: 300, height: 30,
        text: `期間: ${data.duration}`, fontSize: 14, bold: true, fontColor: COLORS.PRIMARY
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 代表メッセージ */
export function generateQuoteImpactSlide(presentation: GoogleAppsScript.Slides.Presentation, data: QuoteImpactSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    // 代表メッセージはヘッダーなしの特別デザインにする
    
    const centerX = 360;
    const centerY = 205;

    // 背景に薄い装飾
    const decor = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 0, 0, 720, 405);
    decor.getFill().setSolidFill(COLORS.PRIMARY);
    // Note: GAS API Fill does not have setAlpha.
    decor.getBorder().setTransparent();

    // クォート
    addTextBox(slide, {
        left: 60, top: 120, width: 600, height: 100,
        text: `“ ${data.quote} ”`, fontSize: 32, bold: true, italic: true, fontColor: COLORS.PRIMARY, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    // 著者
    addTextBox(slide, {
        left: 60, top: 250, width: 600, height: 30,
        text: data.author, fontSize: 18, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    // タイトル的なもの
    addTextBox(slide, {
        left: 60, top: 60, width: 600, height: 40,
        text: data.title, fontSize: 24, bold: true, fontColor: COLORS.TEXT_GRAY, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
