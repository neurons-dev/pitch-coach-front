import { resetMockAnalysisProgress } from '@/api/analysis-api';
import type { SessionId, UploadedFile } from '@/types/analysis';

/**
 * ─────────────────────────────────────────────────────────────
 * TODO(API): 백엔드 API가 준비되면 이 파일의 mock 구현을 실제 호출로 교체하세요.
 * 각 함수 안에 실제 호출 예시를 주석으로 남겨두었습니다. (`apiFetch` 사용)
 * 3단계 흐름: 세션 생성 → 세션에 파일 업로드 → 분석 요청
 * ─────────────────────────────────────────────────────────────
 */

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 1단계: 분석 세션을 생성한다. */
export async function createSession(title: string): Promise<{ sessionId: SessionId }> {
  // TODO(API): 실제 구현 예시
  // return apiFetch<{ sessionId: SessionId }>('/sessions', {
  //   method: 'POST',
  //   body: JSON.stringify({ title }),
  // });
  await delay(200);
  return { sessionId: 'mock-session-id' };
}

/** 2단계: 생성된 세션에 오디오 파일을 업로드한다. */
export async function uploadFileToSession(sessionId: SessionId, file: UploadedFile): Promise<void> {
  // TODO(API): 실제 구현 예시 (multipart/form-data)
  // const formData = new FormData();
  // formData.append('file', { uri: file.uri, name: file.name, type: file.mimeType } as unknown as Blob);
  // await apiFetch<void>(`/sessions/${sessionId}/files`, {
  //   method: 'POST',
  //   body: formData,
  // });
  await delay(300);
}

/** 3단계: 파일이 업로드된 세션에 대해 분석을 요청한다. */
export async function requestAnalysis(sessionId: SessionId): Promise<{ analysisId: string }> {
  // TODO(API): 실제 구현 예시
  // return apiFetch<{ analysisId: string }>(`/sessions/${sessionId}/analyze`, {
  //   method: 'POST',
  // });
  resetMockAnalysisProgress();
  await delay(300);
  return { analysisId: 'mock-analysis-id' };
}
