# MindCare NLP – Classificação de Emoções e Detecção de Crise em PT‑BR

Este projeto implementa um backend de **Processamento de Linguagem Natural (PLN)** focado em **saúde mental**, com dois objetivos principais:

1. **Classificar emoções** em textos em português do Brasil.
2. **Detectar risco de crise / ideação suicida** e acionar um *fallback* seguro, recomendando:
   - contato com o **CVV – 188** (Brasil),
   - e **busca de ajuda profissional** (psicólogos e psiquiatras).

> ⚠️ **Aviso importante:**  
> Este sistema é uma ferramenta de apoio e **NÃO substitui** acompanhamento profissional em saúde mental.

---

## 🧠 Visão geral da solução

A solução é composta por dois modelos de PLN, treinados em CPU usando **TF‑IDF + Regressão Logística**:

- **Classificador de Emoções** (multi‑classe – PT‑BR)
  - Classes finais:
    - `felicidade`
    - `tristeza`
    - `ansiedade`
    - `estresse`

- **Classificador de Crise** (binário – PT‑BR, traduzido de inglês)
  - Classes:
    - `non-suicide` → sem indicativo claro de ideação suicida
    - `suicide` → texto com indicativo de ideação suicida / crise

Na camada de aplicação (ex.: FastAPI), os dois modelos são combinados para:

- identificar emoção **quando a confiança é ≥ 0.5**, e
- **priorizar a detecção de crise** quando há indício de ideação suicida, retornando automaticamente mensagem de segurança com CVV + recomendação de ajuda profissional.

---

## 🏗 Arquitetura de alto nível

### Diagrama conceitual

```text
+-------------------+        +----------------------+        +----------------------+
|  App / Chat Front | -----> |  API (FastAPI / etc) | -----> |   Módulo NLP         |
|  (Web / Mobile)   |        |  /api/v1/emotions    |        |   (Python)           |
+-------------------+        +----------------------+        +----------+-----------+
                                                                          |
                                                                          v
                                                              +----------------------+
                                                              |  EmotionPredictor   |
                                                              |  (emoções)          |
                                                              +----------------------+
                                                                          |
                                                                          v
                                                              +----------------------+
                                                              |  CrisisDetector     |
                                                              |  (suicide vs non)   |
                                                              +----------------------+
```

### Fluxo de decisão

```text
Usuário envia texto
        |
        v
API chama CrisisDetector.predict(texto)
        |
        +--> Se is_crisis == True e confiança >= limiar_crise:
        |        -> Resposta especial com CVV + recomendação de ajuda
        |
        +--> Caso contrário:
                 API chama EmotionPredictor.predict(texto)
                        |
                        +--> Se confiança >= 0.5:
                        |        -> Resposta personalizada pela emoção
                        |
                        +--> Senão:
                                 -> Resposta neutra acolhedora (fallback)
```

---

## 📂 Estrutura de diretórios relevante

```bash
mindcare-nlp/
├── dataset/
│   └── processed/
│       └── suicide_pt_br_sampled.csv        # dataset traduzido e amostrado de crise
│
├── nlp/
│   ├── data/
│   │   ├── raw/
│   │   │   ├── dataset_emotions_pt_br_translated (1).csv
│   │   │   └── tweets.csv
│   │   └── processed/
│   │       ├── emotions_train.csv           # gerado pelo build_emotion_dataset.py
│   │       ├── emotions_val.csv             # gerado pelo build_emotion_dataset.py
│   │       └── suicide_pt_br_clean.csv      # gerado pelo clean_suicide_pt_br.py
│   │
│   ├── models/
│   │   ├── emotions/
│   │   │   ├── tfidf_vectorizer_emotions.joblib
│   │   │   ├── logreg_emotions.joblib
│   │   │   └── label_mapping_emotions.joblib
│   │   └── crisis/
│   │       ├── tfidf_vectorizer_crisis.joblib
│   │       ├── logreg_crisis.joblib
│   │       └── label_mapping_crisis.joblib
│   │
│   ├── preprocessing/
│   │   ├── build_emotion_dataset.py         # monta dataset de emoções
│   │   └── clean_suicide_pt_br.py           # limpa e trunca dataset de crise
│   │
│   ├── training/
│   │   ├── train_emotion_baseline.py        # treino das emoções (4 classes)
│   │   └── train_crisis_baseline.py         # treino de crise (suicide vs non-suicide)
│   │
│   └── inference/
│       ├── emotion_predictor.py             # classe EmotionPredictor
│       └── crisis_detector.py               # classe CrisisDetector
└── ...
```

---

## 🧩 1. Preparação do ambiente

### 1.1 Criar e ativar o ambiente virtual

Na raiz do projeto (`mindcare-nlp/`):

#### Windows (PowerShell / CMD)

```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux / Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

Se der certo, o prompt aparecerá com `(venv)` no início.

### 1.2 Instalar dependências

Exemplo de `requirements.txt` mínimo:

```txt
fastapi
uvicorn[standard]
python-dotenv
scikit-learn
pandas
numpy
datasets
deep-translator
joblib
```

Instalar:

```bash
pip install -r requirements.txt
```

---

## 🧬 2. Datasets utilizados

### 2.1 Emoções em PT‑BR

Arquivos originais (já presentes no projeto):

- `nlp/data/raw/dataset_emotions_pt_br_translated (1).csv`  
  Colunas:
  - `sentence` – texto em português já traduzido
  - `sentiment` – rótulos originais:
    - `tristeza`
    - `alegria`
    - `medo`
    - `amor`
    - `raiva`
    - `surpresa`

- `nlp/data/raw/tweets.csv`  
  Colunas:
  - `id`
  - `tweet_text`
  - `tweet_date`
  - `sentiment` (`Positivo`, `Negativo`, `Neutro`)
  - `query_used`

#### 2.1.1 Mapeamento para as 4 classes finais

Mapeamento usado:

- Dataset `dataset_emotions_pt_br_translated (1).csv`:
  - `alegria`   → `felicidade`
  - `tristeza`  → `tristeza`
  - `medo`      → `ansiedade`
  - `raiva`     → `estresse`
  - `amor`      → `felicidade`
  - `surpresa`  → **descartado**

- Dataset `tweets.csv`:
  - `Positivo`  → `felicidade`
  - `Negativo`  → `tristeza`
  - `Neutro`    → descartado (por enquanto)

As classes finais de emoção são:

```text
felicidade, tristeza, ansiedade, estresse
```

---

### 2.2 Crise / Ideação suicida (PT‑BR, traduzido)

Foi utilizado o dataset `vibhorag101/suicide_prediction_dataset_phr` (Hugging Face), originalmente em inglês, com labels:

- `suicide`
- `non-suicide`

Processo aplicado:

1. Download via `datasets.load_dataset`.
2. Amostragem balanceada (~1000 `suicide` + ~1000 `non-suicide`).
3. Tradução automática para PT‑BR (via `deep-translator` / GoogleTranslator).
4. Salvamento em:

   - `dataset/processed/suicide_pt_br_sampled.csv`

5. Limpeza posterior:
   - remoção de textos muito curtos,
   - truncagem para no máximo 200 palavras,
   - remoção de duplicados.

6. Resultado final:

   - `nlp/data/processed/suicide_pt_br_clean.csv`

Distribuição após limpeza:

- `suicide`: 995 exemplos
- `non-suicide`: 995 exemplos

> ⚠️ **Conteúdo sensível**  
> Textos desse dataset podem conter menções fortes a ideação suicida. Devem ser manipulados com responsabilidade, somente para fins acadêmicos / de pesquisa e com o devido cuidado ético.

---

## 🧪 3. Pré‑processamento

### 3.1 Construção do dataset de emoções

Script:

```bash
python -m nlp.preprocessing.build_emotion_dataset
```

O que ele faz:

1. Lê:
   - `nlp/data/raw/dataset_emotions_pt_br_translated (1).csv`
   - `nlp/data/raw/tweets.csv`
2. Aplica o mapeamento de rótulos para:
   - `felicidade`, `tristeza`, `ansiedade`, `estresse`
3. Junta tudo num único DataFrame.
4. Embaralha e faz split estratificado 80% / 20%.
5. Gera:

   - `nlp/data/processed/emotions_train.csv`
   - `nlp/data/processed/emotions_val.csv`

Ambos com colunas:

- `text`
- `label` (`felicidade`, `tristeza`, `ansiedade`, `estresse`)

### 3.2 Limpeza do dataset de crise

Script:

```bash
python -m nlp.preprocessing.clean_suicide_pt_br
```

O que ele faz:

1. Lê `dataset/processed/suicide_pt_br_sampled.csv`.
2. Garante colunas:
   - `text`
   - `label`
   - `split`
3. Remove textos muito curtos.
4. Mantém apenas `suicide` e `non-suicide`.
5. Trunca textos para no máximo 200 palavras.
6. Remove duplicados.
7. Salva em:

   - `nlp/data/processed/suicide_pt_br_clean.csv`

---

## 🤖 4. Treinamento dos modelos

### 4.1 Modelo de Crise (suicide vs non‑suicide)

Script:

```bash
python -m nlp.training.train_crisis_baseline
```

Entrada:

- `nlp/data/processed/suicide_pt_br_clean.csv`

Arquitetura:

- Vetorização: `TfidfVectorizer`
  - `max_features=15000`
  - `ngram_range=(1, 2)` (unigrams + bigrams)
  - `min_df=2`
- Classificador: `LogisticRegression`
  - `max_iter=1000`
  - `class_weight="balanced"`

Saída (arquivos):

- `nlp/models/crisis/tfidf_vectorizer_crisis.joblib`
- `nlp/models/crisis/logreg_crisis.joblib`
- `nlp/models/crisis/label_mapping_crisis.joblib`

#### 4.1.1 Métricas obtidas (crise)

Treino rodado com o comando acima retornou:

```text
Treinando TF-IDF (crise)...
Treinando Logistic Regression (crise suicide vs non-suicide)...
Avaliação no conjunto de validação:
[[174  25]
 [ 32 167]]
              precision    recall  f1-score   support

 non-suicide     0.8447    0.8744    0.8593       199
     suicide     0.8698    0.8392    0.8542       199

    accuracy                         0.8568       398
   macro avg     0.8572    0.8568    0.8567       398
weighted avg     0.8572    0.8568    0.8567       398
```

Resumo:

- **Acurácia ~ 85,68%**
- Bom equilíbrio entre classes `suicide` e `non-suicide`.

---

### 4.2 Modelo de Emoções (4 classes)

Script:

```bash
python -m nlp.training.train_emotion_baseline
```

Entrada:

- `nlp/data/processed/emotions_train.csv`
- `nlp/data/processed/emotions_val.csv`

Arquitetura:

- Vetorização: `TfidfVectorizer`
  - `max_features=15000`
  - `ngram_range=(1, 2)`
  - `min_df=2`
- Classificador: `LogisticRegression`
  - `max_iter=1000`
  - `class_weight="balanced"`

Saída:

- `nlp/models/emotions/tfidf_vectorizer_emotions.joblib`
- `nlp/models/emotions/logreg_emotions.joblib`
- `nlp/models/emotions/label_mapping_emotions.joblib`

#### 4.2.1 Métricas obtidas (emoções)

Treino rodado retornou:

```text
Treinando TF-IDF (emoções)...
Avaliação no conjunto de validação:
[[ 2596   282    89    33]
 [  274  2561   124    41]
 [ 1068  1530 45248 10775]
 [ 1274  1785 22559 82524]]
              precision    recall  f1-score   support

   ansiedade     0.4981    0.8653    0.6322      3000
    estresse     0.4159    0.8537    0.5593      3000
  felicidade     0.6652    0.7719    0.7146     58621
    tristeza     0.8838    0.7631    0.8190    108142

    accuracy                         0.7694    172763
   macro avg     0.6157    0.8135    0.6813    172763
weighted avg     0.7948    0.7694    0.7758    172763
```

Resumo:

- **Acurácia ~ 76,94%** no conjunto de validação.
- Classe `tristeza` com desempenho mais alto.
- `ansiedade` e `estresse` com f1‑score menor (emoções mais sutis/difíceis).

---

## 🧪 5. Uso dos modelos (inferência)

### 5.1 EmotionPredictor

Arquivo: `nlp/inference/emotion_predictor.py`  
Classe principal: `EmotionPredictor`

Uso básico em Python:

```python
from nlp.inference.emotion_predictor import EmotionPredictor

model = EmotionPredictor()

res = model.predict("estou me sentindo muito perdido com a minha vida")
print(res)
# {'emotion': 'tristeza', 'confidence': 0.365...}
```

Rodando o módulo diretamente:

```bash
python -m nlp.inference.emotion_predictor
```

Exemplo de saída real:

```text
Texto: estou me sentindo muito perdido com a minha vida
→ Emoção: tristeza | Confiança: 0.365

Texto: hoje foi um dia muito bom, estou feliz
→ Emoção: felicidade | Confiança: 0.989

Texto: estou muito ansioso com tudo que está acontecendo
→ Emoção: ansiedade | Confiança: 0.961

Texto: não aguento mais tanta pressão, estou no meu limite
→ Emoção: tristeza | Confiança: 0.793
```

---

### 5.2 CrisisDetector

Arquivo: `nlp/inference/crisis_detector.py`  
Classe principal: `CrisisDetector`

Uso básico:

```python
from nlp.inference.crisis_detector import CrisisDetector

detector = CrisisDetector()

res = detector.predict("não aguento mais viver, só penso em acabar com tudo")
print(res)
# {'is_crisis': True, 'label': 'suicide', 'confidence': 0.53...}
```

Rodando o módulo diretamente:

```bash
python -m nlp.inference.crisis_detector
```

Exemplo de saída real:

```text
Texto: não aguento mais viver, só penso em acabar com tudo
→ is_crisis: True | label: suicide | confiança: 0.532

Texto: às vezes a vida é difícil, mas eu sigo tentando melhorar
→ is_crisis: False | label: non-suicide | confiança: 0.599
```

---

## 🌐 6. Exemplo de API com FastAPI

Abaixo um exemplo simples de como integrar os modelos em uma API FastAPI.

### 6.1 Estrutura sugerida

```bash
app/
├── main.py
└── schemas.py
```

### 6.2 `app/schemas.py`

```python
from pydantic import BaseModel

class EmotionRequest(BaseModel):
    text: str

class EmotionResponse(BaseModel):
    emocao: str
    confianca_emocao: float
    risco_crise: bool
    confianca_crise: float
    mensagem_para_usuario: str
```

### 6.3 `app/main.py`

```python
from fastapi import FastAPI
from app.schemas import EmotionRequest, EmotionResponse
from nlp.inference.emotion_predictor import EmotionPredictor
from nlp.inference.crisis_detector import CrisisDetector

app = FastAPI(title="MindCare NLP API")

emotion_model = EmotionPredictor()
crisis_model = CrisisDetector()

EMOTION_CONF_THRESHOLD = 0.5
CRISIS_CONF_THRESHOLD = 0.6  # ajuste conforme necessidade


def analisar_texto_usuario(texto: str) -> EmotionResponse:
    crise = crisis_model.predict(texto)
    emocao = emotion_model.predict(texto)

    # 1) Prioridade máxima: crise / suicídio
    if crise["is_crisis"] and crise["confidence"] >= CRISIS_CONF_THRESHOLD:
        mensagem = (
            "O que você está sentindo é muito sério e importante.\n\n"
            "Se você estiver em perigo imediato, por favor procure ajuda agora.\n"
            "No Brasil, você pode ligar gratuitamente para o **CVV – 188** (24 horas por dia) "
            "ou acessar o chat no site do CVV.\n\n"
            "Também é muito importante buscar ajuda de um psicólogo ou psiquiatra de confiança. "
            "Você não precisa passar por isso sozinho(a)."
        )
        return EmotionResponse(
            emocao=emocao["emotion"],
            confianca_emocao=emocao["confidence"],
            risco_crise=True,
            confianca_crise=crise["confidence"],
            mensagem_para_usuario=mensagem
        )

    # 2) Se não for crise, analisar emoção com limiar
    if emocao["confidence"] >= EMOTION_CONF_THRESHOLD:
        if emocao["emotion"] == "felicidade":
            mensagem = (
                "Fico feliz em saber que você está se sentindo bem. "
                "Se quiser, pode me contar mais sobre isso 🙂"
            )
        elif emocao["emotion"] == "tristeza":
            mensagem = (
                "Sinto muito que você esteja se sentindo triste. "
                "O que aconteceu? Se quiser, posso te ouvir."
            )
        elif emocao["emotion"] == "ansiedade":
            mensagem = (
                "Percebo sinais de ansiedade no que você compartilhou. "
                "Quer me contar um pouco mais sobre o que está te deixando assim?"
            )
        elif emocao["emotion"] == "estresse":
            mensagem = (
                "Parece que você está sob bastante estresse. "
                "Você gostaria de desabafar um pouco sobre o que está acontecendo?"
            )
        else:
            mensagem = (
                "Obrigado por compartilhar como você está se sentindo. "
                "Estou aqui para te ouvir."
            )
    else:
        # 3) Fallback quando a emoção não é clara
        mensagem = (
            "Obrigado por compartilhar como você está se sentindo. "
            "Talvez eu ainda não tenha entendido perfeitamente, mas estou aqui para te ouvir. "
            "Se quiser, pode me contar um pouco mais."
        )

    return EmotionResponse(
        emocao=emocao["emotion"],
        confianca_emocao=emocao["confidence"],
        risco_crise=False,
        confianca_crise=crise["confidence"],
        mensagem_para_usuario=mensagem
    )


@app.post("/api/v1/emotions/classify", response_model=EmotionResponse)
def classify_emotion(payload: EmotionRequest):
    return analisar_texto_usuario(payload.text)
```

### 6.4 Rodando a API

Na raiz do projeto:

```bash
uvicorn app.main:app --reload
```

Endpoint principal:

- `POST /api/v1/emotions/classify`

Exemplo de requisição JSON:

```json
{
  "text": "estou me sentindo muito perdido com a vida"
}
```

Exemplo de resposta (possível):

```json
{
  "emocao": "tristeza",
  "confianca_emocao": 0.72,
  "risco_crise": false,
  "confianca_crise": 0.31,
  "mensagem_para_usuario": "Sinto muito que você esteja se sentindo triste. O que aconteceu? Se quiser, posso te ouvir."
}
```

---

## 🔁 7. Passo a passo resumido para rodar tudo

```bash
# 0) Ativar ambiente virtual
venv\Scripts\activate      # Windows
# ou
source venv/bin/activate     # Linux/Mac

# 1) Instalar dependências
pip install -r requirements.txt

# 2) Montar datasets de emoções
python -m nlp.preprocessing.build_emotion_dataset

# 3) Limpar / truncar dataset de crise
python -m nlp.preprocessing.clean_suicide_pt_br

# 4) Treinar modelo de emoções
python -m nlp.training.train_emotion_baseline

# 5) Treinar modelo de crise
python -m nlp.training.train_crisis_baseline

# 6) Testar modelos isoladamente
python -m nlp.inference.emotion_predictor
python -m nlp.inference.crisis_detector

# 7) (Opcional) Rodar API FastAPI
uvicorn app.main:app --reload
```

---

## 🚀 8. Roadmap / melhorias futuras

Algumas possíveis evoluções do projeto:

1. **Substituir TF‑IDF + LR por BERTimbau / Transformers**
   - Usar `neuralmind/bert-base-portuguese-cased` (ou similar).
   - Fine‑tuning com os mesmos datasets pré‑processados.
   - Comparar métricas com o baseline atual.

2. **Unificar os modelos**
   - Criar um único modelo que já tenha uma classe adicional `risco_crise`.
   - Ex.: classes: `felicidade`, `tristeza`, `ansiedade`, `estresse`, `risco_crise`.

3. **Explicar decisões do modelo**
   - Usar LIME ou SHAP para gerar explicações das palavras que mais influenciaram.
   - Útil para documentação acadêmica e discussão ética.

4. **Camada de regras adicionais para crise**
   - Além do modelo, manter um dicionário de expressões em PT‑BR que sempre disparam alerta, independentemente da probabilidade.

5. **Monitorar uso em produção**
   - Coletar métricas de uso (anonimizadas).
   - Ajustar limiares de confiança com base em feedback real.

---

## 🧠 9. Notas sobre migração para BERTimbau

Quando for evoluir para Transformers (ex.: BERTimbau):

1. Manter o mesmo pipeline de pré‑processamento (`nlp/data/processed`).
2. Criar novos scripts em `nlp/training/`, por exemplo:
   - `train_emotion_bert.py`
   - `train_crisis_bert.py`
3. Usar `transformers` + `Trainer`/`Accelerate` com:
   - `AutoTokenizer.from_pretrained("neuralmind/bert-base-portuguese-cased")`
   - `AutoModelForSequenceClassification` com número de classes adequado.
4. Aproveitar GPU (quando disponível), mas manter fallback em CPU com o baseline TF‑IDF + LR.
5. Ajustar a parte de inferência em `nlp/inference/`, criando:
   - `emotion_predictor_bert.py`
   - `crisis_detector_bert.py`

O baseline atual já organiza bem os dados e a estrutura, facilitando essa migração.

---

## ✅ 10. Conclusão

Este projeto entrega:

- Um pipeline completo de **classificação de emoções em PT‑BR**.
- Um modelo dedicado para **detecção de risco de crise / ideação suicida**, com:
  - acurácia ~ 85,68% no conjunto de validação.
- Uma lógica clara de fallback para:
  - mensagens de apoio,
  - recomendação de contato com o **CVV – 188**,
  - incentivo à busca de **ajuda profissional**.

Tudo isso rodando em **CPU**, com código organizado para fácil integração em uma API (FastAPI) consumida por um chatbot de saúde mental (MindCare).

> Qualquer uso em ambiente real deve ser acompanhado por profissionais de saúde, e o sistema deve ser tratado como ferramenta complementar, nunca como substituto do cuidado humano.
