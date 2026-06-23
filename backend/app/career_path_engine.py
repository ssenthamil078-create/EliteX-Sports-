def generate_career_path(athlete, skill_rating, training_sessions):

    current_level = athlete.level

    if skill_rating >= 85:
        next_target = "Elite National Athlete"
    elif skill_rating >= 70:
        next_target = "National Level Athlete"
    elif skill_rating >= 50:
        next_target = "State Level Athlete"
    else:
        next_target = "District Level Athlete"

    if training_sessions >= 20:
        consistency = "Excellent"
    elif training_sessions >= 10:
        consistency = "Good"
    else:
        consistency = "Needs Improvement"

    if athlete.sport.lower() == "athletics":
        focus_areas = [
            "Speed improvement",
            "Endurance building",
            "Sprint biomechanics"
        ]
    elif athlete.sport.lower() == "football":
        focus_areas = [
            "Match fitness",
            "Passing accuracy",
            "Game intelligence"
        ]
    elif athlete.sport.lower() == "badminton":
        focus_areas = [
            "Footwork",
            "Reaction speed",
            "Shot consistency"
        ]
    else:
        focus_areas = [
            "Strength training",
            "Skill consistency",
            "Mental conditioning"
        ]

    roadmap = [
        "Participate in district competitions",
        "Improve performance metrics weekly",
        "Apply for sports scholarships",
        "Participate in state championships",
        "Build athlete digital portfolio",
        "Connect with coaches and scouts",
        "Target national-level events"
    ]

    if skill_rating >= 70:
        recommendation = (
            "You are progressing strongly. "
            "Focus on advanced competition exposure and sponsorship opportunities."
        )
    elif skill_rating >= 50:
        recommendation = (
            "You are showing solid growth. "
            "Improve consistency and training intensity."
        )
    else:
        recommendation = (
            "You are in the early growth stage. "
            "Focus on regular training and skill development."
        )

    return {
        "current_level": current_level,
        "next_target": next_target,
        "consistency": consistency,
        "focus_areas": focus_areas,
        "career_roadmap": roadmap,
        "ai_recommendation": recommendation
    }