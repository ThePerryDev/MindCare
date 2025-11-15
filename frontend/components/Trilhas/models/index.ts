// components/Trilhas/models/index.ts
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


export const allTrilhas: TrilhaModel[] = [
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
];
export { trilhaAnsiedadeLeve, trilhaEstresseTrabalho, trilhaSonoRelaxamento, trilhaHumorPositivoMotivacao, trilhaMuitoFeliz, trilhaNeutro, trilhaTriste, trilhaIrritado, trilhaMuitoTriste, trilhaMindfulnessBasico, trilhaAlivioEstresse, trilhaGratidaoFelicidade, trilhaControleAnsiedade };

