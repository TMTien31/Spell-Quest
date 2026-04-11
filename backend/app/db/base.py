from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models here so Alembic can detect metadata.
from app import models  # noqa: E402,F401
