// ElementosControl.jsx — Módulo: Elementos de Control en Python
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

import { useState } from "react";

// ── Demo interactiva: if / elif / else ────────────────────────────
function NotaDemo() {
  const [nota, setNota] = useState(8);

  const evaluar = (n) => {
    if (n >= 9)  return { label: "Sobresaliente", color: "emerald", emoji: "🏆" };
    if (n >= 7)  return { label: "Distinguido",   color: "sky",     emoji: "⭐" };
    if (n >= 5)  return { label: "Suficiente",    color: "amber",   emoji: "✅" };
    return        { label: "Deficiente",          color: "rose",    emoji: "❌" };
  };

  const r = evaluar(nota);
  const colorMap = {
    emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-300", track: "#10b981" },
    sky:     { bg: "bg-sky-500/15",     border: "border-sky-500/40",     text: "text-sky-300",     track: "#0ea5e9" },
    amber:   { bg: "bg-amber-500/15",   border: "border-amber-500/40",   text: "text-amber-300",   track: "#f59e0b" },
    rose:    { bg: "bg-rose-500/15",    border: "border-rose-500/40",    text: "text-rose-300",    track: "#f43f5e" },
  };
  const c = colorMap[r.color];

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo interactiva — Calificador de notas</p>

      <div className="flex items-center gap-4 mb-5">
        <span className="text-gray-400 text-sm w-28">nota_alumno =</span>
        <input type="range" min={0} max={10} value={nota}
          onChange={(e) => setNota(Number(e.target.value))}
          className="flex-1 accent-violet-500" />
        <span className="text-amber-300 font-mono font-bold text-2xl w-8 text-center">{nota}</span>
      </div>

      <div className={`rounded-xl border ${c.border} ${c.bg} p-4 flex items-center gap-4 transition-all duration-300`}>
        <span className="text-3xl">{r.emoji}</span>
        <div>
          <p className={`font-bold text-lg ${c.text}`}>{r.label}</p>
          <p className="text-gray-500 text-xs font-mono">
            {nota >= 9 ? "nota >= 9" : nota >= 7 ? "nota >= 7" : nota >= 5 ? "nota >= 5" : "nota < 5"}
          </p>
        </div>
      </div>

      <div className="mt-4 bg-black/40 rounded-xl border border-white/10 p-4 text-sm" style={{ fontFamily: "monospace", lineHeight: 1.9 }}>
        <p className={nota >= 9 ? "text-emerald-300 font-bold" : "text-gray-500"}><span className="text-violet-400">if</span> nota_alumno &gt;= <span className="text-amber-300">9</span>:  <span className="text-gray-600">→ "Sobresaliente"</span></p>
        <p className={nota >= 7 && nota < 9 ? "text-sky-300 font-bold" : "text-gray-500"}><span className="text-violet-400">elif</span> nota_alumno &gt;= <span className="text-amber-300">7</span>: <span className="text-gray-600">→ "Distinguido"</span></p>
        <p className={nota >= 5 && nota < 7 ? "text-amber-300 font-bold" : "text-gray-500"}><span className="text-violet-400">elif</span> nota_alumno &gt;= <span className="text-amber-300">5</span>: <span className="text-gray-600">→ "Suficiente"</span></p>
        <p className={nota < 5 ? "text-rose-300 font-bold" : "text-gray-500"}><span className="text-violet-400">else</span>: <span className="text-gray-600">→ "Deficiente"</span></p>
      </div>
    </div>
  );
}

// ── Demo interactiva: while ───────────────────────────────────────
function WhileDemo() {
  const listaInicial = [3, 5, 6, 2, 1, 3, 5];
  const [step, setStep]   = useState(-1);
  const [running, setRun] = useState(false);

  const run = () => {
    setStep(-1);
    setRun(true);
    let i = 0;
    const interval = setInterval(() => {
      setStep(i);
      i++;
      if (i >= listaInicial.length) {
        clearInterval(interval);
        setTimeout(() => { setRun(false); setStep(-1); }, 1000);
      }
    }, 600);
  };

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Bucle while</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {listaInicial.map((val, i) => (
          <div key={i} className={`rounded-lg border px-3 py-2 text-center transition-all duration-300 ${
            step === i ? "border-yellow-400 bg-yellow-400/20 scale-110" :
            step > i   ? "border-emerald-500/40 bg-emerald-500/10 opacity-60" :
                         "border-sky-500/30 bg-sky-500/10"}`}>
            <p className="text-xs text-gray-500">[{i}]</p>
            <p className={`font-bold font-mono ${step === i ? "text-yellow-300" : "text-sky-200"}`}>{val}</p>
          </div>
        ))}
      </div>

      {step >= 0 && (
        <div className="bg-black/40 rounded-lg px-4 py-2 mb-3 font-mono text-sm text-emerald-300 animate-pulse">
          → El elemento [{step}] de la lista es <span className="text-amber-300">{listaInicial[step]}</span>
        </div>
      )}

      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200
          ${running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                    : "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando..." : "▶ Ejecutar while"}
      </button>
    </div>
  );
}

// ── Demo interactiva: for ─────────────────────────────────────────
function ForDemo() {
  const [tipo, setTipo]   = useState("lista");
  const [step, setStep]   = useState(-1);
  const [running, setRun] = useState(false);

  const datasets = {
    lista:    { data: [0,1,2,3,4,5,6,7,8,9], label: "lista", render: (v) => v },
    cuadrados:{ data: [1,4,9,16,25,36,49,64,81,100], label: "cuadrados (i**2)", render: (v) => v },
    nombres:  { data: ["Pedro","Carlos","Juan","María","Luisa"], label: "nombres", render: (v) => `"${v}"` },
  };

  const run = () => {
    const d = datasets[tipo].data;
    setStep(-1);
    setRun(true);
    let i = 0;
    const interval = setInterval(() => {
      setStep(i);
      i++;
      if (i >= d.length) {
        clearInterval(interval);
        setTimeout(() => { setRun(false); setStep(-1); }, 800);
      }
    }, 400);
  };

  const d = datasets[tipo];

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Bucle for</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(datasets).map((k) => (
          <button key={k} onClick={() => { setTipo(k); setStep(-1); setRun(false); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              tipo === k ? "border-emerald-400 bg-emerald-400/20 text-emerald-300"
                        : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {k}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4 min-h-[52px]">
        {d.data.map((val, i) => (
          <div key={i} className={`rounded-lg border px-3 py-2 text-center transition-all duration-300 ${
            step === i ? "border-yellow-400 bg-yellow-400/20 scale-110" :
            step > i   ? "border-emerald-500/40 bg-emerald-500/10 opacity-60" :
                         "border-emerald-500/30 bg-emerald-500/10"}`}>
            <p className={`font-bold font-mono text-sm ${step === i ? "text-yellow-300" : "text-emerald-200"}`}>
              {d.render(val)}
            </p>
          </div>
        ))}
      </div>

      {step >= 0 && (
        <div className="bg-black/40 rounded-lg px-4 py-2 mb-3 font-mono text-sm text-emerald-300 animate-pulse">
          → elemento = <span className="text-amber-300">{d.render(d.data[step])}</span>
        </div>
      )}

      <div className="bg-black/40 rounded-lg p-3 font-mono text-sm mb-3 text-gray-300">
        <span className="text-violet-400">for </span>
        <span className="text-emerald-400">elemento </span>
        <span className="text-violet-400">in </span>
        <span className="text-white">{d.label}:</span>
        <br />
        <span className="ml-4 text-violet-400">print</span>
        <span className="text-white">(elemento)</span>
      </div>

      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200
          ${running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"}`}>
        {running ? "⏳ Iterando..." : "▶ Ejecutar for"}
      </button>
    </div>
  );
}

// ── Demo: adivinanza ──────────────────────────────────────────────
function AdivinanzaDemo() {
  const [secreto] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [input, setInput]     = useState("");
  const [intentos, setIntentos] = useState([]);
  const [ganado, setGanado]   = useState(false);

  const adivinar = () => {
    const val = parseInt(input);
    if (isNaN(val) || val < 1 || val > 10) return;
    const correcto = val === secreto;
    setIntentos([...intentos, { val, correcto }]);
    if (correcto) setGanado(true);
    setInput("");
  };

  const reset = () => { setIntentos([]); setGanado(false); setInput(""); };

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — while(True): Adivina el número</p>

      {!ganado ? (
        <>
          <p className="text-gray-400 text-sm mb-4">Adivina el número entre <strong className="text-white">1 y 10</strong></p>
          <div className="flex gap-2 mb-4">
            <input type="number" min={1} max={10} value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && adivinar()}
              placeholder="1-10"
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono w-24 outline-none focus:border-amber-500/50" />
            <button onClick={adivinar}
              className="text-xs px-4 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all">
              Intentar
            </button>
          </div>
          {intentos.length > 0 && (
            <div className="space-y-1">
              {intentos.map((t, i) => (
                <p key={i} className={`text-sm font-mono ${t.correcto ? "text-emerald-300" : "text-rose-400"}`}>
                  {t.correcto ? "✅" : "❌"} {t.val} — {t.correcto ? "¡Adivinaste!" : "No adivinaste, prueba otra vez"}
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-emerald-300 font-bold text-lg">¡Excelente, adivinaste!</p>
          <p className="text-gray-400 text-sm mb-4">El número era <span className="text-amber-300 font-bold">{secreto}</span> · Intentos: <span className="text-white">{intentos.length}</span></p>
          <button onClick={reset}
            className="text-xs px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition-all">
            ↺ Jugar de nuevo
          </button>
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
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-300" },
    sky:    { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-300" },
    amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-300" },
    emerald:{ bg: "bg-emerald-500/10",border: "border-emerald-500/20",text: "text-emerald-300" },
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

// ── Página principal ──────────────────────────────────────────────
export default function ElementosControl({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-sky-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[250px] h-[250px] bg-emerald-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily: "monospace" }}>Elementos de Control</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6", fontFamily: "monospace" }}>
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Elementos{" "}
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #0ea5e9, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>de Control</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Controla el flujo de tu programa con condicionales y bucles:
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">if / elif / else</code>
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">while</code>
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">for</code>
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#if",       label: "🔀 if" },
            { href: "#if-else",  label: "↔️ if else" },
            { href: "#elif",     label: "🔁 elif" },
            { href: "#operadores",label:"⚡ Operadores lógicos" },
            { href: "#while",    label: "🔄 while" },
            { href: "#for",      label: "🔃 for" },
            { href: "#range",    label: "📐 range y listas" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══════════════════════════════════════
            SECCIÓN 1 — if
        ══════════════════════════════════════ */}
        <section id="if" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="🔀" title="Sentencia if" color="#8b5cf6" />
          <p className="text-gray-400 mb-5">
            Ejecuta un bloque de código <strong className="text-white">solo si se cumple una condición</strong>.
            La <strong className="text-white">indentación</strong> (espaciado) es obligatoria en Python: define qué pertenece al bloque.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Sintaxis</p>
            <p><span className="text-violet-400">if</span><span className="text-white"> (condicional):</span></p>
            <p><span className="text-white ml-8">bloque de código</span></p>
          </CodeBlock>
          <CodeBlock>
            <p><span className="text-emerald-400">edad_persona</span><span className="text-white"> = </span><span className="text-amber-300">20</span></p>
            <p><span className="text-emerald-400">mayoria_edad</span><span className="text-white"> = </span><span className="text-amber-300">18</span></p>
            <p className="mt-1"><span className="text-violet-400">if</span><span className="text-white"> edad_persona &gt;= mayoria_edad:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">'¡Ya eres mayor de edad!'</span><span className="text-white">)</span></p>
            <p className="text-gray-500 mt-1"># Si edad_persona = 10, no imprime nada</p>
          </CodeBlock>
          <Tip color="violet">
            La <strong>indentación</strong> (4 espacios o 1 tab) le dice a Python qué instrucciones pertenecen al bloque del <code>if</code>. Es obligatoria, no opcional.
          </Tip>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 2 — if else
        ══════════════════════════════════════ */}
        <section id="if-else" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="↔️" title="Sentencia if else" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            El bloque <code className="text-sky-400 bg-sky-500/10 px-1 rounded">else</code> se ejecuta cuando la condición del <code className="text-violet-400 bg-violet-500/10 px-1 rounded">if</code> <strong className="text-white">no se cumple</strong>.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Sintaxis</p>
            <p><span className="text-violet-400">if</span><span className="text-white"> (condicional):</span></p>
            <p><span className="ml-8 text-white">bloque 1</span><span className="text-gray-500 ml-2"># se ejecuta si True</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-8 text-white">bloque 2</span><span className="text-gray-500 ml-2"># se ejecuta si False</span></p>
          </CodeBlock>
          <CodeBlock>
            <p><span className="text-violet-400">if</span><span className="text-white"> edad_persona &gt;= mayoria_edad:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">'¡Ya eres mayor de edad!'</span><span className="text-white">)</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">'Aún eres menor de edad.'</span><span className="text-white">)</span></p>
          </CodeBlock>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 3 — if elif + Demo
        ══════════════════════════════════════ */}
        <section id="elif" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="🔁" title="Sentencia if elif" color="#a855f7" />
          <p className="text-gray-400 mb-5">
            Permite evaluar <strong className="text-white">múltiples condiciones en secuencia</strong>. Cuando una se cumple, ejecuta ese bloque y omite el resto. Si ninguna aplica, ejecuta el <code className="text-sky-400 bg-sky-500/10 px-1 rounded">else</code>.
          </p>
          <CodeBlock>
            <p><span className="text-violet-400">if</span><span className="text-white"> (cond1):   </span><span className="text-gray-500">bloque 1</span></p>
            <p><span className="text-purple-400">elif</span><span className="text-white"> (cond2):  </span><span className="text-gray-500">bloque 2</span></p>
            <p><span className="text-purple-400">elif</span><span className="text-white"> (cond3):  </span><span className="text-gray-500">bloque 3</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:          </span><span className="text-gray-500">bloque 4 (ninguna se cumplió)</span></p>
          </CodeBlock>
          <div className="mb-5">
            <NotaDemo />
          </div>
          <Tip color="violet">
            Python evalúa las condiciones <strong>de arriba a abajo</strong> y se detiene en la primera que sea verdadera.
          </Tip>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 4 — Operadores lógicos
        ══════════════════════════════════════ */}
        <section id="operadores" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="⚡" title="Operadores Lógicos con if" color="#f59e0b" />
          <p className="text-gray-400 mb-5">
            Combinan varias condiciones para crear proposiciones más complejas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { op: "and", desc: "Verdadero solo si AMBAS condiciones son True",  ex: "a < c and b > c", color: "emerald" },
              { op: "or",  desc: "Verdadero si AL MENOS UNA condición es True",   ex: "x < 0 or x > 10", color: "sky" },
              { op: "not", desc: "Invierte el valor lógico (True→False / False→True)", ex: "not (x == 5)", color: "rose" },
            ].map((op) => {
              const c = { emerald:"#10b981", sky:"#0ea5e9", rose:"#f43f5e" }[op.color];
              return (
                <div key={op.op} className="rounded-xl border p-4"
                  style={{ borderColor: `${c}30`, background: `${c}08` }}>
                  <code className="font-bold text-lg block mb-2" style={{ color: c }}>{op.op}</code>
                  <p className="text-gray-400 text-xs mb-3">{op.desc}</p>
                  <code className="text-xs text-gray-300 bg-black/30 rounded px-2 py-1 block">{op.ex}</code>
                </div>
              );
            })}
          </div>
          <CodeBlock>
            <p><span className="text-emerald-400">a</span><span className="text-white"> = </span><span className="text-amber-300">1</span><span className="text-white"> ; </span><span className="text-emerald-400">b</span><span className="text-white"> = </span><span className="text-amber-300">3</span><span className="text-white"> ; </span><span className="text-emerald-400">c</span><span className="text-white"> = </span><span className="text-amber-300">2</span></p>
            <p className="mt-1"><span className="text-violet-400">if</span><span className="text-white"> c &lt; a:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"c está a la izquierda de a"</span><span className="text-white">)</span></p>
            <p><span className="text-purple-400">elif</span><span className="text-white"> a &lt; c </span><span className="text-sky-400">and</span><span className="text-white"> b &gt; c:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"c está entre a y b"</span><span className="text-white">)</span><span className="text-gray-500 ml-2">← se ejecuta este</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"c está a la derecha de b"</span><span className="text-white">)</span></p>
          </CodeBlock>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 5 — while
        ══════════════════════════════════════ */}
        <section id="while" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "200ms" }}>
          <SectionHeader icon="🔄" title="Bucle while" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            Ejecuta un bloque <strong className="text-white">mientras la condición sea verdadera</strong>. Se usa cuando no sabes cuántas iteraciones serán necesarias.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Sintaxis</p>
            <p><span className="text-sky-400">while</span><span className="text-white"> (condición):</span></p>
            <p><span className="ml-8 text-white">bloque de instrucciones</span></p>
          </CodeBlock>
          <CodeBlock>
            <p><span className="text-emerald-400">lista</span><span className="text-white"> = [3, 5, 6, 2, 1, 3, 5]</span></p>
            <p><span className="text-emerald-400">indice</span><span className="text-white"> = </span><span className="text-amber-300">0</span></p>
            <p className="mt-1"><span className="text-sky-400">while</span><span className="text-white">(indice &lt; </span><span className="text-violet-400">len</span><span className="text-white">(lista)):</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"El elemento {} es {}"</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(indice, lista[indice]))</span></p>
            <p><span className="ml-8 text-emerald-400">indice</span><span className="text-white"> += </span><span className="text-amber-300">1</span><span className="text-gray-500 ml-2"># importante: evitar bucle infinito</span></p>
          </CodeBlock>
          <div className="mb-5"><WhileDemo /></div>

          {/* break */}
          <h3 className="text-white font-semibold mb-3">Comando <code className="text-rose-400 bg-rose-500/10 px-1 rounded">break</code></h3>
          <p className="text-gray-400 text-sm mb-4">Interrumpe el bucle inmediatamente cuando se encuentra cierta condición.</p>
          <CodeBlock>
            <p><span className="text-sky-400">while</span><span className="text-white">(indice &lt; </span><span className="text-violet-400">len</span><span className="text-white">(lista_2)):</span></p>
            <p><span className="ml-8 text-violet-400">if</span><span className="text-white"> </span><span className="text-violet-400">type</span><span className="text-white">(lista_2[indice]) != int:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Elemento no entero en índice {}"</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(indice))</span></p>
            <p><span className="ml-16 text-rose-400">break</span><span className="text-gray-500 ml-2"># detiene el while</span></p>
            <p><span className="ml-8 text-emerald-400">indice</span><span className="text-white"> += 1</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Todos los valores son enteros"</span><span className="text-white">)</span></p>
          </CodeBlock>

          {/* Bucle infinito / adivinanza */}
          <h3 className="text-white font-semibold mb-3 mt-2">Bucles infinitos con <code className="text-sky-400 bg-sky-500/10 px-1 rounded">while(True)</code></h3>
          <p className="text-gray-400 text-sm mb-4">
            Se usan cuando no sabes cuándo terminará el ciclo. Siempre deben tener un <code className="text-rose-400 bg-rose-500/10 px-1 rounded">break</code> para salir.
          </p>
          <AdivinanzaDemo />

          <div className="mt-4">
            <Tip color="sky">
              Siempre asegúrate de que la condición del <code>while</code> pueda volverse <code>False</code>, o incluye un <code>break</code> — de lo contrario el programa se ejecutará para siempre.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 6 — for
        ══════════════════════════════════════ */}
        <section id="for" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="🔃" title="Bucle for" color="#10b981" />
          <p className="text-gray-400 mb-5">
            Itera un número <strong className="text-white">finito de veces</strong> sobre una colección. Es la forma más común de recorrer listas en Python.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Sintaxis</p>
            <p><span className="text-emerald-400">for</span><span className="text-white"> variable </span><span className="text-emerald-400">in</span><span className="text-white"> conjunto_iterable:</span></p>
            <p><span className="ml-8 text-white">bloque de sentencias</span></p>
          </CodeBlock>

          {/* while vs for */}
          <h3 className="text-white font-semibold mb-3">while vs for — mismo resultado, menos código</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-sky-300 text-xs font-bold mb-3">Con while</p>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.9 }}>
                <p><span className="text-emerald-400">lista</span><span className="text-white"> = [0..9]</span></p>
                <p><span className="text-emerald-400">i</span><span className="text-white"> = 0</span></p>
                <p><span className="text-sky-400">while</span><span className="text-white">(i &lt; </span><span className="text-violet-400">len</span><span className="text-white">(lista)):</span></p>
                <p><span className="ml-6 text-violet-400">print</span><span className="text-white">(lista[i])</span></p>
                <p><span className="ml-6 text-emerald-400">i</span><span className="text-white"> += 1</span></p>
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-emerald-300 text-xs font-bold mb-3">Con for ✨ más simple</p>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.9 }}>
                <p><span className="text-emerald-400">lista</span><span className="text-white"> = [0..9]</span></p>
                <p className="mt-3"><span className="text-emerald-400">for</span><span className="text-white"> elemento </span><span className="text-emerald-400">in</span><span className="text-white"> lista:</span></p>
                <p><span className="ml-6 text-violet-400">print</span><span className="text-white">(elemento)</span></p>
              </div>
            </div>
          </div>

          <div className="mb-5"><ForDemo /></div>
          <Tip color="emerald">
            El <code>for</code> es preferible al <code>while</code> cuando sabes de antemano qué colección vas a recorrer. Es más legible y menos propenso a errores.
          </Tip>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 7 — range() y list comprehension
        ══════════════════════════════════════ */}
        <section id="range" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="📐" title="range() y List Comprehension" color="#f59e0b" />
          <p className="text-gray-400 mb-5">
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded">range()</code> genera secuencias numéricas. Combinado con <code className="text-violet-400 bg-violet-500/10 px-1 rounded">for</code>, permite crear listas de forma elegante.
          </p>

          <h3 className="text-white font-semibold mb-3">Forma larga</h3>
          <CodeBlock>
            <p><span className="text-emerald-400">numeros</span><span className="text-white"> = []</span><span className="text-gray-500 ml-3"># lista vacía</span></p>
            <p className="mt-1"><span className="text-emerald-400">for</span><span className="text-white"> i </span><span className="text-emerald-400">in</span><span className="text-white"> </span><span className="text-sky-400">range</span><span className="text-white">(1, 11):</span><span className="text-gray-500 ml-2"># genera [1..10]</span></p>
            <p><span className="ml-8 text-emerald-400">numeros</span><span className="text-white">.</span><span className="text-sky-400">append</span><span className="text-white">(i**</span><span className="text-amber-300">2</span><span className="text-white">)</span></p>
            <p className="mt-1 text-gray-500"># → [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]</p>
          </CodeBlock>

          <h3 className="text-white font-semibold mb-3">Forma abreviada — <span className="text-amber-400 font-normal">List Comprehension</span></h3>
          <CodeBlock>
            <p><span className="text-emerald-400">numeros</span><span className="text-white"> = [i**</span><span className="text-amber-300">2</span><span className="text-white"> </span><span className="text-emerald-400">for</span><span className="text-white"> i </span><span className="text-emerald-400">in</span><span className="text-white"> </span><span className="text-sky-400">range</span><span className="text-white">(11)]</span></p>
            <p className="text-gray-500"># → [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100]</p>
          </CodeBlock>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 mb-4">
            <p className="text-amber-300 text-sm font-bold mb-3">🧩 Anatomía de una List Comprehension</p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
              <span className="text-white">[</span>
              <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded">i**2</span>
              <span className="text-emerald-400 font-bold">for</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">i</span>
              <span className="text-emerald-400 font-bold">in</span>
              <span className="bg-sky-500/20 text-sky-300 px-2 py-1 rounded">range(11)</span>
              <span className="text-white">]</span>
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-xs">
              <span className="text-violet-300">🟣 Expresión (qué calcular)</span>
              <span className="text-emerald-300">🟢 Variable de iteración</span>
              <span className="text-sky-300">🔵 Colección iterable</span>
            </div>
          </div>

          <Tip color="amber">
            Las <strong>list comprehensions</strong> son una de las características más poderosas de Python. Reducen código y mejoran la legibilidad.
          </Tip>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "320ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { struct: "if / elif / else", when: "Ejecutar código solo si se cumple una condición. elif para múltiples ramas.", color: "#8b5cf6" },
              { struct: "while",            when: "Repetir mientras una condición sea True. Útil cuando no sabes cuántas iteraciones.",  color: "#0ea5e9" },
              { struct: "for",              when: "Recorrer una colección finita. Preferible para listas, rangos y strings.",            color: "#10b981" },
              { struct: "break",            when: "Salir de un bucle antes de que termine naturalmente.",                                color: "#f43f5e" },
            ].map((row) => (
              <div key={row.struct} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <code className="text-sm font-bold whitespace-nowrap mt-0.5" style={{ color: row.color }}>{row.struct}</code>
                <p className="text-gray-400 text-sm">{row.when}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">← Volver al inicio</button>
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · Elementos de Control</span>
        </div>

      </div>
    </div>
  );
}