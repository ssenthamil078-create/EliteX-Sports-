import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_ai_video_feedback(
    sport,
    athlete_level,
    posture_score,
    movement_score,
    balance_score,
    overall_score
):
    prompt = f"""
You are a professional sports performance analyst.

Create a detailed video performance analysis report for an athlete.

Athlete details:
Sport: {sport}
Level: {athlete_level}
Posture Score: {posture_score}/100
Movement Score: {movement_score}/100
Balance Score: {balance_score}/100
Overall Score: {overall_score}/100

Return the report in this structure:

1. Performance Summary
2. Strengths
3. Weaknesses
4. Technical Corrections
5. Injury Risk Notes
6. Recommended Drills
7. 7-Day Improvement Plan
8. Coach Advice

Make the report specific, professional, and practical.
Do not give generic repeated advice.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.8,
        max_tokens=900
    )

    return response.choices[0].message.content