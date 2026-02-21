import { hexToRgb } from './colorUtils';
import { PT_TO_EMU, FONTS } from '../config/slideConfig';

/** pt → EMU 変換 */
export function ptToEmu(pt: number): number {
    return pt * PT_TO_EMU;
}

/** ソリッド塗りつぶし用の transform オブジェクトを返す */
export function createSolidFill(hex: string): GoogleAppsScript.Slides.SolidFill {
    // SlidesApp のシェイプ等に適用するため、直接 API は使わず
    // ヘルパーとして RGB 値を返す。実際の適用はシェイプの getFill() 経由。
    // ここでは型互換のために hexToRgb を使う形にしておく。
    const rgb = hexToRgb(hex);
    return rgb as unknown as GoogleAppsScript.Slides.SolidFill;
}

/** テキストボックス設定 */
export interface TextBoxConfig {
    left: number;
    top: number;
    width: number;
    height: number;
    text: string;
    fontSize: number;
    fontColor?: string;
    bold?: boolean;
    italic?: boolean;
    fontFamily?: string;
    alignment?: GoogleAppsScript.Slides.ParagraphAlignment;
    bgColor?: string;
}

/**
 * スライドにテキストボックスを追加する
 */
export function addTextBox(slide: GoogleAppsScript.Slides.Slide, config: TextBoxConfig): GoogleAppsScript.Slides.Shape {
    const shape = slide.insertTextBox(config.text, config.left, config.top, config.width, config.height);

    const textRange = shape.getText();
    const style = textRange.getTextStyle();
    style.setFontSize(config.fontSize);
    style.setFontFamily(config.fontFamily || FONTS.BODY);

    if (config.fontColor) {
        style.setForegroundColor(config.fontColor);
    }
    if (config.bold) {
        style.setBold(true);
    }
    if (config.italic) {
        style.setItalic(true);
    }
    if (config.alignment) {
        textRange.getParagraphs().forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(config.alignment!);
        });
    }
    if (config.bgColor) {
        shape.getFill().setSolidFill(config.bgColor);
    }

    return shape;
}

/** シェイプ設定 */
export interface ShapeConfig {
    left: number;
    top: number;
    width: number;
    height: number;
    fill?: string;
    shapeType?: GoogleAppsScript.Slides.ShapeType;
}

/**
 * スライドにシェイプを追加する
 */
export function addShape(slide: GoogleAppsScript.Slides.Slide, config: ShapeConfig): GoogleAppsScript.Slides.Shape {
    const shapeType = config.shapeType || SlidesApp.ShapeType.RECTANGLE;
    const shape = slide.insertShape(shapeType, config.left, config.top, config.width, config.height);

    if (config.fill) {
        shape.getFill().setSolidFill(config.fill);
    }

    // 枠線を消す
    shape.getBorder().setTransparent();

    return shape;
}

/**
 * スライドにスピーカーノートを追加する
 */
export function addNotesToSlide(slide: GoogleAppsScript.Slides.Slide, notes: string): void {
    const notesPage = slide.getNotesPage();
    notesPage.getSpeakerNotesShape().getText().setText(notes);
}

/**
 * スライドにフッターを追加する
 */
export function addFooter(slide: GoogleAppsScript.Slides.Slide, text: string): void {
    const textBox = slide.insertTextBox(text);

    // 配置（左下）
    textBox.setLeft(20); // 左マージン
    textBox.setTop(385); // 下マージン（全体の405 - 20）
    textBox.setWidth(300);
    textBox.setHeight(20);

    const style = textBox.getText().getTextStyle();
    style.setFontSize(8);
    style.setForegroundColor('#999999');
    style.setFontFamily('Arial'); // フッターは目立たないフォントで
}

/**
 * 各スライドの右上にスライドタイプを表示する
 */
export function addSlideTypeLabel(slide: GoogleAppsScript.Slides.Slide, type: string): void {
    const label = `Type: ${type}`;
    const width = 150;
    const height = 20;
    const padding = 10;

    // 右上に配置 (スライド幅 720pt)
    const textBox = slide.insertTextBox(label, 720 - width - padding, padding, width, height);

    const style = textBox.getText().getTextStyle();
    style.setFontSize(8);
    style.setForegroundColor('#000000');
    style.setFontFamily('Arial');

    // 右寄せ
    textBox
        .getText()
        .getParagraphs()
        .forEach((p) => {
            p.getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
        });
}
