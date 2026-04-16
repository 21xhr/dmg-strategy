#!/usr/bin/env python3

from __future__ import annotations

import argparse
import re
from pathlib import Path


SPEAKER_LINE_RE = re.compile(r"^(?:Unknown Speaker|Speaker \d+)\s+\d{1,2}:\d{2}\s*$")
FOOTER_RE = re.compile(r"^Transcribed by https://otter\.ai\s*$")
TIMESTAMP_ONLY_RE = re.compile(r"^\d{1,2}:\d{2}\s*$")


def normalize_text(raw_text: str, speaker_name: str) -> str:
    normalized_lines: list[str] = []
    paragraph_parts: list[str] = []

    def flush_paragraph() -> None:
        if not paragraph_parts:
            return
        paragraph = " ".join(part.strip() for part in paragraph_parts if part.strip())
        paragraph = re.sub(r"\s+", " ", paragraph).strip()
        if paragraph:
            normalized_lines.append(f"{speaker_name}: {paragraph}")
        paragraph_parts.clear()

    for line in raw_text.splitlines():
        stripped = line.strip()

        if not stripped:
            flush_paragraph()
            continue

        if FOOTER_RE.match(stripped):
            flush_paragraph()
            continue

        if stripped == "...updated code...":
            continue

        if SPEAKER_LINE_RE.match(stripped):
            flush_paragraph()
            continue

        if TIMESTAMP_ONLY_RE.match(stripped):
            flush_paragraph()
            continue

        paragraph_parts.append(stripped)

    flush_paragraph()
    return "\n\n".join(normalized_lines).strip() + "\n"


def normalize_file(file_path: Path, speaker_name: str) -> None:
    raw_text = file_path.read_text(encoding="utf-8")
    normalized_text = normalize_text(raw_text, speaker_name)
    file_path.write_text(normalized_text, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalize raw Otter transcript files.")
    parser.add_argument("files", nargs="+", help="Transcript files to normalize.")
    parser.add_argument(
        "--speaker",
        default="DG AAJD",
        help="Speaker label to use in the normalized transcript.",
    )
    args = parser.parse_args()

    for file_name in args.files:
        normalize_file(Path(file_name), args.speaker)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())