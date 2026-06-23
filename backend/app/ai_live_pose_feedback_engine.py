import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_live_pose_feedback(sport, pose_result):
    prompt = f"""
You are a real-time sports posture assistant.

Sport: {sport}

Live Pose Data:
{pose_result}

Give short instant feedback in 3 parts:
1. What looks good
2. What needs correction
3. One immediate coaching tip

Keep it short, clear, and safe.
Avoid medical diagnosis.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=250
    )

    return response.choices[0].message.content