import cv2
import numpy as np
import base64

def analyze_video_frames(base64_frames: list[str]) -> dict:
    """
    Decodes Base64 frames and analyzes pixel data to detect 'gloomy/stormy' conditions.
    In a Phase 3 production environment, this is where the YOLOv8 model sits.
    """
    if not base64_frames:
        return {"is_severe_weather": False, "confidence": 0.0, "message": "No frames provided"}

    frame_scores = []

    for b64_string in base64_frames:
        try:
            # 1. Clean the Base64 string (remove the "data:image/jpeg;base64," prefix if it exists)
            encoded_data = b64_string.split(',')[1] if ',' in b64_string else b64_string
            
            # 2. Decode into a numpy array (OpenCV format)
            img_data = base64.b64decode(encoded_data)
            np_arr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if img is None:
                continue

            # 3. HACKATHON HEURISTIC: Analyze Brightness and Contrast
            # Severe weather usually means dark, overcast skies (low brightness)
            gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            avg_brightness = np.mean(gray_img) # 0 is pitch black, 255 is pure white
            
            # Create a mock confidence score. 
            # If the image is dark (brightness < 100), confidence of a storm goes up.
            # Normalizing it to a 0.00 - 0.99 scale.
            confidence = max(0.1, min(0.98, (200 - avg_brightness) / 200.0))
            
            # Bonus: If you want to force a pass during the demo, cover the camera with your finger!
            frame_scores.append(confidence)

        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

    if not frame_scores:
        return {"is_severe_weather": False, "confidence": 0.0, "message": "Failed to decode frames"}

    # Average the confidence across the 3 seconds of video frames
    final_confidence = sum(frame_scores) / len(frame_scores)
    
    # Threshold: We need 65% confidence to unlock the payout
    is_confirmed = final_confidence >= 0.65

    return {
        "is_severe_weather": is_confirmed,
        "confidence": round(final_confidence, 2),
        "frames_analyzed": len(frame_scores)
    }