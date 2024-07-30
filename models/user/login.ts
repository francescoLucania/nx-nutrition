export type LoginType = 'phone' | 'email';

export type LoginBody = {
  login: string;
  password: string;
  loginType: LoginType;
}
