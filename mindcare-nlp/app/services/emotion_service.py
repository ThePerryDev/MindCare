# app/services/emotion_service.py

from app.core.config import get_settings
from nlp.inference.predictor import MindCareNLPPredictor

settings = get_settings()

# Instância única para reaproveitar o carregamento dos modelos
_predictor = MindCareNLPPredictor(
    emotion_conf_threshold=settings.CONFIDENCE_THRESHOLD,
    crisis_conf_threshold=settings.CRISIS_CONFIDENCE_THRESHOLD,
)


def analyze_text(text: str) -> dict:
    """
    Usa o MindCareNLPPredictor para analisar o texto e retorna
    um dicionário com:
      - emocao
      - confianca_emocao
      - risco_crise
      - confianca_crise
      - mensagem_para_usuario
    """
    return _predictor.analyze(text)
