# src/infer.py
from __future__ import annotations
import os, json, joblib
import numpy as np

MODEL_DIR = os.getenv("MODEL_DIR","models/sklearn/sklearn_lex")
LABEL_MAP_JSON = os.getenv("LABEL_MAP_JSON","data/label_id_to_name.json")  # opcional

def load_label_map():
    if os.path.exists(LABEL_MAP_JSON):
        with open(LABEL_MAP_JSON,"r",encoding="utf-8") as f:
            return json.load(f)  # {"0":"admiração","1":"alegria",...}
    return {}

def predict(text: str, topk: int = 3):
    feats = joblib.load(f"{MODEL_DIR}/features.pkl")
    clf   = joblib.load(f"{MODEL_DIR}/model.pkl")
    le    = joblib.load(f"{MODEL_DIR}/label_encoder.pkl")

    X = feats.transform([text])
    if hasattr(clf, "predict_proba"):
        probs = clf.predict_proba(X)[0]
    else:
        # fallback (ex.: LinearSVC calibrado não necessário aqui)
        scores = clf.decision_function(X)[0]
        # softmax
        e = np.exp(scores - scores.max())
        probs = e / e.sum()

    order = np.argsort(probs)[::-1]
    top_ids = order[:topk]
    id2name = load_label_map()
    res = []
    for idx in top_ids:
        label_id = le.classes_[idx]
        name = id2name.get(str(label_id), str(label_id))
        res.append({"label_id": str(label_id), "label_name": name, "proba": float(probs[idx])})
    return {"topk": res}

if __name__ == "__main__":
    import sys
    text = " ".join(sys.argv[1:]) if len(sys.argv)>1 else "estou ansioso com a entrevista, coração acelerado"
    print(predict(text))
