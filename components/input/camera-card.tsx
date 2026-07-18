"use client";

import { Camera, X, FlipHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { useAppStore } from "@/hooks/store";

export function CameraCard() {
  const setImageFromCamera = useAppStore((s) => s.setImageFromCamera);
  const clearImage = useAppStore((s) => s.clearImage);
  const imageBase64 = useAppStore((s) => s.imageBase64);
  const isCameraMode = useAppStore((s) => s.isCameraMode);

  const {
    videoRef,
    isActive,
    isCountingDown,
    countdownValue,
    error,
    startCamera,
    stopCamera,
    switchCamera,
    takePhoto,
  } = useCamera({
    onCapture: (base64) => setImageFromCamera(base64),
  });

  if (isCameraMode && imageBase64) {
    return (
      <Card className="w-full max-w-lg mx-auto border-brand-500/20">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-brand-500/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Captured preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-100 truncate">Photo captured</p>
            <p className="text-xs text-ink-400 mt-0.5 font-mono">Ready for analysis</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearImage()}
          >
            Retake
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden">
      {!isActive && !error && (
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600/20 to-flush-500/15 border border-brand-500/20 flex items-center justify-center">
            <Camera className="w-8 h-8 text-brand-300" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-ink-100">
              Use your camera
            </p>
            <p className="text-sm text-ink-300 mt-1">
              Take a live photo for analysis
            </p>
          </div>
          <Button onClick={startCamera} size="lg">
            Start Camera
          </Button>
        </CardContent>
      )}

      {error && (
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
          <Button variant="secondary" onClick={startCamera}>
            Try Again
          </Button>
        </CardContent>
      )}

      {isActive && (
        <CardContent className="p-0 relative">
          <div className="relative w-full aspect-[4/3] bg-ink-950 rounded-t-3xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            {isCountingDown && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60 backdrop-blur-sm">
                <div className="text-7xl font-bold text-white font-display animate-ping-once">
                  {countdownValue}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 p-4">
            <Button variant="secondary" size="icon" onClick={stopCamera}>
              <X className="w-5 h-5" />
            </Button>
            <Button
              onClick={takePhoto}
              size="lg"
              className="rounded-full w-16 h-16 p-0 bg-white hover:bg-ink-200 text-ink-900 shadow-glow"
              disabled={isCountingDown}
            >
              <Camera className="w-7 h-7" />
            </Button>
            <Button variant="secondary" size="icon" onClick={switchCamera}>
              <FlipHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}