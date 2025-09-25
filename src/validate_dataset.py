\
from __future__ import annotations
try:
    __file__
    _HAS_FILE = True
except NameError:
    _HAS_FILE = False
if __package__ in {None, ''} and _HAS_FILE:
    import sys, os
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import sys, pandas as pd

def main(path: str):
    df = pd.read_csv(path)
    cols = [c.lower() for c in df.columns]
    if not (("texto" in cols) and ("sentimento" in cols)):
        raise SystemExit("❌ Esperado cabeçalhos 'Texto,Sentimento' (sem acento em 'Sentimento'). Encontrei: " + ", ".join(df.columns))
    # normalize names to use
    texto_col = df.columns[cols.index("texto")]
    sent_col  = df.columns[cols.index("sentimento")]
    print("✅ Cabeçalhos OK:", texto_col, "|", sent_col)
    print("\nAmostras:")
    print(df[[texto_col, sent_col]].head(5).to_string(index=False))
    print("\nDistribuição das classes:")
    print(df[sent_col].str.lower().value_counts())

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python src/validate_dataset.py data/tweets_ekman.csv")
        raise SystemExit(1)
    main(sys.argv[1])