import { apiFetch } from '@/api/client';
import type { PracticeType } from '@/types/analysis';

/** 활성화된 발표 유형 목록을 정렬 순서대로 조회한다. */
export async function getPracticeTypes(): Promise<PracticeType[]> {
  return apiFetch<PracticeType[]>('/api/practice-types');
}
