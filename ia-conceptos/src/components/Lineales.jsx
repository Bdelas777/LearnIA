
// RegularizacionModelosLineales.jsx — Módulo IV: Machine Learning con Python
// Contenido basado en el notebook: Regularización en Modelos Lineales

import { useState, useRef, useEffect } from "react";

// ── Demo: Overfitting / Underfitting ─────────────────────────────
function OverfittingDemo() {
  const canvasRef = useRef(null);
  const [grado, setGrado] = useState(1);

  // Datos sintéticos con una tendencia cuadrática + ruido
  const datos = [
    [0.5, 1.8], [1.0, 2.5], [1.5, 2.1], [2.0, 3.4], [2.5, 3.0],
    [3.0, 4.2], [3.5, 3.8], [4.0, 5.1], [4.5, 4.6], [5.0, 6.2],
    [5.5, 5.8], [6.0, 7.1], [6.5, 6.5], [7.0, 7.9], [7.5, 7.4],
  ];

  // Evaluación polinómica (Vandermonde simple)
  const polyEval = (coeffs, x) => coeffs.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);

  // Ajuste polinómico mínimos cuadrados simple con Vandermonde
  const fitPoly = (pts, deg) => {
    const n = pts.length;
    const A = pts.map(([x]) => Array.from({ length: deg + 1 }, (_, k) => Math.pow(x, k)));
    const b = pts.map(([, y]) => y);
    // Pseudo-inversa simplificada via normal equations (A^T A)^{-1} A^T b
    const AT = A[0].map((_, ci) => A.map((r) => r[ci]));
    const ATA = AT.map((row) => AT[0].map((_, ci) => row.reduce((s, v, ri) => s + v * AT[ci][ri], 0)));
    const ATb = AT.map((row) => row.reduce((s, v, ri) => s + v * b[ri], 0));
    // Gauss elimination
    const m = ATA.map((r, i) => [...r, ATb[i]]);
    for (let col = 0; col < deg + 1; col++) {
      let maxRow = col;
      for (let r = col + 1; r < deg + 1; r++) if (Math.abs(m[r][col]) > Math.abs(m[maxRow][col])) maxRow = r;
      [m[col], m[maxRow]] = [m[maxRow], m[col]];
      for (let r = col + 1; r < deg + 1; r++) {
        const factor = m[r][col] / (m[col][col] || 1e-10);
        for (let c = col; c <= deg + 1; c++) m[r][c] -= factor * m[col][c];
      }
    }
    const coeffs = new Array(deg + 1).fill(0);
    for (let i = deg; i >= 0; i--) {
      coeffs[i] = (m[i][deg + 1] - coeffs.slice(i + 1).reduce((s, c, j) => s + c * m[i][i + 1 + j], 0)) / (m[i][i] || 1e-10);
    }
    return coeffs;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pad = { l: 30, r: 16, t: 16, b: 28 };
    const xMin = 0, xMax = 8, yMin = 0, yMax = 10;
    const sx = (x) => pad.l + ((x - xMin) / (xMax - xMin)) * (W - pad.l - pad.r);
    const sy = (y) => H - pad.b - ((y - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 8; x += 2) { ctx.beginPath(); ctx.moveTo(sx(x), sy(yMin)); ctx.lineTo(sx(x), sy(yMax)); ctx.stroke(); }
    for (let y = 0; y <= 10; y += 2) { ctx.beginPath(); ctx.moveTo(sx(xMin), sy(y)); ctx.lineTo(sx(xMax), sy(y)); ctx.stroke(); }

    // Ejes
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx(xMin), sy(yMin)); ctx.lineTo(sx(xMax), sy(yMin)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx(xMin), sy(yMin)); ctx.lineTo(sx(xMin), sy(yMax)); ctx.stroke();

    // Curva ajustada
    let coeffs;
    try { coeffs = fitPoly(datos, Math.min(grado, 8)); } catch { coeffs = [0]; }

    const color = grado <= 1 ? "#f59e0b" : grado <= 3 ? "#10b981" : "#ef4444";
    ctx.beginPath();
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = Math.max(yMin - 1, Math.min(yMax + 1, polyEval(coeffs, x)));
      if (i === 0) ctx.moveTo(sx(x), sy(y));
      else ctx.lineTo(sx(x), sy(y));
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.stroke();

    // Datos
    datos.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(sx(x), sy(y), 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#60a5fa";
      ctx.fill();
      ctx.strokeStyle = "rgba(147,197,253,0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Labels ejes
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "9px monospace";
    ctx.fillText("x", sx(xMax) - 6, sy(yMin) + 16);
    ctx.fillText("y", sx(xMin) - 12, sy(yMax) + 4);
  }, [grado]);

  const estado = grado <= 1 ? "underfitting" : grado <= 3 ? "óptimo" : "overfitting";
  const estadoColor = { underfitting: "#f59e0b", óptimo: "#10b981", overfitting: "#ef4444" }[estado];
  const estadoDesc = {
    underfitting: "Modelo demasiado simple. No captura la tendencia real de los datos.",
    óptimo:       "Balance perfecto. Generaliza bien a datos nuevos.",
    overfitting:  "Modelo sobreajustado. Memoriza el ruido en lugar de aprender la tendencia.",
  }[estado];

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Underfitting vs Overfitting</p>
      <p className="text-gray-400 text-xs mb-4">
        Aumenta el <span className="text-amber-400 font-mono">grado polinómico</span> del modelo y observa cómo pasa de
        subajustarse a sobreajustarse.
      </p>

      <canvas ref={canvasRef} width={280} height={200}
        className="rounded-xl border border-white/10 bg-black/30 w-full mb-4" style={{ maxWidth: 280 }} />

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Grado polinómico</span>
          <span className="font-mono font-bold" style={{ color: estadoColor }}>d = {grado}</span>
        </div>
        <input type="range" min={1} max={10} value={grado}
          onChange={(e) => setGrado(Number(e.target.value))}
          className="w-full cursor-pointer" style={{ accentColor: estadoColor }} />
        <div className="flex justify-between text-xs text-gray-600 font-mono mt-0.5">
          <span>1</span><span>5</span><span>10</span>
        </div>
      </div>

      <div className="rounded-lg border px-4 py-3 transition-all duration-300"
        style={{ borderColor: estadoColor + "50", background: estadoColor + "10" }}>
        <p className="text-xs font-bold mb-1" style={{ color: estadoColor }}>
          {estado === "underfitting" && "⚠️ Underfitting"}
          {estado === "óptimo" && "✓ Modelo óptimo"}
          {estado === "overfitting" && "🔥 Overfitting"}
        </p>
        <p className="text-xs text-gray-400">{estadoDesc}</p>
      </div>
    </div>
  );
}

// ── Demo: Normas L1 vs L2 ─────────────────────────────────────────
function NormasDemo() {
  const [modo, setModo] = useState("L1");

  // Coeficientes simulados de un modelo con 6 features
  const beta = [3.2, -1.8, 0.5, -2.9, 1.1, -0.3];
  const names = ["β₁", "β₂", "β₃", "β₄", "β₅", "β₆"];

  const l1 = beta.reduce((s, b) => s + Math.abs(b), 0);
  const l2 = Math.sqrt(beta.reduce((s, b) => s + b ** 2, 0));

  const W = 260, H = 140;
  const barW = 30, gap = 8;
  const pad = { t: 16, r: 12, b: 28, l: 36 };
  const maxVal = 3.5;

  const barColor = (b, i) =>
    modo === "L1"
      ? b >= 0 ? "#f59e0b" : "#f43f5e"
      : ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"][i];

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Normas L1 y L2</p>

      <div className="flex gap-2 mb-4">
        {["L1", "L2"].map((m) => (
          <button key={m} onClick={() => setModo(m)}
            className={`text-xs px-4 py-1.5 rounded-lg border transition-all font-mono
              ${modo === m
                ? "border-sky-400 bg-sky-400/20 text-sky-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            Norma {m}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H + pad.t + pad.b}`}
        className="w-full rounded-xl border border-white/10 bg-black/30 mb-4" style={{ height: 180 }}>
        {/* Línea cero */}
        <line x1={pad.l} y1={pad.t + H / 2} x2={W - pad.r} y2={pad.t + H / 2}
          stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        {/* Labels eje Y */}
        {[-3, -1.5, 0, 1.5, 3].map((v) => {
          const y = pad.t + H / 2 - (v / maxVal) * (H / 2);
          return (
            <text key={v} x={pad.l - 4} y={y + 1} textAnchor="end" dominantBaseline="middle"
              fill="rgba(255,255,255,0.2)" fontSize={7} fontFamily="monospace">{v}</text>
          );
        })}
        {/* Barras */}
        {beta.map((b, i) => {
          const x = pad.l + i * (barW + gap);
          const cy = pad.t + H / 2;
          const bh = (Math.abs(b) / maxVal) * (H / 2);
          const y = b >= 0 ? cy - bh : cy;
          const val = modo === "L1" ? Math.abs(b) : b ** 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={bh} rx={3}
                fill={barColor(b, i)} opacity={0.85} />
              <text x={x + barW / 2} y={b >= 0 ? y - 5 : y + bh + 11} textAnchor="middle"
                fill={barColor(b, i)} fontSize={8} fontFamily="monospace" fontWeight="bold">
                {modo === "L1" ? `|${b}|` : `${b}²`}
              </text>
              <text x={x + barW / 2} y={pad.t + H + 14} textAnchor="middle"
                fill="rgba(255,255,255,0.35)" fontSize={8} fontFamily="monospace">{names[i]}</text>
            </g>
          );
        })}
      </svg>

      {/* Resultado */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl border p-3 transition-all ${modo === "L1" ? "border-amber-400/50 bg-amber-500/10" : "border-white/10 bg-white/[0.02]"}`}>
          <p className="text-xs text-gray-500 mb-1 font-bold">NORMA L1</p>
          <p className="font-mono text-xs text-gray-400 mb-1">Σ |βᵢ|</p>
          <p className="font-mono font-black text-lg text-amber-400">{l1.toFixed(2)}</p>
        </div>
        <div className={`rounded-xl border p-3 transition-all ${modo === "L2" ? "border-violet-400/50 bg-violet-500/10" : "border-white/10 bg-white/[0.02]"}`}>
          <p className="text-xs text-gray-500 mb-1 font-bold">NORMA L2</p>
          <p className="font-mono text-xs text-gray-400 mb-1">√ Σ βᵢ²</p>
          <p className="font-mono font-black text-lg text-violet-400">{l2.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

// ── Demo: Lambda y reducción de coeficientes ──────────────────────
function LambdaDemo() {
  const [metodo, setMetodo] = useState("lasso");
  const [lambda, setLambda] = useState(0.1);

  // Coeficientes simulados "sin regularización"
  const betaBase = [4.2, -3.1, 0.8, -2.4, 1.6, -0.6, 2.1, -1.3];
  const names = ["β₁", "β₂", "β₃", "β₄", "β₅", "β₆", "β₇", "β₈"];

  // Lasso: soft thresholding (puede llegar exactamente a 0)
  const applyLasso = (b, lam) => {
    const shrink = lam * 5;
    return Math.sign(b) * Math.max(0, Math.abs(b) - shrink);
  };
  // Ridge: shrinkage proporcional (nunca llega a 0)
  const applyRidge = (b, lam) => b / (1 + lam * 8);
  // ElasticNet: combinación
  const applyElastic = (b, lam) => {
    const lassoP = applyLasso(b, lam * 0.5);
    const ridgeP = applyRidge(b, lam * 0.5);
    return (lassoP + ridgeP) / 2;
  };

  const fn = { lasso: applyLasso, ridge: applyRidge, elasticnet: applyElastic }[metodo];
  const betaReg = betaBase.map((b) => fn(b, lambda));
  const ceros = betaReg.filter((b) => Math.abs(b) < 0.01).length;

  const metodos = [
    { key: "lasso",      label: "Lasso (L1)",    color: "#f59e0b" },
    { key: "ridge",      label: "Ridge (L2)",    color: "#8b5cf6" },
    { key: "elasticnet", label: "ElasticNet",    color: "#06b6d4" },
  ];
  const col = metodos.find((m) => m.key === metodo).color;

  const W = 280, H = 120, pad = { t: 10, r: 10, b: 24, l: 20 };
  const barW = (W - pad.l - pad.r) / betaBase.length - 4;
  const maxAbs = 4.5;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Efecto de λ sobre los coeficientes</p>

      {/* Selector método */}
      <div className="flex gap-2 flex-wrap mb-4">
        {metodos.map((m) => (
          <button key={m.key} onClick={() => setMetodo(m.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono
              ${metodo === m.key
                ? "border-current bg-current/10"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}
            style={metodo === m.key ? { color: m.color, borderColor: m.color + "80" } : {}}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Antes / Después side by side */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[false, true].map((reg) => (
          <div key={String(reg)} className="rounded-xl border border-white/10 bg-black/20 p-2">
            <p className="text-xs text-center font-bold mb-2" style={{ color: reg ? col : "rgba(255,255,255,0.4)" }}>
              {reg ? `Con λ=${lambda.toFixed(2)}` : "Sin regularizar"}
            </p>
            <svg viewBox={`0 0 ${W} ${H + pad.t + pad.b}`} style={{ height: 100 }} className="w-full">
              <line x1={pad.l} y1={pad.t + H / 2} x2={W - pad.r} y2={pad.t + H / 2}
                stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              {(reg ? betaReg : betaBase).map((b, i) => {
                const x = pad.l + i * (barW + 4);
                const cy = pad.t + H / 2;
                const bh = (Math.abs(b) / maxAbs) * (H / 2);
                const y = b >= 0 ? cy - bh : cy;
                const isZero = Math.abs(b) < 0.01;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width={barW} height={Math.max(bh, isZero && reg ? 2 : 0)}
                      rx={2} fill={reg ? col : "#64748b"} opacity={isZero ? 0.2 : 0.85} />
                    <text x={x + barW / 2} y={pad.t + H + 14} textAnchor="middle"
                      fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">{names[i]}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        ))}
      </div>

      {/* Slider lambda */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Penalización λ</span>
          <span className="font-mono font-bold" style={{ color: col }}>{lambda.toFixed(2)}</span>
        </div>
        <input type="range" min={0} max={1} step={0.01} value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
          className="w-full cursor-pointer" style={{ accentColor: col }} />
        <div className="flex justify-between text-xs text-gray-600 font-mono mt-0.5">
          <span>0 (sin reg.)</span><span>1 (máx. reg.)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        {metodo === "lasso" && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs">
            <span className="text-amber-400 font-bold">{ceros}</span>
            <span className="text-gray-400"> coef. exactamente en </span>
            <span className="text-amber-400 font-mono">0</span>
          </div>
        )}
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400">
          Reducción L1: <span className="font-mono font-bold" style={{ color: col }}>
            {Math.round((1 - betaReg.reduce((s, b) => s + Math.abs(b), 0) / betaBase.reduce((s, b) => s + Math.abs(b), 0)) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Demo: Comparativa de modelos ──────────────────────────────────
function ComparativaDemo() {
  // Valores aproximados del notebook vehiculos.csv
  const modelos = [
    { nombre: "Lineal",     l1: 892.4, l2: 124.3, rl1: 0,    rl2: 0,    color: "#64748b" },
    { nombre: "Lasso",      l1: 38.7,  l2: 12.1,  rl1: 0.957, rl2: 0.903, color: "#f59e0b" },
    { nombre: "Ridge",      l1: 210.5, l2: 28.4,  rl1: 0.764, rl2: 0.771, color: "#8b5cf6" },
    { nombre: "ElasticNet", l1: 82.3,  l2: 20.6,  rl1: 0.908, rl2: 0.834, color: "#06b6d4" },
  ];
  const [vista, setVista] = useState("normas");

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="text-rose-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Tabla comparativa de modelos</p>

      <div className="flex gap-2 mb-4">
        {[
          { key: "normas",    label: "Normas L1 / L2" },
          { key: "reduccion", label: "% Reducción" },
        ].map((v) => (
          <button key={v.key} onClick={() => setVista(v.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono
              ${vista === v.key
                ? "border-rose-400 bg-rose-400/20 text-rose-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {vista === "normas" ? (
        <div className="space-y-2">
          {modelos.map((m) => (
            <div key={m.nombre} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm" style={{ color: m.color }}>{m.nombre}</span>
                <div className="flex gap-3 text-xs font-mono">
                  <span className="text-gray-500">L1: <span className="text-white">{m.l1.toFixed(1)}</span></span>
                  <span className="text-gray-500">L2: <span className="text-white">{m.l2.toFixed(1)}</span></span>
                </div>
              </div>
              {/* Barras L1 y L2 */}
              <div className="space-y-1.5">
                {[["L1", m.l1, 892.4, "#f59e0b"], ["L2", m.l2, 124.3, "#8b5cf6"]].map(([label, val, max, c]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs font-mono w-4" style={{ color: c }}>{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(val / max) * 100}%`, background: c, opacity: 0.8 }} />
                    </div>
                    <span className="text-xs font-mono text-gray-500 w-16 text-right">{val.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {modelos.slice(1).map((m) => (
            <div key={m.nombre} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm" style={{ color: m.color }}>{m.nombre}</span>
              </div>
              <div className="space-y-2">
                {[["Reducción L1", m.rl1, "#f59e0b"], ["Reducción L2", m.rl2, "#8b5cf6"]].map(([label, val, c]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-24">{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${val * 100}%`, background: c, opacity: 0.85 }} />
                    </div>
                    <span className="text-xs font-mono font-bold w-12 text-right" style={{ color: c }}>
                      {(val * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
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

function Formula({ children }) {
  return (
    <div className="bg-black/30 border border-violet-500/20 rounded-xl p-4 mb-4 text-center">
      <span className="font-mono text-violet-300 text-sm">{children}</span>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function RegularizacionModelosLineales({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-amber-900/15 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-violet-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-rose-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Machine Learning</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-amber-400" style={{ fontFamily: "monospace" }}>Regularización</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#f59e0b", color: "#f59e0b", fontFamily: "monospace" }}>
            🤖 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Regularización en{" "}
            <span style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Modelos Lineales</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Técnica para controlar la <code className="text-amber-400 bg-amber-500/10 px-1 rounded">complejidad</code> de un modelo
            y evitar el <code className="text-rose-400 bg-rose-500/10 px-1 rounded">overfitting</code>.
            Aprende las normas <code className="text-sky-400 bg-sky-500/10 px-1 rounded">L1</code> y{" "}
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded">L2</code>, y los métodos
            Lasso, Ridge y ElasticNet.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#intro",     label: "📖 Introducción" },
            { href: "#normas",    label: "📐 Normas L1 y L2" },
            { href: "#metodos",   label: "🔧 Métodos" },
            { href: "#lambda",    label: "⚖️ Efecto de λ" },
            { href: "#practica",  label: "💻 Práctica sklearn" },
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
          <SectionHeader icon="📖" title="Introducción" color="#f59e0b" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Al desarrollar modelos de machine learning, la <strong className="text-white">complejidad del modelo</strong> es
            un factor clave. Existe un equilibrio delicado entre dos extremos problemáticos:
          </p>

          {/* Tarjetas underfitting / óptimo / overfitting */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              {
                icon: "📉", title: "Underfitting", color: "#f59e0b",
                desc: "Modelo muy simple. Sobregeneraliza. Alta tasa de error en entrenamiento y validación.",
                badge: "Poco complejo",
              },
              {
                icon: "✅", title: "Modelo Óptimo", color: "#10b981",
                desc: "Balance perfecto entre sesgo y varianza. Generaliza bien a datos nuevos.",
                badge: "Complejidad justa",
              },
              {
                icon: "🔥", title: "Overfitting", color: "#ef4444",
                desc: "Modelo demasiado complejo. Memoriza el ruido. Excelente en entrenamiento, malo en validación.",
                badge: "Muy complejo",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border p-4"
                style={{ borderColor: c.color + "40", background: c.color + "08" }}>
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="font-bold text-sm mb-1" style={{ color: c.color }}>{c.title}</p>
                <p className="text-xs text-gray-500 mb-2">{c.desc}</p>
                <span className="text-xs px-2 py-0.5 rounded-full border"
                  style={{ borderColor: c.color + "50", color: c.color, background: c.color + "15" }}>
                  {c.badge}
                </span>
              </div>
            ))}
          </div>

          <OverfittingDemo />

          <div className="mt-4">
            <Tip color="amber">
              Los modelos con <strong>overfitting</strong> tienen precisión muy alta en entrenamiento pero
              pobre desempeño en validación. La <strong>regularización</strong> penaliza la complejidad
              para forzar al modelo a generalizarse mejor.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 2 — Normas
        ══════════════════════════ */}
        <section id="normas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "60ms" }}>
          <SectionHeader icon="📐" title="Medidas de Complejidad: Normas L1 y L2" color="#0ea5e9" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            En modelos lineales, la complejidad se mide con las normas <strong className="text-white">L1</strong> y{" "}
            <strong className="text-white">L2</strong> de los coeficientes <code className="text-violet-400">βᵢ</code>.
            A mayor norma, mayor complejidad del modelo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm text-amber-400 font-mono">Norma L1</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">Valor absoluto</span>
              </div>
              <Formula>L₁ = Σ |βᵢ|</Formula>
              <p className="text-xs text-gray-400">
                Suma de los <strong className="text-white">valores absolutos</strong> de los coeficientes.
                Penaliza por igual coeficientes grandes y pequeños. Base de <strong className="text-amber-400">Lasso</strong>.
              </p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm text-violet-400 font-mono">Norma L2</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">Cuadrados</span>
              </div>
              <Formula>L₂ = Σ βᵢ²</Formula>
              <p className="text-xs text-gray-400">
                Suma de los <strong className="text-white">cuadrados</strong> de los coeficientes.
                Penaliza con más fuerza los coeficientes grandes. Base de <strong className="text-violet-400">Ridge</strong>.
              </p>
            </div>
          </div>

          <NormasDemo />

          <div className="mt-4">
            <Tip color="sky">
              La norma <strong>L1 puede llevar coeficientes exactamente a cero</strong>, lo que equivale a
              eliminar variables del modelo (selección de características).
              La norma <strong>L2 solo los reduce</strong>, nunca los elimina por completo.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 3 — Métodos
        ══════════════════════════ */}
        <section id="metodos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="🔧" title="Métodos de Regularización" color="#8b5cf6" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Todos los métodos añaden un <strong className="text-white">término de penalización</strong> a la función
            de pérdida original. El parámetro <code className="text-amber-400">λ</code> controla cuánto peso
            tiene esa penalización.
          </p>

          <div className="space-y-4">
            {/* Lasso */}
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30">L</span>
                <div>
                  <p className="font-bold text-white">Regularización Lasso</p>
                  <p className="text-xs text-gray-500">Usa norma L1 · Puede eliminar variables</p>
                </div>
              </div>
              <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3 mb-3 font-mono text-xs text-amber-300 text-center">
                min Σ(yᵢ − (α̂ + β̂xᵢ))² + λ Σ|βᵢ|,  con 0 ≤ λ ≤ 1
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-amber-400 font-bold mb-1">✓ Ventajas</p>
                  <p className="text-gray-400">Selección automática de variables. Coeficientes exactamente cero.</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-rose-400 font-bold mb-1">✗ Limitaciones</p>
                  <p className="text-gray-400">Con variables correlacionadas, puede eliminar arbitrariamente una de ellas.</p>
                </div>
              </div>
            </div>

            {/* Ridge */}
            <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm bg-violet-500/20 text-violet-400 border border-violet-500/30">R</span>
                <div>
                  <p className="font-bold text-white">Regularización Ridge</p>
                  <p className="text-xs text-gray-500">Usa norma L2 · Reduce coeficientes pero no los elimina</p>
                </div>
              </div>
              <div className="bg-black/30 border border-violet-500/20 rounded-xl p-3 mb-3 font-mono text-xs text-violet-300 text-center">
                min Σ(yᵢ − (α̂ + β̂xᵢ))² + λ Σβᵢ²,  con 0 ≤ λ ≤ 1
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-violet-400 font-bold mb-1">✓ Ventajas</p>
                  <p className="text-gray-400">Maneja bien variables correlacionadas. Coeficientes estables.</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-rose-400 font-bold mb-1">✗ Limitaciones</p>
                  <p className="text-gray-400">No elimina variables. El modelo siempre usa todas las features.</p>
                </div>
              </div>
            </div>

            {/* ElasticNet */}
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">E</span>
                <div>
                  <p className="font-bold text-white">Regularización ElasticNet</p>
                  <p className="text-xs text-gray-500">Combina L1 + L2 · Lo mejor de ambos mundos</p>
                </div>
              </div>
              <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-3 mb-3 font-mono text-xs text-cyan-300 text-center">
                min Σ(yᵢ − ŷᵢ)² + λ₁Σ|βᵢ| + λ₂Σβᵢ²
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-cyan-400 font-bold mb-1">✓ Ventajas</p>
                  <p className="text-gray-400">Combina selección de variables (L1) con estabilidad (L2). Más flexible.</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <p className="text-rose-400 font-bold mb-1">✗ Limitaciones</p>
                  <p className="text-gray-400">Dos hiperparámetros a ajustar (λ₁ y λ₂). Mayor costo computacional.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 4 — Lambda
        ══════════════════════════ */}
        <section id="lambda" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "180ms" }}>
          <SectionHeader icon="⚖️" title="Efecto del Parámetro λ" color="#10b981" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El parámetro <code className="text-amber-400 bg-amber-500/10 px-1 rounded">λ</code> (lambda) controla
            la fuerza de la penalización. Con <code className="text-amber-400">λ=0</code> el modelo es igual al
            lineal sin regularización. Con <code className="text-amber-400">λ=1</code> la penalización es máxima.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="font-mono text-2xl font-black text-amber-400 mb-1">λ → 0</p>
              <p className="text-xs text-gray-400">Sin penalización. Coeficientes libres. Riesgo de overfitting.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="font-mono text-2xl font-black text-rose-400 mb-1">λ → 1</p>
              <p className="text-xs text-gray-400">Penalización máxima. Coeficientes muy reducidos o cero.</p>
            </div>
          </div>

          <LambdaDemo />

          <div className="mt-4">
            <Tip color="emerald">
              Con <strong>Lasso</strong>, al aumentar λ los coeficientes menos importantes llegan exactamente a{" "}
              <code>0</code>, eliminando esas variables del modelo. Esto es equivalente a una
              <strong> selección automática de características</strong>.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 5 — Práctica
        ══════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="💻" title="Práctica con sklearn — Dataset Vehículos" color="#ef4444" />
          <p className="text-gray-400 mb-5">
            Comparación de 4 modelos para predecir <code className="text-rose-400 bg-rose-500/10 px-1 rounded">co2</code> de
            vehículos a partir de desplazamiento, cilindros y consumo, usando
            variables polinómicas de grado 3.
          </p>

          {[
            {
              label: "1 · Importar librerías", color: "#10b981",
              code: (
                <>
                  <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-white"> np</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> numpy.linalg </span><span className="text-sky-400">import</span><span className="text-white"> norm</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.preprocessing </span><span className="text-sky-400">import</span><span className="text-white"> PolynomialFeatures</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.linear_model </span><span className="text-sky-400">import</span><span className="text-white"> (</span></p>
                  <p><span className="ml-8 text-white">LinearRegression, Lasso, Ridge, ElasticNet</span></p>
                  <p><span className="text-white">)</span></p>
                </>
              )
            },
            {
              label: "2 · Preparar datos polinómicos", color: "#3b82f6",
              code: (
                <>
                  <p><span className="text-emerald-400">X</span><span className="text-white"> = dataset[[</span><span className="text-green-300">"desplazamiento"</span><span className="text-white">,</span><span className="text-green-300">"cilindros"</span><span className="text-white">,</span><span className="text-green-300">"consumo"</span><span className="text-white">]]</span></p>
                  <p><span className="text-emerald-400">y</span><span className="text-white"> = dataset[</span><span className="text-green-300">"co2"</span><span className="text-white">]</span></p>
                  <p className="mt-1 text-gray-500"># Generar features polinómicos grado 3</p>
                  <p><span className="text-emerald-400">newX</span><span className="text-white"> = </span><span className="text-sky-400">PolynomialFeatures</span><span className="text-white">(</span><span className="text-amber-300">3</span><span className="text-white">).</span><span className="text-sky-400">fit_transform</span><span className="text-white">(X)</span></p>
                </>
              )
            },
            {
              label: "3 · Entrenar los 4 modelos", color: "#8b5cf6",
              code: (
                <>
                  <p><span className="text-emerald-400">modelo_lineal</span><span className="text-white">  = </span><span className="text-sky-400">LinearRegression</span><span className="text-white">().</span><span className="text-sky-400">fit</span><span className="text-white">(newX, y)</span></p>
                  <p><span className="text-emerald-400">modelo_lasso</span><span className="text-white">   = </span><span className="text-sky-400">Lasso</span><span className="text-white">(tol=</span><span className="text-amber-300">0.01</span><span className="text-white">, max_iter=</span><span className="text-amber-300">3000</span><span className="text-white">).</span><span className="text-sky-400">fit</span><span className="text-white">(newX, y)</span></p>
                  <p><span className="text-emerald-400">modelo_ridge</span><span className="text-white">   = </span><span className="text-sky-400">Ridge</span><span className="text-white">(tol=</span><span className="text-amber-300">0.01</span><span className="text-white">, max_iter=</span><span className="text-amber-300">3000</span><span className="text-white">).</span><span className="text-sky-400">fit</span><span className="text-white">(newX, y)</span></p>
                  <p><span className="text-emerald-400">modelo_elastic</span><span className="text-white"> = </span><span className="text-sky-400">ElasticNet</span><span className="text-white">(tol=</span><span className="text-amber-300">0.01</span><span className="text-white">, max_iter=</span><span className="text-amber-300">3000</span><span className="text-white">).</span><span className="text-sky-400">fit</span><span className="text-white">(newX, y)</span></p>
                </>
              )
            },
            {
              label: "4 · Comparar normas y reducción", color: "#f59e0b",
              code: (
                <>
                  <p><span className="text-emerald-400">resultados</span><span className="text-white"> = {`{`}</span></p>
                  <p><span className="ml-8 text-green-300">'norma_l1'</span><span className="text-white">: [norm(m.coef_, </span><span className="text-amber-300">1</span><span className="text-white">) </span><span className="text-emerald-400">for</span><span className="text-white"> m </span><span className="text-emerald-400">in</span><span className="text-white"> modelos],</span></p>
                  <p><span className="ml-8 text-green-300">'norma_l2'</span><span className="text-white">: [norm(m.coef_, </span><span className="text-amber-300">2</span><span className="text-white">) </span><span className="text-emerald-400">for</span><span className="text-white"> m </span><span className="text-emerald-400">in</span><span className="text-white"> modelos]</span></p>
                  <p><span className="text-white">{`}`}</span></p>
                  <p className="mt-1"><span className="text-emerald-400">df</span><span className="text-white"> = pd.</span><span className="text-sky-400">DataFrame</span><span className="text-white">(resultados, index=[</span></p>
                  <p><span className="ml-8 text-green-300">'Lineal'</span><span className="text-white">,</span><span className="text-green-300">'Lasso'</span><span className="text-white">,</span><span className="text-green-300">'Ridge'</span><span className="text-white">,</span><span className="text-green-300">'Elastic'</span><span className="text-white">])</span></p>
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

          <ComparativaDemo />

          <div className="mt-4">
            <Tip color="rose">
              <strong>Lasso</strong> logra la mayor reducción de complejidad (~96% en L1) porque puede llevar
              coeficientes exactamente a cero. <strong>Ridge</strong> reduce los coeficientes proporcionalmente sin
              eliminarlos. <strong>ElasticNet</strong> equilibra ambas estrategias.
            </Tip>
          </div>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "300ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "Underfitting",       desc: "Modelo muy simple, no captura la tendencia real. Error alto en train y test.", color: "#f59e0b" },
              { code: "Overfitting",         desc: "Modelo sobreajustado. Muy preciso en train, malo en validación.", color: "#ef4444" },
              { code: "Norma L1 (Σ|βᵢ|)",   desc: "Puede llevar coeficientes a exactamente 0. Base del método Lasso.", color: "#f59e0b" },
              { code: "Norma L2 (Σβᵢ²)",    desc: "Reduce los coeficientes proporcionalmente, nunca a 0. Base de Ridge.", color: "#8b5cf6" },
              { code: "Lasso(alpha=λ)",      desc: "Regularización L1 en sklearn. Selección automática de variables.", color: "#f59e0b" },
              { code: "Ridge(alpha=λ)",      desc: "Regularización L2 en sklearn. Buena para variables correlacionadas.", color: "#8b5cf6" },
              { code: "ElasticNet(α, l1_r)", desc: "Combinación de L1 y L2. Dos hiperparámetros: penalización y mezcla.", color: "#06b6d4" },
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
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Machine Learning · Regularización</span>
        </div>

      </div>
    </div>
  );
}