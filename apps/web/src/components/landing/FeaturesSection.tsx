import { Button } from "@/components/ui/button";

export function FeaturesSection() {
  return (
    <div className="bg-[#030712] text-slate-300">
      
      {/* SECTION 1: VISUAL INTELLIGENCE */}
      <section id="methodology" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-cyan-900/50 bg-cyan-950/10 px-3 py-1 text-xs font-bold tracking-widest text-cyan-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                    02 VISUAL INTELLIGENCE
                </div>
                <h2 className="text-4xl md:text-5xl font-medium text-white mb-6">StudyMap™ Matrix</h2>
                <p className="max-w-2xl mx-auto text-lg text-slate-400">
                    Weighted visualization of exam impact vs complexity. Allocate energy where the ROI is highest.
                </p>
            </div>

            {/* Matrix Visualization Mockup */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Chart Area */}
                <div className="md:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-8 relative overflow-hidden backdrop-blur-sm group hover:border-white/10 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-xs font-bold tracking-widest text-slate-500 mb-8">PRIORITY DISTRIBUTION</h3>
                    
                    {/* Abstract Chart Representation */}
                    <div className="relative h-64 w-full border-l border-b border-white/10">
                        {/* Nodes */}
                        <div className="absolute bottom-12 left-12 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 border border-white/5">History</div>
                        <div className="absolute bottom-24 left-1/3 h-20 w-20 rounded-full bg-cyan-900/50 flex items-center justify-center text-[10px] text-cyan-200 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">Hash Maps</div>
                        <div className="absolute top-16 right-1/4 h-24 w-24 rounded-full bg-purple-900/50 flex flex-col items-center justify-center text-center text-[10px] text-purple-200 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                            <span className="font-bold">Binary<br/>Trees</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                        <span>Complexity</span>
                        <span>Impact Weight</span>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 h-full flex flex-col justify-center">
                         <h3 className="text-xs font-bold tracking-widest text-slate-500 mb-6">FOCUS ZONES</h3>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <span className="flex items-center gap-3 text-sm text-purple-300 group-hover:text-purple-200 transition-colors">
                                    <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                                    Critical
                                </span>
                                <span className="text-xs font-mono text-purple-500/80">3 Nodes</span>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <span className="flex items-center gap-3 text-sm text-cyan-300 group-hover:text-cyan-200 transition-colors">
                                    <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
                                    Essential
                                </span>
                                <span className="text-xs font-mono text-cyan-500/80">5 Nodes</span>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <span className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                    <span className="h-2 w-2 rounded-full bg-slate-600"></span>
                                    Background
                                </span>
                                <span className="text-xs font-mono text-slate-600">8 Nodes</span>
                            </div>
                         </div>
                    </div>
                    
                    <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-4 flex items-start gap-3">
                         <div className="mt-1 h-4 w-4 text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                         </div>
                         <p className="text-xs text-purple-200 leading-relaxed">
                            Insight: 2 hours on "Binary Trees" yields <span className="font-bold text-white">300%</span> more grade impact than "History of C++".
                         </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* SECTION 2: CONTEXT DEFINITION */}
      <section id="intelligence" className="py-24 relative bg-[#050a18]">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 md:order-1 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-transparent blur-2xl rounded-full opacity-50" />
                <div className="relative rounded-2xl border border-white/10 bg-[#0a0f20] p-8 shadow-2xl">
                     <div className="space-y-6">
                        {/* Mock Dropdowns */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Discipline</label>
                            <div className="flex items-center justify-between rounded-lg bg-slate-900/50 border border-white/5 px-4 py-3 text-sm text-slate-200">
                                <span className="flex items-center gap-2"><span className="text-slate-500">🎓</span> Computer Science</span>
                                <span className="text-slate-600">▼</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Timeline</label>
                            <div className="flex items-center justify-between rounded-lg bg-slate-900/50 border border-white/5 px-4 py-3 text-sm text-slate-200">
                                <span className="flex items-center gap-2"><span className="text-slate-500">🗓</span> Semester 3 (Fall)</span>
                                <span className="text-slate-600">▼</span>
                            </div>
                        </div>
                        <div className="space-y-2 pt-4">
                            <label className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Focus Vector</label>
                            <div className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-cyan-500/30 px-4 py-4 text-sm font-medium text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                <span className="flex items-center gap-2"><span className="text-cyan-500">{"</>"}</span> Data Structures & Algorithms</span>
                                <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">✓</span>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

            <div className="order-1 md:order-2">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-900/50 bg-blue-950/10 px-3 py-1 text-xs font-bold tracking-widest text-blue-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    01 CONTEXT DEFINITION
                </div>
                <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
                    Calibrate your<br />reality.
                </h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                    Filter the noise. Input your academic parameters to generate a context-aware curriculum that adapts to your semester's unique entropy.
                </p>
                
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Precision Mapping</h4>
                            <p className="text-sm text-slate-500">Isolate subjects for deep work states.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Temporal Allocation</h4>
                            <p className="text-sm text-slate-500">Resource planning based on semester timeline.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* SECTION 3: BRAINLOOM ENGINE */}
      <section id="access" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
            
            <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-900/50 bg-purple-950/10 px-3 py-1 text-xs font-bold tracking-widest text-purple-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    03 BRAINLOOM ENGINE
                </div>
                <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
                    Connect the<br />
                    <span className="text-purple-400">Knowledge Graph.</span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                    Knowledge is a neural network, not a list. Our Brainloom engine maps semantic dependencies so you never hit a prerequisite wall.
                </p>

                <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <div className="text-cyan-400 mb-2">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
                        </div>
                        <h4 className="text-white font-bold text-sm tracking-wide">DEPENDENCY TRACKING</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">Unlock concepts in the optimal sequence.</p>
                     </div>
                     <div className="space-y-2">
                        <div className="text-purple-400 mb-2">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                        </div>
                        <h4 className="text-white font-bold text-sm tracking-wide">COGNITIVE LOAD</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">Prevent burnout with balanced intensity.</p>
                     </div>
                </div>
            </div>

            {/* Canvas/Graph Area */}
            <div className="relative h-[400px] rounded-3xl bg-black border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center">
                 {/* Decorative Grid */}
                 <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.2}}></div>
                 
                 {/* Connection Lines (SVG) */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M100 200 Q 200 100 300 200 T 500 250" fill="none" stroke="url(#gradient-line)" strokeWidth="2" strokeDasharray="6 6" />
                    <defs>
                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" /> {/* Indigo */}
                            <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan */}
                        </linearGradient>
                    </defs>
                 </svg>

                 {/* Nodes */}
                 <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative group">
                         <div className="h-16 w-16 rounded-full bg-slate-900 border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)] flex items-center justify-center text-purple-300 font-serif italic text-xl">
                            fx
                         </div>
                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 tracking-widest uppercase border border-white/10">Algebra</div>
                    </div>
                 </div>

                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative group z-10">
                         <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                         <div className="h-20 w-20 rounded-full bg-slate-900 border border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.3)] flex items-center justify-center text-cyan-300">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                         </div>
                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-cyan-950/80 px-3 py-1 rounded text-[10px] font-bold text-cyan-200 tracking-widest uppercase border border-cyan-500/30 whitespace-nowrap">Calculus I</div>
                    </div>
                 </div>

                 <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
                    <div className="relative group">
                         <div className="h-14 w-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 font-mono text-sm">
                            []
                         </div>
                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 tracking-widest uppercase border border-white/5 whitespace-nowrap">Machine Learning</div>
                    </div>
                 </div>
            </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#02040a] py-12 text-center md:text-left">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                     <div className="h-8 w-8 rounded-lg bg-cyan-900/20 flex items-center justify-center text-cyan-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                     </div>
                     <span className="text-lg font-bold text-white tracking-wider">LearnPath</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto md:mx-0">
                    Synthesizing clarity in the chaotic landscape of academic development.
                </p>
            </div>
            
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Product</h4>
                <ul className="space-y-3 text-xs text-slate-400">
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Intelligence</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Brainloom API</a></li>
                </ul>
            </div>
            
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Resources</h4>
                <ul className="space-y-3 text-xs text-slate-400">
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Insights Blog</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
                </ul>
            </div>

            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Company</h4>
                <ul className="space-y-3 text-xs text-slate-400">
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600">
            <p>© 2026 LearnPath Inc. All rights reserved.</p>
            <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
