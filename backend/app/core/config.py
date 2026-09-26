import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:secret@localhost:5432/zerotrust")
    KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
    OPA_URL = os.getenv("OPA_URL", "http://localhost:8181")
    NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

settings = Settings()