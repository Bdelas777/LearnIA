// BucleWhile.jsx — Módulo: Bucle while en Python
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

import { useState, useRef } from "react";

// ── Demo: while básico ────────────────────────────────────────────
function WhileBasicoDemo() {
  const lista = [3, 5, 6, 2, 1, 3, 5];
  const [step, setStep]   = useState(-1);
  const [log, setLog]     = useState([]);
  const [running, setRun] = useState(false);

  const run = () => {
    setStep(-1); setLog([]); setRun(true);
    let i = 0;
    const iv = setInterval(() => {
      setStep(i);
      setLog((prev) => [...prev, `El elemento ${i} de la lista es ${lista[i]}`]);
      i++;
      if (i >= lista.length) {
        clearInterval(iv);
        setRun(false);
        setTimeout(() => { setStep(-1); }, 600);
      }
    }, 500);
  };

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — while básico</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {lista.map((v, i) => (
          <div key={i} className={`rounded-lg border px-3 py-2 text-center transition-all duration-300
            ${step === i ? "border-yellow-400 bg-yellow-400/20 scale-110"
            : step > i  ? "border-sky-500/30 bg-sky-500/10 opacity-50"
                        : "border-white/10 bg-white/5"}`}>
            <p className="text-xs text-gray-500">[{i}]</p>
            <p className={`font-mono font-bold ${step === i ? "text-yellow-300" : "text-gray-300"}`}>{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-black/40 rounded-xl border border-white/10 p-3 mb-3 min-h-[60px] text-xs font-mono space-y-0.5 max-h-32 overflow-y-auto">
        {log.length === 0
          ? <p className="text-gray-600 italic">Presiona ▶ para ejecutar...</p>
          : log.map((l, i) => <p key={i} className="text-emerald-300">→ {l}</p>)
        }
      </div>
      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all
          ${running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                    : "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando..." : "▶ Ejecutar while"}
      </button>
    </div>
  );
}

// ── Demo: break en while ──────────────────────────────────────────
function BreakDemo() {
  const baseList = [1, 2, 3, 4, 5, "a", 7, "b"];
  const [lista, setLista]   = useState(baseList);
  const [step, setStep]     = useState(-1);
  const [stopped, setStopped] = useState(false);
  const [msg, setMsg]       = useState("");
  const [running, setRun]   = useState(false);

  const toggle = (i) => {
    const next = [...lista];
    next[i] = typeof next[i] === "string" ? i + 1 : "x";
    setLista(next); setStep(-1); setStopped(false); setMsg("");
  };

  const run = () => {
    setStep(-1); setStopped(false); setMsg(""); setRun(true);
    let i = 0;
    const iv = setInterval(() => {
      setStep(i);
      if (typeof lista[i] !== "number") {
        setMsg(`El elemento ${i} de la lista no es entero → break`);
        setStopped(true); clearInterval(iv); setRun(false);
        return;
      }
      i++;
      if (i >= lista.length) {
        clearInterval(iv); setRun(false);
        setMsg("Todos los valores son enteros");
        setTimeout(() => { setStep(-1); setMsg(""); }, 1500);
      }
    }, 500);
  };

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="text-rose-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — break en while</p>
      <p className="text-gray-400 text-xs mb-4">
        Haz clic en un elemento para cambiar su tipo a <code className="text-rose-400">string</code> y ver cómo el <code className="text-rose-400">break</code> detiene el bucle.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {lista.map((v, i) => (
          <button key={i} onClick={() => !running && toggle(i)}
            className={`rounded-lg border px-3 py-2 text-center transition-all duration-300 cursor-pointer
              ${typeof v === "string"  ? "border-rose-500/60 bg-rose-500/20"
              : step === i && !stopped ? "border-yellow-400 bg-yellow-400/20 scale-110"
              : step > i  && !stopped  ? "border-emerald-500/30 bg-emerald-500/10 opacity-60"
                                       : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
            <p className="text-xs text-gray-500">[{i}]</p>
            <p className={`font-mono font-bold text-sm ${
              typeof v === "string" ? "text-rose-300"
              : step === i && !stopped ? "text-yellow-300"
              : "text-gray-300"}`}>
              {typeof v === "string" ? `"${v}"` : v}
            </p>
          </button>
        ))}
      </div>
      {msg && (
        <p className={`font-mono text-sm mb-3 animate-pulse ${stopped ? "text-rose-300" : "text-emerald-300"}`}>
          → {msg}
        </p>
      )}
      <div className="flex gap-2">
        <button onClick={run} disabled={running}
          className={`text-xs px-4 py-2 rounded-lg border transition-all
            ${running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer"}`}>
          {running ? "⏳ Iterando..." : "▶ Ejecutar"}
        </button>
        <button onClick={() => { setLista(baseList); setStep(-1); setStopped(false); setMsg(""); }}
          className="text-xs px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all">
          ↺ Reset
        </button>
      </div>
    </div>
  );
}

// ── Demo: continue ────────────────────────────────────────────────
function ContinueDemo() {
  const lista = ["hola", 3, 7, "mundo", 5, 8, "string"];
  const [step, setStep]   = useState(-1);
  const [skipped, setSkipped] = useState([]);
  const [log, setLog]     = useState([]);
  const [running, setRun] = useState(false);

  const run = () => {
    setStep(-1); setSkipped([]); setLog([]); setRun(true);
    let i = 0;
    const iv = setInterval(() => {
      setStep(i);
      if (i % 2 === 0) {
        setSkipped((prev) => [...prev, i]);
      } else {
        setLog((prev) => [...prev, `Elemento ${lista[i]} de la lista`]);
      }
      i++;
      if (i >= lista.length) {
        clearInterval(iv);
        setLog((prev) => [...prev, "Se imprimieron todos los elementos impares"]);
        setRun(false);
        setTimeout(() => setStep(-1), 600);
      }
    }, 500);
  };

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-amber-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — continue (saltar índices pares)</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {lista.map((v, i) => (
          <div key={i} className={`rounded-lg border px-3 py-2 text-center transition-all duration-300
            ${step === i && i % 2 === 0 ? "border-gray-500 bg-gray-500/20 opacity-60"
            : step === i               ? "border-yellow-400 bg-yellow-400/20 scale-110"
            : skipped.includes(i)      ? "border-gray-600/30 bg-gray-600/10 opacity-40"
            : log.length > 0 && i % 2 !== 0 && i < step ? "border-amber-500/30 bg-amber-500/10 opacity-60"
                                       : "border-white/10 bg-white/5"}`}>
            <p className="text-xs text-gray-500">[{i}]</p>
            <p className={`font-mono font-bold text-sm ${
              i % 2 === 0 ? "text-gray-500"
              : step === i ? "text-yellow-300"
              : "text-amber-200"}`}>
              {typeof v === "string" ? `"${v}"` : v}
            </p>
            {i % 2 === 0
              ? <p className="text-xs text-gray-600 mt-0.5">skip</p>
              : <p className="text-xs text-amber-600 mt-0.5">print</p>}
          </div>
        ))}
      </div>
      <div className="bg-black/40 rounded-xl border border-white/10 p-3 mb-3 min-h-[52px] text-xs font-mono space-y-0.5 max-h-28 overflow-y-auto">
        {log.length === 0
          ? <p className="text-gray-600 italic">Presiona ▶ para ver qué se imprime...</p>
          : log.map((l, i) => <p key={i} className={i === log.length - 1 && !running ? "text-emerald-300" : "text-amber-300"}>→ {l}</p>)
        }
      </div>
      <button onClick={run} disabled={running}
        className={`text-xs px-4 py-2 rounded-lg border transition-all
          ${running ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-500"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 cursor-pointer"}`}>
        {running ? "⏳ Ejecutando..." : "▶ Ejecutar con continue"}
      </button>
    </div>
  );
}

// ── Demo: Menú interactivo (while True) ───────────────────────────
function MenuDemo() {
  const [nombre, setNombre] = useState("");
  const [input, setInput]   = useState("");
  const [log, setLog]       = useState([]);
  const [activo, setActivo] = useState(true);
  const [pidiendo, setPid]  = useState(false);
  const logRef = useRef(null);

  const menu = [
    { val: "1", label: "Saludo de bienvenida" },
    { val: "2", label: "Decirme tu nombre" },
    { val: "3", label: "Despedida" },
    { val: "4", label: "Salir 🚪" },
  ];

  const addLog = (txt, color = "text-gray-300") =>
    setLog((prev) => [...prev, { txt, color }]);

  const ejecutar = (val) => {
    if (!activo) return;
    addLog(`Valor= ${val}`, "text-gray-500");
    if (val === "1") {
      addLog("Hola, bienvenido al curso de Python 🐍", "text-emerald-300");
    } else if (val === "2") {
      setPid(true);
      addLog("¿Puedes decirme tu nombre?", "text-sky-300");
    } else if (val === "3") {
      addLog("Hasta luego 👋", "text-violet-300");
    } else if (val === "4") {
      addLog("Vuelve pronto 🎉  → break", "text-rose-300");
      setActivo(false);
    } else {
      addLog("Opción inválida, prueba otra vez ❌", "text-rose-400");
    }
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50);
  };

  const enviarNombre = () => {
    if (!nombre.trim()) return;
    addLog(`Hola ${nombre}, bienvenido al curso de Python 🐍`, "text-emerald-300");
    setPid(false);
    setNombre("");
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50);
  };

  const reset = () => { setLog([]); setActivo(true); setPid(false); setNombre(""); setInput(""); };

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — while(True): Menú interactivo</p>

      {/* Opciones del menú */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {menu.map((m) => (
          <button key={m.val} onClick={() => ejecutar(m.val)}
            disabled={!activo || pidiendo}
            className={`text-xs px-3 py-2.5 rounded-lg border text-left transition-all duration-200
              ${!activo || pidiendo ? "opacity-40 cursor-not-allowed border-gray-700 text-gray-500"
              : m.val === "4" ? "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                              : "border-violet-500/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 cursor-pointer"}`}>
            <span className="font-mono text-amber-300 mr-2">{m.val}</span>{m.label}
          </button>
        ))}
      </div>

      {/* Input de nombre */}
      {pidiendo && (
        <div className="flex gap-2 mb-4">
          <input value={nombre} onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarNombre()}
            placeholder="Escribe tu nombre..."
            className="flex-1 bg-black/40 border border-sky-500/30 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-sky-400" />
          <button onClick={enviarNombre}
            className="text-xs px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer">
            Enviar
          </button>
        </div>
      )}

      {/* Consola */}
      <div ref={logRef}
        className="bg-black/50 rounded-xl border border-white/10 p-3 min-h-[80px] max-h-44 overflow-y-auto text-xs font-mono space-y-0.5 mb-3">
        {log.length === 0
          ? <p className="text-gray-600 italic">Haz clic en una opción del menú...</p>
          : log.map((l, i) => <p key={i} className={l.color}>{l.txt}</p>)
        }
        {!activo && <p className="text-gray-600 italic mt-1">— Bucle terminado (break ejecutado) —</p>}
      </div>

      <button onClick={reset}
        className="text-xs px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all">
        ↺ Reiniciar menú
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
    sky:    { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-300" },
    rose:   { bg: "bg-rose-500/10",   border: "border-rose-500/20",   text: "text-rose-300" },
    amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-300" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-300" },
  };
  const c = map[color] || map.sky;
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
export default function BucleWhile({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-sky-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-rose-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-sky-400" style={{ fontFamily: "monospace" }}>Bucle while</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#0ea5e9", color: "#0ea5e9", fontFamily: "monospace" }}>
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            El Bucle{" "}
            <span style={{
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>while</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Repite instrucciones mientras una condición sea verdadera. Aprende a controlarlo con
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">break</code>
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">continue</code>
            y a crear bucles infinitos con <code className="text-violet-400 bg-violet-500/10 px-1 rounded">while(True)</code>.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#sintaxis",  label: "📐 Sintaxis" },
            { href: "#break",     label: "🛑 break" },
            { href: "#continue",  label: "⏭️ continue" },
            { href: "#infinito",  label: "♾️ while(True)" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ SECCIÓN 1 — Sintaxis ══ */}
        <section id="sintaxis" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📐" title="Sintaxis del bucle while" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            Ejecuta su bloque <strong className="text-white">mientras la condición sea True</strong>.
            Cuando la condición se vuelve <code className="text-rose-400 bg-rose-500/10 px-1 rounded">False</code>, el bucle termina.
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
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"El elemento {} de la lista es {}"</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(indice, lista[indice]))</span></p>
            <p><span className="ml-8 text-emerald-400">indice</span><span className="text-white"> += 1</span></p>
          </CodeBlock>
          <div className="mb-4"><WhileBasicoDemo /></div>
          <Tip color="sky">
            Siempre incrementa el índice (<code>indice += 1</code>) dentro del bucle. Si no, la condición nunca será <code>False</code> y tendrás un <strong>bucle infinito accidental</strong>.
          </Tip>
        </section>

        {/* ══ SECCIÓN 2 — break ══ */}
        <section id="break" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="🛑" title="break — Interrumpir el bucle" color="#f43f5e" />
          <p className="text-gray-400 mb-5">
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded">break</code> detiene el bucle inmediatamente, sin esperar a que la condición sea falsa.
            El bloque <code className="text-sky-400 bg-sky-500/10 px-1 rounded">else</code> del <code className="text-sky-400 bg-sky-500/10 px-1 rounded">while</code> se ejecuta <strong className="text-white">solo si no hubo break</strong>.
          </p>
          <CodeBlock>
            <p><span className="text-emerald-400">lista_2</span><span className="text-white"> = [1, 2, 3, 4, 5, </span><span className="text-green-300">"a"</span><span className="text-white">, 7, </span><span className="text-green-300">"b"</span><span className="text-white">]</span></p>
            <p><span className="text-emerald-400">indice</span><span className="text-white"> = </span><span className="text-amber-300">0</span></p>
            <p className="mt-1"><span className="text-sky-400">while</span><span className="text-white">(indice &lt; </span><span className="text-violet-400">len</span><span className="text-white">(lista_2)):</span></p>
            <p><span className="ml-8 text-violet-400">if</span><span className="text-white"> </span><span className="text-violet-400">type</span><span className="text-white">(lista_2[indice]) != int:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"El elemento {} no es entero"</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(indice))</span></p>
            <p><span className="ml-16 text-rose-400">break</span></p>
            <p><span className="ml-8 text-emerald-400">indice</span><span className="text-white"> += 1</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:</span><span className="text-gray-500 ml-2"># solo si no hubo break</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Todos los valores son enteros"</span><span className="text-white">)</span></p>
          </CodeBlock>
          <div className="mb-4"><BreakDemo /></div>
          <Tip color="rose">
            El <code>else</code> del <code>while</code> solo corre cuando el bucle termina <strong>naturalmente</strong> (la condición fue False). Si saliste con <code>break</code>, el <code>else</code> se omite.
          </Tip>
        </section>

        {/* ══ SECCIÓN 3 — continue ══ */}
        <section id="continue" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="⏭️" title="continue — Saltar una iteración" color="#f59e0b" />
          <p className="text-gray-400 mb-5">
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded">continue</code> salta el resto del bloque en la iteración actual y pasa a la siguiente, <strong className="text-white">sin salir del bucle</strong>.
          </p>

          {/* break vs continue */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <code className="text-rose-300 font-bold text-sm block mb-2">break</code>
              <p className="text-gray-400 text-xs">Sale completamente del bucle.</p>
              <div className="mt-2 bg-black/30 rounded-lg p-2 text-xs font-mono">
                <p className="text-gray-400">iter 0 ✓</p>
                <p className="text-gray-400">iter 1 ✓</p>
                <p className="text-rose-400">iter 2 → break 🛑</p>
                <p className="text-gray-600">iter 3 ✗ (no llega)</p>
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <code className="text-amber-300 font-bold text-sm block mb-2">continue</code>
              <p className="text-gray-400 text-xs">Salta la iteración actual y continúa.</p>
              <div className="mt-2 bg-black/30 rounded-lg p-2 text-xs font-mono">
                <p className="text-gray-400">iter 0 ✓</p>
                <p className="text-gray-400">iter 1 ✓</p>
                <p className="text-amber-400">iter 2 → continue ⏭</p>
                <p className="text-gray-400">iter 3 ✓ (sigue)</p>
              </div>
            </div>
          </div>

          <CodeBlock>
            <p><span className="text-emerald-400">lista_3</span><span className="text-white"> = [</span><span className="text-green-300">"hola"</span><span className="text-white">, 3, 7, </span><span className="text-green-300">"mundo"</span><span className="text-white">, 5, 8, </span><span className="text-green-300">"string"</span><span className="text-white">]</span></p>
            <p><span className="text-emerald-400">indice</span><span className="text-white"> = </span><span className="text-amber-300">0</span></p>
            <p className="mt-1"><span className="text-sky-400">while</span><span className="text-white">(indice &lt; </span><span className="text-violet-400">len</span><span className="text-white">(lista_3)):</span></p>
            <p><span className="ml-8 text-violet-400">if</span><span className="text-white"> indice % </span><span className="text-amber-300">2</span><span className="text-white"> == </span><span className="text-amber-300">0</span><span className="text-white">:</span><span className="text-gray-500 ml-2"># índice par → saltar</span></p>
            <p><span className="ml-16 text-emerald-400">indice</span><span className="text-white"> += 1</span></p>
            <p><span className="ml-16 text-amber-400">continue</span></p>
            <p><span className="ml-8 text-sky-400">else</span><span className="text-white">:</span><span className="text-gray-500 ml-2"># índice impar → imprimir</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Elemento {} de la lista"</span><span className="text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(lista_3[indice]))</span></p>
            <p><span className="ml-8 text-emerald-400">indice</span><span className="text-white"> += 1</span></p>
            <p><span className="text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-8 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Se imprimieron todos los elementos impares"</span><span className="text-white">)</span></p>
          </CodeBlock>
          <div className="mb-4"><ContinueDemo /></div>
          <Tip color="amber">
            Cuando uses <code>continue</code> dentro de un <code>while</code>, asegúrate de incrementar el índice <strong>antes</strong> del <code>continue</code>, de lo contrario el índice no avanza y entra en un bucle infinito.
          </Tip>
        </section>

        {/* ══ SECCIÓN 4 — while True ══ */}
        <section id="infinito" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="♾️" title="Bucles infinitos — while(True)" color="#8b5cf6" />
          <p className="text-gray-400 mb-5">
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded">while(True)</code> crea un bucle que no para nunca por sí solo.
            Se usa para menús, juegos o cuando la condición de salida depende de una <strong className="text-white">acción del usuario</strong>.
            Siempre debe incluir un <code className="text-rose-400 bg-rose-500/10 px-1 rounded">break</code> para poder salir.
          </p>
          <CodeBlock>
            <p><span className="text-sky-400">while</span><span className="text-white">(</span><span className="text-rose-300">True</span><span className="text-white">):</span></p>
            <p><span className="ml-8 text-emerald-400">valor</span><span className="text-white"> = </span><span className="text-violet-400">input</span><span className="text-white">(</span><span className="text-green-300">"Valor= "</span><span className="text-white">)</span></p>
            <p><span className="ml-8 text-violet-400">if</span><span className="text-white"> valor == </span><span className="text-green-300">"1"</span><span className="text-white">:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Hola, bienvenido al curso de python"</span><span className="text-white">)</span></p>
            <p><span className="ml-8 text-purple-400">elif</span><span className="text-white"> valor == </span><span className="text-green-300">"4"</span><span className="text-white">:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Vuelve pronto"</span><span className="text-white">)</span></p>
            <p><span className="ml-16 text-rose-400">break</span><span className="text-gray-500 ml-2"># sale del bucle</span></p>
            <p><span className="ml-8 text-sky-400">else</span><span className="text-white">:</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Opción inválida"</span><span className="text-white">)</span></p>
          </CodeBlock>
          <div className="mb-4"><MenuDemo /></div>
          <Tip color="violet">
            Un <code>while(True)</code> <strong>siempre necesita un break</strong>. Sin él, el programa corre indefinidamente y hay que forzar su cierre.
          </Tip>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "while (cond):",  desc: "Repite el bloque mientras cond sea True. Necesita que cond cambie para terminar.", color: "#0ea5e9" },
              { code: "break",          desc: "Sale del bucle de inmediato. El else del while no se ejecuta.",                    color: "#f43f5e" },
              { code: "continue",       desc: "Salta la iteración actual y vuelve a evaluar la condición.",                     color: "#f59e0b" },
              { code: "while (True):",  desc: "Bucle infinito. Solo termina cuando se ejecuta un break.",                       color: "#8b5cf6" },
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
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · Bucle while</span>
        </div>

      </div>
    </div>
  );
}