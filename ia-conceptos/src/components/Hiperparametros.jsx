// OptimizacionHiperparametros.jsx — Módulo IV: Machine Learning con Python
// Contenido basado en el notebook: Optimización de Hiperparámetros

import { useState, useEffect, useRef } from "react";

// ── Demo: GridSearch — Costo Computacional ────────────────────────
function GridSearchCostoDemo() {
  const [params, setParams] = useState([
    { nombre: "n_estimators", valores: 5 },
    { nombre: "max_depth",    valores: 5 },
    { nombre: "criterion",    valores: 2 },
    { nombre: "max_features", valores: 4 },
  ]);
  const [kFolds, setKFolds] = useState(5);

  const combinaciones = params.reduce((acc, p) => acc * p.valores, 1);
  const fits = combinaciones * kFolds;

  const updateParam = (i, val) => {
    const next = [...params];
    next[i] = { ...next[i], valores: Number(val) };
    setParams(next);
  };

  const colores = ["#8b5cf6", "#f59e0b", "#10b981", "#3b82f6"];

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Costo Computacional GridSearch</p>
      <p className="text-gray-400 text-xs mb-5">
        Ajusta el número de valores por parámetro y observa cómo explota el costo.
      </p>

      <div className="space-y-3 mb-5">
        {params.map((p, i) => (
          <div key={p.nombre}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono" style={{ color: colores[i] }}>{p.nombre}</span>
              <span className="text-gray-400">{p.valores} valores</span>
            </div>
            <input type="range" min={1} max={10} value={p.valores}
              onChange={(e) => updateParam(i, e.target.value)}
              className="w-full cursor-pointer" style={{ accentColor: colores[i] }} />
          </div>
        ))}

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-sky-400 font-mono">k-folds CV</span>
            <span className="text-gray-400">{kFolds} pliegues</span>
          </div>
          <input type="range" min={2} max={10} value={kFolds}
            onChange={(e) => setKFolds(Number(e.target.value))}
            className="w-full cursor-pointer" style={{ accentColor: "#0ea5e9" }} />
        </div>
      </div>

      {/* Fórmula animada */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4 mb-4 font-mono text-sm">
        <div className="flex flex-wrap items-center gap-1 mb-2 text-xs">
          {params.map((p, i) => (
            <span key={p.nombre}>
              <span className="px-1.5 py-0.5 rounded" style={{ background: colores[i] + "20", color: colores[i] }}>{p.valores}</span>
              {i < params.length - 1 && <span className="text-gray-600 mx-0.5">×</span>}
            </span>
          ))}
          <span className="text-gray-600 mx-0.5">×</span>
          <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">{kFolds}</span>
          <span className="text-gray-500 ml-1">= </span>
          <span className={`font-black text-base ml-1 ${fits > 5000 ? "text-rose-400" : fits > 1000 ? "text-amber-400" : "text-emerald-400"}`}>
            {fits.toLocaleString()} fits
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (fits / 20000) * 100)}%`,
                background: fits > 5000 ? "#ef4444" : fits > 1000 ? "#f59e0b" : "#10b981"
              }} />
          </div>
          <span className={`text-xs font-bold ${fits > 5000 ? "text-rose-400" : fits > 1000 ? "text-amber-400" : "text-emerald-400"}`}>
            {fits > 5000 ? "🔥 Costoso" : fits > 1000 ? "⚠️ Moderado" : "✓ Manejable"}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Con los parámetros del notebook:{" "}
        <span className="text-white font-mono">5×2×4×5 × 5 = 1,000 fits</span>
      </p>
    </div>
  );
}

// ── Demo: GridSearch vs RandomSearch (espacio de búsqueda) ────────
function BusquedaEspacioDemo() {
  const canvasRef = useRef(null);
  const [modo, setModo] = useState("grid");
  const [iteraciones, setIteraciones] = useState(20);

  // Genera puntos de grid
  const gridPts = [];
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 5; j++)
      gridPts.push([(i / 4) * 0.85 + 0.08, (j / 4) * 0.85 + 0.08]);

  // Genera puntos random con semilla fija
  const seededRand = (seed) => {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  };
  const rng = seededRand(42);
  const randomPts = Array.from({ length: 40 }, () => [rng() * 0.85 + 0.08, rng() * 0.85 + 0.08]);

  // Zona "óptima" simulada
  const optX = 0.62, optY = 0.73, optR = 0.12;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const toC = ([px, py]) => [px * W, (1 - py) * H];

    // Gradiente de fondo (mapa de calor simulado)
    for (let gx = 0; gx < W; gx += 4) {
      for (let gy = 0; gy < H; gy += 4) {
        const nx = gx / W, ny = 1 - gy / H;
        const d = Math.sqrt((nx - optX) ** 2 + (ny - optY) ** 2);
        const heat = Math.max(0, 1 - d / 0.5);
        ctx.fillStyle = `rgba(139,92,246,${heat * 0.18})`;
        ctx.fillRect(gx, gy, 4, 4);
      }
    }

    // Zona óptima
    ctx.beginPath();
    ctx.arc(optX * W, (1 - optY) * H, optR * W, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(16,185,129,0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(16,185,129,0.07)";
    ctx.fill();
    ctx.fillStyle = "rgba(16,185,129,0.7)";
    ctx.font = "bold 9px monospace";
    ctx.fillText("óptimo", optX * W - 15, (1 - optY) * H + 3);

    const pts = modo === "grid" ? gridPts : randomPts.slice(0, iteraciones);

    // Líneas de grid
    if (modo === "grid") {
      [0.08, 0.295, 0.51, 0.725, 0.93].forEach((v) => {
        ctx.beginPath();
        ctx.moveTo(v * W, 0); ctx.lineTo(v * W, H);
        ctx.moveTo(0, (1 - v) * H); ctx.lineTo(W, (1 - v) * H);
        ctx.strokeStyle = "rgba(139,92,246,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Puntos
    pts.forEach(([px, py], idx) => {
      const [cx, cy] = toC([px, py]);
      const isNearOpt = Math.sqrt((px - optX) ** 2 + (py - optY) ** 2) < optR;
      const col = isNearOpt ? "#10b981" : (modo === "grid" ? "#8b5cf6" : "#f59e0b");

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.strokeStyle = col + "80";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Número de iteración en random
      if (modo === "random" && idx < 10) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "7px monospace";
        ctx.fillText(idx + 1, cx + 5, cy + 3);
      }
    });

    // Labels ejes
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "9px monospace";
    ctx.fillText("n_estimators →", 4, H - 4);
    ctx.save();
    ctx.translate(10, H - 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("max_depth →", 0, 0);
    ctx.restore();
  }, [modo, iteraciones]);

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Exploración del Espacio de Búsqueda</p>

      <div className="flex gap-2 mb-4">
        {[
          { key: "grid",   label: "GridSearch",   color: "#8b5cf6" },
          { key: "random", label: "RandomSearch",  color: "#f59e0b" },
        ].map((m) => (
          <button key={m.key} onClick={() => setModo(m.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono
              ${modo === m.key ? "border-current bg-current/10" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}
            style={modo === m.key ? { color: m.color, borderColor: m.color + "80" } : {}}>
            {m.label}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} width={280} height={220}
        className="rounded-xl border border-white/10 bg-black/30 w-full mb-4" style={{ maxWidth: 280 }} />

      {modo === "random" && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Iteraciones de búsqueda</span>
            <span className="text-amber-300 font-mono">n_iter = {iteraciones}</span>
          </div>
          <input type="range" min={5} max={40} value={iteraciones}
            onChange={(e) => setIteraciones(Number(e.target.value))}
            className="w-full cursor-pointer" style={{ accentColor: "#f59e0b" }} />
        </div>
      )}

      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Cerca del óptimo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: modo === "grid" ? "#8b5cf6" : "#f59e0b" }} />
          {modo === "grid" ? "Puntos fijos" : "Muestras aleatorias"}
        </span>
      </div>

      {modo === "grid" && (
        <p className="text-xs text-gray-500 mt-2">
          GridSearch solo evalúa los <strong className="text-white">25 puntos fijos</strong> de la cuadrícula.
          Si el óptimo real está entre dos puntos, no lo encuentra.
        </p>
      )}
      {modo === "random" && (
        <p className="text-xs text-gray-500 mt-2">
          RandomSearch muestrea aleatoriamente el espacio continuo.
          Con más iteraciones, mayor probabilidad de acercarse al óptimo real.
        </p>
      )}
    </div>
  );
}

// ── Demo: Comparativa de resultados ──────────────────────────────
function ResultadosDemo() {
  const [vista, setVista] = useState("params");

  const grid = {
    params: { criterion: "entropy", max_depth: 7, max_features: "log2", n_estimators: 500 },
    trainCV: 0.7523, train: 0.7879, test: 0.7879,
    fits: 1000, color: "#8b5cf6",
  };
  const random = {
    params: { criterion: "entropy", max_depth: 5, max_features: "auto", n_estimators: 293 },
    trainCV: 0.7542, train: 0.8454, test: 0.7835,
    fits: 100, color: "#f59e0b",
  };

  const metricas = [
    { label: "Accuracy - Train CV", gv: grid.trainCV, rv: random.trainCV },
    { label: "Accuracy - Train",    gv: grid.train,   rv: random.train },
    { label: "Accuracy - Test",     gv: grid.test,    rv: random.test },
  ];

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Resultados Comparativos</p>

      <div className="flex gap-2 mb-5">
        {[
          { key: "params",  label: "Mejores parámetros" },
          { key: "scores",  label: "Accuracy" },
          { key: "costo",   label: "Costo" },
        ].map((v) => (
          <button key={v.key} onClick={() => setVista(v.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all
              ${vista === v.key
                ? "border-sky-400 bg-sky-400/20 text-sky-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {vista === "params" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["GridSearch", grid], ["RandomSearch", random]].map(([label, m]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold mb-3" style={{ color: m.color }}>{label}</p>
              <div className="space-y-1.5">
                {Object.entries(m.params).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-gray-500 font-mono">{k}</span>
                    <span className="font-mono font-bold" style={{ color: m.color }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {vista === "scores" && (
        <div className="space-y-3">
          {metricas.map((m) => (
            <div key={m.label} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500 mb-3">{m.label}</p>
              <div className="space-y-2">
                {[["GridSearch", m.gv, "#8b5cf6"], ["RandomSearch", m.rv, "#f59e0b"]].map(([label, val, col]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs w-24" style={{ color: col }}>{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${val * 100}%`, background: col, opacity: 0.85 }} />
                    </div>
                    <span className="text-xs font-mono font-bold w-10 text-right" style={{ color: col }}>
                      {(val * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {vista === "costo" && (
        <div className="space-y-4">
          {[["GridSearch", grid.fits, "#8b5cf6", "1000 fits = 200 combinaciones × 5 folds"],
            ["RandomSearch", random.fits, "#f59e0b", "100 fits = 20 iteraciones × 5 folds"]].map(([label, fits, col, desc]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex justify-between items-start mb-3">
                <p className="font-bold text-sm" style={{ color: col }}>{label}</p>
                <span className="font-mono font-black text-xl" style={{ color: col }}>{fits.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-2">
                <div className="h-full rounded-full"
                  style={{ width: `${(fits / 1000) * 100}%`, background: col, opacity: 0.85 }} />
              </div>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
            <p className="text-emerald-400 font-bold mb-1">🏆 Conclusión</p>
            <p className="text-gray-400">
              RandomSearch logró un accuracy de test similar (<span className="text-emerald-400 font-mono">78.4%</span>) usando solo el{" "}
              <strong className="text-white">10% de los fits</strong> que necesitó GridSearch.
            </p>
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
        style={{ background: `${color}15`, borderColor: `${color}40` }}>
        {icon}
      </div>
      <h2 className="text-lg font-bold" style={{ color }}>{title}</h2>
    </div>
  );
}

function Tip({ color, children }) {
  const map = {
    violet:  { bg: "bg-violet-500/10",  border: "border-violet-500/20",  text: "text-violet-300" },
    amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-300" },
    rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-300" },
    sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-300" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300" },
  };
  const c = map[color] || map.violet;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4 text-sm ${c.text}`}>
      💡 {children}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-4"
      style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 2 }}>
      {children}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function OptimizacionHiperparametros({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        code { font-family: 'IBM Plex Mono', monospace; }
        input[type=range] { height: 4px; border-radius: 2px; }
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-amber-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-0 w-[250px] h-[250px] bg-sky-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Machine Learning</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily: "monospace" }}>Hiperparámetros</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6", fontFamily: "monospace" }}>
            🤖 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Optimización de{" "}
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #f59e0b, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Hiperparámetros</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Encuentra la combinación óptima de parámetros para maximizar el rendimiento de un modelo.
            Aprende la diferencia entre{" "}
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded">GridSearchCV</code> y{" "}
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded">RandomizedSearchCV</code>,
            y cuándo usar cada uno.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#intro",    label: "📖 Introducción" },
            { href: "#grid",     label: "🔲 GridSearch" },
            { href: "#random",   label: "🎲 RandomSearch" },
            { href: "#vs",       label: "⚔️ Comparativa" },
            { href: "#practica", label: "💻 Práctica sklearn" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══════════════════════════
            SECCIÓN 1 — Introducción
        ══════════════════════════ */}
        <section id="intro" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📖" title="Introducción" color="#8b5cf6" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Casi todos los algoritmos de machine learning tienen un conjunto de{" "}
            <strong className="text-white">hiperparámetros</strong> que no se aprenden de los datos,
            sino que deben configurarse antes del entrenamiento. La elección correcta maximiza el rendimiento del modelo.
          </p>

          {/* Parámetro vs Hiperparámetro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs text-gray-500 font-bold mb-2">PARÁMETRO</p>
              <p className="text-sm text-white font-bold mb-1">Aprendido del dato</p>
              <p className="text-xs text-gray-400 mb-3">El modelo lo ajusta automáticamente durante el entrenamiento.</p>
              <div className="flex flex-wrap gap-1">
                {["coeficientes β", "pesos de red", "centroides"].map((e) => (
                  <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">{e}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-xs text-violet-400 font-bold mb-2">HIPERPARÁMETRO</p>
              <p className="text-sm text-white font-bold mb-1">Configurado por el usuario</p>
              <p className="text-xs text-gray-400 mb-3">Define la arquitectura o el comportamiento del algoritmo antes de entrenar.</p>
              <div className="flex flex-wrap gap-1">
                {["n_estimators", "max_depth", "C", "gamma", "k", "alpha"].map((e) => (
                  <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-mono">{e}</span>
                ))}
              </div>
            </div>
          </div>

          <Tip color="violet">
            La mejor estrategia para elegir un buen hiperparámetro es mediante{" "}
            <strong>prueba y error automatizado</strong> sobre todas (o un subconjunto) de las combinaciones posibles.
            Sklearn ofrece <code>GridSearchCV</code> y <code>RandomizedSearchCV</code> para esto.
          </Tip>
        </section>

        {/* ══════════════════════════
            SECCIÓN 2 — GridSearch
        ══════════════════════════ */}
        <section id="grid" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "60ms" }}>
          <SectionHeader icon="🔲" title="GridSearchCV" color="#8b5cf6" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Construye y evalúa modelos para{" "}
            <strong className="text-white">todas las combinaciones posibles</strong> de los valores de
            hiperparámetros que se definen en una cuadrícula. Usa validación cruzada para seleccionar
            la mejor combinación.
          </p>

          {/* Pros / Contras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-400 text-xs font-bold mb-3">✓ VENTAJAS</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span>Evalúa exhaustivamente todo el espacio definido.</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span>Reproducible y determinista.</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span>Garantiza encontrar el mejor punto <em>dentro de la cuadrícula</em>.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <p className="text-rose-400 text-xs font-bold mb-3">✗ DESVENTAJAS</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">→</span>Muy costoso computacionalmente con muchos parámetros.</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">→</span>Solo busca en puntos fijos: puede perderse el verdadero óptimo.</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">→</span>El costo crece exponencialmente: p parámetros × v valores = vᵖ combinaciones.</li>
              </ul>
            </div>
          </div>

          <GridSearchCostoDemo />

          <div className="mt-4">
            <Tip color="violet">
              Con 5 parámetros y 5 valores cada uno: <code>5⁵ = 3,125 combinaciones</code>.
              Con 5-fold CV: <code>3,125 × 5 = 15,625 fits</code>. El costo escala muy rápido.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 3 — RandomSearch
        ══════════════════════════ */}
        <section id="random" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="🎲" title="RandomizedSearchCV" color="#f59e0b" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Prueba <strong className="text-white">combinaciones aleatorias</strong> de un rango de valores.
            A diferencia de GridSearch, los parámetros numéricos pueden especificarse como
            <strong className="text-white"> distribuciones</strong> (no solo valores fijos).
            Se controla el número de iteraciones con <code className="text-amber-400">n_iter</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-400 text-xs font-bold mb-3">✓ VENTAJAS</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span>Mucho más rápido que GridSearch.</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span>Puede explorar rangos continuos de parámetros.</li>
                <li className="flex gap-2"><span className="text-emerald-400 shrink-0">→</span>Suele encontrar muy buenas combinaciones con menos recursos.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <p className="text-rose-400 text-xs font-bold mb-3">✗ DESVENTAJAS</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">→</span>No garantiza encontrar el óptimo global.</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">→</span>Requiere elegir bien el rango y <code>n_iter</code>.</li>
                <li className="flex gap-2"><span className="text-rose-400 shrink-0">→</span>Con pocas iteraciones puede perderse la mejor combinación.</li>
              </ul>
            </div>
          </div>

          <BusquedaEspacioDemo />

          <div className="mt-4">
            <Tip color="amber">
              En el ejemplo del notebook, RandomSearch con <code>n_iter=20</code> usó solo{" "}
              <strong>100 fits</strong> frente a los <strong>1,000 de GridSearch</strong>,
              alcanzando un accuracy de test prácticamente igual (<code>78.4%</code> vs <code>78.8%</code>).
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 4 — Comparativa
        ══════════════════════════ */}
        <section id="vs" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "180ms" }}>
          <SectionHeader icon="⚔️" title="GridSearch vs RandomSearch" color="#06b6d4" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Ninguno es universalmente mejor. La elección depende del tamaño del espacio de búsqueda,
            el tiempo disponible y la naturaleza de los hiperparámetros.
          </p>

          {/* Tabla comparativa */}
          <div className="rounded-xl border border-white/10 overflow-hidden mb-6">
            <div className="grid grid-cols-3 bg-white/[0.04] px-4 py-2 text-xs font-bold text-gray-400">
              <span>Característica</span>
              <span className="text-center text-violet-400">GridSearch</span>
              <span className="text-center text-amber-400">RandomSearch</span>
            </div>
            {[
              ["Espacio de búsqueda", "Puntos fijos", "Continuo / distribución"],
              ["Costo computacional", "🔥 Alto", "✓ Bajo"],
              ["Garantía de óptimo", "Dentro de la cuadrícula", "No garantizado"],
              ["Parámetros numéricos", "Valores discretos", "Rangos o distribuciones"],
              ["Control de iteraciones", "Automático (exhaustivo)", "n_iter definido por usuario"],
              ["Mejor para", "Pocos hiperparámetros", "Muchos hiperparámetros"],
            ].map(([feat, g, r], i) => (
              <div key={feat} className={`grid grid-cols-3 px-4 py-3 text-xs ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                <span className="text-gray-400">{feat}</span>
                <span className="text-center text-violet-300">{g}</span>
                <span className="text-center text-amber-300">{r}</span>
              </div>
            ))}
          </div>

          <ResultadosDemo />
        </section>

        {/* ══════════════════════════
            SECCIÓN 5 — Práctica
        ══════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="💻" title="Práctica con sklearn — Dataset Diabetes" color="#10b981" />
          <p className="text-gray-400 mb-2 leading-relaxed">
            Clasificación de diabetes en pacientes usando
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded ml-1">RandomForestClassifier</code>.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            768 pacientes mujeres de herencia indígena Pima, ≥21 años. Variables: glucosa, BMI, insulina, edad, etc.
          </p>

          {[
            {
              label: "1 · Preparar datos", color: "#10b981",
              code: (
                <>
                  <p><span className="text-emerald-400">df</span><span className="text-white"> = pd.</span><span className="text-sky-400">read_csv</span><span className="text-white">(</span><span className="text-green-300">'datos/diabetes.csv'</span><span className="text-white">)</span></p>
                  <p><span className="text-emerald-400">X</span><span className="text-white"> = df.</span><span className="text-sky-400">drop</span><span className="text-white">(columns=</span><span className="text-green-300">'Outcome'</span><span className="text-white">)</span></p>
                  <p><span className="text-emerald-400">y</span><span className="text-white"> = df[</span><span className="text-green-300">'Outcome'</span><span className="text-white">].values</span></p>
                  <p className="mt-1"><span className="text-emerald-400">X</span><span className="text-white"> = </span><span className="text-sky-400">StandardScaler</span><span className="text-white">().</span><span className="text-sky-400">fit_transform</span><span className="text-white">(X)</span></p>
                  <p><span className="text-emerald-400">X_train</span><span className="text-white">, </span><span className="text-emerald-400">X_test</span><span className="text-white">, </span><span className="text-emerald-400">y_train</span><span className="text-white">, </span><span className="text-emerald-400">y_test</span><span className="text-white"> = </span><span className="text-sky-400">train_test_split</span><span className="text-white">(X, y, test_size=</span><span className="text-amber-300">0.3</span><span className="text-white">)</span></p>
                </>
              )
            },
            {
              label: "2 · Definir parámetros a explorar", color: "#8b5cf6",
              code: (
                <>
                  <p><span className="text-emerald-400">rf_parametros</span><span className="text-white"> = {`{`}</span></p>
                  <p><span className="ml-8 text-green-300">'n_estimators'</span><span className="text-white">: [</span><span className="text-amber-300">100, 250, 500, 750, 1000</span><span className="text-white">],</span></p>
                  <p><span className="ml-8 text-green-300">'criterion'</span><span className="text-white">:    [</span><span className="text-green-300">'gini'</span><span className="text-white">,</span><span className="text-green-300">'entropy'</span><span className="text-white">],</span></p>
                  <p><span className="ml-8 text-green-300">'max_features'</span><span className="text-white">: [</span><span className="text-sky-400">None</span><span className="text-white">,</span><span className="text-green-300">'sqrt'</span><span className="text-white">,</span><span className="text-green-300">'log2'</span><span className="text-white">,</span><span className="text-green-300">'auto'</span><span className="text-white">],</span></p>
                  <p><span className="ml-8 text-green-300">'max_depth'</span><span className="text-white">:    [</span><span className="text-amber-300">1, 3, 5, 7, 9</span><span className="text-white">]</span></p>
                  <p><span className="text-white">{`}`}</span></p>
                  <p className="text-gray-500"># 5×2×4×5 = 200 combinaciones</p>
                </>
              )
            },
            {
              label: "3 · GridSearchCV", color: "#8b5cf6",
              code: (
                <>
                  <p><span className="text-emerald-400">kfold</span><span className="text-white"> = </span><span className="text-sky-400">StratifiedKFold</span><span className="text-white">(n_splits=</span><span className="text-amber-300">5</span><span className="text-white">)</span></p>
                  <p><span className="text-emerald-400">grid</span><span className="text-white"> = </span><span className="text-sky-400">GridSearchCV</span><span className="text-white">(</span></p>
                  <p><span className="ml-8 text-white">modelo_rf, rf_parametros,</span></p>
                  <p><span className="ml-8 text-white">scoring=</span><span className="text-green-300">'roc_auc'</span><span className="text-white">, cv=kfold, n_jobs=</span><span className="text-amber-300">-1</span></p>
                  <p><span className="text-white">)</span></p>
                  <p><span className="text-emerald-400">grid</span><span className="text-white">.</span><span className="text-sky-400">fit</span><span className="text-white">(X_train, y_train)</span></p>
                  <p className="text-gray-500"># → 1000 fits (200 × 5 folds)</p>
                  <p><span className="text-violet-400">print</span><span className="text-white">(grid.</span><span className="text-sky-400">best_params_</span><span className="text-white">)</span></p>
                  <p className="text-gray-500"># criterion: entropy, max_depth: 7,</p>
                  <p className="text-gray-500"># max_features: log2, n_estimators: 500</p>
                </>
              )
            },
            {
              label: "4 · RandomizedSearchCV", color: "#f59e0b",
              code: (
                <>
                  <p><span className="text-sky-400">from</span><span className="text-white"> scipy.stats </span><span className="text-sky-400">import</span><span className="text-white"> randint </span><span className="text-sky-400">as</span><span className="text-white"> sp_randint</span></p>
                  <p className="mt-1"><span className="text-emerald-400">param_dist</span><span className="text-white"> = {`{`}</span></p>
                  <p><span className="ml-8 text-green-300">'n_estimators'</span><span className="text-white">: </span><span className="text-sky-400">sp_randint</span><span className="text-white">(</span><span className="text-amber-300">100</span><span className="text-white">, </span><span className="text-amber-300">1000</span><span className="text-white">),</span></p>
                  <p><span className="ml-8 text-green-300">'criterion'</span><span className="text-white">:    [</span><span className="text-green-300">'gini'</span><span className="text-white">,</span><span className="text-green-300">'entropy'</span><span className="text-white">],</span></p>
                  <p><span className="ml-8 text-green-300">'max_features'</span><span className="text-white">: [</span><span className="text-sky-400">None</span><span className="text-white">,</span><span className="text-green-300">'auto'</span><span className="text-white">,</span><span className="text-green-300">'sqrt'</span><span className="text-white">,</span><span className="text-green-300">'log2'</span><span className="text-white">],</span></p>
                  <p><span className="ml-8 text-green-300">'max_depth'</span><span className="text-white">:    [</span><span className="text-sky-400">None</span><span className="text-white">,</span><span className="text-amber-300">1,3,5,7,9</span><span className="text-white">]</span></p>
                  <p><span className="text-white">{`}`}</span></p>
                  <p className="mt-1"><span className="text-emerald-400">rs</span><span className="text-white"> = </span><span className="text-sky-400">RandomizedSearchCV</span><span className="text-white">(</span></p>
                  <p><span className="ml-8 text-white">modelo_rf, param_distributions=param_dist,</span></p>
                  <p><span className="ml-8 text-white">n_iter=</span><span className="text-amber-300">20</span><span className="text-white">, cv=kfold, n_jobs=</span><span className="text-amber-300">-1</span></p>
                  <p><span className="text-white">)</span></p>
                  <p><span className="text-emerald-400">rs</span><span className="text-white">.</span><span className="text-sky-400">fit</span><span className="text-white">(X_train, y_train)</span></p>
                  <p className="text-gray-500"># → solo 100 fits (20 × 5 folds)</p>
                  <p><span className="text-violet-400">print</span><span className="text-white">(rs.</span><span className="text-sky-400">best_params_</span><span className="text-white">)</span></p>
                  <p className="text-gray-500"># criterion: entropy, max_depth: 5,</p>
                  <p className="text-gray-500"># max_features: auto, n_estimators: 293</p>
                </>
              )
            },
          ].map((s) => (
            <div key={s.label} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full border font-bold"
                  style={{ borderColor: s.color + "60", color: s.color, background: s.color + "15" }}>
                  {s.label}
                </span>
              </div>
              <CodeBlock>{s.code}</CodeBlock>
            </div>
          ))}

          <Tip color="emerald">
            Nota el uso de <code>sp_randint(100, 1000)</code> en RandomSearch: permite muestrear{" "}
            <strong>cualquier entero entre 100 y 1000</strong> para <code>n_estimators</code>,
            no solo los 5 valores fijos que usa GridSearch. Esta es una de las mayores ventajas de RandomSearch.
          </Tip>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "Hiperparámetro",       desc: "Parámetro configurado por el usuario antes del entrenamiento. No se aprende de los datos.", color: "#8b5cf6" },
              { code: "GridSearchCV",          desc: "Evalúa todas las combinaciones de la cuadrícula. Exhaustivo pero costoso.", color: "#8b5cf6" },
              { code: "RandomizedSearchCV",    desc: "Muestrea combinaciones aleatorias. Más rápido, acepta distribuciones continuas.", color: "#f59e0b" },
              { code: "n_iter",                desc: "Parámetro de RandomSearch: número de combinaciones aleatorias a probar.", color: "#f59e0b" },
              { code: "scoring='roc_auc'",     desc: "Métrica de evaluación para seleccionar la mejor combinación durante la búsqueda.", color: "#06b6d4" },
              { code: "best_params_",          desc: "Atributo que devuelve el diccionario con los mejores hiperparámetros encontrados.", color: "#10b981" },
              { code: "best_estimator_",       desc: "El modelo ya entrenado con los mejores hiperparámetros. Listo para predecir.", color: "#10b981" },
            ].map((row) => (
              <div key={row.code} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <code className="text-sm font-bold whitespace-nowrap mt-0.5 shrink-0" style={{ color: row.color }}>{row.code}</code>
                <p className="text-gray-400 text-sm">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors">← Volver al inicio</button>
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Machine Learning · Hiperparámetros</span>
        </div>

      </div>
    </div>
  );
}