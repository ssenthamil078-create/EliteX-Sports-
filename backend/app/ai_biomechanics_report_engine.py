import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_ai_biomechanics_report(sport, biomechanics_result):
    prompt = f"""
You are a professional sports biomechanics analyst.

Analyze this MediaPipe pose estimation result.

Sport:
{sport}

Biomechanics Data:
{biomechanics_result}

Create a professional report with:

1. Overall Movement Summary
2. Pose Detection Quality
3. Joint Angle Analysis
4. Symmetry Analysis
5. Possible Technical Issues
6. Injury Risk Notes
7. Corrective Drills
8. Coach Recommendation

Make it specific, practical, and useful for athletes and coaches.
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