// frontend/services/api.ts
import axios from 'axios';
import { Platform } from 'react-native';

const baseURL =
  Platform.OS === 'web'
    ? 'http://localhost:3000/api/v1'
    : 'http://192.168.1.3:3000/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
