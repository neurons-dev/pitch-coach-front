/** 성장 히스토리(최근 분석 결과) 목록의 항목 한 개. */
export type HistoryItem = {
  /** 분석 작업 id. 결과 화면 이동과 목록 key로 사용한다. */
  analysisId: string;
  title: string;
  /** 연습 일자 (YYYY-MM-DD) */
  practicedAt: string;
  /** 발표 길이(초) */
  durationSeconds: number;
  totalScore: number;
};
