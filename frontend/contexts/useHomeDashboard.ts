// frontend/hooks/useHomeDashboard.ts

import { useContext } from 'react';
import {
  HomeDashboardContext,
  IHomeDashboardContext,
} from '@/contexts/HomeDashboardContext';

export function useHomeDashboard(): IHomeDashboardContext {
  return useContext(HomeDashboardContext);
}
