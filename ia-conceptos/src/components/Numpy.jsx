// NumPy.jsx — Módulo: Introducción a NumPy
// Contenido basado en el notebook: Machine Learning con Python - Módulo III

import { useState } from "react";

// ── Demo: Vector interactivo ──────────────────────────────────────
function VectorDemo() {
  const base = [12, 24, 4, 3, 55, 0];
  const [op, setOp] = useState("none");
  const [scalar, setScalar] = useState(5);

  const ops = {
    none:   { label: "vector",      fn: (v) => v,              color: "text-emerald-300", desc: "Array original" },
    sum1:   { label: "+1",          fn: (v) => v.map(x=>x+1),  color: "text-sky-300",    desc: "Sumar escalar 1" },
    mult:   { label: `*${scalar}`,  fn: (v) => v.map(x=>x*scalar), color: "text-amber-300", desc: `Multiplicar por ${scalar}` },
    total:  { label: "sum()",       fn: (v) => [v.reduce((a,b)=>a+b,0)], color: "text-violet-300", desc: "Suma total" },
    mean:   { label: "mean()",      fn: (v) => [+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(4)], color: "text-rose-300", desc: "Promedio" },
    sq:     { label: "**2",         fn: (v) => v.map(x=>x*x),  color: "text-orange-300", desc: "Cuadrado" },
  };

  const result = ops[op].fn(base);

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Operaciones sobre vectores</p>
      <p className="text-gray-500 text-xs mb-3 font-mono">vector = np.array([12, 24, 4, 3, 55, 0])</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(ops).map(([k, v]) => (
          <button key={k} onClick={() => setOp(k)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono
              ${op === k ? `border-emerald-400 bg-emerald-400/20 ${v.color}`
                         : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {v.label}
          </button>
        ))}
        {op === "mult" && (
          <input type="number" value={scalar} onChange={(e) => setScalar(Number(e.target.value))} min={1} max={100}
            className="w-16 bg-black/40 border border-amber-500/30 rounded-lg px-2 py-1 text-amber-300 text-xs font-mono outline-none" />
        )}
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-4 mb-3 font-mono text-sm">
        <p className="text-gray-500 text-xs mb-2">{ops[op].desc}</p>
        <p className={`font-bold ${ops[op].color}`}>
          [{result.join(", ")}]
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {base.map((v, i) => (
          <div key={i} className={`rounded-lg border px-3 py-2 text-center transition-all duration-300
            border-emerald-500/20 bg-emerald-500/5`}>
            <p className="text-xs text-gray-600">[{i}]</p>
            <p className="text-emerald-200 font-mono text-sm font-bold">{v}</p>
            {op !== "none" && op !== "total" && op !== "mean" && (
              <p className={`text-xs ${ops[op].color}`}>→ {ops[op].fn([v])[0]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Demo: Indexing visual ─────────────────────────────────────────
function IndexDemo() {
  const vector = [12, 24, 4, 3, 55, 0];
  const [sel, setSel] = useState(null);
  const [slice, setSlice] = useState(null);

  const slices = [
    { label: "vector[1:4]", idx: [1,2,3], desc: "elementos del índice 1 al 3" },
    { label: "vector[1:]",  idx: [1,2,3,4,5], desc: "desde índice 1 en adelante" },
    { label: "vector[:4]",  idx: [0,1,2,3], desc: "todos los que tienen índice < 4" },
    { label: "vector[:]",   idx: [0,1,2,3,4,5], desc: "copia completa del vector" },
  ];

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Índices de vectores</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {vector.map((v, i) => (
          <button key={i} onClick={() => { setSel(i); setSlice(null); }}
            className={`rounded-lg border px-3 py-2 text-center transition-all duration-200 cursor-pointer
              ${sel === i || slice?.includes(i)
                ? "border-yellow-400 bg-yellow-400/20 scale-110"
                : "border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10"}`}>
            <p className="text-xs text-gray-500">[{i}]</p>
            <p className="font-mono font-bold text-sm text-sky-200">{v}</p>
          </button>
        ))}
      </div>

      {sel !== null && !slice && (
        <p className="font-mono text-sm text-yellow-300 mb-3">vector[{sel}] → <span className="text-amber-300">{vector[sel]}</span></p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {slices.map((s) => (
          <button key={s.label} onClick={() => { setSlice(s.idx); setSel(null); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono
              ${JSON.stringify(slice) === JSON.stringify(s.idx)
                ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                : "border-sky-500/20 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {slice && (
        <p className="font-mono text-sm text-yellow-300">
          → [<span className="text-amber-300">{slice.map(i => vector[i]).join(", ")}</span>]
        </p>
      )}
    </div>
  );
}

// ── Demo: Matriz interactiva ──────────────────────────────────────
function MatrizDemo() {
  const [data, setData] = useState([
    [1, 2],
    [12, 3],
    [7.2, 5],
  ]);
  const [sel, setSel] = useState(null);        // {row, col}
  const [selRow, setSelRow] = useState(null);
  const [selCol, setSelCol] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");

  const rows = data.length;
  const cols = data[0].length;
  const shape = `(${rows}, ${cols})`;

  const startEdit = (r, c) => {
    setEditIdx(`${r},${c}`);
    setEditVal(String(data[r][c]));
    setSel(null); setSelRow(null); setSelCol(null);
  };

  const commitEdit = (r, c) => {
    const v = parseFloat(editVal);
    if (!isNaN(v)) {
      const next = data.map((row, ri) => row.map((val, ci) => ri === r && ci === c ? v : val));
      setData(next);
    }
    setEditIdx(null);
  };

  const isHighlighted = (r, c) => {
    if (sel && sel.row === r && sel.col === c) return true;
    if (selRow === r) return true;
    if (selCol === c) return true;
    return false;
  };

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Matrices</p>

      {/* Controles */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <button onClick={() => { setSel(null); setSelRow(null); setSelCol(null); }}
          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all">
          Ver todo
        </button>
        {[0,1,2].map(r => (
          <button key={r} onClick={() => { setSelRow(r); setSel(null); setSelCol(null); }}
            className={`px-3 py-1.5 rounded-lg border font-mono transition-all
              ${selRow === r ? "border-violet-400 bg-violet-400/20 text-violet-300" : "border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"}`}>
            fila {r}
          </button>
        ))}
        {[0,1].map(c => (
          <button key={c} onClick={() => { setSelCol(c); setSel(null); setSelRow(null); }}
            className={`px-3 py-1.5 rounded-lg border font-mono transition-all
              ${selCol === c ? "border-sky-400 bg-sky-400/20 text-sky-300" : "border-sky-500/20 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"}`}>
            col {c}
          </button>
        ))}
      </div>

      {/* Matriz visual */}
      <div className="flex gap-2 mb-4">
        <span className="text-gray-400 text-2xl self-center">[</span>
        <div className="space-y-2">
          {data.map((row, r) => (
            <div key={r} className="flex gap-2">
              {row.map((val, c) => (
                editIdx === `${r},${c}` ? (
                  <input key={c} autoFocus value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onBlur={() => commitEdit(r, c)}
                    onKeyDown={(e) => e.key === "Enter" && commitEdit(r, c)}
                    className="w-16 bg-yellow-400/20 border border-yellow-400 rounded-lg px-2 py-2 text-yellow-300 text-sm font-mono outline-none text-center" />
                ) : (
                  <button key={c}
                    onClick={() => { setSel({ row: r, col: c }); setSelRow(null); setSelCol(null); }}
                    onDoubleClick={() => startEdit(r, c)}
                    title="Doble clic para editar"
                    className={`w-16 rounded-lg border px-2 py-2 text-sm font-mono font-bold transition-all duration-200 cursor-pointer
                      ${isHighlighted(r, c)
                        ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 scale-110"
                        : "border-violet-500/20 bg-black/30 text-violet-200 hover:bg-violet-500/10"}`}>
                    {val}
                  </button>
                )
              ))}
            </div>
          ))}
        </div>
        <span className="text-gray-400 text-2xl self-center">]</span>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-3 font-mono text-xs space-y-1">
        <p><span className="text-gray-500">matriz.shape → </span><span className="text-amber-300">{shape}</span></p>
        {sel && (
          <p><span className="text-gray-500">matriz[{sel.row},{sel.col}] → </span><span className="text-yellow-300">{data[sel.row][sel.col]}</span></p>
        )}
        {selRow !== null && (
          <p><span className="text-gray-500">matriz[{selRow},:] → </span><span className="text-violet-300">[{data[selRow].join(", ")}]</span></p>
        )}
        {selCol !== null && (
          <p><span className="text-gray-500">matriz[:,{selCol}] → </span><span className="text-sky-300">[{data.map(r=>r[selCol]).join(", ")}]</span></p>
        )}
      </div>
      <p className="text-xs text-gray-600 mt-2">💡 Doble clic en una celda para modificar su valor</p>
    </div>
  );
}

// ── Demo: Generadores de matrices ─────────────────────────────────
function GeneradoresDemo() {
  const [tipo, setTipo] = useState("zeros");
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const gen = (t, r, c) => {
    if (t === "zeros")    return Array.from({length:r}, () => Array(c).fill(0));
    if (t === "ones")     return Array.from({length:r}, () => Array(c).fill(1));
    if (t === "eye")      return Array.from({length:r}, (_, i) => Array.from({length:c}, (_, j) => i===j?1:0));
    if (t === "random")   return Array.from({length:r}, () => Array.from({length:c}, () => +(Math.random()).toFixed(3)));
    return [];
  };

  const mat = gen(tipo, rows, cols);

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Generadores de matrices</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { k: "zeros",  label: "np.zeros()" },
          { k: "ones",   label: "np.ones()" },
          { k: "eye",    label: "np.eye()" },
          { k: "random", label: "np.random.rand()" },
        ].map(({ k, label }) => (
          <button key={k} onClick={() => setTipo(k)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all
              ${tipo === k ? "border-amber-400 bg-amber-400/20 text-amber-300"
                          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        {[{ label: "filas", val: rows, set: setRows }, { label: "cols", val: cols, set: setCols }].map((f) => (
          <div key={f.label}>
            <label className="text-xs text-gray-500 block mb-1">{f.label}: <span className="text-amber-300 font-mono">{f.val}</span></label>
            <input type="range" min={1} max={5} value={f.val}
              onChange={(e) => f.set(Number(e.target.value))}
              className="w-24 accent-amber-500" />
          </div>
        ))}
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-sm mb-3">
        <p className="text-gray-500 text-xs mb-2">
          np.{tipo === "random" ? `random.rand(${rows},${cols})` : tipo === "eye" ? `eye(${rows})` : `${tipo}((${rows},${cols}))`}
        </p>
        {mat.map((row, r) => (
          <p key={r}>
            [<span className="text-amber-300">{row.map(v => String(v).padStart(5)).join(", ")}</span>]
          </p>
        ))}
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
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300" },
    sky:     { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-300" },
    violet:  { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-300" },
    amber:   { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-300" },
  };
  const c = map[color] || map.emerald;
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
export default function NumPy({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        code { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-amber-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-emerald-400" style={{ fontFamily: "monospace" }}>NumPy</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#10b981", color: "#10b981", fontFamily: "monospace" }}>
            🐍 Módulo III · Procesamiento de datos
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Introducción a{" "}
            <span style={{
              background: "linear-gradient(135deg, #10b981, #6366f1, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>NumPy</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            La librería esencial para cálculo numérico en Python. Crea
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">vectores</code> y
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">matrices</code>,
            opera sobre ellas con una sola línea de código.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#import",    label: "📦 Import" },
            { href: "#vectores",  label: "📐 Vectores" },
            { href: "#ops-vec",   label: "⚡ Ops. vectores" },
            { href: "#indexing",  label: "🔢 Indexing" },
            { href: "#matrices",  label: "🔲 Matrices" },
            { href: "#ops-mat",   label: "🧮 Ops. matrices" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ SECCIÓN 1 — Import ══ */}
        <section id="import" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📦" title="Importar NumPy" color="#10b981" />
          <p className="text-gray-400 mb-5">
            Antes de usar NumPy hay que importarlo. Se usa el alias <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">np</code> por convención para que el código sea más legible.
          </p>
          <CodeBlock>
            <p><span className="text-violet-400">import</span><span className="text-white"> numpy </span><span className="text-violet-400">as</span><span className="text-emerald-400"> np</span><span className="text-gray-500 ml-2"># alias np es la convención</span></p>
          </CodeBlock>
          <Tip color="emerald">
            Después de importar, todas las funciones de NumPy se acceden con el prefijo <code>np.</code>, por ejemplo: <code>np.array()</code>, <code>np.zeros()</code>, <code>np.sin()</code>.
          </Tip>
        </section>

        {/* ══ SECCIÓN 2 — Vectores ══ */}
        <section id="vectores" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="📐" title="Arreglos Unidimensionales (Vectores)" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            Los arreglos de NumPy (<strong className="text-white">ndarray</strong>) son más potentes que las listas de Python porque permiten operaciones matemáticas directas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Con arange */}
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-sky-300 text-xs font-bold mb-3">np.arange(n)</p>
              <CodeBlock>
                <p><span className="text-emerald-400">arr</span><span className="text-white"> = np.</span><span className="text-sky-400">arange</span><span className="text-white">(8)</span></p>
                <p className="text-gray-500">→ [0 1 2 3 4 5 6 7]</p>
              </CodeBlock>
            </div>
            {/* Con lista */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-300 text-xs font-bold mb-3">np.array(lista)</p>
              <CodeBlock>
                <p><span className="text-emerald-400">lista</span><span className="text-white"> = [12, 24, 4, 3, 55, 0]</span></p>
                <p><span className="text-emerald-400">vector</span><span className="text-white"> = np.</span><span className="text-sky-400">array</span><span className="text-white">(lista)</span></p>
                <p className="text-gray-500">→ array([12, 24, 4, 3, 55, 0])</p>
              </CodeBlock>
            </div>
          </div>

          {/* zeros / ones */}
          <h3 className="text-white font-semibold mb-3">Vectores especiales</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { fn: "np.zeros(5)", res: "[0. 0. 0. 0. 0.]", color: "#6366f1" },
              { fn: "np.ones(5)",  res: "[1. 1. 1. 1. 1.]", color: "#f59e0b" },
            ].map((item) => (
              <div key={item.fn} className="bg-black/40 rounded-xl border border-white/10 p-4">
                <code className="text-sm font-bold block mb-2" style={{ color: item.color }}>{item.fn}</code>
                <p className="text-amber-300 font-mono text-xs">{item.res}</p>
              </div>
            ))}
          </div>

          <Tip color="sky">
            La diferencia clave entre una lista y un <code>ndarray</code>: el arreglo de NumPy permite operar matemáticamente sobre todos sus elementos a la vez, sin necesidad de un bucle.
          </Tip>
        </section>

        {/* ══ SECCIÓN 3 — Operaciones ══ */}
        <section id="ops-vec" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="⚡" title="Operaciones sobre Vectores" color="#8b5cf6" />
          <p className="text-gray-400 mb-5">
            NumPy aplica las operaciones elemento a elemento de forma automática (<strong className="text-white">broadcasting</strong>).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { code: "vector + 1",          res: "[13, 25, 5, 4, 56, 1]",   desc: "Sumar escalar" },
              { code: "vector * 5",          res: "[60, 120, 20, 15, 275, 0]", desc: "Multiplicar por escalar" },
              { code: "np.sum(vector)",      res: "98",                       desc: "Suma total" },
              { code: "np.mean(vector)",     res: "16.33",                    desc: "Promedio" },
              { code: "vector + vector2",    res: "[12, 25, 6, 6, 59, 5]",   desc: "Suma de dos vectores" },
              { code: "np.power(vector, 2)", res: "[144, 576, 16, 9, ...]",  desc: "Elevar al cuadrado" },
            ].map((item) => (
              <div key={item.code} className="bg-black/40 rounded-xl border border-white/10 p-3">
                <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
                <code className="text-violet-300 text-xs font-mono">{item.code}</code>
                <p className="text-amber-300 font-mono text-xs mt-1">→ {item.res}</p>
              </div>
            ))}
          </div>
          <VectorDemo />
        </section>

        {/* ══ SECCIÓN 4 — Indexing ══ */}
        <section id="indexing" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="🔢" title="Índices y Slicing de Vectores" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            El indexado en NumPy funciona igual que en las listas de Python: comienza en <code className="text-sky-400 bg-sky-500/10 px-1 rounded">0</code> y admite slicing <code className="text-sky-400 bg-sky-500/10 px-1 rounded">[inicio:fin]</code>.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># vector = [12, 24, 4, 3, 55, 0]</p>
            <p><span className="text-emerald-400">vector</span><span className="text-white">[1]</span><span className="text-gray-500">     → </span><span className="text-amber-300">24</span><span className="text-gray-500 ml-2"># segundo elemento</span></p>
            <p><span className="text-emerald-400">vector</span><span className="text-white">[1:4]</span><span className="text-gray-500">   → </span><span className="text-amber-300">[24, 4, 3]</span></p>
            <p><span className="text-emerald-400">vector</span><span className="text-white">[1:]</span><span className="text-gray-500">    → </span><span className="text-amber-300">[24, 4, 3, 55, 0]</span></p>
            <p><span className="text-emerald-400">vector</span><span className="text-white">[:4]</span><span className="text-gray-500">    → </span><span className="text-amber-300">[12, 24, 4, 3]</span></p>
            <p><span className="text-emerald-400">vector</span><span className="text-white">[:]</span><span className="text-gray-500">     → </span><span className="text-amber-300">[12, 24, 4, 3, 55, 0]</span><span className="text-gray-500 ml-2"># copia</span></p>
          </CodeBlock>
          <IndexDemo />
        </section>

        {/* ══ SECCIÓN 5 — Matrices ══ */}
        <section id="matrices" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "200ms" }}>
          <SectionHeader icon="🔲" title="Matrices (arreglos 2D)" color="#a855f7" />
          <p className="text-gray-400 mb-5">
            Las matrices son arreglos de <strong className="text-white">dos dimensiones</strong>: filas y columnas.
            Se crean pasando una lista de listas. El atributo <code className="text-violet-400 bg-violet-500/10 px-1 rounded">.shape</code> devuelve <code className="text-violet-400 bg-violet-500/10 px-1 rounded">(filas, columnas)</code>.
          </p>
          <CodeBlock>
            <p><span className="text-emerald-400">listas</span><span className="text-white"> = [[1,-4], [12,3], [7.2,5]]</span></p>
            <p><span className="text-emerald-400">matriz</span><span className="text-white"> = np.</span><span className="text-sky-400">array</span><span className="text-white">(listas)</span></p>
            <p className="mt-1"><span className="text-emerald-400">matriz</span><span className="text-white">.shape</span><span className="text-gray-500"> → </span><span className="text-amber-300">(3, 2)</span><span className="text-gray-500 ml-2"># 3 filas, 2 cols</span></p>
            <p className="mt-1 text-gray-500"># Acceso:</p>
            <p><span className="text-emerald-400">matriz</span><span className="text-white">[0,1]</span><span className="text-gray-500"> → </span><span className="text-amber-300">-4.0</span><span className="text-gray-500 ml-2"># fila 0, col 1</span></p>
            <p><span className="text-emerald-400">matriz</span><span className="text-white">[1,:]</span><span className="text-gray-500"> → </span><span className="text-amber-300">[12., 3.]</span><span className="text-gray-500 ml-2"># fila 1 completa</span></p>
            <p><span className="text-emerald-400">matriz</span><span className="text-white">[:,0]</span><span className="text-gray-500"> → </span><span className="text-amber-300">[1., 12., 7.2]</span><span className="text-gray-500 ml-2"># col 0 completa</span></p>
            <p className="mt-1 text-gray-500"># Modificar elemento:</p>
            <p><span className="text-emerald-400">matriz</span><span className="text-white">[0,1] = 2</span></p>
          </CodeBlock>

          <div className="mb-5"><MatrizDemo /></div>
          <div className="mb-5"><GeneradoresDemo /></div>

          {/* np.eye */}
          <div className="bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-sm mb-4">
            <p className="text-gray-500 text-xs mb-2">Matriz identidad 3×3:</p>
            <p><span className="text-emerald-400">np</span><span className="text-white">.</span><span className="text-sky-400">eye</span><span className="text-white">(3)</span></p>
            <p className="text-amber-300 mt-1">[[1. 0. 0.]</p>
            <p className="text-amber-300"> [0. 1. 0.]</p>
            <p className="text-amber-300"> [0. 0. 1.]]</p>
          </div>
        </section>

        {/* ══ SECCIÓN 6 — Operaciones con matrices ══ */}
        <section id="ops-mat" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="🧮" title="Operaciones con Matrices" color="#f59e0b" />
          <p className="text-gray-400 mb-5">
            NumPy ofrece funciones para operar sobre matrices completas de forma eficiente.
          </p>
          <div className="space-y-3 mb-6">
            {[
              { code: "np.sin(a)",         desc: "Seno elemento a elemento",                color: "#10b981" },
              { code: "np.random.rand(2,3)", desc: "Matriz de valores aleatorios 2×3",      color: "#6366f1" },
              { code: "a * c",             desc: "Multiplicación elemento a elemento",       color: "#0ea5e9" },
              { code: "np.dot(a, d)",      desc: "Producto matricial (filas × columnas)",   color: "#a855f7" },
              { code: "matriz.sum(axis=0)", desc: "Suma por columnas",                      color: "#f59e0b" },
              { code: "matriz.sum(axis=1)", desc: "Suma por filas",                         color: "#f59e0b" },
              { code: "np.power(matriz,2)", desc: "Elevar cada elemento al cuadrado",       color: "#f43f5e" },
              { code: "A.diagonal()",      desc: "Elementos de la diagonal principal",      color: "#0ea5e9" },
            ].map((row) => (
              <div key={row.code} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <code className="text-sm font-bold whitespace-nowrap mt-0.5 shrink-0" style={{ color: row.color }}>{row.code}</code>
                <p className="text-gray-400 text-sm">{row.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm" style={{ fontFamily: "monospace" }}>
              <p className="text-gray-500 text-xs mb-2">Suma por axis:</p>
              <p><span className="text-amber-400">axis=0</span><span className="text-gray-500"> → suma cada columna</span></p>
              <p><span className="text-amber-400">axis=1</span><span className="text-gray-500"> → suma cada fila</span></p>
              <p className="text-gray-500 mt-2">matriz.sum(axis=0) → [20.2, 10.]</p>
              <p className="text-gray-500">matriz.sum(axis=1) → [3., 15., 12.2]</p>
              <p className="text-gray-500">matriz.sum()       → 30.2</p>
            </div>
            <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm" style={{ fontFamily: "monospace" }}>
              <p className="text-gray-500 text-xs mb-2">Producto matricial vs elemento a elemento:</p>
              <p><span className="text-violet-300">a * c</span><span className="text-gray-500"> → multiplica posición por posición</span></p>
              <p className="text-gray-500 mt-1">⚠️ Requiere mismo shape</p>
              <p className="mt-2"><span className="text-violet-300">np.dot(a, d)</span><span className="text-gray-500"> → producto matricial</span></p>
              <p className="text-gray-500">⚠️ Columnas de a = filas de d</p>
            </div>
          </div>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "np.array(lista)",        desc: "Crea un ndarray desde una lista.",                       color: "#10b981" },
              { code: "np.arange(n)",           desc: "Genera enteros de 0 a n-1.",                            color: "#10b981" },
              { code: "np.zeros((f,c))",        desc: "Matriz de ceros de f filas y c columnas.",              color: "#6366f1" },
              { code: "np.ones((f,c))",         desc: "Matriz de unos.",                                        color: "#6366f1" },
              { code: "np.eye(n)",              desc: "Matriz identidad n×n.",                                  color: "#6366f1" },
              { code: "arr.shape",              desc: "Tupla con las dimensiones del arreglo.",                 color: "#0ea5e9" },
              { code: "arr[i]  /  arr[i,j]",   desc: "Accede al elemento en posición i (o fila i, col j).",   color: "#f59e0b" },
              { code: "arr[1:]  /  arr[1:4]",  desc: "Slicing: subconjunto del arreglo.",                     color: "#f59e0b" },
              { code: "np.dot(a, b)",           desc: "Producto matricial (no elemento a elemento).",          color: "#a855f7" },
              { code: "arr.sum(axis=0)",        desc: "Suma por columnas. axis=1 suma por filas.",             color: "#f43f5e" },
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
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · NumPy</span>
        </div>

      </div>
    </div>
  );
}