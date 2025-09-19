# src/service_api.py
import os, joblib, json
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

MODEL_DIR = os.getenv("MODEL_DIR", "models/sklearn")
THRESHOLDS = {"ansiedade":0.35,"tristeza":0.35,"depressão":0.35,"raiva":0.40,"medo":0.40,"culpa":0.40,"vergonha":0.40,"alegria":0.40,"neutro":0.50}

app = FastAPI(title="MindCare Emotion API", version="0.1.0")
pipe = joblib.load(f"{MODEL_DIR}/model.pkl")
mlb  = joblib.load(f"{MODEL_DIR}/mlb.pkl")

class PredictIn(BaseModel):
    text: str

@app.get("/health")
def health():
    return {"status":"ok"}

@app.get("/labels")
def labels():
    return {"labels": list(mlb.classes_)}

def post_suggestions(active_labels: List[str]) -> List[str]:
    # rascunho: troque por templates empáticos da sua equipe clínica
    sug = []
    if "ansiedade" in active_labels: sug += ["Respiração 4-7-8", "Exercício de aterramento (5-4-3-2-1)"]
    if "tristeza" in active_labels:  sug += ["Diário guiado: nomeando sentimentos", "Contato com rede de apoio"]
    if "depressão" in active_labels: sug += ["Rotina mínima (3 metas pequenas)", "Conversar com um profissional"]
    if "alegria" in active_labels:   sug += ["Registrar conquistas", "Compartilhar algo bom com alguém"]
    return list(dict.fromkeys(sug))  # de-dupe

@app.post("/predict")
def predict(inp: PredictIn):
    probs = pipe.predict_proba([inp.text])[0]  # shape (n_classes,)
    scores: Dict[str, float] = {lbl: float(p) for lbl, p in zip(mlb.classes_, probs)}
    active = [lbl for lbl, p in scores.items() if p >= THRESHOLDS.get(lbl, 0.5)]

    # Protocolo de crise simples (texto contém sinais fortes)
    crisis_hit = any(k in inp.text.lower() for k in [
        "me matar","suicidar","tirar minha vida","não quero mais viver","autoagress"
    ])

    suggestions = post_suggestions(active)
    crisis = None
    if crisis_hit:
        crisis = {
          "message": "Sinto muito que você esteja passando por isso. Você não está sozinho(a). Se estiver em perigo imediato, ligue 190. Para apoio emocional 24h, ligue 188 (CVV) ou acesse o chat no site do CVV.",
          "cvv": {"phone":"188","site":"https://cvv.org.br"}
        }

    return {"labels": active or ["neutro"], "scores": scores, "suggestions": suggestions, "crisis": crisis}
