import { useState, useMemo } from "react";

// ── Demo: Calculadora interactiva de métricas de regresión ────────
function MetricasRegresionDemo() {
  // Datos reales simulados (y) y predichos (ŷ) — 8 puntos ajustables
  const [noise, setNoise] = useState(30);
  const [nSamples] = useState(8);

  // Genera puntos sintéticos con ruido controlable
  const { yReal, yPred } = useMemo(() => {
    const seed = [12, 28, 45, 60, 75, 88, 102, 118];
    const yReal = seed.map((x, i) => Math.round(x * 3.2 - 15 + (((i * 7919) % 17) - 8) * (noise / 10)));
    const yPred = seed.map((x) => Math.round(x * 3.2 - 15));
    return { yReal, yPred };
  }, [noise]);

  const n    = nSamples;
  const errs = yReal.map((y, i) => y - yPred[i]);
  const mae  = errs.reduce((s, e) => s + Math.abs(e), 0) / n;
  const mse  = errs.reduce((s, e) => s + e * e, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = yReal.reduce((s, v) => s + v, 0) / n;
  const ssTot = yReal.reduce((s, v) => s + (v - yMean) ** 2, 0);
  const ssRes = errs.reduce((s, e) => s + e * e, 0);
  const r2    = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  const k     = 1;
  const r2adj = 1 - ((1 - r2) * (n - 1)) / (n - k - 1);

  const getR2Color = (v) => {
    if (v >= 0.9)  return { text:"text-emerald-300", bar:"bg-emerald-500", label:"Excelente" };
    if (v >= 0.7)  return { text:"text-amber-300",   bar:"bg-amber-500",   label:"Aceptable" };
    if (v >= 0.5)  return { text:"text-orange-300",  bar:"bg-orange-500",  label:"Débil" };
    return               { text:"text-rose-300",     bar:"bg-rose-500",    label:"Pobre" };
  };
  const rc = getR2Color(r2);

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-5 uppercase tracking-widest">🎮 Demo interactiva — Calculadora de métricas de regresión</p>

      <div className="mb-5">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 font-mono">Nivel de ruido en los datos</span>
          <span className="text-amber-300 font-bold font-mono">noise = {noise}</span>
        </div>
        <input type="range" min={0} max={80} value={noise}
          onChange={e => setNoise(Number(e.target.value))}
          className="w-full accent-violet-500" />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Sin ruido (ajuste perfecto)</span>
          <span>Mucho ruido</span>
        </div>
      </div>

      {/* Tabla de predicciones */}
      <div className="mb-5 overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-gray-600 text-left pb-2 font-normal">i</th>
              <th className="text-sky-400 text-right pb-2 font-normal">y real</th>
              <th className="text-violet-400 text-right pb-2 font-normal">ŷ predicho</th>
              <th className="text-amber-400 text-right pb-2 font-normal">|error|</th>
              <th className="text-rose-400 text-right pb-2 font-normal">error²</th>
            </tr>
          </thead>
          <tbody>
            {yReal.map((y, i) => {
              const e = Math.abs(errs[i]);
              const e2 = errs[i] * errs[i];
              return (
                <tr key={i} className="border-b border-white/5">
                  <td className="text-gray-600 py-1.5">{i + 1}</td>
                  <td className="text-sky-300 text-right py-1.5">{y}</td>
                  <td className="text-violet-300 text-right py-1.5">{yPred[i]}</td>
                  <td className="text-amber-300 text-right py-1.5">{e}</td>
                  <td className="text-rose-300 text-right py-1.5">{e2}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:"MAE",   val:mae.toFixed(2),  color:"sky",     formula:"Σ|eᵢ| / n",      unit:"mismas unidades" },
          { label:"MSE",   val:mse.toFixed(2),  color:"amber",   formula:"Σeᵢ² / n",       unit:"unidades²" },
          { label:"RMSE",  val:rmse.toFixed(2), color:"rose",    formula:"√MSE",             unit:"mismas unidades" },
          { label:"R²",    val:r2.toFixed(4),   color:null,      formula:"1 - SS_res/SS_tot",unit:"0 a 1" },
        ].map((m) => {
          const c = m.color ? {
            sky:   { border:"border-sky-500/30",   bg:"bg-sky-500/10",   text:"text-sky-300",   muted:"text-sky-700" },
            amber: { border:"border-amber-500/30", bg:"bg-amber-500/10", text:"text-amber-300", muted:"text-amber-700" },
            rose:  { border:"border-rose-500/30",  bg:"bg-rose-500/10",  text:"text-rose-300",  muted:"text-rose-700" },
          }[m.color] : { border:`${rc.text === "text-emerald-300" ? "border-emerald-500/30" : rc.text === "text-amber-300" ? "border-amber-500/30" : "border-rose-500/30"}`, bg:"bg-white/5", text:rc.text, muted:"text-gray-700" };
          return (
            <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-3`}>
              <p className="text-gray-500 text-xs mb-1">{m.label}</p>
              <p className={`text-xl font-black font-mono ${c.text}`}>{m.val}</p>
              <p className="text-gray-700 text-xs font-mono mt-1">{m.formula}</p>
              <p className={`text-xs mt-0.5 ${c.muted}`}>{m.label === "R²" ? rc.label : m.unit}</p>
            </div>
          );
        })}
      </div>

      {/* Barra R² */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-500 font-mono">R² = {r2.toFixed(4)} — R²adj = {r2adj.toFixed(4)}</span>
          <span className={`font-bold font-mono ${rc.text}`}>{rc.label}</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all duration-500 ${rc.bar}`}
            style={{ width:`${Math.max(0, Math.min(1, r2)) * 100}%` }} />
        </div>
        <p className="text-gray-600 text-xs mt-1 font-mono">El modelo explica el {(Math.max(0, r2) * 100).toFixed(1)}% de la varianza de y</p>
      </div>
    </div>
  );
}

// ── Demo: Pipeline animado caso práctico ──────────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, label:"Importar librerías",      icon:"📦", color:"sky",     code:"from sklearn.datasets import make_regression\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn import metrics\nimport numpy as np" },
    { id:1, label:"Dataset sintético",       icon:"🎲", color:"violet",  code:"X, y = make_regression(\n  n_samples=500, n_features=1, noise=30)\n# 500 observaciones, 1 variable, ruido=30" },
    { id:2, label:"Split entrenamiento/test",icon:"✂️",  color:"emerald", code:"from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test =\n  train_test_split(X, y, test_size=0.2)" },
    { id:3, label:"Entrenar LinearRegression",icon:"📈", color:"amber",  code:"modelo = LinearRegression()\nmodelo.fit(X_train, y_train)" },
    { id:4, label:"Predecir",                icon:"🔮", color:"rose",    code:"y_pred = modelo.predict(X_test)" },
    { id:5, label:"MAE",                     icon:"📏", color:"sky",     code:"metrics.mean_absolute_error(y_test, y_pred)\n# → 16.86" },
    { id:6, label:"MSE / RMSE",              icon:"⚡", color:"amber",   code:"metrics.mean_squared_error(y_test, y_pred)\n# → 874.38\nnp.sqrt(...)   # → 29.57" },
    { id:7, label:"R² y R² ajustado",        icon:"🎯", color:"emerald", code:"r2 = metrics.r2_score(y_test, y_pred)\n# → 0.9087\nr2_adj = 1 - ((1-r2)*(n-1))/(n-k-1)\n# → 0.9085" },
  ];

  const colorMap = {
    sky:    { border:"border-sky-500/40",    bg:"bg-sky-500/15",    text:"text-sky-300",    dot:"bg-sky-400" },
    violet: { border:"border-violet-500/40", bg:"bg-violet-500/15", text:"text-violet-300", dot:"bg-violet-400" },
    emerald:{ border:"border-emerald-500/40",bg:"bg-emerald-500/15",text:"text-emerald-300",dot:"bg-emerald-400" },
    amber:  { border:"border-amber-500/40",  bg:"bg-amber-500/15",  text:"text-amber-300",  dot:"bg-amber-400" },
    rose:   { border:"border-rose-500/40",   bg:"bg-rose-500/15",   text:"text-rose-300",   dot:"bg-rose-400" },
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
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Caso práctico: make_regression</p>
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
                <p className={`text-sm font-semibold flex-1 ${isActive ? c.text : isDone ? "text-gray-500" : "text-gray-600"}`}>{s.label}</p>
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
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"}`}>
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
    sky:     "border-sky-500/30 bg-sky-500/5 text-sky-200",
    amber:   "border-amber-500/30 bg-amber-500/5 text-amber-200",
    rose:    "border-rose-500/30 bg-rose-500/5 text-rose-200",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-200",
    violet:  "border-violet-500/30 bg-violet-500/5 text-violet-200",
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

function MetricCard({ num, icon, label, color, children }) {
  const c = {
    sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    step:"text-sky-500/25" },
    amber:  { border:"border-amber-500/20",  bg:"bg-amber-500/5",  text:"text-amber-300",  step:"text-amber-500/25" },
    rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300",   step:"text-rose-500/25" },
    emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",step:"text-emerald-500/25" },
    violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300", step:"text-violet-500/25" },
  }[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-start gap-4">
        <span className={`text-4xl font-black leading-none flex-shrink-0 ${c.step}`} style={{ fontFamily:"monospace" }}>{num}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span>{icon}</span>
            <h3 className={`font-bold text-base ${c.text}`}>{label}</h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function EvaluacionRegresion({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-sky-900/12 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-amber-900/8 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo IV</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-sky-400" style={{ fontFamily:"monospace" }}>Evaluación de Regresión</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#0ea5e9", color:"#0ea5e9", fontFamily:"monospace" }}>
            📈 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Evaluación de{" "}
            <span style={{
              background:"linear-gradient(135deg, #0ea5e9, #f59e0b, #10b981)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Regresión</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Métricas para medir el error y ajuste de modelos que predicen valores continuos:
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">MAE</code>
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">MSE</code>
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">RMSE</code>
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">R²</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",   label:"📌 Introducción" },
            { href:"#mae",     label:"📏 MAE" },
            { href:"#mse",     label:"⚡ MSE" },
            { href:"#rmse",    label:"🎯 RMSE" },
            { href:"#r2",      label:"📐 R²" },
            { href:"#r2adj",   label:"🔧 R² Ajustado" },
            { href:"#practica",label:"🧪 Práctica" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ 1. INTRODUCCIÓN ══════════════════════════════════ */}
        <section id="intro" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📌" title="Introducción" color="#0ea5e9" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            En regresión, el modelo predice un <strong className="text-white">valor numérico continuo</strong>. A diferencia de clasificación, no existen aciertos o errores binarios — existen grados de error. Las métricas de regresión cuantifican exactamente <strong className="text-white">qué tan lejos están las predicciones de la realidad</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label:"MAE",   icon:"📏", desc:"Error medio absoluto",          color:"#0ea5e9" },
              { label:"MSE",   icon:"⚡", desc:"Error cuadrático medio",         color:"#f59e0b" },
              { label:"RMSE",  icon:"🎯", desc:"Raíz del error cuadrático",      color:"#f43f5e" },
              { label:"R²",    icon:"📐", desc:"Varianza explicada (0 a 1)",     color:"#10b981" },
              { label:"R²adj", icon:"🔧", desc:"R² penalizado por complejidad",  color:"#a855f7" },
            ].map((m, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <span className="text-2xl mb-2 block">{m.icon}</span>
                <p className="text-xs font-bold mb-1" style={{ color:m.color }}>{m.label}</p>
                <p className="text-xs text-gray-600 leading-tight">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="text-sky-300 text-xs font-bold mb-2">Notación</p>
            <div className="flex flex-wrap gap-4 font-mono text-xs">
              <span><span className="text-sky-300">yᵢ</span> <span className="text-gray-500">→ valor real</span></span>
              <span><span className="text-violet-300">ŷᵢ</span> <span className="text-gray-500">→ valor predicho</span></span>
              <span><span className="text-amber-300">eᵢ = yᵢ - ŷᵢ</span> <span className="text-gray-500">→ residuo</span></span>
              <span><span className="text-emerald-300">n</span> <span className="text-gray-500">→ total de observaciones</span></span>
            </div>
          </div>
        </section>

        {/* ══ 2. MAE ═══════════════════════════════════════════ */}
        <section id="mae" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="📏" title="Error Absoluto Medio (MAE)" color="#0ea5e9" />

          <MetricCard num="01" icon="📏" label="MAE — Mean Absolute Error" color="sky">
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Promedio de los errores absolutos entre predicción y valor real. Al usar valor absoluto, trata todos los errores por igual sin importar la dirección.
            </p>
            <Formula color="sky">MAE = (1/n) · Σᵢ |yᵢ − ŷᵢ|</Formula>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-emerald-300 text-xs font-bold mb-2">✅ Ventajas</p>
                <ul className="space-y-1">
                  {[
                    "Mismas unidades que la variable objetivo",
                    "Robusta frente a valores extremos (outliers)",
                    "Fácil de interpretar directamente",
                  ].map((v, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <p className="text-gray-500 text-xs">{v}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                <p className="text-sky-300 text-xs font-bold mb-2">📌 Resultado del notebook</p>
                <p className="text-3xl font-black font-mono text-sky-300 mb-1">16.86</p>
                <p className="text-gray-600 text-xs font-mono">metrics.mean_absolute_error()</p>
                <p className="text-gray-600 text-xs mt-1">Error promedio: ~17 unidades</p>
              </div>
            </div>

            <CodeBlock>
              <p><span className="text-emerald-400">mae</span><span className="text-white"> = metrics.mean_absolute_error(y, y_predicha)</span></p>
              <p className="text-gray-500"># → 16.859</p>
            </CodeBlock>

            <Tip color="sky">
              Si tu variable objetivo son precios en dólares, un MAE de 16.86 significa que el modelo se equivoca en promedio <strong>$16.86 por predicción</strong> — fácil de comunicar a negocio.
            </Tip>
          </MetricCard>
        </section>

        {/* ══ 3. MSE ═══════════════════════════════════════════ */}
        <section id="mse" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="⚡" title="Error Cuadrático Medio (MSE)" color="#f59e0b" />

          <MetricCard num="02" icon="⚡" label="MSE — Mean Squared Error" color="amber">
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Igual que MAE pero eleva al cuadrado los errores. Esto <strong className="text-white">penaliza más los errores grandes</strong>, haciendo el modelo más sensible a outliers.
            </p>
            <Formula color="amber">MSE = (1/n) · Σᵢ (yᵢ − ŷᵢ)²</Formula>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="text-rose-300 text-xs font-bold mb-2">⚠️ Problema de interpretación</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  El resultado está en <strong className="text-white">unidades al cuadrado</strong>. Si la variable son dólares, el MSE está en dólares². No tiene interpretación directa.
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-amber-300 text-xs font-bold mb-2">📌 Resultado del notebook</p>
                <p className="text-3xl font-black font-mono text-amber-300 mb-1">874.38</p>
                <p className="text-gray-600 text-xs font-mono">metrics.mean_squared_error()</p>
                <p className="text-gray-600 text-xs mt-1">≈ 16.86² (consistente con MAE)</p>
              </div>
            </div>

            <CodeBlock>
              <p><span className="text-emerald-400">mse</span><span className="text-white"> = metrics.mean_squared_error(y, y_predicha)</span></p>
              <p className="text-gray-500"># → 874.376  (unidades²)</p>
            </CodeBlock>

            <Tip color="amber">
              El MSE es muy usado como <strong>función de coste durante el entrenamiento</strong> porque es diferenciable. Pero para interpretar resultados, prefiere RMSE o MAE.
            </Tip>
          </MetricCard>
        </section>

        {/* ══ 4. RMSE ══════════════════════════════════════════ */}
        <section id="rmse" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="🎯" title="Raíz del Error Cuadrático Medio (RMSE)" color="#f43f5e" />

          <MetricCard num="03" icon="🎯" label="RMSE — Root Mean Squared Error" color="rose">
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              La raíz cuadrada del MSE. <strong className="text-white">Resuelve el problema de las unidades</strong> y vuelve a estar en la misma escala que la variable objetivo, pero sigue penalizando errores grandes.
            </p>
            <Formula color="rose">RMSE = √( (1/n) · Σᵢ (yᵢ − ŷᵢ)² ) = √MSE</Formula>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-amber-300 text-xs font-bold mb-2">⚠️ Sensible a outliers</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Al elevar al cuadrado antes de promediar, un error muy grande domina el resultado. El RMSE siempre es <strong className="text-white">≥ MAE</strong>.
                </p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="text-rose-300 text-xs font-bold mb-2">📌 Resultado del notebook</p>
                <p className="text-3xl font-black font-mono text-rose-300 mb-1">29.57</p>
                <p className="text-gray-600 text-xs font-mono">np.sqrt(metrics.mean_squared_error())</p>
                <p className="text-gray-600 text-xs mt-1">= √874.38 ≈ 29.57</p>
              </div>
            </div>

            <CodeBlock>
              <p><span className="text-emerald-400">rmse</span><span className="text-white"> = np.</span><span className="text-sky-400">sqrt</span><span className="text-white">(metrics.mean_squared_error(y, y_predicha))</span></p>
              <p className="text-gray-500"># → 29.570</p>
            </CodeBlock>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mb-4">
              <p className="text-white text-xs font-bold mb-3">MAE vs RMSE — ¿cuándo usar cada uno?</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-sky-300 text-xs font-bold mb-1">MAE = 16.86</p>
                  <p className="text-gray-500 text-xs">Robusto a outliers. Mejor para interpretar el error típico.</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-rose-300 text-xs font-bold mb-1">RMSE = 29.57</p>
                  <p className="text-gray-500 text-xs">Penaliza errores grandes. Mejor cuando esos errores son críticos.</p>
                </div>
              </div>
            </div>

            <Tip color="rose">
              Si RMSE {">"} MAE significativamente, hay <strong>errores grandes o outliers</strong> en tus datos que el modelo no está manejando bien.
            </Tip>
          </MetricCard>
        </section>

        {/* ══ 5. R² ════════════════════════════════════════════ */}
        <section id="r2" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="📐" title="Coeficiente de Determinación R²" color="#10b981" />

          <MetricCard num="04" icon="📐" label="R² — Coeficiente de Determinación" color="emerald">
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Mide qué <strong className="text-white">porcentaje de la varianza</strong> de la variable objetivo es explicado por el modelo. Su rango ideal va de 0 a 1.
            </p>
            <Formula color="emerald">R² = 1 − (SS_res / SS_tot)</Formula>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-4">
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { val:"R² = 1", desc:"El modelo explica toda la varianza. Ajuste perfecto.", color:"emerald" },
                  { val:"R² = 0", desc:"El modelo no explica nada. Equivale a predecir la media.", color:"amber" },
                  { val:"R² < 0", desc:"El modelo es peor que predecir siempre la media.", color:"rose" },
                ].map((item) => {
                  const c = {
                    emerald:"text-emerald-300 border-emerald-500/20 bg-emerald-500/5",
                    amber:"text-amber-300 border-amber-500/20 bg-amber-500/5",
                    rose:"text-rose-300 border-rose-500/20 bg-rose-500/5",
                  }[item.color];
                  return (
                    <div key={item.val} className={`rounded-lg border p-3 ${c.split(" ").slice(1).join(" ")}`}>
                      <p className={`font-black text-base mb-1 ${c.split(" ")[0]}`}>{item.val}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-4">
              <p className="text-emerald-300 text-xs font-bold mb-1">📌 Resultado del notebook</p>
              <p className="text-4xl font-black font-mono text-emerald-300 mb-1">0.9087</p>
              <p className="text-gray-500 text-sm">El modelo explica el <strong className="text-white">90.87%</strong> de la varianza de y</p>
              <div className="mt-3 w-full bg-white/5 rounded-full h-2">
                <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width:"90.87%" }} />
              </div>
            </div>

            <CodeBlock>
              <p><span className="text-emerald-400">r2</span><span className="text-white"> = metrics.r2_score(y, y_predicha)</span></p>
              <p className="text-gray-500"># → 0.9087</p>
            </CodeBlock>

            <Tip color="emerald">
              R² no detecta <strong>overfitting</strong> ni considera la complejidad del modelo. Siempre aumenta al añadir más variables, incluso irrelevantes. Para eso existe R² ajustado.
            </Tip>
          </MetricCard>
        </section>

        {/* ══ 6. R² AJUSTADO ═══════════════════════════════════ */}
        <section id="r2adj" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🔧" title="R² Ajustado" color="#a855f7" />

          <MetricCard num="05" icon="🔧" label="Adjusted R² — Coeficiente Ajustado" color="violet">
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Variante del R² que <strong className="text-white">penaliza la complejidad del modelo</strong>. Al añadir variables irrelevantes, el R² ajustado disminuye, evitando sobreajuste.
            </p>
            <Formula color="violet">{"R²adj = 1 − [(1 − R²)(n − 1)] / (n − k − 1)"}</Formula>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 mb-4">
              <p className="text-violet-300 text-xs font-bold mb-3">Parámetros de la fórmula</p>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { sym:"R²",   desc:"Coeficiente de determinación original",               color:"emerald" },
                  { sym:"n",    desc:"Número total de observaciones (n=500 en el notebook)", color:"sky" },
                  { sym:"k",    desc:"Número de predictores sin el término independiente",   color:"amber" },
                ].map((p) => {
                  const col = { emerald:"text-emerald-300", sky:"text-sky-300", amber:"text-amber-300" }[p.color];
                  return (
                    <div key={p.sym} className="flex items-center gap-3 bg-black/20 rounded-lg px-3 py-2">
                      <span className={`font-black w-8 ${col}`}>{p.sym}</span>
                      <span className="text-gray-500">{p.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">R²</p>
                <p className="text-3xl font-black font-mono text-emerald-300">0.9087</p>
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">R² Ajustado</p>
                <p className="text-3xl font-black font-mono text-violet-300">0.9085</p>
              </div>
            </div>

            <CodeBlock>
              <p><span className="text-emerald-400">r2</span><span className="text-white"> = metrics.r2_score(y, y_predicha)</span></p>
              <p><span className="text-emerald-400">n</span><span className="text-white"> = </span><span className="text-violet-400">len</span><span className="text-white">(y)</span></p>
              <p><span className="text-emerald-400">k</span><span className="text-white"> = X.shape[</span><span className="text-amber-300">1</span><span className="text-white">]</span><span className="text-gray-500 ml-2"># número de features</span></p>
              <p className="mt-1"><span className="text-emerald-400">r2_adj</span><span className="text-white"> = </span><span className="text-amber-300">1</span><span className="text-white"> - ((</span><span className="text-amber-300">1</span><span className="text-white"> - r2) * (n - </span><span className="text-amber-300">1</span><span className="text-white">)) / (n - k - </span><span className="text-amber-300">1</span><span className="text-white">)</span></p>
              <p className="text-gray-500"># → 0.9085</p>
            </CodeBlock>

            <Tip color="violet">
              Con solo 1 predictor (k=1) y 500 muestras, R² y R²adj son casi idénticos. La diferencia se vuelve significativa con <strong>muchas variables y pocas observaciones</strong>.
            </Tip>
          </MetricCard>
        </section>

        {/* ══ 7. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Dataset sintético de regresión" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Usamos <code className="text-violet-400 bg-violet-500/10 px-1 rounded">make_regression</code> de sklearn para generar un dataset controlado de 500 muestras con ruido gaussiano, entrenamos una regresión lineal y calculamos todas las métricas.
          </p>

          <MetricasRegresionDemo />

          <div className="mt-6">
            <PipelineDemo />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-white font-semibold mb-4">Resultados del notebook</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
              {[
                { label:"MAE",    val:"16.86",  sub:"mean_absolute_error",   color:"sky" },
                { label:"MSE",    val:"874.38", sub:"mean_squared_error",     color:"amber" },
                { label:"RMSE",   val:"29.57",  sub:"√MSE",                  color:"rose" },
                { label:"R²",     val:"0.9087", sub:"r2_score",              color:"emerald" },
                { label:"R²adj",  val:"0.9085", sub:"fórmula manual",        color:"violet" },
              ].map((m) => {
                const c = {
                  sky:    { border:"border-sky-500/30",    bg:"bg-sky-500/10",    text:"text-sky-300",    muted:"text-sky-700" },
                  amber:  { border:"border-amber-500/30",  bg:"bg-amber-500/10",  text:"text-amber-300",  muted:"text-amber-700" },
                  rose:   { border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300",   muted:"text-rose-700" },
                  emerald:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",muted:"text-emerald-700" },
                  violet: { border:"border-violet-500/30", bg:"bg-violet-500/10", text:"text-violet-300", muted:"text-violet-700" },
                }[m.color];
                return (
                  <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-3 text-center`}>
                    <p className={`text-xl font-black font-mono ${c.text}`}>{m.val}</p>
                    <p className="text-gray-400 text-xs font-bold mt-1">{m.label}</p>
                    <p className={`text-xs font-mono mt-0.5 ${c.muted}`}>{m.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"320ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"MAE",    desc:"Error absoluto promedio. Mismas unidades. Robusto a outliers. Fácil de explicar.",              color:"#0ea5e9" },
              { label:"MSE",    desc:"Error cuadrático medio. Penaliza errores grandes. Unidades² — difícil de interpretar.",         color:"#f59e0b" },
              { label:"RMSE",   desc:"Raíz del MSE. Mismas unidades. Penaliza outliers. RMSE ≥ MAE siempre.",                        color:"#f43f5e" },
              { label:"R²",     desc:"% de varianza explicada. Valor entre 0 y 1 (ideal). No detecta overfitting.",                  color:"#10b981" },
              { label:"R²adj",  desc:"R² penalizado por número de predictores. Útil para comparar modelos de distinta complejidad.", color:"#a855f7" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · Evaluación de Regresión</span>
        </div>

      </div>
    </div>
  );
}