from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import services.vision_engine as cv_engine

router = APIRouter()

# The expected payload from the React frontend
class VideoVerificationPayload(BaseModel):
    worker_id: int
    zone_id: str
    frames: list[str]  # List of Base64 encoded images

@router.post("/verify-environment")
async def verify_environment(payload: VideoVerificationPayload):
    print(f"📸 Received {len(payload.frames)} frames from Worker {payload.worker_id} for CV Analysis.")
    
    # Send the frames to our OpenCV pipeline
    analysis_result = cv_engine.analyze_video_frames(payload.frames, payload.zone_id)
    
    print(f"🧠 AI Vision Result: {analysis_result}")
    
    if analysis_result["is_severe_weather"]:
        # In a real system, you would hit the Guidewire API here to unlock the paused claim
        return {
            "status": "success",
            "payout_unlocked": True,
            "confidence": analysis_result["confidence"],
            "message": "Environment verified. Payout released via Guidewire ClaimCenter."
        }
    else:
        return {
            "status": "rejected",
            "payout_unlocked": False,
            "confidence": analysis_result["confidence"],
            "message": "Clear weather detected. Claim denied."
        }
