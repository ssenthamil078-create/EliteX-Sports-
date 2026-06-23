import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_multilingual_response(message, target_language):
    prompt = f"""
You are a multilingual sports assistant.

Translate and adapt the following sports guidance into {target_language}.

Original message:
{message}

Rules:
- Keep the meaning accurate.
- Use simple language.
- Make it understandable for young and rural athletes.
- Keep sports terms clear.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=700
    )

    return response.choices[0].message.content