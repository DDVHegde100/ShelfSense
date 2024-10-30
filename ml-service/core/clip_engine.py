"""
CLIP Product Classification Engine for ShelfSense
Product categorization, similarity search, and visual embeddings
"""
import torch
import clip
import numpy as np
from typing import List, Dict, Optional, Tuple
from pathlib import Path
import cv2
from PIL import Image
import logging
import faiss
import pickle

from .config import config

logger = logging.getLogger(__name__)


class CLIPClassificationEngine:
    """
    Production-ready CLIP classification engine with:
    - Zero-shot classification
    - Product similarity search
    - Embedding database management
    - Multi-modal search (text + image)
    """
    
    def __init__(
        self,
        model_name: Optional[str] = None,
        device: Optional[str] = None
    ):
        """
        Initialize CLIP classification engine
        
        Args:
            model_name: CLIP model variant (ViT-B/32, ViT-B/16, ViT-L/14)
            device: Device to run inference on (cuda:0, cpu)
        """
        self.device = device or config.clip.device
        self.model_name = model_name or config.clip.model_name
        
        # Load model
        logger.info(f"Loading CLIP model {self.model_name}")
        
        try:
            self.model, self.preprocess = clip.load(
                self.model_name,
                device=self.device
            )
            self.model.eval()
            logger.info(f"CLIP model loaded successfully on {self.device}")
        except Exception as e:
            logger.error(f"Failed to load CLIP model: {e}")
            raise
        
        # Product categories
        self.categories = config.clip.product_categories
        self.category_embeddings = None
        self._encode_categories()
        
        # Embedding database (FAISS)
        self.embedding_dim = config.clip.embedding_dim
        self.index = None
        self.product_database = {}
        self._initialize_index()
    
    def _encode_categories(self):
        """Pre-compute embeddings for product categories"""
        logger.info("Encoding product categories...")
        
        # Create text prompts for each category
        prompts = [f"a photo of {category} products on a shelf" for category in self.categories]
        text_tokens = clip.tokenize(prompts).to(self.device)
        
        with torch.no_grad():
            text_features = self.model.encode_text(text_tokens)
            text_features /= text_features.norm(dim=-1, keepdim=True)
        
        self.category_embeddings = text_features.cpu().numpy()
        logger.info(f"Encoded {len(self.categories)} categories")
    
    def _initialize_index(self):
        """Initialize FAISS index for similarity search"""
        logger.info("Initializing FAISS index...")
        
        # Use IndexFlatIP for inner product (cosine similarity after normalization)
        self.index = faiss.IndexFlatIP(self.embedding_dim)
        
        # Try to load existing index
        index_path = Path(config.database.vector_db_path)
        if index_path.exists():
            try:
                self.index = faiss.read_index(str(index_path))
                # Load product database
                db_path = index_path.parent / "product_database.pkl"
                if db_path.exists():
                    with open(db_path, "rb") as f:
                        self.product_database = pickle.load(f)
                logger.info(f"Loaded existing index with {self.index.ntotal} products")
            except Exception as e:
                logger.warning(f"Failed to load index: {e}, creating new index")
    
    def classify_image(
        self,
        image: np.ndarray,
        top_k: int = 3
    ) -> Dict:
        """
        Classify product image into categories
        
        Args:
            image: Input image (BGR format)
            top_k: Return top K categories
        
        Returns:
            Dictionary with categories and confidence scores
        """
        try:
            # Convert BGR to RGB
            if len(image.shape) == 2:
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            elif image.shape[2] == 4:
                image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
            else:
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Preprocess image
            pil_image = Image.fromarray(image)
            image_input = self.preprocess(pil_image).unsqueeze(0).to(self.device)
            
            # Encode image
            with torch.no_grad():
                image_features = self.model.encode_image(image_input)
                image_features /= image_features.norm(dim=-1, keepdim=True)
            
            # Calculate similarities
            similarities = (image_features.cpu().numpy() @ self.category_embeddings.T)[0]
            
            # Get top K
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            results = []
            for idx in top_indices:
                results.append({
                    "category": self.categories[idx],
                    "confidence": float(similarities[idx]),
                    "score": float((similarities[idx] + 1) / 2)  # Normalize to [0, 1]
                })
            
            return {
                "predictions": results,
                "top_category": results[0]["category"],
                "top_confidence": results[0]["confidence"]
            }
            
        except Exception as e:
            logger.error(f"Classification failed: {e}")
            return {"error": str(e)}
    
    def classify_batch(
        self,
        images: List[np.ndarray],
        top_k: int = 3
    ) -> List[Dict]:
        """
        Classify multiple images in batch
        
        Args:
            images: List of input images (BGR format)
            top_k: Return top K categories
        
        Returns:
            List of classification results
        """
        try:
            # Preprocess all images
            processed_images = []
            for image in images:
                if len(image.shape) == 2:
                    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
                elif image.shape[2] == 4:
                    image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
                else:
                    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                
                pil_image = Image.fromarray(image)
                processed_images.append(self.preprocess(pil_image))
            
            # Stack into batch
            image_batch = torch.stack(processed_images).to(self.device)
            
            # Encode batch
            with torch.no_grad():
                image_features = self.model.encode_image(image_batch)
                image_features /= image_features.norm(dim=-1, keepdim=True)
            
            # Calculate similarities for all images
            similarities = (image_features.cpu().numpy() @ self.category_embeddings.T)
            
            # Process results for each image
            results = []
            for img_similarities in similarities:
                top_indices = np.argsort(img_similarities)[::-1][:top_k]
                img_results = []
                for idx in top_indices:
                    img_results.append({
                        "category": self.categories[idx],
                        "confidence": float(img_similarities[idx]),
                        "score": float((img_similarities[idx] + 1) / 2)
                    })
                results.append({
                    "predictions": img_results,
                    "top_category": img_results[0]["category"],
                    "top_confidence": img_results[0]["confidence"]
                })
            
            return results
            
        except Exception as e:
            logger.error(f"Batch classification failed: {e}")
            return [{"error": str(e)} for _ in images]
    
    def compute_embedding(self, image: np.ndarray) -> Optional[np.ndarray]:
        """
        Compute CLIP embedding for an image
        
        Args:
            image: Input image (BGR format)
        
        Returns:
            Normalized embedding vector
        """
        try:
            # Convert and preprocess
            if len(image.shape) == 2:
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            else:
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            pil_image = Image.fromarray(image)
            image_input = self.preprocess(pil_image).unsqueeze(0).to(self.device)
            
            # Encode
            with torch.no_grad():
                image_features = self.model.encode_image(image_input)
                image_features /= image_features.norm(dim=-1, keepdim=True)
            
            return image_features.cpu().numpy()[0]
            
        except Exception as e:
            logger.error(f"Embedding computation failed: {e}")
            return None
    
    def add_product(
        self,
        product_id: str,
        image: np.ndarray,
        metadata: Optional[Dict] = None
    ) -> bool:
        """
        Add product to embedding database
        
        Args:
            product_id: Unique product identifier
            image: Product image (BGR format)
            metadata: Additional product metadata
        
        Returns:
            Success status
        """
        try:
            # Compute embedding
            embedding = self.compute_embedding(image)
            if embedding is None:
                return False
            
            # Add to FAISS index
            embedding_2d = embedding.reshape(1, -1).astype('float32')
            self.index.add(embedding_2d)
            
            # Store product info
            index_id = self.index.ntotal - 1
            self.product_database[index_id] = {
                "product_id": product_id,
                "metadata": metadata or {},
                "embedding": embedding
            }
            
            logger.info(f"Added product {product_id} to database")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add product: {e}")
            return False
    
    def search_similar(
        self,
        image: np.ndarray,
        top_k: int = 5,
        threshold: Optional[float] = None
    ) -> List[Dict]:
        """
        Search for similar products in database
        
        Args:
            image: Query image (BGR format)
            top_k: Number of results to return
            threshold: Minimum similarity threshold
        
        Returns:
            List of similar products with scores
        """
        threshold = threshold or config.clip.similarity_threshold
        
        try:
            # Compute query embedding
            query_embedding = self.compute_embedding(image)
            if query_embedding is None:
                return []
            
            # Search in FAISS index
            query_2d = query_embedding.reshape(1, -1).astype('float32')
            distances, indices = self.index.search(query_2d, top_k)
            
            # Format results
            results = []
            for distance, idx in zip(distances[0], indices[0]):
                if idx == -1:  # No more results
                    break
                
                similarity = float(distance)
                if similarity >= threshold:
                    product_info = self.product_database.get(int(idx), {})
                    results.append({
                        "product_id": product_info.get("product_id"),
                        "similarity": similarity,
                        "score": (similarity + 1) / 2,  # Normalize to [0, 1]
                        "metadata": product_info.get("metadata", {})
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"Similarity search failed: {e}")
            return []
    
    def search_by_text(
        self,
        query: str,
        top_k: int = 5,
        threshold: Optional[float] = None
    ) -> List[Dict]:
        """
        Search products by text description
        
        Args:
            query: Text query
            top_k: Number of results to return
            threshold: Minimum similarity threshold
        
        Returns:
            List of matching products with scores
        """
        threshold = threshold or config.clip.similarity_threshold
        
        try:
            # Encode text query
            text_tokens = clip.tokenize([query]).to(self.device)
            with torch.no_grad():
                text_features = self.model.encode_text(text_tokens)
                text_features /= text_features.norm(dim=-1, keepdim=True)
            
            query_embedding = text_features.cpu().numpy()[0]
            
            # Search in FAISS index
            query_2d = query_embedding.reshape(1, -1).astype('float32')
            distances, indices = self.index.search(query_2d, top_k)
            
            # Format results
            results = []
            for distance, idx in zip(distances[0], indices[0]):
                if idx == -1:
                    break
                
                similarity = float(distance)
                if similarity >= threshold:
                    product_info = self.product_database.get(int(idx), {})
                    results.append({
                        "product_id": product_info.get("product_id"),
                        "similarity": similarity,
                        "score": (similarity + 1) / 2,
                        "metadata": product_info.get("metadata", {})
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"Text search failed: {e}")
            return []
    
    def save_index(self):
        """Save FAISS index and product database to disk"""
        try:
            index_path = Path(config.database.vector_db_path)
            index_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Save FAISS index
            faiss.write_index(self.index, str(index_path))
            
            # Save product database
            db_path = index_path.parent / "product_database.pkl"
            with open(db_path, "wb") as f:
                pickle.dump(self.product_database, f)
            
            logger.info(f"Saved index with {self.index.ntotal} products to {index_path}")
            
        except Exception as e:
            logger.error(f"Failed to save index: {e}")
    
    def compare_images(
        self,
        image1: np.ndarray,
        image2: np.ndarray
    ) -> float:
        """
        Compare similarity between two images
        
        Args:
            image1: First image (BGR format)
            image2: Second image (BGR format)
        
        Returns:
            Similarity score (0-1)
        """
        try:
            emb1 = self.compute_embedding(image1)
            emb2 = self.compute_embedding(image2)
            
            if emb1 is None or emb2 is None:
                return 0.0
            
            # Cosine similarity
            similarity = np.dot(emb1, emb2)
            
            # Normalize to [0, 1]
            return float((similarity + 1) / 2)
            
        except Exception as e:
            logger.error(f"Image comparison failed: {e}")
            return 0.0
