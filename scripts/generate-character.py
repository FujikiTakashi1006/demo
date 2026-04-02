#!/usr/bin/env python3
"""Generate character images for the welcome screen using Nano Banana 2 (Gemini 3.1 Flash Image Preview).

Usage:
    export GEMINI_API_KEY="your-api-key"
    python scripts/generate-character.py

Generates 4 character variants into src/assets/generated/
"""

import os
import sys
import base64
from pathlib import Path

try:
    from google import genai
except ImportError:
    print("Error: google-genai package not installed. Run: pip install google-genai")
    sys.exit(1)

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable not set")
    sys.exit(1)

OUTPUT_DIR = Path(__file__).parent.parent / "src" / "assets" / "generated"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Theme: clean white body + soft orange accent (#ea580c) on white bg
# Character should feel: cute, kawaii, friendly, construction-adjacent, approachable
PROMPTS = [
    "A super cute, kawaii AI robot character on a pure white background. Smooth rounded white body with soft safety orange (#ea580c) accents on cheeks and a tiny orange construction hard hat. Chibi proportions, big sparkly eyes, happy smile. Simple, clean, minimal. No text. Adorable mascot illustration for a mobile app. Soft shadow beneath.",
    "An adorable white robot assistant on a pure white background. Pill-shaped glossy white body with small orange (#ea580c) details — tiny hard hat, orange blush marks on cheeks, orange feet. One stubby arm waving. Huge round kawaii eyes, cheerful expression. Clean flat illustration style. No text. Centered.",
    "A charming tiny white robot on pure white background. Rounded marshmallow-shaped white body. Cute little orange construction helmet, orange dot cheeks, tiny orange bow tie. Floating slightly with a soft shadow. Big adorable eyes, gentle happy face. Clean minimal 3D render, kawaii style. No text.",
    "A lovable small AI bot character on pure white background. Egg-shaped pure white glossy body with a bright orange (#ea580c) hard hat and orange heart on its chest. Stubby little arms and feet. Huge expressive round eyes with sparkle highlights. Kawaii, minimal, clean, warm. No text. Mobile-first centered composition.",
]

client = genai.Client(api_key=API_KEY)

for i, prompt in enumerate(PROMPTS, 1):
    print(f"Generating character {i}/4...")
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            contents=prompt,
        )

        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                raw = part.inline_data.data
                # SDK may return base64 str or raw bytes depending on version
                if isinstance(raw, str):
                    image_data = base64.b64decode(raw)
                else:
                    image_data = bytes(raw)
                output_path = OUTPUT_DIR / f"character-{i}.png"
                output_path.write_bytes(image_data)
                print(f"  Saved: {output_path}")
                break
        else:
            print(f"  Warning: No image in response for variant {i}")

    except Exception as e:
        print(f"  Error generating variant {i}: {e}")

print(f"\nDone! Check {OUTPUT_DIR}/ for generated images.")
print("Pick the best one, copy it to src/assets/character.png, and update WelcomePage.tsx.")
