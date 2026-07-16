"use client";

import { useCallback, useRef } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/store";
import { compressImage } from "@/hooks/useImageCompression";
import { toast } from "sonner";
import { formatConfidence } from "@/lib/index";

export function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setImage, setStatus, imageBase64 } = useAppStore();

  const handleFile = useCallback(
    async (file: File) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
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
      <Card className="w-full max-w-lg mx-auto border-violet-800/30">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-violet-500/30">
            <img
              src={`data:image/jpeg;base64,${imageBase64}`}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">Image ready</p>
            <p className="text-xs text-zinc-500 mt-0.5">Compressed &amp; optimized</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              useAppStore.getState().clearImage();
            }}
          >
            Remove
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="w-full max-w-lg mx-auto border-dashed border-zinc-700 hover:border-violet-600/50 transition-colors cursor-pointer"
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-violet-600/10 flex items-center justify-center">
          <Upload className="w-8 h-8 text-violet-400" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-zinc-200">
            Upload your photo
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            JPEG, PNG, or WebP — max 15MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInput}
        />
      </CardContent>
    </Card>
  );
}