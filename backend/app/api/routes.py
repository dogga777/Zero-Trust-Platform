from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
import uuid
from app.core.auth import verify_token
from app.services.policy import evaluate_policy
from app.services.risk import risk_engine
from app.services.credentials import issue_ephemeral_token
from app.services.blast_radius import blast_analyzer

router = APIRouter()

# In-memory audit log for the demo
audit_logs = []

def log_decision(identity_id, resource_id, action, risk_score, reason):
    audit_logs.append({
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "identity_id": identity_id,
        "resource_id": resource_id,
        "action": action,
        "risk_score": risk_score,
        "reason": reason,
    })

class AuthDecisionRequest(BaseModel):
    identity_id: str
    resource_id: str
    resource_sensitivity: str
    context: dict = {}

@router.post("/auth/decision")
async def auth_decision(req: AuthDecisionRequest, user=Depends(verify_token)):
    features = {
        "hour_of_day": datetime.now().hour,
        "access_frequency": req.context.get("recent_count", 0),
        "resource_sensitivity_score": {"PUBLIC": 0, "INTERNAL": 1, "CONFIDENTIAL": 2, "CRITICAL": 3}.get(req.resource_sensitivity, 0),
        "command_sequence_length": len(req.context.get("actions", [])),
    }
    risk = risk_engine.score(features)

    decision = await evaluate_policy({
        "identity": {"trust_score": 0.95, "auth_strength": "mfa"},
        "resource": {"sensitivity": req.resource_sensitivity},
        "risk_score": risk,
        "context": {"time_of_day_hour": features["hour_of_day"]},
    })

    if decision["action"] in ["allow", "allow_reduced"]:
        token = issue_ephemeral_token(req.identity_id, req.resource_id, risk)
        log_decision(req.identity_id, req.resource_id, decision["action"], risk, decision["reason"])
        return {"decision": decision, "token": token, "risk_score": risk}

    log_decision(req.identity_id, req.resource_id, decision["action"], risk, decision["reason"])
    return {"decision": decision, "risk_score": risk}

@router.post("/blast-radius/simulate")
async def simulate_blast_radius(identity_id: str, user=Depends(verify_token)):
    reachable = blast_analyzer.compute_blast_radius(identity_id)
    return {"compromised_identity": identity_id, "reachable_resources": reachable}

@router.get("/audit/logs")
async def get_audit_logs(limit: int = 50):
    return {"logs": audit_logs[-limit:]}