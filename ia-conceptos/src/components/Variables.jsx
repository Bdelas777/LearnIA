// Variables.jsx — Módulo: Variables (Strings y Booleanas)
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

export default function Variables({ onBack }) {
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

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-900/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 right-0 w-[250px] h-[250px] bg-rose-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* ── Navbar ── */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            ← Inicio
          </button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-violet-400" style={{ fontFamily: "monospace" }}>Variables</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-14 fade-up">
          <div
            className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6", fontFamily: "monospace" }}
          >
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Variables en{" "}
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Python
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Aprende qué son las variables, las reglas para nombrarlas y los tres tipos primitivos:
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">int/float</code>
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">str</code>
            <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">bool</code>
          </p>
        </header>

        {/* ── Índice rápido ── */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#que-son",  label: "📦 ¿Qué son?" },
            { href: "#reglas",   label: "📋 Reglas" },
            { href: "#strings",  label: "💬 Strings" },
            { href: "#metodos",  label: "🔧 Métodos str" },
            { href: "#booleanas",label: "✅ Booleanas" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            SECCIÓN 1 — ¿Qué son las variables?
        ═══════════════════════════════════════ */}
        <section id="que-son" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="📦" title="¿Qué son las variables?" color="#8b5cf6" />

          <p className="text-gray-400 leading-relaxed mb-5">
            Las variables permiten <strong className="text-white">almacenar valores en la memoria</strong> del computador
            para acceder a ellos cuando sea necesario. Con ellas podemos realizar operaciones,
            generar nuevas variables o modificar las existentes.
          </p>

          <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-5" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 2 }}>
            <p className="text-gray-500"># Asignar un valor es tan simple como:</p>
            <p><span className="text-emerald-400">nombre_variable</span><span className="text-white"> = </span><span className="text-amber-300">valor</span></p>
            <p className="mt-2 text-gray-500"># Ejemplos:</p>
            <p><span className="text-emerald-400">var1</span><span className="text-white"> = </span><span className="text-amber-300">5</span><span className="text-gray-500 ml-3"># int</span></p>
            <p><span className="text-emerald-400">var1</span><span className="text-white"> = </span><span className="text-amber-300">8</span><span className="text-gray-500 ml-3"># las variables pueden reasignarse</span></p>
            <p><span className="text-violet-400">type</span><span className="text-white">(var1)</span><span className="text-gray-500"> → int</span></p>
          </div>

          <Tip color="violet">
            En Python <strong>no necesitas declarar el tipo</strong>: el intérprete lo determina automáticamente según el valor que asignes.
          </Tip>
        </section>

        {/* ═══════════════════════════════════════
            SECCIÓN 2 — Reglas para nombrar
        ═══════════════════════════════════════ */}
        <section id="reglas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="📋" title="Reglas para Nombrar Variables" color="#0ea5e9" />

          <p className="text-gray-400 mb-5">Existen criterios que debes respetar al crear una variable en Python:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {[
              { ok: false, text: "No puede comenzar con un número", ex: "1var = 10" },
              { ok: false, text: "No puede contener espacios",       ex: "mi var = 10" },
              { ok: false, text: "No puede tener símbolos especiales", ex: "var# = 10" },
              { ok: true,  text: 'Usa "_" para simular espacios',    ex: "mi_var = 10" },
            ].map((rule) => (
              <div key={rule.text}
                className={`rounded-xl border p-4 ${rule.ok
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-rose-500/30 bg-rose-500/5"}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-base">{rule.ok ? "✅" : "❌"}</span>
                  <p className={`text-sm ${rule.ok ? "text-emerald-300" : "text-rose-300"}`}>{rule.text}</p>
                </div>
                <code className="text-xs text-gray-500 bg-black/30 rounded px-2 py-1 block">{rule.ex}</code>
              </div>
            ))}
          </div>

          <div className="bg-black/40 rounded-xl border border-white/10 p-5" style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
            <p className="text-gray-500 mb-2"># Las tres primitivas más comunes:</p>
            <p><span className="text-emerald-400">numero</span><span className="text-white"> = </span><span className="text-amber-300">42</span><span className="text-gray-500 ml-3"># int / float</span></p>
            <p><span className="text-emerald-400">texto</span><span className="text-white">  = </span><span className="text-green-300">"Hola"</span><span className="text-gray-500 ml-2"># str</span></p>
            <p><span className="text-emerald-400">activo</span><span className="text-white"> = </span><span className="text-rose-300">True</span><span className="text-gray-500 ml-3"># bool</span></p>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECCIÓN 3 — Variables tipo String
        ═══════════════════════════════════════ */}
        <section id="strings" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="💬" title="Variables tipo String" color="#a855f7" />

          <p className="text-gray-400 mb-5">
            Los <strong className="text-white">strings</strong> representan texto.
            Python los reconoce cuando van encerrados en comillas simples <code className="text-purple-300 bg-purple-500/10 px-1 rounded">' '</code> o dobles <code className="text-purple-300 bg-purple-500/10 px-1 rounded">" "</code>.
          </p>

          {/* Definición y print */}
          <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-6" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 2 }}>
            <p><span className="text-emerald-400">var1</span><span className="text-white"> = </span><span className="text-green-300">"Hola"</span></p>
            <p><span className="text-emerald-400">var2</span><span className="text-white"> = </span><span className="text-green-300">"Mundo"</span></p>
            <p className="mt-1"><span className="text-violet-400">print</span><span className="text-white">(var1)</span><span className="text-gray-500 ml-3">→ Hola</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(var2)</span><span className="text-gray-500 ml-3">→ Mundo</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(var1, var2)</span><span className="text-gray-500 ml-2">→ Hola Mundo</span></p>
            <p className="mt-1"><span className="text-violet-400">type</span><span className="text-white">(var1)</span><span className="text-gray-500 ml-3">→ str</span></p>
          </div>

          {/* Concatenación */}
          <h3 className="text-white font-semibold mb-3">Concatenación con <code className="text-purple-300 bg-purple-500/10 px-1 rounded">+</code></h3>
          <p className="text-gray-400 text-sm mb-4">
            El operador <code className="text-purple-300 bg-purple-500/10 px-1 rounded">+</code> une strings.
            Si las variables son strings, <strong className="text-white">no suma</strong>, ¡concatena!
          </p>

          <div className="space-y-3 mb-6">
            <div className="bg-black/40 rounded-xl border border-white/10 p-4" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.9 }}>
              <p><span className="text-emerald-400">var</span><span className="text-white"> = var1 + </span><span className="text-green-300">" "</span><span className="text-white"> + var2</span></p>
              <p><span className="text-violet-400">print</span><span className="text-white">(var)</span><span className="text-gray-500 ml-2">→ Hola Mundo</span></p>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.9 }}>
              <p className="text-rose-300 text-xs mb-2 font-bold">⚠️ Ojo con esto:</p>
              <p><span className="text-emerald-400">a</span><span className="text-white"> = </span><span className="text-green-300">"3"</span><span className="text-white"> ; </span><span className="text-emerald-400">b</span><span className="text-white"> = </span><span className="text-green-300">"4"</span></p>
              <p><span className="text-violet-400">print</span><span className="text-white">(a + b)</span><span className="text-gray-500"> → </span><span className="text-amber-300">"34"</span><span className="text-gray-500 ml-2"># NO es 7, son strings</span></p>
            </div>
          </div>

          {/* format() */}
          <h3 className="text-white font-semibold mb-3">Concatenación con <code className="text-purple-300 bg-purple-500/10 px-1 rounded">.format()</code></h3>
          <p className="text-gray-400 text-sm mb-4">
            Inserta variables dentro de un string usando llaves <code className="text-purple-300 bg-purple-500/10 px-1 rounded">{"{}"}</code> como marcadores de posición.
          </p>

          <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-3" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 2 }}>
            <p><span className="text-emerald-400">profesion</span><span className="text-white"> = </span><span className="text-green-300">"Hola, soy {"}"} y mi profesión es {"{}"}"</span></p>
            <p className="mt-1"><span className="text-violet-400">print</span><span className="text-white">(profesion.</span><span className="text-sky-400">format</span><span className="text-white">(</span><span className="text-green-300">"Juan"</span><span className="text-white">, </span><span className="text-green-300">"Ingeniero"</span><span className="text-white">))</span></p>
            <p><span className="text-gray-500">→ Hola, soy Juan y mi profesión es Ingeniero</span></p>
          </div>
          <Tip color="purple">
            Las llaves <code>{"{}"}</code> se reemplazan en orden por los valores que pasas en <code>.format()</code>. Puedes pasar cuantos necesites.
          </Tip>
        </section>

        {/* ═══════════════════════════════════════
            SECCIÓN 4 — Métodos de strings
        ═══════════════════════════════════════ */}
        <section id="metodos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="🔧" title="Métodos de Strings" color="#0ea5e9" />

          <p className="text-gray-400 mb-6">
            Los strings en Python tienen métodos integrados que permiten transformar y manipular texto fácilmente.
          </p>

          {/* upper / lower / capitalize */}
          <h3 className="text-white font-semibold mb-3">Mayúsculas y Minúsculas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
            {[
              { method: ".upper()",      desc: "Todo a mayúscula",          ex: '"hola".upper()',     res: '"HOLA"',    color: "sky" },
              { method: ".lower()",      desc: "Todo a minúscula",          ex: '"HOLA".lower()',     res: '"hola"',    color: "sky" },
              { method: ".capitalize()", desc: "Primera letra mayúscula",   ex: '"hola".capitalize()', res: '"Hola"',  color: "sky" },
            ].map((m) => (
              <div key={m.method} className="bg-black/40 rounded-xl border border-sky-500/20 p-4">
                <code className="text-sky-300 font-bold text-sm block mb-1">{m.method}</code>
                <p className="text-gray-500 text-xs mb-3">{m.desc}</p>
                <div className="bg-black/40 rounded-lg p-2 text-xs" style={{ fontFamily: "monospace" }}>
                  <p className="text-gray-400">{m.ex}</p>
                  <p className="text-amber-300">→ {m.res}</p>
                </div>
              </div>
            ))}
          </div>

          {/* split */}
          <h3 className="text-white font-semibold mb-3">Separar con <code className="text-sky-300 bg-sky-500/10 px-1 rounded">.split()</code></h3>
          <p className="text-gray-400 text-sm mb-4">
            Divide un string en partes según el carácter separador que le indiques.
          </p>
          <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-7" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 2 }}>
            <p><span className="text-emerald-400">variable</span><span className="text-white"> = </span><span className="text-green-300">"Hola_Mundo"</span></p>
            <p><span className="text-emerald-400">variable</span><span className="text-white">.</span><span className="text-sky-400">split</span><span className="text-white">(</span><span className="text-green-300">"_"</span><span className="text-white">)</span><span className="text-gray-500"> → </span><span className="text-amber-300">['Hola', 'Mundo']</span></p>
            <p className="mt-1 text-gray-500"># Asignar cada parte a una variable:</p>
            <p><span className="text-white">[variable1, variable2] = variable.</span><span className="text-sky-400">split</span><span className="text-white">(</span><span className="text-green-300">"_"</span><span className="text-white">)</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(variable1)</span><span className="text-gray-500"> → </span><span className="text-amber-300">'Hola'</span></p>
            <p><span className="text-violet-400">print</span><span className="text-white">(variable2)</span><span className="text-gray-500"> → </span><span className="text-amber-300">'Mundo'</span></p>
          </div>

          {/* replace */}
          <h3 className="text-white font-semibold mb-3">Reemplazar con <code className="text-sky-300 bg-sky-500/10 px-1 rounded">.replace()</code></h3>
          <p className="text-gray-400 text-sm mb-4">
            Sustituye un fragmento de texto por otro: <code className="text-sky-300 bg-sky-500/10 px-1 rounded">.replace(arg1, arg2)</code> — reemplaza <em>arg1</em> por <em>arg2</em>.
          </p>
          <div className="bg-black/40 rounded-xl border border-white/10 p-5" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 2 }}>
            <p><span className="text-emerald-400">var</span><span className="text-white"> = </span><span className="text-green-300">"Me llamo Carlos"</span></p>
            <p><span className="text-emerald-400">var</span><span className="text-white">.</span><span className="text-sky-400">replace</span><span className="text-white">(</span><span className="text-green-300">"Carlos"</span><span className="text-white">, </span><span className="text-green-300">"Pedro"</span><span className="text-white">)</span></p>
            <p><span className="text-gray-500">→ </span><span className="text-amber-300">'Me llamo Pedro'</span></p>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECCIÓN 5 — Variables Booleanas
        ═══════════════════════════════════════ */}
        <section id="booleanas" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "320ms" }}>
          <SectionHeader icon="✅" title="Variables tipo Booleanas" color="#f43f5e" />

          <p className="text-gray-400 mb-5">
            Una variable <strong className="text-white">booleana</strong> solo admite dos valores:
            <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded mx-1">True</code>
            o <code className="text-rose-400 bg-rose-500/10 px-1 rounded mx-1">False</code>.
            Son fundamentales para la lógica de control en cualquier programa.
          </p>

          {/* Definición */}
          <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-6" style={{ fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 2 }}>
            <p><span className="text-emerald-400">bol</span><span className="text-white"> = </span><span className="text-rose-300">True</span></p>
            <p><span className="text-violet-400">type</span><span className="text-white">(bol)</span><span className="text-gray-500"> → bool</span></p>
            <p className="mt-1 text-gray-500"># Operador "not" invierte el valor:</p>
            <p><span className="text-violet-400">not </span><span className="text-white">bol</span><span className="text-gray-500"> → </span><span className="text-rose-300">False</span></p>
          </div>

          {/* Operadores relacionales */}
          <h3 className="text-white font-semibold mb-3">Operadores Relacionales</h3>
          <p className="text-gray-400 text-sm mb-4">
            Las comparaciones devuelven un booleano. Son la base de las condiciones (<code className="text-violet-300 bg-violet-500/10 px-1 rounded">if</code>, <code className="text-violet-300 bg-violet-500/10 px-1 rounded">while</code>…).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { op: ">",  desc: "Mayor que",       ex: "5 > 3",  res: "True",  ok: true },
              { op: "<",  desc: "Menor que",        ex: "5 < 3",  res: "False", ok: false },
              { op: ">=", desc: "Mayor o igual",    ex: "5 >= 5", res: "True",  ok: true },
              { op: "<=", desc: "Menor o igual",    ex: "3 <= 2", res: "False", ok: false },
              { op: "==", desc: "Igual a",          ex: "4 == 4", res: "True",  ok: true },
              { op: "!=", desc: "Diferente de",     ex: "4 != 3", res: "True",  ok: true },
            ].map((row) => (
              <div key={row.op} className="bg-black/40 rounded-xl border border-white/10 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-rose-300 font-bold text-xl w-8 text-center" style={{ fontFamily: "monospace" }}>{row.op}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{row.desc}</p>
                    <code className="text-gray-500 text-xs">{row.ex}</code>
                  </div>
                </div>
                <span className={`font-bold text-sm px-2 py-1 rounded-lg ${row.ok
                  ? "text-emerald-300 bg-emerald-500/10"
                  : "text-rose-300 bg-rose-500/10"}`}
                  style={{ fontFamily: "monospace" }}>
                  {row.res}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Tip color="rose">
              Las variables booleanas son el resultado de comparaciones lógicas y nos permiten <strong>verificar si una condición se cumple o no</strong>.
            </Tip>
          </div>
        </section>

        {/* ── Resumen de tipos ── */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay: "400ms" }}>
          <SectionHeader icon="🗂️" title="Resumen: Tipos Primitivos" color="#6366f1" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { type: "int / float", emoji: "🔢", color: "#10b981", example: "var = 3\nvar = 3.5", desc: "Números enteros y decimales" },
              { type: "str",         emoji: "💬", color: "#a855f7", example: 'var = "Hola"', desc: "Texto entre comillas" },
              { type: "bool",        emoji: "✅", color: "#f43f5e", example: "var = True\nvar = False", desc: "Verdadero o Falso" },
            ].map((t) => (
              <div key={t.type} className="rounded-xl border p-4" style={{ borderColor: `${t.color}30`, background: `${t.color}08` }}>
                <div className="text-2xl mb-2">{t.emoji}</div>
                <code className="font-bold text-sm block mb-1" style={{ color: t.color }}>{t.type}</code>
                <p className="text-gray-500 text-xs mb-3">{t.desc}</p>
                <pre className="bg-black/40 rounded-lg p-2 text-xs text-gray-300" style={{ fontFamily: "monospace" }}>{t.example}</pre>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer nav ── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">
            ← Volver al inicio
          </button>
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · Variables</span>
        </div>

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
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-300" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-300" },
    sky:    { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-300" },
    rose:   { bg: "bg-rose-500/10",   border: "border-rose-500/20",   text: "text-rose-300" },
  };
  const c = map[color] || map.violet;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4 text-sm ${c.text}`}>
      💡 {children}
    </div>
  );
}