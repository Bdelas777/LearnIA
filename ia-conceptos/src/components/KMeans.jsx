import { useState, useMemo, useCallback } from "react";

// ── K-Means animado interactivo ────────────────────────────────────
function KMeansDemo() {
  const [K, setK]           = useState(3);
  const [step, setStep]     = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState(null);

  // Dataset sintético (similar al notebook)
  const puntos = useMemo(() => [
    [1.8,4.6],[5.7,4.8],[6.4,3.3],[2.9,4.6],[3.2,4.9],
    [2.1,5.2],[5.1,4.2],[6.8,3.8],[1.5,3.9],[4.5,5.1],
    [5.9,3.0],[2.4,4.1],[3.8,5.5],[6.2,4.5],[1.9,4.8],
    [5.3,3.6],[2.7,5.1],[6.0,2.8],[3.5,4.3],[5.6,4.1],
    [2.0,3.7],[4.8,4.9],[6.5,3.5],[2.3,5.3],[5.2,3.2],
    [3.1,4.7],[6.1,4.0],[1.7,4.3],[4.3,5.3],[5.8,3.9],
  ], []);

  // Colores para cada cluster
  const colores = ["#f43f5e","#0ea5e9","#10b981","#f59e0b","#a855f7"];

  // Distancia euclídea
  const dist = (a, b) => Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2);

  // Asignar puntos al centroide más cercano
  const asignar = (pts, centroids) =>
    pts.map(p => {
      let minD = Infinity, idx = 0;
      centroids.forEach((c, i) => { const d = dist(p, c); if (d < minD) { minD = d; idx = i; } });
      return idx;
    });

  // Recalcular centroides como media de cada cluster
  const recalcularCentroides = (pts, asignaciones, k) =>
    Array.from({ length: k }, (_, i) => {
      const misPuntos = pts.filter((_, j) => asignaciones[j] === i);
      if (misPuntos.length === 0) return pts[Math.floor(Math.random() * pts.length)];
      return [
        misPuntos.reduce((s, p) => s + p[0], 0) / misPuntos.length,
        misPuntos.reduce((s, p) => s + p[1], 0) / misPuntos.length,
      ];
    });

  // Generar centroides iniciales aleatorios
  const genCentroids = useCallback((k) => {
    const indices = new Set();
    while (indices.size < k) indices.add(Math.floor(Math.random() * puntos.length));
    return [...indices].map(i => [...puntos[i]]);
  }, [puntos]);

  // Ejecutar K-Means y guardar historial de pasos
  const ejecutar = useCallback(() => {
    let centroids = genCentroids(K);
    const hist = [{ centroids: centroids.map(c=>[...c]), asignaciones: asignar(puntos, centroids), fase:"init" }];

    for (let iter = 0; iter < 8; iter++) {
      const asignaciones = asignar(puntos, centroids);
      hist.push({ centroids: centroids.map(c=>[...c]), asignaciones, fase:"asignar", iter });
      const newC = recalcularCentroides(puntos, asignaciones, K);
      const changed = newC.some((c, i) => dist(c, centroids[i]) > 0.001);
      centroids = newC;
      hist.push({ centroids: centroids.map(c=>[...c]), asignaciones, fase:"actualizar", iter });
      if (!changed) break;
    }
    return hist;
  }, [K, puntos, genCentroids]);

  const iniciar = () => {
    const h = ejecutar();
    setHistory(h);
    setStep(0);
  };

  const avanzar = () => {
    if (history && step < history.length - 1) setStep(s => s + 1);
  };

  const animar = () => {
    const h = ejecutar();
    setHistory(h);
    setStep(0);
    setRunning(true);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setStep(i);
      if (i >= h.length - 1) { clearInterval(iv); setRunning(false); }
    }, 700);
  };

  const estado = history ? history[step] : null;

  // SVG
  const W = 340, H = 220, PAD = 28;
  const xMin = 0.5, xMax = 7.5, yMin = 2.0, yMax = 6.2;
  const sx = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  // Inercia (suma de distancias al cuadrado)
  const inercia = estado
    ? puntos.reduce((s, p, i) => s + dist(p, estado.centroids[estado.asignaciones[i]])**2, 0)
    : null;

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — K-Means animado paso a paso</p>

      {/* SVG */}
      <div className="bg-black/40 rounded-xl border border-white/10 mb-4 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
          {/* Grid */}
          {[3,4,5,6].map(y => (
            <line key={y} x1={PAD} y1={sy(y)} x2={W-PAD} y2={sy(y)} stroke="#ffffff08" strokeWidth="1"/>
          ))}
          {[2,3,4,5,6,7].map(x => (
            <line key={x} x1={sx(x)} y1={PAD} x2={sx(x)} y2={H-PAD} stroke="#ffffff08" strokeWidth="1"/>
          ))}

          {/* Líneas de asignación */}
          {estado && puntos.map((p, i) => (
            <line key={i}
              x1={sx(p[0])} y1={sy(p[1])}
              x2={sx(estado.centroids[estado.asignaciones[i]][0])}
              y2={sy(estado.centroids[estado.asignaciones[i]][1])}
              stroke={colores[estado.asignaciones[i]]} strokeWidth="0.8" opacity="0.2"/>
          ))}

          {/* Puntos */}
          {puntos.map((p, i) => {
            const color = estado ? colores[estado.asignaciones[i]] : "#6b7280";
            return (
              <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r="4"
                fill={color} opacity="0.8"/>
            );
          })}

          {/* Centroides */}
          {estado && estado.centroids.map((c, i) => (
            <g key={i}>
              <circle cx={sx(c[0])} cy={sy(c[1])} r="9"
                fill={colores[i]} opacity="0.25"/>
              <line x1={sx(c[0])-8} y1={sy(c[1])} x2={sx(c[0])+8} y2={sy(c[1])}
                stroke="#fff" strokeWidth="2.5"/>
              <line x1={sx(c[0])} y1={sy(c[1])-8} x2={sx(c[0])} y2={sy(c[1])+8}
                stroke="#fff" strokeWidth="2.5"/>
            </g>
          ))}

          {/* Labels */}
          <text x={W/2} y={H-6} fill="#ffffff18" fontSize="8" textAnchor="middle">x₁</text>
          <text x={8}   y={H/2} fill="#ffffff18" fontSize="8" textAnchor="middle" transform={`rotate(-90,8,${H/2})`}>x₂</text>
        </svg>
      </div>

      {/* Controles */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-mono">K (número de clusters)</span>
            <span className="text-amber-300 font-bold font-mono">{K}</span>
          </div>
          <div className="flex gap-2">
            {[2,3,4,5].map(v => (
              <button key={v} onClick={() => { setK(v); setHistory(null); setStep(0); }}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-all font-mono ${
                  K === v ? "border-amber-400/60 bg-amber-500/20 text-amber-300 font-bold"
                          : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={iniciar}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all">
            🔄 Reiniciar
          </button>
          <button onClick={avanzar} disabled={!history || step >= (history?.length - 1)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-all disabled:opacity-40">
            ⏭ Siguiente paso
          </button>
          <button onClick={animar} disabled={running}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-40">
            {running ? "⏳ Animando..." : "▶ Animar"}
          </button>
        </div>
      </div>

      {/* Estado actual */}
      {estado ? (
        <div className="space-y-2">
          <div className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
            estado.fase === "init"      ? "border-violet-500/40 bg-violet-500/15 text-violet-300" :
            estado.fase === "asignar"  ? "border-sky-500/40 bg-sky-500/15 text-sky-300" :
                                          "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"}`}>
            <p className="text-xs font-bold font-mono">
              {estado.fase === "init"     && `Paso 0 — Centroides iniciales (aleatorios)`}
              {estado.fase === "asignar"  && `Iteración ${estado.iter + 1} — Asignación: cada punto → centroide más cercano`}
              {estado.fase === "actualizar" && `Iteración ${estado.iter + 1} — Actualización: centroides recalculados como media`}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/30 rounded-lg px-3 py-2 font-mono text-xs">
              <span className="text-gray-500">Paso: </span>
              <span className="text-white font-bold">{step + 1} / {history.length}</span>
            </div>
            <div className="bg-black/30 rounded-lg px-3 py-2 font-mono text-xs">
              <span className="text-gray-500">Inercia: </span>
              <span className="text-amber-300 font-bold">{inercia?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-xs text-center font-mono">Presiona "Reiniciar" para inicializar K-Means</p>
      )}
    </div>
  );
}

// ── Demo: Codo (Elbow Method) ──────────────────────────────────────
function CodoDemo() {
  // Inercias aproximadas para el dataset sintético con distintos K
  const datos = [
    { k:1, inercia:95.2 },
    { k:2, inercia:38.4 },
    { k:3, inercia:12.1 },
    { k:4, inercia:9.8  },
    { k:5, inercia:8.2  },
    { k:6, inercia:7.6  },
    { k:7, inercia:7.1  },
  ];

  const [selected, setSelected] = useState(3);

  const W = 320, H = 180, PAD = 35;
  const xMin = 0.5, xMax = 7.5;
  const yMin = 0, yMax = 105;
  const sx = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  const path = datos.map((d, i) =>
    `${i === 0 ? "M" : "L"}${sx(d.k).toFixed(1)},${sy(d.inercia).toFixed(1)}`
  ).join(" ");

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Método del codo (Elbow)</p>
      <p className="text-gray-500 text-xs mb-4">Haz clic en un punto para ver la inercia con ese K</p>

      <div className="bg-black/40 rounded-xl border border-white/10 mb-4 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
          {/* Grid */}
          {[20,40,60,80].map(y => (
            <line key={y} x1={PAD} y1={sy(y)} x2={W-PAD} y2={sy(y)} stroke="#ffffff08" strokeWidth="1"/>
          ))}
          {datos.map(d => (
            <line key={d.k} x1={sx(d.k)} y1={PAD} x2={sx(d.k)} y2={H-PAD} stroke="#ffffff06" strokeWidth="1"/>
          ))}

          {/* Línea del codo */}
          <path d={path} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Línea vertical en k=3 (codo) */}
          <line x1={sx(3)} y1={PAD} x2={sx(3)} y2={H-PAD} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
          <text x={sx(3)+4} y={PAD+12} fill="#f59e0b" fontSize="8" opacity="0.8">← codo</text>

          {/* Puntos */}
          {datos.map(d => (
            <g key={d.k} onClick={() => setSelected(d.k)} style={{ cursor:"pointer" }}>
              <circle cx={sx(d.k)} cy={sy(d.inercia)} r={selected === d.k ? 7 : 5}
                fill={selected === d.k ? "#a855f7" : "#6b21a8"}
                stroke={selected === d.k ? "#fff" : "none"} strokeWidth="2"/>
              <text x={sx(d.k)} y={sy(d.inercia)-10} fill="#ffffff50" fontSize="8" textAnchor="middle">{d.k}</text>
            </g>
          ))}

          {/* Ejes labels */}
          <text x={W/2} y={H-4} fill="#ffffff25" fontSize="8" textAnchor="middle">K (número de clusters)</text>
          <text x={8}   y={H/2} fill="#ffffff25" fontSize="8" textAnchor="middle" transform={`rotate(-90,8,${H/2})`}>Inercia</text>
        </svg>
      </div>

      <div className={`rounded-xl border p-3 transition-all duration-300 ${
        selected === 3 ? "border-amber-500/40 bg-amber-500/15" : "border-violet-500/20 bg-violet-500/5"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-mono">K = {selected}</p>
            <p className={`text-2xl font-black font-mono ${selected === 3 ? "text-amber-300" : "text-violet-300"}`}>
              Inercia = {datos.find(d => d.k === selected)?.inercia}
            </p>
          </div>
          {selected === 3 && (
            <div className="text-right">
              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">✓ Óptimo</span>
              <p className="text-gray-600 text-xs mt-1 font-mono">punto de inflexión</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Demo: Pipeline animado ────────────────────────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, label:"Importar librerías",     icon:"📦", color:"sky",    code:"import pandas as pd\nimport numpy as np\nfrom sklearn.cluster import KMeans\nfrom matplotlib import pyplot as plt" },
    { id:1, label:"Cargar dataset",         icon:"📂", color:"violet", code:"data = pd.read_csv('datos/kmeans.csv', sep='\\t',\n              names=['x1','x2'])\nX = np.array(data)\n# x1: 1.84, x2: 4.61 ..." },
    { id:2, label:"Crear y entrenar KMeans",icon:"🧠", color:"emerald",code:"kmeans = KMeans(n_clusters=3)\nkmeans.fit(X)\n# KMeans(n_clusters=3)" },
    { id:3, label:"Obtener centroides",     icon:"🎯", color:"amber",  code:"centroids  = kmeans.cluster_centers_\nassignments = kmeans.labels_\n# centroids: [[x,y], [x,y], [x,y]]" },
    { id:4, label:"Graficar resultados",    icon:"📊", color:"rose",   code:"for i, color in enumerate('rgb'):\n    plt.plot(X[assignments==i,0],\n             X[assignments==i,1],\n             f'{color}o', label=f'Cluster {i}')\nplt.show()" },
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
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Pipeline: K-Means clustering</p>
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
export default function KMeans({ onBack }) {
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
          <span className="text-sm text-amber-400" style={{ fontFamily:"monospace" }}>K-Means</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#f59e0b", color:"#f59e0b", fontFamily:"monospace" }}>
            🔵 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Algoritmo{" "}
            <span style={{
              background:"linear-gradient(135deg, #f59e0b, #f43f5e, #a855f7)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>K-Means</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Algoritmo de
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">clustering no supervisado</code>
            que agrupa N muestras en K clusters minimizando la
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">inercia intra-cluster</code>
            mediante refinamiento iterativo
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",     label:"📌 Introducción" },
            { href:"#algoritmo", label:"🔢 Algoritmo" },
            { href:"#inercia",   label:"📐 Inercia" },
            { href:"#demo",      label:"🎮 Demo animada" },
            { href:"#elbow",     label:"📈 Método del codo" },
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
          <SectionHeader icon="📌" title="Introducción" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            K-Means divide un conjunto de <strong className="text-white">N muestras</strong> en <strong className="text-white">K clusters disjuntos</strong>, cada uno descrito por la media μⱼ de sus muestras. Es un algoritmo de <strong className="text-white">aprendizaje no supervisado</strong> — no necesita etiquetas previas para descubrir la estructura de los datos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="text-amber-300 text-xs font-bold mb-3">✅ Ventajas</p>
              <ul className="space-y-2">
                {[
                  "Simple y rápido — escala bien a datasets grandes.",
                  "Garantiza convergencia en un número finito de iteraciones.",
                  "Resultados fácilmente interpretables (centroides).",
                  "Efectivo cuando los clusters son convexos y bien separados.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"/>
                    <p className="text-gray-400 text-xs leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
              <p className="text-rose-300 text-xs font-bold mb-3">⚠️ Limitaciones</p>
              <ul className="space-y-2">
                {[
                  "Hay que especificar K de antemano (usa el método del codo).",
                  "Puede converger a un óptimo local, no global.",
                  "Sensible a la inicialización aleatoria de centroides.",
                  "No funciona bien con clusters no convexos o de tamaño muy desigual.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"/>
                    <p className="text-gray-400 text-xs leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon:"🛒", label:"Segmentación",  desc:"Agrupar clientes por comportamiento",  color:"#f59e0b" },
              { icon:"🗜️", label:"Compresión",    desc:"Reducir colores en imágenes digitales", color:"#a855f7" },
              { icon:"📰", label:"Documentos",    desc:"Agrupar artículos por temática",        color:"#0ea5e9" },
              { icon:"🧬", label:"Bioinformática",desc:"Agrupar genes por perfil de expresión", color:"#10b981" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-xs font-bold mb-0.5" style={{ color:item.color }}>{item.label}</p>
                <p className="text-xs text-gray-600 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 2. ALGORITMO ═════════════════════════════════════ */}
        <section id="algoritmo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🔢" title="Algoritmo: Refinamiento Iterativo" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            K-Means alterna entre dos pasos hasta converger. Se garantiza convergencia, aunque el resultado puede ser un <strong className="text-white">óptimo local</strong>. Por eso sklearn ejecuta el algoritmo múltiples veces con distintas inicializaciones.
          </p>

          <div className="space-y-4">
            <StepCard num="00" icon="🎲" title="Inicialización" color="violet">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                Se eligen K centroides iniciales, ya sea <strong className="text-white">aleatoriamente</strong> del dataset o mediante K-Means++ (la estrategia por defecto en sklearn que elige centroides bien separados).
              </p>
              <Formula color="violet">c₁, c₂, …, cK ← selección aleatoria del dataset</Formula>
            </StepCard>

            <StepCard num="01" icon="📍" title="Paso de Asignación" color="sky">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                Cada punto se asigna al centroide más cercano según la distancia euclídea al cuadrado. Define el cluster Sᵢ para cada centroide cᵢ.
              </p>
              <Formula color="sky">argmin_cᵢ ∈ C  dist(cᵢ, x)²</Formula>
              <p className="text-gray-600 text-xs font-mono">Resultado: cada punto pertenece a exactamente un cluster</p>
            </StepCard>

            <StepCard num="02" icon="🎯" title="Paso de Actualización" color="emerald">
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                Los centroides se recalculan como la <strong className="text-white">media de todos los puntos</strong> asignados a ese cluster. El centroide se mueve al "centro de masa" de su grupo.
              </p>
              <Formula color="emerald">cᵢ = (1/|Sᵢ|) · Σ xⱼ ∈ Sᵢ  xⱼ</Formula>
            </StepCard>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-amber-300 text-xs font-bold mb-2">Criterios de parada</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Ningún punto cambia de cluster",
                  "La inercia converge (cambio < tolerancia)",
                  "Se alcanza el máximo de iteraciones",
                ].map((c, i) => (
                  <span key={i} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded-lg font-mono">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 3. INERCIA ═══════════════════════════════════════ */}
        <section id="inercia" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="📐" title="Función Objetivo: Inercia" color="#f43f5e" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            K-Means minimiza la <strong className="text-white">inercia</strong> — la suma de las distancias al cuadrado de cada punto a su centroide más cercano. Cuanto menor la inercia, más compactos son los clusters.
          </p>

          <Formula color="rose">Inercia = Σᵢ₌₀ⁿ  min_μⱼ ∈ C  ‖xⱼ − μᵢ‖²</Formula>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { label:"Inercia = 0",    desc:"Ajuste perfecto: cada punto es su propio centroide (K=N). Sin utilidad práctica.",  color:"rose" },
              { label:"Inercia baja",   desc:"Clusters compactos y bien separados. El objetivo de K-Means.",                      color:"emerald" },
              { label:"Inercia alta",   desc:"Clusters dispersos. K muy pequeño o datos sin estructura clara.",                   color:"amber" },
            ].map((item) => {
              const c = {
                rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300" },
                emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300" },
                amber:  { border:"border-amber-500/20",  bg:"bg-amber-500/5",  text:"text-amber-300" },
              }[item.color];
              return (
                <div key={item.label} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                  <p className={`text-xs font-bold mb-2 ${c.text}`}>{item.label}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <CodeBlock>
            <p className="text-gray-500"># Acceder a la inercia en sklearn</p>
            <p><span className="text-emerald-400">kmeans</span><span className="text-white">.fit(X)</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(kmeans.inertia_)</span><span className="text-gray-500 ml-2">  # suma de distancias²</span></p>
          </CodeBlock>
        </section>

        {/* ══ 4. DEMO ANIMADA ══════════════════════════════════ */}
        <section id="demo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="🎮" title="Demo Animada" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Observa K-Means en acción: centroides iniciales aleatorios, asignación de puntos y actualización iterativa. Las cruces blancas son los centroides.
          </p>
          <KMeansDemo />
          <div className="mt-5">
            <Tip color="emerald">
              Cambia K y presiona "Reiniciar" varias veces para ver cómo los centroides iniciales aleatorios producen resultados diferentes — por eso sklearn repite el algoritmo con <code>n_init=10</code> y elige el mejor.
            </Tip>
          </div>
        </section>

        {/* ══ 5. MÉTODO DEL CODO ═══════════════════════════════ */}
        <section id="elbow" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="📈" title="Método del Codo (Elbow Method)" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Como K-Means requiere especificar K de antemano, el método del codo ayuda a elegir el valor óptimo. Se grafica la inercia para distintos valores de K y se busca el <strong className="text-white">punto de inflexión</strong> donde la curva "coda".
          </p>

          <CodoDemo />

          <div className="mt-5 mb-5">
            <Tip color="violet">
              El "codo" es el punto donde agregar más clusters ya no reduce significativamente la inercia. Añadir clusters más allá de ese punto solo fragmenta grupos naturales sin mejorar el modelo.
            </Tip>
          </div>

          <CodeBlock>
            <p className="text-gray-500"># Calcular inercia para distintos K</p>
            <p><span className="text-emerald-400">inercias</span><span className="text-white"> = []</span></p>
            <p><span className="text-sky-400">for</span><span className="text-white"> k </span><span className="text-sky-400">in</span><span className="text-white"> range(</span><span className="text-amber-300">1</span><span className="text-white">, </span><span className="text-amber-300">10</span><span className="text-white">):</span></p>
            <p><span className="text-white ml-4">km = KMeans(n_clusters=k).fit(X)</span></p>
            <p><span className="text-white ml-4">inercias.append(km.inertia_)</span></p>
            <p className="mt-1"><span className="text-violet-400">plt</span><span className="text-white">.plot(range(</span><span className="text-amber-300">1</span><span className="text-white">,</span><span className="text-amber-300">10</span><span className="text-white">), inercias, </span><span className="text-green-300">'bx-'</span><span className="text-white">)</span></p>
            <p><span className="text-violet-400">plt</span><span className="text-white">.xlabel(</span><span className="text-green-300">'K'</span><span className="text-white">) ; plt.ylabel(</span><span className="text-green-300">'Inercia'</span><span className="text-white">)</span></p>
          </CodeBlock>
        </section>

        {/* ══ 6. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Dataset kmeans.csv" color="#f59e0b" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El notebook aplica K-Means con K=3 sobre un dataset bidimensional (<code className="text-amber-400 bg-amber-500/10 px-1 rounded">x1, x2</code>), visualizando los clusters con colores distintos y marcando los centroides con cruces negras.
          </p>

          <PipelineDemo />

          <div className="mt-6">
            <p className="text-white font-semibold mb-4">Código completo</p>
            <CodeBlock>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.cluster </span><span className="text-sky-400">import</span><span className="text-white"> KMeans</span></p>
              <p className="mt-1 text-gray-500"># Crear y entrenar modelo K=3</p>
              <p><span className="text-emerald-400">kmeans</span><span className="text-white"> = KMeans(n_clusters=</span><span className="text-amber-300">3</span><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">kmeans</span><span className="text-white">.fit(X)</span></p>
              <p className="mt-1 text-gray-500"># Resultados</p>
              <p><span className="text-emerald-400">centroids</span><span className="text-white">   = kmeans.cluster_centers_</span><span className="text-gray-500 ml-2"># shape (3,2)</span></p>
              <p><span className="text-emerald-400">assignments</span><span className="text-white"> = kmeans.labels_</span><span className="text-gray-500 ml-2">        # [0,1,2,0,…]</span></p>
              <p className="mt-1 text-gray-500"># Graficar clusters</p>
              <p><span className="text-sky-400">for</span><span className="text-white"> i, color </span><span className="text-sky-400">in</span><span className="text-white"> enumerate(</span><span className="text-green-300">'rgb'</span><span className="text-white">):</span></p>
              <p><span className="text-white ml-4">plt.plot(X[assignments==i, </span><span className="text-amber-300">0</span><span className="text-white">],</span></p>
              <p><span className="text-white ml-11">X[assignments==i, </span><span className="text-amber-300">1</span><span className="text-white">], </span><span className="text-green-300">f'{"{color}"}o'</span><span className="text-white">)</span></p>
              <p><span className="text-white ml-4">plt.plot(centroids[i, </span><span className="text-amber-300">0</span><span className="text-white">], centroids[i, </span><span className="text-amber-300">1</span><span className="text-white">], </span><span className="text-green-300">'kx'</span><span className="text-white">, ms=</span><span className="text-amber-300">20</span><span className="text-white">)</span></p>
            </CodeBlock>

            <Tip color="amber">
              sklearn ejecuta K-Means <code>n_init=10</code> veces por defecto con distintas inicializaciones y devuelve el resultado con la <strong>menor inercia</strong>. Para reproducibilidad usa <code>random_state=42</code>.
            </Tip>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"K-Means",      desc:"Clustering no supervisado. Divide N muestras en K clusters minimizando la inercia.",                       color:"#f59e0b" },
              { label:"Algoritmo",    desc:"1) Inicializar K centroides · 2) Asignar puntos · 3) Recalcular centroides · Repetir hasta convergencia.", color:"#a855f7" },
              { label:"Inercia",      desc:"Σ dist(xᵢ, centroide)². La función objetivo que K-Means minimiza en cada iteración.",                     color:"#f43f5e" },
              { label:"Elbow method", desc:"Graficar inercia vs K. Elegir K en el 'codo' donde la reducción se vuelve marginal.",                     color:"#0ea5e9" },
              { label:"sklearn",      desc:"KMeans(n_clusters=3). Resultados en .labels_ (asignaciones) y .cluster_centers_ (centroides).",           color:"#10b981" },
              { label:"Limitación",   desc:"Puede quedar en óptimos locales. Usar n_init > 1 y random_state para reproducibilidad.",                  color:"#6366f1" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · K-Means</span>
        </div>

      </div>
    </div>
  );
}