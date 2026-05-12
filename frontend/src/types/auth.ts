export type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
};
