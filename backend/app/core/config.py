from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Spell Quest API"
    ENVIRONMENT: str = "local"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./spell_quest.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
