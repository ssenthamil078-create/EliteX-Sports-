import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_ai_scout_insight(athlete_context, analytics_context):
    prompt = f"""
You are an AI talent scout for a sports opportunity platform.

Analyze this athlete for scouts, sponsors, and coaches.

Athlete Profile:
{athlete_context}

Performance Analytics:
{analytics_context}

Return in this structure:
1. Athlete Potential Summary
2. Key Strengths
3. Weaknesses / Development Areas
4. Growth Trend
5. Injury or Recovery Concerns
6. Sponsorship Potential
7. Scout Recommendation

Make it professional, practical, and talent-discovery focused.
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