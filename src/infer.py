from __future__ import annotations
try:
    __file__
    _HAS_FILE = True
except NameError:
    _HAS_FILE = False
if __package__ in {None, ''} and _HAS_FILE:
    import sys, os
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import json
import os
import re
import time
from typing import Any, Dict

from joblib import load
from src.preprocess import clean_text

DEFAULT_THRESHOLD = 0.55

# padrões explícitos (frases claras)
SUICIDE_PATTERNS = [
    r"\b(vou me matar)\b",
    r"\b(me matar)\b",
    r"\b(quero morrer)\b",
    r"\b(desejo me matar)\b",
    r"\b(não aguento mais)\b",
    r"\b(não suporto viver)\b",
    r"\b(acabar com tudo)\b",
    r"\b(só penso em morrer)\b",
    r"\b(vou acabar com tudo)\b",
    r"\b(tenho vontade de morrer)\b",
    r"\b(queria acabar com a minha vida)\b",
    r"\b(acab[ae]r com a vida)\b",
    r"\b(queria morrer)\b",
    r"\b(vou me matar hoje)\b",
]
SUICIDE_RE = re.compile("|".join(SUICIDE_PATTERNS), flags=re.IGNORECASE)

# palavras sensíveis (tokens) — usadas em heurística combinada
SENSITIVE_WORDS = {"morrer", "morte", "suicid", "acabar", "desistir", "fim", "suicídio", "suicida", "matar"}
# pronomes e indicadores de 1a pessoa
PRONOUNS_1P = {"eu", "me", "mim", "meu", "minha", "meus", "minhas", "comigo", "conmigo"}
# palavras que sugerem planejamento/ações
PLANNING_WORDS = {"planejei", "planejar", "plano", "vou", "vou fazer", "tentar", "tentei", "comprei", "comprei", "já tentei", "já tentei me matar", "tenho arma", "comprei arma"}


class SentimentInfer:
    def __init__(self, model_dir: str = "models", suggestions_path: str = "resources/suggestions.json", threshold: float = DEFAULT_THRESHOLD):
        """
        Carrega o modelo salvo em model_dir/model.joblib e o arquivo de sugestões.
        Também carrega (se existir) a seção `risk_responses` do suggestions.json.
        """
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, "model.joblib")
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Modelo não encontrado em: {self.model_path}")
        self.model = load(self.model_path)

        # classes (pode ser model.classes_ ou labels.json)
        try:
            self.classes_ = list(getattr(self.model, "classes_", []))
        except Exception:
            self.classes_ = []

        # carregar sugestões (fallbacks e exercícios) e seção de risco
        if not os.path.exists(suggestions_path):
            # fallback mínimo se o arquivo não existir
            self.fallback_prompts = ["Poderia me contar um pouco mais sobre como você está se sentindo?"]
            self.suggestions_map = {}
            self.risk_responses = {}
        else:
            try:
                with open(suggestions_path, "r", encoding="utf-8") as f:
                    s = json.load(f)
            except Exception:
                s = {}
            self.fallback_prompts = s.get("fallback_prompts", ["Poderia me contar um pouco mais sobre como você está se sentindo?"])
            self.suggestions_map = s.get("suggestions", {})
            # risk_responses: opcional, contém intro, contacts (lista) e follow_up
            self.risk_responses = s.get("risk_responses", {})

        self.threshold = float(threshold)

    def is_high_risk(self, text: str) -> bool:
        """
        Heurística combinada para detectar alto risco:
        1) regex explícita (frases diretas) -> True
        2) otherwise: normaliza e verifica:
           - presença de palavra sensível + pronome 1ª pessoa -> True
           - presença de palavra sensível + palavra de planejamento/ação -> True
        """
        if not isinstance(text, str):
            return False

        raw = text.strip()
        normalized = clean_text(raw)  # normaliza, lower, remove acentos

        # 1) regex explícito sobre o texto cru ou normalizado
        if SUICIDE_RE.search(raw) or SUICIDE_RE.search(normalized):
            return True

        # tokens do texto normalizado
        tokens = set(normalized.split())

        # 2) sensível + pronome 1p
        if tokens.intersection(SENSITIVE_WORDS) and tokens.intersection(PRONOUNS_1P):
            return True

        # 3) sensível + palavra de planejamento/ação
        if tokens.intersection(SENSITIVE_WORDS) and tokens.intersection(PLANNING_WORDS):
            return True

        # nada detectado
        return False

    def predict(self, text: str) -> Dict[str, Any]:
        """
        Retorna a predição com probabilidades no formato:
        {
          "label": top_label,
          "confidence": top_prob,
          "probs": {label: prob, ...}
        }
        Trata casos onde o modelo não implementa predict_proba.
        """
        clean = clean_text(text)
        result = {"label": None, "confidence": 0.0, "probs": {}}

        # Tenta usar predict_proba para obter probabilidades
        try:
            probs = self.model.predict_proba([clean])[0]  # array de probabilidades alinhadas a model.classes_
            labels = list(self.model.classes_)
            probs_dict = {str(lbl): float(p) for lbl, p in zip(labels, probs)}
            # Obter top
            top_idx = int(probs.argmax())
            top_label = labels[top_idx]
            top_prob = float(probs[top_idx])
            result.update({"label": top_label, "confidence": top_prob, "probs": probs_dict})
            return result
        except Exception:
            # fallback: usar predict se predict_proba não existir
            try:
                lbl = self.model.predict([clean])[0]
                result.update({"label": str(lbl), "confidence": 1.0, "probs": {str(lbl): 1.0}})
                return result
            except Exception:
                # erro grave no modelo — retornar vazio
                return result

    def _format_risk_message(self) -> str:
        """
        Monta a mensagem de risco usando self.risk_responses se existir,
        caso contrário retorna um texto padrão.
        """
        intro = "Sinto muito que você esteja se sentindo assim. Obrigado por confiar em mim."
        default_contacts = ["Brasil: CVV 188 (24h) ou acesse cvv.org.br", "Emergência: SAMU 192 / Polícia 190"]
        follow_up = "Posso ficar aqui e te ouvir por alguns minutos. Quer que eu te ajude a encontrar suporte local agora?"

        try:
            rr = self.risk_responses or {}
            parts = []
            if rr.get("intro"):
                parts.append(rr.get("intro"))
            else:
                parts.append(intro)

            parts.append("Se você ou alguém corre risco imediato, por favor procure ajuda agora.")

            contacts = rr.get("contacts") or default_contacts
            if contacts:
                parts.append("Contatos de emergência/apoio:")
                for c in contacts:
                    parts.append(f"  - {c}")

            if rr.get("follow_up"):
                parts.append(rr.get("follow_up"))
            else:
                parts.append(follow_up)

            return "\n".join(parts)
        except Exception:
            # fallback mínimo
            return intro + " Se estiver em perigo agora, procure os serviços de emergência locais."

    def respond(self, text: str) -> Dict[str, Any]:
        """
        Lógica de resposta:
        1) Se high risk -> type 'risk' com mensagem de emergência (prioritário)
        2) Se confiança >= threshold -> type 'advice' com sugestões
        3) Se soma top2 >= max(threshold, 0.65) -> escolher top1 e advice
        4) else -> 'clarify' com prompt empático
        """
        # 1) Regra de risco tem prioridade absoluta
        try:
            high_risk = self.is_high_risk(text)
        except Exception:
            high_risk = False

        if high_risk:
            # grava log (auditoria)
            try:
                log_path = os.path.join(self.model_dir, "incident_log.txt")
                os.makedirs(os.path.dirname(log_path), exist_ok=True)
                now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                with open(log_path, "a", encoding="utf-8") as fh:
                    fh.write(f"{now}\tHIGH_RISK\t{clean_text(text)}\n")
            except Exception:
                # não queremos quebrar o fluxo se logging falhar
                pass

            # montar mensagem a partir do JSON ou padrão
            message = self._format_risk_message()

            return {
                "type": "risk",
                "label": "alto_risco_suicida",
                "confidence": 1.0,
                "message": message,
                "probs": {},
            }

        # 2) previsão normal
        pred = self.predict(text)
        label = pred.get("label")
        conf = float(pred.get("confidence", 0.0))
        probs = pred.get("probs", {})

        # 3) Se confiança alta suficiente
        if conf >= self.threshold and label is not None:
            exercises = self.suggestions_map.get(label, [])
            return {
                "type": "advice",
                "label": label,
                "confidence": conf,
                "message": f"Entendi **{label}**. Aqui vão algumas sugestões que podem ajudar agora:",
                "suggestions": exercises[:3],
                "probs": probs,
            }

        # 4) Tentar somar top2 probabilidades (reduz falsos negativos quando o sentimento está dividido)
        try:
            probs_sorted = sorted(probs.items(), key=lambda x: x[1], reverse=True)
            if len(probs_sorted) == 0:
                raise ValueError("Sem probabilidades disponíveis")
            top1 = probs_sorted[0]
            top2 = probs_sorted[1] if len(probs_sorted) > 1 else None
            top_sum = (top1[1] + top2[1]) if top2 else top1[1]
        except Exception:
            # se não houver probs, caímos para fallback
            top1 = (label, conf)
            top2 = None
            top_sum = conf

        # Se a soma dos top2 passar num limiar menor (ex.: 0.65) então escolhe top1
        if top_sum >= max(self.threshold, 0.65):
            chosen = top1[0]
            exercises = self.suggestions_map.get(chosen, [])
            chosen_conf = float(probs.get(chosen, 0.0))
            return {
                "type": "advice",
                "label": chosen,
                "confidence": chosen_conf,
                "message": f"Parece predominante **{chosen}**. Aqui vão algumas sugestões:",
                "suggestions": exercises[:3],
                "probs": probs,
            }

        # fallback: pedir clarificação (empático)
        prompt = self.fallback_prompts[0] if self.fallback_prompts else "Poderia me contar um pouco mais?"
        return {
            "type": "clarify",
            "label": label,
            "confidence": conf,
            "message": prompt,
            "probs": probs,
        }
