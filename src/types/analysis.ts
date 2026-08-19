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

export type MetricKey =
  | 'speed'
  | 'delivery'
  | 'structure'
  | 'fluency'
  | 'pronunciation'
  | 'fillerWords';

export type AnalysisMetric = {
  key: MetricKey;
  label: string;
  /** 점수(0~100). fillerWords는 개수 값이 들어온다. */
  score: number;
  /** 점수 뒤에 붙일 단위 (예: '개'). 없으면 숫자만 표시한다. */
  unit?: string;
  /** 진행 바 채움 비율(0~100). 없으면 score를 그대로 사용한다. */
  progress?: number;
};

export type ImprovementTone = 'info' | 'warning' | 'success';

/** 개선 포인트 카드 한 개. */
export type ImprovementPoint = {
  tone: ImprovementTone;
  title: string;
  description: string;
};

export type AnalysisResult = {
  totalScore: number;
  metrics: AnalysisMetric[];
  /** Coach Mic의 한마디 */
  coachComment: string;
  /** 개선 포인트 목록 */
  improvements: ImprovementPoint[];
};
