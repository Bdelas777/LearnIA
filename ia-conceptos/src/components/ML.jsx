import { useState } from "react";

// ── Demo: Pipeline animado de 7 pasos ────────────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, num:"01", label:"Recolectar datos",       icon:"📂", color:"sky",     desc:"Calidad y cantidad determinan el éxito del modelo." },
    { id:1, num:"02", label:"Preparar datos",          icon:"⚙️",  color:"violet",  desc:"Mezclar, normalizar, balancear y dividir 80/20." },
    { id:2, num:"03", label:"Elegir el modelo",        icon:"🧠",  color:"emerald", desc:"Clasificación, regresión, clustering, deep learning…" },
    { id:3, num:"04", label:"Entrenar el modelo",      icon:"🔁",  color:"amber",   desc:"El algoritmo ajusta los pesos con los datos de entrenamiento." },
    { id:4, num:"05", label:"Evaluar",                 icon:"📊",  color:"rose",    desc:"Validar con datos que el modelo nunca vio. Objetivo: ≥ 90%." },
    { id:5, num:"06", label:"Parameter Tuning",        icon:"🎛️",  color:"purple",  desc:"Ajustar epochs, learning rate e hiperparámetros." },
    { id:6, num:"07", label:"Predicción / Inferencia", icon:"🚀",  color:"teal",    desc:"El modelo está listo para usarse en la vida real." },
  ];

  const colorMap = {
    sky:    { border:"border-sky-500/40",    bg:"bg-sky-500/15",    text:"text-sky-300",    dot:"bg-sky-400",    num:"text-sky-500/30" },
    violet: { border:"border-violet-500/40", bg:"bg-violet-500/15", text:"text-violet-300", dot:"bg-violet-400", num:"text-violet-500/30" },
    emerald:{ border:"border-emerald-500/40",bg:"bg-emerald-500/15",text:"text-emerald-300",dot:"bg-emerald-400",num:"text-emerald-500/30" },
    amber:  { border:"border-amber-500/40",  bg:"bg-amber-500/15",  text:"text-amber-300",  dot:"bg-amber-400",  num:"text-amber-500/30" },
    rose:   { border:"border-rose-500/40",   bg:"bg-rose-500/15",   text:"text-rose-300",   dot:"bg-rose-400",   num:"text-rose-500/30" },
    purple: { border:"border-purple-500/40", bg:"bg-purple-500/15", text:"text-purple-300", dot:"bg-purple-400", num:"text-purple-500/30" },
    teal:   { border:"border-teal-500/40",   bg:"bg-teal-500/15",   text:"text-teal-300",   dot:"bg-teal-400",   num:"text-teal-500/30" },
  };

  const [current, setCurrent] = useState(-1);
  const [running,  setRunning]  = useState(false);

  const run = () => {
    setCurrent(-1); setRunning(true);
    let i = 0;
    const iv = setInterval(() => {
      setCurrent(i); i++;
      if (i >= steps.length) { clearInterval(iv); setTimeout(() => { setRunning(false); setCurrent(-1); }, 1400); }
    }, 750);
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Metodología de Machine Learning</p>
      <div className="space-y-2 mb-4">
        {steps.map((s) => {
          const c = colorMap[s.color];
          const isActive = current === s.id;
          const isDone   = current > s.id;
          return (
            <div key={s.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                isActive ? `${c.border} ${c.bg} scale-[1.01]` :
                isDone   ? "border-white/10 bg-white/[0.04] opacity-60" :
                           "border-white/5 bg-transparent"}`}>
              <span className={`font-black text-sm font-mono w-6 ${isActive ? c.text : isDone ? "text-gray-600" : "text-gray-700"}`}>{s.num}</span>
              <span className="text-base w-6 text-center">{s.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isActive ? c.text : isDone ? "text-gray-400" : "text-gray-600"}`}>{s.label}</p>
                {isActive && <p className="text-xs text-gray-500 animate-pulse mt-0.5">{s.desc}</p>}
              </div>
              {isDone   && <span className="text-emerald-400 text-xs font-mono">✓</span>}
              {isActive && <div className={`w-2 h-2 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />}
            </div>
          );
        })}
      </div>
      {current >= 0 && current < steps.length && (
        <div className="bg-black/40 rounded-lg px-4 py-2 mb-3 font-mono text-sm text-emerald-300 animate-pulse">
          → Paso {steps[current].num}: <span className="text-amber-300">{steps[current].label}</span>
        </div>
      )}
      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
          running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando metodología..." : "▶ Simular pipeline completo"}
      </button>
    </div>
  );
}

// ── Demo: Selector de tipo de aprendizaje ────────────────────────
function AprendizajeDemo() {
  const [tipo, setTipo] = useState("supervisado");
  const [accuracy, setAccuracy] = useState(72);

  const evalAcc = (v) => {
    if (v >= 90) return { label:"Excelente", color:"emerald", msg:"El modelo tiene alta confianza para producción." };
    if (v >= 70) return { label:"Aceptable",  color:"amber",   msg:"Podría mejorar con más datos o ajuste de hiperparámetros." };
    if (v <= 50) return { label:"Inútil",     color:"rose",    msg:"Equivale a lanzar una moneda. Necesita rediseño." };
    return              { label:"Insuficiente",color:"orange",  msg:"Ajusta epochs, learning rate o arquitectura del modelo." };
  };

  const r = evalAcc(accuracy);
  const colorMap = {
    emerald: { bg:"bg-emerald-500/15", border:"border-emerald-500/40", text:"text-emerald-300", bar:"bg-emerald-500" },
    amber:   { bg:"bg-amber-500/15",   border:"border-amber-500/40",   text:"text-amber-300",   bar:"bg-amber-500" },
    rose:    { bg:"bg-rose-500/15",    border:"border-rose-500/40",    text:"text-rose-300",    bar:"bg-rose-500" },
    orange:  { bg:"bg-orange-500/15",  border:"border-orange-500/40",  text:"text-orange-300",  bar:"bg-orange-500" },
  };
  const c = colorMap[r.color];

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo interactiva — Tipos de aprendizaje y evaluación</p>

      <div className="flex gap-2 mb-5">
        {[
          { k:"supervisado",    label:"Supervisado" },
          { k:"no_supervisado", label:"No Supervisado" },
        ].map(({ k, label }) => (
          <button key={k} onClick={() => setTipo(k)}
            className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
              tipo === k
                ? "border-violet-400/60 bg-violet-500/20 text-violet-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      {tipo === "supervisado" ? (
        <div className="space-y-3 mb-5">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-emerald-300 text-xs font-bold mb-2">Aprendizaje Supervisado</p>
            <p className="text-gray-500 text-sm mb-3">Conocemos de antemano los datos correctos de salida. El algoritmo aprende a mapear entradas → salidas.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-lg p-3 font-mono text-xs">
                <p className="text-emerald-400 mb-1">Entrenamiento</p>
                <p className="text-gray-400">70% — 80% del total</p>
                <p className="text-amber-300">→ aprende patrones</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 font-mono text-xs">
                <p className="text-sky-400 mb-1">Validación</p>
                <p className="text-gray-400">20% — 30% del total</p>
                <p className="text-amber-300">→ evalúa rendimiento</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="text-sky-300 text-xs font-bold mb-3">Simulador de precisión del modelo</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-gray-400 text-sm font-mono w-16">accuracy =</span>
              <input type="range" min={0} max={100} value={accuracy}
                onChange={e => setAccuracy(Number(e.target.value))}
                className="flex-1 accent-sky-500" />
              <span className="text-amber-300 font-mono font-bold text-xl w-12 text-right">{accuracy}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-3">
              <div className={`h-2 rounded-full transition-all duration-300 ${c.bar}`} style={{ width:`${accuracy}%` }} />
            </div>
            <div className={`rounded-xl border ${c.border} ${c.bg} p-3 flex items-center gap-3`}>
              <p className={`font-bold text-base ${c.text}`}>{r.label}</p>
              <p className="text-gray-400 text-xs flex-1">{r.msg}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-5">
          <p className="text-amber-300 text-xs font-bold mb-2">Aprendizaje No Supervisado</p>
          <p className="text-gray-500 text-sm mb-4">NO conocemos de antemano los datos de salida. El modelo descubre estructura y patrones por sí mismo.</p>
          <div className="space-y-2">
            {[
              { algo:"K-Means",   use:"Segmentar clientes por comportamiento de compra.",  color:"amber" },
              { algo:"DBSCAN",    use:"Detectar anomalías y outliers en transacciones.",    color:"rose" },
              { algo:"PCA",       use:"Reducir dimensionalidad antes de clustering.",       color:"violet" },
            ].map((item) => {
              const col = { amber:"text-amber-300 bg-amber-500/10", rose:"text-rose-300 bg-rose-500/10", violet:"text-violet-300 bg-violet-500/10" }[item.color];
              return (
                <div key={item.algo} className="flex items-start gap-3 bg-black/20 rounded-lg p-3">
                  <code className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${col}`}>{item.algo}</code>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.use}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
function SectionHeader({ icon, title, color }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border"
        style={{ background:`${color}15`, borderColor:`${color}40` }}>
        {icon}
      </div>
      <h2 className="text-lg font-bold" style={{ color }}>{title}</h2>
    </div>
  );
}

function Tip({ color, children }) {
  const map = {
    violet:  { bg:"bg-violet-500/10",  border:"border-violet-500/20",  text:"text-violet-300" },
    sky:     { bg:"bg-sky-500/10",     border:"border-sky-500/20",     text:"text-sky-300" },
    amber:   { bg:"bg-amber-500/10",   border:"border-amber-500/20",   text:"text-amber-300" },
    emerald: { bg:"bg-emerald-500/10", border:"border-emerald-500/20", text:"text-emerald-300" },
    rose:    { bg:"bg-rose-500/10",    border:"border-rose-500/20",    text:"text-rose-300" },
  };
  const c = map[color] || map.violet;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4 text-sm ${c.text}`}>
      💡 {children}
    </div>
  );
}

function StepCard({ num, icon, title, color, children }) {
  const c = {
    sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    step:"text-sky-500/25" },
    violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300", step:"text-violet-500/25" },
    emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",step:"text-emerald-500/25" },
    amber:  { border:"border-amber-500/20",  bg:"bg-amber-500/5",  text:"text-amber-300",  step:"text-amber-500/25" },
    rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300",   step:"text-rose-500/25" },
    purple: { border:"border-purple-500/20", bg:"bg-purple-500/5", text:"text-purple-300", step:"text-purple-500/25" },
    teal:   { border:"border-teal-500/20",   bg:"bg-teal-500/5",   text:"text-teal-300",   step:"text-teal-500/25" },
  }[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-start gap-4">
        <span className={`text-4xl font-black leading-none flex-shrink-0 ${c.step}`} style={{ fontFamily:"monospace" }}>{num}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span>{icon}</span>
            <h3 className={`font-bold text-base ${c.text}`}>{title}</h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function IntroML({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily:"'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        code { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-violet-900/15 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-sky-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo IV</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily:"monospace" }}>Introducción al ML</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#8b5cf6", color:"#8b5cf6", fontFamily:"monospace" }}>
            🤖 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Introducción al{" "}
            <span style={{
              background:"linear-gradient(135deg, #8b5cf6, #0ea5e9, #10b981)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Machine Learning</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Aprende qué es el
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">aprendizaje automático</code>,
            cómo funciona la metodología de 7 pasos y los tipos de aprendizaje que existen.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",       label:"📌 Introducción" },
            { href:"#definicion",  label:"🧠 Definición" },
            { href:"#aplicaciones",label:"🌍 Aplicaciones" },
            { href:"#metodologia", label:"🔄 Metodología" },
            { href:"#modelos",     label:"⚡ Modelos" },
            { href:"#aprendizaje", label:"📚 Tipos de aprendizaje" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ 1. INTRODUCCIÓN ══════════════════════════════════ */}
        <section id="intro" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📌" title="Introducción" color="#8b5cf6" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            El <strong className="text-white">Machine Learning o Aprendizaje Automático</strong> es un término cada vez más frecuente porque da un nuevo uso y sentido a los datos que poseen las organizaciones. Se usa para resolver problemas que <strong className="text-white">no pueden abordarse con programación tradicional</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon:"🔍", label:"Buscadores web",       desc:"Clasificación de contenido",             color:"#0ea5e9" },
              { icon:"👤", label:"Redes sociales",        desc:"Reconocimiento facial y recomendaciones", color:"#8b5cf6" },
              { icon:"📧", label:"Correo electrónico",    desc:"Detección de SPAM",                      color:"#f43f5e" },
              { icon:"🏥", label:"Medicina",              desc:"Modelos predictivos de enfermedades",     color:"#10b981" },
              { icon:"🛒", label:"Comercio",              desc:"Segmentación de clientes",               color:"#f59e0b" },
              { icon:"🎬", label:"Netflix / Amazon",      desc:"Recomendaciones personalizadas",          color:"#a855f7" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-semibold mb-0.5" style={{ color:item.color }}>{item.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <Tip color="violet">
            ML se usa cuando el problema <strong>no puede resolverse mediante reglas explícitas</strong>: conducción autónoma, reconocimiento de escritura, procesamiento de lenguaje natural, visión computarizada.
          </Tip>
        </section>

        {/* ══ 2. DEFINICIÓN ════════════════════════════════════ */}
        <section id="definicion" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🧠" title="Definición de Machine Learning" color="#0ea5e9" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            El Machine Learning es una rama de la <strong className="text-white">inteligencia artificial</strong> que crea programas capaces de <strong className="text-white">generalizar comportamientos a partir de datos</strong>, sin ser explícitamente programados para cada tarea.
          </p>

          <div className="space-y-3 mb-5">
            {[
              { autor:"Definición general", año:"",    color:"sky",    def:"Enseñar a un computador a aprender conceptos usando datos, sin ser explícitamente programado para ello." },
              { autor:"Arthur Samuel",      año:"1959", color:"violet", def:"Campo de estudio que da a los ordenadores la habilidad de aprender sin la necesidad de ser explícitamente programados." },
              { autor:"Tom Mitchell",       año:"1998", color:"emerald",def:"Un programa aprende con experiencia E, tarea T y rendimiento P, si su desempeño en T, medido por P, mejora con E." },
            ].map((item) => {
              const c = {
                sky:     { border:"border-sky-500/20",     bg:"bg-sky-500/5",     text:"text-sky-300",     badge:"bg-sky-500/20 text-sky-300" },
                violet:  { border:"border-violet-500/20",  bg:"bg-violet-500/5",  text:"text-violet-300",  badge:"bg-violet-500/20 text-violet-300" },
                emerald: { border:"border-emerald-500/20", bg:"bg-emerald-500/5", text:"text-emerald-300", badge:"bg-emerald-500/20 text-emerald-300" },
              }[item.color];
              return (
                <div key={item.autor} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${c.text}`}>{item.autor}</span>
                    {item.año && <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${c.badge}`}>{item.año}</span>}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed italic">"{item.def}"</p>
                </div>
              );
            })}
          </div>

          {/* Fórmula de Mitchell */}
          <div className="bg-black/40 rounded-xl border border-white/10 p-5 font-mono text-sm">
            <p className="text-gray-500 mb-2"># Definición formal de Tom Mitchell</p>
            <p><span className="text-violet-400">P</span><span className="text-white"> = rendimiento en tarea </span><span className="text-emerald-400">T</span></p>
            <p><span className="text-sky-400">E</span><span className="text-white"> = experiencia (datos de entrenamiento)</span></p>
            <p className="mt-1"><span className="text-amber-300">mejora</span><span className="text-white">(P, T) </span><span className="text-violet-400">←</span><span className="text-white"> más </span><span className="text-sky-400">E</span><span className="text-gray-500 ml-2"># eso es aprender</span></p>
          </div>
        </section>

        {/* ══ 3. APLICACIONES ══════════════════════════════════ */}
        <section id="aplicaciones" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"100ms" }}>
          <SectionHeader icon="🌍" title="Modelos y sus Aplicaciones" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Cada tipo de problema tiene un modelo más adecuado. Esta tabla resume los modelos más importantes y sus casos de uso reales.
          </p>
          <div className="space-y-2">
            {[
              { modelo:"Logistic Regression",        app:"Predicción de precios de inmuebles",                      color:"sky" },
              { modelo:"Fully Connected Networks",   app:"Clasificación general de datos tabulares",                 color:"violet" },
              { modelo:"Convolutional Neural Nets",  app:"Detección de objetos en imágenes (ej. gatos en fotos)",   color:"emerald" },
              { modelo:"Recurrent Neural Networks",  app:"Reconocimiento de voz y texto secuencial",                 color:"amber" },
              { modelo:"Random Forest",              app:"Detección de fraude financiero",                           color:"rose" },
              { modelo:"Reinforcement Learning",     app:"Enseñar a la máquina a jugar videojuegos y vencer",        color:"purple" },
              { modelo:"Generative Models",          app:"Creación y síntesis de imágenes realistas",               color:"teal" },
              { modelo:"K-Means",                   app:"Segmentar audiencias e inventarios por grupos similares",   color:"sky" },
              { modelo:"k-Nearest Neighbors",       app:"Motores de recomendación por similitud o cercanía",        color:"violet" },
              { modelo:"Bayesian Classifiers",      app:"Clasificación de emails: spam o no spam",                   color:"emerald" },
            ].map((row) => {
              const c = {
                sky:    "text-sky-300 bg-sky-500/10 border-sky-500/20",
                violet: "text-violet-300 bg-violet-500/10 border-violet-500/20",
                emerald:"text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
                amber:  "text-amber-300 bg-amber-500/10 border-amber-500/20",
                rose:   "text-rose-300 bg-rose-500/10 border-rose-500/20",
                purple: "text-purple-300 bg-purple-500/10 border-purple-500/20",
                teal:   "text-teal-300 bg-teal-500/10 border-teal-500/20",
              }[row.color];
              return (
                <div key={row.modelo} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors px-4 py-3">
                  <code className={`text-xs px-2 py-0.5 rounded border font-mono whitespace-nowrap ${c}`}>{row.modelo}</code>
                  <p className="text-gray-400 text-sm">{row.app}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 4. METODOLOGÍA ═══════════════════════════════════ */}
        <section id="metodologia" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="🔄" title="Metodología de 7 Pasos" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Todo proyecto de Machine Learning sigue un ciclo iterativo. La mayoría de los pasos se repiten hasta alcanzar la precisión deseada.
          </p>

          <PipelineDemo />

          <div className="mt-6 space-y-4">
            <StepCard num="01" icon="📂" title="Recolectar Datos" color="sky">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">La <strong className="text-white">calidad y cantidad</strong> de los datos impacta directamente en el rendimiento del modelo. Pueden venir de bases de datos, APIs o crearse desde cero.</p>
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                <p className="text-sky-300 text-xs font-bold mb-2">Fuentes populares de datos</p>
                <div className="space-y-1">
                  {[
                    { name:"Kaggle",             url:"kaggle.com/datasets",          color:"emerald" },
                    { name:"UCI ML Repository",   url:"archive.ics.uci.edu/ml/",     color:"amber" },
                    { name:"AWS Open Datasets",   url:"aws.amazon.com/datasets/",    color:"orange" },
                    { name:"DataPortals.org",     url:"dataportals.org",             color:"violet" },
                  ].map((s) => {
                    const col = { emerald:"text-emerald-300", amber:"text-amber-300", orange:"text-orange-300", violet:"text-violet-300" }[s.color];
                    return (
                      <div key={s.name} className="flex items-center justify-between text-xs bg-black/20 rounded-lg px-3 py-2">
                        <span className={`font-bold font-mono ${col}`}>{s.name}</span>
                        <span className="text-gray-600 font-mono">{s.url}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </StepCard>

            <StepCard num="02" icon="⚙️" title="Preparar los Datos" color="violet">
              <p className="text-gray-500 text-sm mb-3">Fase crítica: datos mal preparados arruinan cualquier modelo por bueno que sea.</p>
              <div className="space-y-2">
                {[
                  { label:"Mezclar datos",         desc:"Evita que el orden de procesamiento sea determinante.",       color:"violet" },
                  { label:"Buscar correlaciones",  desc:"Selecciona características más relacionadas con el objetivo.", color:"sky" },
                  { label:"Reducir con PCA",        desc:"Elimina variables redundantes para simplificar el modelo.",   color:"emerald" },
                  { label:"Balancear clases",       desc:"Igual cantidad de ejemplos por clase para evitar sesgo.",     color:"amber" },
                  { label:"Split 80/20",            desc:"80% entrenamiento — 20% validación (puede variar).",         color:"rose" },
                  { label:"Normalizar y limpiar",   desc:"Eliminar duplicados, corregir errores y estandarizar.",      color:"purple" },
                ].map((item) => {
                  const col = {
                    violet:"text-violet-300 bg-violet-500/10",
                    sky:"text-sky-300 bg-sky-500/10",
                    emerald:"text-emerald-300 bg-emerald-500/10",
                    amber:"text-amber-300 bg-amber-500/10",
                    rose:"text-rose-300 bg-rose-500/10",
                    purple:"text-purple-300 bg-purple-500/10",
                  }[item.color];
                  return (
                    <div key={item.label} className="flex items-start gap-3 bg-black/20 rounded-lg px-3 py-2">
                      <code className={`text-xs px-2 py-0.5 rounded font-mono whitespace-nowrap ${col}`}>{item.label}</code>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </StepCard>

            <StepCard num="03" icon="🧠" title="Elegir el Modelo" color="emerald">
              <p className="text-gray-500 text-sm mb-4">El tipo de problema determina el modelo. No existe un modelo universal.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { tipo:"Clasificación",     desc:"Predice categorías discretas (sí/no, A/B/C).",            color:"emerald", icon:"🏷️" },
                  { tipo:"Regresión",          desc:"Predice un valor continuo (precio, temperatura).",         color:"sky",     icon:"📈" },
                  { tipo:"Clustering",         desc:"Agrupa sin etiquetas. Descubre estructura en los datos.",  color:"amber",   icon:"🔵" },
                  { tipo:"Deep Learning",      desc:"Redes neuronales profundas para imágenes, texto, audio.",  color:"violet",  icon:"🕸️" },
                ].map((m) => {
                  const c = {
                    emerald:{ border:"border-emerald-500/20", bg:"bg-emerald-500/5", text:"text-emerald-300" },
                    sky:    { border:"border-sky-500/20",     bg:"bg-sky-500/5",     text:"text-sky-300" },
                    amber:  { border:"border-amber-500/20",   bg:"bg-amber-500/5",   text:"text-amber-300" },
                    violet: { border:"border-violet-500/20",  bg:"bg-violet-500/5",  text:"text-violet-300" },
                  }[m.color];
                  return (
                    <div key={m.tipo} className={`rounded-xl border ${c.border} ${c.bg} p-3`}>
                      <span className="text-xl mb-1 block">{m.icon}</span>
                      <p className={`text-xs font-bold mb-1 ${c.text}`}>{m.tipo}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
                    </div>
                  );
                })}
              </div>
            </StepCard>

            <StepCard num="04" icon="🔁" title="Entrenar el Modelo" color="amber">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                Se usan los datos de entrenamiento para ajustar los <strong className="text-white">pesos</strong> del modelo. Los pesos se inicializan aleatoriamente y el algoritmo los va ajustando iterativamente para minimizar el error.
              </p>
              <div className="bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-xs">
                <p className="text-gray-500 mb-1"># Proceso de entrenamiento</p>
                <p><span className="text-violet-400">modelo</span><span className="text-white">.fit(X_train, y_train)</span></p>
                <p className="mt-1 text-gray-600">→ ajusta pesos automáticamente</p>
                <p className="text-gray-600">→ itera hasta converger (epochs)</p>
              </div>
            </StepCard>

            <StepCard num="05" icon="📊" title="Evaluación" color="rose">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                Se evalúa el modelo con datos de <strong className="text-white">validación</strong> que nunca ha visto. La precisión determina si el modelo es útil.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { range:"≤ 50%",  label:"Inútil",     color:"rose",    desc:"Como lanzar una moneda" },
                  { range:"50-89%", label:"Mejorable",  color:"amber",   desc:"Ajustar hiperparámetros" },
                  { range:"≥ 90%",  label:"Confiable",  color:"emerald", desc:"Listo para producción" },
                ].map((e) => {
                  const c = {
                    rose:    { border:"border-rose-500/20",    bg:"bg-rose-500/5",    text:"text-rose-300",    val:"text-rose-400" },
                    amber:   { border:"border-amber-500/20",   bg:"bg-amber-500/5",   text:"text-amber-300",   val:"text-amber-400" },
                    emerald: { border:"border-emerald-500/20", bg:"bg-emerald-500/5", text:"text-emerald-300", val:"text-emerald-400" },
                  }[e.color];
                  return (
                    <div key={e.range} className={`rounded-xl border ${c.border} ${c.bg} p-3 text-center`}>
                      <p className={`font-black font-mono text-sm ${c.val}`}>{e.range}</p>
                      <p className={`text-xs font-bold mt-0.5 ${c.text}`}>{e.label}</p>
                      <p className="text-gray-600 text-xs mt-1">{e.desc}</p>
                    </div>
                  );
                })}
              </div>
            </StepCard>

            <StepCard num="06" icon="🎛️" title="Parameter Tuning" color="purple">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                Si la precisión no es suficiente, ajustamos los <strong className="text-white">hiperparámetros</strong>. Este proceso es más <em className="text-white">arte que ciencia</em> y requiere experimentación.
              </p>
              <div className="space-y-2">
                {[
                  { param:"Epochs",         desc:"Cuántas veces recorre el modelo los datos de entrenamiento.",        color:"purple" },
                  { param:"Learning Rate",  desc:"Tamaño del paso al ajustar pesos. Valor típico: 0.001 — 0.1.",       color:"sky" },
                  { param:"Hidden Layers",  desc:"En redes neuronales: número de capas ocultas y neuronas por capa.",  color:"emerald" },
                  { param:"Regularización", desc:"L1 / L2 para evitar overfitting y mejorar generalización.",          color:"amber" },
                ].map((p) => {
                  const col = {
                    purple:"text-purple-300 bg-purple-500/10 border-purple-500/20",
                    sky:"text-sky-300 bg-sky-500/10 border-sky-500/20",
                    emerald:"text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
                    amber:"text-amber-300 bg-amber-500/10 border-amber-500/20",
                  }[p.color];
                  return (
                    <div key={p.param} className="flex items-start gap-3 bg-black/20 rounded-lg px-3 py-2">
                      <code className={`text-xs px-2 py-0.5 rounded border font-mono whitespace-nowrap ${col}`}>{p.param}</code>
                      <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <Tip color="violet">
                  Un cambio de <code>lr=0.1</code> a <code>lr=0.001</code> puede hacer la diferencia entre minutos y días de entrenamiento.
                </Tip>
              </div>
            </StepCard>

            <StepCard num="07" icon="🚀" title="Predicción / Inferencia" color="teal">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                El modelo está listo para usarse en producción con <strong className="text-white">datos nuevos y reales</strong>.
              </p>
              <div className="bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-xs">
                <p className="text-gray-500 mb-1"># Inferencia en producción</p>
                <p><span className="text-emerald-400">nuevo_dato</span><span className="text-white"> = [[</span><span className="text-amber-300">5.1</span><span className="text-white">, </span><span className="text-amber-300">3.5</span><span className="text-white">, </span><span className="text-amber-300">1.4</span><span className="text-white">, </span><span className="text-amber-300">0.2</span><span className="text-white">]]</span></p>
                <p><span className="text-emerald-400">prediccion</span><span className="text-white"> = modelo.predict(nuevo_dato)</span></p>
                <p className="mt-1 text-teal-400"># → ['Iris-Setosa']  ✓</p>
              </div>
            </StepCard>
          </div>
        </section>

        {/* ══ 5. TIPOS DE APRENDIZAJE ══════════════════════════ */}
        <section id="aprendizaje" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="📚" title="Tipos de Aprendizaje" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Los algoritmos de ML se clasifican según si conocemos o no los datos de salida esperados.
          </p>
          <AprendizajeDemo />
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"Machine Learning",  desc:"Rama de la IA que aprende de datos sin programación explícita.",                         color:"#8b5cf6" },
              { label:"Supervisado",       desc:"Datos etiquetados. Split 80/20 entrenamiento/validación. Objetivo ≥ 90% accuracy.",        color:"#10b981" },
              { label:"No Supervisado",    desc:"Sin etiquetas. Descubre estructura: clustering, reducción dimensional.",                   color:"#f59e0b" },
              { label:"7 Pasos",           desc:"Recolectar → Preparar → Elegir → Entrenar → Evaluar → Tunear → Predecir.",               color:"#0ea5e9" },
              { label:"Hiperparámetros",   desc:"Epochs, learning rate, capas, regularización. Arte + experimentación.",                   color:"#a855f7" },
              { label:"Overfitting",       desc:"El modelo memoriza en vez de generalizar. Solución: más datos, regularización, dropout.", color:"#f43f5e" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <code className="text-sm font-bold whitespace-nowrap mt-0.5" style={{ color:row.color }}>{row.label}</code>
                <p className="text-gray-400 text-sm">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors">← Volver al inicio</button>
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · Introducción al ML</span>
        </div>

      </div>
    </div>
  );
}