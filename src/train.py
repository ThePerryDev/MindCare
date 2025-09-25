from __future__ import annotations
try:
    __file__
    _HAS_FILE = True
except NameError:
    _HAS_FILE = False
if __package__ in {None, ''} and _HAS_FILE:
    import sys, os
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import argparse
import json
import os
from typing import Tuple

import numpy as np
import pandas as pd
from joblib import dump
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import FeatureUnion, Pipeline

from src.preprocess import clean_text, batch_clean


def autodetect_columns(df: pd.DataFrame) -> Tuple[str, str]:
    cols_lower = {c.lower(): c for c in df.columns}
    # Try PT-BR headers first
    if "texto" in cols_lower and "sentimento" in cols_lower:
        return cols_lower["texto"], cols_lower["sentimento"]
    # Try EN headers
    if "text" in cols_lower and "label" in cols_lower:
        return cols_lower["text"], cols_lower["label"]
    raise ValueError(
        "Não foi possível detectar colunas de texto/rótulo. "
        "Use cabeçalhos 'Texto,Sentimento' ou 'text,label'."
    )


def build_pipeline(random_state: int = 42):
    """
    Combina vetores de palavras + caracteres e usa LogisticRegression
    calibrado para obter probabilidades mais confiáveis.
    """
    # vetor de palavras (1-2 grams)
    wvec = TfidfVectorizer(
        preprocessor=clean_text,
        analyzer="word",
        ngram_range=(1, 2),
        min_df=2,
    )
    # vetor de caracteres (helpful for typos/abrevs)
    cvec = TfidfVectorizer(
        preprocessor=clean_text,
        analyzer="char_wb",
        ngram_range=(3, 5),
        min_df=2,
    )

    combined = FeatureUnion([("word", wvec), ("char", cvec)])

    base_clf = LogisticRegression(
        max_iter=400,
        class_weight="balanced",
        random_state=random_state,
    )

    # CalibratedClassifierCV para probabilidades mais confiáveis.
    # Em sklearn >= 1.5 o parâmetro é "estimator"; versões antigas usam "base_estimator".
    try:
        calibrated = CalibratedClassifierCV(estimator=base_clf, cv=5, method="isotonic")
    except TypeError:
        calibrated = CalibratedClassifierCV(base_estimator=base_clf, cv=5, method="isotonic")

    pipe = Pipeline([("vec", combined), ("clf", calibrated)])
    return pipe


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True, help="Caminho do CSV de treino (UTF-8).")
    ap.add_argument("--model_dir", default="models", help="Diretório para salvar artefatos.")
    ap.add_argument("--test_size", type=float, default=0.2)
    ap.add_argument("--random_state", type=int, default=42)
    ap.add_argument(
        "--no_calibrate",
        action="store_true",
        help="Ignorar calibração (usa LogisticRegression direto). Útil se CalibratedClassifierCV falhar.",
    )
    args = ap.parse_args()

    os.makedirs(args.model_dir, exist_ok=True)

    df = pd.read_csv(args.csv)
    col_text, col_label = autodetect_columns(df)

    X = df[col_text].astype(str).tolist()
    y = df[col_label].astype(str).str.strip().str.lower().tolist()

    # Guarda rótulos originais ordenados (para referência)
    labels_sorted = sorted(list(set(y)))

    # split (stratify se houver >1 classe)
    stratify_arg = y if len(set(y)) > 1 else None
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=args.test_size, random_state=args.random_state, stratify=stratify_arg
    )

    # Construir pipeline
    if args.no_calibrate:
        # pipeline sem calibração (fallback)
        from sklearn.pipeline import Pipeline as _Pipeline
        from sklearn.linear_model import LogisticRegression as _LR

        vec_word = TfidfVectorizer(preprocessor=clean_text, analyzer="word", ngram_range=(1, 2), min_df=2)
        vec_char = TfidfVectorizer(preprocessor=clean_text, analyzer="char_wb", ngram_range=(3, 5), min_df=2)
        combined = FeatureUnion([("word", vec_word), ("char", vec_char)])
        clf = _LR(max_iter=400, class_weight="balanced", random_state=args.random_state)
        pipe = _Pipeline([("vec", combined), ("clf", clf)])
    else:
        pipe = build_pipeline(random_state=args.random_state)

    # Treino com fallback em caso de erro de calibração
    try:
        pipe.fit(X_train, y_train)
    except Exception as e:
        # Se CalibratedClassifierCV falhar (ex.: dataset muito pequeno para cv),
        # tentamos recriar pipeline sem calibração.
        print("⚠️ Erro durante fit (possível problema com calibração/cv). Farei fallback sem calibração.")
        print("Detalhe do erro:", e)
        from sklearn.linear_model import LogisticRegression as LR

        vec_word = TfidfVectorizer(preprocessor=clean_text, analyzer="word", ngram_range=(1, 2), min_df=2)
        vec_char = TfidfVectorizer(preprocessor=clean_text, analyzer="char_wb", ngram_range=(3, 5), min_df=2)
        combined = FeatureUnion([("word", vec_word), ("char", vec_char)])
        clf = LR(max_iter=400, class_weight="balanced", random_state=args.random_state)
        fallback_pipe = Pipeline([("vec", combined), ("clf", clf)])
        fallback_pipe.fit(X_train, y_train)
        pipe = fallback_pipe

    # Avaliação
    try:
        y_pred = pipe.predict(X_test)
        report = classification_report(y_test, y_pred, digits=3)
    except Exception:
        report = "Relatório indisponível (possível classe única ou erro de predição)."

    print(report)

    # Salva artefatos
    model_path = os.path.join(args.model_dir, "model.joblib")
    dump(pipe, model_path)

    labels_path = os.path.join(args.model_dir, "labels.json")
    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump(labels_sorted, f, ensure_ascii=False, indent=2)

    # salva relatório em arquivo para inspeção posterior
    report_path = os.path.join(args.model_dir, "classification_report.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"Modelo salvo em: {model_path}")
    print(f"Rótulos salvos em: {labels_path}")
    print(f"Relatório salvo em: {report_path}")


if __name__ == "__main__":
    main()
