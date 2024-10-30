# ml-service/core/config.py
# Configuration for ML service

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    API_VERSION: str = "v1"
    DEBUG: bool = False
    
    # Model Paths
    YOLO_MODEL_PATH: str = "./models/yolo/best.pt"
    CLIP_MODEL_NAME: str = "openai/clip-vit-base-patch32"
    
    # Inference Settings
    DEFAULT_CONFIDENCE_THRESHOLD: float = 0.5
    DEFAULT_IOU_THRESHOLD: float = 0.45
    MAX_BATCH_SIZE: int = 10
    
    # Image Processing
    MAX_IMAGE_SIZE: int = 1920
    IMAGE_QUALITY: int = 95
    
    # Database
    DATABASE_URL: Optional[str] = None
    REDIS_URL: Optional[str] = None
    
    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: Optional[str] = None
    
    # Device
    DEVICE: str = "cuda"  # cuda or cpu
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
