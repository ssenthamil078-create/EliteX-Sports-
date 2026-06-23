def calculate_competition_score(athlete, competition):
    score = 0

    if athlete.sport and competition.sport:
        if athlete.sport.lower() in competition.sport.lower() or competition.sport.lower() == "multi-sport":
            score += 40

    if athlete.level and competition.level:
        if athlete.level.lower() == competition.level.lower():
            score += 25
        elif competition.level.lower() in ["district", "state", "regional", "national"]:
            score += 10

    if athlete.state and competition.venue:
        if athlete.state.lower() in competition.venue.lower():
            score += 20

    if athlete.age:
        age_text = competition.age_category.lower() if competition.age_category else ""

        if "under 18" in age_text and athlete.age < 18:
            score += 15
        elif "under 19" in age_text and athlete.age < 19:
            score += 15
        elif "under 21" in age_text and athlete.age < 21:
            score += 15
        elif "senior" in age_text and athlete.age >= 18:
            score += 15
        elif "open" in age_text:
            score += 15

    return score


def calculate_scholarship_score(athlete, scholarship):
    score = 0

    if athlete.sport and scholarship.sport_eligibility:
        if athlete.sport.lower() in scholarship.sport_eligibility.lower() or "multi-sport" in scholarship.sport_eligibility.lower():
            score += 40

    if athlete.age:
        age_text = scholarship.age_category.lower() if scholarship.age_category else ""

        if "10-18" in age_text and 10 <= athlete.age <= 18:
            score += 20
        elif "15-29" in age_text and 15 <= athlete.age <= 29:
            score += 20
        elif "under 21" in age_text and athlete.age < 21:
            score += 20
        elif "open" in age_text:
            score += 20
        elif "university" in age_text and athlete.age >= 17:
            score += 10

    if athlete.achievements:
        score += 20

    if athlete.level:
        if athlete.level.lower() in ["state", "national", "elite"]:
            score += 20

    return score


def calculate_scheme_score(athlete, scheme):
    score = 0

    eligibility = scheme.eligibility.lower() if scheme.eligibility else ""

    if athlete.age:
        if "10-18" in eligibility and 10 <= athlete.age <= 18:
            score += 30
        elif "youth" in eligibility and athlete.age <= 21:
            score += 25
        elif "young" in eligibility and athlete.age <= 21:
            score += 25
        elif "all athletes" in eligibility:
            score += 20
        elif "elite" in eligibility and athlete.level and athlete.level.lower() in ["national", "elite"]:
            score += 30

    if athlete.state:
        if "state" in eligibility:
            score += 20

    if athlete.level:
        if athlete.level.lower() in ["state", "national", "elite"]:
            score += 20

    return score