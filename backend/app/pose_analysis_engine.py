import cv2
import math
import os
import mediapipe as mp


mp_pose = mp.solutions.pose


def calculate_angle(a, b, c):
    ax, ay = a
    bx, by = b
    cx, cy = c

    angle = math.degrees(
        math.atan2(cy - by, cx - bx)
        - math.atan2(ay - by, ax - bx)
    )

    angle = abs(angle)

    if angle > 180:
        angle = 360 - angle

    return round(angle, 2)


def avg(values):
    if not values:
        return 0
    return round(sum(values) / len(values), 2)


def get_detection_quality(rate):
    if rate >= 80:
        return "Good"
    if rate >= 50:
        return "Moderate"
    return "Poor"


def get_symmetry_status(diff):
    if diff <= 10:
        return "Good symmetry"
    if diff <= 20:
        return "Moderate imbalance"
    return "High imbalance"


def analyze_video_pose(video_path: str):
    if not os.path.exists(video_path):
        return {"error": "Video file not found"}

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return {"error": "Unable to open video file"}

    total_frames = 0
    analyzed_frames = 0
    detected_frames = 0

    left_knee_angles = []
    right_knee_angles = []
    left_elbow_angles = []
    right_elbow_angles = []
    shoulder_balance_values = []
    hip_balance_values = []

    fps = cap.get(cv2.CAP_PROP_FPS)

    if not fps or fps <= 0:
        fps = 30

    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    try:
        while cap.isOpened():
            success, frame = cap.read()

            if not success:
                break

            total_frames += 1

            # Analyze every 5th frame for speed
            if total_frames % 5 != 0:
                continue

            analyzed_frames += 1

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = pose.process(rgb_frame)

            if not result.pose_landmarks:
                continue

            detected_frames += 1
            landmarks = result.pose_landmarks.landmark

            def point(index):
                return (
                    landmarks[index].x,
                    landmarks[index].y,
                )

            LEFT_SHOULDER = 11
            RIGHT_SHOULDER = 12
            LEFT_ELBOW = 13
            RIGHT_ELBOW = 14
            LEFT_WRIST = 15
            RIGHT_WRIST = 16
            LEFT_HIP = 23
            RIGHT_HIP = 24
            LEFT_KNEE = 25
            RIGHT_KNEE = 26
            LEFT_ANKLE = 27
            RIGHT_ANKLE = 28

            left_shoulder = point(LEFT_SHOULDER)
            right_shoulder = point(RIGHT_SHOULDER)
            left_elbow = point(LEFT_ELBOW)
            right_elbow = point(RIGHT_ELBOW)
            left_wrist = point(LEFT_WRIST)
            right_wrist = point(RIGHT_WRIST)
            left_hip = point(LEFT_HIP)
            right_hip = point(RIGHT_HIP)
            left_knee = point(LEFT_KNEE)
            right_knee = point(RIGHT_KNEE)
            left_ankle = point(LEFT_ANKLE)
            right_ankle = point(RIGHT_ANKLE)

            left_elbow_angles.append(
                calculate_angle(left_shoulder, left_elbow, left_wrist)
            )

            right_elbow_angles.append(
                calculate_angle(right_shoulder, right_elbow, right_wrist)
            )

            left_knee_angles.append(
                calculate_angle(left_hip, left_knee, left_ankle)
            )

            right_knee_angles.append(
                calculate_angle(right_hip, right_knee, right_ankle)
            )

            shoulder_balance = abs(left_shoulder[1] - right_shoulder[1])
            hip_balance = abs(left_hip[1] - right_hip[1])

            shoulder_balance_values.append(round(shoulder_balance, 4))
            hip_balance_values.append(round(hip_balance, 4))

    except Exception as e:
        return {"error": f"Pose analysis failed: {str(e)}"}

    finally:
        cap.release()
        pose.close()

    if analyzed_frames == 0:
        return {"error": "No frames were analyzed from the video"}

    pose_detection_rate = round((detected_frames / analyzed_frames) * 100, 2)

    if detected_frames == 0:
        return {
            "error": "No human pose detected. Upload a clear full-body video with good lighting."
        }

    left_knee_avg = avg(left_knee_angles)
    right_knee_avg = avg(right_knee_angles)
    left_elbow_avg = avg(left_elbow_angles)
    right_elbow_avg = avg(right_elbow_angles)

    knee_symmetry_difference = round(abs(left_knee_avg - right_knee_avg), 2)
    elbow_symmetry_difference = round(abs(left_elbow_avg - right_elbow_avg), 2)

    shoulder_balance_avg = avg(shoulder_balance_values)
    hip_balance_avg = avg(hip_balance_values)

    symmetry_score = max(0, min(100, 100 - knee_symmetry_difference * 3))
    balance_score = max(0, min(100, 100 - shoulder_balance_avg * 800))
    posture_score = max(0, min(100, 100 - hip_balance_avg * 600))
    mobility_score = max(0, min(100, (left_knee_avg + right_knee_avg) / 3))
    stability_score = max(0, min(100, 100 - ((shoulder_balance_avg + hip_balance_avg) * 400)))

    overall_score = round(
        (
            symmetry_score
            + balance_score
            + posture_score
            + mobility_score
            + stability_score
        )
        / 5,
        2,
    )

    return {
        "total_frames": total_frames,
        "analyzed_frames": analyzed_frames,
        "detected_frames": detected_frames,
        "pose_detection_rate": pose_detection_rate,
        "detection_quality": get_detection_quality(pose_detection_rate),
        "joint_angles": {
            "average_left_knee_angle": left_knee_avg,
            "average_right_knee_angle": right_knee_avg,
            "average_left_elbow_angle": left_elbow_avg,
            "average_right_elbow_angle": right_elbow_avg,
            "knee_symmetry_difference": knee_symmetry_difference,
            "elbow_symmetry_difference": elbow_symmetry_difference,
        },
        "symmetry_analysis": {
            "knee_symmetry_difference": knee_symmetry_difference,
            "elbow_symmetry_difference": elbow_symmetry_difference,
            "symmetry_status": get_symmetry_status(knee_symmetry_difference),
            "average_shoulder_balance": shoulder_balance_avg,
            "average_hip_balance": hip_balance_avg,
        },
        "computed_scores": {
            "overall_score": round(overall_score),
            "balance_score": round(balance_score),
            "posture_score": round(posture_score),
            "symmetry_score": round(symmetry_score),
            "mobility_score": round(mobility_score),
            "stability_score": round(stability_score),
            "explosiveness_score": round((mobility_score + stability_score) / 2),
        },
    }


def analyze_image_pose(image_path: str):
    if not os.path.exists(image_path):
        return {"error": "Image file not found"}

    image = cv2.imread(image_path)

    if image is None:
        return {"error": "Unable to load image"}

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    pose = mp_pose.Pose(
        static_image_mode=True,
        model_complexity=1,
        enable_segmentation=False,
        min_detection_confidence=0.5,
    )

    try:
        result = pose.process(rgb_image)

    except Exception as e:
        return {"error": f"Image pose analysis failed: {str(e)}"}

    finally:
        pose.close()

    if not result.pose_landmarks:
        return {
            "pose_detected": False,
            "message": "No human pose detected",
        }

    landmarks = result.pose_landmarks.landmark

    def point(index):
        return (
            landmarks[index].x,
            landmarks[index].y,
        )

    LEFT_SHOULDER = 11
    RIGHT_SHOULDER = 12
    LEFT_ELBOW = 13
    RIGHT_ELBOW = 14
    LEFT_WRIST = 15
    RIGHT_WRIST = 16
    LEFT_HIP = 23
    RIGHT_HIP = 24
    LEFT_KNEE = 25
    RIGHT_KNEE = 26
    LEFT_ANKLE = 27
    RIGHT_ANKLE = 28

    left_shoulder = point(LEFT_SHOULDER)
    right_shoulder = point(RIGHT_SHOULDER)
    left_elbow = point(LEFT_ELBOW)
    right_elbow = point(RIGHT_ELBOW)
    left_wrist = point(LEFT_WRIST)
    right_wrist = point(RIGHT_WRIST)
    left_hip = point(LEFT_HIP)
    right_hip = point(RIGHT_HIP)
    left_knee = point(LEFT_KNEE)
    right_knee = point(RIGHT_KNEE)
    left_ankle = point(LEFT_ANKLE)
    right_ankle = point(RIGHT_ANKLE)

    left_elbow_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
    right_elbow_angle = calculate_angle(right_shoulder, right_elbow, right_wrist)
    left_knee_angle = calculate_angle(left_hip, left_knee, left_ankle)
    right_knee_angle = calculate_angle(right_hip, right_knee, right_ankle)

    shoulder_balance = abs(left_shoulder[1] - right_shoulder[1])
    hip_balance = abs(left_hip[1] - right_hip[1])
    knee_symmetry_difference = round(abs(left_knee_angle - right_knee_angle), 2)
    elbow_symmetry_difference = round(abs(left_elbow_angle - right_elbow_angle), 2)

    return {
        "pose_detected": True,
        "joint_angles": {
            "left_elbow_angle": left_elbow_angle,
            "right_elbow_angle": right_elbow_angle,
            "left_knee_angle": left_knee_angle,
            "right_knee_angle": right_knee_angle,
            "knee_symmetry_difference": knee_symmetry_difference,
            "elbow_symmetry_difference": elbow_symmetry_difference,
        },
        "symmetry_analysis": {
            "knee_symmetry_difference": knee_symmetry_difference,
            "elbow_symmetry_difference": elbow_symmetry_difference,
            "symmetry_status": get_symmetry_status(knee_symmetry_difference),
            "shoulder_balance": round(shoulder_balance, 4),
            "hip_balance": round(hip_balance, 4),
        },
    }