from neo4j import GraphDatabase
from app.core.config import settings

class BlastRadiusAnalyzer:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )

    def create_permission(self, identity_id, resource_id, permission_type):
        with self.driver.session() as session:
            session.run("""
                MERGE (i:Identity {id: $identity_id})
                MERGE (r:Resource {id: $resource_id})
                MERGE (i)-[:HAS_PERMISSION {type: $permission_type}]->(r)
            """, identity_id=identity_id, resource_id=resource_id, permission_type=permission_type)

    def compute_blast_radius(self, compromised_identity_id):
        with self.driver.session() as session:
            result = session.run("""
                MATCH path = (i:Identity {id: $compromised_id})-[:HAS_PERMISSION*1..5]->(r:Resource)
                RETURN DISTINCT r.id AS resource_id, length(path) AS hops
                ORDER BY hops ASC
            """, compromised_id=compromised_identity_id)
            return [{"resource_id": rec["resource_id"], "hops": rec["hops"]} for rec in result]

blast_analyzer = BlastRadiusAnalyzer()