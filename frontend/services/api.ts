import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.69:3000/api/v1', // 👈 troque para o IP da sua máquina na rede local
  withCredentials: true, // importante para cookies do refresh
});
