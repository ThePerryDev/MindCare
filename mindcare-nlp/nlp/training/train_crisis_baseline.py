# nlp/training/train_crisis_baseline.py

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

DATA_FILE = os.path.join(ROOT_DIR, "nlp", "data", "processed", "suicide_pt_br_clean.csv")
MODELS_DIR = os.path.join(ROOT_DIR, "nlp", "models", "crisis")


def load_data():
    df = pd.read_csv(DATA_FILE)

    if not {"text", "label"}.issubset(df.columns):
        raise ValueError(f"CSV precisa ter colunas text e label. Colunas: {df.columns}")

    label_mapping = {"non-suicide": 0, "suicide": 1}
    df["y"] = df["label"].map(label_mapping)

    X = df["text"].astype(str).tolist()
    y = df["y"].values

    return X, y, label_mapping


def train_and_save():
    X, y, label_mapping = load_data()

    X_train, X_val, y_train, y_val = train_test_split(
        X, y,
        test_size=0.2,
        stratify=y,
        random_state=42
    )

    print("Treinando TF-IDF (crise)...")
    vectorizer = TfidfVectorizer(
        max_features=15000,
        ngram_range=(1, 2),
        min_df=2
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_val_vec = vectorizer.transform(X_val)

    print("Treinando Logistic Regression (crise suicide vs non-suicide)...")
    clf = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        n_jobs=-1
    )
    clf.fit(X_train_vec, y_train)

    print("Avaliação no conjunto de validação:")
    y_pred = clf.predict(X_val_vec)
    print(confusion_matrix(y_val, y_pred))
    print(classification_report(y_val, y_pred, digits=4, target_names=["non-suicide", "suicide"]))

    os.makedirs(MODELS_DIR, exist_ok=True)
    vec_path = os.path.join(MODELS_DIR, "tfidf_vectorizer_crisis.joblib")
    clf_path = os.path.join(MODELS_DIR, "logreg_crisis.joblib")
    map_path = os.path.join(MODELS_DIR, "label_mapping_crisis.joblib")

    joblib.dump(vectorizer, vec_path)
    joblib.dump(clf, clf_path)
    joblib.dump(label_mapping, map_path)

    print(f"Vetorizador crise salvo em: {vec_path}")
    print(f"Modelo crise salvo em:      {clf_path}")
    print(f"Mapping crise salvo em:     {map_path}")


if __name__ == "__main__":
    train_and_save()
