export type SessionId = string;

/** 발표 유형 코드. */
export type PracticeTypeCode = 'INTERVIEW' | 'PT' | 'SPEECH';

/** 세션 생성 시 입력받는 값. targetDurationSeconds는 이후 AI 분석의 기준값으로 사용된다. */
export type CreateSessionParams = {
  title: string;
  practiceTypeCode: PracticeTypeCode;
  /** 목표 발표시간(초). 녹음 길이를 제한하지 않고 분석 기준으로만 쓴다. */
  targetDurationSeconds: number;
};

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
