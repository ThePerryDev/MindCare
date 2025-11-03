import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { api, setAuthHeader } from '@/services/api';
import {
  IAuthContext,
  IUser,
  ILoginResponse,
  IRegisterData,
} from '@/interfaces/auth.interface';
import { ddmmyyyyToISO } from '@/utils/date';
// Importa ambas as variantes: por ID e por /me
import {
  getMe,
  updateById as updateByIdSvc,
  deleteById as deleteByIdSvc,
  updateMe as updateMeSvc,
  deleteMe as deleteMeSvc,
} from '@/services/user';

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const TOKEN_KEY = '@accessToken';
const USER_KEY = '@user';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function persistSession(u: IUser, token: string) {
    setUser(u);
    setAccessToken(token);
    setAuthHeader(token);
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(u)],
    ]);
  }

  async function clearSession() {
    setUser(null);
    setAccessToken(null);
    setAuthHeader(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }

  // Helper para obter um possível ID do usuário (cobre _id e id) — sem any
  function getUserIdFromContext(): string | null {
    if (!user) return null;
    const withIds: IUser & Partial<{ _id: string; id: string }> =
      user as IUser & Partial<{ _id: string; id: string }>;
    return withIds._id ?? withIds.id ?? null;
  }

  // LOGIN
  async function login(email: string, password: string) {
    const { data } = await api.post<ILoginResponse>('/auth/login', {
      email,
      password,
    });
    await persistSession(data.user, data.accessToken);
  }

  // REGISTER
  async function register(payload: IRegisterData) {
    const { data } = await api.post<ILoginResponse>('/auth/register', payload);
    await persistSession(data.user, data.accessToken);
  }

  // LOGOUT
  async function logout() {
    try {
      await api.post('/auth/logout').catch(() => {});
    } finally {
      await clearSession();
      router.replace('/screens/LoginScreen/LoginScreen');
    }
  }

  // UPDATE DE PERFIL (sem any no normalized)
  type PatchInput = Partial<IUser> & {
    password?: string;
    confirmPassword?: string;
  };
  type PatchNormalized = Omit<PatchInput, 'birthdate'> & { birthdate?: string };

  async function updateProfile(patch: PatchInput) {
    const normalized: PatchNormalized = { ...patch };
    if (typeof patch.birthdate === 'string') {
      normalized.birthdate = ddmmyyyyToISO(patch.birthdate);
    }

    const uid = getUserIdFromContext();

    let updatedUser: IUser;
    if (uid) {
      // Preferimos por ID quando temos ID
      updatedUser = await updateByIdSvc(uid, normalized);
    } else {
      // Fallback para /users/me quando não temos ID no contexto
      updatedUser = await updateMeSvc(normalized);
    }

    setUser(updatedUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }

  // DELETAR CONTA
  async function deleteAccount() {
    const uid = getUserIdFromContext();

    if (uid) {
      await deleteByIdSvc(uid);
    } else {
      // Fallback para /users/me
      await deleteMeSvc();
    }

    await clearSession();
    router.replace('/screens/LoginScreen/LoginScreen');
  }

  // BOOT
  useEffect(() => {
    (async () => {
      try {
        const [[, token], [, userStr]] = await AsyncStorage.multiGet([
          TOKEN_KEY,
          USER_KEY,
        ]);
        if (!token || !userStr) {
          await clearSession();
          return;
        }
        setAuthHeader(token);
        // tenta obter o perfil "fresco"
        const me = await getMe();
        setUser(me);
        setAccessToken(token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(me));
      } catch {
        await clearSession();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
