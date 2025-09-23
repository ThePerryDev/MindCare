# src/service_api.py
from __future__ import annotations

# --- FIX de import para artefatos joblib que referenciam módulos locais ---
import sys
from pathlib import Path
SRC_DIR = Path(__file__).resolve().parent  # .../MindCare/src
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))
# -------------------------------------------------------------------------

import os
import json
import joblib
import numpy as np
from typing import List, Dict, Optional
from fastapi import FastAPI
from pydantic import BaseModel

# ---- Config via env ----
MODEL_DIR = os.getenv("MODEL_DIR", "models/sklearn/sklearn_lex")
LABEL_MAP_JSON = os.getenv("LABEL_MAP_JSON", "data/label_id_to_name.json")
TOPK_DEFAULT = int(os.getenv("TOPK_DEFAULT", "3"))

app = FastAPI(title="MindCare Emotion API", version="1.0.0")

# =========================
# Utilidades
# =========================
def load_json_if_exists(path: str) -> Optional[dict]:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None

def softmax(x: np.ndarray) -> np.ndarray:
    z = x - np.max(x)
    e = np.exp(z)
    return e / e.sum()

def load_label_map() -> Dict[str, str]:
    data = load_json_if_exists(LABEL_MAP_JSON)
    return data if isinstance(data, dict) else {}

def post_suggestions(active_labels: List[str]) -> List[str]:
    # rascunho: substitua por conteúdo validado pela equipe clínica
    sug = []
    low = [s.lower() for s in active_labels]
    if any(s in low for s in ["ansiedade", "medo", "nervosismo"]):
        sug += ["Respiração 4-7-8", "Aterramento 5-4-3-2-1", "Relaxamento muscular progressivo"]
    if any(s in low for s in ["tristeza", "depressão"]):
        sug += ["Diário guiado: nomeando sentimentos", "Plano de 3 metas pequenas do dia", "Contato com rede de apoio"]
    if any(s in low for s in ["raiva", "culpa", "vergonha"]):
        sug += ["Pausa consciente (2 min)", "Reestruturação de pensamento: evidências pró/contra"]
    if any(s in low for s in ["alegria"]):
        sug += ["Registrar 3 gratidões", "Compartilhar algo bom com alguém"]
    return list(dict.fromkeys(sug))

def crisis_check(text: str) -> Optional[dict]:
    t = (text or "").lower()
    crisis_hit = any(k in t for k in [
        "me matar", "me suicidar", "tirar minha vida", "não quero mais viver",
        "nao quero mais viver", "autoagress", "auto agress", "morrer", "dar fim em tudo"
    ])
    if crisis_hit:
        return {
            "message": ("Sinto muito que você esteja passando por isso. Você não está sozinho(a). "
                        "Se estiver em perigo imediato, ligue 190. Para apoio emocional 24h, ligue 188 (CVV) "
                        "ou acesse o chat no site do CVV."),
            "cvv": {"phone": "188", "site": "https://cvv.org.br"}
        }
    return None

# =========================
# Carregamento de artefatos (suporta 2 modos)
# =========================
class Artifacts:
    mode: str  # "multiclass" ou "multilabel"
    feats = None
    clf = None
    le = None
    mlb = None
    thresholds: Dict[str, float] = {}
    label_map: Dict[str, str] = {}

ART = Artifacts()

def load_artifacts():
    # Tenta ler metadata do novo pipeline
    meta = load_json_if_exists(os.path.join(MODEL_DIR, "metadata.json"))
    ART.label_map = load_label_map()

    if meta and meta.get("mode") == "multiclass":
        # Novo pipeline (multiclasse)
        ART.mode = "multiclass"
        ART.feats = joblib.load(os.path.join(MODEL_DIR, "features.pkl"))
        ART.clf   = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
        ART.le    = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
        print("[service] Loaded multiclass artifacts.")
        return

    # Compat: pipeline antigo (multilabel)
    mlb_p = os.path.join(MODEL_DIR, "mlb.pkl")
    thr_p = os.path.join(MODEL_DIR, "thresholds.json")
    if os.path.exists(mlb_p) and os.path.exists(thr_p):
        ART.mode = "multilabel"
        # No seu código antigo 'model.pkl' já era um pipeline com TF-IDF dentro.
        ART.clf  = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
        ART.mlb  = joblib.load(mlb_p)
        ART.thresholds = load_json_if_exists(thr_p) or {}
        print("[service] Loaded multilabel artifacts (legacy).")
        return

    # Se chegou aqui, não achou artefatos válidos
    raise FileNotFoundError(
        f"Não encontrei artefatos válidos em {MODEL_DIR}. "
        f"Verifique se existem (multiclasse) features.pkl, model.pkl, label_encoder.pkl e metadata.json "
        f"ou (multilabel) model.pkl, mlb.pkl, thresholds.json."
    )

load_artifacts()

# =========================
# Schemas
# =========================
class PredictIn(BaseModel):
    text: str
    topk: Optional[int] = None  # só usado no modo multiclass

# =========================
# Endpoints
# =========================
@app.get("/health")
def health():
    return {"status": "ok", "mode": ART.mode}

@app.get("/labels")
def labels():
    if ART.mode == "multiclass":
        items = []
        for lab in ART.le.classes_:
            name = ART.label_map.get(str(lab), str(lab))
            items.append({"id": str(lab), "name": name})
        return {"labels": items, "mode": "multiclass"}
    else:
        return {"labels": list(ART.mlb.classes_), "mode": "multilabel"}

@app.post("/predict")
def predict(inp: PredictIn):
    text = (inp.text or "").strip()
    if not text:
        return {"labels": [], "scores": {}, "suggestions": [], "crisis": None, "mode": ART.mode}

    crisis = crisis_check(text)

    if ART.mode == "multiclass":
        X = ART.feats.transform([text])
        # usar predict_proba se existir; senão, softmax sobre decision function
        if hasattr(ART.clf, "predict_proba"):
            probs = ART.clf.predict_proba(X)[0]
        else:
            scores = ART.clf.decision_function(X)[0]
            probs = softmax(scores)
        order = np.argsort(probs)[::-1]
        k = inp.topk or TOPK_DEFAULT
        top_ids = order[:k]
        topk = []
        for idx in top_ids:
            lab_id = ART.le.classes_[idx]
            name = ART.label_map.get(str(lab_id), str(lab_id))
            topk.append({"label_id": str(lab_id), "label_name": name, "proba": float(probs[idx])})

        # primeiro como rótulo “principal”
        active_name = topk[0]["label_name"] if topk else "neutro"
        suggestions = post_suggestions([active_name])
        # também devolvemos um dict "scores" id->proba para inspeção
        scores = {str(ART.le.classes_[i]): float(probs[i]) for i in range(len(probs))}
        # mapear ids para nomes (se houver)
        pretty_scores = {ART.label_map.get(k, k): v for k, v in scores.items()}

        return {
            "topk": topk,
            "label": active_name,
            "scores": pretty_scores,
            "suggestions": suggestions,
            "crisis": crisis,
            "mode": "multiclass"
        }

    else:
        # ===== Modo multilabel legacy =====
        probs = ART.clf.predict_proba([text])[0]  # shape (n_classes,)
        scores: Dict[str, float] = {lbl: float(p) for lbl, p in zip(ART.mlb.classes_, probs)}
        active = [lbl for lbl, p in scores.items() if p >= float(ART.thresholds.get(lbl, 0.5))]

        suggestions = post_suggestions(active if active else ["neutro"])
        return {
            "labels": active or ["neutro"],
            "scores": scores,
            "suggestions": suggestions,
            "crisis": crisis,
            "mode": "multilabel"
        }
