"""Convert local source photos into web-ready WebP files."""

from __future__ import annotations

import argparse
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError as exc:
    raise SystemExit("Pillow is required. Run: python -m pip install Pillow") from exc


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "original-photos"
OUTPUT_DIR = ROOT / "docs" / "assets" / "photos"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".webp"}


def convert_photo(source: Path, target: Path, max_edge: int, quality: int) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGB")
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=quality, method=6)


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert original photos to optimized WebP files.")
    parser.add_argument("--max-edge", type=int, default=2000, help="Maximum width or height in pixels.")
    parser.add_argument("--quality", type=int, default=84, help="WebP quality from 1 to 100.")
    parser.add_argument("--force", action="store_true", help="Reconvert files even when output is current.")
    args = parser.parse_args()

    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = sorted(
        path for path in SOURCE_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    converted = 0
    skipped = 0
    failed = 0

    for source in sources:
        relative = source.relative_to(SOURCE_DIR).with_suffix(".webp")
        target = OUTPUT_DIR / relative

        if not args.force and target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
            print(f"SKIP    {relative}")
            skipped += 1
            continue

        try:
            convert_photo(source, target, args.max_edge, args.quality)
            print(f"CONVERT {source.relative_to(SOURCE_DIR)} -> {relative}")
            converted += 1
        except Exception as exc:  # Continue processing the rest of the folder.
            print(f"ERROR   {source.relative_to(SOURCE_DIR)}: {exc}")
            failed += 1

    print(f"\nDone: {converted} converted, {skipped} skipped, {failed} failed.")
    if not sources:
        print(f"Add source photos to: {SOURCE_DIR}")
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

