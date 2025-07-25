"use client";
import { useEffect, useRef, useState } from "react";

export default function ScreenShare() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function enableScreenShare() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Screen sharing error:", err);
        setError("Unable to access screen. Please allow screen sharing.");
      }
    }
    enableScreenShare();
    
    // Store the current video element for cleanup
    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo && currentVideo.srcObject) {
        const tracks = (currentVideo.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-80 text-white text-lg">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />
    </div>
  );
} 