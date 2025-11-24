// frontend/contexts/HomeDashboardContext.tsx

import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
  ITrailStats,
  INextExerciseResponse,
} from '@/interfaces/trail.interface';
import {
  fetchNextExercise,
  fetchTrailStats,
  TrailStatsPeriod,
} from '@/services/trail';
import { useAuth } from '@/hooks/useAuth';

export interface IHomeDashboardContext {
  stats: ITrailStats | null;
  nextExercise: INextExerciseResponse | null;
  period: TrailStatsPeriod;
  loading: boolean;
  error: string | null;
  refresh: (period?: TrailStatsPeriod) => Promise<void>;
}

export const HomeDashboardContext = createContext<IHomeDashboardContext>(
  {} as IHomeDashboardContext
);

export const HomeDashboardProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { accessToken, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<ITrailStats | null>(null);
  const [nextExercise, setNextExercise] =
    useState<INextExerciseResponse | null>(null);
  const [period, setPeriod] = useState<TrailStatsPeriod>('week');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (p?: TrailStatsPeriod) => {
      const effectivePeriod = p ?? period;

      console.log('🔵 [HomeDashboard] Carregando dados...');
      console.log('🔵 [HomeDashboard] Período solicitado:', effectivePeriod);

      setLoading(true);
      setError(null);

      try {
        const [statsResp, nextResp] = await Promise.all([
          fetchTrailStats(effectivePeriod),
          fetchNextExercise().catch(err => {
            console.log(
              '🟠 [HomeDashboard] Nenhum próximo exercício encontrado:',
              err
            );
            return null;
          }),
        ]);

        console.log('🟢 [HomeDashboard] Stats recebidas:', statsResp);
        console.log('🟢 [HomeDashboard] NextExercise recebido:', nextResp);

        setStats(statsResp);
        setNextExercise(nextResp);
        setPeriod(effectivePeriod);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Erro ao carregar dados do painel';

        console.log('🔴 [HomeDashboard] Erro:', message);
        setError(message);
      } finally {
        setLoading(false);
        console.log('🔵 [HomeDashboard] Carregamento finalizado.');
      }
    },
    [period]
  );

  useEffect(() => {
    // Espera o AuthContext terminar de carregar
    if (authLoading) {
      console.log(
        '⏳ [HomeDashboard] Aguardando AuthContext terminar de carregar...'
      );
      return;
    }

    // Se não tiver token (não logado), não tenta buscar nada
    if (!accessToken) {
      console.log(
        '⚪ [HomeDashboard] Sem accessToken, limpando dados do dashboard.'
      );
      setStats(null);
      setNextExercise(null);
      setError(null);
      setLoading(false);
      return;
    }

    console.log(
      '🏁 [HomeDashboard] Iniciando carregamento inicial (semana) com token...'
    );
    void loadData('week');
  }, [authLoading, accessToken, loadData]);

  const value: IHomeDashboardContext = {
    stats,
    nextExercise,
    period,
    loading,
    error,
    refresh: async (p?: TrailStatsPeriod) => {
      console.log('🔁 [HomeDashboard] Refresh solicitado, período:', p);
      await loadData(p);
    },
  };

  console.log('📦 [HomeDashboard] Context Value ->', value);

  return (
    <HomeDashboardContext.Provider value={value}>
      {children}
    </HomeDashboardContext.Provider>
  );
};
