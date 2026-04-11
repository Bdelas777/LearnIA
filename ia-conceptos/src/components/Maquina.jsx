// MaquinasSoporteVectorial.jsx — Módulo IV: Machine Learning con Python
// Contenido basado en el notebook: Máquinas de Soporte Vectorial

import { useState, useRef, useEffect } from "react";

// ── Demo: Hiperplano Separador ────────────────────────────────────
function HiperplanoDemo() {
  const canvasRef = useRef(null);
  const [angulo, setAngulo] = useState(30);
  const [offset, setOffset] = useState(0);

  const puntosPos = [
    [130, 80], [160, 110], [145, 60], [175, 90], [190, 70], [155, 130],
  ];
  const puntosNeg = [
    [60, 160], [80, 190], [50, 200], [90, 170], [70, 210], [100, 185],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Hiperplano
    const rad = (angulo * Math.PI) / 180;
    const cx = W / 2 + offset, cy = H / 2;
    const dx = Math.cos(rad) * 200, dy = Math.sin(rad) * 200;
    ctx.beginPath();
    ctx.moveTo(cx - dx, cy - dy);
    ctx.lineTo(cx + dx, cy + dy);
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.stroke();

    // Márgenes
    const perp = { x: -Math.sin(rad) * 30, y: Math.cos(rad) * 30 };
    const drawMargin = (sign) => {
      ctx.beginPath();
      ctx.moveTo(cx - dx + sign * perp.x, cy - dy + sign * perp.y);
      ctx.lineTo(cx + dx + sign * perp.x, cy + dy + sign * perp.y);
      ctx.strokeStyle = sign > 0 ? "rgba(59,130,246,0.4)" : "rgba(234,179,8,0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
    };
    drawMargin(1); drawMargin(-1);
    ctx.setLineDash([]);

    // Área sombreada margen
    ctx.beginPath();
    ctx.moveTo(cx - dx + perp.x, cy - dy + perp.y);
    ctx.lineTo(cx + dx + perp.x, cy + dy + perp.y);
    ctx.lineTo(cx + dx - perp.x, cy + dy - perp.y);
    ctx.lineTo(cx - dx - perp.x, cy - dy - perp.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(139,92,246,0.06)";
    ctx.fill();

    // Puntos positivos (+1)
    puntosPos.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "rgba(147,197,253,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("+", x, y);
    });

    // Puntos negativos (-1)
    puntosNeg.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#eab308";
      ctx.fill();
      ctx.strokeStyle = "rgba(253,224,71,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("–", x, y);
    });

    // Etiqueta margen
    ctx.fillStyle = "rgba(139,92,246,0.9)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("margen", cx + 10, cy - 14);

    // Flecha de margen
    ctx.beginPath();
    ctx.moveTo(cx, cy - 30);
    ctx.lineTo(cx, cy + 30);
    ctx.strokeStyle = "rgba(139,92,246,0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [angulo, offset]);

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Hiperplano Separador</p>
      <p className="text-gray-400 text-xs mb-4">Ajusta el ángulo y la posición del hiperplano para separar las dos clases.</p>
      <canvas ref={canvasRef} width={280} height={260}
        className="rounded-xl border border-white/10 bg-black/30 w-full mb-4" style={{ maxWidth: 280 }} />
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Ángulo</span><span className="text-violet-300 font-mono">{angulo}°</span>
          </div>
          <input type="range" min={-60} max={90} value={angulo} onChange={(e) => setAngulo(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Desplazamiento</span><span className="text-violet-300 font-mono">{offset > 0 ? "+" : ""}{offset}</span>
          </div>
          <input type="range" min={-60} max={60} value={offset} onChange={(e) => setOffset(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Clase +1</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Clase −1</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-violet-500 inline-block" /> Hiperplano</span>
      </div>
    </div>
  );
}

// ── Demo: Parámetro C ─────────────────────────────────────────────
function ParamCDemo() {
  const [C, setC] = useState(1);
  const nivel = C <= 1 ? "soft" : C <= 50 ? "medio" : "hard";
  const config = {
    soft: { color: "#22c55e", label: "Margen amplio (permisivo)", desc: "El modelo tolera algunos errores a cambio de un margen más grande. Mejor generalización.", mal: 2 },
    medio: { color: "#f59e0b", label: "Balance", desc: "Equilibrio entre margen y errores de clasificación.", mal: 1 },
    hard: { color: "#ef4444", label: "Margen estricto (rígido)", desc: "Penaliza fuertemente los errores. Puede sobreajustarse (overfitting).", mal: 0 },
  }[nivel];

  const puntos = [
    { x: 68, y: 55, cls: 1 }, { x: 85, y: 80, cls: 1 }, { x: 72, y: 100, cls: 1 },
    { x: 100, y: 65, cls: 1 }, { x: 115, y: 85, cls: 1 }, { x: 90, y: 40, cls: 1 },
    // mal clasificado
    { x: 155, y: 130, cls: 1, outlier: true },
    { x: 175, y: 75, cls: -1 }, { x: 195, y: 95, cls: -1 }, { x: 180, y: 115, cls: -1 },
    { x: 210, y: 80, cls: -1 }, { x: 165, y: 55, cls: -1 }, { x: 200, y: 60, cls: -1 },
  ];

  const margin = C <= 1 ? 38 : C <= 50 ? 22 : 12;
  const cx = 140;

  return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
      <p className="text-orange-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Parámetro C</p>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-500">C =</span>
        <span className="font-mono font-bold text-lg" style={{ color: config.color }}>{C}</span>
        <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: config.color + "60", color: config.color }}>{config.label}</span>
      </div>
      <input type="range" min={1} max={100} value={C} onChange={(e) => setC(Number(e.target.value))}
        className="w-full mb-4 cursor-pointer" style={{ accentColor: config.color }} />

      {/* SVG visualización */}
      <svg viewBox="0 0 280 160" className="w-full rounded-xl border border-white/10 bg-black/30 mb-4" style={{ height: 140 }}>
        {/* Áreas */}
        <rect x={0} y={0} width={cx - margin} height={160} fill="rgba(59,130,246,0.06)" />
        <rect x={cx + margin} y={0} width={280 - cx - margin} height={160} fill="rgba(234,179,8,0.06)" />
        {/* Márgenes */}
        <line x1={cx - margin} y1={0} x2={cx - margin} y2={160} stroke="rgba(59,130,246,0.4)" strokeWidth={1.5} strokeDasharray="5,4" />
        <line x1={cx + margin} y1={0} x2={cx + margin} y2={160} stroke="rgba(234,179,8,0.4)" strokeWidth={1.5} strokeDasharray="5,4" />
        {/* Hiperplano */}
        <line x1={cx} y1={0} x2={cx} y2={160} stroke="#8b5cf6" strokeWidth={2.5} />
        {/* Etiqueta margen */}
        <text x={cx - margin + 4} y={14} fill="rgba(139,92,246,0.7)" fontSize={9} fontFamily="monospace">←{margin*2}px→</text>
        {/* Puntos */}
        {puntos.map((p, i) => {
          const isWrong = p.outlier && C > 50;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={6}
                fill={p.cls === 1 ? "#3b82f6" : "#eab308"}
                stroke={isWrong ? "#ef4444" : p.cls === 1 ? "rgba(147,197,253,0.5)" : "rgba(253,224,71,0.5)"}
                strokeWidth={isWrong ? 2.5 : 1.5}
                opacity={p.outlier && C <= 1 ? 0.4 : 1} />
              <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle"
                fill={p.cls === 1 ? "white" : "#111"} fontSize={9} fontWeight="bold" fontFamily="monospace">
                {p.cls === 1 ? "+" : "−"}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-xs text-gray-400">{config.desc}</p>
    </div>
  );
}

// ── Demo: Kernel Selector ─────────────────────────────────────────
function KernelDemo() {
  const [kernel, setKernel] = useState("lineal");

  const kernels = {
    lineal: {
      color: "#10b981",
      formula: "K(x,x') = x·x'",
      desc: "Separa con una línea recta. Ideal cuando los datos son linealmente separables.",
      path: "M 20 140 L 260 20",
      type: "line",
    },
    polinomico: {
      color: "#f59e0b",
      formula: "K(x,x') = (x·x' + c)^d",
      desc: "Crea fronteras curvas polinómicas. Útil para relaciones no lineales moderadas.",
      path: "M 20 150 Q 140 20 260 140",
      type: "curve",
    },
    rbf: {
      color: "#8b5cf6",
      formula: "K(x,x') = e^(-γ||x-x'||²)",
      desc: "Kernel Gaussiano: fronteras muy flexibles. El más recomendado para probar primero.",
      path: "M 20 80 C 60 160 100 20 140 80 S 220 160 260 80",
      type: "wave",
    },
  };

  const k = kernels[kernel];

  const puntos = [
    // clase azul
    { x: 55, y: 45 }, { x: 75, y: 70 }, { x: 40, y: 80 }, { x: 90, y: 50 }, { x: 65, y: 100 },
    { x: 190, y: 120 }, { x: 210, y: 100 }, { x: 225, y: 135 }, { x: 200, y: 85 }, { x: 240, y: 110 },
    // clase amarilla
    { x: 155, y: 55 }, { x: 170, y: 80 }, { x: 140, y: 75 }, { x: 175, y: 45 }, { x: 160, y: 100 },
    { x: 95, y: 130 }, { x: 115, y: 150 }, { x: 130, y: 125 }, { x: 100, y: 155 }, { x: 120, y: 110 },
  ];
  const colores = [1,1,1,1,1, 1,1,1,1,1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1];

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Kernels</p>
      <div className="flex gap-2 flex-wrap mb-4">
        {Object.keys(kernels).map((k) => (
          <button key={k} onClick={() => setKernel(k)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-mono capitalize
              ${kernel === k
                ? "border-sky-400 bg-sky-400/20 text-sky-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {k}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 280 180" className="w-full rounded-xl border border-white/10 bg-black/30 mb-4" style={{ height: 150 }}>
        {/* Frontera de decisión */}
        <path d={k.path} fill="none" stroke={k.color} strokeWidth={2.5} strokeDasharray={k.type === "line" ? "none" : "none"} opacity={0.8} />
        {/* Puntos */}
        {puntos.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5.5}
              fill={colores[i] === 1 ? "#3b82f6" : "#eab308"}
              stroke={colores[i] === 1 ? "rgba(147,197,253,0.5)" : "rgba(253,224,71,0.5)"}
              strokeWidth={1.5} />
            <text x={p.x} y={p.y + 0.5} textAnchor="middle" dominantBaseline="middle"
              fill={colores[i] === 1 ? "white" : "#111"} fontSize={8} fontWeight="bold" fontFamily="monospace">
              {colores[i] === 1 ? "+" : "−"}
            </text>
          </g>
        ))}
        {/* Label kernel */}
        <text x={8} y={15} fill={k.color} fontSize={10} fontFamily="monospace" fontWeight="bold">{kernel}</text>
      </svg>

      <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 mb-3">
        <p className="font-mono text-xs" style={{ color: k.color }}>{k.formula}</p>
      </div>
      <p className="text-xs text-gray-400">{k.desc}</p>
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
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-300" },
    amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-300" },
    rose:   { bg: "bg-rose-500/10",   border: "border-rose-500/20",   text: "text-rose-300" },
    sky:    { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-300" },
    emerald:{ bg: "bg-emerald-500/10",border: "border-emerald-500/20",text: "text-emerald-300" },
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

function Formula({ children }) {
  return (
    <div className="bg-black/30 border border-violet-500/20 rounded-xl p-4 mb-4 text-center">
      <span className="font-mono text-violet-300 text-sm">{children}</span>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function MaquinasSoporteVectorial({ onBack }) {
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
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-sky-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-orange-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Machine Learning</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily: "monospace" }}>SVM</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6", fontFamily: "monospace" }}>
            🤖 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Máquinas de{" "}
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Soporte Vectorial</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Un algoritmo de clasificación y regresión que construye{" "}
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded">hiperplanos</code> óptimos para separar clases.
            Aprende su teoría, el{" "}
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded">kernel trick</code> y
            cómo implementarlo con <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">sklearn</code>.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#intro",         label: "📖 Introducción" },
            { href: "#hiperplano",    label: "📐 Hiperplano" },
            { href: "#margen",        label: "⚡ Margen Óptimo" },
            { href: "#no-lineal",     label: "🌀 No Lineal" },
            { href: "#kernels",       label: "🔮 Kernels" },
            { href: "#practica",      label: "💻 Práctica sklearn" },
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
            Las <strong className="text-white">Máquinas de Soporte Vectorial (SVM)</strong> son un algoritmo de
            clasificación y regresión desarrollado en los 90 dentro de la ciencia computacional. Aunque inicialmente
            diseñado para clasificación binaria, se ha extendido a clasificación múltiple y regresión.
          </p>
          <p className="text-gray-400 mb-5 leading-relaxed">
            Formalmente, una SVM construye un{" "}
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded">hiperplano</code> o conjunto de
            hiperplanos en un espacio de alta dimensionalidad para separar clases. Una buena separación garantiza
            una clasificación correcta.
          </p>

          {/* Cards características */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              { icon: "🎯", title: "Clasificación", desc: "Binaria y multiclase", color: "#8b5cf6" },
              { icon: "📈", title: "Regresión", desc: "SVR para valores continuos", color: "#3b82f6" },
              { icon: "🏆", title: "Alto rendimiento", desc: "Uno de los mejores clasificadores", color: "#10b981" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="font-bold text-sm mb-1" style={{ color: c.color }}>{c.title}</p>
                <p className="text-xs text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>

          <Tip color="violet">
            SVM se considera uno de los referentes del <strong>aprendizaje estadístico y machine learning</strong>.
            Comprender sus fundamentos requiere álgebra lineal y optimización, pero su uso con sklearn es muy accesible.
          </Tip>
        </section>

        {/* ══════════════════════════
            SECCIÓN 2 — Hiperplano
        ══════════════════════════ */}
        <section id="hiperplano" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "60ms" }}>
          <SectionHeader icon="📐" title="Hiperplano Separador" color="#3b82f6" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            En 2D el hiperplano es simplemente una recta. En n dimensiones es un subespacio de dimensión n−1.
            La ecuación general es:
          </p>

          <Formula>β₀ + β₁x₁ + β₂x₂ + … + βₙxₙ = 0</Formula>

          <p className="text-gray-400 mb-5">
            Un punto <code className="text-sky-400">x</code> cae a un lado del hiperplano si el resultado es{" "}
            <code className="text-emerald-400">&gt; 0</code>, o al otro si es{" "}
            <code className="text-rose-400">&lt; 0</code>. Esto define la clasificación.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-300 text-xs font-bold mb-2">CLASE +1</p>
              <p className="font-mono text-sm text-white">β₀ + β₁x₁ + … + βₙxₙ <span className="text-emerald-400">&gt; 0</span></p>
              <p className="text-xs text-gray-500 mt-1">El punto está por encima del hiperplano</p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <p className="text-rose-300 text-xs font-bold mb-2">CLASE −1</p>
              <p className="font-mono text-sm text-white">β₀ + β₁x₁ + … + βₙxₙ <span className="text-rose-400">&lt; 0</span></p>
              <p className="text-xs text-gray-500 mt-1">El punto está por debajo del hiperplano</p>
            </div>
          </div>

          <HiperplanoDemo />

          <div className="mt-4">
            <Tip color="sky">
              El problema: existen <strong>infinitos hiperplanos</strong> que pueden separar dos clases.
              SVM encuentra el <strong>óptimo</strong>: aquel con el mayor margen posible.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 3 — Margen Óptimo
        ══════════════════════════ */}
        <section id="margen" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="⚡" title="Hiperplano de Óptima Separación" color="#f59e0b" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            La solución es seleccionar el hiperplano más alejado de todas las observaciones:
            el <strong className="text-white">maximal margin hyperplane</strong>. Los pasos son:
          </p>

          <div className="space-y-3 mb-5">
            {[
              { n: "1", text: "Seleccionar dos hiperplanos que separen los datos sin puntos entre ellos.", color: "#f59e0b" },
              { n: "2", text: "Maximizar el margen entre ambos hiperplanos.", color: "#f59e0b" },
              { n: "3", text: "La línea central entre ambos es el límite de decisión.", color: "#f59e0b" },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                  style={{ background: s.color + "20", color: s.color }}>{s.n}</span>
                <p className="text-gray-300 text-sm">{s.text}</p>
              </div>
            ))}
          </div>

          <Formula>max( 2 / ||w|| )  sujeto a:  yᵢ(wxᵢ + b) ≥ 1</Formula>

          <p className="text-gray-400 text-sm mb-5">
            En la práctica se minimiza <code className="text-amber-400">½||w||²</code>, que se resuelve como
            un problema de programación cuadrática.
          </p>

          <ParamCDemo />

          <div className="mt-4">
            <Tip color="amber">
              El parámetro <code>C</code> controla el <strong>trade-off entre margen y errores</strong>:
              C pequeño → margen amplio (más tolerante), C grande → margen estrecho (más estricto, riesgo de overfitting).
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 4 — No lineal
        ══════════════════════════ */}
        <section id="no-lineal" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "180ms" }}>
          <SectionHeader icon="🌀" title="Casos No Linealmente Separables" color="#06b6d4" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El Support Vector Classifier funciona bien cuando el límite es <strong className="text-white">aproximadamente lineal</strong>.
            Si no lo es, su capacidad cae drásticamente. La solución: <strong className="text-white">expandir las dimensiones</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-cyan-300 text-xs font-bold mb-3">ESPACIO ORIGINAL (2D)</p>
              <svg viewBox="0 0 140 100" className="w-full">
                {/* Puntos en círculo - no separables linealmente */}
                {[0,60,120,180,240,300].map((a, i) => {
                  const r = 35, cx = 70, cy = 50;
                  const x = cx + r * Math.cos(a * Math.PI / 180);
                  const y = cy + r * Math.sin(a * Math.PI / 180);
                  return <circle key={i} cx={x} cy={y} r={5} fill="#3b82f6" stroke="rgba(147,197,253,0.5)" strokeWidth={1.5} />;
                })}
                {[30,90,150,210,270,330].map((a, i) => {
                  const r = 15, cx = 70, cy = 50;
                  const x = cx + r * Math.cos(a * Math.PI / 180);
                  const y = cy + r * Math.sin(a * Math.PI / 180);
                  return <circle key={i} cx={x} cy={y} r={5} fill="#eab308" stroke="rgba(253,224,71,0.5)" strokeWidth={1.5} />;
                })}
                <text x={70} y={95} textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize={9} fontFamily="monospace">no separable</text>
              </svg>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-300 text-xs font-bold mb-3">ESPACIO AMPLIADO (3D)</p>
              <svg viewBox="0 0 140 100" className="w-full">
                {[0,60,120,180,240,300].map((a, i) => {
                  const r = 35, cx = 70, cy = 65;
                  const x = cx + r * Math.cos(a * Math.PI / 180) * 0.9;
                  const y = cy + r * Math.sin(a * Math.PI / 180) * 0.4 - 25;
                  return <circle key={i} cx={x} cy={y} r={5} fill="#3b82f6" stroke="rgba(147,197,253,0.5)" strokeWidth={1.5} />;
                })}
                {[30,90,150,210,270,330].map((a, i) => {
                  const r = 15, cx = 70, cy = 65;
                  const x = cx + r * Math.cos(a * Math.PI / 180) * 0.9;
                  const y = cy + r * Math.sin(a * Math.PI / 180) * 0.4 + 15;
                  return <circle key={i} cx={x} cy={y} r={5} fill="#eab308" stroke="rgba(253,224,71,0.5)" strokeWidth={1.5} />;
                })}
                {/* Plano separador */}
                <ellipse cx={70} cy={55} rx={55} ry={12} fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth={1.5} />
                <text x={70} y={95} textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize={9} fontFamily="monospace">¡separable!</text>
              </svg>
            </div>
          </div>

          <Tip color="sky">
            El <strong>método SVM</strong> se puede ver como una extensión que aumenta dimensiones automáticamente.
            Los límites lineales en el espacio ampliado se convierten en fronteras <strong>no lineales</strong> al proyectarse al original.
          </Tip>
        </section>

        {/* ══════════════════════════
            SECCIÓN 5 — Kernels
        ══════════════════════════ */}
        <section id="kernels" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="🔮" title="Kernel Trick" color="#8b5cf6" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Un <strong className="text-white">kernel K(x, x')</strong> devuelve el resultado del producto escalar
            entre dos vectores en un espacio dimensional mayor. Al sustituir el producto escalar del problema
            de optimización por un kernel, obtenemos el hiperplano en la dimensión deseada sin calcularla explícitamente.
            A esto se llama <strong className="text-white">kernel trick</strong>.
          </p>

          <div className="space-y-3 mb-6">
            {[
              {
                name: "Kernel Lineal",
                color: "#10b981",
                formula: "K(x,x') = x · x'",
                desc: "Equivale a no usar kernel. Rápido, ideal para datos linealmente separables.",
              },
              {
                name: "Kernel Polinómico",
                color: "#f59e0b",
                formula: "K(x,x') = (x·x' + c)^d",
                desc: "d=1, c=0 → lineal. d>1 → fronteras no lineales. No usar d>5 (overfitting).",
              },
              {
                name: "Kernel Gaussiano (RBF)",
                color: "#8b5cf6",
                formula: "K(x,x') = e^(-γ||x-x'||²)",
                desc: "El más versátil. γ pequeño → modelo lineal. γ grande → modelo muy flexible.",
                badge: "✨ Recomendado",
              },
            ].map((k) => (
              <div key={k.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-sm" style={{ color: k.color }}>{k.name}</span>
                  {k.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{k.badge}</span>}
                </div>
                <div className="bg-black/30 rounded-lg px-3 py-2 mb-2">
                  <code className="text-xs" style={{ color: k.color }}>{k.formula}</code>
                </div>
                <p className="text-xs text-gray-400">{k.desc}</p>
              </div>
            ))}
          </div>

          <KernelDemo />

          <div className="mt-4">
            <Tip color="violet">
              El <strong>kernel RBF</strong> es el recomendado para empezar: solo tiene dos hiperparámetros
              (γ y C) y puede modelar desde fronteras lineales hasta muy complejas.
              Su valor óptimo se encuentra con <code>validación cruzada</code>.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 6 — Práctica
        ══════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "300ms" }}>
          <SectionHeader icon="💻" title="Práctica con sklearn" color="#10b981" />
          <p className="text-gray-400 mb-5">
            Implementación completa con <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">scikit-learn</code>.
            Primero un modelo lineal y luego uno con kernel Gaussiano.
          </p>

          {/* Ejemplo 1 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ejemplo 1</span>
              <span className="text-sm text-white font-bold">SVM Lineal</span>
            </div>

            <CodeBlock>
              <p className="text-gray-500"># Importar librerías</p>
              <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-white"> np</span></p>
              <p><span className="text-sky-400">import</span><span className="text-white"> pandas </span><span className="text-sky-400">as</span><span className="text-white"> pd</span></p>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.svm </span><span className="text-sky-400">import</span><span className="text-white"> SVC</span></p>
            </CodeBlock>

            <CodeBlock>
              <p className="text-gray-500"># Cargar datos</p>
              <p><span className="text-emerald-400">dataset</span><span className="text-white"> = pd.</span><span className="text-sky-400">read_csv</span><span className="text-white">(</span><span className="text-green-300">'datos/svm.csv'</span><span className="text-white">, sep=</span><span className="text-green-300">'\t'</span><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">X</span><span className="text-white"> = np.</span><span className="text-sky-400">array</span><span className="text-white">(dataset[[</span><span className="text-green-300">'X1'</span><span className="text-white">,</span><span className="text-green-300">'X2'</span><span className="text-white">]])</span></p>
              <p><span className="text-emerald-400">y</span><span className="text-white"> = np.</span><span className="text-sky-400">array</span><span className="text-white">(dataset[</span><span className="text-green-300">'y'</span><span className="text-white">])</span></p>
            </CodeBlock>

            <CodeBlock>
              <p className="text-gray-500"># Entrenar modelo lineal con C=1</p>
              <p><span className="text-emerald-400">clf</span><span className="text-white"> = </span><span className="text-sky-400">SVC</span><span className="text-white">(C=</span><span className="text-amber-300">1</span><span className="text-white">, kernel=</span><span className="text-green-300">'linear'</span><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">clf</span><span className="text-white">.</span><span className="text-sky-400">fit</span><span className="text-white">(X, y)</span></p>
            </CodeBlock>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-3">
              <p className="text-emerald-300 text-xs font-bold mb-2">RESULTADO — C=1 vs C=100</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/20 rounded-lg p-3">
                  <code className="text-emerald-400">C = 1</code>
                  <p className="text-gray-400 mt-1">Margen más amplio, tolera 1 punto mal clasificado intencionalmente.</p>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <code className="text-amber-400">C = 100</code>
                  <p className="text-gray-400 mt-1">Más estricto: intenta clasificar correctamente todos los puntos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ejemplo 2 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">Ejemplo 2</span>
              <span className="text-sm text-white font-bold">SVM con Kernel Gaussiano (RBF)</span>
            </div>

            <CodeBlock>
              <p className="text-gray-500"># Kernel RBF para datos no lineales</p>
              <p><span className="text-emerald-400">clf</span><span className="text-white"> = </span><span className="text-sky-400">SVC</span><span className="text-white">(</span></p>
              <p><span className="ml-8 text-white">C=</span><span className="text-amber-300">1</span><span className="text-white">,</span></p>
              <p><span className="ml-8 text-white">kernel=</span><span className="text-green-300">'rbf'</span><span className="text-white">,</span></p>
              <p><span className="ml-8 text-white">gamma=</span><span className="text-amber-300">100</span></p>
              <p><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">clf</span><span className="text-white">.</span><span className="text-sky-400">fit</span><span className="text-white">(X, y)</span></p>
            </CodeBlock>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-violet-300 text-xs font-bold mb-2">HIPERPARÁMETROS CLAVE</p>
              <div className="space-y-2 text-xs">
                {[
                  { p: "C", desc: "Penalización de errores. Mayor C → más estricto.", color: "#f59e0b" },
                  { p: "kernel", desc: "'linear', 'poly', 'rbf'. Elige según la naturaleza del problema.", color: "#8b5cf6" },
                  { p: "gamma", desc: "Solo en RBF. Controla la flexibilidad del modelo.", color: "#06b6d4" },
                  { p: "degree", desc: "Solo en polinómico. Grado d del polinomio (evitar d>5).", color: "#10b981" },
                ].map((h) => (
                  <div key={h.p} className="flex gap-3 items-start">
                    <code className="shrink-0 font-bold" style={{ color: h.color }}>{h.p}</code>
                    <p className="text-gray-400">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "340ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "Hiperplano",       desc: "Frontera de decisión que separa clases. En 2D es una recta; en nD un subespacio.", color: "#8b5cf6" },
              { code: "Margen máximo",    desc: "SVM elige el hiperplano con la mayor distancia a los puntos más cercanos de cada clase.", color: "#3b82f6" },
              { code: "Parámetro C",      desc: "Controla tolerancia a errores. C alto → estricto, C bajo → margen amplio.", color: "#f59e0b" },
              { code: "Kernel trick",     desc: "Proyecta datos a un espacio mayor para separar clases no linealmente separables.", color: "#06b6d4" },
              { code: "RBF (Gaussiano)",  desc: "Kernel más versátil. Dos hiperparámetros: C y γ. Recomendado para empezar.", color: "#10b981" },
              { code: "SVC(kernel='rbf')", desc: "Implementación en sklearn. Usa .fit(X, y) para entrenar y .predict() para clasificar.", color: "#6366f1" },
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
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">← Volver al inicio</button>
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Machine Learning · SVM</span>
        </div>

      </div>
    </div>
  );
}