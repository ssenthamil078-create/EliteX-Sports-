import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_ai_notification(athlete_context, notification_context):
    prompt = f"""
You are an AI notification assistant for a sports opportunity platform.

Create a short, personalized notification for this athlete.

Athlete Profile:
{athlete_context}

Notification Context:
{notification_context}

Return:
1. Title
2. Message
3. Priority: Low / Medium / High

Keep it clear, motivating, and useful.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.6,
        max_tokens=300
    )

    return response.choices[0].message.content