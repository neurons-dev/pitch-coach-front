export type SessionId = string;

/** 세션에 업로드할 파일 (녹음 결과 또는 사용자가 선택한 오디오 파일). */
export type UploadedFile = {
  uri: string;
  name: string;
  mimeType?: string;
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
