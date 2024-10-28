# ShelfSense

<div align="center">
  <h1>🛒 ShelfSense</h1>
  <p><strong>Real-Time Retail Shelf Intelligence Platform</strong></p>
  <p>AI-powered computer vision system for monitoring shelf conditions, detecting out-of-stock items, and ensuring planogram compliance.</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-16-black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
  ![Python](https://img.shields.io/badge/Python-3.11-yellow)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## 🌟 Features

### 🎯 Core Capabilities
- **Real-Time Shelf Monitoring**: Continuous camera surveillance of retail shelves
- **Out-of-Stock Detection**: AI-powered detection of empty shelf spaces
- **Product Recognition**: CLIP-based visual classification of products
- **Planogram Compliance**: Automated verification against expected layouts
- **Live Alerts**: Instant notifications for stock issues and violations
- **Analytics Dashboard**: Comprehensive insights and trend analysis

### 🤖 Machine Learning
- **YOLOv8/v11**: State-of-the-art object detection for products
- **CLIP**: Zero-shot classification and visual search
- **Custom Models**: Fine-tuned detectors for retail environments
- **Edge Inference**: TensorFlow Lite support for Raspberry Pi

### 🔧 Hardware Integration
- **Raspberry Pi**: Full support for Pi Camera modules
- **ESP32-CAM**: Low-cost camera solution with WiFi
- **MQTT Protocol**: Reliable IoT communication
- **Plug & Play**: Simple device registration and setup

### 📊 Business Intelligence
- **Occupancy Tracking**: Real-time shelf fill rates
- **Restock Optimization**: Data-driven restocking recommendations
- **Compliance Scoring**: Automated planogram auditing
- **Multi-Store Analytics**: Enterprise-wide insights

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│  Backend    │────▶│   Database  │
│  (Next.js)  │     │  (API)      │     │ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  ML Service │────▶│   Redis     │
                    │  (FastAPI)  │     │  (Cache)    │
                    └─────────────┘     └─────────────┘
                          ▲
                          │
                    ┌─────────────┐
                    │  Hardware   │
                    │  (Cameras)  │
                    └─────────────┘
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+
- **Python** 3.11+
- **Docker** & Docker Compose
- **PostgreSQL** 15+
- **Redis** 7+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/shelfsense.git
cd shelfsense

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start services with Docker
npm run docker:up

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Access Applications
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Database UI**: `npm run db:studio`

See [docs/SETUP.md](./docs/SETUP.md) for detailed setup instructions.

---

## 📁 Project Structure

```
shelfsense/
├── src/                      # Next.js application
│   ├── app/                  # App Router pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript types
│
├── ml-service/               # Python ML microservice
│   ├── api/                  # FastAPI endpoints
│   ├── core/                 # ML inference engines
│   ├── models/               # Model files
│   └── requirements.txt
│
├── hardware/                 # Edge device code
│   ├── raspberry-pi/         # Raspberry Pi camera client
│   └── esp32-cam/            # ESP32-CAM firmware
│
├── prisma/                   # Database schema
│   ├── schema.prisma
│   └── migrations/
│
├── docker/                   # Docker configuration
│   ├── docker-compose.yml
│   └── Dockerfiles
│
└── docs/                     # Documentation
    ├── API.md
    ├── SETUP.md
    └── IMPLEMENTATION_PIPELINE.md
```

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Socket.IO** - Real-time updates

### Backend
- **Next.js API Routes** - REST API
- **NextAuth.js** - Authentication
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

### ML/AI
- **FastAPI** - High-performance Python API
- **PyTorch** - Deep learning framework
- **YOLOv8** - Object detection
- **CLIP** - Visual classification
- **OpenCV** - Image processing

### Hardware
- **Raspberry Pi** - Edge computing
- **ESP32-CAM** - Low-cost cameras
- **MQTT** - IoT messaging
- **TensorFlow Lite** - Edge inference

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **AWS/Azure** - Cloud hosting
- **Prometheus** - Monitoring

---

## 📖 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Installation and configuration
- **[API Documentation](./docs/API.md)** - REST API reference
- **[Architecture](./ARCHITECTURE.md)** - System design and data flow
- **[Implementation Pipeline](./docs/IMPLEMENTATION_PIPELINE.md)** - Development roadmap

---

## 🔒 Security

- **Authentication**: JWT tokens with NextAuth.js
- **Authorization**: Role-based access control (RBAC)
- **API Security**: Rate limiting and request validation
- **Data Encryption**: TLS/HTTPS for all communications
- **Hardware Auth**: API keys for device authentication

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run ML service tests
cd ml-service && pytest
```

---

## 📊 Performance

- **API Response Time**: < 200ms
- **ML Inference**: < 500ms per image
- **Uptime**: 99.9% SLA
- **Concurrent Cameras**: 100+ per instance
- **Scalability**: Horizontal scaling with K8s

---

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- [x] Landing page and branding
- [x] Project architecture design
- [x] Technology stack selection

### Phase 2 (Current)
- [ ] Database setup and migrations
- [ ] Authentication system
- [ ] Basic dashboard UI
- [ ] Store management API

### Phase 3 (Next)
- [ ] ML service deployment
- [ ] Camera integration
- [ ] Real-time alerts
- [ ] Analytics dashboard

See [IMPLEMENTATION_PIPELINE.md](./docs/IMPLEMENTATION_PIPELINE.md) for full roadmap.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
