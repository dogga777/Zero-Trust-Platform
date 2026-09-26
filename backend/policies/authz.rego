package zerotrust

import rego.v1

default decision := {"action": "deny", "reason": "No matching policy"}

# Allow if risk is low and trust is high
decision := {"action": "allow", "reason": "Low risk, high trust identity"} if {
    input.risk_score < 0.6
    input.identity.trust_score > 0.8
    input.resource.sensitivity != "CRITICAL"
}

# Step-up for moderate risk
decision := {"action": "step_up", "reason": "Moderate risk - step-up auth required"} if {
    input.risk_score >= 0.6
    input.risk_score < 0.8
}

# Deny critical resources with elevated risk
decision := {"action": "deny", "reason": "Critical resource with elevated risk"} if {
    input.resource.sensitivity == "CRITICAL"
    input.risk_score > 0.5
}

# Allow with reduced privileges
decision := {"action": "allow_reduced", "reason": "Low risk, reduced scope"} if {
    input.risk_score < 0.4
    input.identity.trust_score > 0.9
}