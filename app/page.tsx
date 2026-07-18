import Link from "next/link";
import { ScribbleIcon } from "@/components/ui/scribble-icon";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex-1 paper-texture">
      {/* Navigation — minimal, paper */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm pencil-border border-x-0 border-t-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="wobble-sm bg-marker pencil-border hard-shadow-sm group-hover:-translate-x-px group-hover:-translate-y-px transition-transform">
              <ScribbleIcon name="spark" className="w-5 h-5 stroke-white m-1.5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-display font-bold text-pencil">
              LooksMax AI
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-body">
            <a href="#how" className="text-pencil-soft hover:text-marker transition-colors">How it works</a>
            <a href="#trust" className="text-pencil-soft hover:text-marker transition-colors">Trust</a>
            <Link href="/analyze">
              <Button size="sm" variant="marker">Analyze me</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — minimal, direct. One line, one CTA. */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="eyebrow mb-5">Looksmaxxing · made human</p>
        <h1 className="font-display font-bold text-pencil leading-[1.05] text-5xl sm:text-6xl md:text-7xl mb-6">
          How good do
          <br />
          you <span className="scribble-underline">actually</span> look?
        </h1>
        <p className="font-body text-lg sm:text-xl text-pencil-soft max-w-xl mx-auto mb-10 leading-relaxed">
          Upload a photo. Get a brutal honest score and a plan.
          Takes 30 seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/analyze">
            <Button size="lg" variant="marker" className="animate-pulse-marker">
              <ScribbleIcon name="camera" className="w-5 h-5 stroke-white mr-2" strokeWidth={2.4} />
              Analyze my face
            </Button>
          </Link>
          <a href="#how">
            <Button size="lg" variant="outline">
              <ScribbleIcon name="arrow" className="w-5 h-5 mr-2" strokeWidth={2.4} />
              How it works
            </Button>
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-10 text-sm font-body text-pencil-muted flex items-center justify-center gap-2 flex-wrap">
          <ScribbleIcon name="lock" className="w-4 h-4" strokeWidth={2} />
          No login. No storage. Your photo is analyzed and forgotten.
        </p>
      </section>

      {/* The 3-point — direct, hand-drawn cards (not a bento grid) */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="eyebrow mb-2">Three steps</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-pencil">
            From selfie to roadmap.
          </h2>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="bg-surface pencil-border wobble-md hard-shadow-sm p-7 tilt-l relative">
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-marker pencil-border wobble-sm flex items-center justify-center font-display font-bold text-white text-lg hard-shadow-sm">
              1
            </div>
            <div className="wobble-sm bg-paper-aged pencil-border p-3 inline-block mb-5">
              <ScribbleIcon name="upload" className="w-8 h-8" strokeWidth={2.2} />
            </div>
            <h3 className="font-display font-bold text-xl text-pencil mb-2">
              Drop a photo
            </h3>
            <p className="font-body text-base text-pencil-soft leading-relaxed">
              Front-on, decent light. Front camera works too.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-surface pencil-border wobble-md hard-shadow-sm p-7 tilt-r relative md:translate-y-4">
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-ballpoint pencil-border wobble-sm flex items-center justify-center font-display font-bold text-white text-lg hard-shadow-sm">
              2
            </div>
            <div className="wobble-sm bg-paper-aged pencil-border p-3 inline-block mb-5">
              <ScribbleIcon name="face" className="w-8 h-8" strokeWidth={2.2} />
            </div>
            <h3 className="font-display font-bold text-xl text-pencil mb-2">
              AI scores 12 features
            </h3>
            <p className="font-body text-base text-pencil-soft leading-relaxed">
              Jawline, eyes, skin, hair, symmetry, golden ratio.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-surface pencil-border wobble-md hard-shadow-sm p-7 tilt-l-2 relative md:translate-y-2">
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-postit-deep pencil-border wobble-sm flex items-center justify-center font-display font-bold text-pencil text-lg hard-shadow-sm">
              3
            </div>
            <div className="wobble-sm bg-paper-aged pencil-border p-3 inline-block mb-5">
              <ScribbleIcon name="chart" className="w-8 h-8" strokeWidth={2.2} />
            </div>
            <h3 className="font-display font-bold text-xl text-pencil mb-2">
              Get your plan
            </h3>
            <p className="font-body text-base text-pencil-soft leading-relaxed">
              Hairstyle, beard, skincare, glasses, fitness. Sorted by impact.
            </p>
          </div>
        </div>
      </section>

      {/* What you get — minimal list, hand-drawn */}
      <section className="bg-paper-aged pencil-border border-x-0 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="eyebrow mb-2">What is inside</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-pencil">
              A full report. No fluff.
            </h2>
          </div>

          <ul className="space-y-4">
              {[
                { icon: "star", text: "Overall and potential score (out of 10)" },
                { icon: "chart", text: "Feature breakdown with radar chart" },
                { icon: "scissors", text: "5 hairstyle suggestions for your face" },
                { icon: "shirt", text: "Beard styles that match your jaw" },
                { icon: "glasses", text: "Glasses frames suited to your features" },
                { icon: "droplet", text: "Skincare routine, step by step" },
                { icon: "dumbbell", text: "Fitness focus areas for visual impact" },
              ].map((item, i) => (
                <li
                  key={i}
                  className={`bg-surface pencil-border wobble-sm hard-shadow-sm px-5 py-4 flex items-start gap-4 ${
                    i % 2 === 0 ? "tilt-l" : "tilt-r"
                  }`}
                >
                <ScribbleIcon
                  name={item.icon as "star" | "chart" | "scissors" | "shirt" | "glasses" | "droplet" | "dumbbell"}
                  className="w-6 h-6 mt-0.5 flex-shrink-0"
                  strokeWidth={2.2}
                />
                <span className="font-body text-lg text-pencil leading-snug">
                  {item.text}
                </span>
                <ScribbleIcon
                  name="check"
                  className="w-5 h-5 mt-1 flex-shrink-0 stroke-marker ml-auto"
                  strokeWidth={2.4}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust & authority — paper note + signature */}
      <section id="trust" className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-surface dashed-border-marker wobble-md hard-shadow-marker p-8 tilt-r relative">
          {/* Tape decoration top-left */}
          <div className="absolute -top-3 left-6 w-16 h-7 bg-postit rotate-[-4deg] pencil-border-3 hard-shadow-sm" />
          <ScribbleIcon name="shield" className="w-10 h-10 stroke-marker mb-4" strokeWidth={2.2} />
          <h2 className="font-display font-bold text-2xl text-pencil mb-3">
            Built with privacy first.
          </h2>
          <p className="font-body text-lg text-pencil-soft leading-relaxed mb-5">
            We don&rsquo;t store your photo. We don&rsquo;t need an account.
            Your analysis runs through your chosen AI provider, and that&rsquo;s it.
          </p>
          <div className="flex items-center gap-3 text-sm font-body text-pencil-muted">
            <ScribbleIcon name="signature" className="w-8 h-8 stroke-marker" strokeWidth={2} />
            <span>— the LooksMax AI team</span>
          </div>
        </div>
      </section>

      {/* Final CTA — big, direct */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display font-bold text-4xl text-pencil mb-4">
          Ready to see the <span className="scribble-underline">truth</span>?
        </h2>
        <p className="font-body text-lg text-pencil-soft mb-8">
          It might sting. It might surprise you. Either way — you&rsquo;ll know.
        </p>
        <Link href="/analyze" className="inline-block">
          <Button size="lg" variant="marker" className="animate-pulse-marker">
            <ScribbleIcon name="arrow" className="w-5 h-5 stroke-white mr-2" strokeWidth={2.4} />
            Start my analysis
          </Button>
        </Link>
      </section>

      {/* Footer — minimal */}
      <footer className="pencil-border border-x-0 border-b-0 bg-paper-aged py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="wobble-sm bg-marker pencil-border hard-shadow-sm">
              <ScribbleIcon name="spark" className="w-4 h-4 stroke-white m-1" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-pencil">LooksMax AI</span>
          </div>
          <p className="text-sm font-body text-pencil-muted">
            For educational purposes only. Not medical advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
