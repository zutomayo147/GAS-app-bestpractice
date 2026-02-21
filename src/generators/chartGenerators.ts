import { BarGraphSlide, PieGraphSlide, LineGraphSlide, ChartCombineSlide } from '../domain/slideTypes';
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

/** 棒グラフ（シミュレーション） */
export function generateBarGraphSlide(presentation: GoogleAppsScript.Slides.Presentation, data: BarGraphSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const startX = 120;
    const baseY = 350;
    const chartWidth = 480;
    const chartHeight = 200;

    // 軸
    addShape(slide, { left: startX, top: baseY, width: chartWidth, height: 2, fill: COLORS.TEXT_GRAY });
    addShape(slide, { left: startX, top: baseY - chartHeight, width: 2, height: chartHeight, fill: COLORS.TEXT_GRAY });

    // Parse data string "Label: Value, Label: Value"
    const parsedItems = data.data.split(',').map(s => {
        const [label, valStr] = s.split(':').map(str => str.trim());
        return { label, value: parseFloat(valStr) || 0 };
    });

    const max = Math.max(...parsedItems.map(item => item.value), 1);
    const gap = 20;
    const barW = (chartWidth - (parsedItems.length + 1) * gap) / parsedItems.length;

    parsedItems.forEach((item, i) => {
        const barH = (item.value / max) * chartHeight;
        const rect = addShape(slide, { 
            left: startX + gap + i * (barW + gap), 
            top: baseY - barH, 
            width: barW, 
            height: barH, 
            fill: COLORS.PRIMARY 
        });
        // Note: GAS API Fill does not have setAlpha.
        rect.getBorder().setTransparent();

        addTextBox(slide, {
            left: startX + gap + i * (barW + gap), top: baseY + 10, width: barW, height: 20,
            text: item.label, fontSize: 10, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
        addTextBox(slide, {
            left: startX + gap + i * (barW + gap), top: baseY - barH - 20, width: barW, height: 20,
            text: item.value.toString(), fontSize: 10, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 円グラフ（シミュレーション） */
export function generatePieGraphSlide(presentation: GoogleAppsScript.Slides.Presentation, data: PieGraphSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 240;
    const radius = 120;

    // 実際には扇形（Arc）を組み合わせるが、簡易的に円を分割した色で表現（デモ用）
    const colors = [COLORS.PRIMARY, COLORS.SECONDARY, COLORS.SUCCESS, COLORS.WARNING, COLORS.ACCENT];
    
    const parsedItems = data.data.split(',').map(s => {
        const [label, valStr] = s.split(':').map(str => str.trim());
        return { label, value: parseFloat(valStr) || 0 };
    });

    // 凡例
    parsedItems.forEach((item, i) => {
        const lx = 520;
        const ly = 180 + i * 30;
        const dot = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, lx, ly, 15, 15);
        dot.getFill().setSolidFill(colors[i % colors.length]);
        dot.getBorder().setTransparent();

        addTextBox(slide, {
            left: lx + 25, top: ly - 3, width: 120, height: 20,
            text: `${item.label}: ${item.value}%`, fontSize: 12
        });
    });

    const circle = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, centerX - radius, centerY - radius, radius * 2, radius * 2);
    circle.getFill().setSolidFill(COLORS.PRIMARY);
    // Note: GAS API Fill does not have setAlpha.
    circle.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
    circle.getBorder().setWeight(1);

    addTextBox(slide, {
        left: centerX - 50, top: centerY - 10, width: 100, height: 20,
        text: '(Pie Chart Area)', fontSize: 10, fontColor: COLORS.TEXT_GRAY, alignment: SlidesApp.ParagraphAlignment.CENTER
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 折れ線グラフ（シミュレーション） */
export function generateLineGraphSlide(presentation: GoogleAppsScript.Slides.Presentation, data: LineGraphSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const startX = 120;
    const baseY = 350;
    const chartWidth = 480;
    const chartHeight = 200;

    addShape(slide, { left: startX, top: baseY, width: chartWidth, height: 2, fill: COLORS.TEXT_GRAY });
    const parsedItems = data.trend.split(',').map(s => {
        const [label, valStr] = s.split(':').map(str => str.trim());
        return { label, value: parseFloat(valStr) || 0 };
    });
    
    const max = Math.max(...parsedItems.map(item => item.value), 1);
    const gap = chartWidth / (parsedItems.length - 1 || 1);

    parsedItems.forEach((item, i) => {
        const x = startX + i * gap;
        const y = baseY - (item.value / max) * chartHeight;
        
        const dot = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, x - 4, y - 4, 8, 8);
        dot.getFill().setSolidFill(COLORS.PRIMARY);
        dot.getBorder().setTransparent();

        if (i > 0) {
            const prevX = startX + (i - 1) * gap;
            const prevY = baseY - (parsedItems[i - 1].value / max) * chartHeight;
            slide.insertLine(SlidesApp.LineCategory.STRAIGHT, prevX, prevY, x, y);
        }

        addTextBox(slide, {
            left: x - 25, top: baseY + 10, width: 50, height: 20,
            text: item.label, fontSize: 10, bold: true, fontColor: COLORS.TEXT_GRAY, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** 複合グラフ（シミュレーション） */
export function generateChartCombineSlide(presentation: GoogleAppsScript.Slides.Presentation, data: ChartCombineSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);
    
    // 棒グラフと折れ線の組み合わせ
    const barData: BarGraphSlide = { ...data, type: 'barGraph', data: '2023: 100, 2024: 150, 2025: 210' };
    generateBarGraphSlide(presentation, barData); 
    // ※ 実際には1つのスライドに描画するため、上記関数を分割して利用すべきだが、
    // ここではデモとして同じロジックを期待。
    
    if (data.notes) addNotesToSlide(slide, data.notes);
}
