from __future__ import annotations
import argparse
from src.infer import SentimentInfer

def fmt_pct(x: float) -> str:
    try:
        return f"{100.0 * float(x):.1f}%"
    except Exception:
        return "-"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model_dir", default="models", help="Diretório com model.joblib")
    ap.add_argument("--threshold", type=float, default=0.55, help="Limiar de confiança para aconselhar")
    ap.add_argument("--show-probs", action="store_true", help="Exibe as probabilidades por classe (top 3)")
    args = ap.parse_args()

    bot = SentimentInfer(model_dir=args.model_dir, threshold=args.threshold)

    print("Chatbot de Sentimentos (PT-BR) — digite 'sair' para encerrar.\n")
    while True:
        try:
            user = input("Você: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nAté logo!")
            break

        if user.lower() in {"sair", "exit", "quit"}:
            print("Até logo!")
            break
        if not user:
            continue

        out = bot.respond(user)

        # Caso de alto risco detectado pelo infer
        if out.get("type") == "risk":
            print("\n⚠️  Caso de ALTO RISCO detectado:")
            print(out.get("message", ""))
            # Se desejar, você pode pausar a conversa aqui ou oferecer opções adicionais.
            print()  # linha em branco
            continue

        # Probabilidades (debug)
        if args.show_probs:
            probs = out.get("probs") or {}
            if isinstance(probs, dict) and probs:
                top = sorted(probs.items(), key=lambda kv: kv[1], reverse=True)[:3]
                tops = ", ".join([f"{k}: {fmt_pct(v)}" for k, v in top])
                print(f"\n(debug) Top probabilidades: {tops}")

        # Fluxo padrão
        if out.get("type") == "advice":
            conf = out.get("confidence", 0.0)
            msg = out.get("message", "")
            print(f"\nBot (confiança {conf:.2f}): {msg}")
            for i, s in enumerate(out.get("suggestions", [])[:3], 1):
                print(f"  {i}. {s}")
        else:
            conf = out.get("confidence", 0.0)
            msg = out.get("message", "Poderia me contar um pouco mais?")
            print(f"\nBot (confiança {conf:.2f}): {msg}")

        print()  # linha em branco

if __name__ == "__main__":
    main()
