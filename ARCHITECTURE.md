# ShelfSense Architecture Documentation

## 🏗️ System Overview

ShelfSense is a real-time retail shelf intelligence platform that uses computer vision, IoT sensors, and machine learning to monitor shelf conditions, detect out-of-stock items, analyze planogram compliance, and provide actionable insights.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js 16 (App Router)                                            │
│  ├── Landing Page (Marketing)                                        │
│  ├── Dashboard (Analytics & Monitoring)                              │
│  ├── Store Management                                                │
│  ├── Alert System                                                    │
│  └── Settings & Configuration                                        │
│                                                                       │
│  React 19 + TypeScript + Tailwind CSS v4                            │
│  Framer Motion (Animations) + Recharts (Data Viz)                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ REST API / WebSocket
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Backend for Frontend)                          │
│  ├── /api/auth/*          - Authentication endpoints                │
│  ├── /api/stores/*        - Store management                         │
│  ├── /api/shelves/*       - Shelf monitoring data                    │
│  ├── /api/alerts/*        - Alert management                         │
│  ├── /api/analytics/*     - Analytics & reporting                    │
│  ├── /api/ml/*            - ML model predictions                     │
│  └── /api/hardware/*      - Hardware device management               │
│                                                                       │
│  NextAuth.js (Authentication) + Prisma ORM                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ Database Queries
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary Database)                                       │
│  ├── Users & Authentication                                          │
│  ├── Stores & Locations                                              │
│  ├── Shelves & Products                                              │
│  ├── Alerts & Notifications                                          │
│  └── Analytics & Historical Data                                     │
│                                                                       │
│  Redis (Caching & Real-time)                                         │
│  ├── Session Management                                              │
│  ├── Real-time Alert Queue                                           │
│  ├── ML Inference Cache                                              │
│  └── WebSocket Connection State                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ Image Processing
┌─────────────────────────────────────────────────────────────────────┐
│                      ML/AI PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Python Microservices (FastAPI)                                     │
│  ├── YOLOv8/v11 - Object Detection                                  │
│  │   ├── Product Detection                                           │
│  │   ├── Empty Space Detection                                       │
│  │   └── Shelf Occupancy Analysis                                    │
│  │                                                                    │
│  ├── CLIP - Visual Search & Classification                           │
│  │   ├── Product Recognition                                         │
│  │   ├── Brand Identification                                        │
│  │   └── Planogram Matching                                          │
│  │                                                                    │
│  ├── Custom Models                                                   │
│  │   ├── Shelf State Classifier                                      │
│  │   ├── Product Freshness Detector                                  │
│  │   └── Planogram Compliance Scorer                                 │
│  │                                                                    │
│  └── Image Processing Pipeline                                       │
│      ├── Preprocessing (Resize, Normalize)                           │
│      ├── Inference (Model Prediction)                                │
│      └── Post-processing (NMS, Filtering)                            │
│                                                                       │
│  Libraries: PyTorch, Ultralytics, Transformers, OpenCV              │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ Image Capture
┌─────────────────────────────────────────────────────────────────────┐
│                    HARDWARE/EDGE LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  IoT Devices & Edge Computing                                        │
│  ├── Camera Systems                                                  │
│  │   ├── Raspberry Pi + Camera Module                                │
│  │   ├── ESP32-CAM (Low-cost option)                                 │
│  │   └── Industrial IP Cameras (High-end)                            │
│  │                                                                    │
│  ├── Environmental Sensors                                           │
│  │   ├── Temperature Sensors                                         │
│  │   ├── Humidity Sensors                                            │
│  │   └── Weight Sensors (Shelf Load)                                 │
│  │                                                                    │
│  └── Edge Processing                                                 │
│      ├── On-device Inference (TensorFlow Lite)                       │
│      ├── Image Compression                                           │
│      └── MQTT/WebSocket Client                                       │
│                                                                       │
│  Protocols: MQTT, WebSocket, HTTP/REST                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **State Management**: React Context + TanStack Query
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React

### Backend (Next.js API Routes)
- **API Framework**: Next.js API Routes
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Database ORM**: Prisma
- **Validation**: Zod
- **Real-time**: Socket.IO (WebSocket)

### Database
- **Primary**: PostgreSQL 15+
- **Caching**: Redis 7+
- **Search**: PostgreSQL Full-Text Search (or Elasticsearch for scale)

### ML/AI Pipeline (Python)
- **Framework**: FastAPI
- **Deep Learning**: PyTorch 2.0+
- **Object Detection**: Ultralytics YOLOv8/v11
- **Vision-Language**: OpenAI CLIP / Hugging Face Transformers
- **Image Processing**: OpenCV, Pillow
- **Model Serving**: TorchServe or custom FastAPI endpoints

### Hardware/Edge
- **Devices**: Raspberry Pi 4/5, ESP32-CAM
- **Edge ML**: TensorFlow Lite, ONNX Runtime
- **Protocols**: MQTT (Mosquitto), WebSocket, HTTP
- **Message Queue**: RabbitMQ or Redis Pub/Sub

### DevOps & Infrastructure
- **Containers**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston (Node.js), Python logging
- **Cloud**: AWS/Azure/GCP (S3 for images, EC2/Cloud Run for compute)

---

## 📁 Project Structure

```
shelfsense/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Landing pages (public)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── pricing/
│   │   │   ├── about/
│   │   │   └── contact/
│   │   │
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── layout.tsx            # Dashboard layout
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── stores/               # Store management
│   │   │   ├── shelves/              # Shelf monitoring
│   │   │   ├── alerts/               # Alert management
│   │   │   ├── analytics/            # Analytics & reports
│   │   │   └── settings/             # User settings
│   │   │
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # NextAuth endpoints
│   │   │   ├── stores/
│   │   │   ├── shelves/
│   │   │   ├── alerts/
│   │   │   ├── analytics/
│   │   │   ├── ml/                   # ML inference proxy
│   │   │   └── hardware/             # Hardware management
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── marketing/                # Landing page components
│   │   ├── dashboard/                # Dashboard components
│   │   ├── ui/                       # Reusable UI components
│   │   └── shared/                   # Shared utilities
│   │
│   ├── lib/                          # Utilities & helpers
│   │   ├── auth.ts                   # Authentication config
│   │   ├── db.ts                     # Database client
│   │   ├── redis.ts                  # Redis client
│   │   ├── socket.ts                 # WebSocket client
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useRealtime.ts
│   │   └── useAnalytics.ts
│   │
│   └── types/                        # TypeScript types
│       ├── api.ts
│       ├── models.ts
│       └── hardware.ts
│
├── ml-service/                       # Python ML Microservice
│   ├── api/
│   │   ├── main.py                   # FastAPI app
│   │   ├── routers/
│   │   │   ├── detection.py          # Object detection
│   │   │   ├── classification.py     # Product classification
│   │   │   └── planogram.py          # Planogram analysis
│   │   └── dependencies.py
│   │
│   ├── models/
│   │   ├── yolo/                     # YOLOv8 models
│   │   ├── clip/                     # CLIP models
│   │   └── custom/                   # Custom models
│   │
│   ├── core/
│   │   ├── config.py                 # Configuration
│   │   ├── inference.py              # Inference engine
│   │   └── preprocessing.py          # Image preprocessing
│   │
│   ├── utils/
│   │   ├── image_utils.py
│   │   └── bbox_utils.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── hardware/                         # Edge device code
│   ├── raspberry-pi/
│   │   ├── camera_client.py          # Camera capture
│   │   ├── sensor_reader.py          # Sensor data
│   │   └── mqtt_client.py            # MQTT communication
│   │
│   ├── esp32-cam/
│   │   └── firmware.ino              # Arduino firmware
│   │
│   └── edge-inference/
│       ├── tflite_model.py           # TF Lite inference
│       └── onnx_model.py             # ONNX inference
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/
│
├── docker/
│   ├── docker-compose.yml            # Multi-container setup
│   ├── Dockerfile.nextjs
│   ├── Dockerfile.ml
│   └── Dockerfile.mqtt
│
├── docs/
│   ├── API.md                        # API documentation
│   ├── HARDWARE.md                   # Hardware setup guide
│   ├── DEPLOYMENT.md                 # Deployment instructions
│   └── ML_MODELS.md                  # ML model details
│
└── scripts/
    ├── setup.sh                      # Project setup
    ├── seed-db.js                    # Database seeding
    └── train-model.py                # Model training
```

---

## 🔄 Data Flow

### 1. Image Capture Flow
```
Camera → Edge Device → MQTT Broker → Backend API → ML Service → Database
                                    ↓
                              WebSocket → Frontend
```

### 2. Real-time Alert Flow
```
ML Detection → Alert Engine → Redis Queue → WebSocket Server → Dashboard
                            ↓
                        Database (Logging)
```

### 3. Analytics Flow
```
Database → API → Aggregation → Cache (Redis) → Frontend Charts
```

---

## 🔐 Authentication & Authorization

- **NextAuth.js** with JWT + Database sessions
- **Providers**: Email/Password, Google OAuth, Microsoft OAuth
- **Roles**: Admin, Manager, Viewer
- **Multi-tenancy**: Organization-based data isolation

---

## 🚀 Deployment Strategy

### Development
- Local Docker Compose setup
- PostgreSQL + Redis containers
- ML service on localhost
- Next.js dev server

### Staging
- AWS/Azure staging environment
- RDS PostgreSQL
- ElastiCache Redis
- ECS/Cloud Run for services

### Production
- Kubernetes cluster
- Managed databases
- CDN for static assets
- Auto-scaling ML workers
- Multi-region support

---

## 📈 Scalability Considerations

1. **Horizontal Scaling**: ML service can scale with number of cameras
2. **Caching**: Redis for frequent queries and ML results
3. **CDN**: Image storage on S3 + CloudFront
4. **Load Balancing**: NGINX or AWS ALB
5. **Database**: Read replicas for analytics queries
6. **Message Queue**: RabbitMQ for async processing

---

## 🔒 Security

- HTTPS/TLS for all communications
- API authentication via JWT
- Hardware device authentication (API keys)
- Image encryption at rest
- Rate limiting on API endpoints
- CORS configuration
- SQL injection prevention (Prisma ORM)
- XSS protection (React escaping)

---

## 📊 Monitoring & Observability

- **Application Logs**: Winston (Node.js), Python logging
- **Metrics**: Prometheus + Grafana
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Better Uptime or StatusCake
- **Performance**: Next.js Analytics, Web Vitals

---

## 🧪 Testing Strategy

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright
- **API Tests**: Supertest
- **ML Model Tests**: PyTest + model validation
- **E2E Tests**: Playwright for critical flows

---

## 🛠️ Development Workflow

1. **Local Setup**: Docker Compose for all services
2. **Feature Development**: Feature branches + PRs
3. **Code Review**: Required before merge
4. **CI Pipeline**: Lint, Test, Build
5. **CD Pipeline**: Auto-deploy to staging, manual production
6. **Rollback**: Blue-green deployment strategy

---

## 📱 Mobile Support

- **Responsive Web**: Mobile-first design with Tailwind
- **PWA**: Service workers for offline capability
- **Future**: React Native app with shared logic

---

## 🎯 MVP Features (Phase 1)

1. ✅ Landing page with authentication
2. ⏳ Basic dashboard with store list
3. ⏳ Single camera feed integration
4. ⏳ YOLOv8 object detection
5. ⏳ Out-of-stock alert system
6. ⏳ Real-time WebSocket updates
7. ⏳ Basic analytics (shelf occupancy %)

## Future Enhancements (Phase 2+)

- CLIP-based visual search
- Planogram compliance scoring
- Predictive restocking (ML forecasting)
- Mobile app (React Native)
- Multi-language support
- Advanced analytics (trends, heatmaps)
- Integration with POS systems
- Automated restocking orders
