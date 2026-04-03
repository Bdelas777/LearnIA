import { useState } from "react";

// ── Demo: Selector de tipo de gráfico ────────────────────────────
function ChartAdvisorDemo() {
  const [varA, setVarA] = useState("continua");
  const [varB, setVarB] = useState("continua");
  const [count, setCount] = useState("bivariado");

  const getRecommendation = () => {
    if (count === "univariado") {
      if (varA === "continua") return { chart: "Histograma", lib: "Matplotlib", syntax: "plt.hist(data, bins=10)", color: "sky", desc: "Muestra la distribución de una variable continua." };
      return { chart: "Gráfico de Barras", lib: "Matplotlib / Seaborn", syntax: "plt.bar(categorias, valores)", color: "violet", desc: "Cuenta cuántas veces aparece cada categoría." };
    }
    if (varA === "continua" && varB === "continua") return { chart: "Dispersión (Scatter)", lib: "Matplotlib / Seaborn", syntax: "plt.scatter(x, y)", color: "emerald", desc: "Muestra la correlación entre dos variables continuas." };
    if (varA === "continua" && varB === "discreta") return { chart: "Boxplot por grupo", lib: "Seaborn", syntax: "sns.boxplot(x=cat, y=val)", color: "amber", desc: "Compara distribuciones entre grupos categóricos." };
    if (varA === "discreta" && varB === "continua") return { chart: "Violin / Boxplot", lib: "Seaborn", syntax: "sns.violinplot(x=cat, y=val)", color: "rose", desc: "Distribución de variable continua por categoría." };
    return { chart: "Heatmap / Mosaico", lib: "Seaborn", syntax: "sns.heatmap(tabla)", color: "sky", desc: "Relación entre dos variables categóricas." };
  };

  const r = getRecommendation();
  const colorMap = {
    sky:     { bg: "bg-sky-500/15",     border: "border-sky-500/40",     text: "text-sky-300",     badge: "bg-sky-500/20 text-sky-300" },
    violet:  { bg: "bg-violet-500/15",  border: "border-violet-500/40",  text: "text-violet-300",  badge: "bg-violet-500/20 text-violet-300" },
    emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-300", badge: "bg-emerald-500/20 text-emerald-300" },
    amber:   { bg: "bg-amber-500/15",   border: "border-amber-500/40",   text: "text-amber-300",   badge: "bg-amber-500/20 text-amber-300" },
    rose:    { bg: "bg-rose-500/15",    border: "border-rose-500/40",    text: "text-rose-300",    badge: "bg-rose-500/20 text-rose-300" },
  };
  const c = colorMap[r.color];

  const Pill = ({ value, current, onChange, label }) => (
    <button onClick={() => onChange(value)}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
        current === value
          ? "border-violet-400/60 bg-violet-500/20 text-violet-300"
          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}>
      {label}
    </button>
  );

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-5 uppercase tracking-widest">🎮 Demo interactiva — ¿Qué gráfico usar?</p>
      <div className="space-y-4 mb-5">
        <div>
          <p className="text-gray-500 text-xs mb-2 font-mono">¿Cuántas variables?</p>
          <div className="flex gap-2">
            <Pill value="univariado" current={count} onChange={setCount} label="Univariado (1 variable)" />
            <Pill value="bivariado"  current={count} onChange={setCount} label="Bivariado (2 variables)" />
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-2 font-mono">Tipo de variable A</p>
          <div className="flex gap-2">
            <Pill value="continua" current={varA} onChange={setVarA} label="Continua (numérica)" />
            <Pill value="discreta" current={varA} onChange={setVarA} label="Discreta (categórica)" />
          </div>
        </div>
        {count === "bivariado" && (
          <div>
            <p className="text-gray-500 text-xs mb-2 font-mono">Tipo de variable B</p>
            <div className="flex gap-2">
              <Pill value="continua" current={varB} onChange={setVarB} label="Continua (numérica)" />
              <Pill value="discreta" current={varB} onChange={setVarB} label="Discreta (categórica)" />
            </div>
          </div>
        )}
      </div>
      <div className={`rounded-xl border ${c.border} ${c.bg} p-4 transition-all duration-300`}>
        <div className="flex items-start justify-between mb-2">
          <p className={`font-bold text-lg ${c.text}`}>{r.chart}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-mono ${c.badge}`}>{r.lib}</span>
        </div>
        <p className="text-gray-400 text-sm mb-3">{r.desc}</p>
        <code className="text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-2 block font-mono text-gray-300">
          {r.syntax}
        </code>
      </div>
    </div>
  );
}

// ── Demo: Explorador de gráficos ──────────────────────────────────
function ChartViewerDemo() {
  const [active, setActive] = useState(0);

  const charts = [
    {
      name: "Líneas",      tag: "Continuo",     color: "sky",
      desc: "Representa la relación entre dos variables. Ideal para tendencias y funciones matemáticas.",
      syntax: "plt.plot(x, y)",
      svg: (
        <svg viewBox="0 0 120 60" className="w-full h-16">
          <polyline points="5,55 20,40 35,45 55,20 75,30 95,10 115,18"
            fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="55" cy="20" r="3" fill="#0ea5e9" />
          <circle cx="95" cy="10" r="3" fill="#0ea5e9" />
        </svg>
      ),
    },
    {
      name: "Histograma",  tag: "Distribución", color: "violet",
      desc: "Muestra la frecuencia de observaciones en rangos (bins). Revela la distribución de los datos.",
      syntax: "plt.hist(data, bins=10)",
      svg: (
        <svg viewBox="0 0 120 60" className="w-full h-16">
          {[[5,52],[16,40],[27,28],[38,18],[49,10],[60,14],[71,24],[82,38],[93,48],[104,54]].map(([x,y],i) => (
            <rect key={i} x={x} y={y} width={8} height={60-y} fill="#8b5cf6" opacity={0.65+i*0.03} rx="1"/>
          ))}
        </svg>
      ),
    },
    {
      name: "Boxplot",     tag: "Estadístico",  color: "amber",
      desc: "Visualiza Q1, mediana, Q3 y outliers. Detecta valores atípicos y dispersión rápidamente.",
      syntax: "plt.boxplot(data)",
      svg: (
        <svg viewBox="0 0 120 60" className="w-full h-16">
          <line x1="60" y1="8"  x2="60" y2="20" stroke="#f59e0b" strokeWidth="2"/>
          <line x1="60" y1="45" x2="60" y2="55" stroke="#f59e0b" strokeWidth="2"/>
          <rect x="35" y="20" width="50" height="25" fill="none" stroke="#f59e0b" strokeWidth="2" rx="2"/>
          <line x1="35" y1="32" x2="85" y2="32" stroke="#f59e0b" strokeWidth="2.5"/>
          <line x1="48" y1="8"  x2="72" y2="8"  stroke="#f59e0b" strokeWidth="2"/>
          <line x1="48" y1="55" x2="72" y2="55" stroke="#f59e0b" strokeWidth="2"/>
          <circle cx="15"  cy="28" r="3" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
          <circle cx="108" cy="35" r="3" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      name: "Dispersión",  tag: "Correlación",  color: "emerald",
      desc: "Representa puntos en ejes XY. Detecta correlaciones y agrupaciones entre dos variables.",
      syntax: "plt.scatter(x, y)",
      svg: (
        <svg viewBox="0 0 120 60" className="w-full h-16">
          {[[15,50],[22,42],[30,38],[38,30],[45,28],[52,22],[60,18],[68,14],[78,10],[90,6],[100,8],[110,5]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="3.5" fill="#10b981" opacity="0.8"/>
          ))}
        </svg>
      ),
    },
    {
      name: "Barras",      tag: "Categórico",   color: "rose",
      desc: "Compara cantidades entre categorías. Permite orientación horizontal o vertical.",
      syntax: "plt.bar(x, height)",
      svg: (
        <svg viewBox="0 0 120 60" className="w-full h-16">
          {[[8,20],[28,12],[48,38],[68,8],[88,28]].map(([x,h],i) => (
            <rect key={i} x={x} y={60-h} width="16" height={h} fill="#f43f5e" opacity={0.55+i*0.1} rx="2"/>
          ))}
        </svg>
      ),
    },
    {
      name: "Scatter 3D",  tag: "Multivariado", color: "purple",
      desc: "Extiende el scatter a tres dimensiones. Explora relaciones entre tres variables a la vez.",
      syntax: "ax.scatter3D(x, y, z)",
      svg: (
        <svg viewBox="0 0 120 60" className="w-full h-16">
          <line x1="20" y1="55" x2="100" y2="55" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
          <line x1="20" y1="55" x2="20"  y2="10" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
          <line x1="20" y1="55" x2="5"   y2="42" stroke="#a855f7" strokeWidth="1" opacity="0.4"/>
          {[[55,25,6],[70,15,9],[40,35,5],[85,30,7],[60,45,4],[30,20,8],[90,12,5]].map(([cx,cy,r],i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#a855f7" opacity={0.35+i*0.09}/>
          ))}
        </svg>
      ),
    },
  ];

  const colorMap = {
    sky:     { border:"border-sky-500/20",     activeBorder:"border-sky-400/60",     activeBg:"bg-sky-500/15",     text:"text-sky-300",     badge:"bg-sky-500/20 text-sky-300" },
    violet:  { border:"border-violet-500/20",  activeBorder:"border-violet-400/60",  activeBg:"bg-violet-500/15",  text:"text-violet-300",  badge:"bg-violet-500/20 text-violet-300" },
    amber:   { border:"border-amber-500/20",   activeBorder:"border-amber-400/60",   activeBg:"bg-amber-500/15",   text:"text-amber-300",   badge:"bg-amber-500/20 text-amber-300" },
    emerald: { border:"border-emerald-500/20", activeBorder:"border-emerald-400/60", activeBg:"bg-emerald-500/15", text:"text-emerald-300", badge:"bg-emerald-500/20 text-emerald-300" },
    rose:    { border:"border-rose-500/20",    activeBorder:"border-rose-400/60",    activeBg:"bg-rose-500/15",    text:"text-rose-300",    badge:"bg-rose-500/20 text-rose-300" },
    purple:  { border:"border-purple-500/20",  activeBorder:"border-purple-400/60",  activeBg:"bg-purple-500/15",  text:"text-purple-300",  badge:"bg-purple-500/20 text-purple-300" },
  };

  const sel = charts[active];
  const sc  = colorMap[sel.color];

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Explorador de gráficos</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {charts.map((ch, i) => {
          const cc = colorMap[ch.color];
          return (
            <button key={i} onClick={() => setActive(i)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                active === i
                  ? `${cc.activeBorder} ${cc.activeBg} ${cc.text}`
                  : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              {ch.name}
            </button>
          );
        })}
      </div>
      <div className={`rounded-xl border ${sc.activeBorder} ${sc.activeBg} p-4 transition-all duration-300`}>
        <div className="flex items-start justify-between mb-3">
          <p className={`font-bold text-base ${sc.text}`}>{sel.name}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-mono ${sc.badge}`}>{sel.tag}</span>
        </div>
        <div className="mb-3 opacity-90">{sel.svg}</div>
        <p className="text-gray-400 text-sm mb-3">{sel.desc}</p>
        <code className="text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-2 block font-mono text-gray-300">
          {sel.syntax}
        </code>
      </div>
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

function CodeBlock({ children }) {
  return (
    <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-4"
      style={{ fontFamily:"monospace", fontSize:"0.875rem", lineHeight:2 }}>
      {children}
    </div>
  );
}

function FeatureList({ items, color }) {
  const dot = { sky:"bg-sky-400", violet:"bg-violet-400", emerald:"bg-emerald-400", amber:"bg-amber-400" }[color] || "bg-gray-400";
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${dot} mt-2 flex-shrink-0`} />
          <p className="text-gray-400 text-sm leading-relaxed">{item}</p>
        </li>
      ))}
    </ul>
  );
}

// ── Página principal ──────────────────────────────────────────────
export default function MatplotlibSeaborn({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily:"'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        code { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-sky-900/15 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-violet-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-sky-400" style={{ fontFamily:"monospace" }}>Matplotlib y Seaborn</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#0ea5e9", color:"#0ea5e9", fontFamily:"monospace" }}>
            📊 Módulo III · Visualización de Datos
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Visualización{" "}
            <span style={{
              background:"linear-gradient(135deg, #0ea5e9, #10b981, #f59e0b)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>de Datos</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Representa datos complejos visualmente con las dos librerías más usadas en Machine Learning:
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">Matplotlib</code> y
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">Seaborn</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",      label:"📌 Introducción" },
            { href:"#matplotlib", label:"📈 Matplotlib" },
            { href:"#seaborn",    label:"🎨 Seaborn" },
            { href:"#naturaleza", label:"🔬 Naturaleza" },
            { href:"#tipos",      label:"📊 Tipos de gráficos" },
            { href:"#buenas",     label:"✅ Buenas prácticas" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ 1. INTRODUCCIÓN ══════════════════════════════════ */}
        <section id="intro" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📌" title="Introducción a la Visualización" color="#0ea5e9" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Recorrer manualmente un dataset rara vez produce buenos resultados: los datos del mundo real son <strong className="text-white">demasiado grandes</strong> para analizarlos a mano. La visualización convierte datos complejos en representaciones gráficas que revelan tendencias y relaciones de forma inmediata.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon:"◈", title:"Representación clara",       desc:"Simplifica datos complejos en imágenes comprensibles al instante." },
              { icon:"◉", title:"Rendimiento visible",        desc:"Destaca áreas de buen y mal desempeño de forma inmediata." },
              { icon:"◌", title:"Relaciones entre variables", desc:"Explora correlaciones y dependencias que son invisibles en tablas." },
              { icon:"◍", title:"Patrones en big data",       desc:"Identifica estructuras incluso en millones de puntos de datos." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-start gap-3">
                <span className="text-sky-500/60 text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold mb-0.5">{item.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Tip color="sky">
            Existen muchas librerías de visualización en Python, pero <strong>Matplotlib</strong> y <strong>Seaborn</strong> destacan por su facilidad de uso y son las herramientas más utilizadas en Machine Learning.
          </Tip>
        </section>

        {/* ══ 2. MATPLOTLIB ════════════════════════════════════ */}
        <section id="matplotlib" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="📈" title="Matplotlib" color="#0ea5e9" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Librería de visualización <strong className="text-white">2D multiplataforma</strong> construida sobre NumPy. Introducida por <strong className="text-white">John Hunter en 2002</strong>, es la base de casi toda la visualización científica en Python.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Importación estándar</p>
            <p><span className="text-sky-400">from</span><span className="text-white"> matplotlib </span><span className="text-sky-400">import</span><span className="text-white"> pyplot </span><span className="text-sky-400">as</span><span className="text-emerald-400"> plt</span></p>
            <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-emerald-400"> np</span></p>
          </CodeBlock>
          <FeatureList color="sky" items={[
            "Rápido y eficiente: se basa en NumPy para operaciones vectorizadas de alto rendimiento.",
            "Mejorado continuamente por la comunidad open-source desde su creación en 2002.",
            "Produce gráficos de alta calidad listos para publicaciones científicas.",
            "Permite construir gráficos básicos y avanzados (3D, animaciones) con la misma API.",
            "Gran soporte comunitario: resolución de problemas y depuración mucho más fácil.",
          ]} />
        </section>

        {/* ══ 3. SEABORN ═══════════════════════════════════════ */}
        <section id="seaborn" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="🎨" title="Seaborn" color="#10b981" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Conceptualizada en la <strong className="text-white">Universidad de Stanford</strong>, se construye encima de Matplotlib. Añade mejor estética, funciones estadísticas integradas y una API de alto nivel.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Importación estándar</p>
            <p><span className="text-sky-400">import</span><span className="text-white"> seaborn </span><span className="text-sky-400">as</span><span className="text-emerald-400"> sns</span></p>
            <p><span className="text-sky-400">import</span><span className="text-white"> pandas </span><span className="text-sky-400">as</span><span className="text-emerald-400"> pd</span></p>
          </CodeBlock>
          <FeatureList color="emerald" items={[
            "Temas integrados (darkgrid, whitegrid, ticks) para visualizaciones atractivas sin configuración extra.",
            "Funciones estadísticas nativas: intervalos de confianza, regresiones y distribuciones automáticas.",
            "Mejor estética por defecto que Matplotlib — gráficos profesionales de inmediato.",
            "Documentación detallada con ejemplos prácticos para cada tipo de gráfico.",
          ]} />
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-sky-300 text-xs font-bold mb-3 font-mono">Con Matplotlib</p>
              <div style={{ fontFamily:"monospace", fontSize:"0.78rem", lineHeight:1.9 }}>
                <p><span className="text-violet-400">fig</span><span className="text-white">, ax = plt.subplots()</span></p>
                <p><span className="text-white">ax.set_facecolor(</span><span className="text-green-300">'#eee'</span><span className="text-white">)</span></p>
                <p><span className="text-white">ax.scatter(x, y, c=</span><span className="text-green-300">'blue'</span><span className="text-white">)</span></p>
                <p><span className="text-white">plt.title(</span><span className="text-green-300">'Mi gráfico'</span><span className="text-white">)</span></p>
                <p><span className="text-white">plt.show()</span></p>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-300 text-xs font-bold mb-3 font-mono">Con Seaborn ✨</p>
              <div style={{ fontFamily:"monospace", fontSize:"0.78rem", lineHeight:1.9 }}>
                <p><span className="text-violet-400">sns</span><span className="text-white">.set_theme(style=</span><span className="text-green-300">'darkgrid'</span><span className="text-white">)</span></p>
                <p><span className="text-violet-400">sns</span><span className="text-white">.scatterplot(</span></p>
                <p><span className="text-white ml-4">data=df,</span></p>
                <p><span className="text-white ml-4">x=</span><span className="text-green-300">'col_x'</span><span className="text-white">, y=</span><span className="text-green-300">'col_y'</span><span className="text-white">,</span></p>
                <p><span className="text-white ml-4">hue=</span><span className="text-green-300">'grupo'</span><span className="text-white">)</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 4. NATURALEZA ════════════════════════════════════ */}
        <section id="naturaleza" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="🔬" title="Naturaleza de la Visualización" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            El tipo de gráfico correcto depende de <strong className="text-white">cuántas variables</strong> usas y de <strong className="text-white">qué tipo</strong> son (continuas o discretas).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono font-bold inline-block mb-3">Univariado</span>
              <h3 className="text-white font-semibold text-base mb-2">Una sola variable</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Para <strong className="text-violet-300">variables continuas</strong>: extensión y distribución.<br />
                Para <strong className="text-violet-300">variables discretas</strong>: conteo de cada categoría.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Histograma","Boxplot","Densidad KDE"].map(t => (
                  <span key={t} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-1 rounded-lg font-mono">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold inline-block mb-3">Bivariado</span>
              <h3 className="text-white font-semibold text-base mb-2">Dos variables</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                <strong className="text-amber-300">Continua + Continua</strong>: correlación.<br />
                <strong className="text-amber-300">Continua + Discreta</strong>: distribución por grupo.<br />
                <strong className="text-amber-300">Discreta + Discreta</strong>: frecuencias cruzadas.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Scatter","Líneas","Heatmap"].map(t => (
                  <span key={t} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-1 rounded-lg font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <ChartAdvisorDemo />
        </section>

        {/* ══ 5. TIPOS DE GRÁFICOS ═════════════════════════════ */}
        <section id="tipos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="📊" title="Tipos de Gráficos" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Cada tipo de gráfico está diseñado para revelar un aspecto diferente de los datos. Selecciona uno para ver su descripción y sintaxis.
          </p>
          <ChartViewerDemo />
          <div className="mt-6">
            <h3 className="text-white font-semibold mb-4">Gráfico de líneas — ejemplo completo</h3>
            <CodeBlock>
              <p><span className="text-sky-400">import</span><span className="text-white"> matplotlib.pyplot </span><span className="text-sky-400">as</span><span className="text-emerald-400"> plt</span></p>
              <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-emerald-400"> np</span></p>
              <p className="mt-1"><span className="text-emerald-400">x</span><span className="text-white"> = np.linspace(</span><span className="text-amber-300">0</span><span className="text-white">, </span><span className="text-amber-300">10</span><span className="text-white">, </span><span className="text-amber-300">100</span><span className="text-white">)</span></p>
              <p><span className="text-emerald-400">y</span><span className="text-white"> = np.sin(x)</span></p>
              <p className="mt-1"><span className="text-violet-400">plt</span><span className="text-white">.plot(x, y, color=</span><span className="text-green-300">'blue'</span><span className="text-white">, label=</span><span className="text-green-300">'sin(x)'</span><span className="text-white">)</span></p>
              <p><span className="text-violet-400">plt</span><span className="text-white">.title(</span><span className="text-green-300">'Función Seno'</span><span className="text-white">)</span></p>
              <p><span className="text-violet-400">plt</span><span className="text-white">.xlabel(</span><span className="text-green-300">'x'</span><span className="text-white">) ; plt.ylabel(</span><span className="text-green-300">'sin(x)'</span><span className="text-white">)</span></p>
              <p><span className="text-violet-400">plt</span><span className="text-white">.legend() ; plt.show()</span></p>
            </CodeBlock>
          </div>
        </section>

        {/* ══ 6. BUENAS PRÁCTICAS ══════════════════════════════ */}
        <section id="buenas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="✅" title="Buenas Prácticas" color="#10b981" />
          <p className="text-gray-400 mb-6">
            Principios clave para comunicar información de forma efectiva al crear visualizaciones.
          </p>
          <div className="space-y-3 mb-6">
            {[
              { icon:"◐", text:"Usa formas, colores y tamaños adecuados al tipo de dato que representas.",           color:"#0ea5e9" },
              { icon:"◑", text:"Los gráficos con sistema de coordenadas son más pronunciados y claros para el lector.", color:"#a855f7" },
              { icon:"◒", text:"Elige el gráfico correcto según el tipo de variable: continua, discreta o bivariada.",  color:"#f59e0b" },
              { icon:"◓", text:"Siempre incluye etiquetas, títulos, leyendas y anotaciones para audiencias amplias.",   color:"#10b981" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <span style={{ color:p.color }} className="text-xl mt-0.5">{p.icon}</span>
                <p className="text-gray-400 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
          <Tip color="emerald">
            Antes de graficar pregúntate: <strong>¿qué quiero comunicar?</strong> Esa respuesta determina qué tipo de gráfico y qué librería usar.
          </Tip>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"Matplotlib",   desc:"Librería base 2D sobre NumPy. Control total y alta personalización.",              color:"#0ea5e9" },
              { label:"Seaborn",      desc:"Encima de Matplotlib. Mejor estética y funciones estadísticas integradas.",         color:"#10b981" },
              { label:"Univariado",   desc:"Una variable: histograma para continuas, barras para discretas.",                   color:"#a855f7" },
              { label:"Bivariado",    desc:"Dos variables: scatter (continua-continua), boxplot (continua-discreta).",           color:"#f59e0b" },
              { label:"Multivariado", desc:"Tres o más variables: scatter 3D, heatmap, colores y tamaños adicionales.",         color:"#f43f5e" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Python · Módulo III · Visualización</span>
        </div>

      </div>
    </div>
  );
}