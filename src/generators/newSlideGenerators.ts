/**
 * 新デザイン向け追加スライドジェネレータ
 *
 * content / processList / timeline / diagram / cards / table /
 * progress / quote / kpi / faq / statsCompare / barCompare /
 * flowChart / imageText
 */

import {
    ContentSlide,
    ProcessListSlide,
    TimelineSlide,
    DiagramSlide,
    CardsSlide,
    TableSlide,
    ProgressSlide,
    QuoteSlide,
    KpiSlide,
    FaqSlide,
    StatsCompareSlide,
    BarCompareSlide,
    FlowChartSlide,
    ImageTextSlide,
} from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES, LAYOUT } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

type Presentation = GoogleAppsScript.Slides.Presentation;

// ---- 共通ヘルパー ----

function addTitleAndSubhead(
    slide: GoogleAppsScript.Slides.Slide,
    title: string,
    subhead?: string,
): void {
    addTextBox(slide, {
        left: LAYOUT.MARGIN,
        top: LAYOUT.TITLE_Y,
        width: 640,
        height: 35,
        text: title,
        fontSize: FONT_SIZES.SLIDE_TITLE,
        fontColor: COLORS.PRIMARY,
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

const CONTENT_Y = LAYOUT.CONTENT_Y;
const CONTENT_H = 405 - LAYOUT.CONTENT_Y - 15;
const CONTENT_W = 640;

// ---- コンテンツスライド ----
export function generateContentSlide(presentation: Presentation, data: ContentSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    if (data.twoColumn && data.columns) {
        const colW = (CONTENT_W - LAYOUT.CARD_GAP) / 2;
        data.columns.forEach((col, i) => {
            addTextBox(slide, {
                left: LAYOUT.MARGIN + i * (colW + LAYOUT.CARD_GAP),
                top: CONTENT_Y,
                width: colW,
                height: CONTENT_H,
                text: col.map((p) => `• ${p}`).join('\n'),
                fontSize: FONT_SIZES.BODY,
                fontColor: COLORS.TEXT_DARK,
                fontFamily: FONTS.BODY,
            });
        });
    } else if (data.points) {
        addTextBox(slide, {
            left: LAYOUT.MARGIN,
            top: CONTENT_Y,
            width: CONTENT_W,
            height: CONTENT_H,
            text: data.points.map((p) => `• ${p}`).join('\n'),
            fontSize: FONT_SIZES.BODY,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });
    }

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- プロセスリストスライド ----
export function generateProcessListSlide(presentation: Presentation, data: ProcessListSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const steps = data.steps;
    const itemH = Math.min(Math.floor(CONTENT_H / steps.length), 55);

    steps.forEach((step, i) => {
        const y = CONTENT_Y + i * itemH;
        // 番号バッジ
        const badge = addShape(slide, {
            left: LAYOUT.MARGIN,
            top: y + 2,
            width: 28,
            height: 28,
            fill: COLORS.ACCENT,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        badge.getText().setText(String(i + 1));
        badge.getText().getTextStyle()
            .setFontSize(12).setForegroundColor(COLORS.TEXT_WHITE).setBold(true).setFontFamily(FONTS.BODY);
        badge.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        addTextBox(slide, {
            left: LAYOUT.MARGIN + 36,
            top: y,
            width: CONTENT_W - 36,
            height: itemH - 4,
            text: step,
            fontSize: FONT_SIZES.BODY,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- タイムラインスライド ----
export function generateTimelineSlide(presentation: Presentation, data: TimelineSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const milestones = data.milestones;
    const colW = Math.floor(CONTENT_W / milestones.length);

    milestones.forEach((m, i) => {
        const x = LAYOUT.MARGIN + i * colW;
        const stateColor =
            m.state === 'done' ? COLORS.SUCCESS :
            m.state === 'next' ? COLORS.ACCENT :
            COLORS.TEXT_GRAY;

        // ドット
        const dot = addShape(slide, {
            left: x + colW / 2 - 10,
            top: CONTENT_Y,
            width: 20,
            height: 20,
            fill: stateColor,
            shapeType: SlidesApp.ShapeType.ELLIPSE,
        });
        dot.getBorder().setTransparent();

        addTextBox(slide, {
            left: x,
            top: CONTENT_Y + 28,
            width: colW - 4,
            height: 30,
            text: m.label,
            fontSize: FONT_SIZES.CARD_TITLE,
            fontColor: stateColor,
            bold: true,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
        addTextBox(slide, {
            left: x,
            top: CONTENT_Y + 62,
            width: colW - 4,
            height: 22,
            text: m.date,
            fontSize: FONT_SIZES.SMALL,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- スイムレーンダイアグラムスライド ----
export function generateDiagramSlide(presentation: Presentation, data: DiagramSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const lanes = data.lanes;
    const laneH = Math.floor(CONTENT_H / lanes.length);
    const labelW = 110;

    lanes.forEach((lane, i) => {
        const y = CONTENT_Y + i * laneH;

        // レーンラベル背景
        addShape(slide, {
            left: LAYOUT.MARGIN,
            top: y,
            width: labelW,
            height: laneH - 4,
            fill: COLORS.ACCENT,
        });

        const labelShape = slide.insertTextBox(lane.title, LAYOUT.MARGIN, y, labelW, laneH - 4);
        labelShape.getText().getTextStyle()
            .setFontSize(FONT_SIZES.CARD_TITLE).setForegroundColor(COLORS.TEXT_WHITE).setBold(true).setFontFamily(FONTS.BODY);
        labelShape.getText().getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        });

        addTextBox(slide, {
            left: LAYOUT.MARGIN + labelW + 8,
            top: y + 4,
            width: CONTENT_W - labelW - 8,
            height: laneH - 12,
            text: lane.items.join('  →  '),
            fontSize: FONT_SIZES.BODY,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- カードスライド ----
export function generateCardsSlide(presentation: Presentation, data: CardsSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const cols = data.columns ?? 3;
    const cardW = Math.floor((CONTENT_W - LAYOUT.CARD_GAP * (cols - 1)) / cols);
    const rows = Math.ceil(data.items.length / cols);
    const cardH = Math.min(Math.floor(CONTENT_H / rows) - 8, 100);

    data.items.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = LAYOUT.MARGIN + col * (cardW + LAYOUT.CARD_GAP);
        const y = CONTENT_Y + row * (cardH + 8);

        addShape(slide, { left: x, top: y, width: cardW, height: cardH, fill: COLORS.CARD_BG });

        const text = typeof item === 'string' ? item : `${item.title}${item.desc ? '\n' + item.desc : ''}`;
        addTextBox(slide, {
            left: x + 8,
            top: y + 8,
            width: cardW - 16,
            height: cardH - 16,
            text,
            fontSize: FONT_SIZES.BODY,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- テーブルスライド ----
export function generateTableSlide(presentation: Presentation, data: TableSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const allRows = [data.headers, ...data.rows];
    const rowH = Math.min(Math.floor(CONTENT_H / allRows.length), 40);
    const cols = data.headers.length;
    const colW = Math.floor(CONTENT_W / cols);

    allRows.forEach((row, ri) => {
        const isHeader = ri === 0;
        if (isHeader) {
            addShape(slide, {
                left: LAYOUT.MARGIN,
                top: CONTENT_Y + ri * rowH,
                width: CONTENT_W,
                height: rowH,
                fill: COLORS.PRIMARY,
            });
        }
        row.forEach((cell, ci) => {
            addTextBox(slide, {
                left: LAYOUT.MARGIN + ci * colW + 4,
                top: CONTENT_Y + ri * rowH + 4,
                width: colW - 8,
                height: rowH - 8,
                text: cell,
                fontSize: isHeader ? FONT_SIZES.CARD_TITLE : FONT_SIZES.BODY,
                fontColor: isHeader ? COLORS.TEXT_WHITE : COLORS.TEXT_DARK,
                bold: isHeader,
                fontFamily: FONTS.BODY,
            });
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- プログレスバースライド ----
export function generateProgressSlide(presentation: Presentation, data: ProgressSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const items = data.items;
    const itemH = Math.min(Math.floor(CONTENT_H / items.length), 52);
    const labelW = 150;
    const barMaxW = CONTENT_W - labelW - 60;

    items.forEach((item, i) => {
        const y = CONTENT_Y + i * itemH;

        addTextBox(slide, {
            left: LAYOUT.MARGIN,
            top: y + (itemH - 20) / 2,
            width: labelW,
            height: 20,
            text: item.label,
            fontSize: FONT_SIZES.BODY,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });

        // バー背景
        addShape(slide, {
            left: LAYOUT.MARGIN + labelW + 8,
            top: y + (itemH - 16) / 2,
            width: barMaxW,
            height: 16,
            fill: COLORS.BG_LIGHT,
        });

        // バー本体
        const barW = Math.max(Math.floor((barMaxW * Math.min(item.percent, 100)) / 100), 4);
        addShape(slide, {
            left: LAYOUT.MARGIN + labelW + 8,
            top: y + (itemH - 16) / 2,
            width: barW,
            height: 16,
            fill: COLORS.ACCENT,
        });

        addTextBox(slide, {
            left: LAYOUT.MARGIN + labelW + barMaxW + 16,
            top: y + (itemH - 20) / 2,
            width: 40,
            height: 20,
            text: `${item.percent}%`,
            fontSize: FONT_SIZES.SMALL,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- 引用スライド ----
export function generateQuoteSlide(presentation: Presentation, data: QuoteSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    addTextBox(slide, {
        left: LAYOUT.MARGIN,
        top: CONTENT_Y,
        width: CONTENT_W,
        height: CONTENT_H - 40,
        text: `"${data.text}"`,
        fontSize: 20,
        fontColor: COLORS.PRIMARY,
        bold: true,
        fontFamily: FONTS.TITLE,
        alignment: SlidesApp.ParagraphAlignment.CENTER,
    });

    addTextBox(slide, {
        left: LAYOUT.MARGIN,
        top: 405 - LAYOUT.MARGIN - 28,
        width: CONTENT_W,
        height: 24,
        text: `— ${data.author}`,
        fontSize: FONT_SIZES.BODY,
        fontColor: COLORS.TEXT_GRAY,
        fontFamily: FONTS.BODY,
        alignment: SlidesApp.ParagraphAlignment.END,
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- KPIスライド ----
export function generateKpiSlide(presentation: Presentation, data: KpiSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const cols = data.columns ?? 3;
    const cardW = Math.floor((CONTENT_W - LAYOUT.CARD_GAP * (cols - 1)) / cols);

    data.items.forEach((item, i) => {
        const x = LAYOUT.MARGIN + i * (cardW + LAYOUT.CARD_GAP);
        const statusColor =
            item.status === 'good' ? COLORS.SUCCESS :
            item.status === 'bad' ? COLORS.SECONDARY :
            COLORS.TEXT_GRAY;

        addShape(slide, { left: x, top: CONTENT_Y, width: cardW, height: CONTENT_H, fill: COLORS.CARD_BG });

        addTextBox(slide, {
            left: x + 8, top: CONTENT_Y + 8, width: cardW - 16, height: 22,
            text: item.label,
            fontSize: FONT_SIZES.SMALL, fontColor: COLORS.TEXT_GRAY, fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
        addTextBox(slide, {
            left: x + 8, top: CONTENT_Y + 34, width: cardW - 16, height: 50,
            text: item.value,
            fontSize: 28, fontColor: statusColor, bold: true, fontFamily: FONTS.TITLE,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
        addTextBox(slide, {
            left: x + 8, top: CONTENT_Y + 88, width: cardW - 16, height: 22,
            text: item.change,
            fontSize: FONT_SIZES.BODY, fontColor: statusColor, fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- FAQスライド ----
export function generateFaqSlide(presentation: Presentation, data: FaqSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const items = data.items;
    const itemH = Math.min(Math.floor(CONTENT_H / items.length), 72);

    items.forEach((item, i) => {
        const y = CONTENT_Y + i * itemH;
        addTextBox(slide, {
            left: LAYOUT.MARGIN,
            top: y,
            width: CONTENT_W,
            height: Math.floor(itemH / 2) - 2,
            text: `Q: ${item.q}`,
            fontSize: FONT_SIZES.CARD_TITLE,
            fontColor: COLORS.ACCENT,
            bold: true,
            fontFamily: FONTS.BODY,
        });
        addTextBox(slide, {
            left: LAYOUT.MARGIN + 16,
            top: y + Math.floor(itemH / 2),
            width: CONTENT_W - 16,
            height: Math.floor(itemH / 2) - 2,
            text: `A: ${item.a}`,
            fontSize: FONT_SIZES.BODY,
            fontColor: COLORS.TEXT_DARK,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- 統計比較スライド ----
export function generateStatsCompareSlide(presentation: Presentation, data: StatsCompareSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const colW = Math.floor((CONTENT_W - LAYOUT.CARD_GAP) / 2);
    const headerH = 30;

    addShape(slide, { left: LAYOUT.MARGIN, top: CONTENT_Y, width: colW, height: headerH, fill: COLORS.COMPARE_LEFT });
    addShape(slide, { left: LAYOUT.MARGIN + colW + LAYOUT.CARD_GAP, top: CONTENT_Y, width: colW, height: headerH, fill: COLORS.COMPARE_RIGHT });

    addTextBox(slide, {
        left: LAYOUT.MARGIN, top: CONTENT_Y, width: colW, height: headerH,
        text: data.leftTitle,
        fontSize: FONT_SIZES.CARD_TITLE, fontColor: COLORS.TEXT_WHITE, bold: true, fontFamily: FONTS.BODY,
        alignment: SlidesApp.ParagraphAlignment.CENTER,
    });
    addTextBox(slide, {
        left: LAYOUT.MARGIN + colW + LAYOUT.CARD_GAP, top: CONTENT_Y, width: colW, height: headerH,
        text: data.rightTitle,
        fontSize: FONT_SIZES.CARD_TITLE, fontColor: COLORS.TEXT_WHITE, bold: true, fontFamily: FONTS.BODY,
        alignment: SlidesApp.ParagraphAlignment.CENTER,
    });

    const statH = Math.min(Math.floor((CONTENT_H - headerH) / data.stats.length), 44);
    data.stats.forEach((stat, i) => {
        const y = CONTENT_Y + headerH + i * statH;
        addTextBox(slide, {
            left: LAYOUT.MARGIN, top: y, width: colW, height: statH,
            text: stat.leftValue,
            fontSize: 18, fontColor: COLORS.COMPARE_LEFT, bold: true, fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
        addTextBox(slide, {
            left: LAYOUT.MARGIN + colW + LAYOUT.CARD_GAP, top: y, width: colW, height: statH,
            text: stat.rightValue,
            fontSize: 18, fontColor: COLORS.COMPARE_RIGHT, bold: true, fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- 棒グラフ比較スライド ----
export function generateBarCompareSlide(presentation: Presentation, data: BarCompareSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const stats = data.stats;
    const itemH = Math.min(Math.floor(CONTENT_H / stats.length), 52);
    const labelW = 130;
    const barMaxW = Math.floor((CONTENT_W - labelW - 16) / 2);

    stats.forEach((stat, i) => {
        const y = CONTENT_Y + i * itemH;

        addTextBox(slide, {
            left: LAYOUT.MARGIN,
            top: y + (itemH - 18) / 2,
            width: labelW,
            height: 18,
            text: stat.label,
            fontSize: FONT_SIZES.SMALL,
            fontColor: COLORS.TEXT_GRAY,
            fontFamily: FONTS.BODY,
        });

        // 左バー（固定50%表示）
        const leftBarW = Math.floor(barMaxW * 0.5);
        addShape(slide, {
            left: LAYOUT.MARGIN + labelW + 8,
            top: y + 4,
            width: leftBarW,
            height: Math.floor(itemH / 2) - 6,
            fill: COLORS.COMPARE_LEFT,
        });
        addTextBox(slide, {
            left: LAYOUT.MARGIN + labelW + 8 + leftBarW + 4,
            top: y + 4,
            width: 80,
            height: Math.floor(itemH / 2) - 6,
            text: stat.leftValue,
            fontSize: FONT_SIZES.SMALL,
            fontColor: COLORS.COMPARE_LEFT,
            fontFamily: FONTS.BODY,
        });

        // 右バー（固定70%表示）
        const rightBarW = Math.floor(barMaxW * 0.7);
        addShape(slide, {
            left: LAYOUT.MARGIN + labelW + 8,
            top: y + Math.floor(itemH / 2),
            width: rightBarW,
            height: Math.floor(itemH / 2) - 6,
            fill: COLORS.COMPARE_RIGHT,
        });
        addTextBox(slide, {
            left: LAYOUT.MARGIN + labelW + 8 + rightBarW + 4,
            top: y + Math.floor(itemH / 2),
            width: 80,
            height: Math.floor(itemH / 2) - 6,
            text: stat.rightValue,
            fontSize: FONT_SIZES.SMALL,
            fontColor: COLORS.COMPARE_RIGHT,
            fontFamily: FONTS.BODY,
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- フローチャートスライド ----
export function generateFlowChartSlide(presentation: Presentation, data: FlowChartSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const flows = data.flows;
    const flowH = Math.floor(CONTENT_H / flows.length);

    flows.forEach((flow, fi) => {
        const y = CONTENT_Y + fi * flowH;
        const stepCount = flow.steps.length;
        const stepW = Math.floor(CONTENT_W / stepCount);

        flow.steps.forEach((step, si) => {
            const x = LAYOUT.MARGIN + si * stepW;
            const boxW = stepW - (si < stepCount - 1 ? 16 : 0);

            addShape(slide, {
                left: x,
                top: y + 4,
                width: boxW,
                height: flowH - 8,
                fill: COLORS.CARD_BG,
            });

            addTextBox(slide, {
                left: x + 4,
                top: y + 4,
                width: boxW - 8,
                height: flowH - 8,
                text: step,
                fontSize: FONT_SIZES.BODY,
                fontColor: COLORS.TEXT_DARK,
                fontFamily: FONTS.BODY,
                alignment: SlidesApp.ParagraphAlignment.CENTER,
            });

            if (si < stepCount - 1) {
                addTextBox(slide, {
                    left: x + boxW + 2,
                    top: y + (flowH - 16) / 2,
                    width: 12,
                    height: 16,
                    text: '▶',
                    fontSize: 10,
                    fontColor: COLORS.ACCENT,
                    fontFamily: FONTS.BODY,
                });
            }
        });
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}

// ---- 画像+テキストスライド ----
export function generateImageTextSlide(presentation: Presentation, data: ImageTextSlide): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    slide.getBackground().setSolidFill(COLORS.BG_WHITE);
    addTitleAndSubhead(slide, data.title, data.subhead);

    const halfW = Math.floor((CONTENT_W - LAYOUT.CARD_GAP) / 2);
    const isLeft = data.imagePosition !== 'right';
    const imgX = isLeft ? LAYOUT.MARGIN : LAYOUT.MARGIN + halfW + LAYOUT.CARD_GAP;
    const textX = isLeft ? LAYOUT.MARGIN + halfW + LAYOUT.CARD_GAP : LAYOUT.MARGIN;

    // 画像取得を試みる（URLベース）
    try {
        const blob = UrlFetchApp.fetch(data.image).getBlob();
        slide.insertImage(blob, imgX, CONTENT_Y, halfW, CONTENT_H);
    } catch (_e) {
        // 画像取得失敗時のプレースホルダー
        addShape(slide, { left: imgX, top: CONTENT_Y, width: halfW, height: CONTENT_H, fill: COLORS.BG_LIGHT });
        addTextBox(slide, {
            left: imgX + 8, top: CONTENT_Y + CONTENT_H / 2 - 12, width: halfW - 16, height: 24,
            text: `[Image]`,
            fontSize: FONT_SIZES.BODY, fontColor: COLORS.TEXT_GRAY, fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
    }

    if (data.imageCaption) {
        addTextBox(slide, {
            left: imgX, top: CONTENT_Y + CONTENT_H - 20, width: halfW, height: 18,
            text: data.imageCaption,
            fontSize: FONT_SIZES.SMALL, fontColor: COLORS.TEXT_GRAY, fontFamily: FONTS.BODY,
            alignment: SlidesApp.ParagraphAlignment.CENTER,
        });
    }

    addTextBox(slide, {
        left: textX,
        top: CONTENT_Y,
        width: halfW,
        height: CONTENT_H,
        text: data.points.map((p) => `• ${p}`).join('\n'),
        fontSize: FONT_SIZES.BODY,
        fontColor: COLORS.TEXT_DARK,
        fontFamily: FONTS.BODY,
    });

    if (data.notes) addNotesToSlide(slide, data.notes);
}
