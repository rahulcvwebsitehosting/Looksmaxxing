"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Camera,
  Upload,
  ScanFace,
  Ruler,
  TrendingUp,
  Scissors,
  Shield,
  Zap,
  Code,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: ScanFace,
    title: "Face Analysis",
    desc: "Comprehensive analysis of facial features, symmetry, harmony, and golden ratio approximation.",
  },
  {
    icon: Ruler,
    title: "Symmetry Check",
    desc: "Left-right balance evaluation across eyes, nose, lips, and facial structure.",
  },
  {
    icon: TrendingUp,
    title: "Looksmaxxing Plan",
    desc: "Personalized improvement recommendations prioritized by difficulty and impact.",
  },
  {
    icon: Scissors,
    title: "Style Suggestions",
    desc: "Hairstyle, beard, and glasses recommendations tailored to your facial features.",
  },
  {
    icon: Shield,
    title: "Skincare Routine",
    desc: "Step-by-step skincare recommendations based on your skin analysis.",
  },
  {
    icon: Zap,
    title: "Fast & Private",
    desc: "Images are processed instantly and never stored. Complete privacy guaranteed.",
  },
];

const faqs = [
  {
    q: "How does LooksMax AI work?",
    a: "LooksMax AI uses advanced multimodal AI vision models to analyze your facial features. It evaluates symmetry, proportions, skin quality, and more — then generates a comprehensive report with personalized improvement suggestions.",
  },
  {
    q: "Is my photo stored or shared?",
    a: "No. Your photo is processed for analysis only and deleted immediately after the report is generated. We never store, share, or retain any images.",
  },
  {
    q: "How accurate are the results?",
    a: "The analysis represents AI-generated aesthetic opinions based on visible facial features and image quality. Results are subjective estimates, not scientific measurements. Photo quality, lighting, and angle all affect the output.",
  },
  {
    q: "What image formats are supported?",
    a: "JPEG, PNG, and WebP images up to 15MB are supported. The app compresses images to 1024px before analysis for faster processing.",
  },
  {
    q: "Can I use my phone camera?",
    a: "Yes! LooksMax AI supports live camera capture with mirror preview and front/back camera switching.",
  },
  {
    q: "Is this free to use?",
    a: "Currently, LooksMax AI is completely free with no authentication or payment required.",
  },
];

const exampleCards = [
  { label: "Overall Score", value: "7.8/10", color: "text-accent-600" },
  { label: "Symmetry", value: "8.2/10", color: "text-emerald-600" },
  { label: "Skin Quality", value: "6.5/10", color: "text-amber-600" },
  { label: "Potential", value: "9.1/10", color: "text-ink" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Navigation — clean white bar */}
      <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-ink font-display tracking-tight">
              LooksMax AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/analyze">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — clean editorial, light */}
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(37,99,235,0.06),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="eyebrow">AI-Powered Facial Analysis</span>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.05]">
              Discover Your
              <br />
              <span className="text-accent-700">Facial Potential</span>
            </h1>
            <p className="mt-6 text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed">
              AI-powered facial analysis and looksmaxxing recommendations. Upload a photo
              or use your camera to get a comprehensive report on your facial features,
              symmetry, and personalized improvement suggestions.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/analyze">
                <Button size="lg" className="gap-2 text-base px-8">
                  <Upload className="w-5 h-5" />
                  Upload Image
                </Button>
              </Link>
              <Link href="/analyze?camera=true">
                <Button variant="secondary" size="lg" className="gap-2 text-base px-8">
                  <Camera className="w-5 h-5" />
                  Use Camera
                </Button>
              </Link>
            </div>

            <p className="mt-5 text-xs text-ink-faint font-mono tracking-wide">
              No sign-up required. Images are never stored.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Example Cards — stat row */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {exampleCards.map((card) => (
            <motion.div key={card.label} variants={item}>
              <Card className="text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="py-5">
                  <p className="eyebrow mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold font-display ${card.color}`}>
                    {card.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="eyebrow">What you get</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink font-display">
            Everything you need
          </h2>
          <p className="mt-3 text-ink-soft max-w-lg mx-auto">
            Comprehensive analysis, actionable recommendations, and complete privacy.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feat) => (
            <motion.div key={feat.title} variants={item}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardHeader>
                  <div className="w-11 h-11 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center mb-3">
                    <feat.icon className="w-5 h-5 text-accent-600" />
                  </div>
                  <CardTitle className="text-base font-display">{feat.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-ink-soft">
                    {feat.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="eyebrow">Help center</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink font-display">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={item}>
              <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-base text-ink font-display">
                    {faq.q}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-ink-soft">
                    {faq.a}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-12 bg-surface-2">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-ink font-display">LooksMax AI</span>
          </div>

          <p className="text-xs text-ink-muted text-center">
            AI-generated aesthetic opinions, not scientific facts. Images are never stored.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-ink-faint hover:text-ink transition-colors"
              aria-label="Placeholder link"
            >
              <Code className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-ink-faint hover:text-ink transition-colors"
              aria-label="Placeholder link"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
