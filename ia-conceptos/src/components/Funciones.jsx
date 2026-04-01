
// Funciones.jsx — Módulo: Funciones en Python
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

import { useState } from "react";

// ── Demo: Pitágoras ───────────────────────────────────────────────
function PitagorasDemo() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = Math.sqrt(a ** 2 + b ** 2).toFixed(4);

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
      <p className="text-indigo-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — pitagoras(a, b)</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {[{ label: "a (cateto)", val: a, set: setA }, { label: "b (cateto)", val: b, set: setB }].map((s) => (
          <div key={s.label}>
            <label className="text-xs text-gray-500 block mb-1">{s.label} = <span className="text-amber-300 font-mono">{s.val}</span></label>
            <input type="range" min={1} max={20} value={s.val}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>

      {/* Triángulo SVG */}
      <div className="flex items-end justify-center gap-6 mb-5">
        <svg width="160" height="120" viewBox="0 0 160 120">
          <polygon points="10,110 150,110 10,10" fill="none" stroke="#6366f1" strokeWidth="2" strokeOpacity="0.4" />
          <line x1="10" y1="110" x2="150" y2="110" stroke="#10b981" strokeWidth="2.5" />
          <line x1="10" y1="110" x2="10"  y2="10"  stroke="#0ea5e9" strokeWidth="2.5" />
          <line x1="10" y1="10"  x2="150" y2="110" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,3" />
          <text x="80" y="125" fill="#10b981" fontSize="11" textAnchor="middle">a = {a}</text>
          <text x="0"  y="60"  fill="#0ea5e9" fontSize="11" textAnchor="middle">b = {b}</text>
          <text x="90" y="55"  fill="#f59e0b" fontSize="11" textAnchor="middle">c ≈ {c}</text>
        </svg>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm" style={{ fontFamily: "monospace" }}>
        <p><span className="text-violet-400">pitagoras</span><span className="text-white">(</span><span className="text-amber-300">{a}</span><span className="text-white">, </span><span className="text-amber-300">{b}</span><span className="text-white">)</span></p>
        <p className="text-gray-500 mt-1">→ c = √({a}² + {b}²) = <span className="text-indigo-300 font-bold">{c}</span></p>
      </div>
    </div>
  );
}

// ── Demo: función saludo con parámetros opcionales ────────────────
function SaludoDemo() {
  const [nombre, setNombre]     = useState("Pedro");
  const [saludo, setSaludo]     = useState("Hola");
  const [despedida, setDespedida] = useState(false);

  const resultado = despedida
    ? `Hasta luego ${nombre}`
    : `${saludo} ${nombre}, ¿Cómo estás?`;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — saludo(nombre, saludo, despedida)</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">nombre <span className="text-rose-400">(requerido)</span></label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-emerald-500/50" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">saludo <span className="text-sky-400">(default: "Hola")</span></label>
          <input value={saludo} onChange={(e) => setSaludo(e.target.value)} disabled={despedida}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-emerald-500/50 disabled:opacity-40" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">despedida <span className="text-sky-400">(default: False)</span></label>
          <button onClick={() => setDespedida(!despedida)}
            className={`w-full rounded-lg px-3 py-1.5 text-sm font-mono border transition-all
              ${despedida ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {despedida ? "True" : "False"}
          </button>
        </div>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm mb-3" style={{ fontFamily: "monospace" }}>
        <p className="text-gray-500 mb-1"># Llamada:</p>
        <p>
          <span className="text-violet-400">saludo</span>
          <span className="text-white">(</span>
          <span className="text-green-300">"{nombre}"</span>
          {saludo !== "Hola" && !despedida && <><span className="text-white">, </span><span className="text-green-300">"{saludo}"</span></>}
          {despedida && <><span className="text-white">, despedida=</span><span className="text-rose-300">True</span></>}
          <span className="text-white">)</span>
        </p>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">→ print output:</p>
        <p className="text-emerald-300 font-semibold">{resultado}</p>
      </div>
    </div>
  );
}

// ── Demo: función signo ───────────────────────────────────────────
function SignoDemo() {
  const [val, setVal] = useState(0);

  const signo = (v) => {
    if (v > 0) return { msg: "El valor es positivo", color: "emerald", emoji: "📈" };
    if (v === 0) return { msg: "El valor es nulo",    color: "amber",   emoji: "⚖️" };
    return         { msg: "El valor es negativo",    color: "rose",    emoji: "📉" };
  };
  const r = signo(val);
  const c = { emerald: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10", amber: "text-amber-300 border-amber-500/40 bg-amber-500/10", rose: "text-rose-300 border-rose-500/40 bg-rose-500/10" }[r.color];

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — signo(valor) — múltiples return</p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-gray-400 text-sm">valor =</span>
        <input type="range" min={-10} max={10} value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="flex-1 accent-violet-500" />
        <span className="text-amber-300 font-mono font-bold text-xl w-8 text-center">{val}</span>
      </div>
      <div className={`rounded-xl border p-4 flex items-center gap-3 transition-all duration-300 ${c}`}>
        <span className="text-2xl">{r.emoji}</span>
        <div>
          <p className="font-bold">{r.msg}</p>
          <p className="text-xs opacity-60 font-mono">signo({val}) → return "{r.msg}"</p>
        </div>
      </div>
    </div>
  );
}

// ── Demo: *args — promedio ────────────────────────────────────────
function ArgsDemo() {
  const [nums, setNums]   = useState([1, 3, 5, 6]);
  const [input, setInput] = useState("");

  const agregar = () => {
    const n = parseFloat(input);
    if (!isNaN(n)) { setNums([...nums, n]); setInput(""); }
  };

  const quitar = (i) => setNums(nums.filter((_, idx) => idx !== i));

  const prom = nums.length > 0 ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : "—";

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — promedio(*args)</p>

      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
        {nums.map((n, i) => (
          <div key={i} className="flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5">
            <span className="text-sky-200 font-mono text-sm">{n}</span>
            <button onClick={() => quitar(i)} className="text-red-400 hover:text-red-300 text-xs ml-1">✕</button>
          </div>
        ))}
        {nums.length === 0 && <span className="text-gray-600 text-sm italic">Sin argumentos</span>}
      </div>

      <div className="flex gap-2 mb-4">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregar()}
          placeholder="Número..."
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm w-28 outline-none focus:border-sky-500/50" />
        <button onClick={agregar}
          className="text-xs px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer">
          + Agregar
        </button>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm" style={{ fontFamily: "monospace" }}>
        <p className="text-gray-500 mb-1"># args recibido como tupla:</p>
        <p><span className="text-emerald-400">args</span><span className="text-white"> = ({nums.join(", ")})</span></p>
        <p className="mt-1"><span className="text-violet-400">promedio</span><span className="text-white">({nums.join(", ")})</span></p>
        <p className="text-gray-500">→ <span className="text-amber-300 font-bold">{prom}</span></p>
      </div>
    </div>
  );
}

// ── Demo: **kwargs ────────────────────────────────────────────────
function KwargsDemo() {
  const [pairs, setPairs] = useState([
    { k: "n", v: "10" },
    { k: "l", v: "[1,2,3,4]" },
    { k: "s", v: "hola" },
  ]);
  const [nk, setNk] = useState(""); const [nv, setNv] = useState("");

  const add = () => {
    if (nk.trim() && nv.trim()) { setPairs([...pairs, { k: nk.trim(), v: nv.trim() }]); setNk(""); setNv(""); }
  };
  const remove = (i) => setPairs(pairs.filter((_, idx) => idx !== i));

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — argumentos(**kwargs)</p>

      <div className="space-y-2 mb-4">
        {pairs.map((p, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-black/30 px-3 py-2 text-sm font-mono">
            <span className="text-green-300">"{p.k}"</span>
            <span className="text-white">:</span>
            <span className="text-amber-300">{p.v}</span>
            <button onClick={() => remove(i)} className="ml-auto text-red-400 hover:text-red-300 text-xs">✕</button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input value={nk} onChange={(e) => setNk(e.target.value)} placeholder="clave"
          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs w-20 outline-none focus:border-amber-500/50" />
        <span className="text-gray-500 self-center">=</span>
        <input value={nv} onChange={(e) => setNv(e.target.value)} placeholder="valor"
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs w-28 outline-none focus:border-amber-500/50" />
        <button onClick={add}
          className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer">
          + Par
        </button>
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm" style={{ fontFamily: "monospace" }}>
        <p className="text-gray-500 mb-1"># kwargs como diccionario:</p>
        <p><span className="text-amber-400">{"{"}</span>{pairs.map((p, i) => (
          <span key={i}><span className="text-green-300">"{p.k}"</span><span className="text-white">: </span><span className="text-amber-300">{p.v}</span>{i < pairs.length - 1 && <span className="text-white">, </span>}</span>
        ))}<span className="text-amber-400">{"}"}</span></p>
        <div className="mt-2 space-y-0.5">
          {pairs.map((p, i) => (
            <p key={i} className="text-emerald-300">clave=<span className="text-green-300">{p.k}</span>, valor=<span className="text-amber-300">{p.v}</span></p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Demo: paso por valor vs referencia ────────────────────────────
function PasoDemo() {
  const [tipo, setTipo] = useState("valor");
  const [ran, setRan]   = useState(false);

  const reset = () => setRan(false);

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="text-rose-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Valor vs Referencia</p>
      <div className="flex gap-2 mb-5">
        {["valor", "referencia"].map((t) => (
          <button key={t} onClick={() => { setTipo(t); reset(); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono capitalize
              ${tipo === t ? "border-rose-400 bg-rose-400/20 text-rose-300"
                          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            Paso por {t}
          </button>
        ))}
      </div>

      {tipo === "valor" ? (
        <>
          <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm mb-4" style={{ fontFamily: "monospace", lineHeight: 1.9 }}>
            <p><span className="text-emerald-400">n</span><span className="text-white"> = 10</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(</span><span className="text-violet-400">doblar</span><span className="text-white">(n))</span><span className="text-gray-500 ml-2">→ </span><span className="text-amber-300">20</span><span className="text-gray-500"> (copia modificada)</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(n)</span><span className="text-gray-500 ml-11">→ </span><span className="text-emerald-300">10</span><span className="text-gray-500"> (original intacto ✅)</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Variable original (n)</p>
              <p className="text-3xl font-mono font-bold text-emerald-300">{ran ? 10 : 10}</p>
              <p className="text-xs text-gray-600 mt-1">nunca cambia</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Copia dentro de doblar()</p>
              <p className="text-3xl font-mono font-bold text-amber-300">{ran ? 20 : "?"}</p>
              <p className="text-xs text-gray-600 mt-1">se modifica localmente</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm mb-4" style={{ fontFamily: "monospace", lineHeight: 1.9 }}>
            <p><span className="text-emerald-400">lista</span><span className="text-white"> = [1, 2, 3, 4]</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(</span><span className="text-violet-400">doblar_valores</span><span className="text-white">(lista))</span><span className="text-gray-500"> → </span><span className="text-amber-300">[2, 4, 6, 8]</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(lista)</span><span className="text-gray-500 ml-18"> → </span><span className="text-rose-300">[2, 4, 6, 8]</span><span className="text-gray-500"> ⚠️ original modificado</span></p>
            <p className="mt-2 text-gray-500"># Solución: pasar copia con [:]</p>
            <p><span className="text-violet-400">doblar_valores</span><span className="text-white">(lista</span><span className="text-rose-400">[:]</span><span className="text-white">)</span><span className="text-gray-500"> → original se preserva ✅</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Sin copia lista</p>
              <p className="text-rose-300 font-mono font-bold">{ran ? "[2, 4, 6, 8]" : "[1, 2, 3, 4]"}</p>
              <p className="text-xs text-rose-600 mt-1">⚠️ original modificado</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Con copia lista[:]</p>
              <p className="text-emerald-300 font-mono font-bold">[1, 2, 3, 4]</p>
              <p className="text-xs text-emerald-600 mt-1">✅ original intacto</p>
            </div>
          </div>
        </>
      )}

      <button onClick={() => setRan(!ran)}
        className="mt-4 text-xs px-4 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer">
        {ran ? "↺ Reset" : "▶ Ejecutar función"}
      </button>
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
    indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-300" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300" },
    sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-300" },
    amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-300" },
    rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-300" },
  };
  const c = map[color] || map.indigo;
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
export default function Funciones({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-amber-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-indigo-400" style={{ fontFamily: "monospace" }}>Funciones</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#6366f1", color: "#6366f1", fontFamily: "monospace" }}>
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Funciones{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #10b981, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>en Python</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Reutiliza código con <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">def</code> y <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">return</code>.
            Aprende parámetros opcionales, múltiples returns,
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">*args</code> y
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded">**kwargs</code>.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#def",         label: "⚙️ def / return" },
            { href: "#docstrings",  label: "📝 Docstrings" },
            { href: "#parametros",  label: "🎛️ Parámetros" },
            { href: "#multreturn",  label: "🔀 Múltiples return" },
            { href: "#valorref",    label: "📦 Valor vs Referencia" },
            { href: "#args",        label: "⭐ *args" },
            { href: "#kwargs",      label: "🔑 **kwargs" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ SECCIÓN 1 — def / return ══ */}
        <section id="def" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="⚙️" title="def y return" color="#6366f1" />
          <p className="text-gray-400 mb-5">
            Las funciones permiten <strong className="text-white">reutilizar código</strong> sin repetirlo.
            Se definen con <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">def</code> y devuelven un valor con <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">return</code>.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Sintaxis básica</p>
            <p><span className="text-violet-400">def</span><span className="text-emerald-400"> nombre_funcion</span><span className="text-white">(param1, param2):</span></p>
            <p><span className="ml-8 text-white">bloque de código</span></p>
            <p><span className="ml-8 text-sky-400">return</span><span className="text-white"> resultado</span></p>
          </CodeBlock>
          <CodeBlock>
            <p className="text-gray-500">import math as mt</p>
            <p className="mt-1"><span className="text-violet-400">def</span><span className="text-emerald-400"> pitagoras</span><span className="text-white">(a, b):</span></p>
            <p><span className="ml-8 text-green-300">"""Dado los catetos, devuelve la hipotenusa"""</span></p>
            <p><span className="ml-8 text-emerald-400">c</span><span className="text-white"> = mt.</span><span className="text-sky-400">sqrt</span><span className="text-white">(a**</span><span className="text-amber-300">2</span><span className="text-white"> + b**</span><span className="text-amber-300">2</span><span className="text-white">)</span></p>
            <p><span className="ml-8 text-sky-400">return</span><span className="text-white"> c</span></p>
          </CodeBlock>
          <div className="mb-4"><PitagorasDemo /></div>
          <Tip color="indigo">
            Python no requiere declarar el tipo de los parámetros. Si un número puede elevarse al cuadrado, la función funciona igual para <code>int</code> o <code>float</code>.
          </Tip>
        </section>

        {/* ══ SECCIÓN 2 — Docstrings ══ */}
        <section id="docstrings" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="📝" title="Docstrings" color="#10b981" />
          <p className="text-gray-400 mb-5">
            Un <strong className="text-white">docstring</strong> es el string en la primera línea del cuerpo de una función.
            Sirve como documentación integrada y aparece al usar la ayuda interactiva.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-300 text-xs font-bold mb-3">✅ Con docstring</p>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.9 }}>
                <p><span className="text-violet-400">def</span><span className="text-emerald-400"> pitagoras</span><span className="text-white">(a, b):</span></p>
                <p><span className="ml-6 text-green-300">"""</span></p>
                <p><span className="ml-6 text-green-300">Dado los catetos, devuelve</span></p>
                <p><span className="ml-6 text-green-300">el valor de la hipotenusa</span></p>
                <p><span className="ml-6 text-green-300">"""</span></p>
                <p><span className="ml-6 text-white">...</span></p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-700/40 bg-gray-700/5 p-4">
              <p className="text-gray-500 text-xs font-bold mb-3">❌ Sin docstring</p>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.9 }}>
                <p><span className="text-violet-400">def</span><span className="text-emerald-400"> pitagoras</span><span className="text-white">(a, b):</span></p>
                <p><span className="ml-6 text-white">...</span></p>
                <p className="mt-6 text-gray-600">&nbsp;</p>
              </div>
            </div>
          </div>
          <Tip color="emerald">
            Los docstrings son <strong>opcionales pero muy recomendados</strong>. A diferencia de los comentarios (<code>#</code>), se muestran en la ayuda interactiva y pueden generar documentación automática.
          </Tip>
        </section>

        {/* ══ SECCIÓN 3 — Parámetros ══ */}
        <section id="parametros" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="🎛️" title="Parámetros opcionales (default)" color="#8b5cf6" />
          <p className="text-gray-400 mb-5">
            Los parámetros pueden tener <strong className="text-white">valores por defecto</strong>. Si no se pasan al llamar la función, se usa el valor default.
          </p>
          <CodeBlock>
            <p><span className="text-violet-400">def</span><span className="text-emerald-400"> saludo</span><span className="text-white">(nombre, saludo=</span><span className="text-green-300">'Hola'</span><span className="text-white">, despedida=</span><span className="text-rose-300">False</span><span className="text-white">):</span></p>
            <p><span className="ml-8 text-violet-400">if</span><span className="text-white"> despedida:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">'Hasta luego {}'</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(nombre))</span></p>
            <p><span className="ml-8 text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">'{} {}, ¿Cómo estás?'</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(saludo, nombre))</span></p>
          </CodeBlock>
          <div className="mb-4"><SaludoDemo /></div>
          <Tip color="indigo">
            Los parámetros con default <strong>siempre van al final</strong> de la lista de parámetros, después de los obligatorios.
          </Tip>
        </section>

        {/* ══ SECCIÓN 4 — Múltiples return ══ */}
        <section id="multreturn" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="🔀" title="Múltiples return" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            Una función puede tener varios <code className="text-sky-400 bg-sky-500/10 px-1 rounded">return</code>.
            El <strong className="text-white">primero en ejecutarse</strong> determina el valor devuelto y termina la función.
          </p>
          <CodeBlock>
            <p><span className="text-violet-400">def</span><span className="text-emerald-400"> signo</span><span className="text-white">(valor):</span></p>
            <p><span className="ml-8 text-violet-400">if</span><span className="text-white"> valor &gt; </span><span className="text-amber-300">0</span><span className="text-white">:   VAL = </span><span className="text-green-300">"El valor es positivo"</span></p>
            <p><span className="ml-8 text-purple-400">elif</span><span className="text-white"> valor == </span><span className="text-amber-300">0</span><span className="text-white">: VAL = </span><span className="text-green-300">"El valor es nulo"</span></p>
            <p><span className="ml-8 text-sky-400">else</span><span className="text-white">:          VAL = </span><span className="text-green-300">"El valor es negativo"</span></p>
            <p><span className="ml-8 text-sky-400">return</span><span className="text-white"> VAL</span></p>
          </CodeBlock>
          <div className="mb-4"><SignoDemo /></div>
        </section>

        {/* ══ SECCIÓN 5 — Valor vs Referencia ══ */}
        <section id="valorref" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "200ms" }}>
          <SectionHeader icon="📦" title="Paso por Valor vs Referencia" color="#f43f5e" />
          <p className="text-gray-400 mb-5">
            El comportamiento depende del tipo de dato enviado:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { tipo: "Por Valor",     tipos: "int, float, str, bool",    desc: "Se crea una copia. El original NO se modifica.",  color: "#10b981", ok: true },
              { tipo: "Por Referencia",tipos: "list, dict, set",          desc: "Se trabaja directo. El original SÍ se modifica.", color: "#f43f5e", ok: false },
            ].map((r) => (
              <div key={r.tipo} className="rounded-xl border p-4"
                style={{ borderColor: `${r.color}30`, background: `${r.color}08` }}>
                <p className="font-bold text-sm mb-1" style={{ color: r.color }}>{r.ok ? "✅" : "⚠️"} {r.tipo}</p>
                <code className="text-xs text-gray-400 block mb-2">{r.tipos}</code>
                <p className="text-gray-400 text-xs">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="mb-4"><PasoDemo /></div>
          <Tip color="rose">
            Para evitar que una función modifique una lista original, pásale una copia con <code>lista[:]</code> o <code>lista.copy()</code>.
          </Tip>
        </section>

        {/* ══ SECCIÓN 6 — *args ══ */}
        <section id="args" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="⭐" title="Parámetros arbitrarios — *args" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded">*args</code> permite pasar un <strong className="text-white">número variable de argumentos posicionales</strong>.
            Los recibe como una <code className="text-amber-400 bg-amber-500/10 px-1 rounded">tupla</code>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {[
              { label: "El * indica el tipo", detail: "El nombre 'args' es convención, lo importante es el *" },
              { label: "Recibe una tupla",    detail: "Los argumentos llegan empaquetados como tupla" },
              { label: "Es opcional",         detail: "Puedes llamar la función con o sin argumentos" },
              { label: "Posicional",          detail: "El valor depende de la posición, no del nombre" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
                <p className="text-sky-300 text-xs font-bold mb-1">✓ {item.label}</p>
                <p className="text-gray-500 text-xs">{item.detail}</p>
              </div>
            ))}
          </div>
          <CodeBlock>
            <p><span className="text-violet-400">def</span><span className="text-emerald-400"> promedio</span><span className="text-white">(</span><span className="text-sky-400">*args</span><span className="text-white">):</span></p>
            <p><span className="ml-8 text-emerald-400">prom</span><span className="text-white"> = </span><span className="text-amber-300">0</span></p>
            <p><span className="ml-8 text-violet-400">for</span><span className="text-white"> arg </span><span className="text-violet-400">in</span><span className="text-white"> args:</span></p>
            <p><span className="ml-16 text-emerald-400">prom</span><span className="text-white"> += arg</span></p>
            <p><span className="ml-8 text-emerald-400">prom</span><span className="text-white"> = prom / </span><span className="text-violet-400">len</span><span className="text-white">(args)</span></p>
            <p><span className="ml-8 text-sky-400">return</span><span className="text-white"> prom</span></p>
          </CodeBlock>
          <div className="mb-4"><ArgsDemo /></div>
          <Tip color="sky">
            Puedes pasar <strong>cualquier cantidad</strong> de números y la función siempre calculará el promedio correctamente, porque <code>len(args)</code> se ajusta automáticamente.
          </Tip>
        </section>

        {/* ══ SECCIÓN 7 — **kwargs ══ */}
        <section id="kwargs" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="🔑" title="Parámetros por nombre — **kwargs" color="#f59e0b" />
          <p className="text-gray-400 mb-5">
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded">**kwargs</code> recibe un número variable de argumentos <strong className="text-white">clave-valor</strong>.
            Los agrupa en un <code className="text-amber-400 bg-amber-500/10 px-1 rounded">diccionario</code>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-amber-300 text-xs font-bold mb-2">*args → tupla</p>
              <code className="text-sm text-gray-300 block" style={{ fontFamily: "monospace" }}>
                f(1, 2, 3)<br />
                <span className="text-gray-500">→ args = (1, 2, 3)</span>
              </code>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4">
              <p className="text-amber-300 text-xs font-bold mb-2">**kwargs → diccionario</p>
              <code className="text-sm text-gray-300 block" style={{ fontFamily: "monospace" }}>
                f(n=10, s="hola")<br />
                <span className="text-gray-500">→ kwargs = {"{"}"n":10, "s":"hola"{"}"}</span>
              </code>
            </div>
          </div>
          <CodeBlock>
            <p><span className="text-violet-400">def</span><span className="text-emerald-400"> argumentos</span><span className="text-white">(</span><span className="text-amber-400">**kwargs</span><span className="text-white">):</span></p>
            <p><span className="ml-8 text-violet-400">for</span><span className="text-white"> kwarg </span><span className="text-violet-400">in</span><span className="text-white"> kwargs:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">'clave={}, valor={}'</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(kwarg, kwargs[kwarg]))</span></p>
            <p className="mt-1 text-gray-500"># Llamada:</p>
            <p><span className="text-violet-400">argumentos</span><span className="text-white">(n=</span><span className="text-amber-300">10</span><span className="text-white">, l=[1,2,3,4], s=</span><span className="text-green-300">'hola'</span><span className="text-white">)</span></p>
          </CodeBlock>
          <div className="mb-4"><KwargsDemo /></div>
          <Tip color="amber">
            Puedes combinar ambos: <code>def f(*args, **kwargs)</code>. Los <code>*args</code> van primero (posicionales), luego los <code>**kwargs</code> (por nombre).
          </Tip>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "320ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "def f(p):",              desc: "Define una función con parámetro obligatorio p.",              color: "#6366f1" },
              { code: "def f(p, opt='val'):",   desc: "Parámetro opcional con valor default 'val'.",                color: "#8b5cf6" },
              { code: "return valor",            desc: "Devuelve un valor y termina la función.",                    color: "#0ea5e9" },
              { code: "def f(*args):",           desc: "Acepta cualquier número de argumentos posicionales (tupla).", color: "#0ea5e9" },
              { code: "def f(**kwargs):",        desc: "Acepta cualquier número de argumentos clave-valor (dict).",  color: "#f59e0b" },
              { code: "lista[:]",               desc: "Pasa una copia de la lista para evitar modificar el original.", color: "#f43f5e" },
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
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · Funciones</span>
        </div>

      </div>
    </div>
  );
}