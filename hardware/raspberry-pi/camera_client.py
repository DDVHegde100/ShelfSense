# Hardware - Raspberry Pi Camera Client
# Captures images and sends to backend

import time
import os
import requests
from picamera2 import Picamera2
from datetime import datetime
import json
import logging

# Configuration
API_URL = os.getenv("API_URL", "http://localhost:3000/api/hardware")
DEVICE_ID = os.getenv("DEVICE_ID", "cam-001")
API_KEY = os.getenv("API_KEY", "your-api-key-here")
CAPTURE_INTERVAL = int(os.getenv("CAPTURE_INTERVAL", "300"))  # seconds

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CameraClient:
    def __init__(self):
        self.camera = Picamera2()
        self.camera.configure(self.camera.create_still_configuration())
        self.camera.start()
        time.sleep(2)  # Camera warm-up
        logger.info(f"Camera {DEVICE_ID} initialized")
    
    def capture_image(self) -> bytes:
        """Capture image from camera"""
        try:
            image = self.camera.capture_array()
            # Convert to JPEG
            from PIL import Image
            import io
            
            pil_image = Image.fromarray(image)
            buffer = io.BytesIO()
            pil_image.save(buffer, format='JPEG', quality=95)
            return buffer.getvalue()
        except Exception as e:
            logger.error(f"Image capture failed: {e}")
            return None
    
    def send_heartbeat(self):
        """Send heartbeat to backend"""
        try:
            response = requests.post(
                f"{API_URL}/heartbeat",
                json={
                    "device_id": DEVICE_ID,
                    "timestamp": datetime.now().isoformat()
                },
                headers={"Authorization": f"Bearer {API_KEY}"},
                timeout=10
            )
            response.raise_for_status()
            logger.info("Heartbeat sent successfully")
        except Exception as e:
            logger.error(f"Heartbeat failed: {e}")
    
    def upload_snapshot(self, image_data: bytes):
        """Upload image to backend"""
        try:
            files = {
                'image': ('snapshot.jpg', image_data, 'image/jpeg')
            }
            data = {
                'device_id': DEVICE_ID,
                'captured_at': datetime.now().isoformat()
            }
            
            response = requests.post(
                f"{API_URL}/snapshot",
                files=files,
                data=data,
                headers={"Authorization": f"Bearer {API_KEY}"},
                timeout=30
            )
            response.raise_for_status()
            logger.info(f"Snapshot uploaded successfully: {response.json()}")
        except Exception as e:
            logger.error(f"Upload failed: {e}")
    
    def run(self):
        """Main loop"""
        logger.info("Starting camera client...")
        
        while True:
            try:
                # Send heartbeat
                self.send_heartbeat()
                
                # Capture and upload image
                image_data = self.capture_image()
                if image_data:
                    self.upload_snapshot(image_data)
                
                # Wait for next capture
                time.sleep(CAPTURE_INTERVAL)
                
            except KeyboardInterrupt:
                logger.info("Shutting down camera client...")
                break
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                time.sleep(10)  # Wait before retry
        
        self.camera.stop()
        self.camera.close()

if __name__ == "__main__":
    client = CameraClient()
    client.run()
