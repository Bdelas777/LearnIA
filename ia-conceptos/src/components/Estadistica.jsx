import { useState } from "react";

// ── Demo: Estructuras de datos matemáticas ────────────────────────
function EstructurasDemo() {
  const [selected, setSelected] = useState("escalar");

  const structs = {
    escalar: {
      label: "Escalar", color: "sky", icon: "①",
      desc: "Un único número. La unidad básica de cualquier estructura algebraica.",
      visual: (
        <div className="flex items-center justify-center h-20">
          <div className="w-14 h-14 rounded-xl border-2 border-sky-400/60 bg-sky-500/15 flex items-center justify-center">
            <span className="text-sky-300 font-bold text-2xl font-mono">5</span>
          </div>
        </div>
      ),
      code: "x = 5           # escalar real\nx = 3.14         # también escalar",
    },
    vector: {
      label: "Vector", color: "violet", icon: "→",
      desc: "Arreglo ordenado de n números. Estructura unidimensional.",
      visual: (
        <div className="flex items-center justify-center gap-1 h-20">
          {[2, 7, 1, 4].map((v, i) => (
            <div key={i} className="w-12 h-12 rounded-lg border border-violet-400/50 bg-violet-500/15 flex items-center justify-center flex-col">
              <span className="text-violet-300 font-bold font-mono">{v}</span>
              <span className="text-violet-500 text-[9px] font-mono">x{i+1}</span>
            </div>
          ))}
        </div>
      ),
      code: "import numpy as np\nx = np.array([2, 7, 1, 4])   # vector 1D\nprint(x.shape)               # (4,)",
    },
    matriz: {
      label: "Matriz", color: "emerald", icon: "▦",
      desc: "Arreglo rectangular de números. Estructura bidimensional m×n.",
      visual: (
        <div className="flex items-center justify-center h-20">
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[[1,2,3],[4,5,6],[7,8,9]].flat().map((v, i) => (
              <div key={i} className="w-9 h-9 rounded border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-center">
                <span className="text-emerald-300 font-mono text-xs font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      code: "M = np.array([[1,2,3],\n              [4,5,6],\n              [7,8,9]])   # matriz 3×3\nM.T                        # traspuesta",
    },
    tensor: {
      label: "Tensor", color: "amber", icon: "⬡",
      desc: "Arreglo de n ejes. Generalización de escalar, vector y matriz.",
      visual: (
        <div className="flex items-center justify-center gap-3 h-20">
          {[0,1].map((k) => (
            <div key={k} className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {[[1,2],[3,4]].flat().map((v, i) => (
                <div key={i} className="w-8 h-8 rounded border border-amber-400/40 bg-amber-500/10 flex items-center justify-center"
                  style={{ opacity: k === 0 ? 1 : 0.5 }}>
                  <span className="text-amber-300 font-mono text-xs">{v + k*4}</span>
                </div>
              ))}
            </div>
          ))}
          <span className="text-amber-500/60 text-xs font-mono">…</span>
        </div>
      ),
      code: "T = np.zeros((3, 4, 5))   # tensor 3D\n# 3 ejes: T[x, y, z]\nprint(T.shape)             # (3, 4, 5)",
    },
  };

  const colorMap = {
    sky:     { border:"border-sky-500/40",     bg:"bg-sky-500/15",     text:"text-sky-300",     tab:"border-sky-400/60 bg-sky-500/20 text-sky-300" },
    violet:  { border:"border-violet-500/40",  bg:"bg-violet-500/15",  text:"text-violet-300",  tab:"border-violet-400/60 bg-violet-500/20 text-violet-300" },
    emerald: { border:"border-emerald-500/40", bg:"bg-emerald-500/15", text:"text-emerald-300", tab:"border-emerald-400/60 bg-emerald-500/20 text-emerald-300" },
    amber:   { border:"border-amber-500/40",   bg:"bg-amber-500/15",   text:"text-amber-300",   tab:"border-amber-400/60 bg-amber-500/20 text-amber-300" },
  };

  const s = structs[selected];
  const c = colorMap[s.color];

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Estructuras algebraicas</p>
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(structs).map(([k, v]) => {
          const cc = colorMap[v.color];
          return (
            <button key={k} onClick={() => setSelected(k)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                selected === k ? cc.tab : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              {v.icon} {v.label}
            </button>
          );
        })}
      </div>

      <div className={`rounded-xl border ${c.border} ${c.bg} p-4 transition-all duration-300`}>
        <p className={`font-bold text-base mb-1 ${c.text}`}>{s.label}</p>
        <p className="text-gray-400 text-sm mb-4">{s.desc}</p>
        {s.visual}
        <code className="mt-4 text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-2 block font-mono text-gray-300 whitespace-pre">
          {s.code}
        </code>
      </div>
    </div>
  );
}

// ── Demo: Calculadora de normas ───────────────────────────────────
function NormaDemo() {
  const [vals, setVals] = useState([3, 4]);
  const [p, setP] = useState(2);

  const update = (i, v) => {
    const next = [...vals];
    next[i] = Number(v);
    setVals(next);
  };

  const l1   = vals.reduce((s, x) => s + Math.abs(x), 0);
  const l2   = Math.sqrt(vals.reduce((s, x) => s + x * x, 0));
  const lp   = Math.pow(vals.reduce((s, x) => s + Math.pow(Math.abs(x), p), 0), 1 / p);
  const linf = Math.max(...vals.map(Math.abs));

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo interactiva — Calculadora de normas</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {vals.map((v, i) => (
          <div key={i}>
            <p className="text-gray-500 text-xs mb-1 font-mono">x<sub>{i+1}</sub> = {v}</p>
            <input type="range" min={-10} max={10} value={v} onChange={e => update(i, e.target.value)}
              className="w-full accent-violet-500" />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-gray-500 text-xs mb-1 font-mono">p = {p} (para norma Lp)</p>
        <input type="range" min={1} max={6} step={1} value={p} onChange={e => setP(Number(e.target.value))}
          className="w-full accent-violet-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label:"L¹ (Manhattan)", val:l1.toFixed(3),  color:"sky",     formula:"Σ|xᵢ|" },
          { label:"L² (Euclídea)",  val:l2.toFixed(3),  color:"emerald", formula:"√Σxᵢ²" },
          { label:`Lᵖ (p=${p})`,    val:lp.toFixed(3),  color:"violet",  formula:"(Σ|xᵢ|ᵖ)^(1/p)" },
          { label:"L∞ (Chebyshev)",  val:linf.toFixed(3),color:"amber",   formula:"max|xᵢ|" },
        ].map((n) => {
          const c = {
            sky:     { border:"border-sky-500/30",     bg:"bg-sky-500/10",     text:"text-sky-300",     muted:"text-sky-500/60" },
            emerald: { border:"border-emerald-500/30", bg:"bg-emerald-500/10", text:"text-emerald-300", muted:"text-emerald-500/60" },
            violet:  { border:"border-violet-500/30",  bg:"bg-violet-500/10",  text:"text-violet-300",  muted:"text-violet-500/60" },
            amber:   { border:"border-amber-500/30",   bg:"bg-amber-500/10",   text:"text-amber-300",   muted:"text-amber-500/60" },
          }[n.color];
          return (
            <div key={n.label} className={`rounded-xl border ${c.border} ${c.bg} p-3`}>
              <p className="text-gray-500 text-xs mb-0.5">{n.label}</p>
              <p className={`font-bold text-xl font-mono ${c.text}`}>{n.val}</p>
              <p className={`text-xs font-mono ${c.muted}`}>{n.formula}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Demo: Teorema de Bayes ────────────────────────────────────────
function BayesDemo() {
  const [pA,  setPa]  = useState(30);
  const [pBA, setPba] = useState(80);
  const [pBnA, setPbna] = useState(20);

  const pAn   = 100 - pA;
  const pB    = (pBA * pA + pBnA * pAn) / 100;
  const pAB   = pBA > 0 || pBnA > 0 ? ((pBA * pA) / pB).toFixed(1) : "—";

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Teorema de Bayes</p>
      <p className="text-gray-500 text-xs mb-4 font-mono">Escenario: diagnóstico médico. A = tiene enfermedad, B = test positivo</p>

      <div className="space-y-3 mb-5">
        {[
          { label:"P(A) — Prevalencia de la enfermedad", val:pA,   set:setPa,  color:"sky" },
          { label:"P(B|A) — Test positivo si tiene la enfermedad", val:pBA, set:setPba, color:"emerald" },
          { label:"P(B|¬A) — Falso positivo (sin enfermedad)", val:pBnA,set:setPbna,color:"amber" },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 font-mono">{row.label}</span>
              <span className={`font-bold font-mono ${ {sky:"text-sky-300",emerald:"text-emerald-300",amber:"text-amber-300"}[row.color]}`}>{row.val}%</span>
            </div>
            <input type="range" min={1} max={99} value={row.val} onChange={e => row.set(Number(e.target.value))}
              className={`w-full ${ {sky:"accent-sky-500",emerald:"accent-emerald-500",amber:"accent-amber-500"}[row.color]}`} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs mb-1 font-mono">P(A|B) — Probabilidad real de enfermedad dado test positivo</p>
            <div className="font-mono text-xs text-gray-500">= P(B|A)·P(A) / P(B) = ({pBA}·{pA}) / {pB.toFixed(1)}</div>
          </div>
          <p className="text-4xl font-black text-emerald-300 font-mono ml-4">{pAB}%</p>
        </div>
      </div>

      <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-400">
        <p><span className="text-emerald-400">P(A|B)</span> = <span className="text-sky-300">P(B|A)</span> × <span className="text-violet-300">P(A)</span> / <span className="text-amber-300">P(B)</span></p>
        <p className="mt-1 text-gray-600">P(B) = P(B|A)·P(A) + P(B|¬A)·P(¬A)</p>
      </div>
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

function Formula({ children, color = "amber" }) {
  const c = {
    amber:   "border-amber-500/30 bg-amber-500/5 text-amber-200",
    sky:     "border-sky-500/30 bg-sky-500/5 text-sky-200",
    violet:  "border-violet-500/30 bg-violet-500/5 text-violet-200",
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-200",
    rose:    "border-rose-500/30 bg-rose-500/5 text-rose-200",
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

function ConceptCard({ step, icon, title, color, children }) {
  const c = {
    sky:     { border:"border-sky-500/20",     bg:"bg-sky-500/5",     text:"text-sky-300",     step:"text-sky-500/30" },
    violet:  { border:"border-violet-500/20",  bg:"bg-violet-500/5",  text:"text-violet-300",  step:"text-violet-500/30" },
    emerald: { border:"border-emerald-500/20", bg:"bg-emerald-500/5", text:"text-emerald-300", step:"text-emerald-500/30" },
    amber:   { border:"border-amber-500/20",   bg:"bg-amber-500/5",   text:"text-amber-300",   step:"text-amber-500/30" },
    rose:    { border:"border-rose-500/20",    bg:"bg-rose-500/5",    text:"text-rose-300",    step:"text-rose-500/30" },
    purple:  { border:"border-purple-500/20",  bg:"bg-purple-500/5",  text:"text-purple-300",  step:"text-purple-500/30" },
  }[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-start gap-4">
        <span className={`text-4xl font-black leading-none ${c.step}`} style={{ fontFamily:"monospace" }}>{step}</span>
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
export default function MatematicasEstadistica({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily:"'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        code { font-family: 'IBM Plex Mono', monospace; }
        sub, sup { font-size: 0.7em; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-amber-900/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-violet-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[280px] h-[280px] bg-emerald-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily:"monospace" }}>Módulo III</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-amber-400" style={{ fontFamily:"monospace" }}>Matemáticas y Estadística</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor:"#f59e0b", color:"#f59e0b", fontFamily:"monospace" }}>
            🧮 Módulo III · Fundamentos Matemáticos
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Matemáticas y{" "}
            <span style={{
              background:"linear-gradient(135deg, #f59e0b, #a855f7, #10b981)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>Estadística</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Los fundamentos de
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">Álgebra Lineal</code> y
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">Probabilidad</code>
            que sustentan todos los modelos de Machine Learning.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href:"#intro",       label:"📌 Introducción" },
            { href:"#algebra",     label:"🔢 Álgebra Lineal" },
            { href:"#norma",       label:"📐 Norma" },
            { href:"#svd",         label:"⚙️ SVD" },
            { href:"#estadistica", label:"📊 Estadística" },
            { href:"#prob",        label:"🎲 Probabilidad" },
            { href:"#bayes",       label:"🔮 Bayes" },
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
            Las matemáticas — definidas por Aristóteles como <strong className="text-white">"la ciencia de la cantidad"</strong> — abarcan álgebra, trigonometría, cálculo, geometría y teoría de números. Para Machine Learning, dos subcampos son esenciales:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="text-amber-300 font-bold mb-2">Álgebra Lineal</p>
              <p className="text-gray-500 text-sm leading-relaxed">Trata con vectores, matrices, planos, hiperplanos y espacios vectoriales. Base de todos los algoritmos de ML.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Vectores","Matrices","Tensores","Normas","SVD"].map(t => (
                  <span key={t} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg font-mono">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <p className="text-violet-300 font-bold mb-2">Teoría de Probabilidad</p>
              <p className="text-gray-500 text-sm leading-relaxed">Estudia y cuantifica sucesos de azar e incertidumbre. Permite razonar sobre el comportamiento de los modelos.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Distribuciones","Variables aleatorias","Bayes","Probabilidad condicional"].map(t => (
                  <span key={t} className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-lg font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <Tip color="amber">
            El enfoque es siempre el <strong>Machine Learning práctico</strong>. Las matemáticas aplicadas son un aspecto importante, pero no el objetivo final.
          </Tip>
        </section>

        {/* ══ 2. ÁLGEBRA LINEAL ════════════════════════════════ */}
        <section id="algebra" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🔢" title="Conceptos Matemáticos" color="#f59e0b" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Las estructuras algebraicas son la base de toda operación en Machine Learning. Los datos siempre se representan como alguna de estas estructuras.
          </p>

          <EstructurasDemo />

          <div className="mt-6 space-y-4">
            {/* Escalar */}
            <ConceptCard step="01" icon="①" title="Escalar" color="sky">
              <p className="text-gray-500 text-sm mb-3">Un único número real. La unidad fundamental.</p>
              <Formula color="sky">x = 5   →   x ∈ ℝ</Formula>
            </ConceptCard>

            {/* Vector */}
            <ConceptCard step="02" icon="→" title="Vector" color="violet">
              <p className="text-gray-500 text-sm mb-3">Arreglo ordenado de n números. Estructura unidimensional que representa un punto en el espacio n-dimensional.</p>
              <Formula color="violet">x⃗ = (x₁, x₂, …, xₙ)</Formula>
              <CodeBlock>
                <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-emerald-400"> np</span></p>
                <p><span className="text-emerald-400">x</span><span className="text-white"> = np.array([</span><span className="text-amber-300">2</span><span className="text-white">, </span><span className="text-amber-300">7</span><span className="text-white">, </span><span className="text-amber-300">1</span><span className="text-white">, </span><span className="text-amber-300">4</span><span className="text-white">])</span><span className="text-gray-500 ml-2"># vector de 4 elementos</span></p>
              </CodeBlock>
            </ConceptCard>

            {/* Matriz */}
            <ConceptCard step="03" icon="▦" title="Matriz" color="emerald">
              <p className="text-gray-500 text-sm mb-3">Arreglo rectangular m×n. Cada elemento se referencia con índices de fila y columna m<sub>rc</sub>.</p>
              <Formula color="emerald">
                M = | m₁₁  m₁₂  m₁₃ |{"\n"}
                {"    "}| m₂₁  m₂₂  m₂₃ |{"\n"}
                {"    "}| m₃₁  m₃₂  m₃₃ |
              </Formula>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-3">
                <p className="text-emerald-300 text-xs font-bold mb-2">Matriz traspuesta M<sup>t</sup></p>
                <p className="text-gray-500 text-xs leading-relaxed mb-2">Para obtener la traspuesta se intercambian filas y columnas. Si M es m×n, M<sup>t</sup> es n×m.</p>
                <div className="flex items-center gap-4 font-mono text-xs text-gray-300">
                  <div>
                    <p className="text-emerald-400 mb-1">M (2×3)</p>
                    <p>| 1  2  3 |</p>
                    <p>| 4  5  6 |</p>
                  </div>
                  <span className="text-gray-600 text-lg">→</span>
                  <div>
                    <p className="text-sky-400 mb-1">M<sup>t</sup> (3×2)</p>
                    <p>| 1  4 |</p>
                    <p>| 2  5 |</p>
                    <p>| 3  6 |</p>
                  </div>
                </div>
              </div>
              <CodeBlock>
                <p><span className="text-emerald-400">M</span><span className="text-white"> = np.array([[</span><span className="text-amber-300">1</span><span className="text-white">,</span><span className="text-amber-300">2</span><span className="text-white">,</span><span className="text-amber-300">3</span><span className="text-white">],[</span><span className="text-amber-300">4</span><span className="text-white">,</span><span className="text-amber-300">5</span><span className="text-white">,</span><span className="text-amber-300">6</span><span className="text-white">]])</span></p>
                <p><span className="text-emerald-400">Mt</span><span className="text-white"> = M.T</span><span className="text-gray-500 ml-2"># traspuesta → shape (3,2)</span></p>
              </CodeBlock>
            </ConceptCard>

            {/* Tensor */}
            <ConceptCard step="04" icon="⬡" title="Tensor" color="amber">
              <p className="text-gray-500 text-sm mb-3">Arreglo genérico con número variable de ejes. Generalización de escalar (0D), vector (1D) y matriz (2D).</p>
              <Formula color="amber">T[x, y, z]   →   tensor 3D con 3 ejes</Formula>
              <CodeBlock>
                <p><span className="text-emerald-400">T</span><span className="text-white"> = np.zeros((</span><span className="text-amber-300">3</span><span className="text-white">, </span><span className="text-amber-300">4</span><span className="text-white">, </span><span className="text-amber-300">5</span><span className="text-white">))</span><span className="text-gray-500 ml-2"># tensor 3D</span></p>
                <p><span className="text-gray-500"># Imagen RGB: tensor (alto, ancho, 3)</span></p>
                <p><span className="text-emerald-400">img</span><span className="text-white"> = np.zeros((</span><span className="text-amber-300">224</span><span className="text-white">, </span><span className="text-amber-300">224</span><span className="text-white">, </span><span className="text-amber-300">3</span><span className="text-white">))</span></p>
              </CodeBlock>
            </ConceptCard>
          </div>
        </section>

        {/* ══ 3. NORMA ═════════════════════════════════════════ */}
        <section id="norma" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="📐" title="Norma de un Vector" color="#0ea5e9" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            La norma mide el <strong className="text-white">tamaño o longitud</strong> de un vector: la distancia desde el origen hasta el punto que denota el vector.
          </p>
          <Formula color="sky">Lᵖ = ‖x‖ₚ = ( Σᵢ |xᵢ|ᵖ )^(1/p)     para p ≥ 1, p ∈ ℝ</Formula>
          <NormaDemo />
          <div className="mt-5">
            <Tip color="sky">
              La norma <strong>L²</strong> (Euclídea) es la más usada en ML. La norma <strong>L¹</strong> es preferida cuando queremos resultados dispersos (sparse) en regularización.
            </Tip>
          </div>
        </section>

        {/* ══ 4. SVD ═══════════════════════════════════════════ */}
        <section id="svd" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="⚙️" title="Descomposición en Valores Singulares (SVD)" color="#a855f7" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Proceso de <strong className="text-white">descomposición matricial</strong> que factoriza una matriz en vectores y valores propios. Base de algoritmos como PCA.
          </p>
          <Formula color="violet">M = V · diag(λ) · V⁻¹</Formula>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { label:"V",  desc:"Matriz de vectores propios (uno por columna)",    color:"violet", badge:"Eigenvectors" },
              { label:"λ",  desc:"Vector de valores propios correspondientes",       color:"sky",    badge:"Eigenvalues" },
              { label:"V⁻¹",desc:"Inversa de la matriz de vectores propios",        color:"emerald",badge:"Inverse" },
            ].map((item) => {
              const c = {
                violet:  { border:"border-violet-500/20", bg:"bg-violet-500/5",  text:"text-violet-300",  badge:"bg-violet-500/20 text-violet-300" },
                sky:     { border:"border-sky-500/20",    bg:"bg-sky-500/5",     text:"text-sky-300",     badge:"bg-sky-500/20 text-sky-300" },
                emerald: { border:"border-emerald-500/20",bg:"bg-emerald-500/5", text:"text-emerald-300", badge:"bg-emerald-500/20 text-emerald-300" },
              }[item.color];
              return (
                <div key={item.label} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-black font-mono ${c.text}`}>{item.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${c.badge}`}>{item.badge}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 mb-4">
            <p className="text-purple-300 text-xs font-bold mb-2">Vector propio y valor propio</p>
            <Formula color="violet">M · v = λ · v</Formula>
            <p className="text-gray-500 text-xs leading-relaxed">Donde <code className="text-purple-300 bg-purple-500/10 px-1 rounded">v</code> es el vector propio (no nulo) y <code className="text-amber-300 bg-amber-500/10 px-1 rounded">λ</code> es su valor propio correspondiente.</p>
          </div>

          <CodeBlock>
            <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-emerald-400"> np</span></p>
            <p className="mt-1"><span className="text-emerald-400">M</span><span className="text-white"> = np.array([[</span><span className="text-amber-300">4</span><span className="text-white">, </span><span className="text-amber-300">2</span><span className="text-white">], [</span><span className="text-amber-300">1</span><span className="text-white">, </span><span className="text-amber-300">3</span><span className="text-white">]])</span></p>
            <p><span className="text-emerald-400">eigenvalues</span><span className="text-white">, </span><span className="text-emerald-400">eigenvectors</span><span className="text-white"> = np.linalg.eig(M)</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(eigenvalues)</span><span className="text-gray-500 ml-2">  # λ: [5. 2.]</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(eigenvectors)</span><span className="text-gray-500 ml-2"># V: columnas = vectores propios</span></p>
          </CodeBlock>

          <Tip color="violet">
            SVD es la base de <strong>PCA (Análisis de Componentes Principales)</strong>, usado para reducir dimensionalidad en datasets con muchas variables.
          </Tip>
        </section>

        {/* ══ 5. ESTADÍSTICA ═══════════════════════════════════ */}
        <section id="estadistica" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="📊" title="Conceptos Estadísticos" color="#10b981" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            La estadística es una rama de la matemática aplicada para <strong className="text-white">recolectar, organizar, analizar e interpretar datos</strong>. Tiene dos áreas principales:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold inline-block mb-3">Estadística Descriptiva</span>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">Comprende las características básicas de un dataset usando medidas de resumen.</p>
              <div className="flex flex-wrap gap-2">
                {["Media","Moda","Mediana","Desv. Estándar","Varianza","Percentiles"].map(m => (
                  <span key={m} className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-lg font-mono">{m}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold inline-block mb-3">Inferencia Estadística</span>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">Hace conclusiones sobre una población a partir de una muestra de datos.</p>
              <div className="flex flex-wrap gap-2">
                {["Pruebas de hipótesis","Correlación","Regresión","Pronóstico"].map(m => (
                  <span key={m} className="text-xs bg-sky-500/10 border border-sky-500/20 text-sky-300 px-2 py-0.5 rounded-lg font-mono">{m}</span>
                ))}
              </div>
            </div>
          </div>

          <CodeBlock>
            <p><span className="text-sky-400">import</span><span className="text-white"> numpy </span><span className="text-sky-400">as</span><span className="text-emerald-400"> np</span></p>
            <p><span className="text-sky-400">from</span><span className="text-white"> scipy </span><span className="text-sky-400">import</span><span className="text-white"> stats</span></p>
            <p className="mt-1"><span className="text-emerald-400">data</span><span className="text-white"> = np.array([</span><span className="text-amber-300">2</span><span className="text-white">, </span><span className="text-amber-300">4</span><span className="text-white">, </span><span className="text-amber-300">4</span><span className="text-white">, </span><span className="text-amber-300">4</span><span className="text-white">, </span><span className="text-amber-300">5</span><span className="text-white">, </span><span className="text-amber-300">5</span><span className="text-white">, </span><span className="text-amber-300">7</span><span className="text-white">, </span><span className="text-amber-300">9</span><span className="text-white">])</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(np.mean(data))</span><span className="text-gray-500 ml-2">    # Media: 5.0</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(np.std(data))</span><span className="text-gray-500 ml-2">     # Desv. estándar: 1.94</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(np.median(data))</span><span className="text-gray-500 ml-2">  # Mediana: 4.5</span></p>
          </CodeBlock>
        </section>

        {/* ══ 6. PROBABILIDAD ══════════════════════════════════ */}
        <section id="prob" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🎲" title="Probabilidad y Distribuciones" color="#a855f7" />
          <p className="text-gray-400 mb-6 leading-relaxed">
            Las distribuciones de probabilidad describen la probabilidad de que una <strong className="text-white">variable aleatoria</strong> tome cada uno de sus posibles valores.
          </p>

          <div className="space-y-4">
            {/* Variables aleatorias */}
            <ConceptCard step="01" icon="🎲" title="Variables Aleatorias" color="violet">
              <p className="text-gray-500 text-sm mb-3">Variable que puede tomar uno o varios valores aleatorios. Pueden ser <strong className="text-white">discretas</strong> (valores contables) o <strong className="text-white">continuas</strong> (valores en un rango).</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3 font-mono text-xs">
                  <p className="text-violet-300 mb-1">Discreta</p>
                  <p className="text-gray-400">Lanzar un dado:</p>
                  <p className="text-amber-300">X ∈ {"{1, 2, 3, 4, 5, 6}"}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-xs">
                  <p className="text-sky-300 mb-1">Continua</p>
                  <p className="text-gray-400">Temperatura:</p>
                  <p className="text-amber-300">X ∈ ℝ (cualquier valor)</p>
                </div>
              </div>
            </ConceptCard>

            {/* PMF */}
            <ConceptCard step="02" icon="📊" title="Función de Masa (PMF)" color="sky">
              <p className="text-gray-500 text-sm mb-3">Distribución sobre <strong className="text-white">variables discretas</strong>. Ejemplos: distribución Binomial y Poisson.</p>
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 mb-3">
                <p className="text-sky-300 text-xs font-bold mb-2">Distribución Binomial</p>
                <Formula color="sky">P(X=k) = C(n,k) · pᵏ · (1-p)ⁿ⁻ᵏ</Formula>
                <p className="text-gray-600 text-xs font-mono">k = 0, 1, 2, …, n</p>
              </div>
              <CodeBlock>
                <p><span className="text-sky-400">from</span><span className="text-white"> scipy.stats </span><span className="text-sky-400">import</span><span className="text-white"> binom</span></p>
                <p><span className="text-gray-500"># P(X=3) con n=10, p=0.5</span></p>
                <p><span className="text-violet-400">print</span><span className="text-white">(binom.pmf(</span><span className="text-amber-300">3</span><span className="text-white">, n=</span><span className="text-amber-300">10</span><span className="text-white">, p=</span><span className="text-amber-300">0.5</span><span className="text-white">))</span></p>
              </CodeBlock>
            </ConceptCard>

            {/* PDF */}
            <ConceptCard step="03" icon="📈" title="Función de Densidad (PDF)" color="emerald">
              <p className="text-gray-500 text-sm mb-3">Distribución sobre <strong className="text-white">variables continuas</strong>. Ejemplos: distribución Normal, Uniforme y t de Student.</p>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-3">
                <p className="text-emerald-300 text-xs font-bold mb-2">Distribución Normal (Gaussiana)</p>
                <Formula color="emerald">f(x) = (1 / √(2π)σ) · e^(-½·((x-μ)/σ)²)</Formula>
                <p className="text-gray-600 text-xs font-mono">μ = media   σ = desviación estándar</p>
              </div>
              <CodeBlock>
                <p><span className="text-sky-400">from</span><span className="text-white"> scipy.stats </span><span className="text-sky-400">import</span><span className="text-white"> norm</span></p>
                <p><span className="text-gray-500"># Distribución normal μ=0, σ=1</span></p>
                <p><span className="text-emerald-400">x</span><span className="text-white"> = norm(loc=</span><span className="text-amber-300">0</span><span className="text-white">, scale=</span><span className="text-amber-300">1</span><span className="text-white">)</span></p>
                <p><span className="text-violet-400">print</span><span className="text-white">(x.pdf(</span><span className="text-amber-300">0</span><span className="text-white">))</span><span className="text-gray-500 ml-2"># densidad en x=0: 0.3989</span></p>
              </CodeBlock>
            </ConceptCard>

            {/* Probabilidad Marginal */}
            <ConceptCard step="04" icon="∑" title="Probabilidad Marginal" color="amber">
              <p className="text-gray-500 text-sm mb-3">Calcula la distribución de un subconjunto de variables aleatorias a partir de la distribución conjunta.</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-amber-300 text-xs font-bold mb-2">Discreta</p>
                  <Formula color="amber">P(x) = Σᵧ p(x, y)</Formula>
                </div>
                <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
                  <p className="text-sky-300 text-xs font-bold mb-2">Continua</p>
                  <Formula color="sky">P(x) = ∫ p(x, y) dy</Formula>
                </div>
              </div>
            </ConceptCard>

            {/* Probabilidad Condicional */}
            <ConceptCard step="05" icon="⊃" title="Probabilidad Condicional" color="rose">
              <p className="text-gray-500 text-sm mb-3">Probabilidad de que ocurra un evento <strong className="text-white">dado que otro ya ocurrió</strong>.</p>
              <Formula color="rose">P(x | y) = P(x, y) / P(y)</Formula>
              <p className="text-gray-600 text-xs font-mono">→ Probabilidad de x dado que y ya tuvo lugar</p>
            </ConceptCard>
          </div>
        </section>

        {/* ══ 7. BAYES ═════════════════════════════════════════ */}
        <section id="bayes" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="🔮" title="Teorema de Bayes" color="#10b981" />
          <p className="text-gray-400 mb-5 leading-relaxed">
            Permite calcular la probabilidad condicional de un evento <strong className="text-white">invirtiendo el orden</strong>: si conocemos P(B|A) y queremos P(A|B).
          </p>

          <Formula color="emerald">P(A|B) = P(B|A) · P(A) / P(B)</Formula>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { symbol:"P(A)",   name:"Prior",      desc:"Probabilidad a priori del evento A.",          color:"sky" },
              { symbol:"P(B|A)", name:"Likelihood", desc:"Probabilidad de B dado que A ocurrió.",         color:"violet" },
              { symbol:"P(A|B)", name:"Posterior",  desc:"Lo que queremos calcular: A dado que B ocurrió.",color:"emerald" },
            ].map((item) => {
              const c = {
                sky:     { border:"border-sky-500/20",     bg:"bg-sky-500/5",     text:"text-sky-300",     badge:"bg-sky-500/20 text-sky-300" },
                violet:  { border:"border-violet-500/20",  bg:"bg-violet-500/5",  text:"text-violet-300",  badge:"bg-violet-500/20 text-violet-300" },
                emerald: { border:"border-emerald-500/20", bg:"bg-emerald-500/5", text:"text-emerald-300", badge:"bg-emerald-500/20 text-emerald-300" },
              }[item.color];
              return (
                <div key={item.symbol} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xl font-black font-mono ${c.text}`}>{item.symbol}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${c.badge}`}>{item.name}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <BayesDemo />

          <div className="mt-5">
            <Tip color="emerald">
              El teorema de Bayes es la base del <strong>Clasificador Naive Bayes</strong>, uno de los algoritmos más simples y efectivos en clasificación de texto e spam.
            </Tip>
          </div>
        </section>

        {/* ══ RESUMEN ══════════════════════════════════════════ */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"320ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { label:"Escalar / Vector",   desc:"Unidades básicas: un número y un arreglo ordenado de n números.",                        color:"#f59e0b" },
              { label:"Matriz / Tensor",    desc:"Estructuras 2D y nD. Toda imagen, dataset y batch en ML es un tensor.",                   color:"#0ea5e9" },
              { label:"Norma",              desc:"Mide el tamaño de un vector. L² (Euclídea) y L¹ (Manhattan) son las más usadas.",        color:"#a855f7" },
              { label:"SVD / Eigenvectors", desc:"Descomposición matricial. Base de PCA y reducción de dimensionalidad.",                   color:"#10b981" },
              { label:"PMF / PDF",          desc:"Distribuciones para variables discretas (Binomial) y continuas (Normal).",               color:"#f43f5e" },
              { label:"Bayes",              desc:"P(A|B) = P(B|A)·P(A)/P(B). Base del clasificador Naive Bayes.",                         color:"#6366f1" },
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
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Módulo III · Matemáticas y Estadística</span>
        </div>

      </div>
    </div>
  );
}