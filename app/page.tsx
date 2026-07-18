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
  { label: "Overall Score", value: "7.8/10", color: "text-brand-400" },
  { label: "Symmetry", value: "8.2/10", color: "text-emerald-400" },
  { label: "Skin Quality", value: "6.5/10", color: "text-amber-400" },
  { label: "Potential", value: "9.1/10", color: "text-flush-400" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Navigation — Glassmorphism sticky header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-flush-500 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-ink-100 font-display tracking-tight">
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

      {/* Hero — Modern Dark Cinema with ambient blobs */}
      <section className="relative overflow-hidden">
        {/* Ambient blob gradients — slow oscillation */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[10%] w-[520px] h-[520px] rounded-full bg-brand-600/12 blur-[120px] animate-blob" />
          <div
            className="absolute top-[5%] right-[5%] w-[420px] h-[420px] rounded-full bg-flush-500/10 blur-[110px] animate-blob"
            style={{ animationDelay: "-6s" }}
          />
          <div
            className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full bg-iris-600/12 blur-[120px] animate-blob"
            style={{ animationDelay: "-12s" }}
          />
        </div>

        {/* Mesh-tint base */}
        <div className="absolute inset-0 bg-mesh-brand opacity-60" />

        <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-brand-300 mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Facial Analysis
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink-100 leading-[1.05]">
              Discover Your
              <br />
              <span className="text-gradient-brand">Facial Potential</span>
            </h1>
            <p className="mt-7 text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
              AI-powered facial analysis and looksmaxxing recommendations. Upload a photo
              or use your camera to get a comprehensive report on your facial features,
              symmetry, and personalized improvement suggestions.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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

            <p className="mt-5 text-xs text-ink-400 font-mono tracking-wide">
              No sign-up required. Images are never stored.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Example Cards — Bento-pop stat row */}
      <section className="max-w-4xl mx-auto px-6 -mt-10 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {exampleCards.map((card) => (
            <motion.div key={card.label} variants={item}>
              <Card className="text-center hover:scale-[1.02] hover:border-white/15">
                <CardContent className="py-5">
                  <p className="text-xs text-ink-400 mb-1 font-mono uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold font-display ${card.color}`}>
                    {card.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features — Bento Box Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-100 font-display">
            Everything you need
          </h2>
          <p className="mt-3 text-ink-300 max-w-lg mx-auto">
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
              <Card className="h-full hover:border-brand-400/30 hover:shadow-glow hover:scale-[1.02]">
                <CardHeader>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600/20 to-flush-500/15 border border-brand-500/20 flex items-center justify-center mb-3">
                    <feat.icon className="w-5 h-5 text-brand-300" />
                  </div>
                  <CardTitle className="text-base font-display">{feat.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
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
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-100 font-display">
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
              <Card className="hover:border-white/15">
                <CardHeader>
                  <CardTitle className="text-base text-ink-100 font-display">
                    {faq.q}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-ink-300">
                    {faq.a}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-flush-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-ink-100 font-display">LooksMax AI</span>
          </div>

          <p className="text-xs text-ink-400 text-center font-mono">
            AI-generated aesthetic opinions, not scientific facts. Images are never stored.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-400 hover:text-ink-100 transition-colors"
            >
              <Code className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-400 hover:text-ink-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
