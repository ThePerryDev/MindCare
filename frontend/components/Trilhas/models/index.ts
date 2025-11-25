// frontend/components/Trilhas/models/index.ts

import { TrilhaModel } from '../types';
import { trilhaAlivioEstresse } from './trilhaAlivioEstresse';
import { trilhaAnsiedadeLeve } from './trilhaAnsiedadeLeve';
import { trilhaControleAnsiedade } from './trilhaControleAnsiedade';
import { trilhaEstresseTrabalho } from './trilhaEstresseTrabalho';
import { trilhaGratidaoFelicidade } from './trilhaGratidaoFelicidade';
import { trilhaHumorPositivoMotivacao } from './trilhaHumorPositivoMotivacao';
import { trilhaIrritado } from './trilhaIrritado';
import { trilhaMindfulnessBasico } from './trilhaMindfulnessBasico';
import { trilhaMuitoFeliz } from './trilhaMuitoFeliz';
import { trilhaMuitoTriste } from './trilhaMuitoTriste';
import { trilhaNeutro } from './trilhaNeutro';
import { trilhaSonoRelaxamento } from './trilhaSonoRelaxamento';
import { trilhaTriste } from './trilhaTriste';

/**
 * Trilhas realmente disponíveis na experiência atual:
 * - Ansiedade Leve
 * - Estresse Trabalho/Estudo
 * - Muito Feliz
 * - Muito Triste
 */
export const allTrilhas: TrilhaModel[] = [
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaMuitoFeliz,
  trilhaMuitoTriste,
];

// Mantém exports individuais caso você use em outros pontos
export {
  trilhaAnsiedadeLeve,
  trilhaEstresseTrabalho,
  trilhaSonoRelaxamento,
  trilhaHumorPositivoMotivacao,
  trilhaMuitoFeliz,
  trilhaNeutro,
  trilhaTriste,
  trilhaIrritado,
  trilhaMuitoTriste,
  trilhaMindfulnessBasico,
  trilhaAlivioEstresse,
  trilhaGratidaoFelicidade,
  trilhaControleAnsiedade,
};
