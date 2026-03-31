// Estructuras.jsx — Módulo: Estructuras en Python
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

import { useState } from "react";

// ── Demo interactiva de listas ────────────────────────────────────
function ListaDemo() {
  const inicial = ["Pedro", "Carlos", "Juan", "María", "Luisa"];
  const [lista, setLista]     = useState(inicial);
  const [input, setInput]     = useState("");
  const [msg, setMsg]         = useState("");
  const [highlight, setHigh]  = useState(null);

  const flash = (i, texto) => {
    setHigh(i);
    setMsg(texto);
    setTimeout(() => { setHigh(null); setMsg(""); }, 1800);
  };

  const agregar = () => {
    if (!input.trim()) return;
    setLista([...lista, input.trim()]);
    flash(lista.length, `"${input.trim()}" agregado al final`);
    setInput("");
  };

  const eliminar = (i) => {
    const nombre = lista[i];
    setLista(lista.filter((_, idx) => idx !== i));
    setMsg(`"${nombre}" eliminado (índice ${i})`);
    setTimeout(() => setMsg(""), 1800);
  };

  const ordenar = () => {
    setLista([...lista].sort());
    setMsg("Lista ordenada alfabéticamente");
    setTimeout(() => setMsg(""), 1800);
  };

  const invertir = () => {
    setLista([...lista].reverse());
    setMsg("Lista invertida");
    setTimeout(() => setMsg(""), 1800);
  };

  const resetear = () => { setLista(inicial); setMsg("Lista restaurada"); setTimeout(() => setMsg(""), 1500); };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo interactiva</p>

      {/* Lista visual */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[44px]">
        {lista.map((nombre, i) => (
          <div key={`${nombre}-${i}`}
            className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-all duration-300
              ${highlight === i ? "border-yellow-400 bg-yellow-400/20 text-yellow-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"}`}>
            <span className="text-xs opacity-50 mr-1">[{i}]</span>
            {nombre}
            <button onClick={() => eliminar(i)} className="ml-1 text-red-400 hover:text-red-300 text-xs">✕</button>
          </div>
        ))}
        {lista.length === 0 && <span className="text-gray-600 text-sm italic">Lista vacía</span>}
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregar()}
          placeholder="Nombre..."
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500/50 w-32"
        />
        <button onClick={agregar}   className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-all">.append()</button>
        <button onClick={ordenar}   className="text-xs px-3 py-1.5 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:bg-sky-500/30 transition-all">.sort()</button>
        <button onClick={invertir}  className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all">.reverse()</button>
        <button onClick={resetear}  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all">↺ Reset</button>
      </div>

      {msg && <p className="text-xs text-yellow-300 font-mono animate-pulse">{msg}</p>}
      <p className="text-xs text-gray-600 mt-2">Haz clic en <span className="text-red-400">✕</span> para eliminar · <span className="text-emerald-400">Enter</span> para agregar</p>
    </div>
  );
}

// ── Demo de índices ───────────────────────────────────────────────
function IndicesDemo() {
  const nombres = ["Pedro", "Carlos", "Juan", "María", "Luisa"];
  const [sel, setSel] = useState(null);
  const [slice, setSlice] = useState(null);

  const slices = [
    { label: "nombres[:2]",  desc: "Primeros 2 (0 y 1)",        val: [0,1] },
    { label: "nombres[2:]",  desc: "Desde índice 2 al final",   val: [2,3,4] },
    { label: "nombres[1:4]", desc: "Del índice 1 al 3",         val: [1,2,3] },
    { label: "nombres[-2]",  desc: "Penúltimo elemento",        val: [3] },
  ];

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo de índices</p>

      {/* Elementos con índice */}
      <div className="flex flex-wrap gap-2 mb-4">
        {nombres.map((n, i) => (
          <button key={n} onClick={() => { setSel(i); setSlice(null); }}
            className={`flex flex-col items-center rounded-lg border px-3 py-2 transition-all duration-200
              ${sel === i || slice?.includes(i)
                ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 scale-110"
                : "border-sky-500/30 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20"}`}>
            <span className="text-xs opacity-50">[{i}]</span>
            <span className="text-sm font-medium">{n}</span>
            <span className="text-xs opacity-40">[-{nombres.length - i}]</span>
          </button>
        ))}
      </div>

      {sel !== null && (
        <p className="text-yellow-300 text-sm font-mono mb-3">
          nombres[{sel}] → <span className="text-amber-300">"{nombres[sel]}"</span>
        </p>
      )}

      {/* Slices */}
      <div className="flex flex-wrap gap-2">
        {slices.map((s) => (
          <button key={s.label} onClick={() => { setSlice(s.val); setSel(null); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200
              ${JSON.stringify(slice) === JSON.stringify(s.val)
                ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                : "border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"}`}>
            {s.label}
          </button>
        ))}
      </div>
      {slice && (
        <p className="text-yellow-300 text-sm font-mono mt-2">
          → [<span className="text-amber-300">{slice.map(i => `"${nombres[i]}"`).join(", ")}</span>]
        </p>
      )}
    </div>
  );
}

// ── Componentes auxiliares ────────────────────────────────────────
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
    sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-300" },
    amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-300" },
    rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-300" },
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

// ── Página principal ─────────────────────────────────────────────
export default function Estructuras({ onBack }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        code { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-900/15 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/3 left-0 w-[250px] h-[250px] bg-sky-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            ← Inicio
          </button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-emerald-400" style={{ fontFamily: "monospace" }}>Estructuras</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#10b981", color: "#10b981", fontFamily: "monospace" }}>
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Estructuras{" "}
            <span style={{
              background: "linear-gradient(135deg, #10b981, #0ea5e9, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              de Datos
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Las estructuras agrupan y organizan información.
            Aprende las 3 más usadas:
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">list</code>
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">tuple</code>
            <code className="text-amber-400 bg-amber-500/10 px-1 rounded mx-1">dict</code>
          </p>
        </header>

        {/* Índice rápido */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#overview",    label: "🗂️ Resumen" },
            { href: "#listas",      label: "📋 Listas" },
            { href: "#indices",     label: "🔢 Índices" },
            { href: "#metodos",     label: "🔧 Métodos" },
            { href: "#tuplas",      label: "🔒 Tuplas" },
            { href: "#diccionarios",label: "📖 Diccionarios" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══════════════════════════════════════
            OVERVIEW — Las 4 estructuras
        ══════════════════════════════════════ */}
        <section id="overview" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="🗂️" title="Las estructuras básicas de Python" color="#6366f1" />
          <p className="text-gray-400 mb-6">Son objetos que almacenan colecciones de datos. Cada una tiene características distintas:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Lista",       icon: "📋", color: "#10b981", syntax: "[ ]",   desc: "Ordenada y modificable" },
              { name: "Tupla",       icon: "🔒", color: "#0ea5e9", syntax: "( )",   desc: "Ordenada, inmutable" },
              { name: "Diccionario", icon: "📖", color: "#f59e0b", syntax: "{ : }", desc: "Clave → Valor" },
              { name: "Conjunto",    icon: "🔵", color: "#8b5cf6", syntax: "{ }",   desc: "Sin duplicados" },
            ].map((s) => (
              <div key={s.name} className="rounded-xl border p-4 text-center"
                style={{ borderColor: `${s.color}30`, background: `${s.color}08` }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <code className="font-bold text-sm block mb-1" style={{ color: s.color }}>{s.syntax}</code>
                <p className="text-white text-xs font-semibold mb-1">{s.name}</p>
                <p className="text-gray-500 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 1 — Listas
        ══════════════════════════════════════ */}
        <section id="listas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="📋" title="Listas" color="#10b981" />

          <p className="text-gray-400 mb-5">
            Conjuntos de elementos <strong className="text-white">ordenados</strong> donde cada elemento tiene un índice.
            Se definen con <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">[ ]</code> y los elementos se separan con comas.
          </p>

          <CodeBlock>
            <p className="text-gray-500"># Lista de strings</p>
            <p>
              <span className="text-emerald-400">nombres</span>
              <span className="text-white"> = [</span>
              <span className="text-green-300">"Pedro"</span>
              <span className="text-white">, </span>
              <span className="text-green-300">"Carlos"</span>
              <span className="text-white">, </span>
              <span className="text-green-300">"Juan"</span>
              <span className="text-white">, </span>
              <span className="text-green-300">"María"</span>
              <span className="text-white">, </span>
              <span className="text-green-300">"Luisa"</span>
              <span className="text-white">]</span>
            </p>
            <p className="mt-1">
              <span className="text-violet-400">len</span>
              <span className="text-white">(nombres)</span>
              <span className="text-gray-500"> → </span>
              <span className="text-amber-300">5</span>
            </p>
          </CodeBlock>

          <ListaDemo />
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 2 — Índices y slicing
        ══════════════════════════════════════ */}
        <section id="indices" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="🔢" title="Índices y Slicing" color="#0ea5e9" />

          <p className="text-gray-400 mb-5">
            Los índices en Python <strong className="text-white">comienzan en 0</strong>.
            También puedes usar índices negativos: <code className="text-sky-300 bg-sky-500/10 px-1 rounded">-1</code> es el último elemento.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { code: "nombres[0]",  res: '"Pedro"',   desc: "Primer elemento" },
              { code: "nombres[3]",  res: '"María"',   desc: "Cuarto elemento" },
              { code: "nombres[-1]", res: '"Luisa"',   desc: "Último elemento" },
              { code: "nombres[-2]", res: '"María"',   desc: "Penúltimo" },
            ].map((item) => (
              <div key={item.code} className="bg-black/40 rounded-xl border border-white/10 p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
                  <code className="text-sky-300 text-sm">{item.code}</code>
                </div>
                <span className="text-amber-300 font-mono text-sm font-bold">{item.res}</span>
              </div>
            ))}
          </div>

          <h3 className="text-white font-semibold mb-3">Slicing <span className="text-sky-400 text-sm font-normal font-mono">[inicio : final-1]</span></h3>
          <IndicesDemo />

          <div className="mt-4">
            <Tip color="sky">
              El <strong>slice</strong> <code>[inicio:fin]</code> incluye el índice de inicio pero <strong>excluye</strong> el de fin. Por eso <code>nombres[:2]</code> devuelve los elementos en posición 0 y 1.
            </Tip>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 3 — Métodos de listas
        ══════════════════════════════════════ */}
        <section id="metodos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="🔧" title="Métodos de Listas" color="#a855f7" />

          <p className="text-gray-400 mb-6">Las listas tienen métodos integrados para buscar, modificar y ordenar sus elementos:</p>

          <div className="space-y-3">
            {[
              {
                method: ".append(obj)",
                desc: "Agrega un elemento al final",
                code: 'nombres.append("Román")',
                result: '["Pedro","Carlos","Juan","María","Luisa","Román"]',
                color: "emerald",
              },
              {
                method: ".insert(i, obj)",
                desc: "Inserta un elemento en la posición i",
                code: 'nombres.insert(1, "Carlos")',
                result: 'Inserta "Carlos" en índice 1',
                color: "sky",
              },
              {
                method: ".pop(i)",
                desc: "Elimina y devuelve el elemento en posición i",
                code: "nombres.pop(1)",
                result: '"Carlos" — y lo elimina de la lista',
                color: "rose",
              },
              {
                method: ".index(obj)",
                desc: "Devuelve el índice de un elemento",
                code: 'nombres.index("Carlos")',
                result: "1",
                color: "amber",
              },
              {
                method: "in",
                desc: "Comprueba si un elemento está en la lista",
                code: '"Carlos" in nombres',
                result: "True",
                color: "violet",
              },
              {
                method: ".sort()",
                desc: "Ordena la lista (alfabético / numérico)",
                code: "nombres.sort()",
                result: '["Carlos","Juan","Luisa","María","Pedro","Román"]',
                color: "sky",
              },
              {
                method: ".sort(reverse=True)",
                desc: "Ordena de forma inversa",
                code: "nombres.sort(reverse=True)",
                result: '["Román","Pedro","María","Luisa","Juan","Carlos"]',
                color: "sky",
              },
              {
                method: ".reverse()",
                desc: "Invierte el orden actual de la lista",
                code: "lista.reverse()  # lista=[3,5,2,4,9]",
                result: "[9,4,2,5,3]",
                color: "violet",
              },
            ].map((m) => {
              const clr = {
                emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", method: "text-emerald-300", chip: "bg-emerald-500/15 text-emerald-400" },
                sky:     { border: "border-sky-500/20",     bg: "bg-sky-500/5",     method: "text-sky-300",     chip: "bg-sky-500/15     text-sky-400" },
                rose:    { border: "border-rose-500/20",    bg: "bg-rose-500/5",    method: "text-rose-300",    chip: "bg-rose-500/15    text-rose-400" },
                amber:   { border: "border-amber-500/20",   bg: "bg-amber-500/5",   method: "text-amber-300",   chip: "bg-amber-500/15   text-amber-400" },
                violet:  { border: "border-violet-500/20",  bg: "bg-violet-500/5",  method: "text-violet-300",  chip: "bg-violet-500/15  text-violet-400" },
              }[m.color];
              return (
                <div key={m.method} className={`rounded-xl border ${clr.border} ${clr.bg} p-4`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <code className={`font-bold text-sm ${clr.method}`}>{m.method}</code>
                    <span className="text-gray-500 text-xs">{m.desc}</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 text-xs" style={{ fontFamily: "monospace" }}>
                    <p className="text-gray-400">{m.code}</p>
                    <p className="text-amber-300 mt-1">→ {m.result}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 4 — Tuplas
        ══════════════════════════════════════ */}
        <section id="tuplas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "200ms" }}>
          <SectionHeader icon="🔒" title="Tuplas" color="#0ea5e9" />

          <p className="text-gray-400 mb-5">
            Similares a las listas pero se definen con <code className="text-sky-400 bg-sky-500/10 px-1 rounded">( )</code> y son <strong className="text-white">inmutables</strong>: una vez creadas, no se pueden modificar.
          </p>

          <CodeBlock>
            <p><span className="text-emerald-400">frutas</span><span className="text-white"> = (</span><span className="text-green-300">"limón"</span><span className="text-white">, </span><span className="text-green-300">"cambur"</span><span className="text-white">, </span><span className="text-green-300">"fresas"</span><span className="text-white">, </span><span className="text-green-300">"naranja"</span><span className="text-white">)</span></p>
            <p><span className="text-violet-400">type</span><span className="text-white">(frutas)</span><span className="text-gray-500"> → tuple</span></p>
            <p className="mt-1 text-gray-500"># Acceso igual que las listas:</p>
            <p><span className="text-emerald-400">frutas</span><span className="text-white">[0]</span><span className="text-gray-500"> → </span><span className="text-amber-300">"limón"</span></p>
            <p><span className="text-emerald-400">frutas</span><span className="text-white">[3]</span><span className="text-gray-500"> → </span><span className="text-amber-300">"naranja"</span></p>
          </CodeBlock>

          {/* Error al modificar */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 mb-4">
            <p className="text-rose-300 text-xs font-bold mb-3">❌ Las tuplas NO se pueden modificar</p>
            <div className="bg-black/40 rounded-lg p-3 text-sm" style={{ fontFamily: "monospace" }}>
              <p className="text-white">frutas[0] = <span className="text-green-300">"pera"</span></p>
              <p className="text-red-400 mt-2">TypeError: 'tuple' object does not support item assignment</p>
            </div>
          </div>

          {/* Lista vs Tupla */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Lista  [ ]", icon: "📋", color: "#10b981", items: ["Mutable (modificable)", "append, pop, sort…", "Uso general"], ok: true },
              { title: "Tupla  ( )", icon: "🔒", color: "#0ea5e9", items: ["Inmutable (fija)", "Solo lectura", "Datos constantes"], ok: false },
            ].map((t) => (
              <div key={t.title} className="rounded-xl border p-4"
                style={{ borderColor: `${t.color}30`, background: `${t.color}08` }}>
                <p className="font-bold text-sm mb-3" style={{ color: t.color }}>{t.icon} {t.title}</p>
                <ul className="space-y-1">
                  {t.items.map((item) => (
                    <li key={item} className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{t.ok ? "✅" : "🔐"}</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SECCIÓN 5 — Diccionarios
        ══════════════════════════════════════ */}
        <section id="diccionarios" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="📖" title="Diccionarios" color="#f59e0b" />

          <p className="text-gray-400 mb-5">
            Colecciones de pares <code className="text-amber-400 bg-amber-500/10 px-1 rounded">clave: valor</code>.
            En lugar de índices numéricos, accedes al valor usando su <strong className="text-white">clave</strong>.
            Se definen con <code className="text-amber-400 bg-amber-500/10 px-1 rounded">{"{ }"}</code>.
          </p>

          <CodeBlock>
            <p className="text-gray-500"># Ingredientes de una receta</p>
            <p>
              <span className="text-emerald-400">receta</span>
              <span className="text-white"> = {"{"}</span>
              <span className="text-green-300">"agua"</span>
              <span className="text-white">: </span>
              <span className="text-amber-300">3</span>
              <span className="text-white">, </span>
              <span className="text-green-300">"aceite"</span>
              <span className="text-white">: </span>
              <span className="text-amber-300">2</span>
              <span className="text-white">, </span>
              <span className="text-green-300">"harina"</span>
              <span className="text-white">: </span>
              <span className="text-amber-300">6</span>
              <span className="text-white">, </span>
              <span className="text-green-300">"azucar"</span>
              <span className="text-white">: </span>
              <span className="text-amber-300">5</span>
              <span className="text-white">{"}"}</span>
            </p>
            <p className="mt-2"><span className="text-violet-400">type</span><span className="text-white">(receta)</span><span className="text-gray-500"> → dict</span></p>
          </CodeBlock>

          {/* Acceso */}
          <h3 className="text-white font-semibold mb-3">Acceso por clave</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { key: "agua",   val: 3 },
              { key: "aceite", val: 2 },
              { key: "harina", val: 6 },
              { key: "azucar", val: 5 },
            ].map((item) => (
              <div key={item.key} className="bg-black/40 rounded-xl border border-amber-500/20 p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">receta[</p>
                <code className="text-green-300 text-sm font-bold">"{item.key}"</code>
                <p className="text-xs text-gray-500">]</p>
                <p className="text-amber-300 font-bold text-2xl mt-1" style={{ fontFamily: "monospace" }}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* Métodos */}
          <h3 className="text-white font-semibold mb-3">Métodos del diccionario</h3>
          <div className="space-y-3 mb-5">
            {[
              { method: ".keys()",   desc: "Devuelve todas las claves",  result: '["agua", "aceite", "harina", "azucar"]' },
              { method: ".values()", desc: "Devuelve todos los valores", result: "[3, 2, 6, 5]" },
            ].map((m) => (
              <div key={m.method} className="bg-black/40 rounded-xl border border-amber-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-amber-300 font-bold text-sm">receta{m.method}</code>
                  <span className="text-gray-500 text-xs">{m.desc}</span>
                </div>
                <p className="text-xs font-mono text-gray-400">
                  list(receta{m.method}) → <span className="text-amber-300">{m.result}</span>
                </p>
              </div>
            ))}
          </div>

          {/* in para diccionarios */}
          <div className="bg-black/40 rounded-xl border border-white/10 p-4 mb-4" style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
            <p className="text-gray-500 mb-1"># ¿Existe una clave?</p>
            <p><span className="text-green-300">"agua"</span><span className="text-white"> in receta</span><span className="text-gray-500"> → </span><span className="text-emerald-400">True</span></p>
            <p><span className="text-green-300">"sal"</span><span className="text-white">  in receta</span><span className="text-gray-500"> → </span><span className="text-rose-400">False</span></p>
          </div>

          <Tip color="amber">
            En un diccionario el operador <code>in</code> busca entre las <strong>claves</strong>, no en los valores.
          </Tip>
        </section>

        {/* Resumen comparativo */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="⚡" title="¿Cuándo usar cada una?" color="#6366f1" />
          <div className="space-y-3">
            {[
              { struct: "Lista  [ ]",       when: "Colección de elementos del mismo tipo que necesitas modificar o recorrer.",              color: "#10b981" },
              { struct: "Tupla  ( )",       when: "Datos que no cambiarán (coordenadas, configuraciones fijas, constantes).",              color: "#0ea5e9" },
              { struct: "Diccionario { }", when: "Cuando necesitas buscar elementos por nombre/clave, como un registro o configuración.", color: "#f59e0b" },
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
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">
            ← Volver al inicio
          </button>
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · Estructuras de Datos</span>
        </div>

      </div>
    </div>
  );
}