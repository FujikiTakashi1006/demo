#!/usr/bin/env python3
"""Generate pose variants of the mascot character using a reference image.

Uses character-3.png as the reference and asks Gemini to generate
the same character in different poses.

Usage:
    export GEMINI_API_KEY="your-api-key"
    python scripts/generate-poses.py
"""

import os
import sys
import base64
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai package not installed. Run: pip install google-genai")
    sys.exit(1)

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent.parent
REF_IMAGE = SCRIPT_DIR / "src" / "assets" / "generated" / "character-3.png"
OUTPUT_DIR = SCRIPT_DIR / "src" / "assets" / "generated" / "poses"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

if not REF_IMAGE.exists():
    print(f"Error: Reference image not found: {REF_IMAGE}")
    sys.exit(1)

# Load reference image
ref_bytes = REF_IMAGE.read_bytes()
ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/jpeg")

POSES = {
    "thinking": "Generate this exact same character in a thinking pose — one hand on chin, looking upward thoughtfully, slight head tilt. Keep the exact same design: white marshmallow body, orange construction helmet, orange bow tie, orange dot cheeks, same face, same proportions. Pure white background. No text.",
    "clipboard": "Generate this exact same character holding a small clipboard in both hands, looking at it with a cheerful focused expression. Keep the exact same design: white marshmallow body, orange construction helmet, orange bow tie, orange dot cheeks, same face, same proportions. Pure white background. No text.",
    "searching": "Generate this exact same character looking through a tiny magnifying glass, leaning forward curiously. Keep the exact same design: white marshmallow body, orange construction helmet, orange bow tie, orange dot cheeks, same face, same proportions. Pure white background. No text.",
    "celebrate": "Generate this exact same character with both arms raised in celebration, sparkling happy eyes. Keep the exact same design: white marshmallow body, orange construction helmet, orange bow tie, orange dot cheeks, same face, same proportions. Pure white background. No text.",
    "wave": "Generate this exact same character waving hello with one arm raised, friendly welcoming expression, floating slightly. Keep the exact same design: white marshmallow body, orange construction helmet, orange bow tie, orange dot cheeks, same face, same proportions. Pure white background. No text.",
}

client = genai.Client(api_key=API_KEY)

for i, (name, prompt) in enumerate(POSES.items(), 1):
    print(f"Generating pose {i}/{len(POSES)}: {name}...")
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            contents=[ref_part, prompt],
        )

        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                raw = part.inline_data.data
                if isinstance(raw, str):
                    image_data = base64.b64decode(raw)
                else:
                    image_data = bytes(raw)
                output_path = OUTPUT_DIR / f"{name}.jpg"
                output_path.write_bytes(image_data)
                print(f"  Saved: {output_path}")
                break
        else:
            print(f"  Warning: No image in response for {name}")

    except Exception as e:
        print(f"  Error generating {name}: {e}")

print(f"\nDone! Check {OUTPUT_DIR}/ for generated poses.")
