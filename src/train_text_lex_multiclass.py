# src/train_text_lex_multiclass.py
from __future__ import annotations
import os, json, joblib
from typing import List, Dict
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

from lexicon_utils import load_lexicon
from lexicon_features import LexiconFeaturizer

PROC_CSV  = os.getenv("PROC_CSV", "data/processed/mindcare_train.csv")  # text,label
LEX_TXT   = os.getenv("LEX_TXT",  "data/raw/List_of_Lexical_items.txt")
MODEL_DIR = os.getenv("MODEL_DIR","models/sklearn/sklearn_lex")
TEST_SIZE = float(os.getenv("TEST_SIZE", "0.18"))
MIN_SAMPLES_PER_CLASS = int(os.getenv("MIN_SAMPLES_PER_CLASS", "2"))  # <--- ajuste aqui se quiser

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # ===== 1) Carregar dataset unificado =====
    df = pd.read_csv(PROC_CSV)
    if not {"text","label"}.issubset(df.columns):
        raise ValueError(f"{PROC_CSV} precisa ter colunas text,label")
    df["text"]  = df["text"].astype(str).str.strip()
    df["label"] = df["label"].astype(str).str.strip()
    df = df[(df["text"].str.len() > 0) & (df["label"].str.len() > 0)].reset_index(drop=True)

    # ===== 2) Remover classes muito raras (estratificação exige >=2) =====
    vc = df["label"].value_counts()
    rare_labels = vc[vc < MIN_SAMPLES_PER_CLASS].index.tolist()
    if rare_labels:
        n_before = len(df)
        df = df[~df["label"].isin(rare_labels)].reset_index(drop=True)
        print(f"[filter] Removidas classes raras (<{MIN_SAMPLES_PER_CLASS} amostras): {sorted(rare_labels)} "
              f"| removidos={n_before - len(df)} | restante={len(df)}")

    # Se sobrar menos de 2 classes, aborta com mensagem clara
    if df["label"].nunique() < 2:
        raise ValueError("Após filtrar classes raras restou < 2 classes. "
                         "Aumente o dataset ou reduza o limiar MIN_SAMPLES_PER_CLASS.")

    # ===== 3) Split (estratificado se possível) =====
    stratify_y = df["label"] if df["label"].value_counts().min() >= 2 else None
    if stratify_y is None:
        print("[split] Atenção: split sem estratificação (algumas classes ainda têm <2 amostras).")

    X_train, X_test, y_train_raw, y_test_raw = train_test_split(
        df["text"], df["label"], test_size=TEST_SIZE, random_state=42, stratify=stratify_y
    )

    # ===== 4) Léxico e vetorizadores =====
    emo_lex = load_lexicon(LEX_TXT)

    tfidf_word = TfidfVectorizer(
        analyzer="word",
        lowercase=True,
        strip_accents="unicode",
        ngram_range=(1,2),
        min_df=1,
        max_df=0.98
    )
    tfidf_char = TfidfVectorizer(
        analyzer="char_wb",
        ngram_range=(3,5),
        min_df=1,
        max_df=1.0
    )
    lex = LexiconFeaturizer(emo_lex, sparse_output=True)

    feats = FeatureUnion([
        ("tfidf_word", tfidf_word),
        ("tfidf_char", tfidf_char),
        ("lex",        lex),
    ])

    X_tr = feats.fit_transform(X_train)
    X_te = feats.transform(X_test)

    # ===== 5) Rótulos (multiclasse) =====
    le = LabelEncoder()
    y_tr = le.fit_transform(y_train_raw)
    y_te = le.transform(y_test_raw)

    # ===== 6) Classificador =====
    clf = LogisticRegression(
        max_iter=2000,
        class_weight="balanced",
        multi_class="multinomial",
        solver="lbfgs",
        C=4.0,
        n_jobs=None
    )
    clf.fit(X_tr, y_tr)

    # ===== 7) Avaliação =====
    yhat = clf.predict(X_te)
    report = classification_report(
        y_te, yhat, target_names=list(le.classes_), zero_division=0, output_dict=True
    )
    print(classification_report(y_te, yhat, target_names=list(le.classes_), zero_division=0))

    # ===== 8) Salvar artefatos =====
    joblib.dump(feats, f"{MODEL_DIR}/features.pkl")
    joblib.dump(clf,  f"{MODEL_DIR}/model.pkl")
    joblib.dump(le,   f"{MODEL_DIR}/label_encoder.pkl")
    with open(f"{MODEL_DIR}/metrics.json","w",encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    with open(f"{MODEL_DIR}/metadata.json","w",encoding="utf-8") as f:
        json.dump({"mode":"multiclass"}, f, ensure_ascii=False, indent=2)

    print(f"[done] artefatos salvos em: {MODEL_DIR}")

if __name__ == "__main__":
    main()
