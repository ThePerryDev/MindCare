from __future__ import annotations
import re
from typing import Dict, Set, List

# ajuste os nomes conforme houver no seu .txt
EMO_NAME_NORMALIZE = {
    "ADMIRAÇÃO":"admiração","ADMIRACAO":"admiração",
    "RAIVA":"raiva","TRISTEZA":"tristeza","MEDO":"medo","VERGONHA":"vergonha",
    "NOJO":"nojo","SURPRESA":"surpresa","ALEGRIA":"alegria","AMOR":"amor",
    # adicione outras cabeças do arquivo conforme necessário…
}

def split_terms(s: str) -> List[str]:
    chunks = re.split(r"[;,]+", s)
    out = []
    for c in chunks:
        t = c.strip().lower()
        t = re.sub(r"^[^\wáâãéêíóôõúç]+|[^\wáâãéêíóôõúç]+$", "", t, flags=re.UNICODE)
        if t:
            out.append(t)
    return out

def load_lexicon(path: str) -> Dict[str, Set[str]]:
    emo2terms: Dict[str, Set[str]] = {}
    header_re = re.compile(r"^\s*([A-ZÁÂÃÉÊÍÓÔÕÚÇ]+)\s*:", re.UNICODE)
    last_key = None

    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            m = header_re.match(line)
            if m:
                raw = m.group(1)
                emotion = EMO_NAME_NORMALIZE.get(raw, raw.lower())
                rest = line[line.find(":")+1:]
                terms = split_terms(rest)
                emo2terms.setdefault(emotion, set()).update(terms)
                last_key = emotion
            else:
                terms = split_terms(line)
                if terms and last_key:
                    emo2terms[last_key].update(terms)

    # limpeza
    for k in list(emo2terms.keys()):
        emo2terms[k] = {t for t in emo2terms[k] if t and len(t) >= 2}
        if not emo2terms[k]:
            emo2terms.pop(k, None)
    return emo2terms
