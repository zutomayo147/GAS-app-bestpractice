import { GanttChartSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * ガントチャートスライドを生成する
 */
export function generateGanttChartSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: GanttChartSlide,
): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);

    // タイトル
    addTextBox(slide, {
        left: LAYOUT.MARGIN,
        top: LAYOUT.TITLE_Y,
        width: 640,
        height: 35,
        text: data.title,
        fontSize: FONT_SIZES.SLIDE_TITLE,
        fontColor: COLORS.PRIMARY,
        bold: true,
        fontFamily: FONTS.TITLE,
    });

    // サブヘッド
    if (data.subhead) {
        addTextBox(slide, {
            left: LAYOUT.MARGIN,
            top: LAYOUT.SUBHEAD_Y,
            width: 640,
            height: 25,
            text: data.subhead,
            fontSize: FONT_SIZES.SUBHEAD,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
        });
    }

    // ガントチャート描画領域設定
    const startY = LAYOUT.CONTENT_Y + 10;
    const taskLabelWidth = 140;
    const totalChartWidth = 640;
    const chartContentWidth = totalChartWidth - taskLabelWidth;
    const headerHeight = 20;

    const totalPeriods = data.header.totalPeriods || Math.max(1, data.header.periods.length);
    if (totalPeriods === 0) return;

    const periodWidth = chartContentWidth / totalPeriods;
    const groups = data.header.groups;
    const periods = data.header.periods;

    // ヘッダー背景を少し引く（任意）
    addShape(slide, {
        left: LAYOUT.MARGIN + taskLabelWidth,
        top: startY,
        width: chartContentWidth,
        height: headerHeight * 2,
        fill: '#F9FAFB',
        shapeType: SlidesApp.ShapeType.RECTANGLE,
    });

    // グループヘッダー描画
    if (groups && groups.length > 0) {
        const periodsPerGroup = Math.ceil(totalPeriods / groups.length);
        groups.forEach((group, i) => {
            const startIdx = i * periodsPerGroup;
            const span = Math.min(periodsPerGroup, totalPeriods - startIdx);
            if (span <= 0) return;
            
            const width = span * periodWidth;
            const x = LAYOUT.MARGIN + taskLabelWidth + startIdx * periodWidth;
            
            addTextBox(slide, {
                left: x,
                top: startY,
                width: width,
                height: headerHeight,
                text: group,
                fontSize: 10,
                fontColor: COLORS.TEXT_DARK,
                fontFamily: FONTS.BODY,
                bold: true,
                alignment: SlidesApp.ParagraphAlignment.CENTER,
            });
            
            // 区切り横線
            slide.insertLine(
                SlidesApp.LineCategory.STRAIGHT,
                x, startY + headerHeight,
                x + width, startY + headerHeight
            ).getLineFill().setSolidFill('#E5E7EB');
        });
    }

    // ピリオドヘッダー描画
    const periodY = startY + headerHeight;
    periods.forEach((period, i) => {
        const x = LAYOUT.MARGIN + taskLabelWidth + i * periodWidth;
        addTextBox(slide, {
            left: x,
            top: periodY,
            width: periodWidth,
            height: headerHeight,
            text: String(period),
            fontSize: 9,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
    });

    // 行領域の開始位置
    const rowYStart = periodY + headerHeight + 5;
    const rowHeight = 22;
    const rowGap = 6;
    const totalRowsHeight = data.rows.length * (rowHeight + rowGap);

    // ピリオドごとの縦線を描画
    periods.forEach((_, i) => {
        if (i === 0) return;
        const x = LAYOUT.MARGIN + taskLabelWidth + i * periodWidth;
        const line = slide.insertLine(
            SlidesApp.LineCategory.STRAIGHT,
            x, periodY,
            x, rowYStart + totalRowsHeight
        );
        line.getLineFill().setSolidFill('#E5E7EB');
    });

    // グループの境界線を強調
    if (groups && groups.length > 0) {
        const periodsPerGroup = Math.ceil(totalPeriods / groups.length);
        groups.forEach((_, i) => {
            if (i === 0) return;
            const x = LAYOUT.MARGIN + taskLabelWidth + i * periodsPerGroup * periodWidth;
            if (x <= LAYOUT.MARGIN + totalChartWidth + 1) { // 誤差許容
                const line = slide.insertLine(
                    SlidesApp.LineCategory.STRAIGHT,
                    x, startY,
                    x, rowYStart + totalRowsHeight
                );
                line.getLineFill().setSolidFill('#9CA3AF');
            }
        });
    }

    // 行データの描画
    data.rows.forEach((row, rowIndex) => {
        const currentY = rowYStart + rowIndex * (rowHeight + rowGap);
        
        // 背景の横縞（交互に少しだけ色を付けるなど可能。ここではシンプルに区切り線）
        slide.insertLine(
            SlidesApp.LineCategory.STRAIGHT,
            LAYOUT.MARGIN, currentY + rowHeight + rowGap / 2,
            LAYOUT.MARGIN + totalChartWidth, currentY + rowHeight + rowGap / 2
        ).getLineFill().setSolidFill('#F3F4F6');

        if (row.taskName) {
            addTextBox(slide, {
                left: LAYOUT.MARGIN,
                top: currentY,
                width: taskLabelWidth - 10,
                height: rowHeight,
                text: row.taskName,
                fontSize: 10,
                fontColor: COLORS.TEXT_DARK,
                fontFamily: FONTS.BODY,
                bold: true,
                alignment: SlidesApp.ParagraphAlignment.START,
            });
        }
        
        // バーの描画
        if (row.bars) {
            row.bars.forEach(bar => {
                const barX = LAYOUT.MARGIN + taskLabelWidth + bar.startIndex * periodWidth;
                const barW = bar.span * periodWidth;
                
                const barPadding = 3;
                const actualBarY = currentY + barPadding;
                const actualBarH = rowHeight - barPadding * 2;
                
                addShape(slide, {
                    left: barX,
                    top: actualBarY,
                    width: barW,
                    height: actualBarH,
                    fill: bar.color || COLORS.ACCENT,
                    shapeType: SlidesApp.ShapeType.ROUND_RECTANGLE,
                });
            });
        }
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
