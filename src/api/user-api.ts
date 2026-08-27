import { apiFetch } from './client';
import type { ChangePasswordRequest, DeleteAccountRequest } from '@/types/user';

export async function changePassword(request: ChangePasswordRequest): Promise<void> {
  await apiFetch<void>('/api/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
}

export async function deleteAccount(request: DeleteAccountRequest): Promise<void> {
  await apiFetch<void>('/api/users/me', {
    method: 'DELETE',
    body: JSON.stringify(request),
  });
}
