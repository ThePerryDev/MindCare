# src/eval_extras.py
from __future__ import annotations
import os, json, joblib
import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

MODEL_DIR = os.getenv("MODEL_DIR","models/sklearn/sklearn_lex")
PROC_CSV  = os.getenv("PROC_CSV","data/processed/mindcare_train.csv")
TEST_SIZE = float(os.getenv("TEST_SIZE","0.18"))
MIN_SAMPLES_PER_CLASS = int(os.getenv("MIN_SAMPLES_PER_CLASS","2"))
OUT_DIR   = os.getenv("OUT_DIR", MODEL_DIR)

def main():
    # carregar artefatos e dados
    feats = joblib.load(f"{MODEL_DIR}/features.pkl")
    clf   = joblib.load(f"{MODEL_DIR}/model.pkl")
    le    = joblib.load(f"{MODEL_DIR}/label_encoder.pkl")

    df = pd.read_csv(PROC_CSV)
    df["text"]  = df["text"].astype(str).str.strip()
    df["label"] = df["label"].astype(str).str.strip()
    df = df[(df["text"].str.len() > 0) & (df["label"].str.len() > 0)].reset_index(drop=True)

    # filtrar classes raras (alinha com o script de treino)
    vc = df["label"].value_counts()
    rare = vc[vc < MIN_SAMPLES_PER_CLASS].index.tolist()
    if rare:
        before = len(df)
        df = df[~df["label"].isin(rare)].reset_index(drop=True)
        print(f"[eval] removidas classes raras (<{MIN_SAMPLES_PER_CLASS}): {sorted(rare)} | removidos={before-len(df)}")

    if df["label"].nunique() < 2:
        raise ValueError("[eval] Após filtrar, restou < 2 classes. Ajuste MIN_SAMPLES_PER_CLASS ou aumente o dataset.")

    # split (estratificado se possível)
    stratify_y = df["label"] if df["label"].value_counts().min() >= 2 else None
    if stratify_y is None:
        print("[eval] split sem estratificação (ainda há classe com <2 amostras).")

    X_train, X_test, y_train_raw, y_test_raw = train_test_split(
        df["text"], df["label"], test_size=TEST_SIZE, random_state=42, stratify=stratify_y
    )

    # transformar / codificar
    X_te = feats.transform(X_test)
    y_te = le.transform(y_test_raw)

    # predição
    if hasattr(clf, "predict"):
        yhat = clf.predict(X_te)
    else:
        raise ValueError("[eval] Classificador não possui método predict.")

    # relatório por classe
    report = classification_report(y_te, yhat, target_names=list(le.classes_), zero_division=0, output_dict=True)
    os.makedirs(OUT_DIR, exist_ok=True)
    pd.DataFrame(report).transpose().to_csv(f"{OUT_DIR}/per_class_report.csv", encoding="utf-8")
    print("[eval] salvo per_class_report.csv")

    # matriz de confusão
    cm = confusion_matrix(y_te, yhat, labels=range(len(le.classes_)))
    np.savetxt(f"{OUT_DIR}/confusion_matrix.csv", cm, fmt="%d", delimiter=",")
    print("[eval] salvo confusion_matrix.csv")

    # figura (cuidado se muitas classes)
    fig, ax = plt.subplots(figsize=(10, 8))
    im = ax.imshow(cm, interpolation="nearest")
    ax.set_title("Matriz de confusão")
    ax.set_xlabel("Predito")
    ax.set_ylabel("Verdadeiro")
    plt.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    # ticks (mostra IDs; se tiver mapeamento de nomes, pode carregar e usar aqui)
    ax.set_xticks(range(len(le.classes_)))
    ax.set_yticks(range(len(le.classes_)))
    ax.set_xticklabels([str(c) for c in le.classes_], rotation=90)
    ax.set_yticklabels([str(c) for c in le.classes_])
    plt.tight_layout()
    fig.savefig(f"{OUT_DIR}/confusion_matrix.png", dpi=160)
    print("[eval] salvo confusion_matrix.png")

if __name__ == "__main__":
    main()
