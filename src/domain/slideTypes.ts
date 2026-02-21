/** 共通ベース */
export interface SlideBase {
    type: string;
    notes?: string;
}

/** タイトルスライド */
export interface TitleSlide extends SlideBase {
    type: 'title';
    title: string;
    date: string;
}

/** アジェンダスライド */
export interface AgendaSlide extends SlideBase {
    type: 'agenda';
    title: string;
    subhead?: string;
    items: string[];
}

/** セクション区切り */
export interface SectionSlide extends SlideBase {
    type: 'section';
    title: string;
    sectionNo?: number;
}

/** 締めスライド */
export interface ClosingSlide extends SlideBase {
    type: 'closing';
}

/** コンテンツスライド（汎用） */
export interface ContentSlide extends SlideBase {
    type: 'content';
    title: string;
    subhead?: string;
    points?: string[];
    twoColumn?: boolean;
    columns?: [string[], string[]];
}

/** 左右比較 */
export interface CompareSlide extends SlideBase {
    type: 'compare';
    title: string;
    subhead?: string;
    leftTitle: string;
    rightTitle: string;
    leftItems: string[];
    rightItems: string[];
}

/** プロセス手順 */
export interface ProcessSlide extends SlideBase {
    type: 'process';
    title: string;
    subhead?: string;
    steps: string[];
}

/** プロセスリスト */
export interface ProcessListSlide extends SlideBase {
    type: 'processList';
    title: string;
    subhead?: string;
    steps: string[];
}

/** タイムラインマイルストーン */
export interface TimelineMilestone {
    label: string;
    date: string;
    state?: 'done' | 'next' | 'todo';
}

/** タイムライン */
export interface TimelineSlide extends SlideBase {
    type: 'timeline';
    title: string;
    subhead?: string;
    milestones: TimelineMilestone[];
}

/** スイムレーンダイアグラムレーン */
export interface DiagramLane {
    title: string;
    items: string[];
}

/** スイムレーンダイアグラム */
export interface DiagramSlide extends SlideBase {
    type: 'diagram';
    title: string;
    subhead?: string;
    lanes: DiagramLane[];
}

/** サイクル項目 */
export interface CycleItem {
    label: string;
    subLabel?: string;
}

/** サイクル図 */
export interface CycleSlide extends SlideBase {
    type: 'cycle';
    title: string;
    subhead?: string;
    items: CycleItem[];
    centerText?: string;
}

/** カードアイテム（文字列またはオブジェクト） */
export type CardItemVariant = string | { title: string; desc?: string };

/** カード型スライド */
export interface CardsSlide extends SlideBase {
    type: 'cards';
    title: string;
    subhead?: string;
    columns?: 2 | 3;
    items: CardItemVariant[];
}

/** ヘッダー付きカードアイテム */
export interface HeaderCardItem {
    title: string;
    desc?: string;
}

/** ヘッダー付きカード */
export interface HeaderCardsSlide extends SlideBase {
    type: 'headerCards';
    title: string;
    subhead?: string;
    columns?: 2 | 3;
    items: HeaderCardItem[];
}

/** テーブルスライド */
export interface TableSlide extends SlideBase {
    type: 'table';
    title: string;
    subhead?: string;
    headers: string[];
    rows: string[][];
}

/** 進捗バースライド */
export interface ProgressItem {
    label: string;
    percent: number;
}

export interface ProgressSlide extends SlideBase {
    type: 'progress';
    title: string;
    subhead?: string;
    items: ProgressItem[];
}

/** 引用スライド */
export interface QuoteSlide extends SlideBase {
    type: 'quote';
    title: string;
    subhead?: string;
    text: string;
    author: string;
}

/** KPI指標アイテム */
export interface KpiItem {
    label: string;
    value: string;
    change: string;
    status: 'good' | 'bad' | 'neutral';
}

/** KPIスライド */
export interface KpiSlide extends SlideBase {
    type: 'kpi';
    title: string;
    subhead?: string;
    columns?: 2 | 3 | 4;
    items: KpiItem[];
}

/** カード項目（title + desc 必須） */
export interface CardItem {
    title: string;
    desc: string;
}

/** カード型箇条書き */
export interface BulletCardsSlide extends SlideBase {
    type: 'bulletCards';
    title: string;
    subhead?: string;
    items: CardItem[];
}

/** FAQアイテム */
export interface FaqItem {
    q: string;
    a: string;
}

/** FAQスライド */
export interface FaqSlide extends SlideBase {
    type: 'faq';
    title: string;
    subhead?: string;
    items: FaqItem[];
}

/** 統計比較スタット */
export interface StatCompareItem {
    label: string;
    leftValue: string;
    rightValue: string;
    trend?: 'up' | 'down' | 'neutral';
}

/** 統計比較スライド */
export interface StatsCompareSlide extends SlideBase {
    type: 'statsCompare';
    title: string;
    subhead?: string;
    leftTitle: string;
    rightTitle: string;
    stats: StatCompareItem[];
}

/** 棒グラフ比較スライド */
export interface BarCompareSlide extends SlideBase {
    type: 'barCompare';
    title: string;
    subhead?: string;
    stats: StatCompareItem[];
    showTrends?: boolean;
}

/** 三角形ダイアグラム */
export interface TriangleSlide extends SlideBase {
    type: 'triangle';
    title: string;
    subhead?: string;
    items: { title: string; desc?: string }[];
}

/** ピラミッドレベル */
export interface PyramidLevel {
    title: string;
    description: string;
}

/** ピラミッド図 */
export interface PyramidSlide extends SlideBase {
    type: 'pyramid';
    title: string;
    subhead?: string;
    levels: PyramidLevel[];
}

/** フローチャートフロー */
export interface FlowChartFlow {
    steps: string[];
}

/** フローチャートスライド */
export interface FlowChartSlide extends SlideBase {
    type: 'flowChart';
    title: string;
    subhead?: string;
    flows: FlowChartFlow[];
}

/** ステップ項目 */
export interface StepItem {
    title: string;
    desc: string;
}

/** 階段式ステップ */
export interface StepUpSlide extends SlideBase {
    type: 'stepUp';
    title: string;
    subhead?: string;
    items: StepItem[];
}

/** 画像+テキストスライド */
export interface ImageTextSlide extends SlideBase {
    type: 'imageText';
    title: string;
    subhead?: string;
    image: string;
    imageCaption?: string;
    imagePosition?: 'left' | 'right';
    points: string[];
}

// ===== 後方互換性のための既存型（引き続きサポート）=====

/** パラレル（横並び） */
export interface ParallelHorizontalSlide extends SlideBase {
    type: 'parallelHorizontal';
    title: string;
    subhead?: string;
    items: CardItem[];
}

/** パラレル（縦並び） */
export interface ParallelVerticalSlide extends SlideBase {
    type: 'parallelVertical';
    title: string;
    subhead?: string;
    items: CardItem[];
}

/** パラレル（複数） */
export interface ParallelMultipleSlide extends SlideBase {
    type: 'parallelMultiple';
    title: string;
    subhead?: string;
    items: CardItem[];
}

/** 比較（スケール） */
export interface CompareScaleSlide extends SlideBase {
    type: 'compareScale';
    title: string;
    subhead?: string;
    leftTitle: string;
    rightTitle: string;
    leftItems: string[];
    rightItems: string[];
}

/** 比較（アイテム） */
export interface CompareItemSlide extends SlideBase {
    type: 'compareItem';
    title: string;
    subhead?: string;
    leftTitle: string;
    rightTitle: string;
    leftItems: string[];
    rightItems: string[];
}

/** 比較（テーブル） */
export interface CompareTableItem {
    label: string;
    a: string;
    b: string;
}

export interface CompareTableSlide extends SlideBase {
    type: 'compareTable';
    title: string;
    subhead?: string;
    items: CompareTableItem[];
}

/** フロー（横） */
export interface FlowHorizontalSlide extends SlideBase {
    type: 'flowHorizontal';
    title: string;
    subhead?: string;
    steps: string[];
}

/** フロー（縦） */
export interface FlowVerticalSlide extends SlideBase {
    type: 'flowVertical';
    title: string;
    subhead?: string;
    steps: string[];
}

/** サイクル（円形） */
export interface CycleCircularSlide extends SlideBase {
    type: 'cycleCircular';
    title: string;
    subhead?: string;
    items: CycleItem[];
    centerText?: string;
}

/** サイクル（四角形） */
export interface CycleSquareSlide extends SlideBase {
    type: 'cycleSquare';
    title: string;
    subhead?: string;
    items: CycleItem[];
    centerText?: string;
}

/** ピラミッド（上向き） */
export interface PyramidUpSlide extends SlideBase {
    type: 'pyramidUp';
    title: string;
    subhead?: string;
    levels: PyramidLevel[];
}

/** ピラミッド（下向き） */
export interface PyramidDownSlide extends SlideBase {
    type: 'pyramidDown';
    title: string;
    subhead?: string;
    levels: PyramidLevel[];
}

/** マトリクス（ポジション） */
export interface MatrixPosSlide extends SlideBase {
    type: 'matrixPos';
    title: string;
    subhead?: string;
    items: CardItem[];
}

/** ベン図 */
export interface VennDiagramSlide extends SlideBase {
    type: 'vennDiagram';
    title: string;
    subhead?: string;
    items: { title: string }[];
}

/** ツリー図（ロジックツリー） */
export interface TreeDiagramSlide extends SlideBase {
    type: 'treeDiagram';
    title: string;
    subhead?: string;
    items: CardItem[];
}

/** 数式ロジック */
export interface FormulaLogicSlide extends SlideBase {
    type: 'formulaLogic';
    title: string;
    subhead?: string;
    formula: string;
}

/** 相乗効果 */
export interface MultiplyEffectSlide extends SlideBase {
    type: 'multiplyEffect';
    title: string;
    subhead?: string;
    items: string[];
    result: string;
}

/** 足し算構成 */
export interface AddCombinationSlide extends SlideBase {
    type: 'addCombination';
    title: string;
    subhead?: string;
    items: string[];
}

/** カバー範囲 */
export interface AreaRangeSlide extends SlideBase {
    type: 'areaRange';
    title: string;
    subhead?: string;
    ranges: string[];
}

/** 共通基盤（オーバーラップ） */
export interface OverlapInfoSlide extends SlideBase {
    type: 'overlapInfo';
    title: string;
    subhead?: string;
    items: string[];
}

/** グループ構成（包含関係） */
export interface InclusionHierSlide extends SlideBase {
    type: 'inclusionHier';
    title: string;
    subhead?: string;
    parent: string;
    children: string[];
}

/** パートナーシップ（インタラクション） */
export interface InteractionSlide extends SlideBase {
    type: 'interaction';
    title: string;
    subhead?: string;
    left: string;
    right: string;
    desc: string;
}

/** ビフォーアフター（トランジション） */
export interface TransitionSlide extends SlideBase {
    type: 'transition';
    title: string;
    subhead?: string;
    before: string;
    after: string;
}

/** 棒グラフ */
export interface BarGraphSlide extends SlideBase {
    type: 'barGraph';
    title: string;
    subhead?: string;
    data: string;
}

/** 円グラフ */
export interface PieGraphSlide extends SlideBase {
    type: 'pieGraph';
    title: string;
    subhead?: string;
    data: string;
}

/** 折れ線グラフ */
export interface LineGraphSlide extends SlideBase {
    type: 'lineGraph';
    title: string;
    subhead?: string;
    trend: string;
}

/** 複合グラフ */
export interface ChartCombineSlide extends SlideBase {
    type: 'chartCombine';
    title: string;
    subhead?: string;
    type_label: string;
}

/** 操作画面一覧（キャプチャリスト） */
export interface CaptureListSlide extends SlideBase {
    type: 'captureList';
    title: string;
    subhead?: string;
    items: string[];
}

/** 新機能ポイント（キャプチャズーム） */
export interface CaptureZoomSlide extends SlideBase {
    type: 'captureZoom';
    title: string;
    subhead?: string;
    zoomPoint: string;
}

/** 申し込み手順（キャプチャフロー） */
export interface CaptureFlowSlide extends SlideBase {
    type: 'captureFlow';
    title: string;
    subhead?: string;
    steps: string[];
}

/** プラン比較 */
export interface PriceTableSlide extends SlideBase {
    type: 'priceTable';
    title: string;
    subhead?: string;
    plans: string[];
}

/** 機能詳細一覧 */
export interface TableDetailSlide extends SlideBase {
    type: 'tableDetail';
    title: string;
    subhead?: string;
}

/** 地図拠点 */
export interface LocationMapSlide extends SlideBase {
    type: 'locationMap';
    title: string;
    subhead?: string;
    locations: string[];
}

/** 工程表（スケジュール） */
export interface ScheduleTableSlide extends SlideBase {
    type: 'scheduleTable';
    title: string;
    subhead?: string;
    duration: string;
}

/** ランキング */
export interface RankingBoardSlide extends SlideBase {
    type: 'rankingBoard';
    title: string;
    subhead?: string;
    rank: string[];
}

/** 導入事例 */
export interface CaseStudyInfoSlide extends SlideBase {
    type: 'caseStudyInfo';
    title: string;
    subhead?: string;
    issue: string;
    result: string;
}

/** よくあるご質問（旧型） */
export interface QaSectionSlide extends SlideBase {
    type: 'qaSection';
    title: string;
    subhead?: string;
    items: { q: string; a: string }[];
}

/** ガントチャートバー */
export interface GanttChartBar {
    startIndex: number;
    span: number;
    color: string;
}

/** ガントチャート行（タスク） */
export interface GanttChartRow {
    taskName: string;
    bars: GanttChartBar[];
}

/** ガントチャートヘッダー（期間設定） */
export interface GanttChartHeader {
    groups: string[];
    periods: number[];
    totalPeriods: number;
}

/** ガントチャート（プロジェクト工程進捗） */
export interface GanttChartSlide extends SlideBase {
    type: 'ganttChart';
    title: string;
    subhead?: string;
    header: GanttChartHeader;
    rows: GanttChartRow[];
}

/** 代表メッセージ（旧型） */
export interface QuoteImpactSlide extends SlideBase {
    type: 'quoteImpact';
    title: string;
    subhead?: string;
    quote: string;
    author: string;
}

/** スライドデータのユニオン型 */
export type SlideData =
    // ===== 新デザイン向け型 =====
    | TitleSlide
    | SectionSlide
    | ClosingSlide
    | ContentSlide
    | AgendaSlide
    | CompareSlide
    | ProcessSlide
    | ProcessListSlide
    | TimelineSlide
    | DiagramSlide
    | CycleSlide
    | CardsSlide
    | HeaderCardsSlide
    | TableSlide
    | ProgressSlide
    | QuoteSlide
    | KpiSlide
    | BulletCardsSlide
    | FaqSlide
    | StatsCompareSlide
    | BarCompareSlide
    | TriangleSlide
    | PyramidSlide
    | FlowChartSlide
    | StepUpSlide
    | ImageTextSlide
    | GanttChartSlide
    // ===== 後方互換性のための既存型 =====
    | ParallelHorizontalSlide
    | ParallelVerticalSlide
    | ParallelMultipleSlide
    | CompareScaleSlide
    | CompareItemSlide
    | CompareTableSlide
    | FlowHorizontalSlide
    | FlowVerticalSlide
    | CycleCircularSlide
    | CycleSquareSlide
    | PyramidUpSlide
    | PyramidDownSlide
    | MatrixPosSlide
    | VennDiagramSlide
    | TreeDiagramSlide
    | FormulaLogicSlide
    | MultiplyEffectSlide
    | AddCombinationSlide
    | AreaRangeSlide
    | OverlapInfoSlide
    | InclusionHierSlide
    | InteractionSlide
    | TransitionSlide
    | BarGraphSlide
    | PieGraphSlide
    | LineGraphSlide
    | ChartCombineSlide
    | CaptureListSlide
    | CaptureZoomSlide
    | CaptureFlowSlide
    | PriceTableSlide
    | TableDetailSlide
    | LocationMapSlide
    | ScheduleTableSlide
    | RankingBoardSlide
    | CaseStudyInfoSlide
    | QaSectionSlide
    | QuoteImpactSlide;

/** プレゼンテーション全体の設定 */
export interface PresentationSettings {
    presetName: string;
    themeColor: string;
    fontFamily: string;
    footerText: string;
    outputFolderUrl: string;
}
