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
  ChevronRight,
  Star,
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
  { label: "Overall Score", value: "7.8/10", color: "text-violet-400" },
  { label: "Symmetry", value: "8.2/10", color: "text-emerald-400" },
  { label: "Skin Quality", value: "6.5/10", color: "text-amber-400" },
  { label: "Potential", value: "9.1/10", color: "text-fuchsia-400" },
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
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-100">LooksMax AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/analyze">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-600/20 text-sm text-violet-400 mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Facial Analysis
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.1]">
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                Facial Potential
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
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

            <p className="mt-4 text-xs text-zinc-600">
              No sign-up required. Images are never stored.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Example Cards */}
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
              <Card className="border-zinc-800 text-center">
                <CardContent className="py-5">
                  <p className="text-xs text-zinc-500 mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
            Everything you need
          </h2>
          <p className="mt-3 text-zinc-400 max-w-lg mx-auto">
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
              <Card className="border-zinc-800 h-full hover:border-violet-800/30 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center mb-3">
                    <feat.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <CardTitle className="text-base">{feat.title}</CardTitle>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
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
              <Card className="border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-200">
                    {faq.q}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-zinc-400">
                    {faq.a}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-300">LooksMax AI</span>
          </div>

          <p className="text-xs text-zinc-600 text-center">
            AI-generated aesthetic opinions, not scientific facts. Images are never stored.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Code className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}