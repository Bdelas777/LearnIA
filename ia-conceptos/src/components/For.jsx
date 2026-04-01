// BucleFor.jsx — Módulo: Bucle for en Python
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

import { useState } from "react";

// ── Demo: while vs for ────────────────────────────────────────────
function WhileVsForDemo() {
  const lista = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [modo, setModo]   = useState("for");
  const [step, setStep]   = useState(-1);
  const [running, setRun] = useState(false);

  const run = () => {
    setStep(-1);
    setRun(true);
    let i = 0;
    const iv = setInterval(() => {
      setStep(i);
      i++;
      if (i >= lista.length) {
        clearInterval(iv);
        setTimeout(() => { setRun(false); setStep(-1); }, 800);
      }
    }, 350);
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — while vs for</p>

      {/* Toggle */}
      <div className="flex gap-2 mb-5">
        {["while", "for"].map((m) => (
          <button key={m} onClick={() => setModo(m)}
            className={`text-xs px-4 py-1.5 rounded-lg border transition-all duration-200 font-mono
              ${modo === m
                ? "border-emerald-400 bg-emerald-400/20 text-emerald-300"
                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {m}
          </button>
        ))}
      </div>

      {/* Código activo */}
      <div className="bg-black/40 rounded-xl border border-white/10 p-4 mb-5 text-sm"
        style={{ fontFamily: "monospace", lineHeight: 2 }}>
        {modo === "while" ? (
          <>
            <p><span className="text-emerald-400">lista</span><span className="text-white"> = [0,1,2,...,9]</span></p>
            <p><span className="text-emerald-400">i</span><span className="text-white"> = </span><span className="text-amber-300">0</span></p>
            <p><span className="text-sky-400">while</span><span className="text-white">(i &lt; </span><span className="text-violet-400">len</span><span className="text-white">(lista)):</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(lista[i])</span></p>
            <p><span className="ml-8 text-emerald-400">i</span><span className="text-white"> += 1</span></p>
          </>
        ) : (
          <>
            <p><span className="text-emerald-400">lista</span><span className="text-white"> = [0,1,2,...,9]</span></p>
            <p className="mt-1"><span className="text-emerald-400">for</span><span className="text-white"> elemento </span><span className="text-emerald-400">in</span><span className="text-white"> lista:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(elemento)</span></p>
          </>
        )}
      </div>

      {/* Visualización */}
      <div className="flex flex-wrap gap-2 mb-4">
        {lista.map((v, i) => (
          <div key={i} className={`rounded-lg border px-3 py-2 text-center transition-all duration-300
            ${step === i  ? "border-yellow-400 bg-yellow-400/20 scale-110"
            : step > i    ? "border-emerald-500/30 bg-emerald-500/10 opacity-50"
                          : "border-white/10 bg-white/5"}`}>
            {modo === "while" && <p className="text-xs text-gray-600">[{i}]</p>}
            <p className={`font-mono font-bold ${step === i ? "text-yellow-300" : "text-gray-300"}`}>{v}</p>
          </div>
        ))}
      </div>

      {step >= 0 && (
        <p className="font-mono text-sm text-emerald-300 animate-pulse mb-3">
          → print(<span className="text-amber-300">{lista[step]}</span>)
        </p>
      )}

      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all
          ${running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando..." : `▶ Ejecutar ${modo}`}
      </button>
    </div>
  );
}

// ── Demo: List Comprehension builder ─────────────────────────────
function ComprehensionDemo() {
  const [exp, setExp]   = useState("i**2");
  const [end, setEnd]   = useState(11);
  const expMap = {
    "i**2":  (i) => i ** 2,
    "i*2":   (i) => i * 2,
    "i":     (i) => i,
    "i**3":  (i) => i ** 3,
  };
  const fn     = expMap[exp] || ((i) => i);
  const result = Array.from({ length: end }, (_, i) => fn(i));

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — List Comprehension</p>

      {/* Builder */}
      <div className="flex flex-wrap items-center gap-2 mb-5 font-mono text-sm">
        <span className="text-white">[</span>
        <select value={exp} onChange={(e) => setExp(e.target.value)}
          className="bg-violet-500/20 border border-violet-500/40 text-violet-300 rounded-lg px-2 py-1 outline-none text-xs cursor-pointer">
          {Object.keys(expMap).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <span className="text-emerald-400 font-bold">for</span>
        <span className="text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-lg">i</span>
        <span className="text-emerald-400 font-bold">in</span>
        <span className="text-sky-400">range(</span>
        <input type="number" min={1} max={15} value={end}
          onChange={(e) => setEnd(Math.min(15, Math.max(1, Number(e.target.value))))}
          className="bg-sky-500/20 border border-sky-500/40 text-sky-300 rounded-lg px-2 py-1 w-14 outline-none text-center text-xs" />
        <span className="text-sky-400">)</span>
        <span className="text-white">]</span>
      </div>

      {/* Resultado */}
      <div className="flex flex-wrap gap-2 mb-3">
        {result.map((v, i) => (
          <div key={i} className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center">
            <p className="text-xs text-gray-500">{exp.replace("i", i)}</p>
            <p className="text-amber-300 font-mono font-bold text-sm">{v}</p>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs text-gray-500">
        → [<span className="text-amber-300">{result.slice(0, 6).join(", ")}{result.length > 6 ? ", ..." : ""}</span>]
      </p>
    </div>
  );
}

// ── Demo: break en for ────────────────────────────────────────────
function BreakDemo() {
  const listaBase = [3, 6, 9, 0, 15, -1, 8, 2];
  const [lista, setLista]   = useState(listaBase);
  const [step, setStep]     = useState(-1);
  const [stopped, setStopped] = useState(false);
  const [running, setRun]   = useState(false);
  const [msg, setMsg]       = useState("");

  const run = () => {
    setStep(-1); setStopped(false); setMsg(""); setRun(true);
    let i = 0;
    const iv = setInterval(() => {
      const el = lista[i];
      setStep(i);
      if (el === 0) {
        setMsg("La lista tiene un valor nulo → break");
        setStopped(true);
        clearInterval(iv);
        setRun(false);
        return;
      }
      i++;
      if (i >= lista.length) {
        clearInterval(iv);
        setMsg("La lista no tiene algún valor nulo");
        setRun(false);
        setTimeout(() => { setStep(-1); setMsg(""); }, 1500);
      }
    }, 500);
  };

  const toggle = (i) => {
    const next = [...lista];
    next[i] = next[i] === 0 ? 3 : 0;
    setLista(next); setStep(-1); setStopped(false); setMsg("");
  };

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="text-rose-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — break en for</p>

      <p className="text-gray-400 text-xs mb-4">Haz clic en un elemento para convertirlo en <span className="text-amber-300 font-mono">0</span> (valor nulo) y observa cómo el <code className="text-rose-400">break</code> detiene el bucle.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {lista.map((v, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`rounded-lg border px-3 py-2 text-center transition-all duration-300 cursor-pointer
              ${v === 0              ? "border-rose-500/60 bg-rose-500/20"
              : step === i && !stopped ? "border-yellow-400 bg-yellow-400/20 scale-110"
              : step > i && !stopped   ? "border-emerald-500/30 bg-emerald-500/10 opacity-60"
                                       : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
            <p className={`font-mono font-bold text-sm ${
              v === 0 ? "text-rose-300"
              : step === i && !stopped ? "text-yellow-300"
              : "text-gray-300"}`}>{v}</p>
          </button>
        ))}
      </div>

      {msg && (
        <p className={`font-mono text-sm mb-3 animate-pulse ${stopped ? "text-rose-300" : "text-emerald-300"}`}>
          → {msg}
        </p>
      )}

      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all
          ${running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer"}`}>
        {running ? "⏳ Iterando..." : "▶ Ejecutar for con break"}
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
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300" },
    amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-300" },
    rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-300" },
    sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-300" },
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
export default function BucleFor({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        code { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-rose-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-emerald-400" style={{ fontFamily: "monospace" }}>Bucle for</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#10b981", color: "#10b981", fontFamily: "monospace" }}>
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            El Bucle{" "}
            <span style={{
              background: "linear-gradient(135deg, #10b981, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>for</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            La herramienta más usada para recorrer listas. Aprende su sintaxis,
            cómo usar <code className="text-rose-400 bg-rose-500/10 px-1 rounded">break</code> para
            interrumpir y la forma abreviada llamada <code className="text-amber-400 bg-amber-500/10 px-1 rounded">list comprehension</code>.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#sintaxis",       label: "📐 Sintaxis" },
            { href: "#while-vs-for",   label: "⚔️ while vs for" },
            { href: "#comprehension",  label: "⚡ List Comprehension" },
            { href: "#break",          label: "🛑 break" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══════════════════════════════════════
            SECCIÓN 1 — Sintaxis
        ══════════════════════════════════════ */}
        <section id="sintaxis" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📐" title="Sintaxis del bucle for" color="#10b981" />
          <p className="text-gray-400 mb-5">
            El <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">for</code> recorre cada elemento de un iterable (lista, string, range…).
            Cuando termina de recorrerlos, el ciclo finaliza automáticamente.
            A diferencia del <code className="text-sky-400 bg-sky-500/10 px-1 rounded">while</code>,
            <strong className="text-white"> no puede crear bucles infinitos</strong>.
          </p>

          <CodeBlock>
            <p className="text-gray-500"># Sintaxis</p>
            <p><span className="text-emerald-400">for</span><span className="text-white"> variable </span><span className="text-emerald-400">in</span><span className="text-white"> conjunto_iterable:</span></p>
            <p><span className="ml-8 text-white">bloque de sentencias</span></p>
          </CodeBlock>

          {/* Anatomía visual */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-5">
            <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🧩 Anatomía</p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm mb-4">
              <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2 py-1 rounded">for</span>
              <span className="text-amber-300 bg-amber-500/15 px-2 py-1 rounded">elemento</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2 py-1 rounded">in</span>
              <span className="text-sky-300 bg-sky-500/15 px-2 py-1 rounded">lista</span>
              <span className="text-white">:</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mb-1" />
                <p className="text-emerald-300 font-bold">for / in</p>
                <p className="text-gray-500">Palabras clave del bucle</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-amber-400 rounded-full mx-auto mb-1" />
                <p className="text-amber-300 font-bold">elemento</p>
                <p className="text-gray-500">Variable que toma cada valor</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-sky-400 rounded-full mx-auto mb-1" />
                <p className="text-sky-300 font-bold">lista</p>
                <p className="text-gray-500">Colección a recorrer</p>
              </div>
            </div>
          </div>

          <Tip color="emerald">
            La variable del <code>for</code> (aquí <code>elemento</code>) toma el valor de cada ítem en cada vuelta. Puedes llamarla como quieras.
          </Tip>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 2 — while vs for
        ══════════════════════════════════════ */}
        <section id="while-vs-for" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="⚔️" title="while vs for — mismo resultado, menos código" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            Ambos bucles pueden recorrer una lista, pero el <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">for</code> requiere <strong className="text-white">menos líneas</strong> y es más legible.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sky-300 font-bold text-sm font-mono">while</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">5 líneas</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.9 }}>
                <p><span className="text-emerald-400">lista</span><span className="text-white"> = [0..9]</span></p>
                <p><span className="text-emerald-400">i</span><span className="text-white"> = 0</span></p>
                <p><span className="text-sky-400">while</span><span className="text-white">(i &lt; </span><span className="text-violet-400">len</span><span className="text-white">(lista)):</span></p>
                <p><span className="ml-6 text-violet-400">print</span><span className="text-white">(lista[i])</span></p>
                <p><span className="ml-6 text-emerald-400">i</span><span className="text-white"> += 1</span></p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-300 font-bold text-sm font-mono">for</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">2 líneas ✨</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.9 }}>
                <p><span className="text-emerald-400">lista</span><span className="text-white"> = [0..9]</span></p>
                <p className="mt-2"><span className="text-emerald-400">for</span><span className="text-white"> elemento </span><span className="text-emerald-400">in</span><span className="text-white"> lista:</span></p>
                <p><span className="ml-6 text-violet-400">print</span><span className="text-white">(elemento)</span></p>
              </div>
            </div>
          </div>

          <WhileVsForDemo />
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 3 — List Comprehension
        ══════════════════════════════════════ */}
        <section id="comprehension" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="⚡" title="List Comprehension" color="#f59e0b" />
          <p className="text-gray-400 mb-5">
            Una forma <strong className="text-white">compacta y elegante</strong> de crear listas con un bucle <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">for</code> en una sola línea.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs text-gray-500 mb-3 font-bold">FORMA LARGA</p>
              <CodeBlock>
                <p><span className="text-emerald-400">numeros</span><span className="text-white"> = []</span></p>
                <p><span className="text-emerald-400">for</span><span className="text-white"> i </span><span className="text-emerald-400">in</span><span className="text-white"> </span><span className="text-sky-400">range</span><span className="text-white">(11):</span></p>
                <p><span className="ml-6 text-emerald-400">numeros</span><span className="text-white">.</span><span className="text-sky-400">append</span><span className="text-white">(i**2)</span></p>
              </CodeBlock>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs text-amber-400 mb-3 font-bold">FORMA ABREVIADA ✨</p>
              <CodeBlock>
                <p><span className="text-emerald-400">numeros</span><span className="text-white"> = [</span><span className="text-violet-300">i**2</span><span className="text-white"> </span><span className="text-emerald-400">for</span><span className="text-white"> i </span><span className="text-emerald-400">in</span><span className="text-white"> </span><span className="text-sky-400">range</span><span className="text-white">(11)]</span></p>
                <p className="text-gray-500">→ [0, 1, 4, 9, 16, 25 ...]</p>
              </CodeBlock>
            </div>
          </div>

          <ComprehensionDemo />

          <div className="mt-4">
            <Tip color="amber">
              Las <strong>list comprehensions</strong> son más eficientes y pythónicas que el bucle largo. Úsalas cuando la lógica sea simple y quepa en una línea.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 4 — break en for
        ══════════════════════════════════════ */}
        <section id="break" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="🛑" title="break en el bucle for" color="#f43f5e" />
          <p className="text-gray-400 mb-5">
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded">break</code> interrumpe el bucle inmediatamente cuando se encuentra una condición.
            El bloque <code className="text-sky-400 bg-sky-500/10 px-1 rounded">else</code> del <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">for</code> se ejecuta solo si el bucle terminó <strong className="text-white">sin</strong> un <code className="text-rose-400 bg-rose-500/10 px-1 rounded">break</code>.
          </p>

          <CodeBlock>
            <p><span className="text-emerald-400">lista</span><span className="text-white"> = [0, 3, 6, 9, 3, 15, -1, 8, 2]</span></p>
            <p className="mt-1"><span className="text-emerald-400">for</span><span className="text-white"> elemento </span><span className="text-emerald-400">in</span><span className="text-white"> lista:</span></p>
            <p><span className="ml-8 text-violet-400">if</span><span className="text-white"> elemento == </span><span className="text-amber-300">0</span><span className="text-white">:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"La lista tiene un valor nulo"</span><span className="text-white">)</span></p>
            <p><span className="ml-16 text-rose-400">break</span><span className="text-gray-500 ml-2"># detiene el for</span></p>
            <p><span className="ml-8 text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(elemento)</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:</span><span className="text-gray-500 ml-2"># solo corre si no hubo break</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"La lista no tiene algún valor nulo"</span><span className="text-white">)</span></p>
          </CodeBlock>

          <BreakDemo />

          <div className="mt-4">
            <Tip color="rose">
              El <code>else</code> del <code>for</code> es especial: <strong>solo se ejecuta si el bucle completó todas las iteraciones sin encontrar un <code>break</code></strong>. Perfecto para búsquedas.
            </Tip>
          </div>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "for x in lista:",        desc: "Recorre cada elemento de lista, asignándolo a x.",              color: "#10b981" },
              { code: "for i in range(n):",      desc: "Itera n veces con i tomando valores 0, 1, 2 … n-1.",           color: "#0ea5e9" },
              { code: "break",                   desc: "Sale del bucle inmediatamente sin terminar las iteraciones.",  color: "#f43f5e" },
              { code: "[exp for x in lista]",    desc: "List comprehension: crea una lista aplicando exp a cada x.",  color: "#f59e0b" },
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
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · Bucle for</span>
        </div>

      </div>
    </div>
  );
}