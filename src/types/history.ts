/** 성장 히스토리 목록의 항목 한 개. */
export type HistoryItem = {
  sessionId: string;
  /** 연결된 분석 결과 ID. 결과 화면 이동에 사용한다. */
  analysisId: string;
  title: string;
  /** 연습 일자 (ISO, YYYY-MM-DD) */
  practicedAt: string;
  /** 발표 길이(초) */
  durationSeconds: number;
  totalScore: number;
};
