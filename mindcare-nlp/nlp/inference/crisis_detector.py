# nlp/inference/crisis_detector.py

import os
import joblib
import numpy as np

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, "nlp", "models", "crisis")

VEC_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer_crisis.joblib")
CLF_PATH = os.path.join(MODELS_DIR, "logreg_crisis.joblib")
MAP_PATH = os.path.join(MODELS_DIR, "label_mapping_crisis.joblib")


class CrisisDetector:
    def __init__(self):
        self.vectorizer = joblib.load(VEC_PATH)
        self.clf = joblib.load(CLF_PATH)
        self.label_mapping = joblib.load(MAP_PATH)
        self.inv_label_mapping = {v: k for k, v in self.label_mapping.items()}

    def predict(self, text: str):
        X_vec = self.vectorizer.transform([text])
        probs = self.clf.predict_proba(X_vec)[0]  # [p(non-suicide), p(suicide)]
        pred_idx = int(np.argmax(probs))
        pred_label = self.inv_label_mapping[pred_idx]
        confidence = float(probs[pred_idx])
        is_crisis = pred_label == "suicide"

        return {
            "is_crisis": is_crisis,
            "label": pred_label,
            "confidence": confidence,
        }


if __name__ == "__main__":
    detector = CrisisDetector()

    exemplos = [
        "não aguento mais viver, só penso em acabar com tudo",
        "às vezes a vida é difícil, mas eu sigo tentando melhorar",
    ]

    for txt in exemplos:
        res = detector.predict(txt)
        print(f"\nTexto: {txt}")
        print(f"→ is_crisis: {res['is_crisis']} | label: {res['label']} | confiança: {res['confidence']:.3f}")
