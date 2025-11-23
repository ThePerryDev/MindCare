# nlp/inference/predictor.py

import os
from typing import Dict, Any

from .emotion_predictor import EmotionPredictor
from .crisis_detector import CrisisDetector

# Thresholds padrão (pode vir de config depois se quiser)
EMOTION_CONF_THRESHOLD = 0.5
CRISIS_CONF_THRESHOLD = 0.6


class MindCareNLPPredictor:
    """
    Fachada para os modelos de:
      - emoções (felicidade, tristeza, ansiedade, estresse)
      - crise (suicide vs non-suicide)
    """

    def __init__(
        self,
        emotion_conf_threshold: float = EMOTION_CONF_THRESHOLD,
        crisis_conf_threshold: float = CRISIS_CONF_THRESHOLD,
    ):
        self.emotion_model = EmotionPredictor()
        self.crisis_model = CrisisDetector()
        self.emotion_conf_threshold = emotion_conf_threshold
        self.crisis_conf_threshold = crisis_conf_threshold

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Retorna um dicionário com:
          - emocao
          - confianca_emocao
          - risco_crise
          - confianca_crise
          - mensagem_para_usuario (texto pronto para o chatbot mostrar)
        """

        crise = self.crisis_model.predict(text)
        emocao = self.emotion_model.predict(text)

        # 1) PRIORIDADE: crise / suicídio
        if crise["is_crisis"] and crise["confidence"] >= self.crisis_conf_threshold:
            mensagem = (
                "O que você está sentindo é muito sério e importante.\n\n"
                "Se você estiver em perigo imediato, por favor procure ajuda agora.\n"
                "No Brasil, você pode ligar gratuitamente para o **CVV – 188** (24 horas por dia) "
                "ou acessar o chat no site do CVV.\n\n"
                "Também é muito importante buscar ajuda de um psicólogo ou psiquiatra de confiança. "
                "Você não precisa passar por isso sozinho(a)."
            )
            return {
                "emocao": emocao["emotion"],
                "confianca_emocao": emocao["confidence"],
                "risco_crise": True,
                "confianca_crise": crise["confidence"],
                "mensagem_para_usuario": mensagem,
            }

        # 2) NÃO é crise: usar emoção com limiar
        if emocao["confidence"] >= self.emotion_conf_threshold:
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
                "Compreendo. Obrigado por confiar em mim e compartilhar isso.\n"
                "Se puder, me conte um pouco mais sobre como você está se sentindo, "
                "assim posso tentar entender melhor e pensar em como te apoiar."
            )

        return {
            "emocao": emocao["emotion"],
            "confianca_emocao": emocao["confidence"],
            "risco_crise": False,
            "confianca_crise": crise["confidence"],
            "mensagem_para_usuario": mensagem,
        }


# Uso rápido standalone
if __name__ == "__main__":
    predictor = MindCareNLPPredictor()
    exemplo = "estou me sentindo muito perdido com a vida"
    print(predictor.analyze(exemplo))
