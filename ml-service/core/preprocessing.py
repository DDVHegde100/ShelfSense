"""
Image Preprocessing Pipeline for ShelfSense
OpenCV-based image preprocessing, quality checks, and augmentation
"""
import cv2
import numpy as np
from typing import Tuple, Optional, List, Dict
import logging
from pathlib import Path

from .config import config

logger = logging.getLogger(__name__)


class ImagePreprocessor:
    """
    Production-ready image preprocessing with:
    - Automatic quality detection
    - Lighting normalization
    - Perspective correction
    - Real-time augmentation
    """
    
    def __init__(self):
        """Initialize preprocessor with config"""
        self.target_size = config.preprocessing.target_size
        self.normalize_mean = np.array(config.preprocessing.normalize_mean)
        self.normalize_std = np.array(config.preprocessing.normalize_std)
        
        # Quality thresholds
        self.min_brightness = config.preprocessing.min_brightness
        self.max_brightness = config.preprocessing.max_brightness
        self.min_contrast = config.preprocessing.min_contrast
        self.blur_threshold = config.preprocessing.blur_threshold
    
    def preprocess(
        self,
        image: np.ndarray,
        resize: bool = True,
        enhance: bool = True,
        normalize: bool = False
    ) -> np.ndarray:
        """
        Standard preprocessing pipeline
        
        Args:
            image: Input image (BGR format)
            resize: Resize to target size
            enhance: Apply enhancement (CLAHE, denoising)
            normalize: Normalize pixel values
        
        Returns:
            Preprocessed image
        """
        processed = image.copy()
        
        # Enhance quality if requested
        if enhance:
            processed = self.enhance_image(processed)
        
        # Resize if requested
        if resize:
            processed = self.resize_image(processed, self.target_size)
        
        # Normalize if requested
        if normalize:
            processed = self.normalize_image(processed)
        
        return processed
    
    def resize_image(
        self,
        image: np.ndarray,
        target_size: Tuple[int, int],
        maintain_aspect: bool = True
    ) -> np.ndarray:
        """
        Resize image to target size
        
        Args:
            image: Input image
            target_size: Target (width, height)
            maintain_aspect: Maintain aspect ratio with padding
        
        Returns:
            Resized image
        """
        if not maintain_aspect:
            return cv2.resize(image, target_size, interpolation=cv2.INTER_LINEAR)
        
        # Calculate scaling factor
        h, w = image.shape[:2]
        target_w, target_h = target_size
        scale = min(target_w / w, target_h / h)
        
        # Resize maintaining aspect ratio
        new_w, new_h = int(w * scale), int(h * scale)
        resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
        
        # Create padded image
        padded = np.full((target_h, target_w, 3), 114, dtype=np.uint8)
        
        # Center the resized image
        y_offset = (target_h - new_h) // 2
        x_offset = (target_w - new_w) // 2
        padded[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
        
        return padded
    
    def enhance_image(self, image: np.ndarray) -> np.ndarray:
        """
        Enhance image quality with CLAHE and denoising
        
        Args:
            image: Input image (BGR)
        
        Returns:
            Enhanced image
        """
        # Convert to LAB color space
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l_enhanced = clahe.apply(l)
        
        # Merge channels
        lab_enhanced = cv2.merge([l_enhanced, a, b])
        enhanced = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)
        
        # Denoise
        enhanced = cv2.fastNlMeansDenoisingColored(
            enhanced,
            None,
            h=10,
            hColor=10,
            templateWindowSize=7,
            searchWindowSize=21
        )
        
        return enhanced
    
    def normalize_image(self, image: np.ndarray) -> np.ndarray:
        """
        Normalize image with ImageNet mean/std
        
        Args:
            image: Input image (BGR)
        
        Returns:
            Normalized image (RGB, float32, range [0, 1])
        """
        # Convert BGR to RGB
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Convert to float and scale to [0, 1]
        normalized = rgb.astype(np.float32) / 255.0
        
        # Normalize with mean/std
        normalized = (normalized - self.normalize_mean) / self.normalize_std
        
        return normalized
    
    def check_quality(self, image: np.ndarray) -> Dict:
        """
        Check image quality metrics
        
        Args:
            image: Input image (BGR)
        
        Returns:
            Dictionary with quality metrics and pass/fail status
        """
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Check brightness
        brightness = np.mean(gray)
        brightness_ok = self.min_brightness <= brightness <= self.max_brightness
        
        # Check contrast
        contrast = gray.std()
        contrast_ok = contrast >= self.min_contrast
        
        # Check blur (Laplacian variance)
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_ok = blur_score >= self.blur_threshold
        
        # Overall quality
        quality_pass = brightness_ok and contrast_ok and blur_ok
        
        return {
            "pass": quality_pass,
            "brightness": {
                "value": float(brightness),
                "ok": brightness_ok,
                "range": (self.min_brightness, self.max_brightness)
            },
            "contrast": {
                "value": float(contrast),
                "ok": contrast_ok,
                "threshold": self.min_contrast
            },
            "blur": {
                "value": float(blur_score),
                "ok": blur_ok,
                "threshold": self.blur_threshold
            }
        }
    
    def correct_perspective(
        self,
        image: np.ndarray,
        corners: Optional[np.ndarray] = None
    ) -> np.ndarray:
        """
        Correct perspective distortion
        
        Args:
            image: Input image
            corners: 4 corner points [top-left, top-right, bottom-right, bottom-left]
                    If None, auto-detect shelf edges
        
        Returns:
            Perspective-corrected image
        """
        if corners is None:
            # Auto-detect corners (simplified - could use Hough lines for better results)
            corners = self._detect_corners(image)
            if corners is None:
                logger.warning("Could not auto-detect corners, returning original image")
                return image
        
        # Define destination points (rectangle)
        h, w = image.shape[:2]
        dst_points = np.array([
            [0, 0],
            [w - 1, 0],
            [w - 1, h - 1],
            [0, h - 1]
        ], dtype=np.float32)
        
        # Calculate perspective transform matrix
        matrix = cv2.getPerspectiveTransform(
            corners.astype(np.float32),
            dst_points
        )
        
        # Apply transform
        corrected = cv2.warpPerspective(image, matrix, (w, h))
        
        return corrected
    
    def _detect_corners(self, image: np.ndarray) -> Optional[np.ndarray]:
        """Auto-detect corners using edge detection"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            
            # Find contours
            contours, _ = cv2.findContours(
                edges,
                cv2.RETR_EXTERNAL,
                cv2.CHAIN_APPROX_SIMPLE
            )
            
            if not contours:
                return None
            
            # Find largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            
            # Approximate to polygon
            epsilon = 0.02 * cv2.arcLength(largest_contour, True)
            approx = cv2.approxPolyDP(largest_contour, epsilon, True)
            
            # Check if we have 4 corners
            if len(approx) == 4:
                return approx.reshape(4, 2)
            
            return None
            
        except Exception as e:
            logger.error(f"Corner detection failed: {e}")
            return None
    
    def remove_shadows(self, image: np.ndarray) -> np.ndarray:
        """
        Remove shadows using dilated illumination
        
        Args:
            image: Input image (BGR)
        
        Returns:
            Shadow-removed image
        """
        # Convert to LAB
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # Calculate dilated L channel (approximates illumination)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        bg = cv2.morphologyEx(l, cv2.MORPH_CLOSE, kernel)
        bg = cv2.GaussianBlur(bg, (0, 0), 15)
        
        # Subtract illumination
        l_corrected = cv2.subtract(l, bg)
        l_corrected = cv2.add(l_corrected, 128)  # Re-center
        
        # Merge and convert back
        lab_corrected = cv2.merge([l_corrected, a, b])
        corrected = cv2.cvtColor(lab_corrected, cv2.COLOR_LAB2BGR)
        
        return corrected
    
    def augment_image(
        self,
        image: np.ndarray,
        augmentations: Optional[List[str]] = None
    ) -> np.ndarray:
        """
        Apply random augmentations for training
        
        Args:
            image: Input image (BGR)
            augmentations: List of augmentations to apply
                         Options: ['flip', 'rotate', 'brightness', 'contrast', 'noise']
        
        Returns:
            Augmented image
        """
        if augmentations is None:
            augmentations = ['flip', 'brightness', 'contrast']
        
        augmented = image.copy()
        
        for aug in augmentations:
            if aug == 'flip' and np.random.random() > 0.5:
                augmented = cv2.flip(augmented, 1)
            
            elif aug == 'rotate':
                angle = np.random.uniform(-config.preprocessing.degrees, config.preprocessing.degrees)
                h, w = augmented.shape[:2]
                center = (w // 2, h // 2)
                matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
                augmented = cv2.warpAffine(augmented, matrix, (w, h))
            
            elif aug == 'brightness':
                value = np.random.uniform(0.7, 1.3)
                hsv = cv2.cvtColor(augmented, cv2.COLOR_BGR2HSV).astype(np.float32)
                hsv[:, :, 2] *= value
                hsv[:, :, 2] = np.clip(hsv[:, :, 2], 0, 255)
                augmented = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
            
            elif aug == 'contrast':
                alpha = np.random.uniform(0.8, 1.2)
                beta = np.random.uniform(-10, 10)
                augmented = cv2.convertScaleAbs(augmented, alpha=alpha, beta=beta)
            
            elif aug == 'noise':
                noise = np.random.normal(0, 10, augmented.shape).astype(np.uint8)
                augmented = cv2.add(augmented, noise)
        
        return augmented
    
    def extract_shelf_region(
        self,
        image: np.ndarray,
        method: str = "adaptive"
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Extract shelf region from image
        
        Args:
            image: Input image (BGR)
            method: Extraction method ('adaptive', 'edges', 'color')
        
        Returns:
            Tuple of (extracted_region, mask)
        """
        if method == "adaptive":
            return self._extract_adaptive(image)
        elif method == "edges":
            return self._extract_edges(image)
        elif method == "color":
            return self._extract_color(image)
        else:
            raise ValueError(f"Unknown method: {method}")
    
    def _extract_adaptive(self, image: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Extract shelf using adaptive thresholding"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Adaptive threshold
        thresh = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            11, 2
        )
        
        # Morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        mask = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Apply mask
        result = cv2.bitwise_and(image, image, mask=mask)
        
        return result, mask
    
    def _extract_edges(self, image: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Extract shelf using edge detection"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        
        # Dilate edges to create mask
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        mask = cv2.dilate(edges, kernel, iterations=2)
        
        result = cv2.bitwise_and(image, image, mask=mask)
        
        return result, mask
    
    def _extract_color(self, image: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Extract shelf using color segmentation"""
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define shelf color range (adjust as needed)
        lower = np.array([0, 0, 50])
        upper = np.array([180, 50, 255])
        
        mask = cv2.inRange(hsv, lower, upper)
        
        # Clean up mask
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        
        result = cv2.bitwise_and(image, image, mask=mask)
        
        return result, mask
