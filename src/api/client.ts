import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/store/auth-store';

// .env.local의 EXPO_PUBLIC_API_URL을 우선 사용, 없으면 localhost:8000
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  constructor(status: number, path: string, message?: string) {
    super(message ?? `API 요청 실패: ${status} ${path}`);
    this.status = status;
  }
}

async function extractErrorMessage(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message;
  } catch {
    return undefined;
  }
}

function isAuthPath(path: string): boolean {
  return path.startsWith('/api/auth/');
}

async function rawFetch(path: string, accessToken: string | null, options?: RequestInit) {
  // FormData 본문은 boundary를 포함한 Content-Type을 fetch가 직접 설정해야 하므로 강제로 덮어쓰지 않는다.
  const isFormData = options?.body instanceof FormData;
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  });
}

let reissuePromise: Promise<string | null> | null = null;

async function reissueAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      await clearTokens();
      return null;
    }
    const tokens = (await response.json()) as { accessToken: string; refreshToken: string };
    await saveTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const accessToken = await getAccessToken();
  let response = await rawFetch(path, accessToken, options);
  if (response.status === 401 && !isAuthPath(path)) {
    reissuePromise = reissuePromise ?? reissueAccessToken();
    const newAccessToken = await reissuePromise;
    reissuePromise = null;
    if (newAccessToken) {
      response = await rawFetch(path, newAccessToken, options);
    }
  }
  if (!response.ok) {
    throw new ApiError(response.status, path, await extractErrorMessage(response));
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}