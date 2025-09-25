# Chatbot de Sentimentos (PT-BR)

Um chatbot simples em **Python** que interpreta sentimentos em frases do usuário, com **respostas empáticas**, sugestões de **exercícios de calma** e **detecção de risco** (ex.: ideação suicida).

---

## 🚀 Funcionalidades
- **Classificação de sentimentos** (`feliz`, `triste`, `raiva`, `medo`, `nojo`, `ansiedade`, `estresse`, `neutro`).
- **Sugestões personalizadas** de exercícios para cada sentimento (configuráveis em `resources/suggestions.json`).
- **Fallback empático** quando a confiança do modelo é baixa.
- **Detecção de risco** via regras (ex.: frases como “quero me matar”) → respostas de crise com contatos de emergência.
- **Treino customizável** em CSVs com cabeçalhos:
  - `Texto,Sentimento` (português), ou
  - `text,label` (inglês).

---

## 📂 Estrutura do Projeto

```
MindCare/
├── app.py                       # CLI para conversar com o bot
├── train_and_chat.py            # Script que valida ➜ treina ➜ inicia o chat
├── data/
│   └── tweets_ekman.csv         # Dataset em português (Texto,Sentimento)
├── models/                      # Modelos treinados (.joblib, labels, relatórios)
├── resources/
│   └── suggestions.json         # Sugestões e respostas de fallback/riscos
└── src/
    ├── preprocess.py            # Funções de limpeza de texto
    ├── train.py                 # Treino do modelo
    ├── infer.py                 # Inferência + regras de risco
    └── validate_dataset.py      # Valida dataset (colunas/classes)
```

---

## ⚙️ Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/mindcare-chatbot.git
   cd mindcare-chatbot
   ```

2. Crie e ative a venv:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1   # Windows PowerShell
   # source .venv/bin/activate  # Linux/Mac
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🧪 Como rodar

### Validar dataset
```bash
python -m src.validate_dataset data/tweets_ekman.csv
```

### Treinar modelo
```bash
python -m src.train --csv data/tweets_ekman.csv --model_dir models
```
> Se der erro de calibração, rode com `--no_calibrate`.

### Conversar com o chatbot
```bash
python app.py --model_dir models --threshold 0.55
```

### Tudo em um comando
```bash
python train_and_chat.py --csv data/tweets_ekman.csv --model_dir models --threshold 0.55
```

---

## 📌 Exemplo de uso

```text
Você: estou ansioso com o trabalho
Bot (confiança 0.72): Entendi **ansiedade**. Aqui vão algumas sugestões que podem ajudar agora:
  1. Exercício de respiração 4-7-8...
  2. Aterramento 5-4-3-2-1...
```

---

## 🔒 Detecção de Risco
Mensagens como **“quero me matar”** disparam o fluxo de crise:
```text
⚠️  Caso de ALTO RISCO detectado:
Sinto muito que você esteja se sentindo assim.
Se você ou alguém corre risco imediato, procure ajuda agora:
- Brasil: CVV 188 (24h) ou cvv.org.br
- Emergência: SAMU 192 / Polícia 190
```

---

## 🛠️ Customização
- Edite `resources/suggestions.json` para alterar sugestões, prompts de fallback ou mensagens de risco.
- Ajuste o parâmetro `--threshold` para calibrar a confiança mínima (padrão `0.55`).
- Substitua `data/tweets_ekman.csv` por outro dataset com cabeçalhos válidos.

---

## 📄 Licença
Projeto acadêmico/didático — use e adapte livremente 🚀
