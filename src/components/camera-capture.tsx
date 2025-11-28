import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Camera, X, RotateCw, CheckCircle } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      {/* Header */}
      <div className="bg-black/80 p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-white p-2">
          <X className="size-6" />
        </button>
        <h2 className="text-white">Take Photo</h2>
        <button onClick={switchCamera} className="text-white p-2">
          <RotateCw className="size-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="bg-black/80 p-6 flex items-center justify-center gap-8">
        {!capturedImage ? (
          <button
            onClick={capturePhoto}
            className="w-20 h-20 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Camera className="size-8 text-orange-600" />
          </button>
        ) : (
          <>
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              Retake
            </Button>
            <Button
              onClick={confirmPhoto}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <CheckCircle className="size-5" />
              Use Photo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
