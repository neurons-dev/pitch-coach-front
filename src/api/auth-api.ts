import { apiFetch } from './client';
import { clearTokens, saveTokens, saveUser } from '@/store/auth-store';
import type { AuthResponse, LoginRequest, SignupRequest, TokenResponse } from '@/types/auth';

export async function signup(request: SignupRequest): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  await saveTokens(result.accessToken, result.refreshToken);
  await saveUser(result.name, result.email);
  return result;
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  await saveTokens(result.accessToken, result.refreshToken);
  await saveUser(result.name, result.email);
  return result;
}

export async function exchangeOAuthCode(code: string): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/api/auth/oauth/exchange', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  await saveTokens(result.accessToken, result.refreshToken);
  await saveUser(result.name, result.email);
  return result;
}

export async function reissueTokens(refreshToken: string): Promise<TokenResponse> {
  const result = await apiFetch<TokenResponse>('/api/auth/reissue', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  await saveTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiFetch<void>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  } finally {
    await clearTokens();
  }
}
