def calculate_readiness_score(
    fatigue,
    pain,
    intensity,
    posture=75,
    balance=75,
    symmetry=75,
):
    score = 100

    score -= fatigue * 4
    score -= pain * 5
    score -= max(intensity - 5, 0) * 3

    score += posture * 0.05
    score += balance * 0.05
    score += symmetry * 0.05

    score = max(0, min(100, int(score)))

    if score >= 80:
        status = "Peak"
        recovery = "Ready for high intensity training"
        risk = "Low"

    elif score >= 60:
        status = "Moderate"
        recovery = "Balanced training recommended"
        risk = "Moderate"

    else:
        status = "Recovery Needed"
        recovery = "Focus on rest and mobility"
        risk = "High"

    return {
        "readiness_score": score,
        "status": status,
        "recovery_advice": recovery,
        "injury_risk": risk,
    }