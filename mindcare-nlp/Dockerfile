# 1. Imagem base
FROM python:3.11-slim

# 2. Variáveis de ambiente (opcional, mas útil)
ENV PYTHONUNBUFFERED=1

# 3. Define o diretório de trabalho
WORKDIR /app

# 4. Copia e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copia o restante do código da aplicação
# Isso inclui a pasta 'app' e a pasta 'nlp' com os modelos
COPY . .

# 6. Expõe a porta que o FastAPI/Uvicorn irá usar
EXPOSE 8000

# 7. Comando de inicialização do servidor
# O arquivo principal é app/main.py, e o objeto FastAPI é 'app'
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]