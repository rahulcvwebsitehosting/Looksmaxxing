"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScribbleIcon } from "@/components/ui/scribble-icon";
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
      <Card className="w-full max-w-lg mx-auto tilt-l">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="relative w-20 h-20 wobble-sm overflow-hidden flex-shrink-0 pencil-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Captured preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-display font-bold text-pencil">Photo captured</p>
            <p className="text-xs text-pencil-muted mt-0.5 font-mono">Ready for analysis</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => clearImage()}
            className="gap-1.5"
          >
            <ScribbleIcon name="camera" className="w-4 h-4" strokeWidth={2.2} />
            Retake
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden tilt-r">
      {!isActive && !error && (
        <CardContent className="flex flex-col items-center justify-center py-14 gap-5">
          <div className="wobble-sm bg-paper-aged pencil-border p-4 hard-shadow-sm">
            <ScribbleIcon name="camera" className="w-9 h-9 stroke-ballpoint" strokeWidth={2.2} />
          </div>
          <div className="text-center">
            <p className="text-xl font-display font-bold text-pencil">
              Use your camera
            </p>
            <p className="text-base text-pencil-soft font-body mt-1">
              Take a live photo for analysis
            </p>
          </div>
          <Button onClick={startCamera} size="lg" variant="marker" className="gap-2">
            <ScribbleIcon name="camera" className="w-5 h-5 stroke-white" strokeWidth={2.2} />
            Start camera
          </Button>
        </CardContent>
      )}

      {error && (
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="wobble-sm bg-paper-aged pencil-border p-4 hard-shadow-sm">
            <ScribbleIcon name="alert" className="w-9 h-9 stroke-marker" strokeWidth={2.2} />
          </div>
          <p className="text-sm text-marker text-center max-w-xs font-body">{error}</p>
          <Button variant="secondary" onClick={startCamera} className="gap-2">
            <ScribbleIcon name="camera" className="w-4 h-4" strokeWidth={2.2} />
            Try again
          </Button>
        </CardContent>
      )}

      {isActive && (
        <CardContent className="p-0 relative">
          <div className="relative w-full aspect-[4/3] bg-pencil wobble-sm overflow-hidden pencil-border m-2" style={{ width: "calc(100% - 1rem)" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            {isCountingDown && (
              <div className="absolute inset-0 flex items-center justify-center bg-pencil/60 backdrop-blur-sm">
                <div className="text-7xl font-display font-bold text-postit animate-ping-once">
                  {countdownValue}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 p-5">
            <Button variant="secondary" size="icon" onClick={stopCamera}>
              <ScribbleIcon name="alert" className="w-5 h-5" strokeWidth={2.4} />
            </Button>
            <Button
              onClick={takePhoto}
              size="lg"
              className="rounded-full w-16 h-16 p-0 bg-surface hover:bg-postit text-pencil pencil-border-3 hard-shadow-md active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              disabled={isCountingDown}
            >
              <ScribbleIcon name="camera" className="w-7 h-7 stroke-marker" strokeWidth={2.4} />
            </Button>
            <Button variant="secondary" size="icon" onClick={switchCamera}>
              <ScribbleIcon name="face" className="w-5 h-5" strokeWidth={2.4} />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
