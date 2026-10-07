# /// script
# requires-python = ">=3.11,<3.14"
# dependencies = ["sentence-transformers>=5", "transformers", "numpy", "pyyaml", "pillow", "torchvision"]
# ///
"""Embed every note with EmbeddingGemma 2 and write each note's nearest neighbours.

    uv run quartz/cli/embed-notes.py

Output: data/note-neighbours.json, read at build time by ewan-neighbourhood.
Vectors are cached by content hash in .quartz-cache/, so only changed notes are
embedded again. Notes are keyed by their path relative to content/.
"""
import hashlib, json, re, sys
from pathlib import Path

import numpy as np
import yaml

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "content"
OUT = ROOT / "data" / "note-neighbours.json"
CACHE = ROOT / ".quartz-cache" / "embeddings.json"
MODEL = "google/embeddinggemma-2"
DIM = 256          # Matryoshka truncation; plenty for ~900 notes
TOP = 12           # neighbours kept per note
CHUNK = 3000       # characters per chunk
MAX_CHUNKS = 6     # long notes are covered by their first chunks
SKIP_DIRS = {"private", "templates", "scripts", "Attachments", "tags", "notebooks", "__marimo__", "__pycache__"}


def notes():
    for path in sorted(CONTENT.rglob("*.md")):
        rel = path.relative_to(CONTENT)
        if any(p.startswith(".") or p in SKIP_DIRS for p in rel.parts[:-1]):
            continue
        raw = path.read_text(encoding="utf8", errors="ignore")
        meta, body = {}, raw
        m = re.match(r"---\n(.*?)\n---\n?", raw, re.S)
        if m:
            try:
                meta = yaml.safe_load(m.group(1)) or {}
            except yaml.YAMLError:
                meta = {}
            body = raw[m.end():]
        if not isinstance(meta, dict) or meta.get("draft") is True:
            continue
        body = re.sub(r"```.*?```", " ", body, flags=re.S)          # code
        body = re.sub(r"<[^>]+>", " ", body)                        # html / script
        body = re.sub(r"!\[\[[^\]]*\]\]|!\[[^\]]*\]\([^)]*\)", " ", body)  # embeds
        body = re.sub(r"\[\[([^\]|]*\|)?([^\]]*)\]\]", r"\2", body)  # wikilinks keep their text
        body = re.sub(r"\s+", " ", body).strip()
        if len(body) < 80:
            continue
        title = str(meta.get("title") or path.stem)
        yield str(rel), title, body


def chunks(title, body):
    pieces = [body[i : i + CHUNK] for i in range(0, len(body), CHUNK)][:MAX_CHUNKS]
    return [f"title: {title} | text: {p}" for p in pieces]


def main():
    from sentence_transformers import SentenceTransformer

    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    items = list(notes())
    todo = {}
    keys = {}
    for rel, title, body in items:
        key = hashlib.sha256(f"{MODEL}|{DIM}|{title}|{body[: CHUNK * MAX_CHUNKS]}".encode()).hexdigest()
        keys[rel] = key
        if key not in cache:
            todo[key] = chunks(title, body)
    print(f"{len(items)} notes, {len(todo)} to embed", file=sys.stderr)
    if todo:
        model = SentenceTransformer(MODEL, truncate_dim=DIM)
        flat = [(k, t) for k, ts in todo.items() for t in ts]
        vecs = model.encode([t for _, t in flat], batch_size=8, normalize_embeddings=True, show_progress_bar=True)
        sums = {}
        for (k, _), v in zip(flat, vecs):
            sums.setdefault(k, []).append(v)
        for k, vs in sums.items():
            mean = np.mean(vs, axis=0)
            cache[k] = (mean / np.linalg.norm(mean)).round(5).tolist()
        CACHE.parent.mkdir(exist_ok=True)
        CACHE.write_text(json.dumps(cache))

    rels = [rel for rel, _, _ in items]
    matrix = np.array([cache[keys[r]] for r in rels], dtype=np.float32)
    sim = matrix @ matrix.T
    np.fill_diagonal(sim, -1)
    result = {}
    for i, rel in enumerate(rels):
        top = np.argsort(-sim[i])[:TOP]
        result[rel] = [[rels[j], round(float(sim[i, j]), 4)] for j in top]
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps({"model": MODEL, "dim": DIM, "notes": result}, separators=(",", ":"), ensure_ascii=False))
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)", file=sys.stderr)


main()
