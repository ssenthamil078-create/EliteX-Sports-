import hashlib

def generate_certificate_hash(user_id, title, issued_by, issue_date):
    raw_data = f"{user_id}-{title}-{issued_by}-{issue_date}"
    return hashlib.sha256(raw_data.encode()).hexdigest()