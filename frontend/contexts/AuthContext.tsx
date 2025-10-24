import React, { createContext, useState, useEffect } from 'react';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IAuthContext,
  IUser,
  ILoginResponse,
  IRegisterData,
} from '@/interfaces/auth.interface';

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string) {
    try {
      const response = await api.post<ILoginResponse>('/auth/login', {
        email,
        password,
      });
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      api.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.accessToken}`;
      await AsyncStorage.setItem('@accessToken', response.data.accessToken);
      await AsyncStorage.setItem('@user', JSON.stringify(response.data.user));
    } catch (error: any) {
      console.error(
        'Erro ao fazer login:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async function register(data: IRegisterData) {
    try {
      const response = await api.post<ILoginResponse>('/auth/register', data);
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      api.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.accessToken}`;
      await AsyncStorage.setItem('@accessToken', response.data.accessToken);
      await AsyncStorage.setItem('@user', JSON.stringify(response.data.user));
    } catch (error: any) {
      console.error(
        'Erro ao registrar:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
    setAccessToken(null);
    await AsyncStorage.multiRemove(['@accessToken', '@user']);
  }

  async function loadStorageData() {
    const token = await AsyncStorage.getItem('@accessToken');
    const storedUser = await AsyncStorage.getItem('@user');
    if (token && storedUser) {
      setAccessToken(token);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
