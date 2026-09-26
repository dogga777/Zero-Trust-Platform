from jose import jwt
from datetime import datetime, timedelta, timezone
import uuid

SECRET = "your-ephemeral-secret"

def issue_ephemeral_token(identity_id: str, resource_id: str, risk_score: float, ttl_seconds: int = 300):
    payload = {
        "sub": identity_id,
        "resource": resource_id,
        "risk_score": risk_score,
        "jti": str(uuid.uuid4()),
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds),
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")