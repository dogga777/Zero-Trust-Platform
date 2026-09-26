from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from app.core.config import settings

security = HTTPBearer()

async def get_jwks():
    url = f"{settings.KEYCLOAK_URL}/realms/zerotrust/protocol/openid-connect/certs"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        return resp.json()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Demo mode: accept a static token for hackathon presentation
    if token == "demo-token":
        return {"sub": "demo-user", "preferred_username": "demo-user"}
    try:
        jwks = await get_jwks()
        payload = jwt.decode(token, jwks, algorithms=["RS256"], audience="zerotrust-api")
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")