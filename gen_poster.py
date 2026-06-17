#!/usr/bin/env python3
"""
gen_poster.py — one-off tool to regenerate shelf-it/poster.png.

User feedback: the prior poster was "too faithful to actual gameplay"
(literally a screenshot of the empty store with a wordmark slapped on top).
This script generates a punchy comic illustration of the diverse customer
crowd at rush hour, then bakes the SHELF · IT wordmark cleanly via PIL
(yellow + red drop-shadow, slight tilt, matching the in-game brand).

Run:
    python3 gen_poster.py
"""
import json
import os
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ─── 1. Gen-image API (transit, primary) ─────────────────────────────────────
API_URL = "https://chat.aiwaves.tech/aigram/api/gen-image"
HEADERS = {
    "Content-Type": "application/json",
    "Origin":  "https://aigram.app",
    "Referer": "https://aigram.app/",
    "User-Agent": "Mozilla/5.0",
}


def gen_image(prompt: str, timeout: int = 360, retries: int = 3) -> str:
    payload = {"prompt": prompt}
    data = json.dumps(payload).encode()
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(API_URL, data=data, method="POST", headers=HEADERS)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                body = json.loads(r.read())
            url = body.get("url")
            if not url:
                raise RuntimeError(f"gen response had no url: {body}")
            return url
        except urllib.error.HTTPError as e:
            err_body = ""
            try: err_body = e.read().decode("utf-8", errors="replace")[:200]
            except Exception: pass
            last_err = RuntimeError(f"HTTP {e.code} (attempt {attempt+1}/{retries}): {err_body}")
            print(f"   retry {attempt+1}/{retries} after HTTP {e.code}", flush=True)
        except Exception as e:
            last_err = e
            print(f"   retry {attempt+1}/{retries} after {e}", flush=True)
        time.sleep(8 * (attempt + 1))
    raise last_err or RuntimeError("gen failed")


def download_image(url: str, out_path: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    ext = os.path.splitext(url.split("?")[0])[1].lower()
    if ext and ext != ".png":
        tmp = out_path.with_suffix(out_path.suffix + ext)
        tmp.write_bytes(data)
        subprocess.run(["sips", "-s", "format", "png", str(tmp), "--out", str(out_path)],
                       check=True, capture_output=True)
        tmp.unlink()
    else:
        out_path.write_bytes(data)


# ─── 2. Brand wordmark overlay (PIL) ─────────────────────────────────────────
YELLOW = (255, 206, 46)     # --yellow #ffce2e
RED    = (255, 68,  56)     # --red    #ff4438
TEAL   = (63,  182, 172)    # --teal   #3fb6ac
INK    = (40,  35,  30)


def find_font(size: int) -> ImageFont.FreeTypeFont:
    """Try Bangers (Google Font, if downloaded locally) first, then Impact,
    then any bold sans available on macOS."""
    candidates = [
        # If user has Bangers installed via Google Fonts download:
        os.path.expanduser("~/Library/Fonts/Bangers-Regular.ttf"),
        "/System/Library/Fonts/Supplemental/Impact.ttf",
        "/Library/Fonts/Impact.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


def bake_wordmark(art_path: Path, out_path: Path) -> None:
    """Open the generated illustration and burn the SHELF · IT brandmark on top.
    Matches the in-game .brandmark style: yellow fill + hard red drop-shadow,
    slight CCW tilt, top-center placement, ~16% of canvas height."""
    base = Image.open(art_path).convert("RGBA")
    W, H = base.size
    # Choose font size relative to canvas height for crisp readability.
    size = int(H * 0.16)
    font = find_font(size)
    text = "SHELF · IT"

    # Measure on a scratch draw context.
    scratch = Image.new("RGBA", (W, H))
    sd = ImageDraw.Draw(scratch)
    bbox = sd.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]

    # Mask any AI-baked signage/text behind the wordmark with a STRONG
    # dark gradient band across the upper portion. The transit gen-image
    # model frequently ignores "NO TEXT" and paints gibberish English
    # words on shop signs — this fully covers them.
    band_h = int(H * 0.32)
    mask_band = Image.new("RGBA", (W, band_h), (0, 0, 0, 0))
    md = ImageDraw.Draw(mask_band)
    for y in range(band_h):
        # Sharper falloff — opaque top half, soft fade to clear bottom.
        u = y / band_h
        if u < 0.55:
            alpha = 235          # near-opaque cover for the top 55%
        else:
            t = 1.0 - (u - 0.55) / 0.45
            alpha = int(235 * (t ** 1.2))
        md.line([(0, y), (W, y)], fill=(20, 18, 14, alpha))
    base.alpha_composite(mask_band, (0, 0))

    # Draw the wordmark on a transparent layer, rotate, then composite.
    pad_x, pad_y = int(size * 0.30), int(size * 0.30)
    shadow_off_x, shadow_off_y = int(size * 0.075), int(size * 0.095)
    layer_w = tw + pad_x * 2 + shadow_off_x
    layer_h = th + pad_y * 2 + shadow_off_y
    layer = Image.new("RGBA", (layer_w, layer_h), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    origin = (pad_x - bbox[0], pad_y - bbox[1])
    ld.text((origin[0] + shadow_off_x, origin[1] + shadow_off_y),
            text, font=font, fill=(*RED, 255))
    ld.text(origin, text, font=font, fill=(*YELLOW, 255))

    layer = layer.rotate(3.0, resample=Image.BICUBIC, expand=True)

    px = (W - layer.width) // 2
    py = int(H * 0.04)
    base.alpha_composite(layer, (px, py))
    base.convert("RGB").save(out_path, "PNG", optimize=True)


# ─── 3. Main ────────────────────────────────────────────────────────────────
PROMPT = (
    "Vibrant comic illustration of a CHAOTIC convenience store rush hour, "
    "front 3/4 isometric view. CENTER FOREGROUND: a colorful lineup of "
    "chunky cartoon shoppers at the counter — a fat NYPD cop holding a "
    "pink sprinkled donut with mirrored aviator shades, a horned Viking "
    "warrior with a bottle of mead and a battle axe, a pale gothic woman "
    "with long flowing black hair clutching a cold soda, a punk with a "
    "tall teal mohawk holding a snack, a Combat Mech robot scanning a "
    "protein bar. BACKGROUND: brightly lit packed shelves of snacks, "
    "bottles, cans, fruits — saturated reds, greens, blues, oranges. "
    "An overwhelmed shopkeeper in a TEAL apron behind the till. "
    "Crossy Road voxel-character style mixed with bold comic linework, "
    "warm cream walls, neon shop signs glowing in the background, "
    "dynamic motion lines, energetic composition. Saturated palette "
    "anchored on teal #3fb6ac and warm cream. Square format. "
    "Fills the entire square frame edge to edge, full-bleed. "
    "ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO ENGLISH WRITING, "
    "NO LABELS, NO LOGOS, NO READABLE SIGNAGE, no shop sign with letters, "
    "no price tags with numbers, no brand names on packaging. "
    "Products are shown as abstract colored boxes and bottles WITHOUT any text. "
    "NO BORDER, NO PANEL, NO LETTERBOX, NO MATTE."
)


def main() -> None:
    here = Path(__file__).resolve().parent
    art = here / "_poster_raw.png"
    final = here / "poster.png"

    print("[1/3] gen-image (txt2img, ~3-8s)…", flush=True)
    url = gen_image(PROMPT)
    print(f"      url={url}", flush=True)

    print("[2/3] download + convert to PNG…", flush=True)
    download_image(url, art)
    print(f"      saved {art} ({art.stat().st_size:,} bytes)", flush=True)

    print("[3/3] bake SHELF · IT wordmark + save final…", flush=True)
    bake_wordmark(art, final)
    print(f"      saved {final} ({final.stat().st_size:,} bytes)", flush=True)

    # Keep the raw illustration alongside in case we want to re-bake the
    # title later without re-generating.
    print("done.", flush=True)


if __name__ == "__main__":
    main()
