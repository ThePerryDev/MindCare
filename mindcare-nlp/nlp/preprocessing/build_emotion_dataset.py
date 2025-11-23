# nlp/preprocessing/build_emotion_dataset.py

import os
import pandas as pd
from sklearn.model_selection import train_test_split

# raiz do projeto
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

RAW_DIR = os.path.join(ROOT_DIR, "nlp", "data", "raw")
PROCESSED_DIR = os.path.join(ROOT_DIR, "nlp", "data", "processed")

os.makedirs(PROCESSED_DIR, exist_ok=True)


def load_emotions_csv():
    path = os.path.join(RAW_DIR, "dataset_emotions_pt_br_translated (1).csv")
    df = pd.read_csv(path)

    # renomear colunas
    df = df.rename(columns={"sentence": "text", "sentiment": "label"})

    # mapeamento dos 6 rótulos -> 4 classes do app
    mapping = {
        "alegria": "felicidade",
        "tristeza": "tristeza",
        "medo": "ansiedade",
        "raiva": "estresse",
        "amor": "felicidade",
        # "surpresa": None -> vamos descartar
    }

    df["label"] = df["label"].map(mapping)
    df["text"] = df["text"].astype(str).str.strip()

    # remove linhas sem mapeamento (ex: surpresa)
    df = df.dropna(subset=["label", "text"])

    return df


def load_tweets_csv():
    path = os.path.join(RAW_DIR, "tweets.csv")
    df = pd.read_csv(path)

    df = df.rename(columns={"tweet_text": "text", "sentiment": "label"})

    mapping = {
        "Positivo": "felicidade",
        "Negativo": "tristeza",
        "Neutro": None,  # por enquanto vamos descartar neutro
    }

    df["label"] = df["label"].map(mapping)
    df["text"] = df["text"].astype(str).str.strip()

    df = df.dropna(subset=["label", "text"])
    return df


def build_and_save():
    df_emotions = load_emotions_csv()
    df_tweets = load_tweets_csv()

    df_all = pd.concat([df_emotions, df_tweets], ignore_index=True)

    # embaralhar
    df_all = df_all.sample(frac=1.0, random_state=42).reset_index(drop=True)

    # split estratificado
    train_df, val_df = train_test_split(
        df_all,
        test_size=0.2,
        stratify=df_all["label"],
        random_state=42
    )

    train_path = os.path.join(PROCESSED_DIR, "emotions_train.csv")
    val_path = os.path.join(PROCESSED_DIR, "emotions_val.csv")

    train_df.to_csv(train_path, index=False)
    val_df.to_csv(val_path, index=False)

    print(f"Train salvo em: {train_path} ({len(train_df)} linhas)")
    print(f"Val salvo em:   {val_path} ({len(val_df)} linhas)")
    print("Distribuição (train):")
    print(train_df["label"].value_counts())


if __name__ == "__main__":
    build_and_save()
