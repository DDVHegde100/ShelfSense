# ShelfSense Setup Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd shelfsense

# Install Node.js dependencies
npm install

# Install Python dependencies (for ML service)
cd ml-service
pip install -r requirements.txt
cd ..
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Generate NextAuth secret:
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Run Prisma migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed
```

### 4. Start Development Servers

**Option A: With Docker (Recommended)**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

**Option B: Manual Start**

Terminal 1 - Next.js Frontend:
```bash
npm run dev
```

Terminal 2 - ML Service:
```bash
cd ml-service
uvicorn api.main:app --reload
```

Terminal 3 - MQTT Broker:
```bash
docker run -it -p 1883:1883 eclipse-mosquitto
```

### 5. Access Applications

- **Frontend**: http://localhost:3000
- **ML Service API**: http://localhost:8000
- **ML Service Docs**: http://localhost:8000/docs
- **Database**: localhost:5432
- **Redis**: localhost:6379
- **MQTT**: localhost:1883

---

## Production Deployment

### AWS Deployment

1. **Infrastructure Setup**
   - RDS PostgreSQL instance
   - ElastiCache Redis cluster
   - S3 bucket for images
   - EC2 or ECS for services
   - ALB for load balancing

2. **Deploy Next.js**
   ```bash
   # Build production image
   docker build -f docker/Dockerfile.nextjs -t shelfsense-frontend .
   
   # Push to ECR
   aws ecr get-login-password --region us-east-1 | docker login ...
   docker push <ecr-url>/shelfsense-frontend
   ```

3. **Deploy ML Service**
   ```bash
   # Build ML service image
   docker build -f docker/Dockerfile.ml -t shelfsense-ml ./ml-service
   
   # Deploy to ECS with GPU instance
   ```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

---

## Hardware Setup

### Raspberry Pi Camera

1. **Install Dependencies**
   ```bash
   sudo apt-get update
   sudo apt-get install python3-pip python3-picamera2
   pip3 install -r hardware/raspberry-pi/requirements.txt
   ```

2. **Configure**
   ```bash
   export API_URL="http://your-server:3000/api/hardware"
   export DEVICE_ID="cam-001"
   export API_KEY="your-api-key"
   ```

3. **Run Client**
   ```bash
   python3 hardware/raspberry-pi/camera_client.py
   ```

4. **Auto-start on Boot**
   ```bash
   # Create systemd service
   sudo nano /etc/systemd/system/shelfsense-camera.service
   sudo systemctl enable shelfsense-camera
   sudo systemctl start shelfsense-camera
   ```

### ESP32-CAM

1. **Install Arduino IDE**
2. **Install ESP32 Board Support**
3. **Install Required Libraries**:
   - ESP32 Camera Library
   - HTTPClient
4. **Upload firmware.ino**
5. **Configure WiFi and API credentials**

---

## ML Model Setup

### Download Pre-trained Models

```bash
cd ml-service/models

# Download YOLOv8 base model
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt -O yolo/base.pt

# CLIP model will auto-download on first run
```

### Train Custom Model

```bash
cd ml-service

# Prepare dataset
# - Collect shelf images
# - Annotate with YOLO format
# - Split train/val/test

# Train YOLO
python scripts/train_yolo.py --data data.yaml --epochs 100

# Train custom classifier
python scripts/train_classifier.py
```

---

## Monitoring & Maintenance

### View Logs

```bash
# Docker logs
docker-compose logs -f nextjs
docker-compose logs -f ml-service

# Application logs
tail -f logs/app.log
```

### Database Backup

```bash
# Backup PostgreSQL
pg_dump -h localhost -U postgres shelfsense > backup.sql

# Restore
psql -h localhost -U postgres shelfsense < backup.sql
```

### Scaling

- **Horizontal Scaling**: Add more ML service instances behind load balancer
- **Vertical Scaling**: Increase GPU resources for ML inference
- **Database**: Enable read replicas for analytics queries
- **Caching**: Use Redis for frequently accessed data

---

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Check firewall rules

2. **ML service out of memory**
   - Reduce batch size
   - Use smaller model (yolov8n instead of yolov8x)
   - Enable model quantization

3. **Camera offline**
   - Check network connectivity
   - Verify API_KEY is correct
   - Check device heartbeat logs

4. **Slow inference**
   - Enable GPU acceleration
   - Optimize image resolution
   - Implement batch processing

---

## Support

- Documentation: https://docs.shelfsense.com
- Issues: https://github.com/shelfsense/shelfsense/issues
- Email: support@shelfsense.com
