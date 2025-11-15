# nlp/inference/emotion_predictor.py

import os
import joblib
import numpy as np

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODELS_DIR = os.path.join(ROOT_DIR, "nlp", "models", "emotions")

VEC_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer_emotions.joblib")
CLF_PATH = os.path.join(MODELS_DIR, "logreg_emotions.joblib")
MAP_PATH = os.path.join(MODELS_DIR, "label_mapping_emotions.joblib")


class EmotionPredictor:
    def __init__(self):
        self.vectorizer = joblib.load(VEC_PATH)
        self.clf = joblib.load(CLF_PATH)
        mapping = joblib.load(MAP_PATH)
        self.label2id = mapping["label2id"]
        self.id2label = mapping["id2label"]

    def predict(self, text: str):
        X_vec = self.vectorizer.transform([text])
        probs = self.clf.predict_proba(X_vec)[0]
        pred_idx = int(np.argmax(probs))
        pred_label = self.id2label[pred_idx]
        confidence = float(probs[pred_idx])

        return {
            "emotion": pred_label,
            "confidence": confidence,
        }


if __name__ == "__main__":
    model = EmotionPredictor()

    exemplos = [
        "estou me sentindo muito perdido com a minha vida",
        "hoje foi um dia muito bom, estou feliz",
        "estou muito ansioso com tudo que está acontecendo",
        "não aguento mais tanta pressão, estou no meu limite"
    ]

    for txt in exemplos:
        res = model.predict(txt)
        print(f"\nTexto: {txt}")
        print(f"→ Emoção: {res['emotion']} | Confiança: {res['confidence']:.3f}")
