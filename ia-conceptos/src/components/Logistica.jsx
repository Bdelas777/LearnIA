import { useState, useMemo } from "react";

// ── Demo: Función Sigmoide interactiva ────────────────────────────
function SigmoideDemo() {
  const [beta0, setBeta0] = useState(0);
  const [beta1, setBeta1] = useState(1);
  const [threshold, setThreshold] = useState(0.5);

  const sigmoid = (x) => 1 / (1 + Math.exp(-(beta0 + beta1 * x)));

  // SVG
  const W = 340, H = 200, PAD = 30;
  const xMin = -10, xMax = 10;
  const xs = Array.from({ length: 80 }, (_, i) => xMin + (i / 79) * (xMax - xMin));
  const ys = xs.map(sigmoid);

  const sx = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y) => H - PAD - y * (H - PAD * 2);

  const curvePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(" ");
  const thY = sy(threshold);

  // Clasificación en x=0
  const prob0 = sigmoid(0).toFixed(3);
  const clase0 = sigmoid(0) >= threshold ? "Clase 1" : "Clase 0";

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Función sigmoide σ(z)</p>

      <div className="bg-black/40 rounded-xl border border-white/10 mb-4 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
          {/* Grid */}
          {[0.25, 0.5, 0.75].map(y => (
            <line key={y} x1={PAD} y1={sy(y)} x2={W-PAD} y2={sy(y)}
              stroke="#ffffff08" strokeWidth="1"/>
          ))}
          {[-5, 0, 5].map(x => (
            <line key={x} x1={sx(x)} y1={PAD} x2={sx(x)} y2={H-PAD}
              stroke="#ffffff08" strokeWidth="1"/>
          ))}
          {/* Axes */}
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H-PAD} stroke="#ffffff18" strokeWidth="1"/>
          <line x1={PAD} y1={sy(0.5)} x2={W-PAD} y2={sy(0.5)} stroke="#ffffff18" strokeWidth="1"/>

          {/* Threshold line */}
          <line x1={PAD} y1={thY} x2={W-PAD} y2={thY}
            stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8"/>
          <text x={W-PAD+2} y={thY+3} fill="#f59e0b" fontSize="8" opacity="0.8">{threshold.toFixed(1)}</text>

          {/* Sigmoid curve */}
          <path d={curvePath} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round"/>

          {/* Labels */}
          <text x={PAD} y={sy(1)-4}  fill="#ffffff20" fontSize="7">1.0</text>
          <text x={PAD} y={sy(0)+10} fill="#ffffff20" fontSize="7">0.0</text>
          <text x={W/2} y={H-6} fill="#ffffff20" fontSize="8" textAnchor="middle">z = β₀ + β₁x</text>
        </svg>
      </div>

      <div className="space-y-3 mb-5">
        {[
          { label:"β₀ (sesgo)", val:beta0, set:setBeta0, min:-5, max:5, color:"sky" },
          { label:"β₁ (pendiente)", val:beta1, set:setBeta1, min:-3, max:3, color:"violet", step:0.1 },
          { label:"Umbral de clasificación", val:threshold, set:setThreshold, min:0.1, max:0.9, color:"amber", step:0.05 },
        ].map((row) => {
          const col = { sky:"accent-sky-500 text-sky-300", violet:"accent-violet-500 text-violet-300", amber:"accent-amber-500 text-amber-300" }[row.color];
          const [accent, textCol] = col.split(" ");
          return (
            <div key={row.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-mono">{row.label}</span>
                <span className={`font-bold font-mono ${textCol}`}>{Number(row.val).toFixed(2)}</span>
              </div>
              <input type="range" min={row.min} max={row.max} step={row.step || 0.5} value={row.val}
                onChange={e => row.set(Number(e.target.value))}
                className={`w-full ${accent}`}/>
            </div>
          );
        })}
      </div>

      {/* Resultado en x=0 */}
      <div className={`rounded-xl border p-4 transition-all duration-300 ${
        sigmoid(0) >= threshold
          ? "border-emerald-500/40 bg-emerald-500/15"
          : "border-rose-500/40 bg-rose-500/15"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-mono mb-1">P(y=1 | x=0) = σ(β₀) = σ({beta0})</p>
            <p className={`text-2xl font-black font-mono ${sigmoid(0) >= threshold ? "text-emerald-300" : "text-rose-300"}`}>
              {prob0}
            </p>
          </div>
          <div className={`text-right`}>
            <p className="text-gray-500 text-xs mb-1">Clasificación</p>
            <p className={`font-bold text-lg ${sigmoid(0) >= threshold ? "text-emerald-300" : "text-rose-300"}`}>
              {clase0}
            </p>
            <p className="text-gray-600 text-xs font-mono">umbral = {threshold.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Demo: Clasificador de usuarios interactivo ─────────────────────
function ClasificadorDemo() {
  const [duracion,  setDuracion]  = useState(45);
  const [paginas,   setPaginas]   = useState(3);
  const [acciones,  setAcciones]  = useState(8);
  const [valor,     setValor]     = useState(12);

  // Simulación aproximada del modelo del notebook (3 clases: Win=0, Mac=1, Lin=2)
  const clasificar = () => {
    // Heurística basada en las distribuciones del dataset
    const scoreWin = (duracion < 40 ? 0.4 : 0.2) + (valor < 10 ? 0.3 : 0.1) + (acciones < 6 ? 0.3 : 0.0);
    const scoreMac = (paginas > 3 ? 0.4 : 0.1) + (valor > 12 ? 0.4 : 0.1) + (duracion > 60 ? 0.3 : 0.1);
    const scoreLin = (acciones > 8 ? 0.5 : 0.1) + (duracion > 50 ? 0.3 : 0.1) + (paginas > 4 ? 0.3 : 0.0);
    const total    = scoreWin + scoreMac + scoreLin;
    return [
      { clase:"Windows",   prob:(scoreWin/total*100).toFixed(1), color:"sky",    icon:"🪟" },
      { clase:"Macintosh", prob:(scoreMac/total*100).toFixed(1), color:"violet", icon:"🍎" },
      { clase:"Linux",     prob:(scoreLin/total*100).toFixed(1), color:"emerald",icon:"🐧" },
    ].sort((a,b) => b.prob - a.prob);
  };

  const resultados = useMemo(clasificar, [duracion, paginas, acciones, valor]);
  const ganador = resultados[0];

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-5 uppercase tracking-widest">🎮 Demo — Clasificador de usuarios por SO</p>

      <div className="space-y-3 mb-5">
        {[
          { label:"Duración de sesión (min)", val:duracion, set:setDuracion, min:1,  max:200, color:"sky" },
          { label:"Páginas visitadas",         val:paginas,  set:setPaginas,  min:1,  max:10,  color:"violet" },
          { label:"Acciones del usuario",      val:acciones, set:setAcciones, min:0,  max:25,  color:"emerald" },
          { label:"Valor de acciones",         val:valor,    set:setValor,    min:0,  max:30,  color:"amber" },
        ].map((row) => {
          const col = { sky:"accent-sky-500 text-sky-300", violet:"accent-violet-500 text-violet-300", emerald:"accent-emerald-500 text-emerald-300", amber:"accent-amber-500 text-amber-300" }[row.color];
          const [accent, textCol] = col.split(" ");
          return (
            <div key={row.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-mono">{row.label}</span>
                <span className={`font-bold font-mono ${textCol}`}>{row.val}</span>
              </div>
              <input type="range" min={row.min} max={row.max} value={row.val}
                onChange={e => row.set(Number(e.target.value))}
                className={`w-full ${accent}`}/>
            </div>
          );
        })}
      </div>

      {/* Resultados */}
      <div className="space-y-2 mb-3">
        {resultados.map((r, i) => {
          const c = {
            sky:    { border:"border-sky-500/30",    bg:"bg-sky-500/10",    text:"text-sky-300",    bar:"bg-sky-500" },
            violet: { border:"border-violet-500/30", bg:"bg-violet-500/10", text:"text-violet-300", bar:"bg-violet-500" },
            emerald:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",bar:"bg-emerald-500" },
          }[r.color];
          return (
            <div key={r.clase} className={`rounded-xl border ${i === 0 ? c.border : "border-white/10"} ${i === 0 ? c.bg : "bg-white/[0.02]"} p-3`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{r.icon}</span>
                  <p className={`text-sm font-bold ${i === 0 ? c.text : "text-gray-500"}`}>{r.clase}</p>
                  {i === 0 && <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.bg} ${c.text} border ${c.border}`}>predicción</span>}
                </div>
                <span className={`font-black font-mono text-lg ${i === 0 ? c.text : "text-gray-600"}`}>{r.prob}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${i === 0 ? c.bar : "bg-white/10"}`}
                  style={{ width:`${r.prob}%` }}/>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-gray-600 text-xs font-mono text-center">
        modelo_RL.predict([[{duracion}, {paginas}, {acciones}, {valor}]]) → clase {ganador.icon}
      </p>
    </div>
  );
}

// ── Demo: Pipeline animado ────────────────────────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, label:"Importar librerías",        icon:"📦", color:"sky",    code:"from sklearn import linear_model\nfrom sklearn.model_selection import train_test_split\nfrom sklearn import metrics" },
    { id:1, label:"Cargar dataset",            icon:"📂", color:"violet", code:"dataset = pd.read_csv('usuarios_win_mac_lin.csv')\n# 170 filas: duracion, paginas, acciones, valor, clase\n# clase: 0=Windows(86), 1=Mac(40), 2=Linux(44)" },
    { id:2, label:"Separar X e Y",             icon:"✂️",  color:"emerald",code:"X = dataset.drop('clase', axis=1)\nY = dataset['clase']\n# X: 4 features | Y: 3 clases" },
    { id:3, label:"Split 80/20",               icon:"🔢", color:"amber",  code:"X_train, X_test, y_train, y_test =\n  train_test_split(X, Y, train_size=.80, random_state=1)" },
    { id:4, label:"Crear y entrenar modelo",   icon:"🧠", color:"rose",   code:"modelo_RL = linear_model.LogisticRegression(\n  solver='lbfgs', max_iter=1000)\nmodelo_RL.fit(X_train, y_train)" },
    { id:5, label:"Predecir",                  icon:"🔮", color:"sky",    code:"prediccion = modelo_RL.predict(X_test)" },
    { id:6, label:"Matriz de confusión",       icon:"🗂️", color:"violet", code:"metrics.confusion_matrix(y_test, prediccion)\n# [[11  0  2]\n#  [ 9  1  0]\n#  [ 2  0  9]]" },
    { id:7, label:"Tasa de acierto y reporte", icon:"📊", color:"emerald",code:"metrics.accuracy_score(y_test, prediccion)\n# → 0.6176 (61.8%)\nmetrics.classification_report(y_test, prediccion)" },
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
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Pipeline: clasificación de usuarios por SO</p>
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

// ── Página principal ──────────────────────────────────────────────
export default function RegresionLogistica({ onBack }) {
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
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-900/8 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-rose-900/8 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo IV</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily:"monospace" }}>Regresión Logística</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#a855f7", color:"#a855f7", fontFamily:"monospace" }}>
            🔀 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Regresión{" "}
            <span style={{
              background:"linear-gradient(135deg, #a855f7, #f43f5e, #0ea5e9)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Logística</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Técnica de clasificación que aplica la
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">función sigmoide</code>
            para convertir una salida lineal en una
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">probabilidad entre 0 y 1</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",     label:"📌 Introducción" },
            { href:"#sigmoide",  label:"📐 Función sigmoide" },
            { href:"#transform", label:"🔄 Lineal → Logística" },
            { href:"#tipos",     label:"🏷️ Tipos" },
            { href:"#demo",      label:"📊 Demo sigmoide" },
            { href:"#practica",  label:"🧪 Práctica" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ 1. INTRODUCCIÓN ══════════════════════════════════ */}
        <section id="intro" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📌" title="Introducción" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            La <strong className="text-white">Regresión Logística</strong> es una de las técnicas de clasificación más sencillas y ampliamente utilizadas. Es un método estadístico para predecir la <strong className="text-white">pertenencia o no a una clase</strong>, donde la variable objetivo es de naturaleza dicotómica (dos clases posibles) o multinomial.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon:"📧", label:"Spam",           desc:"Correo spam o no spam",          color:"#f43f5e" },
              { icon:"🏥", label:"Medicina",        desc:"COVID / mascarilla sí o no",     color:"#10b981" },
              { icon:"🛒", label:"E-commerce",      desc:"Compra o no compra producto",    color:"#0ea5e9" },
              { icon:"💳", label:"Fraude",          desc:"Transacción fraudulenta o no",   color:"#f59e0b" },
              { icon:"📱", label:"SO de usuario",   desc:"Windows, Mac o Linux",           color:"#a855f7" },
              { icon:"🧬", label:"Diagnóstico",     desc:"Tumor benigno o maligno",        color:"#f43f5e" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-xs font-bold mb-0.5" style={{ color:item.color }}>{item.label}</p>
                <p className="text-xs text-gray-600 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>

          <Tip color="violet">
            Aunque se llama "regresión", es un <strong>algoritmo de clasificación</strong>. El nombre viene de que usa regresión lineal internamente, pero la salida pasa por la función sigmoide para convertirla en probabilidad.
          </Tip>
        </section>

        {/* ══ 2. FUNCIÓN SIGMOIDE ══════════════════════════════ */}
        <section id="sigmoide" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="📐" title="Función Sigmoide (Logística)" color="#f43f5e" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El núcleo del método es la <strong className="text-white">función sigmoide</strong> — también llamada función logística — que toma cualquier número real y lo comprime al intervalo (0, 1), interpretable como probabilidad.
          </p>

          <Formula color="rose">σ(z) = 1 / (1 + e^(−z))</Formula>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { z:"z → −∞", out:"σ → 0",    desc:"Valores muy negativos → probabilidad casi 0.",  color:"sky" },
              { z:"z = 0",   out:"σ = 0.5",  desc:"En cero la probabilidad es exactamente 0.5.",   color:"violet" },
              { z:"z → +∞", out:"σ → 1",    desc:"Valores muy positivos → probabilidad casi 1.",  color:"emerald" },
            ].map((item) => {
              const c = {
                sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300" },
                violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300" },
                emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300" },
              }[item.color];
              return (
                <div key={item.z} className={`rounded-xl border ${c.border} ${c.bg} p-4 text-center`}>
                  <p className="text-gray-500 text-xs font-mono mb-1">{item.z}</p>
                  <p className={`text-2xl font-black font-mono mb-2 ${c.text}`}>{item.out}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <CodeBlock>
            <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-emerald-400"> np</span></p>
            <p className="mt-1"><span className="text-emerald-400">x</span><span className="text-white"> = np.linspace(-</span><span className="text-amber-300">10</span><span className="text-white">, </span><span className="text-amber-300">10</span><span className="text-white">)</span></p>
            <p><span className="text-emerald-400">y</span><span className="text-white"> = </span><span className="text-amber-300">1</span><span className="text-white"> / (</span><span className="text-amber-300">1</span><span className="text-white"> + np.exp(-x))</span><span className="text-gray-500 ml-2"># sigmoide</span></p>
          </CodeBlock>
        </section>

        {/* ══ 3. TRANSFORMAR LINEAL → LOGÍSTICA ════════════════ */}
        <section id="transform" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="🔄" title="De Regresión Lineal a Logística" color="#0ea5e9" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            La regresión logística toma la salida de un modelo lineal y la pasa por la función sigmoide para producir una probabilidad clasificable.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            {[
              { label:"1. Modelo lineal",     formula:"z = β₀ + β₁x₁ + … + βₙxₙ",  color:"sky",    icon:"📏", desc:"Salida continua, puede ser cualquier número real." },
              { label:"2. Función sigmoide",  formula:"P = σ(z) = 1/(1+e^(−z))",    color:"violet", icon:"🔀", desc:"Transforma z en una probabilidad entre 0 y 1." },
              { label:"3. Clasificación",     formula:"clase = 1 si P ≥ 0.5 si no 0", color:"emerald",icon:"🏷️", desc:"Asigna clase según el umbral de decisión." },
            ].map((step, i) => {
              const c = {
                sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300" },
                violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300" },
                emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300" },
              }[step.color];
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className={`rounded-xl border ${c.border} ${c.bg} p-4 w-full text-center`}>
                    <span className="text-xl mb-2 block">{step.icon}</span>
                    <p className={`text-xs font-bold mb-1 ${c.text}`}>{step.label}</p>
                    <code className={`text-xs font-mono ${c.text} block mb-2`}>{step.formula}</code>
                    <p className="text-gray-500 text-xs">{step.desc}</p>
                  </div>
                  {i < 2 && <span className="text-gray-600 text-2xl mt-2 sm:hidden">↓</span>}
                </div>
              );
            })}
          </div>

          {/* Diferencia lineal vs logística */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-sky-300 text-xs font-bold mb-2">Regresión Lineal</p>
              <p className="text-gray-500 text-sm leading-relaxed">Proporciona una <strong className="text-white">salida continua</strong>. Ejemplos: precio de una acción, temperatura, porcentaje de probabilidad de lluvia.</p>
              <p className="text-sky-600 text-xs mt-2 font-mono">y ∈ (−∞, +∞)</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-violet-300 text-xs font-bold mb-2">Regresión Logística</p>
              <p className="text-gray-500 text-sm leading-relaxed">Proporciona una <strong className="text-white">salida discreta</strong> (clase). Ejemplos: llueve o no, la acción sube o baja, spam o no spam.</p>
              <p className="text-violet-600 text-xs mt-2 font-mono">P(y=1) ∈ (0, 1) → clase {"{0,1}"}</p>
            </div>
          </div>
        </section>

        {/* ══ 4. TIPOS ═════════════════════════════════════════ */}
        <section id="tipos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"140ms" }}>
          <SectionHeader icon="🏷️" title="Tipos de Regresión Logística" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            El tipo de modelo depende del número de categorías de la variable objetivo.
          </p>

          <div className="space-y-4">
            {[
              {
                num:"01", icon:"⚡", title:"Binaria",      color:"emerald",
                desc:"La variable objetivo tiene solo dos resultados posibles.",
                ejemplos:["Llueve o NO Llueve", "Sube o Baja (acción)", "Spam o No spam", "Enfermo o Sano"],
                formula:"y ∈ {0, 1}",
              },
              {
                num:"02", icon:"🎨", title:"Multinomial",  color:"violet",
                desc:"La variable objetivo tiene tres o más categorías nominales (sin orden).",
                ejemplos:["Tipo de vino (tinto, blanco, rosado)", "Sistema operativo (Win, Mac, Linux)", "Animal (perro, gato, pájaro)"],
                formula:"y ∈ {0, 1, 2, …, k}",
              },
              {
                num:"03", icon:"📊", title:"Ordinal",      color:"amber",
                desc:"La variable objetivo tiene tres o más categorías con orden natural.",
                ejemplos:["Rating restaurante (1 a 5 estrellas)", "Nivel satisfacción (bajo, medio, alto)", "Grado severidad (leve, moderado, grave)"],
                formula:"y ∈ {1 < 2 < 3 < … < k}",
              },
            ].map((item) => {
              const c = {
                emerald:{ border:"border-emerald-500/20", bg:"bg-emerald-500/5", text:"text-emerald-300", step:"text-emerald-500/25", badge:"bg-emerald-500/20 text-emerald-300" },
                violet: { border:"border-violet-500/20",  bg:"bg-violet-500/5",  text:"text-violet-300",  step:"text-violet-500/25",  badge:"bg-violet-500/20 text-violet-300" },
                amber:  { border:"border-amber-500/20",   bg:"bg-amber-500/5",   text:"text-amber-300",   step:"text-amber-500/25",   badge:"bg-amber-500/20 text-amber-300" },
              }[item.color];
              return (
                <div key={item.num} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                  <div className="flex items-start gap-4">
                    <span className={`text-4xl font-black leading-none flex-shrink-0 ${c.step}`} style={{ fontFamily:"monospace" }}>{item.num}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{item.icon}</span>
                        <h3 className={`font-bold text-base ${c.text}`}>{item.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${c.badge}`}>{item.formula}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">{item.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.ejemplos.map(e => (
                          <span key={e} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-lg font-mono">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 5. DEMO SIGMOIDE ═════════════════════════════════ */}
        <section id="demo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="📊" title="Demos Interactivas" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Explora la función sigmoide con distintos parámetros y simula el clasificador de usuarios del notebook.
          </p>

          <div className="space-y-6">
            <SigmoideDemo />
            <ClasificadorDemo />
          </div>
        </section>

        {/* ══ 6. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Clasificación de usuarios por SO" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El notebook clasifica usuarios de un sitio web en <strong className="text-white">Windows (0), Macintosh (1) o Linux (2)</strong> según su comportamiento de navegación: duración, páginas visitadas, acciones y valor de las acciones.
          </p>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-6">
            <p className="text-violet-300 text-xs font-bold mb-3">Dataset: usuarios_win_mac_lin.csv</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
              {[
                { feat:"duracion",  desc:"Tiempo de sesión",             color:"sky" },
                { feat:"paginas",   desc:"Páginas visitadas",            color:"violet" },
                { feat:"acciones",  desc:"Clicks, scrolls, etc.",        color:"emerald" },
                { feat:"valor",     desc:"Importancia de las acciones",  color:"amber" },
                { feat:"clase →",   desc:"Win(0) Mac(1) Lin(2)",         color:"rose" },
              ].map((f) => {
                const col = { sky:"text-sky-300 bg-sky-500/10", violet:"text-violet-300 bg-violet-500/10", emerald:"text-emerald-300 bg-emerald-500/10", amber:"text-amber-300 bg-amber-500/10", rose:"text-rose-300 bg-rose-500/10" }[f.color];
                return (
                  <div key={f.feat} className={`rounded-lg p-2 text-center ${col.split(" ")[1]}`}>
                    <p className={`text-xs font-bold font-mono ${col.split(" ")[0]}`}>{f.feat}</p>
                    <p className="text-gray-600 text-xs">{f.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 font-mono text-xs text-gray-500">
              <span>170 filas totales</span>
              <span>·</span>
              <span className="text-sky-400">Windows: 86</span>
              <span className="text-violet-400">Mac: 40</span>
              <span className="text-emerald-400">Linux: 44</span>
            </div>
          </div>

          <PipelineDemo />

          <div className="mt-6">
            <p className="text-white font-semibold mb-4">Resultados del notebook</p>

            {/* Matriz de confusión */}
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 mb-4">
              <p className="text-sky-300 text-xs font-bold mb-3">Matriz de Confusión (3×3 — multinomial)</p>
              <div className="grid gap-1 mb-3" style={{ gridTemplateColumns:"repeat(4, 1fr)", maxWidth:280 }}>
                {/* Header */}
                <div/>
                {["Pred Win","Pred Mac","Pred Lin"].map(h => (
                  <div key={h} className="text-center text-xs text-gray-600 font-mono pb-1">{h}</div>
                ))}
                {/* Rows */}
                {[
                  { label:"Real Win", vals:[11, 0, 2], colors:["emerald","rose","rose"] },
                  { label:"Real Mac", vals:[9,  1, 0], colors:["rose","emerald","rose"] },
                  { label:"Real Lin", vals:[2,  0, 9], colors:["rose","rose","emerald"] },
                ].map((row) => (
                  <>
                    <div key={row.label} className="text-xs text-gray-600 font-mono flex items-center">{row.label}</div>
                    {row.vals.map((v, i) => {
                      const isCorrect = row.colors[i] === "emerald";
                      return (
                        <div key={i} className={`rounded-lg border ${isCorrect ? "border-emerald-500/40 bg-emerald-500/20" : "border-rose-500/20 bg-rose-500/5"} p-2 text-center`}>
                          <span className={`font-black font-mono text-base ${isCorrect ? "text-emerald-300" : "text-rose-400"}`}>{v}</span>
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
              <CodeBlock>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn </span><span className="text-sky-400">import</span><span className="text-white"> metrics</span></p>
                <p><span className="text-violet-400">print</span><span className="text-white">(metrics.confusion_matrix(y_test, prediccion))</span></p>
                <p className="text-gray-500"># [[11  0  2]</p>
                <p className="text-gray-500">#  [ 9  1  0]</p>
                <p className="text-gray-500">#  [ 2  0  9]]</p>
              </CodeBlock>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label:"Tasa de Acierto",  val:"61.8%",  sub:"accuracy_score",          color:"amber",   note:"Modelo multiclase con clases desbalanceadas" },
                { label:"Mejor clase",      val:"Linux",  sub:"f1=0.82 precision=0.82",   color:"emerald", note:"La clase con mejor desempeño del modelo" },
                { label:"Peor clase",       val:"Mac",    sub:"f1=0.18 recall=0.10",      color:"rose",    note:"Solo 4 muestras Mac en test set" },
              ].map((m) => {
                const c = {
                  amber:  { border:"border-amber-500/30",  bg:"bg-amber-500/10",  text:"text-amber-300",  muted:"text-amber-700" },
                  emerald:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",muted:"text-emerald-700" },
                  rose:   { border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300",   muted:"text-rose-700" },
                }[m.color];
                return (
                  <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                    <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                    <p className={`text-2xl font-black font-mono mb-1 ${c.text}`}>{m.val}</p>
                    <p className={`text-xs font-mono ${c.muted}`}>{m.sub}</p>
                    <p className="text-gray-600 text-xs mt-1">{m.note}</p>
                  </div>
                );
              })}
            </div>

            {/* Reporte de clasificación */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-4">
              <p className="text-white text-sm font-semibold mb-3">Reporte de clasificación completo</p>
              <CodeBlock>
                <p><span className="text-violet-400">print</span><span className="text-white">(metrics.classification_report(y_test, prediccion))</span></p>
                <p className="text-gray-500 mt-1">#              precision  recall  f1-score  support</p>
                <p><span className="text-sky-300">          0</span><span className="text-white">       0.50    0.85      0.63       13</span></p>
                <p><span className="text-violet-300">          1</span><span className="text-white">       1.00    0.10      0.18       10</span></p>
                <p><span className="text-emerald-300">          2</span><span className="text-white">       0.82    0.82      0.82       11</span></p>
                <p className="text-gray-500"># accuracy                           0.62       34</p>
              </CodeBlock>
            </div>

            <Tip color="amber">
              La baja precisión (61.8%) se explica por el <strong>desbalance de clases</strong>: Windows tiene el doble de muestras que Mac o Linux. Considera técnicas como SMOTE o ajustar <code>class_weight='balanced'</code> en sklearn.
            </Tip>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"Sigmoide",       desc:"σ(z) = 1/(1+e^(−z)). Comprime cualquier valor real al intervalo (0,1). Núcleo del método.",             color:"#a855f7" },
              { label:"Modelo",         desc:"P(y=1|x) = σ(β₀ + β₁x₁ + … + βₙxₙ). Predice probabilidad de pertenecer a una clase.",                 color:"#f43f5e" },
              { label:"Umbral",         desc:"Si P ≥ 0.5 → clase 1, si no clase 0. El umbral es ajustable según el costo de FP/FN.",                  color:"#0ea5e9" },
              { label:"Binaria",        desc:"Dos clases: spam/no spam, sube/baja, enfermo/sano. El caso más común y simple.",                        color:"#10b981" },
              { label:"Multinomial",    desc:"3+ clases nominales: Win/Mac/Linux. sklearn usa One-vs-Rest internamente.",                              color:"#f59e0b" },
              { label:"sklearn",        desc:"LogisticRegression(solver='lbfgs', max_iter=1000). Predice clases con .predict(), probabilidades con .predict_proba().", color:"#6366f1" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · Regresión Logística</span>
        </div>

      </div>
    </div>
  );
}