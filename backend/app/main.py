from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import settings


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
    )
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)
    return app


app = create_application()
