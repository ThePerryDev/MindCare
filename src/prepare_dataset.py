# src/prepare_dataset.py
from __future__ import annotations
import os, csv
import pandas as pd

RAW_DIR = os.getenv("RAW_DIR", "data/raw")
OUT_DIR = os.getenv("OUT_DIR", "data/processed")

TRAIN_IN = os.path.join(RAW_DIR, "train.csv")   # Esperado: TweetID,Category
TEST_IN  = os.path.join(RAW_DIR, "test.csv")    # Esperado: tweet_id,tweet,categoria
OUT_CSV  = os.path.join(OUT_DIR, "mindcare_train.csv")  # Saída: text,label

def read_any(path: str) -> pd.DataFrame:
    """Leitura tolerante a separador/encoding/BOM/linhas problemáticas."""
    tries = [
        dict(engine="python", sep=None, encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=None, encoding="utf-8",     quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=";",  encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=",",  encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep="\t", encoding="utf-8-sig", quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
        dict(engine="python", sep=None, encoding="latin1",    quoting=csv.QUOTE_MINIMAL, on_bad_lines="skip"),
    ]
    last = None
    for kw in tries:
        try:
            return pd.read_csv(path, **kw)
        except Exception as e:
            last = e
    raise last

def normalize_cols(df: pd.DataFrame) -> pd.DataFrame:
    mapping = {c: c.strip().lower().replace("\ufeff", "") for c in df.columns}
    return df.rename(columns=mapping)

def pick_mode(series: pd.Series):
    """Escolhe a moda da categoria; se houver empate/na, pega a primeira não-nula."""
    s = series.dropna().astype(str)
    if s.empty:
        return None
    m = s.mode()
    if not m.empty:
        return m.iloc[0]
    return s.iloc[0]

def main():
    if not os.path.exists(TRAIN_IN):
        raise FileNotFoundError(f"Não encontrei {TRAIN_IN}. Confirme o caminho.")
    if not os.path.exists(TEST_IN):
        raise FileNotFoundError(f"Não encontrei {TEST_IN}. Confirme o caminho.")

    os.makedirs(OUT_DIR, exist_ok=True)

    # 1) ler e normalizar
    df_tr = normalize_cols(read_any(TRAIN_IN))   # TweetID, Category
    df_te = normalize_cols(read_any(TEST_IN))    # tweet_id, tweet, (categoria)

    # 2) identificar colunas
    tr_id_col = next((c for c in ("tweetid","tweet_id","id","tweet-id") if c in df_tr.columns), None)
    tr_label_col = next((c for c in ("category","label","categoria") if c in df_tr.columns), None)
    if tr_id_col is None or tr_label_col is None:
        raise ValueError(f"train.csv precisa de id e categoria. Colunas: {list(df_tr.columns)}")

    te_id_col = next((c for c in ("tweet_id","tweetid","id","tweet-id") if c in df_te.columns), None)
    te_text_col = next((c for c in ("tweet","text","texto","frase") if c in df_te.columns), None)
    te_label_col = "categoria" if "categoria" in df_te.columns else None
    if te_id_col is None or te_text_col is None:
        raise ValueError(f"test.csv precisa de tweet_id e tweet. Colunas: {list(df_te.columns)}")

    # 3) tipagem e deduplicações
    df_tr[tr_id_col] = df_tr[tr_id_col].astype(str)
    df_te[te_id_col] = df_te[te_id_col].astype(str)

    # dedup em train: ids repetidos -> escolher uma categoria (moda)
    dups_train = df_tr.duplicated(subset=[tr_id_col]).sum()
    if dups_train > 0:
        print(f"[prepare] train.csv: ids duplicados detectados = {dups_train}. Resolvendo por moda da categoria...")
        df_tr = (df_tr
                 .groupby(tr_id_col, as_index=False)[tr_label_col]
                 .agg(pick_mode))
    # dedup em test por id (mantém primeira ocorrência)
    dups_test = df_te.duplicated(subset=[te_id_col]).sum()
    if dups_test > 0:
        print(f"[prepare] test.csv: tweet_id duplicados = {dups_test}. Mantendo a primeira ocorrência.")
        df_te = df_te.drop_duplicates(subset=[te_id_col], keep="first")

    # 4) base do test
    base_cols = [te_id_col, te_text_col] + ([te_label_col] if te_label_col else [])
    base = df_te[base_cols].rename(columns={te_id_col: "tweet_id", te_text_col: "text"})
    if te_label_col:
        base = base.rename(columns={te_label_col: "label_test"})

    # 5) join com train (agora único por id)
    df_tr_small = df_tr[[tr_id_col, tr_label_col]].rename(columns={tr_id_col: "tweet_id", tr_label_col: "label_train"})
    merged = base.merge(df_tr_small, how="left", on="tweet_id", validate="m:1")

    # 6) label final: prioridade categoria do test; fallback train
    if "label_test" in merged.columns:
        merged["label"] = merged["label_test"].where(merged["label_test"].notna(), merged["label_train"])
    else:
        merged["label"] = merged["label_train"]

    # 7) limpeza
    merged["text"]  = merged["text"].astype(str).str.strip()
    merged["label"] = merged["label"].astype(str).str.strip()

    before = len(merged)
    merged = merged[(merged["text"].str.len() > 0)]
    merged = merged[(merged["label"].str.len() > 0) & (~merged["label"].str.lower().isin(["nan","none","n/a","-",""]))]

    removed = before - len(merged)

    # 8) saída final e dedup (texto+label)
    out = merged[["text","label"]].drop_duplicates(subset=["text","label"]).reset_index(drop=True)

    out.to_csv(OUT_CSV, index=False, encoding="utf-8")
    print(f"[prepare] total={len(out)} | removidos_sem_texto_ou_label={removed} | salvo em {OUT_CSV}")
    print("[prepare] exemplo de linhas:")
    print(out.head(5).to_string(index=False))

if __name__ == "__main__":
    main()
