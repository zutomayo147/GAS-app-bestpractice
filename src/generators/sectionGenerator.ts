import { SectionSlide } from '../domain/slideTypes';
import { COLORS, FONTS, FONT_SIZES } from '../config/slideConfig';
import { addTextBox, addShape, addNotesToSlide } from '../utils/slideUtils';

/**
 * セクション区切りスライドを生成する
 */
export function generateSectionSlide(
    presentation: GoogleAppsScript.Slides.Presentation,
    data: SectionSlide,
): void {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

    // 背景を濃紺にする
    slide.getBackground().setSolidFill(COLORS.SECTION_BG);

    // セクション番号（大きく表示）
    const noText = String(data.sectionNo).padStart(2, '0');
    addTextBox(slide, {
        left: 60,
        top: 80,
        width: 150,
        height: 80,
        text: noText,
        fontSize: FONT_SIZES.SECTION_NO,
        fontColor: COLORS.ACCENT,
        bold: true,
        fontFamily: FONTS.TITLE,
    });

    // 区切りライン
    addShape(slide, {
        left: 60,
        top: 170,
        width: 80,
        height: 3,
        fill: COLORS.ACCENT,
    });

    // セクションタイトル
    const titleLines = data.title.split('\n');
    addTextBox(slide, {
        left: 60,
        top: 185,
        width: 600,
        height: 120,
        text: titleLines.join('\n'),
        fontSize: FONT_SIZES.SECTION_TITLE,
        fontColor: COLORS.TEXT_WHITE,
        bold: true,
        fontFamily: FONTS.TITLE,
    });

    // 右下装飾
    addShape(slide, {
        left: 650,
        top: 370,
        width: 60,
        height: 3,
        fill: COLORS.ACCENT,
    });

    if (data.notes) {
        addNotesToSlide(slide, data.notes);
    }
}
