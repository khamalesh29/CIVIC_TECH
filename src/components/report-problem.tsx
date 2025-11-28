import { useState, useEffect } from "react";
import { Problem } from "../App";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ArrowLeft, Camera, Upload, Send, MapPin, Video } from "lucide-react";
import { CameraCapture } from "./camera-capture";

interface ReportProblemProps {
  onClose: () => void;
  onSubmit: (problem: Omit<Problem, "id" | "timestamp">) => void;
  preselectedCategory?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  roadways: "Roadways",
  utility: "Utility/Power",
  animal: "Animal Control",
  sanitation: "Sanitation",
  other: "Other"
};

export function ReportProblem({ onClose, onSubmit, preselectedCategory }: ReportProblemProps) {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const categoryLabel = preselectedCategory ? CATEGORY_LABELS[preselectedCategory] : "Issue";

  // Auto-trigger GPS on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert("Video file is too large. Maximum size is 50MB.");
        return;
      }
      
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageData: string) => {
    setPreviewUrl(imageData);
    setShowCamera(false);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          
          // Set a formatted location string
          const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setLocation(locationString);
          setGettingLocation(false);
          
          // Try to get address from reverse geocoding
          reverseGeocode(lat, lng);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setGettingLocation(false);
          
          let errorMessage = "Unable to get location. ";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Please enter location manually.";
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter location manually.");
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CivicConnect App'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          // Set a more readable location
          const address = data.address;
          let readableLocation = '';
          
          if (address.road) readableLocation += address.road;
          if (address.suburb) readableLocation += (readableLocation ? ', ' : '') + address.suburb;
          if (address.city) readableLocation += (readableLocation ? ', ' : '') + address.city;
          if (address.state) readableLocation += (readableLocation ? ', ' : '') + address.state;
          
          if (readableLocation) {
            setLocation(readableLocation);
          }
        }
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Keep the coordinates if reverse geocoding fails
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !location) {
      alert("Please fill in location and description");
      return;
    }

    const finalImageUrl = previewUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800";

    onSubmit({
      title: `${categoryLabel} Issue`,
      description,
      category: preselectedCategory || "other",
      location,
      imageUrl: finalImageUrl,
      videoUrl: videoPreviewUrl || undefined,
      reportedBy: "You"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-orange-600 text-white p-4 rounded-t-3xl flex items-center gap-3">
          <button onClick={onClose} className="p-1">
            <ArrowLeft className="size-5" />
          </button>
          <h2>New Report: {categoryLabel}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-600">
              <MapPin className="size-4" />
              Location
            </Label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter address or use GPS"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <Button 
                type="button" 
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="bg-orange-600 hover:bg-orange-700 min-w-[70px]"
              >
                {gettingLocation ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  "GPS"
                )}
              </Button>
            </div>
            {coordinates && (
              <p className="text-xs text-gray-500">
                Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-gray-600">Description</Label>
            <Textarea
              placeholder={`Describe the ${categoryLabel} issue...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              required
            />
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <Label className="text-gray-600">Photo Evidence (Optional)</Label>
            
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-white border-2 border-dashed border-gray-300 p-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl("");
                    setImageFile(null);
                  }}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="cursor-pointer"
                >
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-orange-500 transition-colors min-h-[120px]">
                    <Camera className="size-8 text-gray-400" />
                    <span className="text-sm text-gray-600">Take Photo</span>
                  </div>
                </button>

                <label className="cursor-pointer">
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-orange-500 transition-colors min-h-[120px]">
                    <Upload className="size-8 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload Photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Video Evidence */}
          <div className="space-y-2">
            <Label className="text-gray-600">Video Evidence (Optional)</Label>
            
            {videoPreviewUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-white border-2 border-dashed border-gray-300 p-2">
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoPreviewUrl("");
                    setVideoFile(null);
                  }}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-orange-500 transition-colors min-h-[120px]">
                  <Video className="size-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Video</span>
                  <span className="text-xs text-gray-400">Max 50MB</span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 py-6 rounded-xl text-white gap-2"
          >
            <Send className="size-5" />
            Submit Report
          </Button>
        </form>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}