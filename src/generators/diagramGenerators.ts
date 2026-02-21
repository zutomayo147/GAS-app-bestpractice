import { MatrixPosSlide, VennDiagramSlide, RankingBoardSlide } from '../domain/slideTypes';
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

/** マトリクス（ポジション） */
export function generateMatrixPosSlide(presentation: GoogleAppsScript.Slides.Presentation, data: MatrixPosSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 240;
    const size = 260;

    // 軸
    addShape(slide, { left: centerX - size/2, top: centerY, width: size, height: 2, fill: COLORS.TEXT_GRAY });
    addShape(slide, { left: centerX, top: centerY - size/2, width: 2, height: size, fill: COLORS.TEXT_GRAY });

    // 項目（簡易的にランダムまたは決め打ちで分散配置）
    const positions = [
        [centerX + 40, centerY - 60], // 右上
        [centerX - 100, centerY + 40], // 左下
    ];

    data.items.slice(0, 2).forEach((item, i) => {
        const x = positions[i][0];
        const y = positions[i][1];
        const circle = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, x, y, 60, 60);
        circle.getFill().setSolidFill(i === 0 ? COLORS.PRIMARY : COLORS.SECONDARY);
        circle.getBorder().setTransparent();
        
        addTextBox(slide, {
            left: x, top: y + 20, width: 60, height: 20,
            text: item.title, fontSize: 10, fontColor: '#FFFFFF', bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** ベン図 */
export function generateVennDiagramSlide(presentation: GoogleAppsScript.Slides.Presentation, data: VennDiagramSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const centerX = 360;
    const centerY = 240;
    const radius = 90;
    const colors = ['#DBEAFE', '#FEE2E2', '#D1FAE5'];

    // 3つの重なり
    const offsets = [
        [0, -40],
        [-40, 40],
        [40, 40]
    ];

    data.items.slice(0, 3).forEach((item, i) => {
        const x = centerX + offsets[i][0];
        const y = centerY + offsets[i][1];
        const circle = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, x - radius, y - radius, radius * 2, radius * 2);
        circle.getFill().setSolidFill(colors[i % 3]);
        circle.getBorder().setTransparent();

        addTextBox(slide, {
            left: x - 50, top: y - 10, width: 100, height: 20,
            text: item.title, fontSize: 12, bold: true, alignment: SlidesApp.ParagraphAlignment.CENTER
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

/** ランキング */
export function generateRankingBoardSlide(presentation: GoogleAppsScript.Slides.Presentation, data: RankingBoardSlide) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    drawHeader(slide, data.title, data.subhead);

    const startY = 180;
    const itemH = 50;
    const gap = 15;

    // Example of a Gantt-like chart using a table
    const tableX = 80;
    const tableY = 150;
    const tableWidth = 600;
    const tableHeight = 200;

    const months = ['M1', 'M2', 'M3', 'M4', 'M5'];
    const tasks = ['要件定義', '開発設計', 'テスト運用'];

    const table = slide.insertTable(tasks.length + 1, months.length + 1, tableX, tableY, tableWidth, tableHeight);

    // Header row (months)
    months.forEach((m, i) => {
        const cell = table.getCell(0, i + 1); // +1 because the first column is for tasks
        cell.getText().setText(m);
        cell.getFill().setSolidFill(COLORS.PRIMARY);
        cell.getText().getTextStyle().setForegroundColor('#FFFFFF').setBold(true).setFontSize(FONT_SIZES.BODY);
    });

    // Task rows
    tasks.forEach((task, i) => {
        const taskCell = table.getCell(i + 1, 0);
        taskCell.getText().setText(task);
        taskCell.getText().getTextStyle().setBold(true).setFontSize(FONT_SIZES.BODY);

        // ガントチャート的なバーを擬似的に表現
        // This part needs to be adjusted based on actual data for gantt chart
        // For demonstration, let's fill some cells
        if (i === 0) { // 要件定義: M1, M2
            table.getCell(i + 1, 1).getFill().setSolidFill(COLORS.SECONDARY);
            table.getCell(i + 1, 2).getFill().setSolidFill(COLORS.SECONDARY);
        } else if (i === 1) { // 開発設計: M2, M3, M4
            table.getCell(i + 1, 2).getFill().setSolidFill(COLORS.SECONDARY);
            table.getCell(i + 1, 3).getFill().setSolidFill(COLORS.SECONDARY);
            table.getCell(i + 1, 4).getFill().setSolidFill(COLORS.SECONDARY);
        } else if (i === 2) { // テスト運用: M4, M5
            table.getCell(i + 1, 4).getFill().setSolidFill(COLORS.SECONDARY);
            table.getCell(i + 1, 5).getFill().setSolidFill(COLORS.SECONDARY);
        }
    });

    // Original ranking board logic (if still needed, otherwise remove)
    // Assuming the table is an *additional* element, not replacing the ranking board.
    // If it's meant to replace, this part should be removed.
    // For now, I'll keep it but adjust its position if it clashes.
    // Let's assume the table is a new feature and the ranking board is still desired,
    // so I'll move the ranking board down.
    const rankingStartY = tableY + tableHeight + 50; // Adjust position to avoid overlap

    data.rank.forEach((item, i) => {
        const y = rankingStartY + i * (itemH + gap);
        const x = 120;
        const width = 480;

        const box = addShape(slide, { left: x, top: y, width: width, height: itemH, fill: i === 0 ? COLORS.PRIMARY : '#F1F5F9' });
        box.getBorder().getLineFill().setSolidFill(COLORS.PRIMARY);
        box.getBorder().setWeight(1);

        addTextBox(slide, {
            left: x + 10, top: y + 10, width: 50, height: 30,
            text: `${i + 1}`, fontSize: 20, bold: true, fontColor: i === 0 ? '#D97706' : COLORS.TEXT_GRAY
        });
        addTextBox(slide, {
            left: x + 70, top: y + 10, width: width - 80, height: 30,
            text: item, fontSize: 16, bold: true
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
