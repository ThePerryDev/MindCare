// frontend/services/nlpApi.ts
import axios from 'axios';
import { Platform } from 'react-native';

// IP da MÁQUINA onde o FastAPI está rodando
const LAN = '192.168.1.2';

// Se estiver usando EMULADOR ANDROID AVD, pode trocar por '10.0.2.2'
const ANDROID_HOST =
  Platform.OS === 'android'
    ? LAN // ou '10.0.2.2' se for o emulador Android oficial
    : LAN;

// FastAPI na porta 8000
const baseURL =
  Platform.OS === 'android'
    ? `http://${ANDROID_HOST}:8000/api/v1`
    : `http://${LAN}:8000/api/v1`;

console.log('[NLP API] baseURL =', baseURL);

export const nlpApi = axios.create({
  baseURL,
  timeout: 15000, // dei um respiro a mais
});
