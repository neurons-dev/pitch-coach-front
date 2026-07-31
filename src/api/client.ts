/**
 * TODO(API): 백엔드 배포 주소로 교체하세요.
 * 예) export const API_BASE_URL = 'https://api.pitchcoach.example.com';
 */
export const API_BASE_URL = 'http://localhost:8000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}
