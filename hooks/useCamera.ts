import { useRef, useState, useCallback, useEffect } from "react";

interface UseCameraOptions {
  onCapture: (base64: string) => void;
}

export function useCamera({ onCapture }: UseCameraOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      setIsActive(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Camera access denied or unavailable";
      setError(msg);
      setIsActive(false);
    }
  }, [facingMode]);

  useEffect(() => {
    if (!isActive) return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (video && stream && video.srcObject !== stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, [isActive]);

  const switchCamera = useCallback(async () => {
    stopCamera();
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    // Wait for state to propagate before re-acquiring stream
    await new Promise((r) => setTimeout(r, 50));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      setIsActive(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Camera switch failed";
      setError(msg);
    }
  }, [facingMode, stopCamera]);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !streamRef.current) return;

    setIsCountingDown(true);
    let count = 3;
    setCountdownValue(count);

    const interval = setInterval(() => {
      count--;
      setCountdownValue(count);
      if (count <= 0) {
        clearInterval(interval);
        setIsCountingDown(false);

        const video = videoRef.current!;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d")!;

        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const MAX_EDGE = 1024;
        let { width, height } = canvas;
        if (width > MAX_EDGE || height > MAX_EDGE) {
          if (width > height) {
            height = Math.round((height / width) * MAX_EDGE);
            width = MAX_EDGE;
          } else {
            width = Math.round((width / height) * MAX_EDGE);
            height = MAX_EDGE;
          }
        }
        const outCanvas = document.createElement("canvas");
        outCanvas.width = width;
        outCanvas.height = height;
        const outCtx = outCanvas.getContext("2d")!;
        outCtx.drawImage(canvas, 0, 0, width, height);

        const dataUrl = outCanvas.toDataURL("image/jpeg", 0.9);
        const base64 = dataUrl.split(",")[1];
        onCapture(base64);
        stopCamera();
      }
    }, 1000);
  }, [onCapture, facingMode, stopCamera]);

  return {
    videoRef,
    isActive,
    isCountingDown,
    countdownValue,
    error,
    facingMode,
    startCamera,
    stopCamera,
    switchCamera,
    takePhoto,
  };
}
