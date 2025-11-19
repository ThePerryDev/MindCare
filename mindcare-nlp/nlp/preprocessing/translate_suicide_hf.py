# nlp/preprocessing/translate_suicide_hf.py

import os
import time
import pandas as pd
from datasets import load_dataset
from deep_translator import GoogleTranslator

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
RAW_DIR = os.path.join(ROOT_DIR, "dataset", "raw")
PROCESSED_DIR = os.path.join(ROOT_DIR, "dataset", "processed")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Quantidade máxima por classe (ajuste como quiser)
MAX_SAMPLES_PER_CLASS = 1000  # 1000 suicide + 1000 non-suicide ≈ 2000 linhas

def baixar_dataset_hf(save_raw_csv: bool = True) -> pd.DataFrame:
    """
    Baixa o dataset de suicídio do Hugging Face e converte para um DataFrame pandas.
    Dataset: vibhorag101/suicide_prediction_dataset_phr

    Retorna um DataFrame com colunas padronizadas ['text', 'label', 'split'].
    """
    print("Baixando dataset do Hugging Face...")
    ds = load_dataset("vibhorag101/suicide_prediction_dataset_phr")

    dfs = []
    for split_name, split_ds in ds.items():
        df_split = split_ds.to_pandas()
        df_split["split"] = split_name
        dfs.append(df_split)

    df = pd.concat(dfs, ignore_index=True)

    # Tentar identificar colunas de texto e label automaticamente
    possible_text_cols = ["text", "sentence", "post"]
    possible_label_cols = ["label", "sentiment", "target"]

    text_col = None
    label_col = None

    for c in df.columns:
        if c in possible_text_cols:
            text_col = c
        if c in possible_label_cols:
            label_col = c

    if text_col is None or label_col is None:
        raise ValueError(f"Não foi possível identificar colunas de texto/label. Colunas: {df.columns}")

    df = df[[text_col, label_col, "split"]].rename(
        columns={text_col: "text", label_col: "label"}
    )

    df["text"] = df["text"].astype(str).str.strip()
    df["label"] = df["label"].astype(str).str.strip()

    # Opcional: salvar completo em inglês, sem redução
    if save_raw_csv:
        raw_path = os.path.join(RAW_DIR, "suicide_en_hf_full.csv")
        df.to_csv(raw_path, index=False)
        print(f"Dataset bruto completo salvo em: {raw_path} ({len(df)} linhas)")

    print("Labels únicos encontrados no dataset HF:", df["label"].unique())

    return df


def amostrar_balanceado(df: pd.DataFrame,
                        max_por_classe: int = MAX_SAMPLES_PER_CLASS) -> pd.DataFrame:
    """
    Faz uma amostragem balanceada do dataset para reduzir o tamanho.
    Ex: até 1000 'suicide' e 1000 'non-suicide' (ajustável).
    """
    # Se quiser garantir apenas essas duas classes:
    df = df[df["label"].isin(["suicide", "non-suicide"])]

    print("Contagem original por classe:")
    print(df["label"].value_counts())

    amostras = []
    for label, grupo in df.groupby("label"):
        n_disponivel = len(grupo)
        n_querido = min(max_por_classe, n_disponivel)
        print(f"Amostrando {n_querido} de {n_disponivel} para a classe '{label}'")
        amostras.append(grupo.sample(n=n_querido, random_state=42))

    df_sampled = pd.concat(amostras, ignore_index=True)
    df_sampled = df_sampled.sample(frac=1.0, random_state=42).reset_index(drop=True)

    print("Contagem após amostragem:")
    print(df_sampled["label"].value_counts())
    print(f"Total de linhas após amostragem: {len(df_sampled)}")

    return df_sampled


def traduzir_textos(df: pd.DataFrame,
                    batch_size: int = 50,
                    pause_seconds: float = 1.0) -> pd.DataFrame:
    """
    Traduz os textos do DataFrame para PT-BR usando GoogleTranslator (deep-translator).

    Parâmetros:
    - batch_size: quantos textos traduzir antes de dar uma pausa (para evitar bloqueio).
    - pause_seconds: quantos segundos esperar entre os batches.

    Retorna um novo DataFrame com coluna 'text_pt'.
    """
    translator = GoogleTranslator(source="en", target="pt")

    textos_en = df["text"].tolist()
    textos_pt = []

    total = len(textos_en)
    print(f"Iniciando tradução de {total} textos para PT-BR...")

    for i, texto in enumerate(textos_en, start=1):
        try:
            trad = translator.translate(texto)
        except Exception as e:
            print(f"Erro ao traduzir linha {i}: {e}")
            trad = ""  # ou usar o próprio texto original em caso de falha

        textos_pt.append(trad)

        if i % batch_size == 0:
            print(f"{i}/{total} traduzidos... pausando {pause_seconds}s.")
            time.sleep(pause_seconds)

    df_trad = df.copy()
    df_trad["text_pt"] = textos_pt
    return df_trad


def preparar_e_salvar_csv_traduzido():
    # 1. Baixar dataset completo
    df_full = baixar_dataset_hf(save_raw_csv=True)

    # 2. Fazer amostragem balanceada (ex.: ~2000 linhas)
    df_sampled = amostrar_balanceado(df_full, max_por_classe=MAX_SAMPLES_PER_CLASS)

    # 3. Traduzir somente a amostra
    df_trad = traduzir_textos(df_sampled, batch_size=50, pause_seconds=1.0)

    # 4. Montar CSV final só com o necessário
    df_final = df_trad[["text_pt", "label", "split"]].rename(columns={"text_pt": "text"})

    out_path = os.path.join(PROCESSED_DIR, "suicide_pt_br_sampled.csv")
    df_final.to_csv(out_path, index=False)
    print(f"CSV traduzido amostrado salvo em: {out_path} ({len(df_final)} linhas)")


if __name__ == "__main__":
    preparar_e_salvar_csv_traduzido()
