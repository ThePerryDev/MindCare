# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.v1.emotions import router as emotions_router

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description=(
        "API de classificação de emoções e detecção de crise (suicídio) "
        "para o chatbot MindCare."
    ),
)

# CORS – ajuste para os domínios do seu front (React, RN, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em produção: colocar domínio(s) do front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta as rotas da v1
app.include_router(emotions_router, prefix=f"{settings.API_V1_STR}")


@app.get("/")
def root():
    return {"message": "MindCare NLP API is running"}
