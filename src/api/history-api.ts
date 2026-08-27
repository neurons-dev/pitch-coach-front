import { apiFetch } from '@/api/client';
import type { HistoryItem } from '@/types/history';

type RecentAnalysisResponse = {
  analysisId: string;
  title: string;
  createdAt: string;
  durationSeconds: number;
  totalScore: number;
};

/** 분석이 완료된 세션 목록을 최신순으로 조회한다. */
export async function getRecentAnalyses(limit: number): Promise<HistoryItem[]> {
  const items = await apiFetch<RecentAnalysisResponse[]>(`/api/analyses/recent?limit=${limit}`);
  return items.map((item) => ({
    analysisId: item.analysisId,
    title: item.title,
    practicedAt: item.createdAt.slice(0, 10),
    durationSeconds: item.durationSeconds,
    totalScore: item.totalScore,
  }));
}

/** 성장 히스토리 탭 목록. */
export function getGrowthHistory(): Promise<HistoryItem[]> {
  return getRecentAnalyses(50);
}
