def calculate_mentor_match_score(mentee, mentor):
    score = 0

    if mentee.sport and mentor.sport:
        if mentee.sport.lower() == mentor.sport.lower():
            score += 40

    if mentee.state and mentor.state:
        if mentee.state.lower() == mentor.state.lower():
            score += 20

    if mentee.language and mentor.language:
        if mentee.language.lower() == mentor.language.lower():
            score += 15

    if mentor.level:
        if mentor.level.lower() in ["state", "national", "elite"]:
            score += 20

    if mentee.goals and mentor.achievements:
        score += 5

    return min(score, 100)