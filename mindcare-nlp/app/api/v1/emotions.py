# app/api/v1/emotions.py

from fastapi import APIRouter
from app.models.emotions import EmotionRequest, EmotionResponse
from app.services.emotion_service import analyze_text

router = APIRouter(prefix="/emotions", tags=["emotions"])


@router.post("/classify", response_model=EmotionResponse)
def classify_emotion(payload: EmotionRequest) -> EmotionResponse:
    """
    Recebe um texto em PT-BR e retorna:
    - emoção estimada
    - confiança da emoção
    - flag de risco de crise (suicide)
    - confiança da crise
    - mensagem amigável pronta para o chatbot mostrar
    """
    result = analyze_text(payload.text)

    return EmotionResponse(
        emocao=result["emocao"],
        confianca_emocao=result["confianca_emocao"],
        risco_crise=result["risco_crise"],
        confianca_crise=result["confianca_crise"],
        mensagem_para_usuario=result["mensagem_para_usuario"],
    )
