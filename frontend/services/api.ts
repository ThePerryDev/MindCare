// frontend/services/api.ts
import axios from 'axios';
import { Platform } from 'react-native';

// IP da SUA MÁQUINA (ipconfig mostrou 192.168.18.20)
const LAN = '192.168.1.75';

// Para emulador Android oficial (AVD), o "localhost" do PC é 10.0.2.2.
// Se você estiver no EXPO GO em um celular físico, use o LAN.
const ANDROID_HOST = LAN; // pode trocar por '10.0.2.2' se estiver no EMULADOR

const baseURL =
  Platform.OS === 'android'
    ? `http://${ANDROID_HOST}:3000/api/v1` // <-- BACKTICKS AQUI
    : `http://${LAN}:3000/api/v1`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// helper opcional para setar/remover Authorization global
export function setAuthHeader(token?: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
