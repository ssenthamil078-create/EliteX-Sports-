import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_ai_training_plan(athlete_context, analytics_context):
    prompt = f"""
You are an expert sports coach and performance planner.

Create a personalized 7-day training plan.

Athlete Profile:
{athlete_context}

Performance Analytics:
{analytics_context}

Return in this structure:
1. Training Goal
2. 7-Day Training Schedule
3. Daily Drills
4. Recovery Plan
5. Injury Prevention Advice
6. Coach Notes

Make it practical, safe, sport-specific, and beginner-friendly.
Avoid medical diagnosis.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=900
    )

    return response.choices[0].message.content