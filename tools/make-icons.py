"""Пересобрать PNG-иконки из assets/img/icon-512.png.

Порядок:
  1) отрендерить icon.svg в icon-512.png (headless Chrome, см. README);
  2) запустить этот скрипт — он сделает 192/180 и маленький превью.

Запуск: python tools/make-icons.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
SOURCE = IMG / "icon-512.png"


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Нет исходника: {SOURCE}")

    base = Image.open(SOURCE).convert("RGBA")

    for size in (192, 180):
        name = "icon-192.png" if size == 192 else "apple-touch-icon.png"
        base.resize((size, size), Image.LANCZOS).save(IMG / name, optimize=True)
        print(f"готово: {name} ({size}px)")


if __name__ == "__main__":
    main()
