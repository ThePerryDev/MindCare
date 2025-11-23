# app/models/emotions.py

from pydantic import BaseModel


class EmotionRequest(BaseModel):
    text: str


class EmotionResponse(BaseModel):
    emocao: str
    confianca_emocao: float
    risco_crise: bool
    confianca_crise: float
    mensagem_para_usuario: str
