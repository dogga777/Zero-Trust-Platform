from sqlalchemy import Column, String, Float, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
from app.core.database import Base

class Identity(Base):
    __tablename__ = "identities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(Enum("user", "agent", "service", "robot", name="entity_type"))
    name = Column(String, nullable=False)
    trust_score = Column(Float, default=1.0)
    auth_strength = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))