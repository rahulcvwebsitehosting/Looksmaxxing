"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScribbleIcon } from "@/components/ui/scribble-icon";
import { UploadCard } from "@/components/input/upload-card";
import { CameraCard } from "@/components/input/camera-card";
import { AnalyzeButton } from "@/components/input/analyze-button";
import { Dashboard } from "@/components/analysis/dashboard";
import { useAppStore } from "@/hooks/store";
import Link from "next/link";

function AnalyzePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status, result, imageBase64 } = useAppStore();

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
            <ScribbleIcon name="arrow" className="w-4 h-4 scale-x-[-1]" strokeWidth={2.4} />
            Back home
          </Button>
        </Link>
      </div>

      {/* Page header — minimal, direct */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <p className="eyebrow mb-3">Step 1 — the photo</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-pencil mb-3 leading-tight">
          Show us your <span className="scribble-underline">face</span>.
        </h1>
        <p className="text-pencil-soft max-w-md mx-auto text-lg font-body">
          Upload a clear front-on photo. Or use your camera, live.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key="input-section"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Tabs: Upload vs Camera */}
          {!imageBase64 && (
            <div className="flex justify-center gap-3">
              <Button
                variant={!searchParams.get("camera") ? "marker" : "outline"}
                size="sm"
                onClick={() => router.push("/analyze")}
                className="gap-2"
              >
                <ScribbleIcon name="upload" className="w-4 h-4 stroke-white" strokeWidth={2.4} />
                Upload
              </Button>
              <Button
                variant={searchParams.get("camera") === "true" ? "marker" : "outline"}
                size="sm"
                onClick={() => router.push("/analyze?camera=true")}
                className="gap-2"
              >
                <ScribbleIcon name="camera" className="w-4 h-4 stroke-white" strokeWidth={2.4} />
                Camera
              </Button>
            </div>
          )}

          {searchParams.get("camera") === "true" ? (
            <CameraCard />
          ) : (
            <UploadCard />
          )}

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
