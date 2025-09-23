# src/prepare_dataset.py
from __future__ import annotations
import os, csv
import pandas as pd

RAW_DIR = os.getenv("RAW_DIR", "data/raw")
OUT_DIR = os.getenv("OUT_DIR", "data/processed")
TRAIN_IN = os.path.join(RAW_DIR, "train.csv")   # TweetID,Category
TEST_IN  = os.path.join(RAW_DIR, "test.csv")    # tweet_id,tweet,categoria
OUT_CSV  = os.path.join(OUT_DIR, "mindcare_train.csv")  # text,label

def read_any(path):
    tries = [
        dict(engine="python", sep=None, encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=None, encoding="utf-8",     quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=";",  encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=",",  encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep="\t", encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
    ]
    last = None
    for kw in tries:
        try:
            return pd.read_csv(path, **kw)
        except Exception as e:
            last = e
    raise last

def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    df_tr = read_any(TRAIN_IN)  # TweetID, Category
    df_te = read_any(TEST_IN)   # tweet_id, tweet, categoria (categoria pode estar em branco)

    # normalizar nomes
    df_tr = df_tr.rename(columns={c: c.lower() for c in df_tr.columns})
    df_te = df_te.rename(columns={c: c.lower() for c in df_te.columns})

    # checar colunas mínimas
    if not {"tweetid","category"}.issubset(df_tr.columns):
        raise ValueError(f"train.csv precisa ter colunas TweetID,Category (atuais: {list(df_tr.columns)})")
    if "tweet_id" not in df_te.columns or "tweet" not in df_te.columns:
        raise ValueError(f"test.csv precisa ter colunas tweet_id,tweet,(categoria) (atuais: {list(df_te.columns)})")

    # tipos e merges
    df_tr["tweetid"]  = df_tr["tweetid"].astype(str)
    df_te["tweet_id"] = df_te["tweet_id"].astype(str)

    # rótulo preferencial: categoria do test.csv (quando existir), senão Category do train.csv via join
    df_merge = df_te.merge(
        df_tr[["tweetid","category"]].rename(columns={"tweetid":"tweet_id"}),
        how="left", on="tweet_id", validate="m:1"
    )
    # label final
    df_merge["categoria"] = df_merge.get("categoria")  # pode não existir (alguns dumps)
    df_merge["label"] = df_merge["categoria"].where(df_merge["categoria"].notna(), df_merge["category"])

    # limpar brancos
    before = len(df_merge)
    df_merge["tweet"] = df_merge["tweet"].astype(str).str.strip()
    df_merge = df_merge[ df_merge["tweet"].str.len() > 0 ]          # texto não vazio
    df_merge = df_merge[ df_merge["label"].astype(str).str.len() > 0 ]  # label não vazio
    df_merge = df_merge[ df_merge["label"].astype(str).str.lower().isin(["", "nan", "none"]) == False ]
    removed = before - len(df_merge)

    # coluna-alvo final
    out = df_merge[["tweet","label"]].rename(columns={"tweet":"text"})
    # rótulos como string “crua” (ex.: "0","1",…)
    out["label"] = out["label"].astype(str).str.strip()

    # remover duplicatas exatas
    out = out.drop_duplicates(subset=["text","label"]).reset_index(drop=True)

    out.to_csv(OUT_CSV, index=False)
    print(f"[prepare] total={len(out)} | removidos={removed} | salvo em {OUT_CSV}")
    print(out.head(5))

if __name__ == "__main__":
    main()
