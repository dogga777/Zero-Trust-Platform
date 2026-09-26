from sklearn.ensemble import IsolationForest
import numpy as np

class RiskEngine:
    def __init__(self):
        self.model = IsolationForest(contamination=0.2, random_state=42)
        self.is_trained = False

    def train(self, historical_features: list[dict]):
        X = np.array([
            [f["hour_of_day"], f["access_frequency"],
             f["resource_sensitivity_score"], f["command_sequence_length"]]
            for f in historical_features
        ])
        self.model.fit(X)
        self.is_trained = True

    def score(self, features: dict) -> float:
        if not self.is_trained:
            return 0.0

        X = np.array([[features["hour_of_day"], features["access_frequency"],
                       features["resource_sensitivity_score"],
                       features["command_sequence_length"]]])
        raw = self.model.decision_function(X)[0]

        # Normalize raw score (typically between -0.5 and 0.5) into 0-1 range
        risk = max(0.0, min(1.0, 0.5 - raw))
        return round(risk, 3)

risk_engine = RiskEngine()