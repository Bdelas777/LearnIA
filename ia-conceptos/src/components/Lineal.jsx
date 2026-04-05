import { useState, useMemo } from "react";

// ── Demo: Regresión lineal interactiva ────────────────────────────
function RegresionDemo() {
  // Dataset del notebook: llamadas → ventas
  const datosCompletos = [
    [10,18],[11,27],[12,28],[13,29],[14,33],[15,27],[16,38],[17,34],
    [18,42],[19,22],[20,36],[21,43],[22,45],[23,55],[24,43],[25,53],
    [26,47],[27,42],[28,46],[29,60],[30,62],[31,54],[32,62],[33,49],
    [34,72],[35,68],[36,66],[37,63],[38,74],[39,72],[40,75],
  ];

  const [noise, setNoise] = useState(0);
  const [mostrarResiduos, setMostrarResiduos] = useState(false);

  // Datos con ruido opcional
  const datos = useMemo(() =>
    datosCompletos.map(([x, y]) => [x, y + (((x * 137 + noise * 31) % 21) - 10) * noise / 25]),
    [noise]
  );

  // Calcular β1 y β0 por OLS
  const { beta0, beta1 } = useMemo(() => {
    const n = datos.length;
    const xMean = datos.reduce((s, [x]) => s + x, 0) / n;
    const yMean = datos.reduce((s, [, y]) => s + y, 0) / n;
    const cov   = datos.reduce((s, [x, y]) => s + (x - xMean) * (y - yMean), 0);
    const varX  = datos.reduce((s, [x]) => s + (x - xMean) ** 2, 0);
    const b1 = cov / varX;
    const b0 = yMean - b1 * xMean;
    return { beta0: b0, beta1: b1 };
  }, [datos]);

  const pred = (x) => beta0 + beta1 * x;
  const mse  = datos.reduce((s, [x, y]) => s + (y - pred(x)) ** 2, 0) / datos.length;

  // SVG dimensions
  const W = 320, H = 220, PAD = 30;
  const xMin = 9, xMax = 41, yMin = 10, yMax = 82;
  const sx = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  const lineX1 = 10, lineX2 = 40;

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo interactiva — Ajuste de recta por OLS</p>

      {/* SVG plot */}
      <div className="bg-black/40 rounded-xl border border-white/10 mb-4 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 230 }}>
          {/* Grid */}
          {[20,30,40,50,60,70].map(y => (
            <line key={y} x1={PAD} y1={sy(y)} x2={W-PAD} y2={sy(y)}
              stroke="#ffffff08" strokeWidth="1" />
          ))}
          {[10,15,20,25,30,35,40].map(x => (
            <line key={x} x1={sx(x)} y1={PAD} x2={sx(x)} y2={H-PAD}
              stroke="#ffffff08" strokeWidth="1" />
          ))}

          {/* Residuos */}
          {mostrarResiduos && datos.map(([x, y], i) => (
            <line key={i}
              x1={sx(x)} y1={sy(y)} x2={sx(x)} y2={sy(pred(x))}
              stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
          ))}

          {/* Recta de regresión */}
          <line
            x1={sx(lineX1)} y1={sy(pred(lineX1))}
            x2={sx(lineX2)} y2={sy(pred(lineX2))}
            stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />

          {/* Puntos */}
          {datos.map(([x, y], i) => (
            <circle key={i} cx={sx(x)} cy={sy(y)} r="4"
              fill="#0ea5e9" opacity="0.8" />
          ))}

          {/* Ejes labels */}
          <text x={W/2} y={H-4} fill="#ffffff30" fontSize="9" textAnchor="middle">Llamadas de ventas</text>
          <text x={10} y={H/2} fill="#ffffff30" fontSize="9" textAnchor="middle"
            transform={`rotate(-90, 10, ${H/2})`}>Ventas</text>
        </svg>
      </div>

      {/* Controles */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-mono">Ruido adicional</span>
            <span className="text-amber-300 font-bold font-mono">noise = {noise}</span>
          </div>
          <input type="range" min={0} max={40} value={noise}
            onChange={e => setNoise(Number(e.target.value))}
            className="w-full accent-sky-500" />
        </div>
        <button
          onClick={() => setMostrarResiduos(r => !r)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            mostrarResiduos
              ? "border-amber-400/60 bg-amber-500/20 text-amber-300"
              : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
          {mostrarResiduos ? "✓ Ocultar residuos" : "Mostrar residuos εᵢ"}
        </button>
      </div>

      {/* Coeficientes resultado */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"β₀ (intercepto)", val:beta0.toFixed(4), color:"violet",  desc:"Intersección con eje Y" },
          { label:"β₁ (pendiente)",  val:beta1.toFixed(4), color:"emerald", desc:"Ventas por llamada" },
          { label:"MSE",             val:mse.toFixed(2),   color:"amber",   desc:"Error cuadrático medio" },
        ].map((item) => {
          const c = {
            violet:  { border:"border-violet-500/30", bg:"bg-violet-500/10", text:"text-violet-300" },
            emerald: { border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300" },
            amber:   { border:"border-amber-500/30",  bg:"bg-amber-500/10",  text:"text-amber-300" },
          }[item.color];
          return (
            <div key={item.label} className={`rounded-xl border ${c.border} ${c.bg} p-3`}>
              <p className="text-gray-500 text-xs mb-1">{item.label}</p>
              <p className={`text-lg font-black font-mono ${c.text}`}>{item.val}</p>
              <p className="text-gray-700 text-xs">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Demo: Pipeline animado del caso práctico ──────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, label:"Importar librerías",       icon:"📦", color:"sky",    code:"import pandas as pd\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression" },
    { id:1, label:"Cargar dataset",           icon:"📂", color:"violet", code:"df = pd.read_csv('datos/dataset.csv')\n# llamadas | ventas\n# 10.0     | 18.0  ..." },
    { id:2, label:"Split 70/30",              icon:"✂️",  color:"emerald",code:"datos_train = df.sample(frac=0.7, random_state=42)\ndatos_test  = df[~df.index.isin(datos_train.index)]" },
    { id:3, label:"Preparar matrices X, Y",   icon:"🔢", color:"amber",  code:"X = np.array(datos_train['llamadas'])[:,np.newaxis]\nY = np.array(datos_train['ventas'])[:,np.newaxis]" },
    { id:4, label:"OLS manual — β₁ y β₀",    icon:"🧮", color:"rose",   code:"beta1 = float(np.linalg.inv(X.T@X)@X.T@Y)\n# → 1.9606\nbeta0 = float(Y.mean() - beta1*X.mean())\n# → 0.2714" },
    { id:5, label:"sklearn LinearRegression", icon:"🤖", color:"sky",    code:"modelo = LinearRegression()\nmodelo.fit(X, Y)\n# coef_: 1.8758  intercept_: 2.3906" },
    { id:6, label:"Predecir en test",         icon:"🔮", color:"violet", code:"X_test = np.array(datos_test['llamadas'])[:,np.newaxis]\nprediccion = modelo.predict(X_test)" },
    { id:7, label:"Calcular ECM",             icon:"📊", color:"emerald",code:"def error(real, pred):\n    return np.sum((real-pred)**2)/len(real)\nerror(Y_test, prediccion)  # → 16.063" },
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
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Caso práctico: ventas vs llamadas</p>
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
export default function RegresionLineal({ onBack }) {
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
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-rose-900/8 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-violet-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo IV</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-sky-400" style={{ fontFamily:"monospace" }}>Regresión Lineal</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#0ea5e9", color:"#0ea5e9", fontFamily:"monospace" }}>
            📈 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Regresión{" "}
            <span style={{
              background:"linear-gradient(135deg, #0ea5e9, #f43f5e, #a855f7)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Lineal</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Modelo que establece la relación entre variables explicativas y una
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">variable continua</code>
            mediante la ecuación de una recta optimizada por
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">mínimos cuadrados (OLS)</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",     label:"📌 Introducción" },
            { href:"#modelo",    label:"🔢 Modelo general" },
            { href:"#hipotesis", label:"📋 Hipótesis" },
            { href:"#ols",       label:"🧮 OLS" },
            { href:"#demo",      label:"📊 Demo interactiva" },
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
          <SectionHeader icon="📌" title="Introducción" color="#0ea5e9" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            La <strong className="text-white">regresión lineal</strong> es un modelo matemático que busca establecer la relación de dependencia entre un conjunto de variables explicativas y una <strong className="text-white">variable respuesta continua</strong>. Es uno de los algoritmos más fundamentales de Machine Learning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold inline-block mb-3">Simple</span>
              <h3 className="text-white font-semibold text-base mb-2">Una variable explicativa</h3>
              <Formula color="sky">y = β₀ + β₁x</Formula>
              <p className="text-gray-500 text-xs leading-relaxed">
                Corresponde a la ecuación de una recta. <strong className="text-white">β₀</strong> es la intersección con el eje Y y <strong className="text-white">β₁</strong> la pendiente.
              </p>
              <p className="text-sky-600 text-xs mt-2 font-mono italic">Ej: ventas = β₀ + β₁ · llamadas</p>
            </div>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono font-bold inline-block mb-3">Múltiple</span>
              <h3 className="text-white font-semibold text-base mb-2">Varias variables explicativas</h3>
              <Formula color="violet">y = β₀ + β₁x₁ + β₂x₂ + … + βₙxₙ + ε</Formula>
              <p className="text-gray-500 text-xs leading-relaxed">
                Generaliza la recta a un hiperplano en espacio n-dimensional. Cada βᵢ mide la influencia de xᵢ sobre y.
              </p>
              <p className="text-violet-600 text-xs mt-2 font-mono italic">Ej: precio = β₀ + β₁·m² + β₂·habitaciones + …</p>
            </div>
          </div>

          <Tip color="sky">
            La meta del modelo es <strong>aprender los valores de β₀ y β₁</strong> que mejor describen la relación entre las variables, para luego predecir valores fuera del conjunto de entrenamiento.
          </Tip>
        </section>

        {/* ══ 2. MODELO GENERAL ════════════════════════════════ */}
        <section id="modelo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🔢" title="Modelo General" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El modelo de regresión lineal múltiple extiende la recta simple a n variables explicativas:
          </p>
          <Formula color="violet">y = β₀ + β₁x₁ + β₂x₂ + … + βₙxₙ + ε</Formula>

          <div className="space-y-2 mb-5">
            {[
              { sym:"y",          desc:"Variable objetivo, target o respuesta. Lo que queremos predecir.",              color:"rose" },
              { sym:"x₁…xₙ",     desc:"Variables independientes, explicativas o regresoras (los features del modelo).", color:"sky" },
              { sym:"β₀",         desc:"Término independiente — valor de y cuando todas las x son cero.",               color:"emerald" },
              { sym:"β₁…βₙ",     desc:"Coeficientes que miden la influencia de cada variable xᵢ sobre y.",             color:"violet" },
              { sym:"ε",          desc:"Error o perturbación — la parte de y que el modelo no puede explicar.",         color:"amber" },
            ].map((item) => {
              const col = {
                rose:"text-rose-300 bg-rose-500/10 border-rose-500/20",
                sky:"text-sky-300 bg-sky-500/10 border-sky-500/20",
                emerald:"text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
                violet:"text-violet-300 bg-violet-500/10 border-violet-500/20",
                amber:"text-amber-300 bg-amber-500/10 border-amber-500/20",
              }[item.color];
              return (
                <div key={item.sym} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <code className={`text-sm font-black px-2 py-0.5 rounded border font-mono whitespace-nowrap ${col}`}>{item.sym}</code>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 3. HIPÓTESIS ═════════════════════════════════════ */}
        <section id="hipotesis" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="📋" title="Hipótesis del Modelo" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Para que la regresión lineal sea válida, los datos deben cumplir cuatro supuestos fundamentales. Violarlos puede invalidar las predicciones.
          </p>

          <div className="space-y-4">
            {[
              {
                num:"01", icon:"📏", title:"Linealidad", color:"sky",
                desc:"La variable objetivo y está generada por una combinación lineal de las variables explicativas.",
                formula:"y = β₀ + β₁x₁ + … + βₙxₙ + ε",
                tip:"Verifica con gráficas de residuos vs predicciones. Si ves patrones curvos, el supuesto se viola.",
              },
              {
                num:"02", icon:"🔗", title:"Independencia lineal", color:"violet",
                desc:"No debe existir relación lineal entre las variables explicativas entre sí (multicolinealidad).",
                formula:"Corr(xᵢ, xⱼ) ≈ 0   para todo i ≠ j",
                tip:"Detecta con la matriz de correlación. Correlaciones > 0.9 entre features son problemáticas.",
              },
              {
                num:"03", icon:"⚖️", title:"Homocedasticidad", color:"emerald",
                desc:"Todos los residuos tienen la misma varianza, independientemente del valor de x.",
                formula:"Var(εᵢ) = σ²   (constante para todo i)",
                tip:"Si la varianza de los residuos aumenta con ŷ, hay heterocedasticidad. Considera transformar y.",
              },
              {
                num:"04", icon:"🔔", title:"Normalidad de errores", color:"amber",
                desc:"Los residuos siguen una distribución normal con media cero.",
                formula:"ε ~ N(0, σ²)",
                tip:"Verifica con un Q-Q plot de los residuos o el test de Shapiro-Wilk.",
              },
            ].map((h) => (
              <StepCard key={h.num} num={h.num} icon={h.icon} title={h.title} color={h.color}>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{h.desc}</p>
                <Formula color={h.color}>{h.formula}</Formula>
                <Tip color={h.color}>{h.tip}</Tip>
              </StepCard>
            ))}
          </div>
        </section>

        {/* ══ 4. OLS ═══════════════════════════════════════════ */}
        <section id="ols" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="🧮" title="Mínimos Cuadrados Ordinarios (OLS)" color="#f43f5e" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El método <strong className="text-white">OLS (Ordinary Least Squares)</strong> estima los coeficientes β minimizando la suma de los cuadrados de los residuos entre los valores reales y los predichos.
          </p>

          <div className="space-y-4">
            <StepCard num="01" icon="🎯" title="Función objetivo" color="rose">
              <p className="text-gray-500 text-sm mb-3">Minimizar la suma total de errores al cuadrado (SSE):</p>
              <Formula color="rose">L(β̂₀, β̂₁) = min Σᵢ εᵢ² = Σᵢ (yᵢ − β̂₀ − β̂₁xᵢ)²</Formula>
            </StepCard>

            <StepCard num="02" icon="∂" title="Condiciones de primer orden" color="amber">
              <p className="text-gray-500 text-sm mb-3">Se deriva L respecto a β̂₀ y β̂₁ e iguala a cero:</p>
              <div className="bg-black/40 rounded-xl border border-white/10 p-4 mb-3 font-mono text-xs text-gray-300 leading-relaxed">
                <p>∂L/∂β̂₀ = −2 Σ(yᵢ − β̂₀ − β̂₁xᵢ) = 0</p>
                <p className="mt-1">∂L/∂β̂₁ = −2 Σ(yᵢ − β̂₀ − β̂₁xᵢ)xᵢ = 0</p>
              </div>
            </StepCard>

            <StepCard num="03" icon="✅" title="Solución analítica" color="emerald">
              <p className="text-gray-500 text-sm mb-3">Resolviendo el sistema de ecuaciones se obtiene la solución cerrada:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 font-mono text-center">
                  <p className="text-gray-500 text-xs mb-1">Pendiente</p>
                  <p className="text-emerald-300 text-sm">β̂₁ = Cov(x,y) / Var(x)</p>
                  <p className="text-gray-600 text-xs mt-1">= (XᵀX)⁻¹Xᵀy</p>
                </div>
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 font-mono text-center">
                  <p className="text-gray-500 text-xs mb-1">Intercepto</p>
                  <p className="text-sky-300 text-sm">β̂₀ = ȳ − β̂₁x̄</p>
                  <p className="text-gray-600 text-xs mt-1">donde ȳ, x̄ = medias</p>
                </div>
              </div>
              <CodeBlock>
                <p className="text-gray-500"># OLS manual con NumPy</p>
                <p><span className="text-emerald-400">beta1</span><span className="text-white"> = </span><span className="text-violet-400">float</span><span className="text-white">(np.linalg.inv(X.T @ X) @ X.T @ Y)</span></p>
                <p className="text-gray-500"># → 1.9606</p>
                <p><span className="text-emerald-400">beta0</span><span className="text-white"> = </span><span className="text-violet-400">float</span><span className="text-white">(Y.mean() - beta1 * X.mean())</span></p>
                <p className="text-gray-500"># → 0.2714</p>
              </CodeBlock>
            </StepCard>
          </div>

          <div className="mt-5">
            <Tip color="rose">
              OLS produce los estimadores <strong>BLUE</strong> (Best Linear Unbiased Estimators) cuando se cumplen las 4 hipótesis — esto lo garantiza el <strong>Teorema de Gauss-Markov</strong>.
            </Tip>
          </div>
        </section>

        {/* ══ 5. DEMO INTERACTIVA ══════════════════════════════ */}
        <section id="demo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="📊" title="Demo Interactiva" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Visualización en tiempo real del ajuste OLS sobre el dataset del notebook (llamadas de ventas → unidades vendidas). Ajusta el ruido y activa los residuos εᵢ para ver cómo cambian los coeficientes.
          </p>
          <RegresionDemo />
          <div className="mt-5">
            <Tip color="emerald">
              Al aumentar el ruido verás que β₁ y β₀ cambian y el MSE sube. Los <strong>residuos (líneas amarillas)</strong> representan los εᵢ que OLS minimiza.
            </Tip>
          </div>
        </section>

        {/* ══ 6. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Ventas vs Llamadas" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El notebook analiza la relación entre el <strong className="text-white">número de llamadas de ventas</strong> y las <strong className="text-white">unidades vendidas</strong> en una empresa de equipos. Se implementa OLS manualmente y luego con sklearn.
          </p>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-6">
            <p className="text-violet-300 text-xs font-bold mb-3">Planteamiento del modelo</p>
            <Formula color="violet">nro_ventas = β₀ + β₁ · (nro_llamadas)</Formula>
            <p className="text-gray-500 text-sm">Los vendedores que hacen más llamadas logran más ventas, pero la relación <strong className="text-white">no es perfecta</strong> — hay variabilidad no explicada (ε).</p>
          </div>

          <PipelineDemo />

          <div className="mt-6">
            <p className="text-white font-semibold mb-4">Resultados del notebook</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label:"β₁ (OLS manual)",  val:"1.9606",  sub:"pendiente",         color:"emerald" },
                { label:"β₀ (OLS manual)",  val:"0.2714",  sub:"intercepto",         color:"sky" },
                { label:"β₁ (sklearn)",     val:"1.8758",  sub:"modelo.coef_",       color:"violet" },
                { label:"ECM final",        val:"16.063",  sub:"error cuadrático",   color:"rose" },
              ].map((m) => {
                const c = {
                  emerald:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",muted:"text-emerald-700" },
                  sky:    { border:"border-sky-500/30",    bg:"bg-sky-500/10",    text:"text-sky-300",    muted:"text-sky-700" },
                  violet: { border:"border-violet-500/30", bg:"bg-violet-500/10", text:"text-violet-300", muted:"text-violet-700" },
                  rose:   { border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300",   muted:"text-rose-700" },
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

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-white text-sm font-semibold mb-4">Código completo con sklearn</p>
              <CodeBlock>
                <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.linear_model </span><span className="text-sky-400">import</span><span className="text-white"> LinearRegression</span></p>
                <p className="mt-1 text-gray-500"># Preparar datos</p>
                <p><span className="text-emerald-400">X</span><span className="text-white"> = np.array(datos_train[</span><span className="text-green-300">'llamadas'</span><span className="text-white">])[:,np.newaxis]</span></p>
                <p><span className="text-emerald-400">Y</span><span className="text-white"> = np.array(datos_train[</span><span className="text-green-300">'ventas'</span><span className="text-white">])[:,np.newaxis]</span></p>
                <p className="mt-1 text-gray-500"># Entrenar</p>
                <p><span className="text-emerald-400">modelo</span><span className="text-white"> = LinearRegression().fit(X, Y)</span></p>
                <p><span className="text-violet-400">print</span><span className="text-white">(modelo.coef_)</span><span className="text-gray-500 ml-2">       # → 1.8758 (β₁)</span></p>
                <p><span className="text-violet-400">print</span><span className="text-white">(modelo.intercept_)</span><span className="text-gray-500 ml-2">  # → 2.3906 (β₀)</span></p>
                <p className="mt-1 text-gray-500"># Predecir y evaluar</p>
                <p><span className="text-emerald-400">prediccion</span><span className="text-white"> = modelo.predict(X_test)</span></p>
                <p><span className="text-emerald-400">ecm</span><span className="text-white"> = error(Y_test, prediccion)</span><span className="text-gray-500 ml-2"># → 16.063</span></p>
              </CodeBlock>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-amber-300 text-xs font-bold mb-2">Tabla de predicciones (primeras 5 filas)</p>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-gray-600 text-left pb-2 font-normal">índice</th>
                      <th className="text-sky-400 text-right pb-2 font-normal">valor real</th>
                      <th className="text-violet-400 text-right pb-2 font-normal">predicción</th>
                      <th className="text-amber-400 text-right pb-2 font-normal">|error|</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [2,  28.0, 23.80],
                      [7,  27.0, 29.68],
                      [10, 29.0, 33.60],
                      [14, 38.0, 37.52],
                      [18, 41.0, 43.40],
                    ].map(([idx, real, pred]) => (
                      <tr key={idx} className="border-b border-white/5">
                        <td className="text-gray-600 py-1.5">{idx}</td>
                        <td className="text-sky-300 text-right py-1.5">{real.toFixed(1)}</td>
                        <td className="text-violet-300 text-right py-1.5">{pred.toFixed(2)}</td>
                        <td className="text-amber-300 text-right py-1.5">{Math.abs(real - pred).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"Regresión simple",  desc:"y = β₀ + β₁x. Una variable explicativa. El caso más básico: recta en 2D.",                              color:"#0ea5e9" },
              { label:"Regresión múltiple",desc:"y = β₀ + β₁x₁ + … + βₙxₙ + ε. Hiperplano en espacio n-dimensional.",                                   color:"#a855f7" },
              { label:"OLS",               desc:"Minimiza Σεᵢ². Solución: β̂₁ = Cov(x,y)/Var(x), β̂₀ = ȳ − β̂₁x̄. Garantiza BLUE (Gauss-Markov).",     color:"#f43f5e" },
              { label:"4 Hipótesis",       desc:"Linealidad, independencia, homocedasticidad y normalidad de errores. Verificar antes de confiar en el modelo.", color:"#f59e0b" },
              { label:"sklearn",           desc:"LinearRegression().fit(X, y). Coeficientes en .coef_ e .intercept_. ECM con función manual o metrics.mse.", color:"#10b981" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · Regresión Lineal</span>
        </div>

      </div>
    </div>
  );
}