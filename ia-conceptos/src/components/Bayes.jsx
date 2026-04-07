import { useState, useMemo } from "react";

// ── Demo: Teorema de Bayes paso a paso ────────────────────────────
function BayesPasosDemo() {
  // Ejemplo: clasificar email como SPAM o NO SPAM
  // Feature: contiene la palabra "oferta"
  const [pSpam,    setPSpam]    = useState(30);   // P(Spam) %
  const [pPalSpam, setPalSpam]  = useState(80);   // P(palabra | Spam) %
  const [pPalNoSp, setPalNoSp]  = useState(10);   // P(palabra | NoSpam) %

  const pH   = pSpam / 100;
  const pHn  = 1 - pH;
  const pEH  = pPalSpam / 100;
  const pEHn = pPalNoSp / 100;
  const pE   = pEH * pH + pEHn * pHn;
  const pHE  = pE > 0 ? (pEH * pH) / pE : 0;
  const pHnE = 1 - pHE;

  const isSpam = pHE >= 0.5;

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-5 uppercase tracking-widest">🎮 Demo — Bayes paso a paso: ¿Es SPAM?</p>
      <p className="text-gray-500 text-xs mb-4 font-mono">Escenario: el email contiene la palabra "oferta". ¿Es spam?</p>

      <div className="space-y-3 mb-5">
        {[
          { label:"P(Spam) — % de emails spam en la bandeja",                   val:pSpam,    set:setPSpam,    color:"rose" },
          { label:"P(oferta | Spam) — % de spams que contienen 'oferta'",       val:pPalSpam, set:setPalSpam,  color:"amber" },
          { label:"P(oferta | No spam) — % de legítimos con 'oferta'",          val:pPalNoSp, set:setPalNoSp,  color:"sky" },
        ].map((row) => {
          const col = { rose:"accent-rose-500 text-rose-300", amber:"accent-amber-500 text-amber-300", sky:"accent-sky-500 text-sky-300" }[row.color];
          const [accent, textCol] = col.split(" ");
          return (
            <div key={row.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-mono">{row.label}</span>
                <span className={`font-bold font-mono ${textCol}`}>{row.val}%</span>
              </div>
              <input type="range" min={1} max={99} value={row.val}
                onChange={e => row.set(Number(e.target.value))}
                className={`w-full ${accent}`}/>
            </div>
          );
        })}
      </div>

      {/* Pasos de Bayes */}
      <div className="space-y-2 mb-4">
        {[
          { paso:"Paso 1", label:"P(H) — Probabilidad previa de spam",            val:`${pSpam}%`,                     color:"rose" },
          { paso:"Paso 2", label:"P(E|H) — Probabilidad de 'oferta' dado spam",   val:`${pPalSpam}%`,                  color:"amber" },
          { paso:"Paso 3", label:"P(E) — Prob. total de ver 'oferta'",             val:`${(pE*100).toFixed(2)}%`,       color:"sky" },
          { paso:"Paso 4", label:"P(H|E) = P(E|H)·P(H) / P(E)",                   val:`${(pHE*100).toFixed(2)}%`,      color:"violet" },
        ].map((item) => {
          const c = {
            rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300",   badge:"bg-rose-500/20 text-rose-300" },
            amber:  { border:"border-amber-500/20",  bg:"bg-amber-500/5",  text:"text-amber-300",  badge:"bg-amber-500/20 text-amber-300" },
            sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    badge:"bg-sky-500/20 text-sky-300" },
            violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300", badge:"bg-violet-500/20 text-violet-300" },
          }[item.color];
          return (
            <div key={item.paso} className={`flex items-center justify-between rounded-xl border ${c.border} ${c.bg} px-4 py-3`}>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{item.paso}</span>
                <p className="text-gray-400 text-xs font-mono">{item.label}</p>
              </div>
              <p className={`font-black font-mono text-base ${c.text}`}>{item.val}</p>
            </div>
          );
        })}
      </div>

      {/* Veredicto */}
      <div className={`rounded-xl border p-4 transition-all duration-300 ${
        isSpam ? "border-rose-500/40 bg-rose-500/15" : "border-emerald-500/40 bg-emerald-500/15"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-mono mb-1">Clasificación del email</p>
            <p className={`text-2xl font-black font-mono ${isSpam ? "text-rose-300" : "text-emerald-300"}`}>
              {isSpam ? "🚨 SPAM" : "✅ Legítimo"}
            </p>
            <p className="text-gray-500 text-xs mt-1 font-mono">
              P(Spam|oferta) = {(pHE*100).toFixed(1)}% &nbsp;·&nbsp; P(¬Spam|oferta) = {(pHnE*100).toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-xs font-mono">umbral = 50%</p>
            <p className={`text-xs font-mono mt-1 ${isSpam ? "text-rose-500" : "text-emerald-500"}`}>
              {(pHE*100).toFixed(1)}% {isSpam ? "≥" : "<"} 50%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-black/30 rounded-lg px-4 py-2 font-mono text-xs text-gray-500">
        P(Spam|E) = P(E|Spam)·P(Spam) / P(E) = {pPalSpam/100}·{pSpam/100} / {pE.toFixed(3)} = <span className="text-violet-300">{(pHE).toFixed(4)}</span>
      </div>
    </div>
  );
}

// ── Demo: Clasificador de cáncer interactivo ──────────────────────
function CancerDemo() {
  const [radio,      setRadio]      = useState(14.0);
  const [textura,    setTextura]    = useState(20.0);
  const [perimetro,  setPerimetro]  = useState(90.0);
  const [area,       setArea]       = useState(600.0);
  const [suavidad,   setSuavidad]   = useState(0.10);

  // Heurística basada en los umbrales del dataset breast cancer
  const score = useMemo(() => {
    let s = 0;
    if (radio      > 15)   s += 2;
    if (radio      > 17)   s += 1;
    if (textura    > 21)   s += 1;
    if (perimetro  > 100)  s += 2;
    if (area       > 700)  s += 2;
    if (suavidad   > 0.11) s += 1;
    return s;
  }, [radio, textura, perimetro, area, suavidad]);

  const total = 9;
  const probMaligno = Math.min(0.97, Math.max(0.03, score / total));
  const probBenigno = 1 - probMaligno;
  const isMaligno   = probMaligno >= 0.5;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-5 uppercase tracking-widest">🎮 Demo — GaussianNB: diagnóstico de tumor</p>
      <p className="text-gray-500 text-xs mb-4 font-mono">Ajusta los valores clínicos del tumor para ver la predicción del modelo</p>

      <div className="space-y-3 mb-5">
        {[
          { label:"Radio medio (mm)",        val:radio,     set:setRadio,     min:6,   max:30,   step:0.5, color:"sky" },
          { label:"Textura media",           val:textura,   set:setTextura,   min:9,   max:40,   step:0.5, color:"violet" },
          { label:"Perímetro medio (mm)",    val:perimetro, set:setPerimetro, min:40,  max:190,  step:1,   color:"emerald" },
          { label:"Área media (mm²)",        val:area,      set:setArea,      min:140, max:2500, step:10,  color:"amber" },
          { label:"Suavidad media",          val:suavidad,  set:setSuavidad,  min:0.05,max:0.17, step:0.005, color:"rose" },
        ].map((row) => {
          const col = {
            sky:    "accent-sky-500 text-sky-300",
            violet: "accent-violet-500 text-violet-300",
            emerald:"accent-emerald-500 text-emerald-300",
            amber:  "accent-amber-500 text-amber-300",
            rose:   "accent-rose-500 text-rose-300",
          }[row.color];
          const [accent, textCol] = col.split(" ");
          return (
            <div key={row.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-mono">{row.label}</span>
                <span className={`font-bold font-mono ${textCol}`}>{Number(row.val).toFixed(row.step < 0.1 ? 3 : row.step < 1 ? 1 : 0)}</span>
              </div>
              <input type="range" min={row.min} max={row.max} step={row.step} value={row.val}
                onChange={e => row.set(Number(e.target.value))}
                className={`w-full ${accent}`}/>
            </div>
          );
        })}
      </div>

      {/* Probabilidades */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label:"P(Maligno)",  prob:probMaligno, color:"rose" },
          { label:"P(Benigno)",  prob:probBenigno, color:"emerald" },
        ].map((m) => {
          const c = {
            rose:   { border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300",   bar:"bg-rose-500" },
            emerald:{ border:"border-emerald-500/30", bg:"bg-emerald-500/10",text:"text-emerald-300",bar:"bg-emerald-500" },
          }[m.color];
          return (
            <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-3`}>
              <p className="text-gray-500 text-xs mb-1">{m.label}</p>
              <p className={`text-2xl font-black font-mono ${c.text}`}>{(m.prob*100).toFixed(1)}%</p>
              <div className="mt-2 w-full bg-white/5 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${c.bar}`} style={{ width:`${m.prob*100}%` }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diagnóstico */}
      <div className={`rounded-xl border p-4 transition-all duration-300 ${
        isMaligno ? "border-rose-500/40 bg-rose-500/15" : "border-emerald-500/40 bg-emerald-500/15"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs mb-1">Diagnóstico GaussianNB</p>
            <p className={`text-xl font-black ${isMaligno ? "text-rose-300" : "text-emerald-300"}`}>
              {isMaligno ? "🔴 Maligno (clase 1)" : "🟢 Benigno (clase 0)"}
            </p>
          </div>
          <p className="text-gray-600 text-xs font-mono text-right">modelo.predict([[{radio}, {textura}, {perimetro}, …]])</p>
        </div>
      </div>
    </div>
  );
}

// ── Demo: Pipeline animado ────────────────────────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, label:"Importar librerías",        icon:"📦", color:"sky",    code:"from sklearn import datasets\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import confusion_matrix, precision_score" },
    { id:1, label:"Cargar Breast Cancer dataset", icon:"📂", color:"violet", code:"datos = datasets.load_breast_cancer()\n# 569 muestras, 30 features\n# target: 0=maligno, 1=benigno" },
    { id:2, label:"Crear DataFrame",           icon:"🗂️", color:"emerald",code:"df = pd.DataFrame(data=datos.data, columns=datos.feature_names)\ndf['target'] = datos.target" },
    { id:3, label:"Split 70/30",               icon:"✂️",  color:"amber",  code:"X_train, X_test, y_train, y_test =\n  train_test_split(datos.data, datos.target, test_size=0.3)" },
    { id:4, label:"Crear y entrenar GaussianNB",icon:"🧠", color:"rose",   code:"modelo = GaussianNB()\nmodelo.fit(X_train, y_train)\n# GaussianNB()" },
    { id:5, label:"Predecir",                  icon:"🔮", color:"sky",    code:"y_pred = modelo.predict(X_test)" },
    { id:6, label:"Precisión",                 icon:"📊", color:"violet", code:"precision = precision_score(y_test, y_pred)\nprint(precision)\n# → 0.9464  (94.6%)" },
    { id:7, label:"Matriz de confusión",        icon:"🗂️", color:"emerald",code:"matriz = confusion_matrix(y_test, y_pred)\n# [[ 53   6]\n#  [  6 106]]\n# 159 correctos de 171 total" },
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
    }, 800);
  };

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Pipeline: GaussianNB en Breast Cancer</p>
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
        <div className="bg-black/40 rounded-lg px-4 py-2 mb-3 font-mono text-sm text-sky-300 animate-pulse">
          → {steps[current].label}
        </div>
      )}
      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
          running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                  : "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando..." : "▶ Ejecutar pipeline"}
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

function StepCard({ num, icon, title, color, children }) {
  const c = {
    sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    step:"text-sky-500/25" },
    violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300", step:"text-violet-500/25" },
    emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",step:"text-emerald-500/25" },
    amber:  { border:"border-amber-500/20",  bg:"bg-amber-500/5",  text:"text-amber-300",  step:"text-amber-500/25" },
    rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300",   step:"text-rose-500/25" },
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
export default function NaiveBayes({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-amber-900/10 blur-3xl rounded-full" />
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
          <span className="text-sm text-amber-400" style={{ fontFamily:"monospace" }}>Naive Bayes</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#f59e0b", color:"#f59e0b", fontFamily:"monospace" }}>
            🎯 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Clasificador{" "}
            <span style={{
              background:"linear-gradient(135deg, #f59e0b, #a855f7, #10b981)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Naive Bayes</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Algoritmo de clasificación simple y poderoso basado en el
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">Teorema de Bayes</code>
            con supuesto de
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">independencia condicional</code>
            entre predictores
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",    label:"📌 Introducción" },
            { href:"#bayes",    label:"📐 Teorema de Bayes" },
            { href:"#pasos",    label:"🔢 Pasos del algoritmo" },
            { href:"#ventajas", label:"⚡ Ventajas y desventajas" },
            { href:"#demo",     label:"🎮 Demos" },
            { href:"#practica", label:"🧪 Práctica" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ 1. INTRODUCCIÓN ══════════════════════════════════ */}
        <section id="intro" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📌" title="Introducción" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            <strong className="text-white">Naive Bayes</strong> es uno de los algoritmos más simples y poderosos para clasificación. Está basado en el Teorema de Bayes con la suposición de <strong className="text-white">independencia condicional de clase</strong> entre los predictores — aunque en la práctica esta asunción rara vez se cumple, el algoritmo funciona sorprendentemente bien.
          </p>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 mb-6">
            <p className="text-amber-300 text-xs font-bold mb-3">Ejemplo: solicitud de préstamo</p>
            <p className="text-gray-400 text-sm mb-3">Un solicitante puede ser aprobado o rechazado según sus características:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Ingresos 💰", "Historial crediticio 📋", "Transacciones previas 💳", "Edad 📅", "Ubicación 📍"].map(f => (
                <span key={f} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded-lg font-mono">{f}</span>
              ))}
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              <strong className="text-white">Naive:</strong> asume que cada característica es <strong className="text-white">independiente de las demás</strong> dado que el solicitante es aprobado o rechazado. Esta simplificación reduce la computación enormemente.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon:"📧", label:"Spam",         desc:"Email spam o legítimo",           color:"#f43f5e" },
              { icon:"🏥", label:"Diagnóstico",   desc:"Tumor maligno o benigno",         color:"#10b981" },
              { icon:"📰", label:"Noticias",      desc:"Clasificar artículos por tema",   color:"#0ea5e9" },
              { icon:"😊", label:"Sentimiento",   desc:"Reseña positiva o negativa",      color:"#f59e0b" },
              { icon:"💳", label:"Fraude",        desc:"Transacción legítima o fraude",   color:"#a855f7" },
              { icon:"🌦️", label:"Clima",         desc:"Predecir si lloverá o no",        color:"#6366f1" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-xs font-bold mb-0.5" style={{ color:item.color }}>{item.label}</p>
                <p className="text-xs text-gray-600 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 2. TEOREMA DE BAYES ══════════════════════════════ */}
        <section id="bayes" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="📐" title="Teorema de Bayes" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            La base matemática del clasificador. Permite calcular la <strong className="text-white">probabilidad posterior</strong> de una hipótesis H dado un evento observado E.
          </p>

          <Formula color="violet">P(H|E) = P(E|H) · P(H) / P(E)</Formula>

          <div className="space-y-3 mb-5">
            {[
              { sym:"P(H|E)",  name:"Posterior",   desc:"Probabilidad de la hipótesis H dado el evento E. Lo que queremos calcular.",        color:"violet" },
              { sym:"P(E|H)",  name:"Likelihood",  desc:"Probabilidad del evento E dado que H es verdad. Probabilidad condicional.",          color:"sky" },
              { sym:"P(H)",    name:"Prior",        desc:"Probabilidad previa de H independientemente de E. Lo que sabemos antes.",           color:"emerald" },
              { sym:"P(E)",    name:"Evidencia",    desc:"Probabilidad total del evento E. Actúa como constante de normalización.",           color:"amber" },
            ].map((item) => {
              const c = {
                violet:  { border:"border-violet-500/20", bg:"bg-violet-500/5",  text:"text-violet-300", badge:"bg-violet-500/20 text-violet-300" },
                sky:     { border:"border-sky-500/20",    bg:"bg-sky-500/5",     text:"text-sky-300",    badge:"bg-sky-500/20 text-sky-300" },
                emerald: { border:"border-emerald-500/20",bg:"bg-emerald-500/5", text:"text-emerald-300",badge:"bg-emerald-500/20 text-emerald-300" },
                amber:   { border:"border-amber-500/20",  bg:"bg-amber-500/5",   text:"text-amber-300",  badge:"bg-amber-500/20 text-amber-300" },
              }[item.color];
              return (
                <div key={item.sym} className={`flex items-start gap-4 rounded-xl border ${c.border} ${c.bg} px-4 py-3`}>
                  <code className={`text-base font-black font-mono whitespace-nowrap ${c.text}`}>{item.sym}</code>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold ${c.text}`}>{item.name}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Tip color="violet">
            En Naive Bayes con múltiples features, se multiplican las probabilidades de cada feature dado la clase: P(H|E₁,E₂,…) ∝ P(H) · P(E₁|H) · P(E₂|H) · … — asumiendo <strong>independencia condicional</strong>.
          </Tip>
        </section>

        {/* ══ 3. PASOS DEL ALGORITMO ═══════════════════════════ */}
        <section id="pasos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="🔢" title="Pasos del Algoritmo" color="#0ea5e9" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Para clasificar una nueva observación, Naive Bayes sigue cuatro pasos aplicando el Teorema de Bayes.
          </p>

          <div className="space-y-4">
            {[
              {
                num:"01", icon:"📊", title:"Calcular probabilidades previas",  color:"sky",
                desc:"Para cada clase, calcular su frecuencia relativa en el conjunto de entrenamiento.",
                formula:"P(Clase = k) = Nro observaciones clase k / Total observaciones",
              },
              {
                num:"02", icon:"🔍", title:"Probabilidad de cada atributo por clase", color:"violet",
                desc:"Para cada feature y cada clase, calcular la probabilidad condicional del atributo dado que pertenece a esa clase.",
                formula:"P(xᵢ | Clase = k)  →  para todo i y todo k",
              },
              {
                num:"03", icon:"🧮", title:"Aplicar Teorema de Bayes",          color:"emerald",
                desc:"Multiplicar la prior por todas las likelihoods de cada feature (asumiendo independencia).",
                formula:"P(k | x) ∝ P(k) · P(x₁|k) · P(x₂|k) · … · P(xₙ|k)",
              },
              {
                num:"04", icon:"🏆", title:"Clasificar a la clase más probable", color:"amber",
                desc:"Asignar la clase con la mayor probabilidad posterior.",
                formula:"ŷ = argmax_k [ P(k) · ΠᵢP(xᵢ|k) ]",
              },
            ].map((item) => (
              <StepCard key={item.num} num={item.num} icon={item.icon} title={item.title} color={item.color}>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{item.desc}</p>
                <Formula color={item.color}>{item.formula}</Formula>
              </StepCard>
            ))}
          </div>
        </section>

        {/* ══ 4. VENTAJAS Y DESVENTAJAS ════════════════════════ */}
        <section id="ventajas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="⚡" title="Ventajas y Desventajas" color="#10b981" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-emerald-300 text-xs font-bold mb-4">✅ Ventajas</p>
              <ul className="space-y-3">
                {[
                  { text:"Fácil y rápido para predecir en conjuntos de datos grandes.", icon:"⚡" },
                  { text:"Funciona bien en predicción multiclase sin modificaciones.",  icon:"🏷️" },
                  { text:"Requiere menos datos de entrenamiento que modelos complejos.",icon:"📉" },
                  { text:"Supera a la regresión logística cuando se mantiene la independencia condicional.", icon:"🎯" },
                  { text:"Especialmente bueno con variables de entrada categóricas.",   icon:"🔤" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-500 text-sm">{item.icon}</span>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
              <p className="text-rose-300 text-xs font-bold mb-4">⚠️ Desventajas</p>
              <ul className="space-y-3">
                {[
                  {
                    text:"Problema de frecuencia cero: si un valor no aparece en entrenamiento, asigna probabilidad 0.",
                    sol:"Solución: alisamiento de Laplace (+1 a todos los conteos).",
                    icon:"🚫",
                  },
                  {
                    text:"Supuesto de independencia raramente se cumple en datos reales.",
                    sol:"En la práctica igualmente funciona bien para muchos problemas.",
                    icon:"🔗",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 pb-3 border-b border-rose-500/10 last:border-0 last:pb-0">
                    <span className="text-rose-500 text-sm mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-1">{item.text}</p>
                      <p className="text-rose-500/70 text-xs italic">{item.sol}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tipos de Naive Bayes */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-amber-300 text-xs font-bold mb-3">Variantes de Naive Bayes en sklearn</p>
            <div className="space-y-2">
              {[
                { name:"GaussianNB",     desc:"Features continuas con distribución normal. Usado en el notebook.",  badge:"continuas",   color:"emerald" },
                { name:"MultinomialNB",  desc:"Features de conteo (frecuencias de palabras). Ideal para texto.",   badge:"conteos",     color:"sky" },
                { name:"BernoulliNB",    desc:"Features binarias (0/1). Clasificación de documentos binaria.",     badge:"binarias",    color:"violet" },
                { name:"ComplementNB",   desc:"Adaptado para datasets desbalanceados. Variante de MultinomialNB.", badge:"desbalance",  color:"amber" },
              ].map((v) => {
                const col = {
                  emerald:"text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
                  sky:    "text-sky-300 bg-sky-500/10 border-sky-500/20",
                  violet: "text-violet-300 bg-violet-500/10 border-violet-500/20",
                  amber:  "text-amber-300 bg-amber-500/10 border-amber-500/20",
                }[v.color];
                return (
                  <div key={v.name} className="flex items-start gap-3 bg-black/20 rounded-lg px-3 py-2">
                    <code className={`text-xs px-2 py-0.5 rounded border font-mono whitespace-nowrap ${col}`}>{v.name}</code>
                    <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ 5. DEMOS ═════════════════════════════════════════ */}
        <section id="demo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="🎮" title="Demos Interactivas" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Experimenta con Bayes aplicado a clasificación de spam y con el modelo GaussianNB del notebook sobre el dataset de cáncer.
          </p>
          <div className="space-y-6">
            <BayesPasosDemo />
            <CancerDemo />
          </div>
        </section>

        {/* ══ 6. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Breast Cancer con GaussianNB" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El notebook aplica GaussianNB al dataset de cáncer de mama de sklearn para diagnosticar si un tumor es <strong className="text-white">maligno (0)</strong> o <strong className="text-white">benigno (1)</strong> a partir de 30 características clínicas.
          </p>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-6">
            <p className="text-violet-300 text-xs font-bold mb-3">Dataset: Breast Cancer Wisconsin</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[
                { label:"Muestras",   val:"569",  color:"sky" },
                { label:"Features",   val:"30",   color:"violet" },
                { label:"Maligno",    val:"212",  color:"rose" },
                { label:"Benigno",    val:"357",  color:"emerald" },
              ].map((m) => {
                const col = { sky:"text-sky-300 bg-sky-500/10", violet:"text-violet-300 bg-violet-500/10", rose:"text-rose-300 bg-rose-500/10", emerald:"text-emerald-300 bg-emerald-500/10" }[m.color];
                return (
                  <div key={m.label} className={`rounded-lg p-3 text-center ${col.split(" ")[1]}`}>
                    <p className={`text-xl font-black font-mono ${col.split(" ")[0]}`}>{m.val}</p>
                    <p className="text-gray-600 text-xs">{m.label}</p>
                  </div>
                );
              })}
            </div>
            <CodeBlock>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn </span><span className="text-sky-400">import</span><span className="text-white"> datasets</span></p>
              <p><span className="text-emerald-400">datos</span><span className="text-white"> = datasets.load_breast_cancer()</span></p>
              <p><span className="text-violet-400">print</span><span className="text-white">(datos.keys())</span></p>
              <p className="text-gray-500"># dict_keys(['data','target','feature_names','DESCR',…])</p>
            </CodeBlock>
          </div>

          <PipelineDemo />

          <div className="mt-6">
            <p className="text-white font-semibold mb-4">Resultados del notebook</p>

            {/* Matriz de confusión */}
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 mb-4">
              <p className="text-sky-300 text-xs font-bold mb-3">Matriz de Confusión (binaria)</p>
              <div className="grid gap-2 mb-4" style={{ gridTemplateColumns:"auto 1fr 1fr", maxWidth:300 }}>
                <div/>
                <div className="text-center text-xs text-gray-600 font-mono">Pred Maligno</div>
                <div className="text-center text-xs text-gray-600 font-mono">Pred Benigno</div>
                {[
                  { label:"Real Maligno", vals:[53, 6],  colors:["emerald","rose"] },
                  { label:"Real Benigno", vals:[6, 106], colors:["rose","emerald"] },
                ].map((row) => (
                  <>
                    <div key={row.label+"l"} className="text-xs text-gray-600 font-mono flex items-center">{row.label}</div>
                    {row.vals.map((v, i) => {
                      const isCorrect = row.colors[i] === "emerald";
                      return (
                        <div key={i} className={`rounded-xl border ${isCorrect ? "border-emerald-500/40 bg-emerald-500/20" : "border-rose-500/20 bg-rose-500/5"} p-3 text-center`}>
                          <p className={`text-2xl font-black font-mono ${isCorrect ? "text-emerald-300" : "text-rose-400"}`}>{v}</p>
                          <p className="text-xs text-gray-600 font-mono">{isCorrect ? (i===0?"VP":"VN") : (i===0?"FP":"FN")}</p>
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                <strong className="text-emerald-300">159 correctos</strong> de 171 totales — 
                <span className="text-emerald-400"> 53 VP</span> (maligno → maligno) + 
                <span className="text-emerald-400"> 106 VN</span> (benigno → benigno) · 
                <span className="text-rose-400"> 12 errores</span> (6 FP + 6 FN)
              </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label:"Precisión",      val:"94.6%",  sub:"precision_score",    color:"emerald", note:"94 de cada 100 positivos predichos son reales" },
                { label:"Correctos",      val:"159/171", sub:"VP + VN",            color:"sky",     note:"93% de tasa de acierto global" },
                { label:"Errores",        val:"12",     sub:"FP + FN (6+6)",       color:"amber",   note:"6 falsos positivos y 6 falsos negativos" },
              ].map((m) => {
                const c = {
                  emerald:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",muted:"text-emerald-700" },
                  sky:    { border:"border-sky-500/30",    bg:"bg-sky-500/10",    text:"text-sky-300",    muted:"text-sky-700" },
                  amber:  { border:"border-amber-500/30",  bg:"bg-amber-500/10",  text:"text-amber-300",  muted:"text-amber-700" },
                }[m.color];
                return (
                  <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                    <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                    <p className={`text-xl font-black font-mono mb-1 ${c.text}`}>{m.val}</p>
                    <p className={`text-xs font-mono ${c.muted}`}>{m.sub}</p>
                    <p className="text-gray-600 text-xs mt-1">{m.note}</p>
                  </div>
                );
              })}
            </div>

            <CodeBlock>
              <p className="text-gray-500"># Código completo</p>
              <p><span className="text-emerald-400">modelo</span><span className="text-white"> = GaussianNB()</span></p>
              <p><span className="text-emerald-400">modelo</span><span className="text-white">.fit(X_train, y_train)</span></p>
              <p><span className="text-emerald-400">y_pred</span><span className="text-white"> = modelo.predict(X_test)</span></p>
              <p className="mt-1"><span className="text-violet-400">print</span><span className="text-white">(precision_score(y_test, y_pred))</span></p>
              <p className="text-gray-500"># → 0.9464  (94.6%)</p>
              <p><span className="text-violet-400">print</span><span className="text-white">(confusion_matrix(y_test, y_pred))</span></p>
              <p className="text-gray-500"># [[ 53   6]</p>
              <p className="text-gray-500">#  [  6 106]]</p>
            </CodeBlock>

            <Tip color="emerald">
              El notebook concluye que el modelo tiene <strong>alta tasa de precisión</strong>. Para un problema médico, los 6 falsos negativos (maligno clasificado como benigno) son más críticos que los 6 falsos positivos — en esos casos, considera ajustar el umbral de decisión.
            </Tip>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"Teorema de Bayes",         desc:"P(H|E) = P(E|H)·P(H) / P(E). Calcula probabilidad posterior de cada clase.",         color:"#a855f7" },
              { label:"Supuesto 'Naive'",          desc:"Independencia condicional entre features dado la clase. Simplifica el cálculo.",       color:"#f59e0b" },
              { label:"GaussianNB",               desc:"Variante para features continuas. Asume distribución normal por clase y feature.",     color:"#10b981" },
              { label:"Frecuencia cero",           desc:"Si un valor no aparece en train, P=0. Solución: Laplace smoothing (+1 a conteos).",   color:"#f43f5e" },
              { label:"Resultado notebook",        desc:"Breast Cancer, GaussianNB, split 70/30 → Precisión 94.6%, 159/171 correctos.",        color:"#0ea5e9" },
              { label:"Cuándo usarlo",             desc:"Datasets grandes, variables categóricas, clasificación de texto. Rápido y ligero.",   color:"#6366f1" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · Naive Bayes</span>
        </div>

      </div>
    </div>
  );
}