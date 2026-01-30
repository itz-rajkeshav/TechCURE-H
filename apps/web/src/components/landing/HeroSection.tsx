import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030712] px-4 pt-20 text-center">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute top-[-20%] left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[100px]" />

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-cyan-400">SYSTEM V2.0 LIVE</span>
        </div>

        {/* Headline */}
        <h1 className="relative z-10 mx-auto max-w-5xl text-6xl font-medium tracking-tight text-white md:text-8xl">
            Decision support for
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            Academic Clarity
            </span>
        </h1>

        {/* Subhead */}
        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 md:text-xl leading-relaxed">
            Stop guessing. Map your cognitive priorities and architect your
            learning path with data-driven precision in a deep-focus environment.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Button className="group relative h-12 overflow-hidden rounded-lg bg-white/5 px-8 text-sm font-bold tracking-widest text-white ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="relative z-10">START YOUR PATH</span>
            </Button>
            
            <Button variant="ghost" className="group h-12 gap-2 rounded-lg px-8 text-sm font-bold tracking-widest text-slate-400 ring-1 ring-transparent transition-all hover:bg-white/5 hover:text-white hover:ring-white/10">
                <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                SYSTEM DEMO
            </Button>
        </div>
    </section>
  );
}
