# 🧠 MindCare ML

Projeto de **Processamento de Linguagem Natural (PLN)** para classificar emoções em textos curtos relacionados à **saúde mental** (ansiedade, tristeza, depressão, alegria, etc.).  

Este módulo em **Python** será consumido por um backend em **TypeScript** e frontend em **React Native**.  

---

## 📂 Estrutura de pastas

```
mindcare-ml/
├─ data/               # datasets (não versionados)
│  ├─ raw/             # originais
│  └─ processed/       # prontos para treino
├─ models/             # modelos treinados (ignorado no git)
├─ src/                # código fonte
│  ├─ train_sklearn.py # script de treino baseline
│  └─ service_api.py   # API FastAPI para inferência
├─ tests/              # testes automatizados
├─ requirements.txt
├─ README.md
└─ .gitignore
```

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/mindcare-ml.git
cd mindcare-ml
```

### 2. Criar ambiente virtual
```bash
python -m venv .venv
# Ativar:
# Linux/Mac
source .venv/bin/activate
# Windows PowerShell
.venv\Scripts\activate
```

### 3. Instalar dependências
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Preparar dataset
Crie `data/processed/mindcare_train.csv` no formato:

```csv
text,labels
"estou muito ansioso","['ansiedade']"
"me sinto triste e sem energia","['tristeza','depressão']"
```

### 5. Treinar modelo baseline
```bash
python src/train_sklearn.py
```
➡️ Isso vai gerar `models/sklearn/model.pkl` e `mlb.pkl`.

### 6. Subir a API
```bash
uvicorn src.service_api:app --reload --port 8000
```

Acesse a documentação em: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  

---

## 📡 Endpoints principais

- `GET /health` → Verifica se o serviço está ativo.  
- `GET /labels` → Retorna a lista de emoções suportadas.  
- `POST /predict` → Recebe `{ "text": "..." }` e retorna rótulos + sugestões.  

Exemplo:
```bash
curl -X POST http://127.0.0.1:8000/predict   -H "Content-Type: application/json"   -d '{"text":"estou ansioso com a entrevista"}'
```

---

## ⚠️ Nota importante
Este projeto **não substitui atendimento profissional**.  
Em situações de crise ou risco de vida, no Brasil ligue **188 (CVV)** para apoio emocional 24h ou procure imediatamente atendimento médico/psicológico especializado.  

---
