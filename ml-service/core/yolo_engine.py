"""
YOLOv8 Detection Engine for ShelfSense
Real-time product detection and shelf analysis
"""
import torch
import numpy as np
from typing import List, Dict, Optional, Tuple
from pathlib import Path
import cv2
from ultralytics import YOLO
from ultralytics.engine.results import Results
import logging

from .config import config

logger = logging.getLogger(__name__)


class YOLODetectionEngine:
    """
    Production-ready YOLO detection engine with:
    - Batch processing
    - Multi-GPU support
    - FP16 inference
    - Result caching
    """
    
    def __init__(
        self,
        model_path: Optional[str] = None,
        device: Optional[str] = None,
        half: bool = True
    ):
        """
        Initialize YOLO detection engine
        
        Args:
            model_path: Path to YOLO weights (.pt file)
            device: Device to run inference on (cuda:0, cpu)
            half: Use FP16 precision for faster inference
        """
        self.device = device or config.yolo.device
        self.half = half and self.device != "cpu"
        
        # Load model
        model_path = model_path or config.yolo.weights_path
        logger.info(f"Loading YOLO model from {model_path}")
        
        try:
            self.model = YOLO(model_path)
            self.model.to(self.device)
            
            if self.half:
                self.model.model.half()
                logger.info("FP16 precision enabled")
            
            logger.info(f"YOLO model loaded successfully on {self.device}")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {e}")
            raise
        
        # Configuration
        self.conf_threshold = config.yolo.conf_threshold
        self.iou_threshold = config.yolo.iou_threshold
        self.max_det = config.yolo.max_det
        self.imgsz = config.yolo.imgsz
        
        # Warmup
        self._warmup()
    
    def _warmup(self):
        """Warmup the model with dummy inference"""
        logger.info("Warming up YOLO model...")
        dummy_img = np.zeros((self.imgsz, self.imgsz, 3), dtype=np.uint8)
        self.detect(dummy_img)
        logger.info("Warmup complete")
    
    def detect(
        self,
        image: np.ndarray,
        conf: Optional[float] = None,
        iou: Optional[float] = None,
        classes: Optional[List[int]] = None,
        return_crops: bool = False
    ) -> Dict:
        """
        Run detection on a single image
        
        Args:
            image: Input image (BGR format)
            conf: Confidence threshold override
            iou: IOU threshold override
            classes: Filter by specific class IDs
            return_crops: Return cropped detections
        
        Returns:
            Dictionary containing detections with boxes, scores, classes
        """
        conf = conf or self.conf_threshold
        iou = iou or self.iou_threshold
        
        try:
            # Run inference
            results: Results = self.model(
                image,
                conf=conf,
                iou=iou,
                max_det=self.max_det,
                classes=classes,
                imgsz=self.imgsz,
                half=self.half,
                verbose=False
            )[0]
            
            # Parse results
            detections = self._parse_results(results, image, return_crops)
            
            return detections
            
        except Exception as e:
            logger.error(f"Detection failed: {e}")
            return {"error": str(e), "detections": []}
    
    def detect_batch(
        self,
        images: List[np.ndarray],
        conf: Optional[float] = None,
        iou: Optional[float] = None,
        classes: Optional[List[int]] = None
    ) -> List[Dict]:
        """
        Run batch detection on multiple images
        
        Args:
            images: List of input images (BGR format)
            conf: Confidence threshold override
            iou: IOU threshold override
            classes: Filter by specific class IDs
        
        Returns:
            List of detection dictionaries
        """
        conf = conf or self.conf_threshold
        iou = iou or self.iou_threshold
        
        try:
            # Run batch inference
            results_list = self.model(
                images,
                conf=conf,
                iou=iou,
                max_det=self.max_det,
                classes=classes,
                imgsz=self.imgsz,
                half=self.half,
                verbose=False,
                stream=True
            )
            
            # Parse all results
            all_detections = []
            for idx, results in enumerate(results_list):
                detections = self._parse_results(results, images[idx], return_crops=False)
                all_detections.append(detections)
            
            return all_detections
            
        except Exception as e:
            logger.error(f"Batch detection failed: {e}")
            return [{"error": str(e), "detections": []} for _ in images]
    
    def _parse_results(
        self,
        results: Results,
        image: np.ndarray,
        return_crops: bool = False
    ) -> Dict:
        """Parse YOLO results into structured format"""
        detections = []
        
        if results.boxes is not None and len(results.boxes) > 0:
            boxes = results.boxes.xyxy.cpu().numpy()  # x1, y1, x2, y2
            scores = results.boxes.conf.cpu().numpy()
            class_ids = results.boxes.cls.cpu().numpy().astype(int)
            
            for idx, (box, score, class_id) in enumerate(zip(boxes, scores, class_ids)):
                detection = {
                    "box": {
                        "x1": float(box[0]),
                        "y1": float(box[1]),
                        "x2": float(box[2]),
                        "y2": float(box[3]),
                        "width": float(box[2] - box[0]),
                        "height": float(box[3] - box[1])
                    },
                    "confidence": float(score),
                    "class_id": int(class_id),
                    "class_name": results.names[class_id]
                }
                
                # Add crop if requested
                if return_crops:
                    x1, y1, x2, y2 = map(int, box)
                    crop = image[y1:y2, x1:x2]
                    detection["crop"] = crop
                
                detections.append(detection)
        
        return {
            "detections": detections,
            "count": len(detections),
            "image_shape": image.shape,
            "inference_time": results.speed
        }
    
    def analyze_shelf(self, image: np.ndarray) -> Dict:
        """
        Comprehensive shelf analysis with:
        - Product detection
        - Empty slot detection
        - Misplaced item detection
        - Shelf occupancy calculation
        """
        detections = self.detect(image, return_crops=True)
        
        if "error" in detections:
            return detections
        
        # Categorize detections
        products = []
        empty_slots = []
        misplaced = []
        
        for det in detections["detections"]:
            class_name = det["class_name"]
            if class_name == "product":
                products.append(det)
            elif class_name == "empty_slot":
                empty_slots.append(det)
            elif class_name == "misplaced":
                misplaced.append(det)
        
        # Calculate metrics
        total_slots = len(products) + len(empty_slots)
        occupancy_rate = len(products) / total_slots if total_slots > 0 else 0.0
        
        analysis = {
            "detections": detections["detections"],
            "summary": {
                "total_products": len(products),
                "empty_slots": len(empty_slots),
                "misplaced_items": len(misplaced),
                "total_slots": total_slots,
                "occupancy_rate": occupancy_rate,
                "out_of_stock_rate": len(empty_slots) / total_slots if total_slots > 0 else 0.0
            },
            "products": products,
            "empty_slots": empty_slots,
            "misplaced": misplaced,
            "alerts": self._generate_alerts(products, empty_slots, misplaced, occupancy_rate)
        }
        
        return analysis
    
    def _generate_alerts(
        self,
        products: List[Dict],
        empty_slots: List[Dict],
        misplaced: List[Dict],
        occupancy_rate: float
    ) -> List[Dict]:
        """Generate alerts based on shelf analysis"""
        alerts = []
        
        # Low stock alert
        if occupancy_rate < config.inference.empty_slot_threshold:
            alerts.append({
                "type": "low_stock",
                "severity": "high",
                "message": f"Critical low stock: {occupancy_rate:.1%} occupancy",
                "details": {
                    "occupancy_rate": occupancy_rate,
                    "empty_slots": len(empty_slots)
                }
            })
        elif occupancy_rate < 0.5:
            alerts.append({
                "type": "low_stock",
                "severity": "medium",
                "message": f"Low stock warning: {occupancy_rate:.1%} occupancy",
                "details": {
                    "occupancy_rate": occupancy_rate,
                    "empty_slots": len(empty_slots)
                }
            })
        
        # Misplaced items alert
        if len(misplaced) > 0:
            alerts.append({
                "type": "misplaced_items",
                "severity": "medium",
                "message": f"{len(misplaced)} misplaced items detected",
                "details": {
                    "count": len(misplaced),
                    "items": misplaced
                }
            })
        
        # Low confidence detections
        low_conf_products = [p for p in products if p["confidence"] < config.inference.min_product_confidence]
        if len(low_conf_products) > 0:
            alerts.append({
                "type": "low_confidence",
                "severity": "low",
                "message": f"{len(low_conf_products)} products detected with low confidence",
                "details": {
                    "count": len(low_conf_products)
                }
            })
        
        return alerts
    
    def train(
        self,
        data_yaml: str,
        epochs: Optional[int] = None,
        batch: Optional[int] = None,
        imgsz: Optional[int] = None,
        project: str = "training",
        name: str = "shelf_detection"
    ):
        """
        Train YOLO model on custom dataset
        
        Args:
            data_yaml: Path to dataset configuration YAML
            epochs: Number of training epochs
            batch: Batch size
            imgsz: Image size
            project: Project name for saving results
            name: Run name
        """
        epochs = epochs or config.yolo.train_epochs
        batch = batch or config.yolo.train_batch
        imgsz = imgsz or self.imgsz
        
        logger.info(f"Starting training: {epochs} epochs, batch size {batch}")
        
        try:
            results = self.model.train(
                data=data_yaml,
                epochs=epochs,
                batch=batch,
                imgsz=imgsz,
                device=self.device,
                workers=config.yolo.train_workers,
                project=project,
                name=name,
                exist_ok=True,
                pretrained=True,
                optimizer="AdamW",
                verbose=True,
                seed=42,
                deterministic=True,
                # Data augmentation
                hsv_h=config.preprocessing.hsv_h,
                hsv_s=config.preprocessing.hsv_s,
                hsv_v=config.preprocessing.hsv_v,
                degrees=config.preprocessing.degrees,
                translate=config.preprocessing.translate,
                scale=config.preprocessing.scale,
                shear=config.preprocessing.shear,
                perspective=config.preprocessing.perspective,
                flipud=config.preprocessing.flipud,
                fliplr=config.preprocessing.fliplr,
                mosaic=config.preprocessing.mosaic,
                mixup=config.preprocessing.mixup
            )
            
            logger.info("Training completed successfully")
            return results
            
        except Exception as e:
            logger.error(f"Training failed: {e}")
            raise
    
    def export(self, format: str = "onnx", **kwargs):
        """
        Export model to various formats
        
        Args:
            format: Export format (onnx, torchscript, tflite, etc.)
            **kwargs: Additional export parameters
        """
        logger.info(f"Exporting model to {format}")
        try:
            path = self.model.export(format=format, **kwargs)
            logger.info(f"Model exported to {path}")
            return path
        except Exception as e:
            logger.error(f"Export failed: {e}")
            raise
