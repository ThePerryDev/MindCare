// app/interfaces/auth.interface.ts
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  birthdate?: string; // pode vir como string do backend
  height?: number;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface IAuthContext {
  user: IUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: IRegisterData) => Promise<void>;
  logout: () => Promise<void>;
}
