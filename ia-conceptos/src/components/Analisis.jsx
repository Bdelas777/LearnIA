// AnalisisComponentesPrincipales.jsx — Módulo IV: Machine Learning con Python
// Contenido basado en el notebook: Análisis de Componentes Principales (PCA)

import { useState, useRef, useEffect, useCallback } from "react";

// ── Demo: Interpretación Geométrica ──────────────────────────────
function GeometricDemo() {
  const canvasRef = useRef(null);
  const [angulo, setAngulo] = useState(38);
  const [showPC2, setShowPC2] = useState(false);

  // Datos sintéticos tipo iris (2D correlacionados)
  const puntos = [
    [55,140],[62,148],[58,135],[70,160],[65,155],[72,168],[48,130],[80,175],
    [75,170],[60,145],[68,158],[52,132],[78,172],[85,180],[67,157],[44,125],
    [90,185],[57,140],[73,163],[63,150],[50,128],[82,178],[69,160],[77,170],
    [56,138],[71,162],[88,183],[46,127],[64,152],[79,173],
  ];

  const cx = 140, cy = 155;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid suave
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const rad = (angulo * Math.PI) / 180;
    const dx = Math.cos(rad), dy = Math.sin(rad);
    const len = 110;

    // Proyecciones sobre PC1
    puntos.forEach(([px, py]) => {
      const ox = px - cx, oy = py - cy;
      const dot = ox * dx + oy * dy;
      const projX = cx + dot * dx, projY = cy + dot * dy;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(projX, projY);
      ctx.strokeStyle = "rgba(16,185,129,0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // PC2 (perpendicular)
    if (showPC2) {
      const px2 = -dy, py2 = dx;
      ctx.beginPath();
      ctx.moveTo(cx - px2 * 70, cy - py2 * 70);
      ctx.lineTo(cx + px2 * 70, cy + py2 * 70);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      // Etiqueta PC2
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 11px 'IBM Plex Mono', monospace";
      ctx.fillText("z₂", cx + px2 * 75, cy + py2 * 75);
    }

    // PC1
    ctx.beginPath();
    ctx.moveTo(cx - dx * len, cy - dy * len);
    ctx.lineTo(cx + dx * len, cy + dy * len);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Flecha PC1
    const ax = cx + dx * len, ay = cy + dy * len;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - dx * 10 + dy * 6, ay - dy * 10 - dx * 6);
    ctx.lineTo(ax - dx * 10 - dy * 6, ay - dy * 10 + dx * 6);
    ctx.closePath();
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    // Etiqueta PC1
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px 'IBM Plex Mono', monospace";
    ctx.fillText("z₁", ax + 8, ay - 6);

    // Puntos
    puntos.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#60a5fa";
      ctx.fill();
      ctx.strokeStyle = "rgba(147,197,253,0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

  }, [angulo, showPC2]);

  // Varianza proxy: dispersión de proyecciones
  const rad = (angulo * Math.PI) / 180;
  const dx = Math.cos(rad), dy = Math.sin(rad);
  const projs = puntos.map(([px, py]) => (px - cx) * dx + (py - cy) * dy);
  const mean = projs.reduce((a, b) => a + b, 0) / projs.length;
  const variance = projs.reduce((a, b) => a + (b - mean) ** 2, 0) / projs.length;
  const maxVar = 2200;
  const pct = Math.min(100, Math.round((variance / maxVar) * 100));

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="text-rose-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Interpretación Geométrica</p>
      <p className="text-gray-400 text-xs mb-4">
        Rota el eje <span className="text-rose-400 font-mono">z₁</span> para encontrar la dirección de <strong className="text-white">mayor varianza</strong>.
        Las líneas verdes muestran las proyecciones de cada punto.
      </p>

      <canvas ref={canvasRef} width={280} height={210}
        className="rounded-xl border border-white/10 bg-black/30 w-full mb-4" style={{ maxWidth: 280 }} />

      {/* Indicador de varianza */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Varianza capturada por z₁</span>
          <span className={`font-mono font-bold ${pct >= 85 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-rose-400"}`}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-200"
            style={{ width: `${pct}%`, background: pct >= 85 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444" }} />
        </div>
        {pct >= 85 && <p className="text-emerald-400 text-xs mt-1 font-mono">✓ ¡Dirección óptima encontrada!</p>}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Ángulo de z₁</span>
          <span className="text-rose-300 font-mono">{angulo}°</span>
        </div>
        <input type="range" min={0} max={90} value={angulo}
          onChange={(e) => setAngulo(Number(e.target.value))}
          className="w-full cursor-pointer" style={{ accentColor: "#ef4444" }} />
      </div>

      <button onClick={() => setShowPC2(!showPC2)}
        className={`text-xs px-4 py-2 rounded-lg border transition-all
          ${showPC2 ? "border-amber-400/60 bg-amber-400/15 text-amber-300" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
        {showPC2 ? "✓ Mostrar z₂ (PC2 perpendicular)" : "Mostrar z₂ (PC2 perpendicular)"}
      </button>
    </div>
  );
}

// ── Demo: Escalado de datos ────────────────────────────────────────
function EscaladoDemo() {
  const [escalado, setEscalado] = useState(false);

  // Datos tipo edad vs ingreso
  const datos = [
    { edad: 25, ingreso: 28000, label: "A" },
    { edad: 35, ingreso: 55000, label: "B" },
    { edad: 45, ingreso: 80000, label: "C" },
    { edad: 28, ingreso: 32000, label: "D" },
    { edad: 52, ingreso: 95000, label: "E" },
    { edad: 38, ingreso: 62000, label: "F" },
    { edad: 60, ingreso: 105000, label: "G" },
    { edad: 22, ingreso: 22000, label: "H" },
  ];

  // Min-Max scaling
  const edadMin = 22, edadMax = 60;
  const ingMin = 22000, ingMax = 105000;

  const normalize = (v, min, max) => (v - min) / (max - min);

  const W = 240, H = 160;
  const pad = 28;

  const toSvg = (edad, ingreso) => {
    if (escalado) {
      const ex = normalize(edad, edadMin, edadMax);
      const iy = normalize(ingreso, ingMin, ingMax);
      return { x: pad + ex * (W - pad * 2), y: H - pad - iy * (H - pad * 2) };
    } else {
      // Raw — comprimir ingreso para que quepa
      const ex = pad + ((edad - edadMin) / (edadMax - edadMin)) * (W - pad * 2);
      const iy = H - pad - ((ingreso - ingMin) / (ingMax - ingMin)) * (H - pad * 2);
      return { x: ex, y: iy };
    }
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Paso 1: Escalado</p>
      <p className="text-gray-400 text-xs mb-4">
        Edad (0–110) vs Ingreso (0–105,000): escalas muy distintas. El escalado <span className="text-emerald-400 font-mono">MinMaxScaler</span> las equipara al rango [0, 1].
      </p>

      <div className="flex gap-2 mb-4">
        {[false, true].map((s) => (
          <button key={String(s)} onClick={() => setEscalado(s)}
            className={`text-xs px-4 py-1.5 rounded-lg border transition-all font-mono
              ${escalado === s
                ? "border-emerald-400 bg-emerald-400/20 text-emerald-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {s ? "Con escalado" : "Sin escalado"}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-black/30 mb-4" style={{ height: 150 }}>
        {/* Ejes */}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        {/* Labels eje */}
        <text x={W / 2} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={8} fontFamily="monospace">Edad</text>
        <text x={10} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={8} fontFamily="monospace"
          transform={`rotate(-90, 10, ${H / 2})`}>Ingreso</text>
        {/* Ticks */}
        {escalado ? (
          <>
            <text x={pad} y={H - 16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">0</text>
            <text x={W - pad} y={H - 16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">1</text>
            <text x={pad + 4} y={pad + 4} fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">1</text>
          </>
        ) : (
          <>
            <text x={pad} y={H - 16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">22</text>
            <text x={W - pad} y={H - 16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">60</text>
          </>
        )}
        {/* Puntos */}
        {datos.map((d, i) => {
          const { x, y } = toSvg(d.edad, d.ingreso);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={5} fill="#10b981" stroke="rgba(52,211,153,0.5)" strokeWidth={1.5} />
              <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={7} fontWeight="bold" fontFamily="monospace">{d.label}</text>
            </g>
          );
        })}
        {/* Badge */}
        <rect x={W - 80} y={6} width={74} height={16} rx={4} fill={escalado ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)"} />
        <text x={W - 43} y={14.5} textAnchor="middle" dominantBaseline="middle" fill={escalado ? "#34d399" : "#f87171"} fontSize={8} fontFamily="monospace">
          {escalado ? "Escalado ✓" : "Sin escalar"}
        </text>
      </svg>

      <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs">
        <span className="text-emerald-400">scaler</span>
        <span className="text-white"> = </span>
        <span className="text-sky-400">MinMaxScaler</span>
        <span className="text-white">()</span>
        <br />
        <span className="text-emerald-400">X</span>
        <span className="text-white"> = scaler.</span>
        <span className="text-sky-400">fit_transform</span>
        <span className="text-white">(X)</span>
      </div>
    </div>
  );
}

// ── Demo: Varianza Explicada ──────────────────────────────────────
function VarianzaDemo() {
  const [modo, setModo] = useState("individual");
  // Valores reales del dataset iris con PCA
  const varianzas = [0.727, 0.230, 0.036, 0.007];
  const acumulada = varianzas.reduce((acc, v, i) => [...acc, (acc[i - 1] || 0) + v], []);
  const colores = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981"];
  const nombres = ["PC-1", "PC-2", "PC-3", "PC-4"];

  const W = 260, H = 140, pad = { t: 16, r: 16, b: 32, l: 36 };
  const barW = 36, gap = 14;

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Varianza Explicada (Iris)</p>

      <div className="flex gap-2 mb-4">
        {["individual", "acumulada"].map((m) => (
          <button key={m} onClick={() => setModo(m)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono capitalize
              ${modo === m
                ? "border-violet-400 bg-violet-400/20 text-violet-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {m}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H + pad.t + pad.b}`} className="w-full rounded-xl border border-white/10 bg-black/30 mb-4" style={{ height: 180 }}>
        {/* Grid horizontal */}
        {[0, 0.25, 0.5, 0.75, 1].map((v) => {
          const y = pad.t + H - v * H;
          return (
            <g key={v}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={pad.l - 4} y={y + 1} textAnchor="end" dominantBaseline="middle"
                fill="rgba(255,255,255,0.25)" fontSize={7} fontFamily="monospace">{Math.round(v * 100)}%</text>
            </g>
          );
        })}

        {modo === "individual" ? (
          // Barras
          varianzas.map((v, i) => {
            const x = pad.l + i * (barW + gap);
            const bh = v * H;
            const y = pad.t + H - bh;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={bh} rx={4} fill={colores[i]} opacity={0.8} />
                <text x={x + barW / 2} y={y - 5} textAnchor="middle" fill={colores[i]} fontSize={9} fontFamily="monospace" fontWeight="bold">
                  {Math.round(v * 100)}%
                </text>
                <text x={x + barW / 2} y={pad.t + H + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={8} fontFamily="monospace">
                  {nombres[i]}
                </text>
              </g>
            );
          })
        ) : (
          // Línea acumulada
          <>
            {acumulada.map((v, i) => {
              const x = pad.l + i * (barW + gap) + barW / 2;
              const y = pad.t + H - v * H;
              if (i === 0) return null;
              const px = pad.l + (i - 1) * (barW + gap) + barW / 2;
              const py = pad.t + H - acumulada[i - 1] * H;
              return (
                <line key={i} x1={px} y1={py} x2={x} y2={y} stroke="#8b5cf6" strokeWidth={2} />
              );
            })}
            {acumulada.map((v, i) => {
              const x = pad.l + i * (barW + gap) + barW / 2;
              const y = pad.t + H - v * H;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={5} fill={colores[i]} stroke="rgba(139,92,246,0.5)" strokeWidth={2} />
                  <text x={x} y={y - 10} textAnchor="middle" fill={colores[i]} fontSize={9} fontFamily="monospace" fontWeight="bold">
                    {Math.round(v * 100)}%
                  </text>
                  <text x={x} y={pad.t + H + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={8} fontFamily="monospace">
                    {nombres[i]}
                  </text>
                </g>
              );
            })}
          </>
        )}

        {/* Línea de referencia 95% */}
        {modo === "acumulada" && (
          <>
            <line x1={pad.l} y1={pad.t + H - 0.95 * H} x2={W - pad.r} y2={pad.t + H - 0.95 * H}
              stroke="rgba(16,185,129,0.5)" strokeWidth={1} strokeDasharray="4,3" />
            <text x={W - pad.r - 2} y={pad.t + H - 0.95 * H - 4} textAnchor="end" fill="rgba(16,185,129,0.7)" fontSize={8} fontFamily="monospace">95%</text>
          </>
        )}
      </svg>

      <p className="text-xs text-gray-400">
        {modo === "individual"
          ? "PC-1 explica el 73% de la variabilidad, PC-2 el 23%. Las dos primeras componentes capturan el 96% de la información."
          : "Con solo 2 componentes se acumula el 96% de varianza. El resto (PC-3, PC-4) puede descartarse sin perder información relevante."}
      </p>
    </div>
  );
}

// ── Demo: Reducción de dimensión ──────────────────────────────────
function ReduccionDemo() {
  const [nComponents, setNComponents] = useState(2);

  // Iris proyectado en PC1, PC2 (datos aproximados reales)
  const iris = {
    setosa:     [[-0.68,-0.32],[-0.73,-0.15],[-0.72,-0.17],[-0.74,-0.18],[-0.66,-0.35],[-0.58,-0.40],[-0.73,-0.24],[-0.67,-0.32],[-0.76,-0.14],[-0.71,-0.30],[-0.60,-0.38],[-0.69,-0.27],[-0.74,-0.17],[-0.76,-0.14],[-0.59,-0.44]],
    versicolor: [[0.18,-0.08],[0.20,-0.12],[0.22,-0.05],[0.15,-0.15],[0.25,-0.06],[0.23,-0.10],[0.17,-0.13],[0.19,-0.09],[0.16,-0.16],[0.21,-0.07],[0.28,-0.04],[0.14,-0.18],[0.24,-0.08],[0.18,-0.14],[0.26,-0.05]],
    virginica:  [[0.52, 0.10],[0.55, 0.12],[0.60, 0.15],[0.48, 0.08],[0.57, 0.11],[0.62, 0.16],[0.50, 0.09],[0.58, 0.13],[0.65, 0.18],[0.53, 0.10],[0.56, 0.12],[0.63, 0.17],[0.49, 0.07],[0.61, 0.14],[0.59, 0.13]],
  };

  const clases = [
    { key: "setosa",     color: "#f59e0b", label: "Setosa" },
    { key: "versicolor", color: "#3b82f6", label: "Versicolor" },
    { key: "virginica",  color: "#8b5cf6", label: "Virginica" },
  ];

  const W = 260, H = 180;
  const scaleX = 160, scaleY = 120;
  const offX = W / 2, offY = H / 2 + 10;

  const varianzaTotal = [0.727, 0.957, 0.993, 1.0];

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Reducción Dimensional (Iris)</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Componentes principales a conservar</span>
          <span className="text-sky-300 font-mono font-bold">n = {nComponents}</span>
        </div>
        <input type="range" min={1} max={4} step={1} value={nComponents}
          onChange={(e) => setNComponents(Number(e.target.value))}
          className="w-full cursor-pointer mb-2" style={{ accentColor: "#0ea5e9" }} />
        <div className="flex justify-between text-xs text-gray-600 font-mono">
          <span>1</span><span>2</span><span>3</span><span>4</span>
        </div>
      </div>

      {/* Varianza conservada */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${varianzaTotal[nComponents - 1] * 100}%`, background: "linear-gradient(90deg, #8b5cf6, #06b6d4)" }} />
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400">{Math.round(varianzaTotal[nComponents - 1] * 100)}% varianza</span>
      </div>

      {/* Visualización 2D scatter (PC1 vs PC2) */}
      {nComponents >= 2 ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-black/30 mb-4" style={{ height: 160 }}>
          {/* Ejes */}
          <line x1={20} y1={offY} x2={W - 20} y2={offY} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <line x1={offX} y1={10} x2={offX} y2={H - 10} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <text x={W - 18} y={offY - 4} fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace">PC-1</text>
          <text x={offX + 4} y={14} fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace">PC-2</text>
          {clases.map(({ key, color }) =>
            iris[key].map(([pc1, pc2], i) => (
              <circle key={i}
                cx={offX + pc1 * scaleX}
                cy={offY - pc2 * scaleY}
                r={4.5} fill={color} stroke={color + "60"} strokeWidth={1.5} opacity={0.85} />
            ))
          )}
        </svg>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/30 mb-4 flex items-center justify-center" style={{ height: 100 }}>
          {/* Solo PC1 — mostrar como 1D */}
          <svg viewBox="0 0 260 60" className="w-full" style={{ height: 60 }}>
            <line x1={20} y1={30} x2={240} y2={30} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            <text x={240} y={26} fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace">PC-1</text>
            {clases.map(({ key, color }) =>
              iris[key].map(([pc1], i) => (
                <circle key={i} cx={130 + pc1 * 160} cy={30} r={4.5}
                  fill={color} stroke={color + "60"} strokeWidth={1.5} opacity={0.85} />
              ))
            )}
          </svg>
        </div>
      )}

      {/* Leyenda */}
      <div className="flex gap-4 flex-wrap text-xs mb-2">
        {clases.map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {nComponents === 1 && "Con 1 componente (73% varianza) las clases aún se distinguen pero hay solapamiento."}
        {nComponents === 2 && "Con 2 componentes (96% varianza) las tres especies de iris son perfectamente separables."}
        {nComponents === 3 && "Con 3 componentes se conserva el 99.3% de la varianza. Casi no hay ganancia frente a 2."}
        {nComponents === 4 && "Con 4 componentes (100%) no hay reducción. Se usan todas las variables originales."}
      </p>
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

// ── Pasos ─────────────────────────────────────────────────────────
function PasoCard({ n, title, color, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
          style={{ background: color + "20", color }}>
          {n}
        </span>
        <span className="font-bold text-sm text-white flex-1">{title}</span>
        <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-400 border-t border-white/5 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function AnalisisComponentesPrincipales({ onBack }) {
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
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-sky-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-0 w-[250px] h-[250px] bg-emerald-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Machine Learning</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily: "monospace" }}>PCA</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6", fontFamily: "monospace" }}>
            🤖 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Análisis de{" "}
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Componentes Principales</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Método de <code className="text-violet-400 bg-violet-500/10 px-1 rounded">reducción de dimensionalidad</code> que simplifica
            espacios complejos conservando su información. Aprende cómo encontrar las direcciones de
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded"> mayor varianza</code> e implementarlo con{" "}
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded">sklearn</code>.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#intro",      label: "📖 Introducción" },
            { href: "#geometria",  label: "📐 Geometría" },
            { href: "#pasos",      label: "🔢 Pasos del algoritmo" },
            { href: "#varianza",   label: "📊 Varianza explicada" },
            { href: "#reduccion",  label: "🎯 Reducción dimensional" },
            { href: "#practica",   label: "💻 Práctica sklearn" },
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
            El <strong className="text-white">Análisis de Componentes Principales (PCA)</strong> es un método de
            reducción de dimensionalidad que simplifica la complejidad de espacios con múltiples dimensiones
            conservando su información.
          </p>

          {/* Analogía visual */}
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-5">
            <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🧩 La idea central</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Espacio original */}
              <div className="flex-1 rounded-xl border border-white/10 bg-black/20 p-4 text-center">
                <p className="text-xs text-gray-500 mb-2 font-bold">ESPACIO ORIGINAL</p>
                <div className="flex justify-center gap-2 flex-wrap mb-2">
                  {["x₁", "x₂", "x₃", "…", "xₚ"].map((v) => (
                    <span key={v} className="font-mono text-sm bg-violet-500/20 text-violet-300 px-2 py-1 rounded-lg border border-violet-500/30">{v}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-600">p variables (correlacionadas)</p>
              </div>

              {/* Flecha */}
              <div className="text-2xl text-violet-400 rotate-90 sm:rotate-0">→</div>

              {/* Espacio reducido */}
              <div className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-xs text-emerald-400 mb-2 font-bold">COMPONENTES (PCA)</p>
                <div className="flex justify-center gap-2 flex-wrap mb-2">
                  {["z₁", "z₂", "…", "zₖ"].map((v) => (
                    <span key={v} className="font-mono text-sm bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/30">{v}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-600">k &lt; p variables (no correlacionadas)</p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mb-5 leading-relaxed">
            Supóngase una muestra con <code className="text-violet-400">n</code> individuos y{" "}
            <code className="text-violet-400">p</code> variables. PCA encuentra{" "}
            <code className="text-emerald-400">z &lt; p</code> nuevas variables no correlacionadas
            que explican aproximadamente lo mismo que las <code className="text-violet-400">p</code> originales.
            Cada nueva variable es una <strong className="text-white">componente principal</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "📉", title: "Menos dimensiones", desc: "Reduce p variables a z componentes (z < p)", color: "#8b5cf6" },
              { icon: "🔗", title: "Sin correlación", desc: "Las componentes son ortogonales entre sí", color: "#06b6d4" },
              { icon: "💾", title: "Conserva info", desc: "Las primeras componentes capturan la mayor varianza", color: "#10b981" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="font-bold text-sm mb-1" style={{ color: c.color }}>{c.title}</p>
                <p className="text-xs text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 2 — Geometría
        ══════════════════════════ */}
        <section id="geometria" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "60ms" }}>
          <SectionHeader icon="📐" title="Interpretación Geométrica" color="#ef4444" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            La <strong className="text-white">primera componente principal</strong> (z₁) sigue la dirección
            en que las observaciones tienen <strong className="text-white">mayor varianza</strong>.
            La proyección de cada punto sobre esa dirección es su <em>principal component score</em>.
          </p>
          <p className="text-gray-400 mb-5 leading-relaxed">
            La <strong className="text-white">segunda componente</strong> (z₂) sigue la segunda dirección de mayor varianza
            y es <strong className="text-white">perpendicular/ortogonal</strong> a la primera.
            La condición de no correlación equivale a perpendicularidad.
          </p>

          <GeometricDemo />

          <div className="mt-4">
            <Tip color="rose">
              Las componentes principales son <strong>combinaciones lineales</strong> de las variables originales,
              elegidas de forma que la primera capture la máxima varianza posible, la segunda la máxima restante, y así sucesivamente.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 3 — Pasos
        ══════════════════════════ */}
        <section id="pasos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="🔢" title="Pasos del algoritmo PCA" color="#f59e0b" />
          <p className="text-gray-400 mb-5">Haz clic en cada paso para ver el detalle.</p>

          <div className="space-y-3 mb-6">
            <PasoCard n="1" title="Escalar el conjunto de datos" color="#10b981">
              <p>El escalado equipara variables con rangos muy distintos (ej. edad 0–110 vs ingreso 0–100,000).
              Sin escalar, las variables con mayor rango dominarían artificialmente las componentes.
              Se usa típicamente <strong>StandardScaler</strong> (media 0, std 1) o <strong>MinMaxScaler</strong> (rango [0,1]).</p>
            </PasoCard>

            <PasoCard n="2" title="Calcular la Matriz de Covarianza" color="#06b6d4">
              <p className="mb-2">La covarianza mide cómo varían juntas dos variables. Para X e Y:</p>
              <Formula>Cov(X,Y) = Σ(xᵢ − x̄)(yᵢ − ȳ) / n</Formula>
              <p>La <strong>matriz de covarianza</strong> recoge todas las covarianzas entre pares de variables.
              Sus elementos más grandes indican las relaciones más fuertes entre variables.</p>
            </PasoCard>

            <PasoCard n="3" title="Calcular valores propios y vectores propios" color="#8b5cf6">
              <p>Los <strong>vectores propios</strong> de la matriz de covarianza definen las direcciones de las componentes principales.
              Los <strong>valores propios</strong> indican cuánta varianza explica cada dirección.
              Las componentes con mayor valor propio capturan más información.</p>
            </PasoCard>

            <PasoCard n="4" title="Ordenar componentes por varianza" color="#f59e0b">
              <p>Se ordenan los vectores propios de mayor a menor valor propio. El de mayor valor propio
              define la <strong>primera componente principal</strong> (máxima varianza), el siguiente la segunda, etc.</p>
            </PasoCard>

            <PasoCard n="5" title="Reducción de dimensión" color="#ef4444">
              <p>Se seleccionan las primeras <strong>k componentes</strong> que explican suficiente varianza
              (comúnmente el 95%). El resto se descarta, logrando la reducción dimensional manteniendo la información relevante.</p>
            </PasoCard>
          </div>

          <EscaladoDemo />
        </section>

        {/* ══════════════════════════
            SECCIÓN 4 — Varianza
        ══════════════════════════ */}
        <section id="varianza" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "180ms" }}>
          <SectionHeader icon="📊" title="Varianza Explicada" color="#06b6d4" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Después de aplicar PCA, se analiza cuánta varianza explica cada componente.
            El atributo <code className="text-sky-400 bg-sky-500/10 px-1 rounded">explained_variance_ratio_</code> devuelve
            la proporción de varianza de cada componente.
          </p>

          <CodeBlock>
            <p className="text-gray-500"># Ajustar PCA y ver varianza explicada</p>
            <p><span className="text-emerald-400">pca</span><span className="text-white"> = </span><span className="text-sky-400">PCA</span><span className="text-white">()</span></p>
            <p><span className="text-emerald-400">pca</span><span className="text-white">.</span><span className="text-sky-400">fit_transform</span><span className="text-white">(X)</span></p>
            <p className="mt-1"><span className="text-violet-400">print</span><span className="text-white">(pca.</span><span className="text-sky-400">explained_variance_ratio_</span><span className="text-white">)</span></p>
            <p className="text-gray-500"># → [0.727, 0.230, 0.036, 0.007]</p>
          </CodeBlock>

          <VarianzaDemo />

          <div className="mt-4">
            <Tip color="sky">
              Las <strong>dos primeras componentes</strong> explican el <strong>96% de la variabilidad</strong> del dataset iris.
              Esto significa que se puede pasar de 4 variables a solo 2, perdiendo apenas el 4% de la información.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 5 — Reducción
        ══════════════════════════ */}
        <section id="reduccion" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="🎯" title="Reducción Dimensional" color="#10b981" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Tras elegir el número de componentes a conservar, se proyectan los datos al nuevo espacio.
            El resultado es una representación compacta que permite <strong className="text-white">visualizar y clasificar</strong> con menos dimensiones.
          </p>

          <ReduccionDemo />

          <div className="mt-4">
            <Tip color="emerald">
              Con PCA el dataset iris pasa de <strong>4 dimensiones a 2</strong> y aún permite separar
              perfectamente las tres especies. Esta visualización en 2D sería imposible sin PCA.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════
            SECCIÓN 6 — Práctica
        ══════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "300ms" }}>
          <SectionHeader icon="💻" title="Práctica con sklearn — Dataset Iris" color="#8b5cf6" />
          <p className="text-gray-400 mb-5">
            Implementación completa: carga de datos → escalado → PCA → análisis de varianza → visualización.
          </p>

          {/* Paso a paso código */}
          {[
            {
              label: "1 · Importar librerías", color: "#10b981",
              code: (
                <>
                  <p><span className="text-sky-400">import</span><span className="text-white"> matplotlib.pyplot </span><span className="text-sky-400">as</span><span className="text-white"> plt</span></p>
                  <p><span className="text-sky-400">import</span><span className="text-white"> pandas </span><span className="text-sky-400">as</span><span className="text-white"> pd</span></p>
                  <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-white"> np</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn </span><span className="text-sky-400">import</span><span className="text-white"> datasets</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.preprocessing </span><span className="text-sky-400">import</span><span className="text-white"> MinMaxScaler</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.decomposition </span><span className="text-sky-400">import</span><span className="text-white"> PCA</span></p>
                </>
              )
            },
            {
              label: "2 · Cargar y preparar datos", color: "#3b82f6",
              code: (
                <>
                  <p><span className="text-emerald-400">datos</span><span className="text-white"> = datasets.</span><span className="text-sky-400">load_iris</span><span className="text-white">()</span></p>
                  <p><span className="text-emerald-400">X</span><span className="text-white"> = datos.data</span></p>
                  <p><span className="text-emerald-400">y</span><span className="text-white"> = datos.target</span></p>
                  <p className="text-gray-500"># 150 observaciones, 4 variables</p>
                  <p><span className="text-violet-400">print</span><span className="text-white">(X.</span><span className="text-sky-400">shape</span><span className="text-white">)</span></p>
                  <p className="text-gray-500"># → (150, 4)</p>
                </>
              )
            },
            {
              label: "3 · Escalar los datos", color: "#f59e0b",
              code: (
                <>
                  <p><span className="text-emerald-400">scaler</span><span className="text-white"> = </span><span className="text-sky-400">MinMaxScaler</span><span className="text-white">()</span></p>
                  <p><span className="text-emerald-400">X</span><span className="text-white"> = scaler.</span><span className="text-sky-400">fit_transform</span><span className="text-white">(X)</span></p>
                </>
              )
            },
            {
              label: "4 · Aplicar PCA", color: "#8b5cf6",
              code: (
                <>
                  <p><span className="text-emerald-400">pca</span><span className="text-white"> = </span><span className="text-sky-400">PCA</span><span className="text-white">()</span></p>
                  <p><span className="text-emerald-400">componentes</span><span className="text-white"> = pca.</span><span className="text-sky-400">fit_transform</span><span className="text-white">(X)</span></p>
                  <p><span className="text-emerald-400">df_pca</span><span className="text-white"> = pd.</span><span className="text-sky-400">DataFrame</span><span className="text-white">(</span></p>
                  <p><span className="ml-8 text-white">data=componentes,</span></p>
                  <p><span className="ml-8 text-white">columns=[</span><span className="text-green-300">'pc-1'</span><span className="text-white">,</span><span className="text-green-300">'pc-2'</span><span className="text-white">,</span><span className="text-green-300">'pc-3'</span><span className="text-white">,</span><span className="text-green-300">'pc-4'</span><span className="text-white">]</span></p>
                  <p><span className="text-white">)</span></p>
                </>
              )
            },
            {
              label: "5 · Analizar varianza explicada", color: "#06b6d4",
              code: (
                <>
                  <p><span className="text-violet-400">print</span><span className="text-white">(pca.</span><span className="text-sky-400">explained_variance_ratio_</span><span className="text-white">)</span></p>
                  <p className="text-gray-500"># → [0.727, 0.230, 0.036, 0.007]</p>
                  <p className="mt-1"><span className="text-emerald-400">acum</span><span className="text-white"> = pca.</span><span className="text-sky-400">explained_variance_ratio_</span><span className="text-white">.</span><span className="text-sky-400">cumsum</span><span className="text-white">()</span></p>
                  <p className="text-gray-500"># → [0.727, 0.957, 0.993, 1.000]</p>
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

          <Tip color="violet">
            Al usar <code>PCA(n_components=2)</code> sklearn devuelve directamente las 2 primeras componentes,
            sin necesidad de calcularlas todas. Ideal cuando ya sabes cuántas quieres conservar.
          </Tip>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "340ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "Componente principal", desc: "Nueva variable no correlacionada que maximiza la varianza capturada.", color: "#8b5cf6" },
              { code: "Dirección ortogonal",  desc: "Cada componente es perpendicular a las demás: no hay redundancia de información.", color: "#06b6d4" },
              { code: "MinMaxScaler",         desc: "Escala todas las variables al rango [0,1] antes de aplicar PCA.", color: "#10b981" },
              { code: "explained_variance_ratio_", desc: "Proporción de varianza explicada por cada componente. La suma debe ser ≤ 1.", color: "#f59e0b" },
              { code: "cumsum()",             desc: "Varianza acumulada: permite elegir cuántas componentes conservar.", color: "#ef4444" },
              { code: "PCA(n_components=k)", desc: "Reducir a k dimensiones en sklearn. Las primeras k capturan la mayor información.", color: "#6366f1" },
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
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Machine Learning · PCA</span>
        </div>

      </div>
    </div>
  );
}