import httpx
from app.core.config import settings

async def evaluate_policy(input_data: dict) -> dict:
    url = f"{settings.OPA_URL}/v1/data/zerotrust/decision"
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json={"input": input_data})
        if resp.status_code == 200:
            return resp.json().get("result", {"action": "deny", "reason": "OPA error"})
        return {"action": "deny", "reason": f"OPA returned {resp.status_code}"}