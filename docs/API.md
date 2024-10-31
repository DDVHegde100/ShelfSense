# ShelfSense API Documentation

## Base URLs

- **Production**: `https://api.shelfsense.com`
- **Development**: `http://localhost:3000/api`
- **ML Service**: `http://localhost:8000/api/v1`

## Authentication

All API requests require authentication using JWT tokens.

### Get Access Token

```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "...",
  "expires_in": 3600
}
```

### Use Token

```bash
Authorization: Bearer <access_token>
```

---

## Endpoints

### Stores

#### List Stores
```bash
GET /api/stores
Authorization: Bearer <token>
```

Response:
```json
{
  "stores": [
    {
      "id": "store_123",
      "name": "Downtown Store",
      "address": "123 Main St",
      "city": "New York",
      "isActive": true
    }
  ],
  "total": 1
}
```

#### Create Store
```bash
POST /api/stores
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Store",
  "address": "456 Oak Ave",
  "city": "Boston",
  "state": "MA",
  "zipCode": "02101"
}
```

#### Get Store Details
```bash
GET /api/stores/:storeId
Authorization: Bearer <token>
```

---

### Shelves

#### List Shelves
```bash
GET /api/shelves?storeId=store_123
Authorization: Bearer <token>
```

Response:
```json
{
  "shelves": [
    {
      "id": "shelf_456",
      "name": "Aisle 3 - Shelf B",
      "section": "Beverages",
      "aisle": "3",
      "level": 2,
      "isActive": true,
      "lastInspection": "2025-11-16T10:30:00Z"
    }
  ]
}
```

#### Get Shelf Analytics
```bash
GET /api/shelves/:shelfId/analytics
Authorization: Bearer <token>
Query: ?startDate=2025-11-01&endDate=2025-11-16
```

Response:
```json
{
  "occupancyRate": 87.5,
  "outOfStockEvents": 12,
  "averageRestockTime": 45,
  "complianceScore": 92.3,
  "trends": {
    "daily": [...]
  }
}
```

---

### Alerts

#### List Alerts
```bash
GET /api/alerts
Authorization: Bearer <token>
Query: ?status=ACTIVE&severity=HIGH&storeId=store_123
```

Response:
```json
{
  "alerts": [
    {
      "id": "alert_789",
      "type": "OUT_OF_STOCK",
      "severity": "HIGH",
      "title": "Out of Stock Detected",
      "message": "Coca-Cola 12oz out of stock on Aisle 3",
      "status": "ACTIVE",
      "createdAt": "2025-11-16T14:20:00Z"
    }
  ],
  "total": 1
}
```

#### Acknowledge Alert
```bash
POST /api/alerts/:alertId/acknowledge
Authorization: Bearer <token>
```

#### Resolve Alert
```bash
POST /api/alerts/:alertId/resolve
Authorization: Bearer <token>
Content-Type: application/json

{
  "resolution": "Restocked 24 units"
}
```

---

### Hardware

#### Register Camera
```bash
POST /api/hardware/cameras
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "cam-001",
  "shelfId": "shelf_456",
  "name": "Aisle 3 Camera",
  "model": "Raspberry Pi Camera v2"
}
```

#### Camera Heartbeat
```bash
POST /api/hardware/heartbeat
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "device_id": "cam-001",
  "timestamp": "2025-11-16T14:25:00Z"
}
```

#### Upload Snapshot
```bash
POST /api/hardware/snapshot
Authorization: Bearer <api_key>
Content-Type: multipart/form-data

device_id: cam-001
captured_at: 2025-11-16T14:30:00Z
image: <binary data>
```

---

## ML Service API

### Object Detection

```bash
POST /api/v1/detection/detect
Content-Type: multipart/form-data

image: <file>
confidence_threshold: 0.5
iou_threshold: 0.45
```

Response:
```json
{
  "detections": [
    {
      "class": "product",
      "confidence": 0.95,
      "bbox": [0.1, 0.2, 0.3, 0.4]
    }
  ],
  "total_detections": 15,
  "processing_time_ms": 125
}
```

### Product Classification

```bash
POST /api/v1/classification/classify
Content-Type: multipart/form-data

image: <file>
candidate_labels: ["Coca-Cola", "Pepsi", "Sprite"]
```

Response:
```json
{
  "predictions": [
    {"label": "Coca-Cola", "confidence": 0.92},
    {"label": "Pepsi", "confidence": 0.05},
    {"label": "Sprite", "confidence": 0.03}
  ],
  "top_prediction": "Coca-Cola",
  "confidence": 0.92
}
```

### Planogram Compliance

```bash
POST /api/v1/planogram/analyze
Content-Type: multipart/form-data

shelf_image: <file>
planogram_image: <file>
```

Response:
```json
{
  "compliance_score": 87.5,
  "violations": [
    {
      "type": "misplaced_product",
      "location": [0.5, 0.3, 0.1, 0.15],
      "severity": "medium",
      "description": "Product in wrong position"
    }
  ],
  "total_violations": 1,
  "recommendations": ["Move Coca-Cola to position A3"]
}
```

---

## WebSocket Events

Connect to WebSocket server for real-time updates:

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: '<jwt_token>' }
});

// Listen for alerts
socket.on('alert:new', (alert) => {
  console.log('New alert:', alert);
});

// Listen for shelf updates
socket.on('shelf:updated', (data) => {
  console.log('Shelf updated:', data);
});

// Listen for camera status
socket.on('camera:status', (status) => {
  console.log('Camera status:', status);
});
```

---

## Rate Limits

- **Free Tier**: 100 requests/hour
- **Starter**: 1,000 requests/hour
- **Professional**: 10,000 requests/hour
- **Enterprise**: Unlimited

---

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Invalid or missing token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |
| 503  | Service Unavailable |

Error Response:
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: storeId",
    "details": {}
  }
}
```

---

## SDKs

### JavaScript/TypeScript
```bash
npm install @shelfsense/sdk
```

```typescript
import { ShelfSense } from '@shelfsense/sdk';

const client = new ShelfSense({ apiKey: 'your-api-key' });

// List stores
const stores = await client.stores.list();

// Get alerts
const alerts = await client.alerts.list({ status: 'ACTIVE' });
```

### Python
```bash
pip install shelfsense
```

```python
from shelfsense import ShelfSenseClient

client = ShelfSenseClient(api_key='your-api-key')

# List stores
stores = client.stores.list()

# Upload image
client.hardware.upload_snapshot(
    device_id='cam-001',
    image_path='shelf.jpg'
)
```

---

## Webhooks

Configure webhooks to receive real-time notifications:

```bash
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-server.com/webhooks/shelfsense",
  "events": ["alert.created", "shelf.updated"],
  "secret": "webhook_secret"
}
```

Webhook Payload:
```json
{
  "event": "alert.created",
  "timestamp": "2025-11-16T14:30:00Z",
  "data": {
    "alert": { ... }
  }
}
```
