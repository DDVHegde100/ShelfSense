# ml-service/core/inference.py
# ML model inference engines

import torch
from ultralytics import YOLO
from transformers import CLIPProcessor, CLIPModel
from typing import List, Dict, Any, Tuple
import numpy as np
from PIL import Image

class YOLOInferenceEngine:
    """YOLOv8 inference engine for object detection"""
    
    def __init__(self, model_path: str, device: str = "cuda"):
        self.device = device
        self.model = YOLO(model_path)
        self.model.to(device)
        print(f"YOLO model loaded on {device}")
    
    def predict(
        self,
        image: np.ndarray,
        conf_threshold: float = 0.5,
        iou_threshold: float = 0.45
    ) -> List[Dict[str, Any]]:
        """
        Run object detection on image
        
        Args:
            image: Input image as numpy array
            conf_threshold: Confidence threshold
            iou_threshold: IoU threshold for NMS
        
        Returns:
            List of detections with bounding boxes and classes
        """
        results = self.model.predict(
            image,
            conf=conf_threshold,
            iou=iou_threshold,
            verbose=False
        )
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detection = {
                    "class_id": int(box.cls[0]),
                    "class_name": result.names[int(box.cls[0])],
                    "confidence": float(box.conf[0]),
                    "bbox": box.xyxyn[0].tolist(),  # Normalized coordinates
                }
                detections.append(detection)
        
        return detections
    
    def predict_batch(
        self,
        images: List[np.ndarray],
        conf_threshold: float = 0.5
    ) -> List[List[Dict[str, Any]]]:
        """Batch prediction for multiple images"""
        all_detections = []
        for image in images:
            detections = self.predict(image, conf_threshold)
            all_detections.append(detections)
        return all_detections


class CLIPInferenceEngine:
    """CLIP inference engine for product classification and search"""
    
    def __init__(self, model_name: str = "openai/clip-vit-base-patch32", device: str = "cuda"):
        self.device = device
        self.model = CLIPModel.from_pretrained(model_name).to(device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        print(f"CLIP model loaded on {device}")
    
    def classify(
        self,
        image: Image.Image,
        candidate_labels: List[str]
    ) -> Dict[str, Any]:
        """
        Classify image with candidate labels
        
        Args:
            image: PIL Image
            candidate_labels: List of text labels to classify against
        
        Returns:
            Classification results with scores
        """
        inputs = self.processor(
            text=candidate_labels,
            images=image,
            return_tensors="pt",
            padding=True
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
        
        results = []
        for label, prob in zip(candidate_labels, probs[0]):
            results.append({
                "label": label,
                "confidence": float(prob)
            })
        
        # Sort by confidence
        results.sort(key=lambda x: x["confidence"], reverse=True)
        
        return {
            "predictions": results,
            "top_prediction": results[0]["label"],
            "confidence": results[0]["confidence"]
        }
    
    def generate_embedding(self, image: Image.Image) -> np.ndarray:
        """Generate image embedding"""
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
            # Normalize embedding
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        
        return image_features.cpu().numpy()[0]
    
    def compute_similarity(
        self,
        image1: Image.Image,
        image2: Image.Image
    ) -> float:
        """Compute cosine similarity between two images"""
        emb1 = self.generate_embedding(image1)
        emb2 = self.generate_embedding(image2)
        
        similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
        return float(similarity)


# Global model instances (loaded on startup)
yolo_engine: YOLOInferenceEngine = None
clip_engine: CLIPInferenceEngine = None

def load_models(yolo_path: str, clip_model: str, device: str = "cuda"):
    """Load all ML models"""
    global yolo_engine, clip_engine
    
    yolo_engine = YOLOInferenceEngine(yolo_path, device)
    clip_engine = CLIPInferenceEngine(clip_model, device)
    
    return yolo_engine, clip_engine
