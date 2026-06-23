def generate_video_analysis(sport):
    sport = sport.lower()

    if sport == "athletics":
        return {
            "posture_score": 82,
            "movement_score": 78,
            "balance_score": 75,
            "overall_score": 78,
            "feedback": "Running posture is good, but arm swing and stride balance can improve.",
            "improvement_tips": "Focus on knee lift, controlled arm movement, and sprint start drills."
        }

    if sport == "football":
        return {
            "posture_score": 76,
            "movement_score": 80,
            "balance_score": 72,
            "overall_score": 76,
            "feedback": "Movement is active, but balance during direction change needs improvement.",
            "improvement_tips": "Practice cone drills, agility ladder, and lower-body stability exercises."
        }

    if sport == "badminton":
        return {
            "posture_score": 74,
            "movement_score": 79,
            "balance_score": 77,
            "overall_score": 77,
            "feedback": "Footwork is decent, but recovery position after shots needs improvement.",
            "improvement_tips": "Improve split-step timing, lateral movement, and wrist control drills."
        }

    return {
        "posture_score": 70,
        "movement_score": 70,
        "balance_score": 70,
        "overall_score": 70,
        "feedback": "Basic movement analysis completed. More sport-specific data is needed.",
        "improvement_tips": "Maintain regular training, improve flexibility, and follow coach feedback."
    }