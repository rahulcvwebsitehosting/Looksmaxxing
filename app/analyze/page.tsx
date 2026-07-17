"use client";

import { useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadCard } from "@/components/input/upload-card";
import { CameraCard } from "@/components/input/camera-card";
import { AnalyzeButton } from "@/components/input/analyze-button";
import { Dashboard } from "@/components/analysis/dashboard";
import { useAppStore } from "@/hooks/store";
import Link from "next/link";

function AnalyzePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status, result, imageBase64, setStatus } = useAppStore();

  useEffect(() => {
    const cameraParam = searchParams.get("camera");
    if (cameraParam === "true" && !imageBase64) {
      // Let the CameraCard component handle activation
    }
  }, [searchParams, imageBase64]);

  const handleStartOver = useCallback(() => {
    useAppStore.getState().reset();
  }, []);

  // Show dashboard when analysis is complete
  if (status === "complete" && result) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-600/20 text-sm text-violet-400 mb-4">
          <Sparkles className="w-4 h-4" />
          AI Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
          Analyze Your Look
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base">
          Upload a photo or use your camera. Our AI will analyze your facial features
          and provide personalized looksmaxxing recommendations.
        </p>
      </motion.div>

      {/* Input section */}
      <AnimatePresence mode="wait">
        <motion.div
          key="input-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-6"
        >
          {/* Tabs: Upload vs Camera */}
          {!imageBase64 && (
            <div className="flex justify-center gap-3">
              <Button
                variant={
                  !searchParams.get("camera") ? "default" : "secondary"
                }
                size="sm"
                onClick={() => router.push("/analyze")}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
              <Button
                variant={
                  searchParams.get("camera") === "true" ? "default" : "secondary"
                }
                size="sm"
                onClick={() => router.push("/analyze?camera=true")}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Camera
              </Button>
            </div>
          )}

          {/* Show appropriate input card */}
          {searchParams.get("camera") === "true" ? (
            <CameraCard />
          ) : (
            <UploadCard />
          )}

          {/* Analyze button */}
          <AnimatePresence>
            {imageBase64 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AnalyzeButton />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function AnalyzePageWrapper() {
  return (
    <Suspense fallback={null}>
      <AnalyzePage />
    </Suspense>
  );
}