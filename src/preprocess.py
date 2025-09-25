\
from __future__ import annotations
import re
from typing import List
from unidecode import unidecode

URL_RE = re.compile(r"https?://\S+|www\.\S+", re.IGNORECASE)
USER_RE = re.compile(r"@\w+")
HASH_RE = re.compile(r"#\w+")
SPACE_RE = re.compile(r"\s+")

def clean_text(text: str) -> str:
    """Normaliza texto PT-BR para vetorizar melhor."""
    if not isinstance(text, str):
        return ""
    t = text.strip().lower()
    t = unidecode(t)                   # remove acentos
    t = URL_RE.sub(" ", t)
    t = USER_RE.sub(" ", t)
    t = HASH_RE.sub(" ", t)
    t = re.sub(r"[^\w\s!?.,;:()-]", " ", t)  # remove emojis e símbolos estranhos
    t = SPACE_RE.sub(" ", t).strip()
    return t

def batch_clean(texts: List[str]) -> List[str]:
    return [clean_text(t) for t in texts]
