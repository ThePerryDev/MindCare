from __future__ import annotations
import numpy as np
from scipy import sparse
from typing import Dict, Set, List
from sklearn.base import BaseEstimator, TransformerMixin
import re

_TOKEN_RE = re.compile(r"\w+[\w\-]*", flags=re.UNICODE)

class LexiconFeaturizer(BaseEstimator, TransformerMixin):
    """
    Para cada emoção do léxico, gera:
      - count  : nº de termos do grupo encontrados
      - ratio  : count / nº de tokens
      - any    : 0/1
    """
    def __init__(self, emotion_lexicon: Dict[str, Set[str]], sparse_output: bool = True):
        self.emotion_lexicon = emotion_lexicon
        self.sparse_output = sparse_output
        self._emotions: List[str] = sorted(list(emotion_lexicon.keys()))

    def fit(self, X, y=None): return self

    def transform(self, X):
        n = len(X)
        m = len(self._emotions) * 3
        data = np.zeros((n, m), dtype=np.float32)

        emo_terms = [self.emotion_lexicon[e] for e in self._emotions]
        for i, text in enumerate(X):
            text_l = (text or "").lower()
            tokens = _TOKEN_RE.findall(text_l)
            T = max(len(tokens), 1)
            tokset = set(tokens)
            for j, terms in enumerate(emo_terms):
                c = sum(1 for t in tokset if t in terms)
                data[i, j*3+0] = c
                data[i, j*3+1] = c / T
                data[i, j*3+2] = 1.0 if c > 0 else 0.0

        return sparse.csr_matrix(data) if self.sparse_output else data

    @property
    def emotions_(self) -> List[str]:
        return self._emotions
