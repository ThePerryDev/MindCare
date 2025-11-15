# nlp/preprocessing/clean_suicide_pt_br.py

import os
import pandas as pd

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

INPUT_FILE = os.path.join(ROOT_DIR, "dataset", "processed", "suicide_pt_br_sampled.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "nlp", "data", "processed")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "suicide_pt_br_clean.csv")

MAX_WORDS = 200  # máximo de palavras por texto


def truncate_text(text: str, max_words: int = MAX_WORDS) -> str:
    words = str(text).split()
    if len(words) <= max_words:
        return " ".join(words)
    return " ".join(words[:max_words])


def clean_dataset():
    print(f"Lendo: {INPUT_FILE}")
    df = pd.read_csv(INPUT_FILE)

    expected_cols = {"text", "label", "split"}
    if not expected_cols.issubset(df.columns):
        raise ValueError(f"CSV não tem colunas {expected_cols}. Tem: {df.columns}")

    # limpeza básica
    df["text"] = df["text"].astype(str).str.strip()
    df = df[df["text"].str.len() > 10]

    # manter apenas suicide / non-suicide
    df = df[df["label"].isin(["suicide", "non-suicide"])]

    # truncar textos muito longos
    df["text"] = df["text"].apply(truncate_text)

    # remover duplicados
    before = len(df)
    df = df.drop_duplicates(subset=["text", "label"])
    after = len(df)
    print(f"Removidos {before - after} duplicados. Restaram {after} linhas.")

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Dataset limpo salvo em: {OUTPUT_FILE}")
    print(df["label"].value_counts())


if __name__ == "__main__":
    clean_dataset()
