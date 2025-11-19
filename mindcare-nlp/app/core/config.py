from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "MindCare NLP API"
    API_V1_STR: str = "/api/v1"

    # Variáveis vindas do .env (usando os mesmos nomes)
    API_ENV: str = "dev"
    MODEL_PATH: str = "nlp/models/bertimbau"

    # Thresholds vindos do .env
    CONFIDENCE_THRESHOLD: float = 0.5
    CRISIS_CONFIDENCE_THRESHOLD: float = 0.4

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",       # ignora qualquer variável extra no .env
        case_sensitive=False, # API_ENV == api_env, etc.
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
