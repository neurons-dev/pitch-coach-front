export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type DeleteAccountRequest = {
  password: string;
};
