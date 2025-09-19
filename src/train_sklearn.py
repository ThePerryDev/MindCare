# src/train_sklearn.py
import json, joblib, pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

DATA = "data/processed/mindcare_train.csv"  # colunas: text, labels (lista em string)
MODEL_DIR = "models/sklearn"

def load_dataset(path):
    df = pd.read_csv(path)
    df["labels"] = df["labels"].apply(lambda s: json.loads(s))
    return df

def main():
    df = load_dataset(DATA)
    X_train, X_test, y_train_raw, y_test_raw = train_test_split(
        df["text"], df["labels"], test_size=0.2, random_state=42, stratify=df["labels"].apply(lambda x: x[0] if x else "neutro")
    )
    mlb = MultiLabelBinarizer()
    y_train = mlb.fit_transform(y_train_raw)
    y_test  = mlb.transform(y_test_raw)

    pipe = Pipeline([
        ("tfidf", TfidfVectorizer(
            lowercase=True,
            strip_accents="unicode",
            ngram_range=(1,2),            # comece simples; você pode testar (1,3) depois
            min_df=2,
            max_df=0.95,
        )),
        ("clf", OneVsRestClassifier(
            LogisticRegression(max_iter=200, n_jobs=None, class_weight="balanced")
        ))
    ])

    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)

    print(classification_report(y_test, preds, target_names=mlb.classes_))

    # persistência
    import os; os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipe, f"{MODEL_DIR}/model.pkl")
    joblib.dump(mlb,  f"{MODEL_DIR}/mlb.pkl")

if __name__ == "__main__":
    main()
