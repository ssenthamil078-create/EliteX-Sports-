import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_performance_prediction(
    athlete_context,
    analytics_context
):
    prompt = f"""
You are an AI sports performance prediction system.

Analyze this athlete and predict future performance trends.

Athlete Profile:
{athlete_context}

Performance Analytics:
{analytics_context}

Return in this structure:

1. Current Performance Trend
2. Future Growth Prediction
3. Competition Readiness
4. Burnout Risk
5. Consistency Analysis
6. Performance Improvement Suggestions
7. Long-Term Potential

Make it professional and data-driven.
Avoid medical diagnosis.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=900
    )

    return response.choices[0].message.content