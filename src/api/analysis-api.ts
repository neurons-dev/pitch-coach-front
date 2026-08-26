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
    totalScore: 79,
    metrics: [
      { key: 'speed', label: '말 속도', score: 82 },
      { key: 'delivery', label: '전달력', score: 68 },
      { key: 'structure', label: '발표 구조', score: 95 },
      { key: 'fluency', label: '발표 유창성', score: 76 },
      { key: 'pronunciation', label: '발음', score: 61 },
      { key: 'fillerWords', label: '필러 단어 개수', score: 2, unit: '개', progress: 85 },
    ],
    coachComment:
      '전반적으로 안정적인 발표였어요! 조금만 더 천천히 말하면 완벽해요. 조금만 더 연습하면 정말 멋진 발표자가 될 수 있을 거예요!',
    improvements: [
      {
        tone: 'info',
        title: '말 속도 조절',
        description:
          '분당 480음절로 다소 빠른 편이에요. 350~450음절을 목표로 조금만 천천히 말해보세요! 청중이 내용을 이해할 여유를 주세요.',
      },
      {
        tone: 'warning',
        title: '필러 단어 줄이기',
        description:
          '"어", "음" 같은 필러 단어가 총 12번 등장했어요. 말 사이 짧게 멈추는 연습이 도움이 될 거예요!',
      },
      {
        tone: 'success',
        title: '발표 구조 — 완벽해요!',
        description:
          '서론-본론-결론 구조가 명확해요. 특히 결론의 핵심 메시지 정리가 훌륭했어요. 이 구조를 계속 유지하세요!',
      },
    ],
  };
}
