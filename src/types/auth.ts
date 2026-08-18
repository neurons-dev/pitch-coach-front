export type AuthResponse = {
  userId: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type OAuthProvider = 'google' | 'kakao';
