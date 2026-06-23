def calculate_injury_risk(logs):
    total_sessions = len(logs)

    avg_intensity = sum(log.intensity for log in logs) / total_sessions
    avg_fatigue = sum(log.fatigue_level for log in logs) / total_sessions
    avg_pain = sum(log.injury_pain_level for log in logs) / total_sessions
    avg_duration = sum(log.duration_minutes for log in logs) / total_sessions

    risk_score = 0
    reasons = []

    if avg_intensity >= 8:
        risk_score += 25
        reasons.append("High training intensity")

    if avg_fatigue >= 7:
        risk_score += 25
        reasons.append("High fatigue level")

    if avg_pain >= 5:
        risk_score += 30
        reasons.append("Pain level is increasing")

    if avg_duration >= 90:
        risk_score += 15
        reasons.append("Long training duration")

    if total_sessions >= 6:
        risk_score += 5
        reasons.append("High training frequency")

    risk_score = min(risk_score, 100)

    if risk_score >= 70:
        risk_level = "High"
        advice = [
            "Take 1-2 rest days immediately",
            "Reduce training intensity for the next session",
            "Do stretching and mobility recovery",
            "Consult a coach or physiotherapist if pain continues"
        ]
    elif risk_score >= 40:
        risk_level = "Medium"
        advice = [
            "Reduce workload slightly",
            "Improve sleep and hydration",
            "Add warm-up and cool-down routines",
            "Monitor pain level in the next session"
        ]
    else:
        risk_level = "Low"
        advice = [
            "Continue current training plan",
            "Maintain proper warm-up",
            "Track fatigue after every session"
        ]

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "advice": advice,
        "metrics": {
            "total_sessions": total_sessions,
            "average_intensity": round(avg_intensity, 2),
            "average_fatigue": round(avg_fatigue, 2),
            "average_pain": round(avg_pain, 2),
            "average_duration": round(avg_duration, 2)
        }
    }