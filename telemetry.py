import logging
import json
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Telemetry")

def log_event(event_type: str, payload: dict):
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "type": event_type,
        "payload": payload
    }
    logger.info(json.dumps(event))

def track_metric(name: str, value: float, tags: dict = None):
    # Placeholder for sending metrics to Prometheus/Datadog
    logger.debug(f"METRIC: {name}={value} tags={tags}")
