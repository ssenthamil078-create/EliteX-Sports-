import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_ai_chat_response(message, athlete_context=None):
    context = athlete_context or "No athlete profile context available."

    prompt = f"""
You are an AI Sports Assistant for an athlete development platform.

Athlete context:
{context}

User question:
{message}

Give helpful, safe, practical sports guidance.
Avoid medical diagnosis. For serious pain or injury, recommend consulting a qualified coach, physiotherapist, or doctor.
Keep the answer clear and athlete-friendly.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=700
    )

    return response.choices[0].message.content