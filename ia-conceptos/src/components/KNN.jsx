import { useState, useMemo } from "react";

// ── Demo: Visualizador KNN interactivo ────────────────────────────
function KNNDemo() {
  const [k, setK] = useState(5);
  const [queryX, setQueryX] = useState(0);
  const [queryY, setQueryY] = useState(0);

  // Datos Iris simplificados (petal length vs petal width, estandarizados)
  const datos = [
    // Setosa (clase 0) — pétalos pequeños
    [-1.5,-1.3],[-1.4,-1.4],[-1.6,-1.3],[-1.3,-1.4],[-1.5,-1.2],
    [-1.4,-1.3],[-1.7,-1.4],[-1.3,-1.3],[-1.5,-1.5],[-1.4,-1.2],
    // Versicolor (clase 1) — pétalos medianos
    [0.2,-0.1],[0.3, 0.2],[0.1, 0.1],[0.5, 0.3],[0.4,-0.1],
    [0.6, 0.4],[0.2, 0.3],[-0.1,0.1],[0.3,-0.2],[0.5, 0.2],
    // Virginica (clase 2) — pétalos grandes
    [1.1, 0.9],[1.3, 1.1],[1.2, 1.0],[1.4, 1.2],[1.0, 0.8],
    [1.5, 1.3],[1.2, 1.1],[1.3, 0.9],[1.1, 1.0],[1.4, 1.0],
  ];
  const clases = [
    ...Array(10).fill(0),
    ...Array(10).fill(1),
    ...Array(10).fill(2),
  ];

  const colores = ["#f43f5e","#0ea5e9","#10b981"];
  const nombres = ["Setosa","Versicolor","Virginica"];

  // Calcular distancias al punto query
  const conDistancias = useMemo(() =>
    datos.map(([x, y], i) => ({
      x, y, clase: clases[i],
      dist: Math.sqrt((x - queryX) ** 2 + (y - queryY) ** 2),
    })).sort((a, b) => a.dist - b.dist),
    [queryX, queryY]
  );

  const kVecinos = conDistancias.slice(0, k);
  const votos = [0,1,2].map(c => kVecinos.filter(v => v.clase === c).length);
  const prediccion = votos.indexOf(Math.max(...votos));

  // SVG
  const W = 340, H = 240, PAD = 30;
  const xMin = -2.2, xMax = 2.2, yMin = -2.0, yMax = 2.0;
  const sx = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD * 2);
  const sy = (y) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - PAD * 2);

  // Radio del vecino más lejano (para dibujar el círculo de vecindad)
  const radioVecindad = kVecinos.length > 0 ? kVecinos[kVecinos.length - 1].dist : 0;
  const radioSVG = radioVecindad * ((W - PAD * 2) / (xMax - xMin));

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — KNN interactivo: dataset Iris</p>

      <div className="bg-black/40 rounded-xl border border-white/10 mb-4 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
          {/* Grid */}
          {[-1,0,1].map(v => (
            <g key={v}>
              <line x1={sx(v)} y1={PAD} x2={sx(v)} y2={H-PAD} stroke="#ffffff08" strokeWidth="1"/>
              <line x1={PAD} y1={sy(v)} x2={W-PAD} y2={sy(v)} stroke="#ffffff08" strokeWidth="1"/>
            </g>
          ))}
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H-PAD} stroke="#ffffff15" strokeWidth="1"/>
          <line x1={PAD} y1={sy(0)} x2={W-PAD} y2={sy(0)} stroke="#ffffff15" strokeWidth="1"/>

          {/* Círculo de vecindad */}
          <circle cx={sx(queryX)} cy={sy(queryY)} r={radioSVG}
            fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>

          {/* Líneas a vecinos */}
          {kVecinos.map((v, i) => (
            <line key={i} x1={sx(queryX)} y1={sy(queryY)} x2={sx(v.x)} y2={sy(v.y)}
              stroke={colores[v.clase]} strokeWidth="1" opacity="0.4" strokeDasharray="3,2"/>
          ))}

          {/* Puntos del dataset */}
          {datos.map(([x, y], i) => {
            const isVecino = kVecinos.some(v => v.x === x && v.y === y);
            return (
              <circle key={i} cx={sx(x)} cy={sy(y)} r={isVecino ? 5 : 3.5}
                fill={colores[clases[i]]}
                opacity={isVecino ? 1 : 0.5}
                stroke={isVecino ? "#fff" : "none"}
                strokeWidth={isVecino ? 1.5 : 0}/>
            );
          })}

          {/* Punto query */}
          <circle cx={sx(queryX)} cy={sy(queryY)} r="7"
            fill={colores[prediccion]} stroke="#fff" strokeWidth="2.5" opacity="0.9"/>
          <text x={sx(queryX)+10} y={sy(queryY)-8} fill="#fff" fontSize="9" fontFamily="monospace">
            ?
          </text>

          {/* Leyenda */}
          {nombres.map((n, i) => (
            <g key={n}>
              <circle cx={PAD + i * 90 + 6} cy={H - 10} r="4" fill={colores[i]}/>
              <text x={PAD + i * 90 + 14} y={H - 6} fill="#ffffff50" fontSize="8">{n}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Controles */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-mono">k (número de vecinos)</span>
            <span className="text-amber-300 font-bold font-mono">{k}</span>
          </div>
          <div className="flex gap-2">
            {[1,3,5,7,9].map(v => (
              <button key={v} onClick={() => setK(v)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-all font-mono ${
                  k === v ? "border-amber-400/60 bg-amber-500/20 text-amber-300 font-bold"
                          : "border-white/10 bg-white/5 text-gray-500 hover:bg-white/10"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-mono">Petal length (x)</span>
              <span className="text-sky-300 font-bold font-mono">{queryX.toFixed(1)}</span>
            </div>
            <input type="range" min={-2} max={2} step={0.1} value={queryX}
              onChange={e => setQueryX(Number(e.target.value))}
              className="w-full accent-sky-500"/>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-mono">Petal width (y)</span>
              <span className="text-violet-300 font-bold font-mono">{queryY.toFixed(1)}</span>
            </div>
            <input type="range" min={-2} max={2} step={0.1} value={queryY}
              onChange={e => setQueryY(Number(e.target.value))}
              className="w-full accent-violet-500"/>
          </div>
        </div>
      </div>

      {/* Votación */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {nombres.map((n, i) => {
          const c = {
            0:{ border:"border-rose-500/30",   bg:"bg-rose-500/10",   text:"text-rose-300",   winBg:"bg-rose-500/20",   winBorder:"border-rose-400/60" },
            1:{ border:"border-sky-500/30",    bg:"bg-sky-500/10",    text:"text-sky-300",    winBg:"bg-sky-500/20",    winBorder:"border-sky-400/60" },
            2:{ border:"border-emerald-500/30",bg:"bg-emerald-500/10",text:"text-emerald-300",winBg:"bg-emerald-500/20",winBorder:"border-emerald-400/60" },
          }[i];
          const isWinner = i === prediccion;
          return (
            <div key={n} className={`rounded-xl border p-3 text-center transition-all duration-300 ${
              isWinner ? `${c.winBorder} ${c.winBg}` : `${c.border} ${c.bg}`}`}>
              <p className={`text-xs font-bold mb-1 ${c.text}`}>{n}</p>
              <p className={`text-2xl font-black font-mono ${c.text}`}>{votos[i]}</p>
              <p className="text-gray-600 text-xs">votos</p>
              {isWinner && <p className="text-xs mt-1 text-white font-bold">✓ Clase</p>}
            </div>
          );
        })}
      </div>

      <p className="text-gray-600 text-xs font-mono text-center">
        k={k} → {k} vecinos más cercanos votan → <span style={{ color: colores[prediccion] }}>
          {nombres[prediccion]}</span> ({votos[prediccion]}/{k} votos)
      </p>
    </div>
  );
}

// ── Demo: Pipeline animado ────────────────────────────────────────
function PipelineDemo() {
  const steps = [
    { id:0, label:"Importar librerías",         icon:"📦", color:"sky",    code:"from sklearn import datasets\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler" },
    { id:1, label:"Cargar Iris dataset",        icon:"📂", color:"violet", code:"iris = datasets.load_iris()\nX = iris.data[:, [2, 3]]   # petal length, width\ny = iris.target\n# 150 muestras, 3 clases (50 c/u)" },
    { id:2, label:"Split 70/30",                icon:"✂️",  color:"emerald",code:"X_train, X_test, y_train, y_test =\n  train_test_split(X, y, test_size=0.3, random_state=0)" },
    { id:3, label:"Estandarizar features",      icon:"⚖️",  color:"amber",  code:"sc = StandardScaler()\nsc.fit(X_train)\nX_train_std = sc.transform(X_train)\nX_test_std  = sc.transform(X_test)" },
    { id:4, label:"Crear y entrenar KNN (k=5)", icon:"🧠",  color:"rose",   code:"knn = KNeighborsClassifier(\n  n_neighbors=5, p=2, metric='minkowski')\nknn.fit(X_train_std, y_train)" },
    { id:5, label:"Predecir y evaluar",         icon:"📊",  color:"sky",    code:"y_pred = knn.predict(X_test_std)\nfrom sklearn.metrics import accuracy_score\nprint(accuracy_score(y_test, y_pred))" },
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
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Pipeline: KNN en Iris dataset</p>
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
export default function KNN({ onBack }) {
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
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-900/8 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-amber-900/8 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo IV</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-sky-400" style={{ fontFamily:"monospace" }}>KNN</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#0ea5e9", color:"#0ea5e9", fontFamily:"monospace" }}>
            🔵 Módulo IV · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            K-Nearest{" "}
            <span style={{
              background:"linear-gradient(135deg, #0ea5e9, #f59e0b, #10b981)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Neighbors</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Algoritmo de clasificación basado en
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">instancias</code>
            que clasifica por
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">votación de mayoría</code>
            entre los
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">k vecinos más cercanos</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",     label:"📌 Introducción" },
            { href:"#algoritmo", label:"🔢 Algoritmo" },
            { href:"#distancias",label:"📐 Distancias" },
            { href:"#k",         label:"⚙️ Elección de k" },
            { href:"#demo",      label:"🎮 Demo interactiva" },
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
            <strong className="text-white">KNN (K-Nearest Neighbors)</strong> es un método que busca las observaciones más cercanas a la que se desea predecir y clasifica el punto de interés basado en la <strong className="text-white">mayoría de datos que le rodean</strong>. No aprende un modelo explícito — memoriza el dataset.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-emerald-300 text-xs font-bold mb-3">✅ Características</p>
              <ul className="space-y-2">
                {[
                  { icon:"🏷️", text:"Supervisado: requiere datos de entrenamiento etiquetados." },
                  { icon:"📦", text:"Basado en instancias: memoriza el conjunto de entrenamiento como base de conocimiento." },
                  { icon:"🚀", text:"Simple de aprender e implementar." },
                  { icon:"🎯", text:"Efectivo para fronteras de decisión complejas y no lineales." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <p className="text-gray-400 text-xs leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
              <p className="text-rose-300 text-xs font-bold mb-3">⚠️ Limitaciones</p>
              <ul className="space-y-2">
                {[
                  { icon:"💾", text:"Usa todo el dataset para clasificar cada punto — mucha memoria." },
                  { icon:"🐢", text:"Lento en datasets grandes: calcula distancias a todos los puntos de entrenamiento." },
                  { icon:"📉", text:"Sufre con alta dimensionalidad (maldición de la dimensionalidad)." },
                  { icon:"⚖️", text:"Features sin estandarizar dominan la métrica de distancia." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <p className="text-gray-400 text-xs leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Tip color="sky">
            KNN funciona mejor con <strong>datasets pequeños</strong> y sin una cantidad enorme de features. Siempre estandariza las variables antes de aplicarlo.
          </Tip>
        </section>

        {/* ══ 2. ALGORITMO ═════════════════════════════════════ */}
        <section id="algoritmo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🔢" title="Algoritmo: 3 pasos" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Para clasificar un nuevo punto, KNN sigue tres pasos simples.
          </p>
          <div className="space-y-4">
            {[
              {
                num:"01", icon:"📏", title:"Calcular distancias",   color:"sky",
                desc:"Calcular la distancia entre el item a clasificar y todos los items del dataset de entrenamiento.",
                formula:"d(xₙ, xₘ) para todo xₘ en el dataset",
              },
              {
                num:"02", icon:"🎯", title:"Seleccionar k vecinos", color:"violet",
                desc:"Seleccionar los k elementos con menor distancia al punto de consulta.",
                formula:"k_vecinos = argsort(distancias)[:k]",
              },
              {
                num:"03", icon:"🗳️", title:"Votación de mayoría",  color:"emerald",
                desc:"La clase más frecuente entre los k vecinos determina la clasificación del nuevo punto.",
                formula:"ŷ = argmax_c [ count(vecinos de clase c) ]",
              },
            ].map((item) => (
              <StepCard key={item.num} num={item.num} icon={item.icon} title={item.title} color={item.color}>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{item.desc}</p>
                <Formula color={item.color}>{item.formula}</Formula>
              </StepCard>
            ))}
          </div>
        </section>

        {/* ══ 3. DISTANCIAS ════════════════════════════════════ */}
        <section id="distancias" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="📐" title="Métricas de Distancia" color="#f59e0b" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            La "cercanía" entre dos puntos puede medirse de distintas formas. La elección afecta directamente los vecinos seleccionados.
          </p>
          <div className="space-y-4">
            {[
              {
                name:"Distancia Euclídea (L²)",   color:"sky",    p:"p=2",
                formula:"d(x,y) = √( Σᵢ (xᵢ − yᵢ)² )",
                desc:"La distancia en línea recta entre dos puntos. La más común en KNN.",
                uso:"Datos continuos en espacios de baja dimensión. Parámetro por defecto en sklearn.",
              },
              {
                name:"Distancia Manhattan (L¹)",  color:"violet", p:"p=1",
                formula:"d(x,y) = Σᵢ |xᵢ − yᵢ|",
                desc:"Suma de diferencias absolutas. Como moverse en una cuadrícula de ciudad.",
                uso:"Cuando los datos tienen muchas dimensiones o valores atípicos.",
              },
              {
                name:"Similitud Coseno",           color:"amber",  p:"angle",
                formula:"sim(x,y) = (x·y) / (‖x‖·‖y‖)",
                desc:"Mide el ángulo entre vectores. Insensible a la magnitud.",
                uso:"Clasificación de texto, sistemas de recomendación.",
              },
              {
                name:"Distancia Minkowski",        color:"emerald",p:"p=k",
                formula:"d(x,y) = ( Σᵢ |xᵢ − yᵢ|ᵖ )^(1/p)",
                desc:"Generalización: p=1 es Manhattan, p=2 es Euclídea. sklearn usa Minkowski.",
                uso:"Parámetro 'p' en KNeighborsClassifier (p=2 por defecto).",
              },
            ].map((d) => {
              const c = {
                sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    badge:"bg-sky-500/20 text-sky-300" },
                violet: { border:"border-violet-500/20", bg:"bg-violet-500/5", text:"text-violet-300", badge:"bg-violet-500/20 text-violet-300" },
                amber:  { border:"border-amber-500/20",  bg:"bg-amber-500/5",  text:"text-amber-300",  badge:"bg-amber-500/20 text-amber-300" },
                emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",badge:"bg-emerald-500/20 text-emerald-300" },
              }[d.color];
              return (
                <div key={d.name} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold text-sm ${c.text}`}>{d.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${c.badge}`}>{d.p}</span>
                  </div>
                  <Formula color={d.color}>{d.formula}</Formula>
                  <p className="text-gray-500 text-xs mb-2 leading-relaxed">{d.desc}</p>
                  <p className={`text-xs font-mono italic ${c.text} opacity-70`}>Uso: {d.uso}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <Tip color="amber">
              En el notebook se usa <code>metric='minkowski', p=2</code> — que es equivalente a la distancia euclídea. Siempre <strong>estandariza los datos</strong> antes de calcular distancias para que ninguna feature domine por escala.
            </Tip>
          </div>
        </section>

        {/* ══ 4. ELECCIÓN DE K ═════════════════════════════════ */}
        <section id="k" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="⚙️" title="Elección de k" color="#f43f5e" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            El valor de k es el hiperparámetro más importante de KNN. Determina cuántos vecinos participan en la votación y define las fronteras de decisión.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              {
                k:"k muy bajo (k=1)", icon:"🎯", color:"rose", tag:"Overfitting",
                desc:"El modelo se adapta demasiado a los datos. Fronteras de decisión muy irregulares.",
                note:"Alta varianza — sensible al ruido.",
              },
              {
                k:"k ideal",          icon:"✅", color:"emerald", tag:"Buen ajuste",
                desc:"Balance óptimo entre bias y varianza. Fronteras suaves pero precisas.",
                note:"Usar validación cruzada para encontrarlo.",
              },
              {
                k:"k muy alto",       icon:"📉", color:"sky", tag:"Underfitting",
                desc:"El modelo es demasiado general. Fronteras excesivamente suaves.",
                note:"Alto bias — pierde patrones locales.",
              },
            ].map((item) => {
              const c = {
                rose:   { border:"border-rose-500/20",   bg:"bg-rose-500/5",   text:"text-rose-300",   badge:"bg-rose-500/20 text-rose-300" },
                emerald:{ border:"border-emerald-500/20",bg:"bg-emerald-500/5",text:"text-emerald-300",badge:"bg-emerald-500/20 text-emerald-300" },
                sky:    { border:"border-sky-500/20",    bg:"bg-sky-500/5",    text:"text-sky-300",    badge:"bg-sky-500/20 text-sky-300" },
              }[item.color];
              return (
                <div key={item.k} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                  <span className="text-xl mb-2 block">{item.icon}</span>
                  <div className="flex items-center gap-2 mb-2">
                    <p className={`text-xs font-bold ${c.text}`}>{item.k}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.badge}`}>{item.tag}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-2 leading-relaxed">{item.desc}</p>
                  <p className={`text-xs font-mono italic ${c.text} opacity-70`}>{item.note}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-amber-300 text-xs font-bold mb-2">Reglas prácticas</p>
            <ul className="space-y-2">
              {[
                "Usa valores impares de k para evitar empates en clasificación binaria.",
                "Un buen punto de partida es k = √n donde n es el número de muestras.",
                "Evalúa múltiples valores de k con cross-validation para encontrar el óptimo.",
                "Más k → más lento, pero más robusto al ruido. Menos k → más rápido, pero más sensible.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"/>
                  <p className="text-gray-400 text-xs leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ 5. DEMO INTERACTIVA ══════════════════════════════ */}
        <section id="demo" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="🎮" title="Demo Interactiva" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Mueve el punto de consulta (⭕) por el espacio Iris y cambia k para ver cómo cambian los vecinos seleccionados y el resultado de la votación.
          </p>
          <KNNDemo />
          <div className="mt-5">
            <Tip color="emerald">
              Observa cómo en la zona frontera entre Versicolor y Virginica, el resultado cambia según k. Con k=1 el modelo es muy sensible a la posición exacta; con k=9 la decisión es más estable.
            </Tip>
          </div>
        </section>

        {/* ══ 6. PRÁCTICA ══════════════════════════════════════ */}
        <section id="practica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🧪" title="Práctica — Iris Dataset con KNN" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            El notebook clasifica las tres especies de iris usando solo <strong className="text-white">petal length y petal width</strong> (las dos features más discriminantes) con KNN k=5.
          </p>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-6">
            <p className="text-violet-300 text-xs font-bold mb-3">Dataset: Iris de Fisher</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label:"Iris Setosa",      val:"50",  color:"rose" },
                { label:"Iris Versicolor",  val:"50",  color:"sky" },
                { label:"Iris Virginica",   val:"50",  color:"emerald" },
              ].map((m) => {
                const col = { rose:"text-rose-300 bg-rose-500/10", sky:"text-sky-300 bg-sky-500/10", emerald:"text-emerald-300 bg-emerald-500/10" }[m.color];
                return (
                  <div key={m.label} className={`rounded-lg p-3 text-center ${col.split(" ")[1]}`}>
                    <p className={`text-xl font-black font-mono ${col.split(" ")[0]}`}>{m.val}</p>
                    <p className="text-gray-600 text-xs">{m.label}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-gray-500 text-xs font-mono">150 muestras totales · 4 features · 3 clases · Solo se usan features [2,3] (pétalos)</p>
          </div>

          <PipelineDemo />

          <div className="mt-6">
            <p className="text-white font-semibold mb-4">Código completo con sklearn</p>
            <CodeBlock>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.neighbors </span><span className="text-sky-400">import</span><span className="text-white"> KNeighborsClassifier</span></p>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.preprocessing </span><span className="text-sky-400">import</span><span className="text-white"> StandardScaler</span></p>
              <p className="mt-1 text-gray-500"># Estandarizar (imprescindible en KNN)</p>
              <p><span className="text-emerald-400">sc</span><span className="text-white"> = StandardScaler()</span></p>
              <p><span className="text-emerald-400">X_train_std</span><span className="text-white"> = sc.fit_transform(X_train)</span></p>
              <p><span className="text-emerald-400">X_test_std</span><span className="text-white"> = sc.transform(X_test)</span></p>
              <p className="mt-1 text-gray-500"># Crear y entrenar KNN</p>
              <p><span className="text-emerald-400">knn</span><span className="text-white"> = KNeighborsClassifier(</span></p>
              <p><span className="text-white">    n_neighbors=</span><span className="text-amber-300">5</span><span className="text-white">, p=</span><span className="text-amber-300">2</span><span className="text-white">, metric=</span><span className="text-green-300">'minkowski'</span><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">knn</span><span className="text-white">.fit(X_train_std, y_train)</span></p>
              <p className="mt-1 text-gray-500"># Predecir</p>
              <p><span className="text-emerald-400">y_pred</span><span className="text-white"> = knn.predict(X_test_std)</span></p>
            </CodeBlock>

            <Tip color="violet">
              El notebook también incluye la función <code>plot_decision_regions</code> que visualiza las <strong>fronteras de decisión</strong> del clasificador — zonas coloreadas que muestran qué clase predice KNN en cada región del espacio de features.
            </Tip>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"KNN",             desc:"Clasificador basado en instancias. No aprende modelo — memoriza el dataset de entrenamiento.",        color:"#0ea5e9" },
              { label:"Algoritmo",       desc:"1) Calcular distancias · 2) Seleccionar k vecinos · 3) Votación de mayoría → clase predicha.",        color:"#a855f7" },
              { label:"k",               desc:"Hiperparámetro clave. k bajo → overfitting. k alto → underfitting. Usar valores impares.",            color:"#f59e0b" },
              { label:"Distancia",       desc:"Euclídea (p=2) por defecto. Siempre estandarizar features antes de calcular distancias.",             color:"#f43f5e" },
              { label:"sklearn",         desc:"KNeighborsClassifier(n_neighbors=5, p=2, metric='minkowski'). Requiere StandardScaler previo.",       color:"#10b981" },
              { label:"Cuándo usarlo",   desc:"Datasets pequeños, pocas features. No escala bien a millones de muestras o cientos de features.",    color:"#6366f1" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo IV · KNN</span>
        </div>

      </div>
    </div>
  );
}