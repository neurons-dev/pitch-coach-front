/**
 * TODO(API): 백엔드 배포 주소로 교체하세요.
 * 예) export const API_BASE_URL = 'https://api.pitchcoach.example.com';
 */
export const API_BASE_URL = 'http://localhost:8000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // FormData 본문은 boundary를 포함한 Content-Type을 fetch가 직접 설정해야 하므로 강제로 덮어쓰지 않는다.
  const isFormData = options?.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}
