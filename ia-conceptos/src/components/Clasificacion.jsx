import { useState } from "react";

// ── Demo: Calculadora interactiva de métricas ─────────────────────
function MetricasDemo() {
  const [vp, setVp] = useState(62);
  const [vn, setVn] = useState(100);
  const [fp, setFp] = useState(8);
  const [fn, setFn] = useState(1);

  const total      = vp + vn + fp + fn;
  const exactitud  = total > 0 ? ((vp + vn) / total) : 0;
  const precision  = (vp + fp) > 0 ? vp / (vp + fp) : 0;
  const sensibilidad = (vp + fn) > 0 ? vp / (vp + fn) : 0;
  const f1 = (precision + sensibilidad) > 0
    ? (2 * precision * sensibilidad) / (precision + sensibilidad) : 0;

  const pct = (v) => `${(v * 100).toFixed(1)}%`;

  const getColor = (v) => {
    if (v >= 0.9)  return { text:"text-emerald-300", bar:"bg-emerald-500", border:"border-emerald-500/40", bg:"bg-emerald-500/10", label:"Excelente" };
    if (v >= 0.75) return { text:"text-amber-300",   bar:"bg-amber-500",   border:"border-amber-500/40",   bg:"bg-amber-500/10",   label:"Aceptable" };
    return               { text:"text-rose-300",     bar:"bg-rose-500",    border:"border-rose-500/40",    bg:"bg-rose-500/10",    label:"Insuficiente" };
  };

  const SliderRow = ({ label, val, set, color, max = 150 }) => {
    const c = { sky:"accent-sky-500", emerald:"accent-emerald-500", rose:"accent-rose-500", amber:"accent-amber-500" }[color];
    const t = { sky:"text-sky-300", emerald:"text-emerald-300", rose:"text-rose-300", amber:"text-amber-300" }[color];
    return (
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 font-mono">{label}</span>
          <span className={`font-bold font-mono ${t}`}>{val}</span>
        </div>
        <input type="range" min={0} max={max} value={val}
          onChange={e => set(Number(e.target.value))}
          className={`w-full ${c}`} />
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-5 uppercase tracking-widest">🎮 Demo interactiva — Calculadora de métricas</p>

      {/* Matriz de confusión visual */}
      <div className="mb-5">
        <p className="text-gray-500 text-xs mb-3 font-mono">Matriz de Confusión — arrastra los sliders</p>
        <div className="grid grid-cols-2 gap-2 mb-4 max-w-xs">
          {[
            { label:"VP", val:vp, color:"emerald", desc:"Verdaderos Positivos" },
            { label:"FP", val:fp, color:"rose",    desc:"Falsos Positivos" },
            { label:"FN", val:fn, color:"amber",   desc:"Falsos Negativos" },
            { label:"VN", val:vn, color:"sky",     desc:"Verdaderos Negativos" },
          ].map((cell) => {
            const c = {
              emerald:{ border:"border-emerald-500/40", bg:"bg-emerald-500/15", text:"text-emerald-300" },
              rose:   { border:"border-rose-500/40",    bg:"bg-rose-500/15",    text:"text-rose-300" },
              amber:  { border:"border-amber-500/40",   bg:"bg-amber-500/15",   text:"text-amber-300" },
              sky:    { border:"border-sky-500/40",     bg:"bg-sky-500/15",     text:"text-sky-300" },
            }[cell.color];
            return (
              <div key={cell.label} className={`rounded-xl border ${c.border} ${c.bg} p-3 text-center`}>
                <p className={`text-2xl font-black font-mono ${c.text}`}>{cell.val}</p>
                <p className={`text-xs font-bold ${c.text}`}>{cell.label}</p>
                <p className="text-gray-600 text-xs">{cell.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <SliderRow label="VP — Verdaderos Positivos" val={vp} set={setVp} color="emerald" />
          <SliderRow label="FP — Falsos Positivos"     val={fp} set={setFp} color="rose" />
          <SliderRow label="FN — Falsos Negativos"     val={fn} set={setFn} color="amber" />
          <SliderRow label="VN — Verdaderos Negativos" val={vn} set={setVn} color="sky" />
        </div>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label:"Exactitud",    val:exactitud,   formula:"(VP+VN)/Total" },
          { label:"Precisión",    val:precision,   formula:"VP/(VP+FP)" },
          { label:"Sensibilidad", val:sensibilidad,formula:"VP/(VP+FN)" },
          { label:"F1 Score",     val:f1,          formula:"2·P·S/(P+S)" },
        ].map((m) => {
          const c = getColor(m.val);
          return (
            <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-3`}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-400 text-xs">{m.label}</p>
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>{c.label}</span>
              </div>
              <p className={`text-2xl font-black font-mono ${c.text}`}>{pct(m.val)}</p>
              <div className="mt-2 w-full bg-white/5 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${c.bar}`} style={{ width:`${m.val*100}%` }} />
              </div>
              <p className="text-gray-600 text-xs font-mono mt-1">{m.formula}</p>
            </div>
          );
        })}
      </div>

      <p className="text-gray-600 text-xs mt-3 font-mono text-center">Total de observaciones: {total}</p>
    </div>
  );
}

// ── Demo: Pipeline del caso práctico (Breast Cancer) ─────────────
function CasoPracticoDemo() {
  const steps = [
    { id:0, label:"Cargar dataset",     icon:"📂", color:"sky",     code:"data = load_breast_cancer()\nX = data.data  # (569, 30)\ny = data.target" },
    { id:1, label:"Recodificar target", icon:"🔄", color:"violet",  code:"y_new = np.array([1 if v==0 else 0 for v in y])\n# 1 = cáncer maligno, 0 = benigno" },
    { id:2, label:"Split 70/30",        icon:"✂️",  color:"emerald", code:"xtrain, xtest, ytrain, ytest =\n  train_test_split(X, y_new, test_size=0.3)\n# Train: (398,30)  Test: (171,30)" },
    { id:3, label:"Normalizar",         icon:"⚖️",  color:"amber",   code:"scaler = MinMaxScaler()\nxtrain_n = scaler.fit_transform(xtrain)\nxtest_n  = scaler.fit_transform(xtest)" },
    { id:4, label:"Entrenar modelo",    icon:"🧠",  color:"rose",    code:"modelo = LogisticRegression()\nmodelo.fit(xtrain_n, ytrain)" },
    { id:5, label:"Predecir",           icon:"🔮",  color:"purple",  code:"y_pred = modelo.predict(xtest_n)" },
    { id:6, label:"Evaluar métricas",   icon:"📊",  color:"teal",    code:"metrics.accuracy_score(ytest, y_pred)   # 0.9474\nmetrics.recall_score(ytest, y_pred)      # 0.9841\nmetrics.f1_score(ytest, y_pred)          # 0.9323" },
  ];

  const colorMap = {
    sky:    { border:"border-sky-500/40",    bg:"bg-sky-500/15",    text:"text-sky-300",    dot:"bg-sky-400" },
    violet: { border:"border-violet-500/40", bg:"bg-violet-500/15", text:"text-violet-300", dot:"bg-violet-400" },
    emerald:{ border:"border-emerald-500/40",bg:"bg-emerald-500/15",text:"text-emerald-300",dot:"bg-emerald-400" },
    amber:  { border:"border-amber-500/40",  bg:"bg-amber-500/15",  text:"text-amber-300",  dot:"bg-amber-400" },
    rose:   { border:"border-rose-500/40",   bg:"bg-rose-500/15",   text:"text-rose-300",   dot:"bg-rose-400" },
    purple: { border:"border-purple-500/40", bg:"bg-purple-500/15", text:"text-purple-300", dot:"bg-purple-400" },
    teal:   { border:"border-teal-500/40",   bg:"bg-teal-500/15",   text:"text-teal-300",   dot:"bg-teal-400" },
  };

  const [current, setCurrent] = useState(-1);
  const [running,  setRunning]  = useState(false);

  const run = () => {
    setCurrent(-1); setRunning(true);
    let i = 0;
    const iv = setInterval(() => {
      setCurrent(i); i++;
      if (i >= steps.length) { clearInterval(iv); setTimeout(() => { setRunning(false); setCurrent(-1); }, 1500); }
    }, 800);
  };

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Caso práctico: Breast Cancer Dataset</p>
      <div className="space-y-2 mb-4">
        {steps.map((s) => {
          const c = colorMap[s.color];
          const isActive = current === s.id;
          const isDone   = current > s.id;
          return (
            <div key={s.id}
              className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
                isActive ? `${c.border} ${c.bg} scale-[1.01]` :
                isDone   ? "border-white/10 bg-white/[0.03] opacity-60" :
                           "border-white/5 bg-transparent"}`}>
              <div className="flex items-center gap-3">
                <span className="text-base w-5 text-center">{s.icon}</span>
                <p className={`text-sm font-semibold flex-1 ${isActive ? c.text : isDone ? "text-gray-500" : "text-gray-600"}`}>
                  {s.label}
                </p>
                {isDone   && <span className="text-emerald-400 text-xs font-mono">✓</span>}
                {isActive && <div className={`w-2 h-2 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />}
              </div>
              {isActive && (
                <pre className="mt-2 ml-8 text-xs text-gray-400 font-mono animate-pulse leading-relaxed whitespace-pre">{s.code}</pre>
              )}
            </div>
          );
        })}
      </div>

      {current >= 0 && current < steps.length && (
        <div className="bg-black/40 rounded-lg px-4 py-2 mb-3 font-mono text-sm text-emerald-300 animate-pulse">
          → {steps[current].label}
        </div>
      )}

      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
          running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                  : "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando..." : "▶ Ejecutar caso práctico"}
      </button>
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

function Formula({ color, children }) {
  const c = {
    amber:   "border-amber-500/30 bg-amber-500/5 text-amber-200",
    sky:     "border-sky-500/30 bg-sky-500/5 text-sky-200",
    violet:  "border-violet-500/30 bg-violet-500/5 text-violet-200",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-200",
    rose:    "border-rose-500/30 bg-rose-500/5 text-rose-200",
  }[color];
  return (
    <div className={`border rounded-xl p-4 mb-4 font-mono text-center text-sm leading-relaxed ${c}`}>
      {children}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-4"
      style={{ fontFamily:"monospace", fontSize:"0.875rem", lineHeight:2 }}>
      {children}
    </div>
  );
}

function MetricCard({ label, valor, formula, color, children }) {
  const c = {
    sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    step:"text-sky-500/25" },
    violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300", step:"text-violet-500/25" },
    emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",step:"text-emerald-500/25" },
    amber:  { border:"border-amber-500/20",  bg:"bg-amber-500/5",  text:"text-amber-300",  step:"text-amber-500/25" },
    rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300",   step:"text-rose-500/25" },
    purple: { border:"border-purple-500/20", bg:"bg-purple-500/5", text:"text-purple-300", step:"text-purple-500/25" },
  }[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-bold text-base ${c.text}`}>{label}</h3>
        {valor && (
          <span className={`text-xs px-2 py-1 rounded-full font-mono ${c.bg} ${c.text} border ${c.border}`}>
            sklearn: {formula}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function EvaluacionModelos({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-rose-900/12 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-violet-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-emerald-900/8 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo IV</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-rose-400" style={{ fontFamily:"monospace" }}>Evaluación de Clasificación</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#f43f5e", color:"#f43f5e", fontFamily:"monospace" }}>
            📊 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Evaluación de{" "}
            <span style={{
              background:"linear-gradient(135deg, #f43f5e, #a855f7, #0ea5e9)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Clasificación</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Métricas para medir, comparar y ajustar modelos:
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">Exactitud</code>
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">Precisión</code>
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">Sensibilidad</code>
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">F1 Score</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",      label:"📌 Introducción" },
            { href:"#cuadrantes", label:"🔲 VP / FP / VN / FN" },
            { href:"#metricas",   label:"📐 Métricas" },
            { href:"#matriz",     label:"🗂️ Matriz de Confusión" },
            { href:"#f1",         label:"⚡ F1 Score" },
            { href:"#practica",   label:"🧪 Práctica" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ 1. INTRODUCCIÓN ══════════════════════════════════ */}
        <section id="intro" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📌" title="Introducción" color="#f43f5e" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Una vez entrenado un modelo de clasificación, necesitamos <strong className="text-white">métricas objetivas</strong> para saber qué tan bien funciona, compararlo con otros modelos, detectar problemas y tomar decisiones.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label:"Exactitud",    icon:"🎯", desc:"% de aciertos totales",        color:"#f43f5e" },
              { label:"Precisión",    icon:"🔎", desc:"% de positivos correctos",     color:"#a855f7" },
              { label:"Sensibilidad", icon:"📡", desc:"% de positivos encontrados",   color:"#0ea5e9" },
              { label:"F1 Score",     icon:"⚡", desc:"Balance precisión/sensibilidad",color:"#10b981" },
            ].map((m, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <span className="text-2xl mb-2 block">{m.icon}</span>
                <p className="text-xs font-bold mb-1" style={{ color:m.color }}>{m.label}</p>
                <p className="text-xs text-gray-600">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 2. VP / FP / VN / FN ═════════════════════════════ */}
        <section id="cuadrantes" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🔲" title="Los 4 cuadrantes de clasificación" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            En clasificación binaria, dada una clase C, cada predicción cae en uno de estos cuatro resultados posibles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                code:"VP", full:"Verdaderos Positivos", color:"emerald",
                realidad:"Pertenece a C", prediccion:"Modelo dice: SÍ ✓",
                desc:"El modelo acierta identificando un caso positivo. El mejor resultado posible.",
                ejemplo:"Paciente tiene cáncer → modelo dice 'cáncer' ✓",
              },
              {
                code:"FP", full:"Falsos Positivos", color:"rose",
                realidad:"NO pertenece a C", prediccion:"Modelo dice: SÍ ✗",
                desc:"El modelo predice positivo cuando en realidad es negativo. Error tipo I.",
                ejemplo:"Paciente sano → modelo dice 'cáncer' ✗",
              },
              {
                code:"FN", full:"Falsos Negativos", color:"amber",
                realidad:"Pertenece a C", prediccion:"Modelo dice: NO ✗",
                desc:"El modelo no detecta un caso positivo real. Error tipo II. Muy costoso en medicina.",
                ejemplo:"Paciente con cáncer → modelo dice 'sano' ✗",
              },
              {
                code:"VN", full:"Verdaderos Negativos", color:"sky",
                realidad:"NO pertenece a C", prediccion:"Modelo dice: NO ✓",
                desc:"El modelo acierta identificando un caso negativo correctamente.",
                ejemplo:"Paciente sano → modelo dice 'sano' ✓",
              },
            ].map((item) => {
              const c = {
                emerald:{ border:"border-emerald-500/30", bg:"bg-emerald-500/5",  text:"text-emerald-300",  badge:"bg-emerald-500/20 text-emerald-300", muted:"text-emerald-600" },
                rose:   { border:"border-rose-500/30",    bg:"bg-rose-500/5",     text:"text-rose-300",     badge:"bg-rose-500/20 text-rose-300",     muted:"text-rose-600" },
                amber:  { border:"border-amber-500/30",   bg:"bg-amber-500/5",    text:"text-amber-300",    badge:"bg-amber-500/20 text-amber-300",   muted:"text-amber-600" },
                sky:    { border:"border-sky-500/30",     bg:"bg-sky-500/5",      text:"text-sky-300",      badge:"bg-sky-500/20 text-sky-300",       muted:"text-sky-600" },
              }[item.color];
              return (
                <div key={item.code} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-3xl font-black font-mono ${c.text}`}>{item.code}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.badge}`}>{item.full}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex gap-2 text-xs font-mono">
                      <span className="text-gray-600">Realidad →</span>
                      <span className="text-gray-300">{item.realidad}</span>
                    </div>
                    <div className="flex gap-2 text-xs font-mono">
                      <span className="text-gray-600">Modelo  →</span>
                      <span className={c.text}>{item.prediccion}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mb-2 leading-relaxed">{item.desc}</p>
                  <p className={`text-xs font-mono italic ${c.muted}`}>{item.ejemplo}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 3. MÉTRICAS ══════════════════════════════════════ */}
        <section id="metricas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="📐" title="Métricas de Evaluación" color="#f43f5e" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Cada métrica responde una pregunta diferente sobre el comportamiento del modelo. Ninguna es suficiente por sí sola.
          </p>

          <div className="space-y-5">
            {/* Exactitud */}
            <MetricCard label="Exactitud (Accuracy)" valor color="rose" formula="accuracy_score()">
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Medida general del modelo. Mide el <strong className="text-white">porcentaje total de casos clasificados correctamente</strong>, tanto positivos como negativos.
              </p>
              <Formula color="rose">Exactitud = (VP + VN) / (VP + VN + FP + FN)</Formula>
              <CodeBlock>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn </span><span className="text-sky-400">import</span><span className="text-white"> metrics</span></p>
                <p><span className="text-emerald-400">acc</span><span className="text-white"> = metrics.accuracy_score(ytest, y_pred)</span></p>
                <p className="text-gray-500"># → 0.9474  (94.7%)</p>
              </CodeBlock>
              <Tip color="rose">
                La exactitud puede ser <strong>engañosa</strong> con clases desbalanceadas. Si el 95% son negativos, un modelo que siempre predice "negativo" tiene 95% de exactitud sin aprender nada.
              </Tip>
            </MetricCard>

            {/* Precisión */}
            <MetricCard label="Precisión (Precision)" valor color="violet" formula="average_precision_score()">
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Responde: <strong className="text-white">de todos los que el modelo predijo como positivos, ¿cuántos realmente lo eran?</strong> Penaliza los falsos positivos.
              </p>
              <Formula color="violet">Precisión = VP / (VP + FP)</Formula>
              <CodeBlock>
                <p><span className="text-emerald-400">prec</span><span className="text-white"> = metrics.average_precision_score(ytest, y_pred)</span></p>
                <p className="text-gray-500"># → 0.8775  (87.8%)</p>
              </CodeBlock>
              <Tip color="violet">
                Alta precisión es crucial cuando el <strong>costo de un falso positivo es alto</strong>: diagnósticos, detección de fraude donde un error afecta al cliente inocente.
              </Tip>
            </MetricCard>

            {/* Sensibilidad */}
            <MetricCard label="Sensibilidad (Recall)" valor color="sky" formula="recall_score()">
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Responde: <strong className="text-white">de todos los casos positivos reales, ¿cuántos encontró el modelo?</strong> Penaliza los falsos negativos.
              </p>
              <Formula color="sky">Sensibilidad = VP / (VP + FN)</Formula>
              <CodeBlock>
                <p><span className="text-emerald-400">recall</span><span className="text-white"> = metrics.recall_score(ytest, y_pred)</span></p>
                <p className="text-gray-500"># → 0.9841  (98.4%)</p>
              </CodeBlock>
              <Tip color="sky">
                Alta sensibilidad es crucial cuando el <strong>costo de un falso negativo es alto</strong>: detección de enfermedades, donde no detectar un cáncer real puede ser fatal.
              </Tip>
            </MetricCard>
          </div>
        </section>

        {/* ══ 4. MATRIZ DE CONFUSIÓN ═══════════════════════════ */}
        <section id="matriz" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="🗂️" title="Matriz de Confusión" color="#0ea5e9" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Tabla que <strong className="text-white">agrupa y contabiliza</strong> todas las clasificaciones del modelo en una sola vista. Permite visualizar exactamente dónde falla el modelo.
          </p>

          <Formula color="sky">
            {"| VP  FP |\n| FN  VN |"}
          </Formula>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 mb-5">
            <p className="text-sky-300 text-xs font-bold mb-3">Resultado del caso práctico — Breast Cancer</p>
            <div className="grid grid-cols-2 gap-2 max-w-xs mb-4">
              {[
                { label:"VN = 100", sub:"Benigno → benigno ✓",         color:"sky" },
                { label:"FP = 8",   sub:"Benigno → maligno ✗",        color:"rose" },
                { label:"FN = 1",   sub:"Maligno → benigno ✗",        color:"amber" },
                { label:"VP = 62",  sub:"Maligno → maligno ✓",        color:"emerald" },
              ].map((cell) => {
                const c = {
                  sky:    { border:"border-sky-500/40",    bg:"bg-sky-500/15",    text:"text-sky-300" },
                  rose:   { border:"border-rose-500/40",   bg:"bg-rose-500/15",   text:"text-rose-300" },
                  amber:  { border:"border-amber-500/40",  bg:"bg-amber-500/15",  text:"text-amber-300" },
                  emerald:{ border:"border-emerald-500/40",bg:"bg-emerald-500/15",text:"text-emerald-300" },
                }[cell.color];
                return (
                  <div key={cell.label} className={`rounded-lg border ${c.border} ${c.bg} p-3`}>
                    <p className={`font-black font-mono text-base ${c.text}`}>{cell.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{cell.sub}</p>
                  </div>
                );
              })}
            </div>
            <CodeBlock>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.metrics </span><span className="text-sky-400">import</span><span className="text-white"> confusion_matrix</span></p>
              <p><span className="text-emerald-400">MC</span><span className="text-white"> = confusion_matrix(ytest, y_pred, labels=[</span><span className="text-amber-300">0</span><span className="text-white">, </span><span className="text-amber-300">1</span><span className="text-white">])</span></p>
              <p className="text-gray-500"># → [[100   8]</p>
              <p className="text-gray-500">#     [  1  62]]</p>
            </CodeBlock>
          </div>

          <MetricasDemo />
        </section>

        {/* ══ 5. F1 SCORE ══════════════════════════════════════ */}
        <section id="f1" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="⚡" title="F1 Score" color="#10b981" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            La <strong className="text-white">media armónica</strong> entre precisión y sensibilidad. Penaliza cualquier métrica que sea extremadamente baja, por eso es más equilibrada que el promedio aritmético.
          </p>

          <Formula color="emerald">
            F1 = 2 · (Precisión · Sensibilidad) / (Precisión + Sensibilidad)
          </Formula>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-5">
            <p className="text-emerald-300 text-xs font-bold mb-3">¿Por qué media armónica y no aritmética?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 font-mono text-xs">
                <p className="text-rose-300 mb-2">Caso problemático:</p>
                <p className="text-gray-400">Precisión  = 1.0  (100%)</p>
                <p className="text-gray-400">Sensibilidad = 0.01 (1%)</p>
                <p className="mt-2 text-amber-300">Promedio aritmético = 50.5%</p>
                <p className="text-emerald-300">F1 Score = 1.98% ← honesto</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-xs">
                <p className="text-emerald-300 mb-2">Caso del notebook:</p>
                <p className="text-gray-400">Precisión  = 87.8%</p>
                <p className="text-gray-400">Sensibilidad = 98.4%</p>
                <p className="mt-2 text-gray-500">Promedio aritmético = 93.1%</p>
                <p className="text-emerald-300">F1 Score = 93.2% ✓</p>
              </div>
            </div>
          </div>

          <CodeBlock>
            <p><span className="text-emerald-400">f1</span><span className="text-white"> = metrics.f1_score(ytest, y_pred)</span></p>
            <p className="text-gray-500"># → 0.9323  (93.2%)</p>
          </CodeBlock>

          <Tip color="emerald">
            Usa <strong>F1 Score</strong> cuando las clases están desbalanceadas o cuando tanto los falsos positivos como los falsos negativos son igualmente costosos.
          </Tip>
        </section>

        {/* ══ 6. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Breast Cancer Dataset" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Aplicamos todas las métricas sobre el dataset de cáncer de mama de sklearn. El objetivo es predecir si un tumor es <strong className="text-white">maligno (1)</strong> o benigno (0) usando Regresión Logística.
          </p>

          <CasoPracticoDemo />

          <div className="mt-6">
            <p className="text-white font-semibold mb-4">Resultados obtenidos</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label:"Exactitud",    val:"94.7%", color:"rose",    sub:"accuracy_score" },
                { label:"Precisión",    val:"87.8%", color:"violet",  sub:"average_precision" },
                { label:"Sensibilidad", val:"98.4%", color:"sky",     sub:"recall_score" },
                { label:"F1 Score",     val:"93.2%", color:"emerald", sub:"f1_score" },
              ].map((m) => {
                const c = {
                  rose:   { border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300",   muted:"text-rose-600" },
                  violet: { border:"border-violet-500/30", bg:"bg-violet-500/10", text:"text-violet-300", muted:"text-violet-600" },
                  sky:    { border:"border-sky-500/30",    bg:"bg-sky-500/10",    text:"text-sky-300",    muted:"text-sky-600" },
                  emerald:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",muted:"text-emerald-600" },
                }[m.color];
                return (
                  <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-4 text-center`}>
                    <p className={`text-3xl font-black font-mono ${c.text}`}>{m.val}</p>
                    <p className="text-gray-400 text-xs font-bold mt-1">{m.label}</p>
                    <p className={`text-xs font-mono mt-0.5 ${c.muted}`}>{m.sub}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-white text-sm font-semibold mb-3">Código completo</p>
              <CodeBlock>
                <p><span className="text-sky-400">import</span><span className="text-white"> pandas </span><span className="text-sky-400">as</span><span className="text-emerald-400"> pd</span></p>
                <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-emerald-400"> np</span></p>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.datasets </span><span className="text-sky-400">import</span><span className="text-white"> load_breast_cancer</span></p>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.linear_model </span><span className="text-sky-400">import</span><span className="text-white"> LogisticRegression</span></p>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.model_selection </span><span className="text-sky-400">import</span><span className="text-white"> train_test_split</span></p>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.preprocessing </span><span className="text-sky-400">import</span><span className="text-white"> MinMaxScaler</span></p>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn </span><span className="text-sky-400">import</span><span className="text-white"> metrics</span></p>
                <p className="mt-2 text-gray-500"># 1. Cargar y recodificar</p>
                <p><span className="text-emerald-400">data</span><span className="text-white"> = load_breast_cancer()</span></p>
                <p><span className="text-emerald-400">X</span><span className="text-white"> = data.data</span></p>
                <p><span className="text-emerald-400">y</span><span className="text-white"> = np.array([</span><span className="text-amber-300">1</span><span className="text-white"> </span><span className="text-violet-400">if</span><span className="text-white"> v==</span><span className="text-amber-300">0</span><span className="text-white"> </span><span className="text-violet-400">else</span><span className="text-white"> </span><span className="text-amber-300">0</span><span className="text-white"> </span><span className="text-violet-400">for</span><span className="text-white"> v </span><span className="text-violet-400">in</span><span className="text-white"> data.target])</span></p>
                <p className="mt-1 text-gray-500"># 2. Split + normalizar</p>
                <p><span className="text-emerald-400">xtrain</span><span className="text-white">, </span><span className="text-emerald-400">xtest</span><span className="text-white">, </span><span className="text-emerald-400">ytrain</span><span className="text-white">, </span><span className="text-emerald-400">ytest</span><span className="text-white"> = train_test_split(X, y, test_size=</span><span className="text-amber-300">0.3</span><span className="text-white">, random_state=</span><span className="text-amber-300">42</span><span className="text-white">)</span></p>
                <p><span className="text-emerald-400">scaler</span><span className="text-white"> = MinMaxScaler()</span></p>
                <p><span className="text-emerald-400">xt_n</span><span className="text-white"> = scaler.fit_transform(xtrain)</span></p>
                <p><span className="text-emerald-400">xv_n</span><span className="text-white"> = scaler.fit_transform(xtest)</span></p>
                <p className="mt-1 text-gray-500"># 3. Entrenar y predecir</p>
                <p><span className="text-emerald-400">modelo</span><span className="text-white"> = LogisticRegression().fit(xt_n, ytrain)</span></p>
                <p><span className="text-emerald-400">y_pred</span><span className="text-white"> = modelo.predict(xv_n)</span></p>
                <p className="mt-1 text-gray-500"># 4. Métricas</p>
                <p><span className="text-violet-400">print</span><span className="text-white">(metrics.accuracy_score(ytest, y_pred))</span><span className="text-gray-500 ml-2">  # 0.9474</span></p>
                <p><span className="text-violet-400">print</span><span className="text-white">(metrics.recall_score(ytest, y_pred))</span><span className="text-gray-500 ml-2">     # 0.9841</span></p>
                <p><span className="text-violet-400">print</span><span className="text-white">(metrics.f1_score(ytest, y_pred))</span><span className="text-gray-500 ml-2">         # 0.9323</span></p>
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"VP / VN",      desc:"Aciertos. VP = positivo real predicho como positivo. VN = negativo real predicho como negativo.",  color:"#10b981" },
              { label:"FP / FN",      desc:"Errores. FP = falsa alarma (error tipo I). FN = caso perdido (error tipo II).",                    color:"#f43f5e" },
              { label:"Exactitud",    desc:"(VP+VN)/Total. Mide el acierto global. Engañosa con clases desbalanceadas.",                       color:"#f43f5e" },
              { label:"Precisión",    desc:"VP/(VP+FP). ¿Cuántos de los que predije positivos lo eran realmente?",                            color:"#a855f7" },
              { label:"Sensibilidad", desc:"VP/(VP+FN). ¿Cuántos positivos reales encontró el modelo? Crucial en medicina.",                  color:"#0ea5e9" },
              { label:"F1 Score",     desc:"Media armónica de precisión y sensibilidad. Equilibrada. Ideal para clases desbalanceadas.",       color:"#10b981" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · Evaluación de Clasificación</span>
        </div>

      </div>
    </div>
  );
}