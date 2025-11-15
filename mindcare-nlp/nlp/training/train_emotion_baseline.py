# nlp/training/train_emotion_baseline.py

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

DATA_DIR = os.path.join(ROOT_DIR, "nlp", "data", "processed")
MODELS_DIR = os.path.join(ROOT_DIR, "nlp", "models", "emotions")

TRAIN_FILE = os.path.join(DATA_DIR, "emotions_train.csv")
VAL_FILE = os.path.join(DATA_DIR, "emotions_val.csv")


def load_data():
    df_train = pd.read_csv(TRAIN_FILE)
    df_val = pd.read_csv(VAL_FILE)

    # Garantir colunas
    for df, name in [(df_train, "train"), (df_val, "val")]:
        if not {"text", "label"}.issubset(df.columns):
            raise ValueError(f"{name} precisa ter colunas text e label")

    # Mapear labels para ids
    classes = sorted(df_train["label"].unique().tolist())
    label2id = {label: idx for idx, label in enumerate(classes)}
    id2label = {idx: label for label, idx in label2id.items()}

    df_train["y"] = df_train["label"].map(label2id)
    df_val["y"] = df_val["label"].map(label2id)

    X_train = df_train["text"].astype(str).tolist()
    y_train = df_train["y"].values

    X_val = df_val["text"].astype(str).tolist()
    y_val = df_val["y"].values

    return X_train, y_train, X_val, y_val, label2id, id2label


def train_and_save():
    X_train, y_train, X_val, y_val, label2id, id2label = load_data()

    print("Treinando TF-IDF (emoções)...")
    vectorizer = TfidfVectorizer(
        max_features=15000,
        ngram_range=(1, 2),
        min_df=2
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_val_vec = vectorizer.transform(X_val)

    print("Treinando Logistic Regression (emoções)...")
    clf = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        n_jobs=-1
    )
    clf.fit(X_train_vec, y_train)

    print("Avaliação no conjunto de validação:")
    y_pred = clf.predict(X_val_vec)
    print(confusion_matrix(y_val, y_pred))
    print(classification_report(y_val, y_pred, digits=4, target_names=[id2label[i] for i in sorted(id2label)]))

    os.makedirs(MODELS_DIR, exist_ok=True)
    vec_path = os.path.join(MODELS_DIR, "tfidf_vectorizer_emotions.joblib")
    clf_path = os.path.join(MODELS_DIR, "logreg_emotions.joblib")
    map_path = os.path.join(MODELS_DIR, "label_mapping_emotions.joblib")

    joblib.dump(vectorizer, vec_path)
    joblib.dump(clf, clf_path)
    joblib.dump({"label2id": label2id, "id2label": id2label}, map_path)

    print(f"Salvo vetorizador em: {vec_path}")
    print(f"Salvo modelo em:      {clf_path}")
    print(f"Salvo mapping em:     {map_path}")


if __name__ == "__main__":
    train_and_save()
