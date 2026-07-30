export type RecordingUpload = {
  title: string;
  durationSeconds: number;
  /** TODO(API): 실제 녹음 파일 업로드 시 오디오 파일 URI를 담는다. */
  audioUri?: string;
};

export type AnalysisProgress = {
  /** 0~100 */
  progress: number;
};

export type MetricKey = 'speed' | 'delivery' | 'structure' | 'fluency';

export type AnalysisMetric = {
  key: MetricKey;
  label: string;
  score: number;
};

export type AnalysisResult = {
  totalScore: number;
  /** 전체 평균 대비 차이 (%). 양수면 평균보다 높음 */
  comparedToAveragePercent: number;
  metrics: AnalysisMetric[];
};
