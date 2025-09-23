from __future__ import annotations
import os, json, joblib, csv
from typing import List, Dict
import numpy as np
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import FeatureUnion
from sklearn.metrics import classification_report, f1_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split

from lexicon_utils import load_lexicon
from lexicon_features import LexiconFeaturizer

# --- caminhos (mantidos) ---
TRAIN_CSV = os.getenv("TRAIN_CSV", "data/raw/train.csv")
TEST_CSV  = os.getenv("TEST_CSV",  "data/raw/test.csv")
LEX_TXT   = os.getenv("LEX_TXT",   "data/raw/List_of_Lexical_items.txt")
MODEL_DIR = os.getenv("MODEL_DIR", "models/sklearn/sklearn_lex")


# =========================
#  Parsing & leitura CSV
# =========================
def parse_labels_cell(x) -> List[str]:
    """Aceita: '7' ; 'ansiedade' ; 'ansiedade,medo' ; 'ansiedade;medo' ; "['ansiedade','medo']".
       Remove rótulos vazios/none/null/na.
    """
    if pd.isna(x):
        return []
    s = str(x).strip()

    if s.startswith("[") and s.endswith("]"):
        try:
            arr = json.loads(s.replace("'", '"'))
            labs = [str(t).strip().lower() for t in arr]
        except Exception:
            labs = []
    else:
        if ";" in s or "," in s:
            labs = [t.strip().lower() for t in s.replace(";", ",").split(",") if t.strip()]
        else:
            labs = [s.lower()] if s else []

    drop_vals = {"", "none", "null", "na", "n/a", "-", "[]"}
    labs = [l for l in labs if l not in drop_vals]
    return labs


def _try_read(path, **kwargs):
    try:
        return pd.read_csv(path, **kwargs), None
    except Exception as e:
        return None, e


def load_df(path: str) -> pd.DataFrame:
    """Leitura tolerante: autodetecta separador, lida com BOM, aspas e linhas ruins."""
    tries = [
        dict(engine="python", sep=None, encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=None, encoding="utf-8",     quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=";",  encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=",",  encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep="\t", encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
    ]
    last_err = None
    df = None
    for kw in tries:
        df, last_err = _try_read(path, **kw)
        if df is not None:
            break
    if df is None:
        raise last_err

    cols_lower = {c.lower(): c for c in df.columns}
    text_col = cols_lower.get("text") or cols_lower.get("sentence") or cols_lower.get("texto") or cols_lower.get("frase")
    label_col = cols_lower.get("labels") or cols_lower.get("label") or cols_lower.get("emocao") or cols_lower.get("emocoes")

    if not text_col or not label_col:
        if len(df.columns) >= 3:
            first = df.columns[0]
            last  = df.columns[-1]
            mid   = df.columns[1:-1]
            df["__text__"] = df[first].astype(str).fillna("")
            if len(mid) > 0:
                df["__text__"] = df["__text__"] + " " + df[mid].astype(str).fillna("").agg(" ".join, axis=1)
            df["__labels__"] = df[last].astype(str)
            text_col, label_col = "__text__", "__labels__"
        elif len(df.columns) == 2:
            text_col, label_col = df.columns[0], df.columns[1]
        else:
            raise ValueError(f"{path} precisa conter colunas para texto e rótulos. Colunas lidas: {list(df.columns)}")

    df = df[[text_col, label_col]].rename(columns={text_col: "text", label_col: "labels"})
    df["text"]   = df["text"].astype(str).fillna("")
    df["labels"] = df["labels"].apply(parse_labels_cell)

    # remove linhas sem rótulo (causam fallback para multilabel)
    before = len(df)
    df = df[df["labels"].apply(lambda ls: len(ls) > 0)].reset_index(drop=True)
    removed = before - len(df)

    counts = {}
    for labs in df["labels"]:
        for l in labs:
            counts[l] = counts.get(l, 0) + 1
    top = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:10]
    print(f"[load_df] {os.path.basename(path)} | amostras={len(df)} | removidas_sem_label={removed} | top10_labels={top}")

    return df


# =========================
#  Threshold tuning (multi-rótulo)
# =========================
def tune_thresholds_with_precision_floor(
    probs: np.ndarray, y_valid: np.ndarray, classes: List[str],
    search: List[float] | None = None, min_precision: float = 0.5
) -> Dict[str, float]:
    if search is None:
        search = [round(x, 2) for x in np.linspace(0.05, 0.95, 19)]
    thresholds: Dict[str, float] = {}

    for j, lbl in enumerate(classes):
        y_true = y_valid[:, j]
        if y_true.sum() == 0:
            thresholds[lbl] = 0.5
            continue
        best_t, best_f1 = 0.5, -1.0
        for t in search:
            y_pred = (probs[:, j] >= t).astype(int)
            p, r, f1, _ = precision_recall_fscore_support(
                y_true, y_pred, average="binary", zero_division=0
            )
            if p >= min_precision and f1 > best_f1:
                best_f1, best_t = f1, t
        if best_f1 < 0:  # nenhuma opção atingiu o piso de precisão
            best_t = 0.5
        thresholds[lbl] = float(best_t)

    print("[tune_thresholds_with_precision_floor] exemplo:", {k: round(v, 2) for k, v in list(thresholds.items())[:10]})
    return thresholds


def apply_thresholds(probs: np.ndarray, thresholds: Dict[str, float], classes: List[str]) -> np.ndarray:
    thr_vec = np.array([thresholds.get(c, 0.5) for c in classes])[None, :]
    return (probs >= thr_vec).astype(int)


# =========================
#  Auxiliares
# =========================
def is_single_label(df: pd.DataFrame) -> bool:
    """True se todas as linhas têm exatamente 1 rótulo (após remover vazias)."""
    return all(len(labs) == 1 for labs in df["labels"])


# =========================
#  Treino/Avaliação
# =========================
def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1) dados
    df_tr = load_df(TRAIN_CSV)
    df_te = load_df(TEST_CSV)

    # 2) léxico
    emo_lex = load_lexicon(LEX_TXT)  # base de termos por emoção (PT). :contentReference[oaicite:1]{index=1}

    # 3) vetorizadores (TF-IDF || features do léxico)
    tfidf = TfidfVectorizer(
        lowercase=True, strip_accents="unicode",
        ngram_range=(1, 2), min_df=2, max_df=0.95
    )
    lex   = LexiconFeaturizer(emo_lex, sparse_output=True)
    feats = FeatureUnion([("tfidf", tfidf), ("lex", lex)])

    # 4) Decide modo: single-label (multiclasse) vs multi-rótulo
    single_label = is_single_label(df_tr)

    if single_label:
        # ======== MODO MULTICLASSE ========
        print("[mode] multiclass (single-label)")
        y_tr_raw = [labs[0] for labs in df_tr["labels"]]
        y_te_raw = [labs[0] for labs in df_te["labels"] if len(labs) > 0]

        le = LabelEncoder()
        y_tr = le.fit_transform(y_tr_raw)

        X_tr = feats.fit_transform(df_tr["text"])
        X_te = feats.transform(df_te["text"])

        clf = LogisticRegression(
            max_iter=500,
            class_weight="balanced",
            multi_class="multinomial",
            solver="lbfgs",
            n_jobs=None
        )
        clf.fit(X_tr, y_tr)

        # alinhar test às classes conhecidas (descarta classes fora do treino)
        mask_known = [len(labs) > 0 and labs[0] in le.classes_ for labs in df_te["labels"]]
        X_te_known = X_te[mask_known]
        y_te_vec = le.transform([labs[0] for labs in df_te["labels"] if len(labs) > 0 and labs[0] in le.classes_])

        yhat_te = clf.predict(X_te_known)
        report = classification_report(
            y_te_vec, yhat_te,
            target_names=list(le.classes_),
            zero_division=0,
            output_dict=True
        )
        print(classification_report(y_te_vec, yhat_te, target_names=list(le.classes_), zero_division=0))

        # salvar artefatos
        joblib.dump(feats, f"{MODEL_DIR}/features.pkl")
        joblib.dump(clf,  f"{MODEL_DIR}/model.pkl")
        joblib.dump(le,   f"{MODEL_DIR}/label_encoder.pkl")
        with open(f"{MODEL_DIR}/metrics.json","w",encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        with open(f"{MODEL_DIR}/metadata.json","w",encoding="utf-8") as f:
            json.dump({"mode":"multiclass"}, f, ensure_ascii=False, indent=2)

    else:
        # ======== MODO MULTI-RÓTULO ========
        print("[mode] multilabel")
        X_all = feats.fit_transform(df_tr["text"])

        mlb = MultiLabelBinarizer()
        y_all = mlb.fit_transform(df_tr["labels"])

        X_tr, X_va, y_tr, y_va = train_test_split(
            X_all, y_all, test_size=0.15, random_state=42,
            stratify=(y_all.sum(axis=1) > 0)
        )

        clf = OneVsRestClassifier(
            LogisticRegression(max_iter=500, class_weight="balanced")
        )
        clf.fit(X_tr, y_tr)

        probs_va = clf.predict_proba(X_va)
        thresholds = tune_thresholds_with_precision_floor(
            probs_va, y_va, list(mlb.classes_), min_precision=0.5
        )

        X_te = feats.transform(df_te["text"])
        y_te = mlb.transform([
            [lab for lab in labs if lab in mlb.classes_]
            for labs in df_te["labels"]
        ])
        probs_te = clf.predict_proba(X_te)
        yhat_te = apply_thresholds(probs_te, thresholds, list(mlb.classes_))

        report = classification_report(
            y_te, yhat_te,
            target_names=mlb.classes_,
            zero_division=0,
            output_dict=True
        )
        print(classification_report(y_te, yhat_te, target_names=mlb.classes_, zero_division=0))

        joblib.dump(feats, f"{MODEL_DIR}/features.pkl")
        joblib.dump(clf,  f"{MODEL_DIR}/model.pkl")
        joblib.dump(mlb,  f"{MODEL_DIR}/mlb.pkl")
        with open(f"{MODEL_DIR}/thresholds.json", "w", encoding="utf-8") as f:
            json.dump(thresholds, f, ensure_ascii=False, indent=2)
        with open(f"{MODEL_DIR}/metrics.json","w",encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        with open(f"{MODEL_DIR}/metadata.json","w",encoding="utf-8") as f:
            json.dump({"mode":"multilabel"}, f, ensure_ascii=False, indent=2)

    print(f"[done] artefatos salvos em: {MODEL_DIR}")


if __name__ == "__main__":
    main()
