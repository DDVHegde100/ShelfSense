# ml-service/api/main.py
# FastAPI application for ML inference

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
import uvicorn
from typing import List, Optional
import logging

from .routers import detection, classification, planogram
from .dependencies import get_settings
from core.config import Settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ShelfSense ML Service",
    description="Computer vision and ML inference service for retail shelf intelligence",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(detection.router, prefix="/api/v1/detection", tags=["detection"])
app.include_router(classification.router, prefix="/api/v1/classification", tags=["classification"])
app.include_router(planogram.router, prefix="/api/v1/planogram", tags=["planogram"])

# Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ShelfSense ML Service",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": True  # Add actual model checks
    }

@app.on_event("startup")
async def startup_event():
    """Load ML models on startup"""
    logger.info("Loading ML models...")
    # TODO: Load YOLO, CLIP, and custom models
    logger.info("ML models loaded successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down ML service...")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
