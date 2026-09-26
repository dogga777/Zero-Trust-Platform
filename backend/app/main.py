from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.database import engine, Base
from app.services.risk import risk_engine
from app.models import identity # Import needed to register models with Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Zero Trust Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # <-- add 5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

# Seed the risk engine with synthetic baseline data
# Seed the risk engine with synthetic baseline data (normal behavior)
risk_engine.train([
    {"hour_of_day": h, "access_frequency": 5, "resource_sensitivity_score": 1, "command_sequence_length": 3}
    for h in range(6, 22)
])

@app.websocket("/ws/risk-updates")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            await websocket.send_json({"status": "received", "echo": data})
    except WebSocketDisconnect:
        pass