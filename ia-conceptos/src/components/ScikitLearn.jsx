import { useState } from "react";

// ── Demo: ML Task Advisor ─────────────────────────────────────────
function TaskAdvisorDemo() {
  const [task, setTask]   = useState("clasificacion");
  const [data, setData]   = useState("etiquetada");

  const getRecommendation = () => {
    if (data === "no_etiquetada") {
      if (task === "agrupacion")    return { algo: "K-Means", module: "sklearn.cluster", syntax: "KMeans(n_clusters=3)", color: "amber",   desc: "Agrupa datos no etiquetados en K grupos por similitud." };
      return                               { algo: "PCA",    module: "sklearn.decomposition", syntax: "PCA(n_components=2)", color: "violet", desc: "Reduce la dimensionalidad preservando la mayor varianza." };
    }
    if (task === "clasificacion")   return { algo: "Random Forest", module: "sklearn.ensemble",      syntax: "RandomForestClassifier()",    color: "emerald", desc: "Clasifica usando un conjunto de árboles de decisión." };
    if (task === "regresion")       return { algo: "Regresión Lineal", module: "sklearn.linear_model", syntax: "LinearRegression()",        color: "sky",     desc: "Predice un valor continuo a partir de variables de entrada." };
    if (task === "clasificacion_svm") return { algo: "SVM", module: "sklearn.svm",               syntax: "SVC(kernel='rbf')",              color: "rose",    desc: "Encuentra el hiperplano óptimo que separa las clases." };
    return { algo: "Red Neuronal MLP", module: "sklearn.neural_network", syntax: "MLPClassifier()", color: "purple", desc: "Modelo inspirado en neuronas biológicas para tareas complejas." };
  };

  const r = getRecommendation();
  const colorMap = {
    sky:     { bg:"bg-sky-500/15",     border:"border-sky-500/40",     text:"text-sky-300",     badge:"bg-sky-500/20 text-sky-300" },
    violet:  { bg:"bg-violet-500/15",  border:"border-violet-500/40",  text:"text-violet-300",  badge:"bg-violet-500/20 text-violet-300" },
    emerald: { bg:"bg-emerald-500/15", border:"border-emerald-500/40", text:"text-emerald-300", badge:"bg-emerald-500/20 text-emerald-300" },
    amber:   { bg:"bg-amber-500/15",   border:"border-amber-500/40",   text:"text-amber-300",   badge:"bg-amber-500/20 text-amber-300" },
    rose:    { bg:"bg-rose-500/15",    border:"border-rose-500/40",    text:"text-rose-300",    badge:"bg-rose-500/20 text-rose-300" },
    purple:  { bg:"bg-purple-500/15",  border:"border-purple-500/40",  text:"text-purple-300",  badge:"bg-purple-500/20 text-purple-300" },
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
      <p className="text-violet-300 text-xs font-bold mb-5 uppercase tracking-widest">🎮 Demo interactiva — ¿Qué algoritmo usar?</p>

      <div className="space-y-4 mb-5">
        <div>
          <p className="text-gray-500 text-xs mb-2 font-mono">¿Tus datos tienen etiquetas?</p>
          <div className="flex gap-2">
            <Pill value="etiquetada"    current={data} onChange={setData} label="Sí — datos etiquetados (supervisado)" />
            <Pill value="no_etiquetada" current={data} onChange={setData} label="No — sin etiquetas (no supervisado)" />
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-xs mb-2 font-mono">¿Qué tipo de tarea quieres resolver?</p>
          <div className="flex flex-wrap gap-2">
            {data === "etiquetada" ? (
              <>
                <Pill value="clasificacion"     current={task} onChange={setTask} label="Clasificar categorías" />
                <Pill value="regresion"         current={task} onChange={setTask} label="Predecir un valor" />
                <Pill value="clasificacion_svm" current={task} onChange={setTask} label="Clasificar con SVM" />
                <Pill value="neural"            current={task} onChange={setTask} label="Red neuronal" />
              </>
            ) : (
              <>
                <Pill value="agrupacion"    current={task} onChange={setTask} label="Agrupar datos similares" />
                <Pill value="reduccion"     current={task} onChange={setTask} label="Reducir dimensionalidad" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`rounded-xl border ${c.border} ${c.bg} p-4 transition-all duration-300`}>
        <div className="flex items-start justify-between mb-2">
          <p className={`font-bold text-lg ${c.text}`}>{r.algo}</p>
          <span className={`text-xs px-2 py-1 rounded-full font-mono ${c.badge}`}>{r.module}</span>
        </div>
        <p className="text-gray-400 text-sm mb-3">{r.desc}</p>
        <code className="text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-2 block font-mono text-gray-300">
          from {r.module} import {r.syntax.split("(")[0]}<br />
          modelo = {r.syntax}
        </code>
      </div>
    </div>
  );
}

// ── Demo: Pipeline animado ────────────────────────────────────────
function PipelineDemo() {
  const steps = [
    { id: 0, label: "Cargar datos",       icon: "📂", color: "sky",     desc: "datasets.load_iris()" },
    { id: 1, label: "Preprocesar",        icon: "⚙️",  color: "violet",  desc: "train_test_split() · StandardScaler()" },
    { id: 2, label: "Entrenar modelo",    icon: "🧠",  color: "emerald", desc: "modelo.fit(X_train, y_train)" },
    { id: 3, label: "Predecir",           icon: "🔮",  color: "amber",   desc: "modelo.predict(X_test)" },
    { id: 4, label: "Evaluar",            icon: "📊",  color: "rose",    desc: "accuracy_score() · classification_report()" },
    { id: 5, label: "Guardar modelo",     icon: "💾",  color: "purple",  desc: "joblib.dump(modelo, 'modelo.pkl')" },
  ];

  const [current, setCurrent] = useState(-1);
  const [running,  setRunning]  = useState(false);

  const colorMap = {
    sky:     { border:"border-sky-500/40",     bg:"bg-sky-500/15",     text:"text-sky-300",     dot:"bg-sky-400"     },
    violet:  { border:"border-violet-500/40",  bg:"bg-violet-500/15",  text:"text-violet-300",  dot:"bg-violet-400"  },
    emerald: { border:"border-emerald-500/40", bg:"bg-emerald-500/15", text:"text-emerald-300", dot:"bg-emerald-400" },
    amber:   { border:"border-amber-500/40",   bg:"bg-amber-500/15",   text:"text-amber-300",   dot:"bg-amber-400"   },
    rose:    { border:"border-rose-500/40",    bg:"bg-rose-500/15",    text:"text-rose-300",    dot:"bg-rose-400"    },
    purple:  { border:"border-purple-500/40",  bg:"bg-purple-500/15",  text:"text-purple-300",  dot:"bg-purple-400"  },
  };

  const run = () => {
    setCurrent(-1);
    setRunning(true);
    let i = 0;
    const iv = setInterval(() => {
      setCurrent(i);
      i++;
      if (i >= steps.length) {
        clearInterval(iv);
        setTimeout(() => { setRunning(false); setCurrent(-1); }, 1200);
      }
    }, 700);
  };

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Pipeline de Machine Learning</p>

      <div className="space-y-2 mb-4">
        {steps.map((s) => {
          const c = colorMap[s.color];
          const isActive = current === s.id;
          const isDone   = current > s.id;
          return (
            <div key={s.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                isActive ? `${c.border} ${c.bg} scale-[1.01]` :
                isDone   ? "border-white/10 bg-white/[0.04] opacity-60" :
                           "border-white/5 bg-transparent"}`}>
              <span className="text-lg w-6 text-center">{s.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isActive ? c.text : isDone ? "text-gray-400" : "text-gray-500"}`}>
                  {s.label}
                </p>
                {isActive && (
                  <code className="text-xs text-gray-400 font-mono animate-pulse">{s.desc}</code>
                )}
              </div>
              {isDone && <span className="text-emerald-400 text-xs font-mono">✓</span>}
              {isActive && <div className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />}
            </div>
          );
        })}
      </div>

      {current >= 0 && current < steps.length && (
        <div className="bg-black/40 rounded-lg px-4 py-2 mb-3 font-mono text-sm text-emerald-300 animate-pulse">
          → Ejecutando: <span className="text-amber-300">{steps[current].label}</span>
        </div>
      )}

      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
          running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                  : "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando pipeline..." : "▶ Ejecutar pipeline"}
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

function CodeBlock({ children }) {
  return (
    <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-4"
      style={{ fontFamily:"monospace", fontSize:"0.875rem", lineHeight:2 }}>
      {children}
    </div>
  );
}

function FeatureList({ items, color }) {
  const dot = { sky:"bg-sky-400", violet:"bg-violet-400", emerald:"bg-emerald-400", amber:"bg-amber-400", rose:"bg-rose-400" }[color] || "bg-gray-400";
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
export default function ScikitLearn({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-emerald-900/15 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-violet-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-sky-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-emerald-400" style={{ fontFamily:"monospace" }}>Scikit-Learn</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#10b981", color:"#10b981", fontFamily:"monospace" }}>
            🤖 Módulo III · Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Scikit{" "}
            <span style={{
              background:"linear-gradient(135deg, #10b981, #0ea5e9, #a855f7)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Learn</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            La librería más completa para Machine Learning en Python. Construida sobre
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">NumPy</code>
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">SciPy</code> y
            <code className="text-orange-400 bg-orange-500/10 px-1 rounded mx-1">Matplotlib</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#que-es",         label:"🤖 ¿Qué es?" },
            { href:"#instalacion",    label:"📦 Instalación" },
            { href:"#caracteristicas",label:"⚡ Características" },
            { href:"#pipeline",       label:"🔄 Pipeline de modelado" },
            { href:"#procesos",       label:"🛠️ Procesos de modelado" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ 1. QUÉ ES ════════════════════════════════════════ */}
        <section id="que-es" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="🤖" title="¿Qué es Scikit-Learn?" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Scikit-learn (<code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">sklearn</code>) es una de las librerías más <strong className="text-white">completas y robustas</strong> para Machine Learning con Python. Ofrece herramientas eficientes para modelado estadístico y aprendizaje automático, todo bajo una API consistente y bien documentada.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon:"🏷️", label:"Clasificación",             color:"#10b981" },
              { icon:"📈", label:"Regresión",                  color:"#0ea5e9" },
              { icon:"🔵", label:"Clusterización",             color:"#a855f7" },
              { icon:"📉", label:"Reducción dimensional",      color:"#f59e0b" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col items-center gap-2 text-center">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-xs font-semibold" style={{ color:item.color }}>{item.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-4">
            <p className="text-emerald-300 text-xs font-bold mb-3 uppercase tracking-widest">🧩 Construida sobre</p>
            <div className="flex flex-wrap gap-3">
              {[
                { lib:"NumPy",      role:"Operaciones matriciales y vectoriales",     color:"#0ea5e9" },
                { lib:"SciPy",      role:"Algoritmos científicos y matemáticos",       color:"#a855f7" },
                { lib:"Matplotlib", role:"Visualización de resultados y gráficos",    color:"#f59e0b" },
              ].map((dep) => (
                <div key={dep.lib} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                  <p className="text-sm font-bold" style={{ color:dep.color }}>{dep.lib}</p>
                  <p className="text-xs text-gray-500">{dep.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 2. INSTALACIÓN ═══════════════════════════════════ */}
        <section id="instalacion" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="📦" title="Instalación" color="#0ea5e9" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            La instalación es sencilla y puede hacerse a través de los gestores de paquetes más comunes de Python.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-sky-300 text-xs font-bold mb-3 font-mono">Con pip</p>
              <CodeBlock>
                <p><span className="text-emerald-400">$</span><span className="text-white"> pip install </span><span className="text-amber-300">-U</span><span className="text-sky-400"> scikit-learn</span></p>
              </CodeBlock>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-violet-300 text-xs font-bold mb-3 font-mono">Con conda</p>
              <CodeBlock>
                <p><span className="text-emerald-400">$</span><span className="text-white"> conda install </span><span className="text-amber-300">-U</span><span className="text-violet-400"> scikit-learn</span></p>
              </CodeBlock>
            </div>
          </div>

          <CodeBlock>
            <p className="text-gray-500"># Verificar instalación e importar</p>
            <p><span className="text-sky-400">import</span><span className="text-white"> sklearn</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(sklearn.__version__)</span></p>
            <p className="mt-1 text-gray-500"># → '1.4.0' (o la versión instalada)</p>
          </CodeBlock>

          <Tip color="sky">
            El flag <code>-U</code> actualiza la librería a la última versión disponible si ya estaba instalada.
          </Tip>
        </section>

        {/* ══ 3. CARACTERÍSTICAS ═══════════════════════════════ */}
        <section id="caracteristicas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="⚡" title="Características" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Scikit-learn está enfocado al <strong className="text-white">modelado de datos</strong>. Agrupa sus algoritmos en categorías según el tipo de aprendizaje y la tarea a resolver.
          </p>

          <div className="space-y-4 mb-6">
            {/* Supervisado */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">Aprendizaje Supervisado</span>
              </div>
              <p className="text-gray-500 text-xs mb-3">Datos con etiquetas conocidas. El modelo aprende a predecir la salida correcta.</p>
              <div className="flex flex-wrap gap-2">
                {["Regresión Lineal","Regresión Logística","SVM","Árboles de Decisión","Redes Neuronales","Random Forest"].map(a => (
                  <span key={a} className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg font-mono">{a}</span>
                ))}
              </div>
            </div>

            {/* No supervisado */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono font-bold">Aprendizaje No Supervisado</span>
              </div>
              <p className="text-gray-500 text-xs mb-3">Sin etiquetas. El modelo descubre estructura oculta en los datos.</p>
              <div className="flex flex-wrap gap-2">
                {["PCA","K-Means","DBSCAN","Análisis de Componentes Principales"].map(a => (
                  <span key={a} className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-1 rounded-lg font-mono">{a}</span>
                ))}
              </div>
            </div>

            {/* Otras */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label:"Clustering",                color:"amber",  icon:"🔵", desc:"Agrupa datos no etiquetados por similitud entre instancias." },
                { label:"Validación Cruzada",        color:"sky",    icon:"✅", desc:"Mide la tasa de acierto real de modelos supervisados." },
                { label:"Ensamblaje de métodos",     color:"rose",   icon:"🧩", desc:"Combina predicciones de múltiples modelos para mayor precisión." },
              ].map((item) => {
                const c = {
                  amber: { border:"border-amber-500/20", bg:"bg-amber-500/5", text:"text-amber-300" },
                  sky:   { border:"border-sky-500/20",   bg:"bg-sky-500/5",   text:"text-sky-300" },
                  rose:  { border:"border-rose-500/20",  bg:"bg-rose-500/5",  text:"text-rose-300" },
                }[item.color];
                return (
                  <div key={item.label} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                    <span className="text-xl mb-2 block">{item.icon}</span>
                    <p className={`text-sm font-semibold mb-1 ${c.text}`}>{item.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <TaskAdvisorDemo />
        </section>

        {/* ══ 4. PIPELINE ══════════════════════════════════════ */}
        <section id="pipeline" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="🔄" title="Pipeline de Machine Learning" color="#0ea5e9" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Todo proyecto de Machine Learning sigue un flujo de pasos bien definido. Scikit-learn proporciona herramientas para cada etapa del pipeline.
          </p>

          <PipelineDemo />

          <div className="mt-5">
            <h3 className="text-white font-semibold mb-4">Ejemplo completo con Iris dataset</h3>
            <CodeBlock>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn </span><span className="text-sky-400">import</span><span className="text-white"> datasets</span></p>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.model_selection </span><span className="text-sky-400">import</span><span className="text-white"> train_test_split</span></p>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.ensemble </span><span className="text-sky-400">import</span><span className="text-white"> RandomForestClassifier</span></p>
              <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.metrics </span><span className="text-sky-400">import</span><span className="text-white"> accuracy_score</span></p>
              <p className="mt-1 text-gray-500"># 1. Cargar dataset</p>
              <p><span className="text-emerald-400">iris</span><span className="text-white"> = datasets.load_iris()</span></p>
              <p><span className="text-emerald-400">X</span><span className="text-white">, </span><span className="text-emerald-400">y</span><span className="text-white"> = iris.data, iris.target</span></p>
              <p className="mt-1 text-gray-500"># 2. Dividir datos</p>
              <p><span className="text-emerald-400">X_train</span><span className="text-white">, </span><span className="text-emerald-400">X_test</span><span className="text-white">, </span><span className="text-emerald-400">y_train</span><span className="text-white">, </span><span className="text-emerald-400">y_test</span><span className="text-white"> = train_test_split(X, y, test_size=</span><span className="text-amber-300">0.2</span><span className="text-white">)</span></p>
              <p className="mt-1 text-gray-500"># 3. Entrenar y predecir</p>
              <p><span className="text-emerald-400">modelo</span><span className="text-white"> = RandomForestClassifier()</span></p>
              <p><span className="text-emerald-400">modelo</span><span className="text-white">.fit(X_train, y_train)</span></p>
              <p><span className="text-emerald-400">y_pred</span><span className="text-white"> = modelo.predict(X_test)</span></p>
              <p className="mt-1 text-gray-500"># 4. Evaluar</p>
              <p><span className="text-violet-400">print</span><span className="text-white">(accuracy_score(y_test, y_pred))</span><span className="text-gray-500 ml-2"># → 0.97</span></p>
            </CodeBlock>
          </div>
        </section>

        {/* ══ 5. PROCESOS DE MODELADO ══════════════════════════ */}
        <section id="procesos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="🛠️" title="Procesos de Modelado" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Scikit-learn provee herramientas especializadas para cada fase del ciclo de vida de un modelo de Machine Learning.
          </p>

          <div className="space-y-4">
            {[
              {
                step:"01", title:"Dataset de pruebas",
                color:"sky", icon:"📂",
                desc:"Scikit-Learn incluye datasets listos para usar: Iris, Digits, Boston Housing, etc. Permiten practicar regresión y clasificación sin necesidad de datos externos.",
                code:<>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn </span><span className="text-sky-400">import</span><span className="text-white"> datasets</span></p>
                  <p><span className="text-emerald-400">iris</span><span className="text-white"> = datasets.load_iris()</span></p>
                  <p><span className="text-emerald-400">digits</span><span className="text-white"> = datasets.load_digits()</span></p>
                </>,
              },
              {
                step:"02", title:"Preprocesamiento",
                color:"violet", icon:"⚙️",
                desc:"Fase crítica antes de entrenar cualquier modelo. Incluye separación train/test, normalización, estandarización, binarización y etiquetado de datos.",
                code:<>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.model_selection </span><span className="text-sky-400">import</span><span className="text-white"> train_test_split</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.preprocessing </span><span className="text-sky-400">import</span><span className="text-white"> StandardScaler</span></p>
                  <p className="mt-1"><span className="text-emerald-400">X_train</span><span className="text-white">, </span><span className="text-emerald-400">X_test</span><span className="text-white">, </span><span className="text-emerald-400">y_train</span><span className="text-white">, </span><span className="text-emerald-400">y_test</span><span className="text-white"> = train_test_split(X, y)</span></p>
                  <p><span className="text-emerald-400">scaler</span><span className="text-white"> = StandardScaler().fit(X_train)</span></p>
                </>,
              },
              {
                step:"03", title:"Representación",
                color:"emerald", icon:"🗂️",
                desc:"Herramientas para convertir el conjunto de datos a tablas o matrices que los algoritmos puedan procesar directamente.",
                code:<>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.feature_extraction.text </span><span className="text-sky-400">import</span><span className="text-white"> TfidfVectorizer</span></p>
                  <p><span className="text-emerald-400">vectorizer</span><span className="text-white"> = TfidfVectorizer()</span></p>
                  <p><span className="text-emerald-400">X_matrix</span><span className="text-white"> = vectorizer.fit_transform(corpus)</span></p>
                </>,
              },
              {
                step:"04", title:"Predicción y validación",
                color:"amber", icon:"🔮",
                desc:"Validación cruzada, comparación de modelos, ajuste de hiperparámetros (GridSearchCV) y generación de reportes de clasificación.",
                code:<>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.model_selection </span><span className="text-sky-400">import</span><span className="text-white"> cross_val_score</span></p>
                  <p><span className="text-sky-400">from</span><span className="text-white"> sklearn.metrics </span><span className="text-sky-400">import</span><span className="text-white"> classification_report</span></p>
                  <p className="mt-1"><span className="text-emerald-400">scores</span><span className="text-white"> = cross_val_score(modelo, X, y, cv=</span><span className="text-amber-300">5</span><span className="text-white">)</span></p>
                  <p><span className="text-violet-400">print</span><span className="text-white">(classification_report(y_test, y_pred))</span></p>
                </>,
              },
              {
                step:"05", title:"Persistencia del modelo",
                color:"rose", icon:"💾",
                desc:"Guarda los modelos entrenados para reutilizarlos en producción o en futuros proyectos sin necesidad de reentrenar.",
                code:<>
                  <p><span className="text-sky-400">import</span><span className="text-white"> joblib</span></p>
                  <p className="mt-1 text-gray-500"># Guardar</p>
                  <p><span className="text-white">joblib.dump(modelo, </span><span className="text-green-300">'modelo_entrenado.pkl'</span><span className="text-white">)</span></p>
                  <p className="mt-1 text-gray-500"># Cargar</p>
                  <p><span className="text-emerald-400">modelo</span><span className="text-white"> = joblib.load(</span><span className="text-green-300">'modelo_entrenado.pkl'</span><span className="text-white">)</span></p>
                </>,
              },
            ].map((item) => {
              const c = {
                sky:     { border:"border-sky-500/20",     bg:"bg-sky-500/5",     text:"text-sky-300",     step:"text-sky-500/40" },
                violet:  { border:"border-violet-500/20",  bg:"bg-violet-500/5",  text:"text-violet-300",  step:"text-violet-500/40" },
                emerald: { border:"border-emerald-500/20", bg:"bg-emerald-500/5", text:"text-emerald-300", step:"text-emerald-500/40" },
                amber:   { border:"border-amber-500/20",   bg:"bg-amber-500/5",   text:"text-amber-300",   step:"text-amber-500/40" },
                rose:    { border:"border-rose-500/20",    bg:"bg-rose-500/5",    text:"text-rose-300",    step:"text-rose-500/40" },
              }[item.color];
              return (
                <div key={item.step} className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
                  <div className="flex items-start gap-4">
                    <span className={`text-4xl font-black ${c.step} leading-none`} style={{ fontFamily:"monospace" }}>{item.step}</span>
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

          <div className="mt-5">
            <Tip color="emerald">
              El sitio oficial <strong>scikit-learn.org</strong> es obligatorio para cualquier practicante de ML: contiene ejemplos completos, guías de usuario y documentación exhaustiva de cada módulo.
            </Tip>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"Sklearn",          desc:"Librería ML sobre NumPy + SciPy + Matplotlib. API consistente para todos los modelos.",      color:"#10b981" },
              { label:"Supervisado",      desc:"Datos etiquetados: clasificación (Random Forest, SVM) y regresión (Lineal, Logística).",      color:"#0ea5e9" },
              { label:"No supervisado",   desc:"Sin etiquetas: clustering (K-Means) y reducción dimensional (PCA).",                          color:"#a855f7" },
              { label:"Preprocesamiento", desc:"train_test_split, StandardScaler, encoders — imprescindible antes de entrenar.",               color:"#f59e0b" },
              { label:"Validación",       desc:"cross_val_score, GridSearchCV y classification_report para evaluar y optimizar modelos.",      color:"#f43f5e" },
              { label:"Persistencia",     desc:"joblib.dump / joblib.load para guardar y reutilizar modelos entrenados.",                     color:"#6366f1" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Python · Módulo III · Scikit-Learn</span>
        </div>

      </div>
    </div>
  );
}