import { Wrench, Heart, Sparkles } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center bg-white/[0.03] border border-white/10 p-10 md:p-16 rounded-3xl backdrop-blur-md shadow-2xl max-w-2xl w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30 animate-pulse">
            <Wrench className="w-8 h-8 text-blue-400" />
          </div>
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center border
           border-red-500/30 animate-bounce">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          System Is <span className="text-transparent bg-clip-text bg-gradient-to-r
           from-blue-400 to-purple-500">Under Maintenance</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
          "We're currently performing maintenance and rolling out new improvements.
Our Brillient mind working hard to get everything ready. Thank you for your patience."
        </p>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium tracking-widest uppercase">Coming Soon</span>
        </div>
      </div>
      
      <p className="absolute bottom-3 text-sm text-gray-600 font-medium tracking-widest">
        STAY TUNED • WE WILL BE BACK SHORTLY
      </p>
    </div>
  );
}