import { apiFetch } from '@/api/client';
import type {
  CreateSessionParams,
  PracticeSession,
  SessionId,
  UploadedFile,
} from '@/types/analysis';

/**
 * Practice Session API — 3단계 흐름: 세션 생성 → 음성 파일 업로드 → 분석 요청
 */

/** 1단계: 발표 연습 세션을 생성한다. targetDurationSeconds는 이후 AI 분석 시 기준값으로 사용된다. */
export async function createSession(params: CreateSessionParams): Promise<{ sessionId: SessionId }> {
  const session = await apiFetch<PracticeSession>('/api/practice-sessions', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return { sessionId: session.id };
}

/** 2단계: 세션에 녹음/선택한 오디오 파일을 업로드한다. (CREATED/FAILED 상태에서만 가능) */
export async function uploadFileToSession(
  sessionId: SessionId,
  file: UploadedFile,
): Promise<PracticeSession> {
  const formData = new FormData();
  // React Native의 FormData 파일 파트 형식({ uri, name, type })은 DOM 타입에 없어서 캐스팅한다.
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? 'audio/x-m4a',
  } as unknown as Blob);

  return apiFetch<PracticeSession>(`/api/practice-sessions/${sessionId}/audio`, {
    method: 'POST',
    body: formData,
  });
}

/** 3단계: 업로드된 세션에 대해 분석을 요청한다. (UPLOADED 상태에서만 가능) */
export async function requestAnalysis(sessionId: SessionId): Promise<{ analysisId: string }> {
  const session = await apiFetch<PracticeSession>(`/api/practice-sessions/${sessionId}/analysis`, {
    method: 'POST',
  });
  if (!session.latestAnalysisJobId) {
    throw new Error(`분석 작업 ID가 없습니다. (session: ${session.id})`);
  }
  return { analysisId: session.latestAnalysisJobId };
}
