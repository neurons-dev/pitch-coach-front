import type { AnalysisProgress, AnalysisResult } from '@/types/analysis';

/**
 * ─────────────────────────────────────────────────────────────
 * TODO(API): 백엔드 API가 준비되면 이 파일의 mock 구현을 실제 호출로 교체하세요.
 * 각 함수 안에 실제 호출 예시를 주석으로 남겨두었습니다. (`apiFetch` 사용)
 * 세션 생성/파일 업로드/분석 요청은 `@/api/session-api` 를 참고하세요.
 * ─────────────────────────────────────────────────────────────
 */

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// mock 전용: 서버의 분석 진행률을 흉내낸다.
let mockProgress = 0;

/** mock 전용: 새 분석이 시작될 때 진행률을 초기화한다. */
export function resetMockAnalysisProgress() {
  mockProgress = 0;
}

/** 분석 진행률을 조회한다. (폴링) */
export async function getAnalysisProgress(analysisId: string): Promise<AnalysisProgress> {
  // TODO(API): 실제 구현 예시
  // return apiFetch<AnalysisProgress>(`/analyses/${analysisId}/progress`);
  await delay(100);
  mockProgress = Math.min(mockProgress + 8, 100);
  return { progress: mockProgress };
}

/** 분석 결과를 조회한다. */
export async function getAnalysisResult(analysisId: string): Promise<AnalysisResult> {
  // TODO(API): 실제 구현 예시
  // return apiFetch<AnalysisResult>(`/analyses/${analysisId}/result`);
  await delay(400);
  return {
    totalScore: 88,
    comparedToAveragePercent: 20,
    metrics: [
      { key: 'speed', label: '말 속도', score: 82 },
      { key: 'delivery', label: '전달력', score: 68 },
      { key: 'structure', label: '발표 구조', score: 95 },
      { key: 'fluency', label: '발표 유창성', score: 76 },
    ],
  };
}
