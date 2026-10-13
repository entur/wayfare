from functools import lru_cache
from typing import List, Literal, Optional

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    environment: str = Field(default="development", alias="ENVIRONMENT")

    omsa_mode: Literal["remote", "local"] = Field(
        default="remote", alias="OMSA_MODE"
    )
    omsa_remote_base_url: str = Field(
        default="https://api.dev.entur.io/sales/v2", alias="OMSA_REMOTE_BASE_URL"
    )
    omsa_local_base_url: str = Field(
        default="http://localhost:8080", alias="OMSA_LOCAL_BASE_URL"
    )
    omsa_base_url: Optional[str] = Field(
        default=None,
        alias="OMSA_BASE_URL",
        description="Explicit OMSA base URL override. If set, supersedes OMSA_MODE.",
    )
    oauth_token_url: str = Field(
        default="https://partner.dev.entur.org/oauth/token",
        alias="OAUTH_TOKEN_URL",
    )
    auth_audience: str = Field(
        default="https://api.dev.entur.io", alias="AUTH0_AUDIENCE"
    )
    client_id: str = Field(default="", alias="CLIENT_ID")
    client_secret: str = Field(default="", alias="CLIENT_SECRET")

    sales_base_url: str = Field(
        default="https://api.dev.entur.io/sales/v1", alias="SALES_BASE_URL"
    )
    entur_distribution_channel: str = Field(
        default="KOL:DistributionChannel:App", alias="ENTUR_DISTRIBUTION_CHANNEL"
    )
    et_client_name: str = Field(default="omsa", alias="ET_CLIENT_NAME")
    entur_pos: str = Field(default="Kolumbus", alias="ENTUR_POS")

    cache_ttl_seconds: int = Field(default=30, alias="CACHE_TTL_SECONDS")
    cache_max_size: int = Field(default=256, alias="CACHE_MAX_SIZE")

    cors_allow_origins_raw: str | List[str] | None = Field(
        default=None,
        alias="CORS_ALLOW_ORIGINS",
        description="Comma-separated string or JSON list of allowed origins.",
    )

    api_base_path: str = Field(default="/api/v1", alias="API_BASE_PATH")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @property
    def resolved_omsa_base_url(self) -> str:
        if self.omsa_base_url:
            return self.omsa_base_url.rstrip("/")
        if self.omsa_mode == "local":
            return self.omsa_local_base_url.rstrip("/")
        return self.omsa_remote_base_url.rstrip("/")

    @property
    def entur_headers(self) -> dict[str, str]:
        return {
            "Entur-Distribution-Channel": self.entur_distribution_channel,
            "Et-Client-Name": self.et_client_name,
            "Entur-POS": self.entur_pos,
        }

    @property
    def cors_allow_origins(self) -> List[str]:
        raw = self.cors_allow_origins_raw
        if raw is None:
            return [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:8080",
                "http://localhost:5555",
                "http://localhost:8000",
            ]
        if isinstance(raw, str):
            return [origin.strip() for origin in raw.split(",") if origin.strip()]
        return raw


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance to avoid re-parsing environment."""

    return Settings()
