
const Loading = () => {
  return (
    <div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .spinner {
          animation: spin 2s linear infinite;
        }
        .glow-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      <main className="min-h-screen bg-[#15213356] flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Animated Spinner */}
          <div className="relative w-24 h-24">
            <svg className="w-full h-full spinner" viewBox="0 0 100 100" fill="none">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeDasharray="70 283"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full"></div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Loading<span className="glow-pulse">.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Preparing your interview strategy
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-pink-500 rounded-full"
                style={{
                  animation: `pulse-glow 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Loading
