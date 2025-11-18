import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Brain, Scale, Lightbulb, Activity, Sparkles } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const satellites = [
  {
    id: 1,
    title: '1. El Poder de Decidir',
    question: '¿Somos realmente dueños de nuestras elecciones o actuamos en piloto automático más de lo que creemos?',
    icon: Activity,
    color: 'from-blue-400 to-cyan-300',
  },
  {
    id: 2,
    title: '2. Cerebro y Emoción',
    question: '¿Cómo dialogan razón y emoción al decidir, y quién tiene la última palabra?',
    icon: Brain,
    color: 'from-fuchsia-400 to-violet-300',
  },
  {
    id: 3,
    title: '3. Decisiones en Contexto',
    question: '¿Cuánto pesa el entorno (social, cultural, digital) en lo que elegimos?',
    icon: Sparkles,
    color: 'from-purple-400 to-indigo-300',
  },
  {
    id: 4,
    title: '4. Integridad y Dilema',
    question: '¿Qué sacrificamos (y por qué) cuando las opciones chocan con nuestros valores?',
    icon: Scale,
    color: 'from-rose-400 to-orange-300',
  },
  {
    id: 5,
    title: '5. Sesgos y Atajos',
    question: '¿Qué sesgos invisibles guían nuestros atajos mentales al decidir?',
    icon: Lightbulb,
    color: 'from-amber-400 to-yellow-300',
  },
  {
    id: 6,
    title: '6. Impacto y Futuro',
    question: '¿Cómo cambia el futuro cuando hoy decidimos distinto?',
    icon: CheckCircle2,
    color: 'from-emerald-400 to-teal-300',
  },
]

function OrbitLine({ radius, delay = 0 }) {
  return (
    <motion.div
      className="absolute rounded-full border border-white/10"
      style={{ width: radius * 2, height: radius * 2, left: `calc(50% - ${radius}px)`, top: `calc(50% - ${radius}px)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.2 }}
    />
  )
}

function Satellite({ item, index, radius, angle, onClick, visited }) {
  const Icon = item.icon
  return (
    <motion.button
      onClick={() => onClick(item)}
      className="absolute group"
      initial={false}
      animate={{
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 60, damping: 12 }}
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {/* planet */}
      <div className="relative">
        <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${item.color} shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20`}></div>
        {/* ring glow */}
        <div className="absolute inset-0 rounded-full blur-xl opacity-50 bg-white/10" />
        {/* label */}
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
          <div className="flex items-center gap-1 justify-center">
            <Icon className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/90 drop-shadow">{item.title}</span>
            {visited && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </div>
        </div>
        {/* hover card */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-24 w-64 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur p-3 text-center text-blue-100 shadow-xl">
            <span className="text-xs leading-snug">{item.question}</span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

export default function Universe() {
  const [opened, setOpened] = useState(new Set())
  const [zoomItem, setZoomItem] = useState(null)

  const baseRadius = 180
  const angles = useMemo(() => {
    const step = (Math.PI * 2) / satellites.length
    return satellites.map((_, i) => -Math.PI / 2 + i * step)
  }, [])

  const handleOpen = (item) => {
    setOpened(prev => new Set([...prev, item.id]))
    setZoomItem(item)
  }

  // Precompute line coordinates in a centered 800x800 viewBox
  const lines = useMemo(() => {
    return satellites.map((_, i) => {
      const angle = angles[i]
      const r = i % 2 === 0 ? baseRadius : baseRadius + 80
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
    })
  }, [angles])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
      </div>

      {/* 3D brain hero - keep on top but not blocking */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Spline scene="https://prod.spline.design/kow0cKDK6Tap7xO9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* central node */}
      <div className="relative z-10 flex items-center justify-center pt-24 pb-12">
        <motion.div
          className="relative w-56 h-56 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 shadow-[0_0_80px_rgba(99,102,241,0.35)] ring-2 ring-white/20"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.2),transparent_60%)] animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <h1 className="text-2xl font-semibold leading-snug drop-shadow">El Mundo de las Decisiones</h1>
          </div>
        </motion.div>
      </div>

      {/* orbits */}
      <div className="pointer-events-none">
        <OrbitLine radius={baseRadius} />
        <OrbitLine radius={baseRadius + 80} delay={0.1} />
      </div>

      {/* SVG connective lines (centered coordinate space) */}
      <svg className="absolute inset-0" viewBox="-400 -400 800 800" preserveAspectRatio="xMidYMid meet">
        {lines.map((p, i) => (
          <line key={i} x1={0} y1={0} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        ))}
      </svg>

      {/* satellites */}
      <div className="relative z-10">
        {satellites.map((item, i) => (
          <Satellite
            key={item.id}
            item={item}
            index={i}
            radius={i % 2 === 0 ? baseRadius : baseRadius + 80}
            angle={angles[i]}
            onClick={handleOpen}
            visited={opened.has(item.id)}
          />
        ))}
      </div>

      {/* zoom modal */}
      <AnimatePresence>
        {zoomItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[90vw] max-w-3xl rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-blue-100 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{zoomItem.title}</h3>
                  <p className="text-sm text-blue-200/80 mb-4">{zoomItem.question}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">💡 Dato curioso</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">🧠 Sesgo</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">⚖️ Ética</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">📈 Impacto</span>
                  </div>
                </div>
                <button
                  onClick={() => setZoomItem(null)}
                  className="rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* footer hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-blue-200/70">
        Pasa el ratón sobre los satélites y haz clic para explorar
      </div>
    </div>
  )
}
