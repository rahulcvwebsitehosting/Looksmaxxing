"use client";

import { useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScribbleIcon } from "@/components/ui/scribble-icon";
import { useAppStore } from "@/hooks/store";
import { compressImage } from "@/hooks/useImageCompression";
import { toast } from "sonner";

export function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setImage, setStatus, imageBase64 } = useAppStore();

  const handleFile = useCallback(
    async (file: File) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a JPEG, PNG, or WebP image.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error("Image too large. Maximum size is 15MB.");
        return;
      }

      setStatus("compressing");
      try {
        const { base64, file: compressed } = await compressImage(file);
        setImage(base64, compressed);
      } catch {
        toast.error("Failed to process image. Please try another.");
        setStatus("idle");
      }
    },
    [setImage, setStatus]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (imageBase64) {
    return (
      <Card className="w-full max-w-lg mx-auto tilt-l">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="relative w-20 h-20 wobble-sm overflow-hidden flex-shrink-0 pencil-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-display font-bold text-pencil">Photo ready</p>
            <p className="text-xs text-pencil-muted mt-0.5 font-mono">Compressed & optimized</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              useAppStore.getState().clearImage();
            }}
            className="gap-1.5"
          >
            <ScribbleIcon name="trash" className="w-4 h-4" strokeWidth={2.2} />
            Remove
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="w-full max-w-lg mx-auto dashed-border bg-surface hover:bg-postit/30 hover:border-marker transition-all duration-150 cursor-pointer tilt-r"
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <CardContent className="flex flex-col items-center justify-center py-14 gap-5">
        <div className="wobble-sm bg-paper-aged pencil-border p-4 hard-shadow-sm">
          <ScribbleIcon name="upload" className="w-9 h-9 stroke-marker" strokeWidth={2.2} />
        </div>
        <div className="text-center">
          <p className="text-xl font-display font-bold text-pencil">
            Drop your photo here
          </p>
          <p className="text-base text-pencil-soft font-body mt-1">
            or click to browse
          </p>
          <p className="text-xs text-pencil-muted mt-3 font-mono">
            JPEG · PNG · WebP — max 15MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={handleFileInput}
        />
      </CardContent>
    </Card>
  );
}
