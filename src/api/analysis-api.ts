import { apiFetch } from '@/api/client';
import type {
  AnalysisMetric,
  AnalysisProgress,
  AnalysisResult,
  ImprovementPoint,
  ImprovementTone,
  MetricKey,
} from '@/types/analysis';

type AnalysisStatusResponse = {
  practiceSessionId: string;
  analysisJobId: string;
  status: AnalysisProgress['status'];
  currentStep: string | null;
  progress: number | null;
  errorMessage: string | null;
};

type MetricScoreResponse = {
  metricCode: string;
  score: number;
  rawValue: number | null;
  unit: string | null;
};

type FeedbackItemResponse = {
  metricCode: string | null;
  itemType: string;
  title: string;
  description: string;
};

type AnalysisResultResponse = {
  practiceSessionId: string;
  analysisJobId: string;
  overallScore: number;
  coachComment: string;
  metricScores: MetricScoreResponse[];
  feedback: FeedbackItemResponse[];
};

const METRIC_CODE_TO_KEY: Record<string, MetricKey> = {
  SPEED: 'speed',
  DELIVERY: 'delivery',
  STRUCTURE: 'structure',
  FLUENCY: 'fluency',
  PRONUNCIATION: 'pronunciation',
  FILLER: 'fillerWords',
};

const METRIC_LABEL: Record<MetricKey, string> = {
  speed: '말 속도',
  delivery: '전달력',
  structure: '발표 구조',
  fluency: '발표 유창성',
  pronunciation: '발음',
  fillerWords: '필러 단어',
};

/** 화면 표시 순서 (분석 결과 시안 기준). */
const METRIC_ORDER: MetricKey[] = [
  'speed',
  'delivery',
  'structure',
  'fluency',
  'pronunciation',
  'fillerWords',
];

/** 개선 포인트 카드 색상 톤: 해당 지표 점수가 높으면 success, 낮으면 warning. */
function toneForFeedback(
  item: FeedbackItemResponse,
  scoreByCode: Record<string, number>,
): ImprovementTone {
  const score = item.metricCode != null ? scoreByCode[item.metricCode] : undefined;
  if (score === undefined) return 'info';
  if (score >= 85) return 'success';
  if (score < 70) return 'warning';
  return 'info';
}

/** 분석 진행 상태를 조회한다. (폴링) */
export async function getAnalysisProgress(analysisJobId: string): Promise<AnalysisProgress> {
  const data = await apiFetch<AnalysisStatusResponse>(`/api/analyses/${analysisJobId}/status`);
  return {
    status: data.status,
    progress: data.status === 'completed' ? 100 : (data.progress ?? 0),
    errorMessage: data.errorMessage,
  };
}

/** 분석 결과를 조회해 화면 모델로 변환한다. */
export async function getAnalysisResult(analysisJobId: string): Promise<AnalysisResult> {
  const data = await apiFetch<AnalysisResultResponse>(`/api/analyses/${analysisJobId}/result`);

  const metrics: AnalysisMetric[] = (data.metricScores ?? [])
    .filter((metric) => METRIC_CODE_TO_KEY[metric.metricCode] !== undefined)
    .map((metric) => {
      const key = METRIC_CODE_TO_KEY[metric.metricCode];
      return { key, label: METRIC_LABEL[key], score: metric.score };
    })
    .sort((a, b) => METRIC_ORDER.indexOf(a.key) - METRIC_ORDER.indexOf(b.key));

  const scoreByCode = Object.fromEntries(
    (data.metricScores ?? []).map((metric) => [metric.metricCode, metric.score]),
  );

  const improvements: ImprovementPoint[] = (data.feedback ?? [])
    .filter((item) => item.itemType !== 'summary')
    .map((item) => ({
      tone: toneForFeedback(item, scoreByCode),
      title: item.title,
      description: item.description,
    }));

  return {
    totalScore: data.overallScore,
    metrics,
    coachComment: data.coachComment,
    improvements,
  };
}
