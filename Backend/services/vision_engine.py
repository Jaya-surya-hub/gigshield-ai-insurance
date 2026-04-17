import cv2
import numpy as np
import base64

def analyze_video_frames(base64_frames: list[str], zone_id: str) -> dict:
    """
    Advanced Atmospheric Vision Engine v3.
    Analyzes HLS color space, prevents hardware/screen spoofing via FFT, and detects flooded edge collapse.
    """
    if not base64_frames:
        return {"is_severe_weather": False, "confidence": 0.0, "message": "No frames provided"}

    frame_scores = []
    rejection_reasons = []

    for b64_string in base64_frames:
        try:
            # 1. Clean and Decode
            encoded_data = b64_string.split(',')[1] if ',' in b64_string else b64_string
            img_data = base64.b64decode(encoded_data)
            np_arr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if img is None:
                continue

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            h, w = gray.shape

            # ---------------------------------------------------------
            # 2. ANTI-SPOOFING (Occlusion & Replay Attacks)
            # ---------------------------------------------------------
            std_dev = np.std(gray)
            if std_dev < 15.0:
                rejection_reasons.append("Camera occlusion detected (lens covered).")
                frame_scores.append(0.0)
                continue

            # FFT for Moire Pattern Detection (Laptop/Phone screen replay)
            f_transform = np.fft.fft2(gray)
            f_shift = np.fft.fftshift(f_transform)
            magnitude_spectrum = 20 * np.log(np.abs(f_shift) + 1)
            
            # Mask the center (low frequencies)
            cy, cx = h // 2, w // 2
            magnitude_spectrum[cy-30:cy+30, cx-30:cx+30] = 0
            
            max_high_freq = np.max(magnitude_spectrum)
            if max_high_freq > 230: # Abnormal high-frequency grid detected (Screen pixels)
                rejection_reasons.append("Digital Screen Replay Spoof detected (Moire pattern).")
                frame_scores.append(0.0)
                continue

            # ---------------------------------------------------------
            # 3. ATMOSPHERIC & FLOOD ANALYSIS
            # ---------------------------------------------------------
            hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
            h_c, l_c, s_c = cv2.split(hls)

            avg_saturation = np.mean(s_c)
            saturation_score = max(0.0, min(1.0, (130 - avg_saturation) / 80.0))

            contrast_score = max(0.0, min(1.0, (65 - std_dev) / 40.0))

            avg_lightness = np.mean(l_c)
            lightness_score = max(0.0, min(1.0, (180 - avg_lightness) / 100.0))

            # Laplacian Edge Collapse (Flood detection on lower half)
            bottom_half = gray[h // 2:h, :]
            laplacian_var = cv2.Laplacian(bottom_half, cv2.CV_64F).var()
            
            # Asphalt var > 1000. Flooded road < 200 (Acts like a smooth mirror)
            edge_collapse_score = max(0.0, min(1.0, (600 - laplacian_var) / 500.0))

            # Weighted Confidence
            confidence = (saturation_score * 0.25) + (contrast_score * 0.2) + (lightness_score * 0.15) + (edge_collapse_score * 0.4)
            frame_scores.append(confidence)

        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

    if not frame_scores:
        return {"is_severe_weather": False, "confidence": 0.0, "message": "Failed to decode frames"}

    final_confidence = sum(frame_scores) / len(frame_scores)
    
    # ---------------------------------------------------------
    # 4. DYNAMIC IFI THRESHOLDING
    # ---------------------------------------------------------
    # If the user is in Ukkadam (High fragility, prone to instant floods), lower threshold to 50%.
    # Else (Peelamedu, resilient infra), demand 65%.
    threshold = 0.50 if "UKKADAM" in zone_id else 0.65
    is_confirmed = final_confidence >= threshold

    response = {
        "is_severe_weather": is_confirmed,
        "confidence": round(final_confidence, 2),
        "frames_analyzed": len(frame_scores),
        "threshold_applied": threshold
    }

    if rejection_reasons:
        response["flags"] = list(set(rejection_reasons))

    return response
