"""
Real-time Data Stream Simulator for ShelfSense
Simulates WebSocket streaming of detection events
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List
import random

class StreamSimulator:
    """Simulates real-time data streams"""
    
    def __init__(self):
        self.active_cameras = []
        self.event_queue = []
        
    async def simulate_camera_stream(self, camera_id: str, duration_seconds: int = 60):
        """Simulate a camera stream for specified duration"""
        
        print(f"📹 Starting camera stream: {camera_id}")
        start_time = datetime.now()
        frame_count = 0
        
        try:
            while (datetime.now() - start_time).seconds < duration_seconds:
                # Simulate frame capture (30 FPS)
                await asyncio.sleep(1/30)
                frame_count += 1
                
                # Every 30 frames (1 second), run detection
                if frame_count % 30 == 0:
                    event = self._generate_detection_event(camera_id, frame_count)
                    self.event_queue.append(event)
                    
                    # Print event summary
                    if event["type"] == "detection":
                        print(f"  [{event['timestamp']}] Detected {event['data']['num_products']} products")
                    elif event["type"] == "alert":
                        print(f"  [{event['timestamp']}] ⚠️  Alert: {event['data']['message']}")
        
        except asyncio.CancelledError:
            print(f"📹 Camera stream stopped: {camera_id}")
            raise
        
        print(f"📹 Camera stream completed: {camera_id} ({frame_count} frames)")
        return self.event_queue
    
    def _generate_detection_event(self, camera_id: str, frame_number: int) -> Dict:
        """Generate a detection event"""
        
        event_type = random.choices(
            ["detection", "alert", "status"],
            weights=[0.7, 0.2, 0.1]
        )[0]
        
        if event_type == "detection":
            return {
                "type": "detection",
                "camera_id": camera_id,
                "frame_number": frame_number,
                "timestamp": datetime.now().isoformat(),
                "data": {
                    "num_products": random.randint(5, 20),
                    "avg_confidence": round(random.uniform(0.85, 0.99), 4),
                    "processing_time_ms": random.randint(80, 250),
                    "detections": [
                        {
                            "product_id": f"P{random.randint(1, 15):03d}",
                            "confidence": round(random.uniform(0.85, 0.99), 4),
                            "bbox": {
                                "x": random.randint(0, 1600),
                                "y": random.randint(0, 800),
                                "width": random.randint(80, 200),
                                "height": random.randint(100, 250)
                            }
                        }
                        for _ in range(random.randint(1, 5))
                    ]
                }
            }
        
        elif event_type == "alert":
            alert_types = [
                "Low stock detected",
                "Misplaced product",
                "Empty shelf section",
                "Planogram violation"
            ]
            return {
                "type": "alert",
                "camera_id": camera_id,
                "frame_number": frame_number,
                "timestamp": datetime.now().isoformat(),
                "data": {
                    "severity": random.choice(["low", "medium", "high"]),
                    "message": random.choice(alert_types),
                    "shelf_id": f"shelf_{random.randint(1, 12)}",
                    "requires_action": random.choice([True, False])
                }
            }
        
        else:  # status
            return {
                "type": "status",
                "camera_id": camera_id,
                "frame_number": frame_number,
                "timestamp": datetime.now().isoformat(),
                "data": {
                    "fps": round(random.uniform(28, 31), 2),
                    "latency_ms": random.randint(50, 150),
                    "cpu_usage": round(random.uniform(30, 70), 2),
                    "memory_usage_mb": random.randint(200, 500),
                    "status": "healthy"
                }
            }
    
    async def simulate_multi_camera(self, num_cameras: int = 4, duration_seconds: int = 30):
        """Simulate multiple cameras streaming simultaneously"""
        
        print(f"\n🎬 Starting {num_cameras} camera streams for {duration_seconds} seconds...\n")
        
        tasks = [
            self.simulate_camera_stream(f"camera_{i+1:02d}", duration_seconds)
            for i in range(num_cameras)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        print(f"\n✅ Simulation complete! Generated {len(self.event_queue)} events")
        return results


class MetricsAggregator:
    """Aggregates real-time metrics from stream"""
    
    def __init__(self):
        self.metrics = {
            "total_detections": 0,
            "total_alerts": 0,
            "avg_processing_time": 0,
            "avg_confidence": 0,
            "events_per_second": 0
        }
    
    def update_metrics(self, events: List[Dict]) -> Dict:
        """Update metrics from event stream"""
        
        if not events:
            return self.metrics
        
        detection_events = [e for e in events if e["type"] == "detection"]
        alert_events = [e for e in events if e["type"] == "alert"]
        
        self.metrics["total_detections"] = len(detection_events)
        self.metrics["total_alerts"] = len(alert_events)
        
        if detection_events:
            self.metrics["avg_processing_time"] = round(
                sum(e["data"]["processing_time_ms"] for e in detection_events) / len(detection_events),
                2
            )
            self.metrics["avg_confidence"] = round(
                sum(e["data"]["avg_confidence"] for e in detection_events) / len(detection_events),
                4
            )
        
        # Calculate events per second
        if len(events) > 1:
            first_time = datetime.fromisoformat(events[0]["timestamp"])
            last_time = datetime.fromisoformat(events[-1]["timestamp"])
            duration = (last_time - first_time).total_seconds()
            if duration > 0:
                self.metrics["events_per_second"] = round(len(events) / duration, 2)
        
        return self.metrics


async def main():
    """Demo of stream simulator"""
    
    simulator = StreamSimulator()
    aggregator = MetricsAggregator()
    
    # Simulate 4 cameras for 30 seconds
    await simulator.simulate_multi_camera(num_cameras=4, duration_seconds=30)
    
    # Aggregate metrics
    metrics = aggregator.update_metrics(simulator.event_queue)
    
    print("\n📊 Stream Metrics:")
    print(f"  Total Detections: {metrics['total_detections']}")
    print(f"  Total Alerts: {metrics['total_alerts']}")
    print(f"  Avg Processing Time: {metrics['avg_processing_time']}ms")
    print(f"  Avg Confidence: {metrics['avg_confidence']}")
    print(f"  Events/Second: {metrics['events_per_second']}")


if __name__ == "__main__":
    asyncio.run(main())
