import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'pitchcoach_access_token';
const REFRESH_TOKEN_KEY = 'pitchcoach_refresh_token';
const USER_NAME_KEY = 'pitchcoach_user_name';
const USER_EMAIL_KEY = 'pitchcoach_user_email';

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveUser(name: string, email: string): Promise<void> {
  await SecureStore.setItemAsync(USER_NAME_KEY, name);
  await SecureStore.setItemAsync(USER_EMAIL_KEY, email);
}

export async function getUserName(): Promise<string | null> {
  return SecureStore.getItemAsync(USER_NAME_KEY);
}

export async function getUserEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(USER_EMAIL_KEY);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_NAME_KEY);
  await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
}
