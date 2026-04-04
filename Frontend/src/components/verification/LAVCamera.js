import React, { useState, useEffect, useRef } from 'react';
import { Camera, Loader } from 'lucide-react';

const LAVCamera = ({ onVerificationComplete, workerData }) => {
    const [status, setStatus] = useState('idle'); // idle, permission, recording, uploading
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const framesRef = useRef([]); // Stores the Base64 images

    // 1. Request Camera Permission & Start Stream
    const initializeCamera = async () => {
        setStatus('permission');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefers back camera on phones
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setStatus('recording');
            startCaptureSequence();
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Camera access is required for verification.");
            setStatus('idle');
        }
    };

    // 2. Capture Frames while Recording
    const startCaptureSequence = () => {
        framesRef.current = [];
        setProgress(0);
        let captureCount = 0;
        const maxCaptures = 6; // Take 6 frames over 3 seconds (1 every 500ms)

        const captureInterval = setInterval(() => {
            captureFrame();
            captureCount++;
            setProgress((captureCount / maxCaptures) * 100);

            if (captureCount >= maxCaptures) {
                clearInterval(captureInterval);
                stopCamera();
                uploadFrames();
            }
        }, 500);
    };

    // 3. Extract a single frame from the video tag to a hidden canvas
    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Compress heavily for the hackathon to keep payload small
            const base64Image = canvas.toDataURL('image/jpeg', 0.5);
            framesRef.current.push(base64Image);
        }
    };

    // 4. Stop the hardware camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    // 5. Send to FastAPI Backend
    const uploadFrames = async () => {
        setStatus('uploading');

        try {
            // We pass the actual Base64 images back to the parent component
            onVerificationComplete(framesRef.current);
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    // Cleanup camera if user navigates away mid-recording
    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '24px', color: 'white', textAlign: 'center' }}>

            {status === 'idle' && (
                <>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#374151', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
                        <Camera size={32} color="#9ca3af" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>Record Surroundings</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '24px' }}>
                        Show us the sky. We need 3 seconds of video to verify the severe weather conditions.
                    </p>
                    <button
                        onClick={initializeCamera}
                        style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                    >
                        Enable Camera & Start
                    </button>
                </>
            )}

            {(status === 'recording' || status === 'permission') && (
                <>
                    <div style={{ width: '100%', height: '250px', backgroundColor: '#000', borderRadius: '8px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
                        {/* Live Hardware Video Stream */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Hidden Canvas for Frame Extraction */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>REC</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#374151', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, backgroundColor: '#3b82f6', height: '100%', transition: 'width 0.5s linear' }} />
                    </div>
                </>
            )}

            {status === 'uploading' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 0' }}>
                    <Loader size={48} color="#3b82f6" className="animate-spin" />
                    <p style={{ fontWeight: 'bold' }}>CV Pipeline analyzing pixels...</p>
                </div>
            )}
        </div>
    );
};

export default LAVCamera;