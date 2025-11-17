"""
ML Model Simulator for ShelfSense
Simulates YOLOv8 object detection and CLIP classification outputs
"""

import numpy as np
import random
from typing import List, Dict, Tuple
from datetime import datetime, timedelta
import json

class ProductDatabase:
    """Simulated product database"""
    
    PRODUCTS = [
        {"id": "P001", "name": "Coca Cola 2L", "category": "Beverages", "price": 2.99, "brand": "Coca Cola"},
        {"id": "P002", "name": "Pepsi 2L", "category": "Beverages", "price": 2.79, "brand": "Pepsi"},
        {"id": "P003", "name": "Sprite 2L", "category": "Beverages", "price": 2.89, "brand": "Coca Cola"},
        {"id": "P004", "name": "Mountain Dew 2L", "category": "Beverages", "price": 2.99, "brand": "Pepsi"},
        {"id": "P005", "name": "Lays Classic", "category": "Snacks", "price": 3.49, "brand": "Lays"},
        {"id": "P006", "name": "Doritos Nacho", "category": "Snacks", "price": 3.79, "brand": "Doritos"},
        {"id": "P007", "name": "Cheetos Puffs", "category": "Snacks", "price": 3.29, "brand": "Cheetos"},
        {"id": "P008", "name": "Pringles Original", "category": "Snacks", "price": 2.99, "brand": "Pringles"},
        {"id": "P009", "name": "Tide Detergent", "category": "Household", "price": 12.99, "brand": "Tide"},
        {"id": "P010", "name": "Bounty Paper Towels", "category": "Household", "price": 8.99, "brand": "Bounty"},
        {"id": "P011", "name": "Cheerios", "category": "Cereal", "price": 4.99, "brand": "General Mills"},
        {"id": "P012", "name": "Frosted Flakes", "category": "Cereal", "price": 4.79, "brand": "Kelloggs"},
        {"id": "P013", "name": "Red Bull Energy", "category": "Energy Drinks", "price": 3.99, "brand": "Red Bull"},
        {"id": "P014", "name": "Monster Energy", "category": "Energy Drinks", "price": 3.79, "brand": "Monster"},
        {"id": "P015", "name": "Gatorade Blue", "category": "Sports Drinks", "price": 2.49, "brand": "Gatorade"},
    ]
    
    @classmethod
    def get_random_product(cls) -> Dict:
        return random.choice(cls.PRODUCTS)
    
    @classmethod
    def get_product_by_id(cls, product_id: str) -> Dict:
        return next((p for p in cls.PRODUCTS if p["id"] == product_id), None)


class YOLOv8Simulator:
    """Simulates YOLOv8 object detection"""
    
    def __init__(self, confidence_threshold: float = 0.75):
        self.confidence_threshold = confidence_threshold
        self.image_width = 1920
        self.image_height = 1080
        
    def detect_objects(self, shelf_id: str, num_products: int = None) -> List[Dict]:
        """Simulate object detection on a shelf image"""
        if num_products is None:
            num_products = random.randint(5, 20)
        
        detections = []
        used_positions = []
        
        for i in range(num_products):
            # Simulate detection confidence (realistic distribution)
            confidence = random.uniform(0.85, 0.99)
            
            if confidence < self.confidence_threshold:
                continue
            
            # Generate non-overlapping bounding boxes
            bbox = self._generate_bbox(used_positions)
            used_positions.append(bbox)
            
            product = ProductDatabase.get_random_product()
            
            detection = {
                "detection_id": f"det_{shelf_id}_{i}_{int(datetime.now().timestamp())}",
                "product_id": product["id"],
                "product_name": product["name"],
                "category": product["category"],
                "brand": product["brand"],
                "confidence": round(confidence, 4),
                "bbox": bbox,
                "shelf_position": {
                    "row": random.randint(1, 5),
                    "column": random.randint(1, 10),
                },
                "is_misplaced": random.random() < 0.05,  # 5% misplaced
                "is_low_stock": random.random() < 0.15,  # 15% low stock
                "timestamp": datetime.now().isoformat()
            }
            
            detections.append(detection)
        
        return detections
    
    def _generate_bbox(self, used_positions: List[Dict]) -> Dict:
        """Generate a non-overlapping bounding box"""
        max_attempts = 50
        
        for _ in range(max_attempts):
            x = random.randint(50, self.image_width - 250)
            y = random.randint(50, self.image_height - 250)
            width = random.randint(80, 200)
            height = random.randint(100, 250)
            
            bbox = {
                "x": x,
                "y": y,
                "width": width,
                "height": height,
                "x_center": x + width // 2,
                "y_center": y + height // 2
            }
            
            # Check for overlap
            if not self._check_overlap(bbox, used_positions):
                return bbox
        
        # Fallback if couldn't find non-overlapping position
        return {
            "x": random.randint(50, self.image_width - 250),
            "y": random.randint(50, self.image_height - 250),
            "width": 150,
            "height": 200,
            "x_center": 0,
            "y_center": 0
        }
    
    def _check_overlap(self, bbox: Dict, used_positions: List[Dict]) -> bool:
        """Check if bbox overlaps with any used positions"""
        for used in used_positions:
            if (bbox["x"] < used["x"] + used["width"] and
                bbox["x"] + bbox["width"] > used["x"] and
                bbox["y"] < used["y"] + used["height"] and
                bbox["y"] + bbox["height"] > used["y"]):
                return True
        return False


class CLIPSimulator:
    """Simulates CLIP image classification and similarity"""
    
    def classify_shelf_condition(self, detections: List[Dict]) -> Dict:
        """Classify overall shelf condition"""
        num_products = len(detections)
        num_misplaced = sum(1 for d in detections if d.get("is_misplaced", False))
        num_low_stock = sum(1 for d in detections if d.get("is_low_stock", False))
        
        # Calculate condition score
        misplaced_penalty = (num_misplaced / max(num_products, 1)) * 30
        low_stock_penalty = (num_low_stock / max(num_products, 1)) * 20
        stock_level_score = min(100, (num_products / 20) * 50)
        
        overall_score = max(0, 100 - misplaced_penalty - low_stock_penalty + stock_level_score - 50)
        
        # Determine condition
        if overall_score >= 85:
            condition = "Excellent"
            color = "green"
        elif overall_score >= 70:
            condition = "Good"
            color = "blue"
        elif overall_score >= 50:
            condition = "Fair"
            color = "yellow"
        else:
            condition = "Poor"
            color = "red"
        
        return {
            "overall_score": round(overall_score, 2),
            "condition": condition,
            "color": color,
            "stock_level": "High" if num_products > 15 else "Medium" if num_products > 8 else "Low",
            "organization": "Good" if num_misplaced < 2 else "Needs Attention",
            "alerts": num_misplaced + num_low_stock,
            "recommendations": self._generate_recommendations(num_misplaced, num_low_stock, num_products)
        }
    
    def _generate_recommendations(self, num_misplaced: int, num_low_stock: int, num_products: int) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if num_misplaced > 2:
            recommendations.append("Reorganize misplaced products")
        if num_low_stock > 3:
            recommendations.append("Restock low inventory items")
        if num_products < 10:
            recommendations.append("Increase shelf stock levels")
        if num_products > 18:
            recommendations.append("Shelf at optimal capacity")
        
        return recommendations


class DataGenerator:
    """Generates realistic shelf monitoring data"""
    
    def __init__(self):
        self.yolo = YOLOv8Simulator()
        self.clip = CLIPSimulator()
        
    def generate_shelf_snapshot(self, shelf_id: str, store_id: str) -> Dict:
        """Generate a complete shelf snapshot with detections and analysis"""
        # Simulate detection
        detections = self.yolo.detect_objects(shelf_id)
        
        # Analyze with CLIP
        condition = self.clip.classify_shelf_condition(detections)
        
        # Calculate metrics
        total_value = sum(
            ProductDatabase.get_product_by_id(d["product_id"])["price"] 
            for d in detections 
            if ProductDatabase.get_product_by_id(d["product_id"])
        )
        
        snapshot = {
            "snapshot_id": f"snap_{shelf_id}_{int(datetime.now().timestamp())}",
            "shelf_id": shelf_id,
            "store_id": store_id,
            "timestamp": datetime.now().isoformat(),
            "detections": detections,
            "metrics": {
                "total_products": len(detections),
                "unique_products": len(set(d["product_id"] for d in detections)),
                "avg_confidence": round(np.mean([d["confidence"] for d in detections]), 4) if detections else 0,
                "total_value": round(total_value, 2),
                "misplaced_count": sum(1 for d in detections if d.get("is_misplaced")),
                "low_stock_count": sum(1 for d in detections if d.get("is_low_stock")),
            },
            "condition": condition,
            "processing_time_ms": random.randint(80, 250)
        }
        
        return snapshot
    
    def generate_time_series_data(self, shelf_id: str, store_id: str, hours: int = 24) -> List[Dict]:
        """Generate historical time series data"""
        data_points = []
        current_time = datetime.now()
        
        # Generate data points every 30 minutes
        intervals = hours * 2
        
        for i in range(intervals):
            timestamp = current_time - timedelta(minutes=30 * (intervals - i))
            
            # Simulate daily patterns
            hour = timestamp.hour
            if 9 <= hour <= 11 or 17 <= hour <= 20:  # Peak hours
                base_products = random.randint(15, 20)
            elif 6 <= hour <= 8 or 13 <= hour <= 16:  # Moderate
                base_products = random.randint(10, 15)
            else:  # Off-peak
                base_products = random.randint(5, 12)
            
            detections = self.yolo.detect_objects(shelf_id, base_products)
            condition = self.clip.classify_shelf_condition(detections)
            
            data_point = {
                "timestamp": timestamp.isoformat(),
                "product_count": len(detections),
                "condition_score": condition["overall_score"],
                "misplaced": sum(1 for d in detections if d.get("is_misplaced")),
                "low_stock": sum(1 for d in detections if d.get("is_low_stock")),
                "avg_confidence": round(np.mean([d["confidence"] for d in detections]), 4) if detections else 0,
            }
            
            data_points.append(data_point)
        
        return data_points
    
    def generate_store_analytics(self, store_id: str, num_shelves: int = 12) -> Dict:
        """Generate store-wide analytics"""
        shelf_snapshots = []
        
        for i in range(num_shelves):
            shelf_id = f"shelf_{store_id}_{i+1:03d}"
            snapshot = self.generate_shelf_snapshot(shelf_id, store_id)
            shelf_snapshots.append(snapshot)
        
        # Aggregate metrics
        total_products = sum(s["metrics"]["total_products"] for s in shelf_snapshots)
        total_value = sum(s["metrics"]["total_value"] for s in shelf_snapshots)
        avg_confidence = np.mean([s["metrics"]["avg_confidence"] for s in shelf_snapshots])
        total_alerts = sum(s["condition"]["alerts"] for s in shelf_snapshots)
        
        # Calculate efficiency
        shelves_good = sum(1 for s in shelf_snapshots if s["condition"]["overall_score"] >= 70)
        efficiency = (shelves_good / num_shelves) * 100
        
        analytics = {
            "store_id": store_id,
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_shelves": num_shelves,
                "total_products": total_products,
                "total_value": round(total_value, 2),
                "avg_confidence": round(avg_confidence, 4),
                "total_alerts": total_alerts,
                "efficiency_score": round(efficiency, 2)
            },
            "shelf_snapshots": shelf_snapshots,
            "performance": {
                "excellent_shelves": sum(1 for s in shelf_snapshots if s["condition"]["condition"] == "Excellent"),
                "good_shelves": sum(1 for s in shelf_snapshots if s["condition"]["condition"] == "Good"),
                "fair_shelves": sum(1 for s in shelf_snapshots if s["condition"]["condition"] == "Fair"),
                "poor_shelves": sum(1 for s in shelf_snapshots if s["condition"]["condition"] == "Poor"),
            }
        }
        
        return analytics


if __name__ == "__main__":
    # Demo
    generator = DataGenerator()
    
    print("=== ShelfSense ML Simulator ===\n")
    
    # Generate single snapshot
    print("1. Generating shelf snapshot...")
    snapshot = generator.generate_shelf_snapshot("shelf_001", "store_001")
    print(f"   - Detected {snapshot['metrics']['total_products']} products")
    print(f"   - Condition: {snapshot['condition']['condition']} ({snapshot['condition']['overall_score']}/100)")
    print(f"   - Alerts: {snapshot['condition']['alerts']}")
    
    # Generate time series
    print("\n2. Generating 24h time series data...")
    time_series = generator.generate_time_series_data("shelf_001", "store_001", hours=24)
    print(f"   - Generated {len(time_series)} data points")
    
    # Generate store analytics
    print("\n3. Generating store-wide analytics...")
    analytics = generator.generate_store_analytics("store_001", num_shelves=12)
    print(f"   - Total products: {analytics['summary']['total_products']}")
    print(f"   - Total value: ${analytics['summary']['total_value']}")
    print(f"   - Efficiency: {analytics['summary']['efficiency_score']}%")
    print(f"   - Total alerts: {analytics['summary']['total_alerts']}")
    
    print("\n✅ Simulation complete!")
