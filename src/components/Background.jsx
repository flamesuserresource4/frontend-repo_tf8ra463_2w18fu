import React from 'react'

// Animated starfield + subtle gradient mesh background
export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_20%_20%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(900px_600px_at_80%_30%,rgba(168,85,247,0.18),transparent_60%),radial-gradient(800px_800px_at_50%_90%,rgba(14,165,233,0.15),transparent_60%)]" />

      {/* Twinkling stars layer */}
      <div className="absolute inset-0 opacity-60" style={{
        backgroundImage:
          'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.45) 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 70% 50%, rgba(255,255,255,0.5) 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 90% 30%, rgba(255,255,255,0.55) 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.35) 50%, transparent 51%)',
        backgroundSize: '800px 800px, 700px 700px, 900px 900px, 1000px 1000px, 600px 600px',
        animation: 'pan 60s linear infinite',
      }} />

      {/* Slow moving nebula fog */}
      <div className="pointer-events-none absolute -inset-1 mix-blend-screen opacity-40" style={{
        background:
          'radial-gradient(1000px 700px at 30% 70%, rgba(59,130,246,0.15), transparent 60%), ' +
          'radial-gradient(900px 900px at 70% 40%, rgba(168,85,247,0.15), transparent 60%)',
        filter: 'blur(40px)',
        animation: 'float 24s ease-in-out infinite',
      }} />
    </div>
  )
}
