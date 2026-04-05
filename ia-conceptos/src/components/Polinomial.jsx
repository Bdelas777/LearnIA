import { useState, useMemo } from "react";

// ── Demo: Ajuste polinomial interactivo ───────────────────────────
function PolinomialDemo() {
  const [degree, setDegree] = useState(3);
  const [noise,  setNoise]  = useState(40);
  const [mostrarLineal, setMostrarLineal] = useState(false);

  // Genera datos sintéticos: y = -100 - 5x + 5x² + 0.1x³ + ruido
  const { puntos, xArr } = useMemo(() => {
    const xs = Array.from({ length: 60 }, (_, i) => -50 + i * (100 / 59));
    const seed = 42;
    const pseudoRand = (i) => (((i * 1664525 + seed * 1013904223) & 0xffffffff) / 0xffffffff - 0.5) * 2;
    const ys = xs.map((x, i) => -100 - 5 * x + 5 * x ** 2 + 0.1 * x ** 3 + noise * 80 * pseudoRand(i));
    return { puntos: xs.map((x, i) => [x, ys[i]]), xArr: xs };
  }, [noise]);

  // Ajuste polinomial por OLS usando Vandermonde
  const { coefs, yCurve } = useMemo(() => {
    const n = puntos.length;
    const deg = degree;

    // Construir matriz de Vandermonde
    const V = puntos.map(([x]) => Array.from({ length: deg + 1 }, (_, k) => x ** k));
    const y = puntos.map(([, yi]) => yi);

    // Resolver (VᵀV)β = Vᵀy mediante pseudoinversa simplificada
    // Usando descomposición normal mínima (para demo educativa)
    try {
      const VT = V[0].map((_, c) => V.map((r) => r[c]));
      const VTV = VT.map((row) => V[0].map((_, c) => row.reduce((s, v, k) => s + v * V[k][c], 0)));
      const VTy = VT.map((row) => row.reduce((s, v, k) => s + v * y[k], 0));

      // Gauss-Jordan para resolver VTV * beta = VTy
      const aug = VTV.map((row, i) => [...row, VTy[i]]);
      const d = deg + 1;
      for (let col = 0; col < d; col++) {
        let maxRow = col;
        for (let r = col + 1; r < d; r++) if (Math.abs(aug[r][col]) > Math.abs(aug[maxRow][col])) maxRow = r;
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
        const pivot = aug[col][col];
        if (Math.abs(pivot) < 1e-10) continue;
        for (let r = 0; r < d; r++) {
          if (r === col) continue;
          const factor = aug[r][col] / pivot;
          for (let c = col; c <= d; c++) aug[r][c] -= factor * aug[col][c];
        }
        for (let c = col; c <= d; c++) aug[col][c] /= pivot;
      }
      const coefs = aug.map((row) => row[d]);

      const yCurve = xArr.map((x) => coefs.reduce((s, c, k) => s + c * x ** k, 0));
      return { coefs, yCurve };
    } catch {
      return { coefs: [], yCurve: xArr.map(() => 0) };
    }
  }, [puntos, degree, xArr]);

  // Línea lineal de referencia (grado 1)
  const { coefs: coefsL, yCurveL } = useMemo(() => {
    const n = puntos.length;
    const xs = puntos.map(([x]) => x);
    const ys = puntos.map(([, y]) => y);
    const xm = xs.reduce((s, v) => s + v, 0) / n;
    const ym = ys.reduce((s, v) => s + v, 0) / n;
    const b1 = xs.reduce((s, x, i) => s + (x - xm) * (ys[i] - ym), 0) / xs.reduce((s, x) => s + (x - xm) ** 2, 0);
    const b0 = ym - b1 * xm;
    return { coefs: [b0, b1], yCurveL: xArr.map((x) => b0 + b1 * x) };
  }, [puntos, xArr]);

  // MSE del polinomio ajustado
  const mse = useMemo(() => {
    if (!yCurve.length) return 0;
    return puntos.reduce((s, [x, y], i) => {
      const xi = xArr.findIndex((v) => Math.abs(v - x) < 0.01);
      return s + (y - yCurve[xi >= 0 ? xi : i]) ** 2;
    }, 0) / puntos.length;
  }, [puntos, yCurve, xArr]);

  const r2 = useMemo(() => {
    const ym = puntos.reduce((s, [, y]) => s + y, 0) / puntos.length;
    const ssTot = puntos.reduce((s, [, y]) => s + (y - ym) ** 2, 0);
    const ssRes = puntos.reduce((s, [x, y], i) => {
      const xi = xArr.findIndex((v) => Math.abs(v - x) < 0.01);
      return s + (y - yCurve[xi >= 0 ? xi : i]) ** 2;
    }, 0);
    return ssTot > 0 ? 1 - ssRes / ssTot : 1;
  }, [puntos, yCurve, xArr]);

  // SVG
  const W = 340, H = 220, PAD = 28;
  const yAll = [...puntos.map(([, y]) => y), ...yCurve];
  const xMin = -52, xMax = 52;
  const yMin = Math.min(...yAll) - 500;
  const yMax = Math.max(...yAll) + 500;
  const sx = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  const curvePath = xArr.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${Math.max(PAD, Math.min(H - PAD, sy(yCurve[i]))).toFixed(1)}`).join(" ");
  const linePath  = xArr.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${Math.max(PAD, Math.min(H - PAD, sy(yCurveL[i]))).toFixed(1)}`).join(" ");

  const degColor = { 1:"#0ea5e9", 2:"#a855f7", 3:"#f43f5e", 4:"#f59e0b", 5:"#10b981" };

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo interactiva — Ajuste polinomial</p>

      {/* SVG Plot */}
      <div className="bg-black/40 rounded-xl border border-white/10 mb-4 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
          {/* Grid */}
          {[-40,-20,0,20,40].map(x => (
            <line key={x} x1={sx(x)} y1={PAD} x2={sx(x)} y2={H-PAD} stroke="#ffffff06" strokeWidth="1"/>
          ))}
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H-PAD} stroke="#ffffff15" strokeWidth="1"/>
          <line x1={PAD} y1={sy(0)} x2={W-PAD} y2={sy(0)} stroke="#ffffff15" strokeWidth="1"/>

          {/* Lineal de referencia */}
          {mostrarLineal && <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5"/>}

          {/* Curva polinomial */}
          <path d={curvePath} fill="none" stroke={degColor[degree] || "#f43f5e"} strokeWidth="2.5" strokeLinecap="round"/>

          {/* Puntos */}
          {puntos.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
            <circle key={i} cx={sx(x)} cy={Math.max(PAD, Math.min(H-PAD, sy(y)))} r="2.5"
              fill="#94a3b8" opacity="0.7"/>
          ))}

          {/* Labels */}
          <text x={W/2} y={H-6} fill="#ffffff25" fontSize="8" textAnchor="middle">x (−50 a 50)</text>
          <text x={8}   y={H/2} fill="#ffffff25" fontSize="8" textAnchor="middle" transform={`rotate(-90,8,${H/2})`}>y</text>
        </svg>
      </div>

      {/* Controles */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-mono">Grado del polinomio</span>
            <span className="font-bold font-mono text-sm" style={{ color: degColor[degree] || "#f43f5e" }}>degree = {degree}</span>
          </div>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(d => (
              <button key={d} onClick={() => setDegree(d)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-all duration-200 font-mono ${
                  degree === d ? "border-white/30 bg-white/10 text-white font-bold" : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-mono">Ruido gaussiano</span>
            <span className="text-amber-300 font-bold font-mono">σ ~ {noise}</span>
          </div>
          <input type="range" min={0} max={80} value={noise}
            onChange={e => setNoise(Number(e.target.value))}
            className="w-full accent-violet-500"/>
        </div>

        <button onClick={() => setMostrarLineal(v => !v)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            mostrarLineal ? "border-sky-400/60 bg-sky-500/20 text-sky-300" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
          {mostrarLineal ? "✓ Ocultar recta lineal (grado 1)" : "Comparar con recta lineal"}
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Grado",    val:degree,                       color:"violet", sub:"PolynomialFeatures" },
          { label:"R²",       val:r2.toFixed(4),               color:"emerald",sub:"coeficiente ajuste" },
          { label:"RMSE",     val:Math.sqrt(mse).toFixed(1),   color:"rose",   sub:"raíz error cuadrático" },
        ].map((m) => {
          const c = {
            violet:  { border:"border-violet-500/30", bg:"bg-violet-500/10", text:"text-violet-300" },
            emerald: { border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300" },
            rose:    { border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300" },
          }[m.color];
          return (
            <div key={m.label} className={`rounded-xl border ${c.border} ${c.bg} p-3 text-center`}>
              <p className="text-gray-500 text-xs mb-1">{m.label}</p>
              <p className={`text-xl font-black font-mono ${c.text}`}>{m.val}</p>
              <p className="text-gray-700 text-xs">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Ecuación generada */}
      {coefs.length > 0 && (
        <div className="mt-3 bg-black/30 rounded-lg px-4 py-3 font-mono text-xs text-gray-400">
          <span className="text-gray-600">ŷ = </span>
          {coefs.map((c, k) => (
            <span key={k}>
              <span className={k === 0 ? "text-sky-300" : k === 1 ? "text-violet-300" : k === 2 ? "text-rose-300" : k === 3 ? "text-amber-300" : "text-emerald-300"}>
                {c >= 0 && k > 0 ? "+" : ""}{c.toFixed(2)}{k > 0 ? `x${k > 1 ? `^${k}` : ""}` : ""}
              </span>{" "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Demo: Pipeline animado ────────────────────────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, label:"Importar librerías",          icon:"📦", color:"sky",    code:"from sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.metrics import mean_squared_error" },
    { id:1, label:"Generar datos sintéticos",    icon:"🎲", color:"violet", code:"x = np.linspace(-50, 50, 500)\ny = -100 - 5*x + 5*x**2 + 0.1*x**3\n    + 800*np.random.randn(500)" },
    { id:2, label:"Crear features polinómicas",  icon:"🔢", color:"emerald",code:"pf = PolynomialFeatures(degree=3)\nX  = pf.fit_transform(x.reshape(-1,1))\nX.shape  # → (500, 4)" },
    { id:3, label:"Ajustar LinearRegression",    icon:"📈", color:"amber",  code:"modelo = LinearRegression()\nmodelo.fit(X, y)\n# LinearRegression()" },
    { id:4, label:"Coeficientes del modelo",     icon:"🧮", color:"rose",   code:"print(modelo.coef_)\n# → [0.  -2.20  5.05  0.098]\nprint(modelo.intercept_)\n# → -101.21" },
    { id:5, label:"Predecir y graficar",         icon:"🔮", color:"sky",    code:"pred = modelo.predict(X)\nplt.scatter(x, y, marker='+')\nplt.plot(x, pred, 'r')" },
    { id:6, label:"Evaluar métricas",            icon:"📊", color:"emerald",code:"mse  = mean_squared_error(y, pred)\n# → 609,849\nrmse = np.sqrt(mse)   # → 780.93\nr2   = modelo.score(X, y)  # → 0.9832" },
  ];

  const colorMap = {
    sky:    { border:"border-sky-500/40",    bg:"bg-sky-500/15",    text:"text-sky-300",    dot:"bg-sky-400" },
    violet: { border:"border-violet-500/40", bg:"bg-violet-500/15", text:"text-violet-300", dot:"bg-violet-400" },
    emerald:{ border:"border-emerald-500/40",bg:"bg-emerald-500/15",text:"text-emerald-300",dot:"bg-emerald-400" },
    amber:  { border:"border-amber-500/40",  bg:"bg-amber-500/15",  text:"text-amber-300",  dot:"bg-amber-400" },
    rose:   { border:"border-rose-500/40",   bg:"bg-rose-500/15",   text:"text-rose-300",   dot:"bg-rose-400" },
  };

  const [current, setCurrent] = useState(-1);
  const [running, setRunning] = useState(false);

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
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Caso práctico: función cúbica sintética</p>
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

// ── Página principal ──────────────────────────────────────────────
export default function RegresionPolinomial({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-violet-900/12 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-rose-900/8 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-emerald-900/8 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo IV</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily:"monospace" }}>Regresión Polinomial</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#a855f7", color:"#a855f7", fontFamily:"monospace" }}>
            📐 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Regresión{" "}
            <span style={{
              background:"linear-gradient(135deg, #a855f7, #f43f5e, #f59e0b)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Polinomial</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Extensión de la regresión lineal que ajusta curvas a datos no lineales expandiendo los atributos con
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">PolynomialFeatures</code>
            y aplicando
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">LinearRegression</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",     label:"📌 Introducción" },
            { href:"#como",      label:"🔢 ¿Cómo funciona?" },
            { href:"#expansion", label:"🧩 Expansión de features" },
            { href:"#demo",      label:"📊 Demo interactiva" },
            { href:"#practica",  label:"🧪 Práctica" },
            { href:"#grado",     label:"⚠️ Elección del grado" },
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
            La <strong className="text-white">Regresión Polinomial</strong> es, en realidad, una regresión lineal como la vista previamente — solo que ahora calculamos <strong className="text-white">atributos polinómicos</strong> de las variables originales y luego aplicamos regresión lineal sobre ese espacio expandido.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
              <p className="text-sky-300 text-xs font-bold mb-3">Regresión Lineal</p>
              <Formula color="sky">y = β₀ + β₁x</Formula>
              <p className="text-gray-500 text-xs leading-relaxed">Solo modela relaciones <strong className="text-white">rectas</strong>. Falla cuando los datos tienen forma curva, parabólica o más compleja.</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 font-mono">
                <span>features:</span><span className="text-sky-400">[1, x]</span>
              </div>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <p className="text-violet-300 text-xs font-bold mb-3">Regresión Polinomial (grado 3)</p>
              <Formula color="violet">y = β₀ + β₁x + β₂x² + β₃x³</Formula>
              <p className="text-gray-500 text-xs leading-relaxed">Modela relaciones <strong className="text-white">curvas</strong>. Añade potencias de x como nuevas variables — el modelo sigue siendo lineal en los parámetros β.</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 font-mono">
                <span>features:</span><span className="text-violet-400">[1, x, x², x³]</span>
              </div>
            </div>
          </div>

          <Tip color="violet">
            Aunque el modelo ajusta <strong>curvas</strong>, sigue siendo "lineal" porque es lineal en los coeficientes β. Por eso se puede resolver con <code>LinearRegression</code> de sklearn.
          </Tip>
        </section>

        {/* ══ 2. CÓMO FUNCIONA ═════════════════════════════════ */}
        <section id="como" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🔢" title="¿Cómo hacer regresión polinomial?" color="#0ea5e9" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Sklearn hace el proceso en dos pasos bien definidos que se pueden combinar en un Pipeline:
          </p>

          <div className="space-y-4 mb-5">
            {[
              {
                step:"01", icon:"🔢", title:"PolynomialFeatures — expandir el espacio",
                color:"violet",
                desc:"Transforma el vector de features X generando todas las potencias hasta el grado indicado.",
                code: <>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.preprocessing </span><span className="text-sky-400">import</span><span className="text-white"> PolynomialFeatures</span></p>
                  <p><span className="text-emerald-400">pf</span><span className="text-white"> = PolynomialFeatures(degree=</span><span className="text-amber-300">3</span><span className="text-white">)</span></p>
                  <p><span className="text-emerald-400">X</span><span className="text-white"> = pf.fit_transform(x.reshape(-</span><span className="text-amber-300">1</span><span className="text-white">, </span><span className="text-amber-300">1</span><span className="text-white">))</span></p>
                  <p className="text-gray-500"># X.shape → (500, 4)  columnas: [1, x, x², x³]</p>
                </>,
              },
              {
                step:"02", icon:"📈", title:"LinearRegression — ajustar sobre X expandido",
                color:"emerald",
                desc:"Con las features polinómicas listas, aplica regresión lineal normal. Los coeficientes resultantes son los βᵢ del polinomio.",
                code: <>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.linear_model </span><span className="text-sky-400">import</span><span className="text-white"> LinearRegression</span></p>
                  <p><span className="text-emerald-400">modelo</span><span className="text-white"> = LinearRegression()</span></p>
                  <p><span className="text-emerald-400">modelo</span><span className="text-white">.fit(X, y)</span><span className="text-gray-500 ml-2"># X ya tiene columnas [1, x, x², x³]</span></p>
                </>,
              },
            ].map((item) => {
              const c = {
                violet:  { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300", step:"text-violet-500/25" },
                emerald: { border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",step:"text-emerald-500/25" },
              }[item.color];
              return (
                <div key={item.step} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                  <div className="flex items-start gap-4">
                    <span className={`text-4xl font-black leading-none flex-shrink-0 ${c.step}`} style={{ fontFamily:"monospace" }}>{item.step}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{item.icon}</span>
                        <h3 className={`font-bold text-base ${c.text}`}>{item.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
                      <CodeBlock>{item.code}</CodeBlock>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 3. EXPANSIÓN DE FEATURES ═════════════════════════ */}
        <section id="expansion" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="🧩" title="Expansión Polinómica de Features" color="#f59e0b" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Para un vector de atributos X = (x₀, x₁, …, xₙ), la expansión polinómica genera todas las potencias hasta el grado d:
          </p>

          <Formula color="amber">X_pol = (x₀, x₁, x₁², x₂, x₂², …, xₙ, xₙⁿ)</Formula>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 mb-5">
            <p className="text-amber-300 text-xs font-bold mb-3">Ejemplo con una sola variable x — diferentes grados</p>
            <div className="space-y-3">
              {[
                { deg:1, cols:["1", "x"],           n:2,  color:"sky" },
                { deg:2, cols:["1", "x", "x²"],     n:3,  color:"violet" },
                { deg:3, cols:["1", "x", "x²", "x³"],n:4, color:"rose" },
                { deg:4, cols:["1", "x", "x²", "x³", "x⁴"],n:5,color:"amber" },
              ].map((row) => {
                const col = {
                  sky:"text-sky-300 bg-sky-500/10 border-sky-500/20",
                  violet:"text-violet-300 bg-violet-500/10 border-violet-500/20",
                  rose:"text-rose-300 bg-rose-500/10 border-rose-500/20",
                  amber:"text-amber-300 bg-amber-500/10 border-amber-500/20",
                }[row.color];
                return (
                  <div key={row.deg} className="flex items-center gap-3">
                    <code className={`text-xs px-2 py-0.5 rounded border font-mono whitespace-nowrap ${col}`}>degree={row.deg}</code>
                    <div className="flex gap-1.5 flex-wrap">
                      {row.cols.map((c) => (
                        <span key={c} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">{c}</span>
                      ))}
                    </div>
                    <span className="text-gray-600 text-xs font-mono ml-auto">→ {row.n} cols</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Tip color="amber">
            Con <code>n</code> features y grado <code>d</code>, el número de columnas resultantes crece como C(n+d, d). Con muchas features y grado alto, la matriz puede volverse enorme — cuidado con el <strong>maldición de la dimensionalidad</strong>.
          </Tip>
        </section>

        {/* ══ 4. DEMO INTERACTIVA ══════════════════════════════ */}
        <section id="demo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="📊" title="Demo Interactiva" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Ajusta el grado del polinomio (1–5) sobre datos generados por la función cúbica del notebook. Compara cómo cada grado captura la curvatura de los datos y observa el impacto en R² y RMSE.
          </p>
          <PolinomialDemo />
          <div className="mt-5">
            <Tip color="emerald">
              Grado 1 = recta (subajuste). Grado 3 = ajuste perfecto para esta función. Grados 4–5 con poco ruido pueden hacer <strong>overfitting</strong>.
            </Tip>
          </div>
        </section>

        {/* ══ 5. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Función cúbica sintética" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El notebook genera datos a partir de una función cúbica con ruido gaussiano y ajusta un polinomio de grado 3 usando sklearn.
          </p>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-6">
            <p className="text-violet-300 text-xs font-bold mb-2">Función generadora de datos</p>
            <Formula color="violet">y = −100 − 5x + 5x² + 0.1x³ + N(0, 800)</Formula>
            <p className="text-gray-500 text-xs">500 muestras con x ∈ [−50, 50] y ruido gaussiano σ=800</p>
          </div>

          <PipelineDemo />

          <div className="mt-6">
            <p className="text-white font-semibold mb-4">Ecuación ajustada y resultados</p>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 mb-4">
              <p className="text-rose-300 text-xs font-bold mb-2">Polinomio de regresión ajustado (grado 3)</p>
              <Formula color="rose">ŷ = −101.21 − 2.20x + 5.05x² + 0.09x³</Formula>
              <div className="flex flex-wrap gap-3 font-mono text-xs">
                {[
                  { sym:"β₀ = −101.21", desc:"intercepto",   color:"sky" },
                  { sym:"β₁ = −2.20",   desc:"coef. de x",   color:"violet" },
                  { sym:"β₂ = 5.05",    desc:"coef. de x²",  color:"rose" },
                  { sym:"β₃ = 0.09",    desc:"coef. de x³",  color:"amber" },
                ].map((p) => {
                  const col = { sky:"text-sky-300", violet:"text-violet-300", rose:"text-rose-300", amber:"text-amber-300" }[p.color];
                  return (
                    <div key={p.sym} className="bg-black/30 rounded-lg px-3 py-2">
                      <p className={`font-bold ${col}`}>{p.sym}</p>
                      <p className="text-gray-600 text-xs">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label:"MSE",   val:"609,849", sub:"mean_squared_error",  color:"amber" },
                { label:"RMSE",  val:"780.93",  sub:"≈ ruido σ=800 ✓",    color:"rose" },
                { label:"R²",    val:"0.9832",  sub:"modelo.score(X, y)",  color:"emerald" },
              ].map((m) => {
                const c = {
                  amber:  { border:"border-amber-500/30",  bg:"bg-amber-500/10",  text:"text-amber-300",  muted:"text-amber-700" },
                  rose:   { border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300",   muted:"text-rose-700" },
                  emerald:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",muted:"text-emerald-700" },
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

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-4">
              <p className="text-emerald-300 text-xs font-bold mb-3">Interpretación de resultados</p>
              <ul className="space-y-2">
                {[
                  "R² = 0.9832 → casi perfecto: el modelo explica el 98.3% de la varianza.",
                  "RMSE ≈ 780.93 ≈ ruido σ=800: el error del modelo ≈ el ruido introducido al generar datos.",
                  "Los coeficientes recuperados son muy cercanos a los originales (β₁≈−5, β₂≈5, β₃≈0.1).",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <p className="text-gray-400 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <CodeBlock>
              <p className="text-gray-500"># Código completo</p>
              <p><span className="text-emerald-400">x</span><span className="text-white"> = np.linspace(-</span><span className="text-amber-300">50</span><span className="text-white">, </span><span className="text-amber-300">50</span><span className="text-white">, </span><span className="text-amber-300">500</span><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">y</span><span className="text-white"> = -</span><span className="text-amber-300">100</span><span className="text-white"> - </span><span className="text-amber-300">5</span><span className="text-white">*x + </span><span className="text-amber-300">5</span><span className="text-white">*x**</span><span className="text-amber-300">2</span><span className="text-white"> + </span><span className="text-amber-300">0.1</span><span className="text-white">*x**</span><span className="text-amber-300">3</span><span className="text-white"> + </span><span className="text-amber-300">800</span><span className="text-white">*np.random.randn(</span><span className="text-amber-300">500</span><span className="text-white">)</span></p>
              <p className="mt-1"><span className="text-emerald-400">pf</span><span className="text-white"> = PolynomialFeatures(degree=</span><span className="text-amber-300">3</span><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">X</span><span className="text-white"> = pf.fit_transform(x.reshape(-</span><span className="text-amber-300">1</span><span className="text-white">, </span><span className="text-amber-300">1</span><span className="text-white">))</span><span className="text-gray-500 ml-2"># shape (500,4)</span></p>
              <p className="mt-1"><span className="text-emerald-400">modelo</span><span className="text-white"> = LinearRegression().fit(X, y)</span></p>
              <p><span className="text-violet-400">print</span><span className="text-white">(modelo.coef_)</span><span className="text-gray-500 ml-2">    # [0. −2.20  5.05  0.098]</span></p>
              <p><span className="text-violet-400">print</span><span className="text-white">(modelo.intercept_)</span><span className="text-gray-500 ml-2"># −101.21</span></p>
              <p className="mt-1"><span className="text-emerald-400">pred</span><span className="text-white"> = modelo.predict(X)</span></p>
              <p><span className="text-emerald-400">r2</span><span className="text-white"> = modelo.score(X, y)</span><span className="text-gray-500 ml-2">  # 0.9832</span></p>
              <p><span className="text-emerald-400">rmse</span><span className="text-white"> = np.sqrt(mean_squared_error(y, pred))</span><span className="text-gray-500 ml-2"># 780.93</span></p>
            </CodeBlock>
          </div>
        </section>

        {/* ══ 6. ELECCIÓN DEL GRADO ════════════════════════════ */}
        <section id="grado" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="⚠️" title="Elección del Grado — Bias vs Varianza" color="#f43f5e" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            El grado del polinomio controla la complejidad del modelo. Elegirlo bien es crítico para evitar los dos errores clásicos de ML.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label:"Grado muy bajo",  icon:"📉", tag:"Underfitting",
                color:"sky",
                desc:"El modelo es demasiado simple. No captura la curvatura real de los datos. Alto bias, baja varianza.",
                example:"Ajustar una recta (grado 1) a datos claramente curvos.",
              },
              {
                label:"Grado ideal",     icon:"🎯", tag:"Buen ajuste",
                color:"emerald",
                desc:"El modelo captura el patrón real sin memorizar el ruido. Balance óptimo bias-varianza.",
                example:"Datos cúbicos → usar grado 3. R² alto, RMSE ≈ ruido.",
              },
              {
                label:"Grado muy alto",  icon:"📈", tag:"Overfitting",
                color:"rose",
                desc:"El modelo memoriza el ruido de entrenamiento. R² perfecto en train, malo en test.",
                example:"Grado 15 en 20 puntos: pasa exacto por todos pero no generaliza.",
              },
            ].map((item) => {
              const c = {
                sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    badge:"bg-sky-500/20 text-sky-300" },
                emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",badge:"bg-emerald-500/20 text-emerald-300" },
                rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300",   badge:"bg-rose-500/20 text-rose-300" },
              }[item.color];
              return (
                <div key={item.label} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <div className="flex items-center gap-2 mb-2">
                    <p className={`text-sm font-bold ${c.text}`}>{item.label}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.badge}`}>{item.tag}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{item.desc}</p>
                  <p className={`text-xs font-mono italic ${c.text} opacity-70`}>{item.example}</p>
                </div>
              );
            })}
          </div>

          <Tip color="rose">
            Para elegir el grado óptimo usa <strong>validación cruzada</strong> (cross_val_score) o una curva de aprendizaje que compare el error en train vs test para distintos grados.
          </Tip>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"¿Qué es?",              desc:"Regresión lineal con features expandidas. Ajusta curvas pero los parámetros siguen siendo lineales.",          color:"#a855f7" },
              { label:"PolynomialFeatures",    desc:"Genera columnas [1, x, x², x³, …]. Con degree=3 y 1 feature: shape (n, 4).",                                 color:"#0ea5e9" },
              { label:"LinearRegression",      desc:"Se aplica sobre X expandido. Coeficientes en .coef_ e .intercept_. Mismo API que regresión lineal simple.",   color:"#10b981" },
              { label:"Underfitting",          desc:"Grado muy bajo: el modelo no captura la curvatura real. Alto bias.",                                          color:"#0ea5e9" },
              { label:"Overfitting",           desc:"Grado muy alto: memoriza el ruido. R² perfecto en train, malo en test. Alta varianza.",                       color:"#f43f5e" },
              { label:"Resultado notebook",    desc:"degree=3 sobre función cúbica: R²=0.9832, RMSE=780.93 ≈ ruido σ=800. Ajuste casi perfecto.",                color:"#f59e0b" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · Regresión Polinomial</span>
        </div>

      </div>
    </div>
  );
}