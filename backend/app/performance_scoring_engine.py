def clamp_score(value):
    return max(0, min(100, round(value, 2)))


def generate_performance_scores(pose_result):

    joint_angles = pose_result.get("joint_angles", {})
    symmetry_analysis = pose_result.get("symmetry_analysis", {})

    left_knee = joint_angles.get("left_knee_angle", 0)
    right_knee = joint_angles.get("right_knee_angle", 0)

    left_elbow = joint_angles.get("left_elbow_angle", 0)
    right_elbow = joint_angles.get("right_elbow_angle", 0)

    knee_difference = symmetry_analysis.get(
        "knee_symmetry_difference",
        50
    )

    shoulder_balance = symmetry_analysis.get(
        "shoulder_balance",
        1
    )

    # ---------------- BALANCE ----------------

    balance_score = 100 - (shoulder_balance * 300)

    # ---------------- SYMMETRY ----------------

    symmetry_score = 100 - (knee_difference * 3)

    # ---------------- MOBILITY ----------------

    mobility_score = (
        (
            left_knee +
            right_knee +
            left_elbow +
            right_elbow
        ) / 4
    ) / 1.8

    # ---------------- POSTURE ----------------

    posture_score = 100 - (shoulder_balance * 250)

    # ---------------- STABILITY ----------------

    stability_score = (
        symmetry_score * 0.6 +
        balance_score * 0.4
    )

    # ---------------- EXPLOSIVENESS ----------------

    explosiveness_score = (
        mobility_score * 0.7 +
        stability_score * 0.3
    )

    scores = {
        "balance_score": clamp_score(balance_score),

        "posture_score": clamp_score(posture_score),

        "symmetry_score": clamp_score(symmetry_score),

        "mobility_score": clamp_score(mobility_score),

        "stability_score": clamp_score(stability_score),

        "explosiveness_score": clamp_score(explosiveness_score)
    }

    overall_score = sum(scores.values()) / len(scores)

    scores["overall_score"] = clamp_score(overall_score)

    return scores