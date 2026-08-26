import type { HistoryItem } from '@/types/history';

/**
 * ─────────────────────────────────────────────────────────────
 * TODO(API): 백엔드 API가 준비되면 이 파일의 mock 구현을 실제 호출로 교체하세요.
 * 실제 호출 예시를 주석으로 남겨두었습니다. (`apiFetch` 사용)
 * ─────────────────────────────────────────────────────────────
 */

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 성장 히스토리 목록을 조회한다. (최신순) */
export async function getGrowthHistory(): Promise<HistoryItem[]> {
  // TODO(API): 실제 구현 예시
  // return apiFetch<HistoryItem[]>('/sessions/history');
  await delay(300);
  return [
    {
      sessionId: 'mock-session-1',
      analysisId: 'mock-analysis-1',
      title: '면접 발표 연습',
      practicedAt: '2025-07-10',
      durationSeconds: 323,
      totalScore: 85,
    },
    {
      sessionId: 'mock-session-2',
      analysisId: 'mock-analysis-2',
      title: '자기소개 발표 연습',
      practicedAt: '2025-07-10',
      durationSeconds: 323,
      totalScore: 70,
    },
    {
      sessionId: 'mock-session-3',
      analysisId: 'mock-analysis-3',
      title: '면접 발표 연습',
      practicedAt: '2025-07-10',
      durationSeconds: 323,
      totalScore: 94,
    },
    {
      sessionId: 'mock-session-4',
      analysisId: 'mock-analysis-4',
      title: '면접 발표 연습',
      practicedAt: '2025-07-10',
      durationSeconds: 323,
      totalScore: 51,
    },
    {
      sessionId: 'mock-session-5',
      analysisId: 'mock-analysis-5',
      title: '면접 발표 연습',
      practicedAt: '2025-07-11',
      durationSeconds: 323,
      totalScore: 82,
    },
    {
      sessionId: 'mock-session-6',
      analysisId: 'mock-analysis-6',
      title: '자기소개 발표 연습',
      practicedAt: '2025-07-11',
      durationSeconds: 323,
      totalScore: 77,
    },
    {
      sessionId: 'mock-session-7',
      analysisId: 'mock-analysis-7',
      title: '면접 발표 연습',
      practicedAt: '2025-07-11',
      durationSeconds: 323,
      totalScore: 99,
    },
  ];
}
