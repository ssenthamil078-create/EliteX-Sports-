# api/index.py — Vercel serverless entry point
# Vercel expects a WSGI/ASGI app named `app` (or an HTTP handler) in this file.
# We import the FastAPI app from the app package and expose it here.

import sys
import os

# Ensure the project root is on the path so `app` package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app  # noqa: F401 — Vercel picks up `app` automatically
