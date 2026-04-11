from app.core.config import settings


def build_health_payload() -> dict[str, str]:
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
    }
