// POO.jsx — Módulo: Programación Orientada a Objetos en Python
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

import { useState } from "react";

// ── Demo: Constructor de clase Humano ─────────────────────────────
function ClaseDemo() {
  const [nombre, setNombre] = useState("Carlos");
  const [edad, setEdad]     = useState(20);
  const [dni, setDni]       = useState("111111");
  const [creado, setCreado] = useState(false);

  const crear = () => setCreado(true);
  const reset = () => { setCreado(false); setNombre("Carlos"); setEdad(20); setDni("111111"); };

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
      <p className="text-indigo-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Crear instancia de la clase humano</p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "nombre", val: nombre, set: setNombre, type: "text", placeholder: "Carlos" },
          { label: "edad",   val: edad,   set: setEdad,   type: "number", placeholder: "20" },
          { label: "dni",    val: dni,    set: setDni,    type: "text", placeholder: "111111" },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-xs text-gray-500 block mb-1 font-mono">{f.label}</label>
            <input type={f.type} value={f.val}
              onChange={(e) => { f.set(e.target.value); setCreado(false); }}
              placeholder={f.placeholder}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm outline-none focus:border-indigo-500/50 font-mono" />
          </div>
        ))}
      </div>

      {/* Código generado */}
      <div className="bg-black/40 rounded-xl border border-white/10 p-4 text-sm mb-4" style={{ fontFamily: "monospace", lineHeight: 2 }}>
        <p className="text-gray-500"># Instanciar la clase:</p>
        <p>
          <span className="text-emerald-400">persona</span>
          <span className="text-white"> = </span>
          <span className="text-violet-400">humano</span>
          <span className="text-white">(</span>
          <span className="text-green-300">'{nombre}'</span>
          <span className="text-white">, </span>
          <span className="text-amber-300">{edad}</span>
          <span className="text-white">, </span>
          <span className="text-amber-300">{dni}</span>
          <span className="text-white">)</span>
        </p>
      </div>

      <button onClick={crear}
        className="text-xs px-4 py-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer mb-4">
        ▶ Crear instancia
      </button>

      {creado && (
        <div className="space-y-2 animate-pulse-once">
          {[
            { attr: "persona.nombre", val: nombre, color: "text-green-300" },
            { attr: "persona.edad",   val: String(edad), color: "text-amber-300" },
            { attr: "persona.dni",    val: String(dni),  color: "text-amber-300" },
          ].map((r) => (
            <div key={r.attr} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 flex justify-between items-center">
              <code className="text-gray-300 text-xs">{r.attr}</code>
              <span className={`font-mono font-bold text-sm ${r.color}`}>→ {r.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Demo: Métodos ─────────────────────────────────────────────────
function MetodoDemo() {
  const [personas, setPersonas] = useState([
    { nombre: "Pedro", edad: 31, dni: "222222" },
  ]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad]     = useState("");
  const [dni, setDni]       = useState("");
  const [log, setLog]       = useState([]);

  const agregar = () => {
    if (!nombre.trim() || !edad || !dni.trim()) return;
    const nueva = { nombre: nombre.trim(), edad: Number(edad), dni: dni.trim() };
    setPersonas([...personas, nueva]);
    setNombre(""); setEdad(""); setDni("");
  };

  const presentar = (p) => {
    setLog((prev) => [
      ...prev,
      `Hola soy ${p.nombre}, tengo ${p.edad} de edad y mi dni es ${p.dni}`,
    ]);
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — método presentar()</p>

      {/* Lista de objetos */}
      <div className="flex flex-wrap gap-2 mb-4">
        {personas.map((p, i) => (
          <div key={i} className="rounded-xl border border-emerald-500/30 bg-black/30 p-3">
            <p className="text-xs text-gray-500 mb-1 font-mono">humano</p>
            <p className="text-white text-sm font-bold mb-1">{p.nombre}</p>
            <p className="text-xs text-gray-400 mb-2">edad: {p.edad} · dni: {p.dni}</p>
            <button onClick={() => presentar(p)}
              className="text-xs px-2 py-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer">
              .presentar()
            </button>
          </div>
        ))}
      </div>

      {/* Añadir persona */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="nombre"
          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50" />
        <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="edad"
          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50" />
        <input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="dni"
          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50" />
      </div>
      <button onClick={agregar}
        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition-all cursor-pointer mb-4">
        + Crear persona
      </button>

      {/* Consola */}
      <div className="bg-black/50 rounded-xl border border-white/10 p-3 min-h-[52px] max-h-36 overflow-y-auto text-xs font-mono space-y-0.5">
        {log.length === 0
          ? <p className="text-gray-600 italic">Haz clic en .presentar() para ver el output...</p>
          : log.map((l, i) => <p key={i} className="text-emerald-300">→ {l}</p>)
        }
      </div>
      {log.length > 0 && (
        <button onClick={() => setLog([])} className="mt-2 text-xs text-gray-500 hover:text-white transition-colors">
          ↺ Limpiar consola
        </button>
      )}
    </div>
  );
}

// ── Demo: Métodos especiales __str__ y __del__ ────────────────────
function EspecialesDemo() {
  const [persona, setPersona] = useState({ nombre: "Pedro", edad: 31, dni: "222222" });
  const [existe, setExiste]   = useState(true);
  const [log, setLog]         = useState([]);

  const strPersona = () => {
    setLog((prev) => [...prev, { tipo: "str", msg: `Soy una persona, me llamo ${persona.nombre} y tengo ${persona.edad} años de edad. Mi dni es ${persona.dni}` }]);
  };
  const delPersona = () => {
    setLog((prev) => [...prev, { tipo: "del", msg: "Adios, he sido borrado" }]);
    setExiste(false);
  };
  const reset = () => { setExiste(true); setLog([]); };

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="text-rose-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Métodos especiales __str__ y __del__</p>

      {existe ? (
        <div className="rounded-xl border border-rose-500/20 bg-black/30 p-4 mb-4">
          <p className="text-xs text-gray-500 mb-2 font-mono">objeto: persona2 (humano)</p>
          <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-mono">
            <div><span className="text-gray-500">nombre: </span><span className="text-green-300">'{persona.nombre}'</span></div>
            <div><span className="text-gray-500">edad: </span><span className="text-amber-300">{persona.edad}</span></div>
            <div><span className="text-gray-500">dni: </span><span className="text-amber-300">{persona.dni}</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={strPersona}
              className="text-xs px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer">
              str(persona2) → __str__
            </button>
            <button onClick={delPersona}
              className="text-xs px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer">
              del(persona2) → __del__
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-700/40 bg-gray-700/10 p-4 mb-4 text-center">
          <p className="text-gray-500 text-sm">persona2 ya no existe en memoria</p>
          <p className="text-rose-400 text-xs font-mono mt-1">NameError: name 'persona2' is not defined</p>
        </div>
      )}

      <div className="bg-black/50 rounded-xl border border-white/10 p-3 min-h-[52px] max-h-40 overflow-y-auto text-xs font-mono space-y-1">
        {log.length === 0
          ? <p className="text-gray-600 italic">Prueba los botones para ver los métodos especiales...</p>
          : log.map((l, i) => (
            <p key={i} className={l.tipo === "del" ? "text-rose-300" : "text-sky-300"}>
              → {l.msg}
            </p>
          ))
        }
      </div>

      {!existe && (
        <button onClick={reset} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
          ↺ Recrear objeto
        </button>
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
    indigo:  { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-300" },
    emerald: { bg: "bg-emerald-500/10",border: "border-emerald-500/20",text: "text-emerald-300" },
    sky:     { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-300" },
    rose:    { bg: "bg-rose-500/10",   border: "border-rose-500/20",   text: "text-rose-300" },
    amber:   { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-300" },
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
export default function POO({ onBack }) {
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
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-rose-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-indigo-400" style={{ fontFamily: "monospace" }}>POO</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#6366f1", color: "#6366f1", fontFamily: "monospace" }}>
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Programación{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #10b981, #f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Orientada a Objetos</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            El paradigma esencial de Python. Aprende a crear
            <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded mx-1">clases</code>
            con atributos, métodos y métodos especiales como
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">__str__</code> y
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">__del__</code>.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#conceptos",   label: "🧠 Conceptos" },
            { href: "#clase",       label: "🏗️ Clase" },
            { href: "#constructor", label: "⚙️ Constructor" },
            { href: "#instancia",   label: "🎯 Instancia" },
            { href: "#metodos",     label: "🔧 Métodos" },
            { href: "#especiales",  label: "✨ Métodos especiales" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ SECCIÓN 1 — Conceptos ══ */}
        <section id="conceptos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="🧠" title="Conceptos clave de POO" color="#6366f1" />
          <p className="text-gray-400 mb-6">
            La <strong className="text-white">Programación Orientada a Objetos (POO)</strong> es el paradigma esencial de Python.
            Todo en Python es un objeto. Antes de la sintaxis, hay que entender tres conceptos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "🏭",
                title: "Clase",
                color: "#6366f1",
                desc: "Un molde o plantilla para crear objetos. Define qué atributos y métodos tendrán.",
                example: "Clase Humano → molde que describe a toda persona",
              },
              {
                icon: "👤",
                title: "Objeto / Instancia",
                color: "#10b981",
                desc: "Un objeto creado a partir de una clase. Tiene sus propios valores de atributos.",
                example: "Pedro, Carlos, Juan → cada uno es un humano distinto",
              },
              {
                icon: "📋",
                title: "Atributos y Métodos",
                color: "#f59e0b",
                desc: "Atributos = características (nombre, edad). Métodos = acciones que puede hacer (caminar, hablar).",
                example: "persona.nombre → atributo\npersona.caminar() → método",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border p-4"
                style={{ borderColor: `${c.color}30`, background: `${c.color}08` }}>
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="font-bold text-sm mb-2" style={{ color: c.color }}>{c.title}</p>
                <p className="text-gray-400 text-xs mb-3">{c.desc}</p>
                <code className="text-xs text-gray-500 bg-black/30 rounded px-2 py-1 block whitespace-pre-line">{c.example}</code>
              </div>
            ))}
          </div>

          {/* Diagrama visual */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
            <p className="text-indigo-300 text-xs font-bold mb-4 uppercase tracking-widest">📊 Ejemplo: Clase Humano</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-indigo-500/30 bg-black/30 p-4">
                <p className="text-indigo-300 font-bold text-sm mb-3">🏭 Clase: Humano</p>
                <div className="space-y-1 text-xs font-mono">
                  <p className="text-gray-500 font-bold">Atributos:</p>
                  <p className="text-emerald-300">• nombre</p>
                  <p className="text-emerald-300">• edad</p>
                  <p className="text-emerald-300">• DNI</p>
                  <p className="text-emerald-300">• estatura</p>
                  <p className="text-gray-500 font-bold mt-2">Métodos:</p>
                  <p className="text-sky-300">• Camina()</p>
                  <p className="text-sky-300">• Corre()</p>
                  <p className="text-sky-300">• Habla()</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { nombre: "Pedro", edad: 28, dni: "123456" },
                  { nombre: "Juan",  edad: 35, dni: "789012" },
                ].map((p) => (
                  <div key={p.nombre} className="rounded-lg border border-emerald-500/30 bg-black/30 p-3">
                    <p className="text-emerald-300 font-bold text-xs mb-2">👤 Objeto: {p.nombre}</p>
                    <div className="text-xs font-mono space-y-0.5">
                      <p><span className="text-gray-500">nombre = </span><span className="text-green-300">'{p.nombre}'</span></p>
                      <p><span className="text-gray-500">edad   = </span><span className="text-amber-300">{p.edad}</span></p>
                      <p><span className="text-gray-500">dni    = </span><span className="text-amber-300">{p.dni}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECCIÓN 2 — Sintaxis de clase ══ */}
        <section id="clase" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="🏗️" title="Sintaxis de una Clase" color="#8b5cf6" />
          <p className="text-gray-400 mb-5">
            Se define con la palabra <code className="text-violet-400 bg-violet-500/10 px-1 rounded">class</code>, seguida del nombre y entre paréntesis la clase de la que <strong className="text-white">hereda</strong>.
            Si no se especifica, hereda de <code className="text-violet-400 bg-violet-500/10 px-1 rounded">object</code> automáticamente.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Estructura básica</p>
            <p><span className="text-violet-400">class</span><span className="text-emerald-400"> NombreClase</span><span className="text-white">(object):</span></p>
            <p className="mt-1"><span className="ml-8 text-violet-400">def</span><span className="text-sky-400"> __init__</span><span className="text-white">(self, parámetros):</span><span className="text-gray-500 ml-2"># Constructor</span></p>
            <p><span className="ml-16 text-gray-500"># declaración de atributos</span></p>
          </CodeBlock>
          <Tip color="indigo">
            El nombre de la clase por convención usa <strong>PascalCase</strong> (primera letra mayúscula). El paréntesis <code>(object)</code> indica herencia; si no heredas de nada específico, puedes omitirlo o dejarlo.
          </Tip>
        </section>

        {/* ══ SECCIÓN 3 — Constructor __init__ ══ */}
        <section id="constructor" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "120ms" }}>
          <SectionHeader icon="⚙️" title="El Constructor __init__" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            El método <code className="text-sky-400 bg-sky-500/10 px-1 rounded">__init__</code> se ejecuta automáticamente al crear un objeto.
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">self</code> refiere al objeto mismo que se está creando.
          </p>
          <CodeBlock>
            <p><span className="text-violet-400">class</span><span className="text-emerald-400"> humano</span><span className="text-white">():</span></p>
            <p className="mt-1"><span className="ml-8 text-violet-400">def</span><span className="text-sky-400"> __init__</span><span className="text-white">(</span><span className="text-violet-300">self</span><span className="text-white">, nombre, edad, dni):</span></p>
            <p><span className="ml-16 text-violet-300">self</span><span className="text-white">.nombre = nombre</span><span className="text-gray-500 ml-2"># atributo nombre</span></p>
            <p><span className="ml-16 text-violet-300">self</span><span className="text-white">.edad   = edad</span><span className="text-gray-500 ml-2"># atributo edad</span></p>
            <p><span className="ml-16 text-violet-300">self</span><span className="text-white">.dni    = dni</span><span className="text-gray-500 ml-2"># atributo dni</span></p>
          </CodeBlock>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { term: "self",    desc: "Referencia al objeto en creación. Siempre va primero.", color: "#a855f7" },
              { term: "__init__",desc: "Se llama automáticamente al instanciar la clase.",      color: "#0ea5e9" },
            ].map((t) => (
              <div key={t.term} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <code className="font-bold text-sm block mb-1" style={{ color: t.color }}>{t.term}</code>
                <p className="text-gray-400 text-xs">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SECCIÓN 4 — Instancia + Demo ══ */}
        <section id="instancia" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="🎯" title="Crear una Instancia (objeto)" color="#10b981" />
          <p className="text-gray-400 mb-5">
            Para crear un objeto de la clase, usamos el nombre de la clase como si fuera una función y pasamos los argumentos en el mismo orden que el <code className="text-sky-400 bg-sky-500/10 px-1 rounded">__init__</code>.
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Crear instancia</p>
            <p><span className="text-emerald-400">persona</span><span className="text-white"> = </span><span className="text-violet-400">humano</span><span className="text-white">(</span><span className="text-green-300">'Carlos'</span><span className="text-white">, </span><span className="text-amber-300">20</span><span className="text-white">, </span><span className="text-amber-300">111111</span><span className="text-white">)</span></p>
            <p className="mt-1 text-gray-500"># Acceder a atributos:</p>
            <p><span className="text-emerald-400">persona</span><span className="text-white">.nombre</span><span className="text-gray-500"> → </span><span className="text-green-300">'Carlos'</span></p>
            <p><span className="text-emerald-400">persona</span><span className="text-white">.edad</span><span className="text-gray-500">   → </span><span className="text-amber-300">20</span></p>
            <p><span className="text-emerald-400">persona</span><span className="text-white">.dni</span><span className="text-gray-500">    → </span><span className="text-amber-300">111111</span></p>
          </CodeBlock>
          <div className="mb-4"><ClaseDemo /></div>
        </section>

        {/* ══ SECCIÓN 5 — Métodos ══ */}
        <section id="metodos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "200ms" }}>
          <SectionHeader icon="🔧" title="Añadir Métodos" color="#f59e0b" />
          <p className="text-gray-400 mb-5">
            Los métodos son funciones definidas dentro de la clase con <code className="text-violet-400 bg-violet-500/10 px-1 rounded">def</code>.
            El primer parámetro siempre es <code className="text-violet-400 bg-violet-500/10 px-1 rounded">self</code>.
          </p>
          <CodeBlock>
            <p><span className="text-violet-400">class</span><span className="text-emerald-400"> humano</span><span className="text-white">():</span></p>
            <p><span className="ml-8 text-violet-400">def</span><span className="text-sky-400"> __init__</span><span className="text-white">(self, nombre, edad, dni):</span></p>
            <p><span className="ml-16 text-violet-300">self</span><span className="text-white">.nombre = nombre</span></p>
            <p><span className="ml-16 text-violet-300">self</span><span className="text-white">.edad = edad</span></p>
            <p><span className="ml-16 text-violet-300">self</span><span className="text-white">.dni = dni</span></p>
            <p className="mt-1"><span className="ml-8 text-violet-400">def</span><span className="text-amber-400"> presentar</span><span className="text-white">(self):</span><span className="text-gray-500 ml-2"># método</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Hola soy {}, tengo {} de edad y mi dni es {}"</span></p>
            <p><span className="ml-16 text-white">.</span><span className="text-sky-400">format</span><span className="text-white">(self.nombre, self.edad, self.dni))</span></p>
          </CodeBlock>
          <div className="bg-black/40 rounded-xl border border-white/10 p-4 mb-5 text-sm" style={{ fontFamily: "monospace", lineHeight: 2 }}>
            <p className="text-gray-500"># Llamar al método:</p>
            <p><span className="text-emerald-400">persona2</span><span className="text-white"> = </span><span className="text-violet-400">humano</span><span className="text-white">(</span><span className="text-green-300">'Pedro'</span><span className="text-white">, 31, 222222)</span></p>
            <p><span className="text-emerald-400">persona2</span><span className="text-white">.</span><span className="text-amber-400">presentar</span><span className="text-white">()</span></p>
            <p className="text-gray-500">→ Hola soy Pedro, tengo 31 de edad y mi dni es 222222</p>
          </div>
          <div className="mb-4"><MetodoDemo /></div>
          <Tip color="amber">
            Dentro de un método, usa <code>self.atributo</code> para acceder a los atributos del objeto. <code>self</code> siempre referencia al objeto que llama el método.
          </Tip>
        </section>

        {/* ══ SECCIÓN 6 — Métodos especiales ══ */}
        <section id="especiales" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="✨" title="Métodos Especiales (Dunder)" color="#f43f5e" />
          <p className="text-gray-400 mb-5">
            Los métodos con doble guión bajo (<strong className="text-white">dunder</strong> = double underscore) son especiales: ya existen ocultos y sirven para tareas específicas del lenguaje.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { method: "__init__", desc: "Constructor. Se llama al crear el objeto.", color: "#6366f1" },
              { method: "__str__",  desc: "Define cómo se muestra el objeto como texto con str().", color: "#0ea5e9" },
              { method: "__del__",  desc: "Destructor. Se llama al eliminar el objeto con del().", color: "#f43f5e" },
            ].map((m) => (
              <div key={m.method} className="rounded-xl border p-4"
                style={{ borderColor: `${m.color}30`, background: `${m.color}08` }}>
                <code className="font-bold text-sm block mb-1" style={{ color: m.color }}>{m.method}</code>
                <p className="text-gray-400 text-xs">{m.desc}</p>
              </div>
            ))}
          </div>
          <CodeBlock>
            <p><span className="text-violet-400">class</span><span className="text-emerald-400"> humano</span><span className="text-white">():</span></p>
            <p><span className="ml-8 text-violet-400">def</span><span className="text-sky-400"> __init__</span><span className="text-white">(self, nombre, edad, dni): ...</span></p>
            <p className="mt-1"><span className="ml-8 text-violet-400">def</span><span className="text-sky-400"> __str__</span><span className="text-white">(self):</span></p>
            <p><span className="ml-16 text-sky-400">return</span><span className="text-white"> </span><span className="text-green-300">f"Soy {`{self.nombre}`}, tengo {`{self.edad}`} años"</span></p>
            <p className="mt-1"><span className="ml-8 text-violet-400">def</span><span className="text-rose-400"> __del__</span><span className="text-white">(self):</span></p>
            <p><span className="ml-16 text-violet-400">print</span><span className="text-white">(</span><span className="text-green-300">"Adios, he sido borrado"</span><span className="text-white">)</span></p>
          </CodeBlock>
          <div className="mb-4"><EspecialesDemo /></div>
          <Tip color="rose">
            Cuando usas <code>del(objeto)</code>, Python llama a <code>__del__</code> antes de liberar la memoria. Si intentas acceder al objeto después, obtendrás un <code>NameError</code>.
          </Tip>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code: "class Nombre():",         desc: "Define una nueva clase.",                                          color: "#6366f1" },
              { code: "def __init__(self, ...):", desc: "Constructor: se ejecuta al instanciar la clase.",                color: "#0ea5e9" },
              { code: "self.atrib = valor",       desc: "Declara un atributo del objeto dentro del constructor.",         color: "#a855f7" },
              { code: "obj = Clase(args)",        desc: "Crea un objeto (instancia) de la clase.",                        color: "#10b981" },
              { code: "obj.atributo",             desc: "Accede al valor de un atributo del objeto.",                     color: "#f59e0b" },
              { code: "obj.metodo()",             desc: "Llama a un método del objeto.",                                  color: "#f59e0b" },
              { code: "def __str__(self):",       desc: "Devuelve la representación en texto del objeto.",                color: "#0ea5e9" },
              { code: "del(obj)",                 desc: "Elimina el objeto de memoria (llama a __del__ si existe).",      color: "#f43f5e" },
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
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · POO</span>
        </div>

      </div>
    </div>
  );
}