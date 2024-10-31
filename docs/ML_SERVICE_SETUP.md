# ShelfSense ML Service - Setup Guide

Complete setup guide for the ShelfSense computer vision and ML infrastructure.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Model Setup](#model-setup)
- [Hardware Setup](#hardware-setup)
- [Running the Service](#running-the-service)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

**ML Service (Server/Cloud)**
- Ubuntu 20.04+ / macOS 12+ / Windows 10+
- Python 3.9+
- CUDA 11.8+ (for GPU inference)
- 16GB RAM minimum (32GB recommended)
- 50GB free disk space

**Camera Client (Raspberry Pi)**
- Raspberry Pi 4 (4GB+ RAM recommended)
- Raspberry Pi OS (64-bit)
- Camera Module v2 or v3
- Stable network connection

### Software Dependencies

- Python 3.9+
- PyTorch 2.0+
- CUDA Toolkit (for GPU)
- OpenCV 4.8+
- Node.js 18+ (for Next.js frontend)
- PostgreSQL 14+
- Redis 7+

---

## Installation

### 1. ML Service Setup

#### Clone Repository
```bash
cd /path/to/shelfsense
```

#### Create Virtual Environment
```bash
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

#### Install Dependencies

**For GPU (CUDA)**
```bash
cd ml-service

# Install PyTorch with CUDA support
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# Install remaining dependencies
pip install -r requirements.txt
```

**For CPU Only**
```bash
cd ml-service

# Install PyTorch CPU version
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
pip install -r requirements.txt
```

**Optional: GPU-accelerated FAISS**
```bash
# For faster similarity search on GPU
pip uninstall faiss-cpu
pip install faiss-gpu
```

#### Environment Configuration
```bash
# Create .env file
cp .env.example .env

# Edit configuration
nano .env
```

Example `.env`:
```env
# ML Service Configuration
ML_DEVICE=cuda:0  # or 'cpu'
ML_BATCH_SIZE=8
ML_CONF_THRESHOLD=0.45

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/shelfsense
REDIS_URL=redis://localhost:6379/0

# Storage
S3_BUCKET=shelfsense-images
AWS_REGION=us-east-1

# API
API_KEY=your-secure-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,https://shelfsense.app
```

---

### 2. Model Setup

#### Download Pre-trained Models

**YOLOv8 Models**
```bash
# Create models directory
mkdir -p ml-service/models/weights

# Download YOLO11 nano model (fastest)
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolo11n.pt \
  -O ml-service/models/weights/yolo11n.pt

# Or download larger models for better accuracy
# yolo11s.pt (small)
# yolo11m.pt (medium)
# yolo11l.pt (large)
# yolo11x.pt (xlarge)
```

**CLIP Models** (auto-downloaded on first run)
```python
# CLIP models will download automatically
# Default: ViT-B/32 (~350MB)
# Options: ViT-B/16, ViT-L/14
```

#### Custom Training (Optional)

If you want to train on your own retail shelf dataset:

```bash
# Prepare dataset in YOLO format
# dataset/
#   ├── images/
#   │   ├── train/
#   │   └── val/
#   └── labels/
#       ├── train/
#       └── val/

# Create data.yaml
cat > dataset/data.yaml << EOF
path: ../dataset
train: images/train
val: images/val

nc: 7  # number of classes
names: ['product', 'empty_slot', 'misplaced', 'damaged', 'price_tag', 'shelf', 'divider']
EOF

# Run training
python ml-service/scripts/train_yolo.py \
  --data dataset/data.yaml \
  --epochs 100 \
  --batch 16 \
  --imgsz 640 \
  --device 0
```

---

### 3. Hardware Setup (Raspberry Pi)

#### Raspberry Pi Camera Client Setup

```bash
# SSH into Raspberry Pi
ssh pi@raspberrypi.local

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install system dependencies
sudo apt-get install -y \
  python3-pip \
  python3-opencv \
  libcamera-dev \
  libatlas-base-dev \
  libjpeg-dev

# Install Python dependencies
cd shelfsense/hardware/raspberry-pi
pip3 install -r requirements.txt
```

**requirements.txt for Raspberry Pi:**
```
opencv-python==4.8.0.76
picamera2==0.3.12
requests==2.31.0
python-dotenv==1.0.0
websocket-client==1.6.4
```

#### Configure Camera Client
```bash
# Create config file
nano config.yaml
```

```yaml
# Camera Configuration
camera:
  resolution: [1920, 1080]
  fps: 15
  capture_interval: 300  # seconds

# ML Service
ml_service:
  url: http://your-ml-service-ip:8000
  api_key: your-api-key

# Device Info
device:
  camera_id: shelf_cam_001
  store_id: store_001
  shelf_id: shelf_a1
```

#### Enable Camera
```bash
# Enable legacy camera interface
sudo raspi-config
# Navigate to: Interface Options > Legacy Camera > Enable

# Reboot
sudo reboot
```

---

## Running the Service

### 1. Start ML Service

#### Development Mode
```bash
cd ml-service

# Activate virtual environment
source venv/bin/activate

# Run with hot reload
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Production Mode (with Gunicorn)
```bash
cd ml-service

# Install Gunicorn
pip install gunicorn

# Run with multiple workers
gunicorn api.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120 \
  --access-logfile logs/access.log \
  --error-logfile logs/error.log
```

#### Using Docker
```bash
# Build image
docker build -t shelfsense-ml:latest -f docker/Dockerfile.ml .

# Run container
docker run -d \
  --name shelfsense-ml \
  --gpus all \  # For GPU support
  -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  -v $(pwd)/data:/app/data \
  --env-file .env \
  shelfsense-ml:latest
```

### 2. Start Camera Client

#### On Raspberry Pi
```bash
cd hardware/raspberry-pi

# Run camera client
python3 camera_client.py

# Or run as systemd service
sudo cp shelfsense-camera.service /etc/systemd/system/
sudo systemctl enable shelfsense-camera
sudo systemctl start shelfsense-camera

# Check status
sudo systemctl status shelfsense-camera
```

**shelfsense-camera.service:**
```ini
[Unit]
Description=ShelfSense Camera Client
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/shelfsense/hardware/raspberry-pi
ExecStart=/usr/bin/python3 camera_client.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 3. Start Frontend (Next.js)

```bash
cd shelfsense

# Install dependencies
npm install

# Run development server
npm run dev

# Or build and run production
npm run build
npm start
```

---

## Testing

### Unit Tests
```bash
cd ml-service
pytest tests/ -v --cov=core
```

### API Testing
```bash
# Test detection endpoint
curl -X POST http://localhost:8000/api/ml/detect \
  -F "image=@test_shelf.jpg" \
  -F "camera_id=test_cam" \
  -F "store_id=test_store"

# Test health endpoint
curl http://localhost:8000/health
```

### Load Testing
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Run load test
ab -n 100 -c 10 -p test_image.jpg \
  -T "multipart/form-data" \
  http://localhost:8000/api/ml/detect
```

### Camera Testing
```bash
cd hardware/raspberry-pi

# Test camera capture
python3 test_camera.py

# Test ML service connection
python3 test_connection.py
```

---

## Performance Optimization

### GPU Optimization

1. **Enable TensorRT** (NVIDIA GPUs)
```python
# In config.py
yolo.half_precision = True  # FP16 inference
```

2. **Batch Processing**
```python
# Process multiple frames at once
config.inference.batch_size = 16  # Adjust based on GPU memory
```

3. **Model Quantization**
```bash
# Export to TensorRT format
python scripts/export_tensorrt.py --model yolo11n.pt
```

### CPU Optimization

1. **Use Smaller Models**
```python
# Switch to nano model
config.yolo.model_size = "n"
```

2. **Reduce Image Size**
```python
config.preprocessing.target_size = (416, 416)  # Instead of 640x640
```

3. **Enable ONNX Runtime**
```bash
pip install onnxruntime
python scripts/export_onnx.py --model yolo11n.pt
```

---

## Troubleshooting

### Common Issues

#### 1. CUDA Out of Memory
```bash
# Reduce batch size
export ML_BATCH_SIZE=4

# Or use smaller model
# yolo11n.pt instead of yolo11x.pt
```

#### 2. Camera Not Detected
```bash
# Check camera connection
vcgencmd get_camera

# Test with raspistill
raspistill -o test.jpg

# Check permissions
sudo usermod -a -G video $USER
```

#### 3. Model Loading Fails
```bash
# Clear cache
rm -rf ~/.cache/ultralytics
rm -rf ~/.cache/clip

# Re-download models
python3 -c "from ultralytics import YOLO; YOLO('yolo11n.pt')"
```

#### 4. API Connection Timeout
```bash
# Increase timeout in camera client
# In camera_client.py:
response = requests.post(url, files=files, data=data, timeout=60)

# Check network latency
ping your-ml-service-ip
```

#### 5. Poor Detection Accuracy
```bash
# Check image quality
# - Brightness: 30-250
# - Blur score: >100
# - Contrast: >30

# Adjust thresholds
export ML_CONF_THRESHOLD=0.35  # Lower = more detections

# Retrain on custom dataset
python scripts/train_yolo.py --data your_dataset.yaml
```

### Logs

```bash
# ML Service logs
tail -f ml-service/logs/ml_service.log

# Camera client logs
tail -f hardware/raspberry-pi/logs/camera_client.log

# Docker logs
docker logs -f shelfsense-ml
```

### Support

- **Documentation**: `/docs`
- **GitHub Issues**: https://github.com/your-org/shelfsense/issues
- **Discord**: https://discord.gg/shelfsense

---

## Next Steps

1. ✅ ML Service running
2. ✅ Camera client connected
3. ✅ Frontend accessible
4. 📊 View real-time shelf analytics at http://localhost:3000/dashboard
5. 🎯 Configure planograms and alerts
6. 🚀 Scale to multiple cameras

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)
