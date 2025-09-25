\
from __future__ import annotations
import argparse, subprocess, sys, os

def run(cmd: list[str]):
    print("\n$"," ".join(cmd))
    rc = subprocess.call(cmd)
    if rc != 0:
        raise SystemExit(rc)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", default="data/tweets_ekman.csv")
    ap.add_argument("--model_dir", default="models")
    ap.add_argument("--threshold", type=float, default=0.55)
    args = ap.parse_args()

    # 1) valida dataset
    run([sys.executable, "-m", "src.validate_dataset", args.csv])
    # 2) treina
    run([sys.executable, "-m", "src.train", "--csv", args.csv, "--model_dir", args.model_dir])
    # 3) inicia chat
    run([sys.executable, "app.py", "--model_dir", args.model_dir, "--threshold", str(args.threshold)])

if __name__ == "__main__":
    main()
