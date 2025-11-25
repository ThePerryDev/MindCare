// frontend/interfaces/auth.interface.ts
export interface IUser {
  _id?: string; // pode vir como _id
  id?: string; // ou como id
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
  fullName: string;
  email: string;
  phone: string;
  birthdate: string; // ISO "1999-05-15"
  height: number; // em cm no seu backend
  weight: number; // em kg
  password: string;
  confirmPassword: string;
}

export interface IAuthContext {
  user: IUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: IRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile(
    patch: Partial<IUser> & { password?: string; confirmPassword?: string }
  ): Promise<void>;
  deleteAccount(): Promise<void>;
}
