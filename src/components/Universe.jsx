import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Brain, Scale, Lightbulb, Activity, Sparkles } from 'lucide-react'
import Spline from '@splinetool/react-spline'

// Fallback local items in case backend is unavailable
const FALLBACK_SATELLITES = [
  {
    id: 1,
    title: '1. El Poder de Decidir',
    question: '¿Somos realmente dueños de nuestras elecciones o actuamos en piloto automático más de lo que creemos?',
    icon: Activity,
    color: 'from-blue-400 to-cyan-300',
    chips: ['Autonomía', 'Hábitos', 'Atención'],
    detail:
      'Explora cómo la intención consciente compite con los hábitos y las señales del entorno. Pequeñas pausas de conciencia pueden cambiar trayectorias completas.',
    activity: 'Describe una micro-decisión de hoy que vas a tomar con plena atención.',
  },
  {
    id: 2,
    title: '2. Cerebro y Emoción',
    question: '¿Cómo dialogan razón y emoción al decidir, y quién tiene la última palabra?',
    icon: Brain,
    color: 'from-fuchsia-400 to-violet-300',
    chips: ['Sistema 1 & 2', 'Interocepción', 'Regulación'],
    detail:
      'La emoción filtra la información antes de la lógica. No hay decisiones "puras"; aprende a regular para decidir mejor.',
    activity: 'Nombra una emoción reciente que influyó tu última decisión importante.',
  },
  {
    id: 3,
    title: '3. Decisiones en Contexto',
    question: '¿Cuánto pesa el entorno (social, cultural, digital) en lo que elegimos?',
    icon: Sparkles,
    color: 'from-purple-400 to-indigo-300',
    chips: ['Normas', 'Arquitectura de elección', 'Influencias'],
    detail: 'Diseña tu entorno para facilitar buenas opciones: lo cercano, visible y fácil gana.',
    activity: 'Anota un cambio de entorno que harías para facilitar una mejor elección.',
  },
  {
    id: 4,
    title: '4. Integridad y Dilema',
    question: '¿Qué sacrificamos (y por qué) cuando las opciones chocan con nuestros valores?',
    icon: Scale,
    color: 'from-rose-400 to-orange-300',
    chips: ['Valores', 'Costes ocultos', 'Coraje'],
    detail:
      'Clarificar valores reduce fricción en dilemas. Anticipa tus líneas rojas antes del momento crítico.',
    activity: 'Escribe un valor no negociable y una acción que lo honre esta semana.',
  },
  {
    id: 5,
    title: '5. Sesgos y Atajos',
    question: '¿Qué sesgos invisibles guían nuestros atajos mentales al decidir?',
    icon: Lightbulb,
    color: 'from-amber-400 to-yellow-300',
    chips: ['Anclaje', 'Confirmación', 'Disponibilidad'],
    detail:
      'Detectar sesgos no los elimina, pero reduce su poder cuando introduces fricción consciente.',
    activity: 'Señala un sesgo que pudiste haber tenido en una elección reciente.',
  },
  {
    id: 6,
    title: '6. Impacto y Futuro',
    question: '¿Cómo cambia el futuro cuando hoy decidimos distinto?',
    icon: CheckCircle2,
    color: 'from-emerald-400 to-teal-300',
    chips: ['Efecto compuesto', 'Trayectorias', 'Aprendizaje'],
    detail:
      'Las micro-decisiones diarias acumulan efectos exponenciales. Define tu dirección, no solo el siguiente paso.',
    activity: 'Esboza una micro-acción diaria que, repetida, cambiaría tu año.',
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

function Satellite({ item, radius, angle, onClick, visited }) {
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
      <div className="relative">
        <div className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${item.color} shadow-[0_0_30px_rgba(255,255,255,0.15)] ring-1 ring-white/20`}></div>
        <div className="absolute inset-0 rounded-full blur-xl opacity-50 bg-white/10" />
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-center whitespace-nowrap px-2">
          <div className="flex items-center gap-1 justify-center">
            {Icon && <Icon className="w-4 h-4 text-white/80" />}
            <span className="text-xs md:text-sm font-medium text-white/90 drop-shadow">{item.title}</span>
            {visited && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </div>
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-24 w-56 md:w-64 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur p-3 text-center text-blue-100 shadow-xl">
            <span className="text-xs leading-snug">{item.question}</span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function useUserId() {
  const [userId, setUserId] = useState('')
  useEffect(() => {
    let uid = localStorage.getItem('universe_user_id')
    if (!uid) {
      uid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
      localStorage.setItem('universe_user_id', uid)
    }
    setUserId(uid)
  }, [])
  return userId
}

export default function Universe() {
  const userId = useUserId()
  const [items, setItems] = useState(FALLBACK_SATELLITES)
  const [completed, setCompleted] = useState(new Set())
  const [zoomItem, setZoomItem] = useState(null)
  const [activityText, setActivityText] = useState('')
  const [loading, setLoading] = useState(false)

  const baseRadius = 160
  const angles = useMemo(() => {
    const step = (Math.PI * 2) / items.length
    return items.map((_, i) => -Math.PI / 2 + i * step)
  }, [items.length])

  useEffect(() => {
    const loadData = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      try {
        // Fetch satellites content
        const res = await fetch(`${baseUrl}/api/satellites`)
        if (res.ok) {
          const data = await res.json()
          // map icons by id
          const iconMap = { 1: Activity, 2: Brain, 3: Sparkles, 4: Scale, 5: Lightbulb, 6: CheckCircle2 }
          const enriched = (data.items || []).map((it) => ({ ...it, icon: iconMap[it.id] || Activity, color: FALLBACK_SATELLITES.find(f => f.id === it.id)?.color || 'from-blue-400 to-cyan-300' }))
          if (enriched.length) setItems(enriched)
        }
        // Fetch progress
        if (userId) {
          const p = await fetch(`${baseUrl}/api/progress/${userId}`)
          if (p.ok) {
            const data = await p.json()
            setCompleted(new Set(data.completed || []))
          }
        }
      } catch (e) {
        // ignore, fallback stays
      }
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleOpen = (item) => {
    setZoomItem(item)
    setActivityText('')
  }

  const handleComplete = async () => {
    if (!zoomItem) return
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    setLoading(true)
    try {
      // Simple validation: require at least 12 chars as a minimal engagement signal
      if (!activityText || activityText.trim().length < 12) {
        setLoading(false)
        return
      }
      const res = await fetch(`${baseUrl}/api/progress/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, satellite_id: zoomItem.id, completed: true }),
      })
      if (res.ok) {
        const data = await res.json()
        setCompleted(new Set(data.completed || []))
        setZoomItem(null)
      } else {
        // fallback local update
        setCompleted((prev) => new Set([...prev, zoomItem.id]))
        setZoomItem(null)
      }
    } catch (e) {
      setCompleted((prev) => new Set([...prev, zoomItem.id]))
      setZoomItem(null)
    } finally {
      setLoading(false)
    }
  }

  // Precompute line coordinates in a centered 800x800 viewBox
  const lines = useMemo(() => {
    return items.map((_, i) => {
      const angle = angles[i]
      const r = i % 2 === 0 ? baseRadius : baseRadius + 80
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
    })
  }, [angles, items, baseRadius])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* atmosphere */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
      </div>

      {/* 3D layer */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Spline scene="https://prod.spline.design/kow0cKDK6Tap7xO9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* central node */}
      <div className="relative z-10 flex items-center justify-center pt-20 pb-8">
        <motion.div
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 shadow-[0_0_80px_rgba(99,102,241,0.35)] ring-2 ring-white/20"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.2),transparent_60%)] animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <h1 className="text-lg md:text-2xl font-semibold leading-snug drop-shadow">El Mundo de las Decisiones</h1>
          </div>
        </motion.div>
      </div>

      {/* orbits */}
      <div className="pointer-events-none">
        <OrbitLine radius={baseRadius} />
        <OrbitLine radius={baseRadius + 80} delay={0.1} />
      </div>

      {/* lines */}
      <svg className="absolute inset-0" viewBox="-400 -400 800 800" preserveAspectRatio="xMidYMid meet">
        {lines.map((p, i) => (
          <line key={i} x1={0} y1={0} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        ))}
      </svg>

      {/* satellites */}
      <div className="relative z-10">
        {items.map((item, i) => (
          <Satellite
            key={item.id}
            item={item}
            radius={i % 2 === 0 ? baseRadius : baseRadius + 80}
            angle={angles[i]}
            onClick={handleOpen}
            visited={completed.has(item.id)}
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
              className="relative w-[92vw] max-w-3xl rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-blue-100 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2">{zoomItem.title}</h3>
                  <p className="text-sm text-blue-200/80 mb-4">{zoomItem.question}</p>
                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    {(zoomItem.chips || []).map((c, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">{c}</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-blue-100/90 mb-4">{zoomItem.detail}</p>

                  <div className="mt-2">
                    <label className="block text-xs text-blue-200/80 mb-1">Actividad rápida</label>
                    <p className="text-xs text-blue-200/70 mb-2">{zoomItem.activity}</p>
                    <textarea
                      value={activityText}
                      onChange={(e) => setActivityText(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-sm text-white placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                      placeholder="Escribe tu reflexión (mín. 12 caracteres)"
                    />
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={handleComplete}
                        disabled={loading || activityText.trim().length < 12}
                        className="rounded-lg bg-emerald-500/90 hover:bg-emerald-500 text-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Guardando…' : 'Marcar como completado'}
                      </button>
                      <button
                        onClick={() => setZoomItem(null)}
                        className="rounded-lg bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* footer hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-blue-200/70 px-4">
        Toca o pasa el ratón sobre los satélites y pulsa para explorar. Completa la actividad para marcar el progreso.
      </div>
    </div>
  )
}
