# ML Service Simulation Tools

This directory contains simulation tools for testing and demonstrating ShelfSense ML capabilities without requiring actual hardware or trained models.

## Files

### 1. `ml_simulator.py`
Complete ML inference simulator with YOLOv8 and CLIP models.

**Features:**
- Product database with 15 common retail products
- YOLOv8 object detection simulation with realistic bounding boxes
- CLIP-based shelf condition classification
- Time series data generation for analytics
- Store-wide analytics aggregation

**Usage:**
```python
from ml_simulator import DataGenerator

generator = DataGenerator()

# Generate single shelf snapshot
snapshot = generator.generate_shelf_snapshot("shelf_001", "store_001")

# Generate 24h time series
time_series = generator.generate_time_series_data("shelf_001", "store_001", hours=24)

# Generate store analytics
analytics = generator.generate_store_analytics("store_001", num_shelves=12)
```

**Outputs:**
- Product detections with confidence scores (0.85-0.99)
- Bounding box coordinates
- Misplaced product detection (5% probability)
- Low stock alerts (15% probability)
- Shelf condition scores (0-100)
- Comprehensive metrics

### 2. `opencv_simulator.py`
OpenCV image processing pipeline simulator.

**Features:**
- Image preprocessing simulation (denoising, contrast, edge detection)
- ROI (Region of Interest) detection
- Shelf segmentation into grid
- Quality analysis metrics

**Simulated Operations:**
- Gaussian Blur & Denoising
- CLAHE Contrast Enhancement
- Canny Edge Detection
- White Balance & Color Correction
- Perspective Transform
- Quality scoring (brightness, sharpness, noise, contrast)

**Usage:**
```python
from opencv_simulator import generate_complete_analysis

# Run complete analysis pipeline
analysis = generate_complete_analysis("img_001")

print(f"Quality Score: {analysis['quality_analysis']['overall_quality_score']}/100")
print(f"Ready for Detection: {analysis['ready_for_detection']}")
```

**Metrics:**
- Preprocessing time: 100-250ms
- Quality scores for: brightness, contrast, sharpness, noise, color accuracy
- ROI detection: 3-8 regions per image
- Shelf segmentation: 3-6 rows × 4-10 columns

### 3. `stream_simulator.py`
Real-time data stream simulator for WebSocket/streaming scenarios.

**Features:**
- Multi-camera stream simulation
- 30 FPS frame generation
- Real-time detection events
- Alert generation
- System status monitoring
- Metrics aggregation

**Usage:**
```python
import asyncio
from stream_simulator import StreamSimulator

async def run():
    simulator = StreamSimulator()
    
    # Simulate 4 cameras for 30 seconds
    await simulator.simulate_multi_camera(num_cameras=4, duration_seconds=30)

asyncio.run(run())
```

**Event Types:**
- `detection`: Product detection results (70% of events)
- `alert`: Low stock, misplaced items, violations (20% of events)
- `status`: System health metrics (10% of events)

## Running Simulations

### Quick Test
```bash
# Test ML simulator
cd ml-service/simulation
python ml_simulator.py

# Test OpenCV simulator
python opencv_simulator.py

# Test stream simulator
python stream_simulator.py
```

### Integration with Dashboard
The simulation data is integrated with the Next.js dashboard via API routes:

```typescript
// Fetch simulated data
const response = await fetch('/api/simulation?type=store&storeId=store_001');
const analytics = await response.json();
```

## Simulation Parameters

### Detection Confidence
- Threshold: 0.75 (adjustable)
- Realistic range: 0.85-0.99
- Distribution: Normal with mean=0.92

### Shelf Conditions
- Excellent: Score ≥ 85
- Good: Score 70-84
- Fair: Score 50-69
- Poor: Score < 50

### Alert Probabilities
- Misplaced products: 5%
- Low stock: 15%
- Empty sections: 10%

### Performance Metrics
- Image preprocessing: 100-250ms
- YOLOv8 detection: 80-250ms
- CLIP classification: 50-150ms
- Total pipeline: 200-600ms

## Data Realism

The simulators generate realistic data based on:
- Actual retail product distributions
- Industry-standard detection accuracies (98%+)
- Real-world shelf occupancy patterns
- Daily traffic patterns (peak hours 9-11 AM, 5-8 PM)
- Typical alert frequencies

## Extending Simulations

### Add New Products
Edit `ProductDatabase.PRODUCTS` in `ml_simulator.py`:
```python
{"id": "P016", "name": "New Product", "category": "Category", "price": 4.99, "brand": "Brand"}
```

### Adjust Detection Parameters
```python
# In YOLOv8Simulator.__init__
self.confidence_threshold = 0.80  # Lower for more detections
```

### Customize Event Distribution
```python
# In StreamSimulator._generate_detection_event
event_type = random.choices(
    ["detection", "alert", "status"],
    weights=[0.8, 0.15, 0.05]  # Adjust weights
)[0]
```

## Notes

- All timestamps use ISO 8601 format
- Bounding boxes use absolute pixel coordinates
- No actual image processing occurs (simulation only)
- Data generation is deterministic within realistic ranges
- Perfect for demos, testing, and development

## Next Steps

1. Replace simulators with actual ML models
2. Integrate real camera feeds
3. Connect to production database
4. Add model versioning and A/B testing
5. Implement model performance monitoring
