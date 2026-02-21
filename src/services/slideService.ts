import { SlideData, PresentationSettings } from '../domain/slideTypes';
import { updateConfig, GLOBAL_SETTINGS } from '../config/slideConfig';
import { addFooter, addSlideTypeLabel } from '../utils/slideUtils';
import { generateTitleSlide } from '../generators/titleGenerator';
import { generateAgendaSlide } from '../generators/agendaGenerator';
import { generateSectionSlide } from '../generators/sectionGenerator';
import { generateCompareSlide } from '../generators/compareGenerator';
import { generatePyramidSlide } from '../generators/pyramidGenerator';
import { generateBulletCardsSlide } from '../generators/bulletCardsGenerator';
import { generateProcessSlide } from '../generators/processGenerator';
import { generateTriangleSlide } from '../generators/triangleGenerator';
import { generateHeaderCardsSlide } from '../generators/headerCardsGenerator';
import { generateCycleSlide } from '../generators/cycleGenerator';
import { generateStepUpSlide } from '../generators/stepUpGenerator';
import { generateClosingSlide } from '../generators/closingGenerator';
import { generateGanttChartSlide } from '../generators/ganttChartGenerator';
import * as layout from '../generators/layoutGenerators';
import * as compareExt from '../generators/compareExtGenerator';
import * as flowExt from '../generators/flowExtGenerator';
import * as cycleExt from '../generators/cycleExtGenerator';
import * as pyramidExt from '../generators/pyramidExtGenerator';
import * as diagram from '../generators/diagramGenerators';
import * as logic from '../generators/logicGenerators';
import * as chart from '../generators/chartGenerators';
import * as detail from '../generators/detailGenerators';
import * as special from '../generators/specialGenerators';
import * as newSlides from '../generators/newSlideGenerators';

/** ジェネレーター関数の型 */
type GeneratorFn = (
    presentation: GoogleAppsScript.Slides.Presentation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slideData: any,
) => void;

/**
 * スライドタイプ→ジェネレーター関数のマップ
 * 新しいスライドタイプを追加する際はここにエントリを追加するだけでよい
 */
const SLIDE_GENERATORS: Record<string, GeneratorFn> = {
    // ===== 基本スライド =====
    title: generateTitleSlide,
    agenda: generateAgendaSlide,
    section: generateSectionSlide,
    closing: generateClosingSlide,
    // ===== 比較・レイアウト系 =====
    compare: generateCompareSlide,
    parallelHorizontal: layout.generateParallelHorizontalSlide,
    parallelVertical: layout.generateParallelVerticalSlide,
    parallelMultiple: layout.generateParallelMultipleSlide,
    areaRange: layout.generateAreaRangeSlide,
    overlapInfo: layout.generateOverlapInfoSlide,
    inclusionHier: layout.generateInclusionHierSlide,
    // ===== 比較拡張系 =====
    compareScale: compareExt.generateCompareScaleSlide,
    compareItem: compareExt.generateCompareItemSlide,
    compareTable: compareExt.generateCompareTableSlide,
    interaction: compareExt.generateInteractionSlide,
    transition: compareExt.generateTransitionSlide,
    // ===== フロー系 =====
    flowHorizontal: flowExt.generateFlowHorizontalSlide,
    flowVertical: flowExt.generateFlowVerticalSlide,
    captureFlow: flowExt.generateCaptureFlowSlide,
    // ===== サイクル系 =====
    cycle: generateCycleSlide,
    cycleCircular: cycleExt.generateCycleCircularSlide,
    cycleSquare: cycleExt.generateCycleSquareSlide,
    // ===== ピラミッド系 =====
    pyramid: generatePyramidSlide,
    pyramidUp: pyramidExt.generatePyramidUpSlide,
    pyramidDown: pyramidExt.generatePyramidDownSlide,
    treeDiagram: pyramidExt.generateTreeDiagramSlide,
    // ===== ダイアグラム系 =====
    matrixPos: diagram.generateMatrixPosSlide,
    vennDiagram: diagram.generateVennDiagramSlide,
    rankingBoard: diagram.generateRankingBoardSlide,
    // ===== ロジック系 =====
    formulaLogic: logic.generateFormulaLogicSlide,
    multiplyEffect: logic.generateMultiplyEffectSlide,
    addCombination: logic.generateAddCombinationSlide,
    // ===== グラフ系 =====
    barGraph: chart.generateBarGraphSlide,
    pieGraph: chart.generatePieGraphSlide,
    lineGraph: chart.generateLineGraphSlide,
    chartCombine: chart.generateChartCombineSlide,
    // ===== 詳細系 =====
    captureList: detail.generateCaptureListSlide,
    captureZoom: detail.generateCaptureZoomSlide,
    priceTable: detail.generatePriceTableSlide,
    tableDetail: detail.generateTableDetailSlide,
    caseStudyInfo: detail.generateCaseStudyInfoSlide,
    qaSection: detail.generateQaSectionSlide,
    // ===== スペシャル系 =====
    locationMap: special.generateLocationMapSlide,
    scheduleTable: special.generateScheduleTableSlide,
    quoteImpact: special.generateQuoteImpactSlide,
    // ===== カード・リスト系 =====
    bulletCards: generateBulletCardsSlide,
    process: generateProcessSlide,
    triangle: generateTriangleSlide,
    headerCards: generateHeaderCardsSlide,
    stepUp: generateStepUpSlide,
    // ===== 新デザイン向けスライドタイプ =====
    content: newSlides.generateContentSlide,
    processList: newSlides.generateProcessListSlide,
    timeline: newSlides.generateTimelineSlide,
    diagram: newSlides.generateDiagramSlide,
    cards: newSlides.generateCardsSlide,
    table: newSlides.generateTableSlide,
    progress: newSlides.generateProgressSlide,
    quote: newSlides.generateQuoteSlide,
    kpi: newSlides.generateKpiSlide,
    faq: newSlides.generateFaqSlide,
    statsCompare: newSlides.generateStatsCompareSlide,
    barCompare: newSlides.generateBarCompareSlide,
    flowChart: newSlides.generateFlowChartSlide,
    imageText: newSlides.generateImageTextSlide,
    ganttChart: generateGanttChartSlide,
};

/**
 * JSONデータからGoogleスライドプレゼンテーションを生成するサービス
 */
export class SlideService {
    /**
     * JSONスライドデータからプレゼンテーションを生成する
     * @param jsonData スライドデータの配列
     * @param options オプション設定（タイトル、デザイン設定など）
     * @returns 生成されたプレゼンテーションのURL
     */
    static generatePresentation(
        jsonData: SlideData[],
        options: { title?: string; settings?: PresentationSettings } = {},
    ): string {
        // デザイン設定の適用
        if (options.settings) {
            updateConfig(options.settings);
            if (options.settings.footerText) {
                GLOBAL_SETTINGS.footerText = options.settings.footerText;
            }
        }

        // タイトルの決定
        const presentationTitle =
            options.title ||
            (jsonData.find((s) => s.type === 'title') as { title?: string } | undefined)?.title ||
            'Generated Presentation';

        // プレゼンテーションの作成
        const presentation = SlidesApp.create(presentationTitle);

        // 各スライドを生成
        jsonData.forEach((slideData) => {
            SlideService.generateSlide(presentation, slideData);
        });

        // 全スライドにフッター適用（タイトルスライドを除く）
        if (GLOBAL_SETTINGS.footerText) {
            presentation.getSlides().forEach((slide, index) => {
                if (index === 0 && jsonData[0]?.type === 'title') {
                    return;
                }
                addFooter(slide, GLOBAL_SETTINGS.footerText);
            });
        }

        // 最初の空白スライドを削除（SlidesApp.create() で自動生成される）
        const slides = presentation.getSlides();
        if (slides.length > jsonData.length) {
            slides[0].remove();
        }

        // 指定フォルダへの移動
        if (options.settings?.outputFolderUrl) {
            try {
                const folderId = extractFolderId(options.settings.outputFolderUrl);
                if (folderId) {
                    const file = DriveApp.getFileById(presentation.getId());
                    const folder = DriveApp.getFolderById(folderId);
                    file.moveTo(folder);
                }
            } catch (e) {
                console.warn('Failed to move presentation to folder:', e);
            }
        }

        return presentation.getUrl();
    }

    /**
     * スライドデータのtypeに基づき適切なジェネレーターを呼び出す
     */
    private static generateSlide(
        presentation: GoogleAppsScript.Slides.Presentation,
        slideData: SlideData,
    ): void {
        const generator = SLIDE_GENERATORS[slideData.type];
        if (generator) {
            generator(presentation, slideData);
            
            // スライドタイプを右上に表示
            const slides = presentation.getSlides();
            const lastSlide = slides[slides.length - 1];
            if (lastSlide) {
                addSlideTypeLabel(lastSlide, slideData.type);
            }
        } else {
            console.warn(`Unknown slide type: ${slideData.type}`);
        }
    }
}

/**
 * フォルダURLからIDを抽出する
 * @param url Google DriveのフォルダURL
 * @returns フォルダID（抽出できない場合はnull）
 */
export function extractFolderId(url: string): string | null {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
}
