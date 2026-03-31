// VarNumericas.jsx — Módulo: Variables Numéricas en Python
// Contenido basado en el notebook: Machine Learning con Python - Módulo II

export default function VarNumericas({ onBack }) {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* ── Navbar ── */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <span>←</span> Inicio
          </button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-emerald-400" style={{ fontFamily: "monospace" }}>Variables Numéricas</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-14 fade-up">
          <div
            className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#10b981", color: "#10b981", fontFamily: "monospace" }}
          >
            🐍 Módulo II · Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Variables{" "}
            <span style={{
              background: "linear-gradient(135deg, #10b981, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Numéricas
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Aprende los tipos <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">int</code> y{" "}
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded">float</code>, sus operaciones y
            las funciones de la librería <code className="text-rose-400 bg-rose-500/10 px-1 rounded">math</code>.
          </p>
        </header>

        {/* ── Quick index ── */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {["#tipos","#operaciones","#division","#math"].map((href, i) => {
            const labels = ["🔢 Tipos","➕ Operaciones","➗ División","📐 Librería math"];
            return (
              <a key={href} href={href}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
                {labels[i]}
              </a>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════
            SECCIÓN 1 — Tipos de variables numéricas
        ═══════════════════════════════════════════ */}
        <section id="tipos" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="🔢" title="Tipos de Variables Numéricas" color="#10b981" />

          <p className="text-gray-400 mb-5">
            Python reconoce el tipo automáticamente. No necesitas declararlo explícitamente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* int */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <span className="text-emerald-400 font-bold text-sm" style={{ fontFamily: "monospace" }}>int</span>
              <p className="text-gray-400 text-sm mt-1 mb-3">Variables <strong className="text-white">enteras</strong>. Sin punto decimal.</p>
              <div className="bg-black/40 rounded-lg p-3 text-sm" style={{ fontFamily: "monospace" }}>
                <span className="text-emerald-400">var1</span>
                <span className="text-white"> = </span>
                <span className="text-amber-300">3</span>
                <br />
                <span className="text-violet-400">type</span>
                <span className="text-white">(var1) </span>
                <span className="text-gray-500">→ int</span>
              </div>
            </div>
            {/* float */}
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
              <span className="text-sky-400 font-bold text-sm" style={{ fontFamily: "monospace" }}>float</span>
              <p className="text-gray-400 text-sm mt-1 mb-3">Variables <strong className="text-white">decimales</strong>. Con punto decimal.</p>
              <div className="bg-black/40 rounded-lg p-3 text-sm" style={{ fontFamily: "monospace" }}>
                <span className="text-emerald-400">var2</span>
                <span className="text-white"> = </span>
                <span className="text-amber-300">3.5</span>
                <br />
                <span className="text-violet-400">type</span>
                <span className="text-white">(var2) </span>
                <span className="text-gray-500">→ float</span>
              </div>
            </div>
          </div>

          <Tip color="emerald">
            Python es de <strong>tipado dinámico</strong>: identifica el tipo según el valor que asignes.
          </Tip>
        </section>

        {/* ═══════════════════════════════════════
            SECCIÓN 2 — Operaciones básicas
        ═══════════════════════════════════════ */}
        <section id="operaciones" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "80ms" }}>
          <SectionHeader icon="➕" title="Operaciones Básicas" color="#8b5cf6" />

          {/* Multiplicación y potenciación */}
          <h3 className="text-white font-semibold mb-3">Multiplicación y Potenciación</h3>
          <div className="space-y-3 mb-6">
            <CodeResult label="Multiplicación" code="3 * 4" result="12" color="violet" />
            <CodeResult label="Potenciación (2³)" code="2 ** 3" result="8" color="violet" />
          </div>

          {/* Suma y resta */}
          <h3 className="text-white font-semibold mb-3">Suma y Resta</h3>
          <p className="text-gray-400 text-sm mb-3">
            Al operar un <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">int</code> con un <code className="text-sky-400 bg-sky-500/10 px-1 rounded">float</code> el resultado es siempre <strong className="text-white">float</strong>.
          </p>
          <div className="bg-black/40 rounded-xl border border-white/10 p-5 mb-4" style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
            <p className="text-gray-500 mb-2"># var1 = 3 (int), var2 = 3.5 (float)</p>
            <p><span className="text-emerald-400">var</span><span className="text-white"> = var1 + var2</span><span className="text-gray-500">  →  </span><span className="text-amber-300">6.5</span><span className="text-gray-500 ml-2"># float</span></p>
            <p><span className="text-emerald-400">var3</span><span className="text-white"> = var1 - var2</span><span className="text-gray-500">  →  </span><span className="text-amber-300">-0.5</span><span className="text-gray-500 ml-2"># float</span></p>
          </div>
          <Tip color="sky">
            <strong>Regla:</strong> int + float = float. Python siempre elige el tipo más general.
          </Tip>
        </section>

        {/* ═══════════════════════════════════════
            SECCIÓN 3 — División
        ═══════════════════════════════════════ */}
        <section id="division" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "160ms" }}>
          <SectionHeader icon="➗" title="División" color="#f59e0b" />

          <p className="text-gray-400 mb-5">
            Python tiene <strong className="text-white">tres operadores de división</strong> para distintos propósitos:
          </p>

          <div className="space-y-3 mb-7">
            {[
              { op: "/",  desc: "División real (como calculadora)", ex: "5 / 2",  res: "2.5", color: "text-amber-300" },
              { op: "//", desc: "Cociente entero (floor division)",  ex: "5 // 2", res: "2",   color: "text-orange-400" },
              { op: "%",  desc: "Resto de la división (módulo)",     ex: "5 % 2",  res: "1",   color: "text-rose-400" },
            ].map((row) => (
              <div key={row.op} className="bg-black/40 rounded-xl border border-white/10 p-4 grid grid-cols-3 gap-4 items-center">
                <div>
                  <span className={`font-bold text-2xl ${row.color}`} style={{ fontFamily: "monospace" }}>{row.op}</span>
                  <p className="text-xs text-gray-500 mt-1">{row.desc}</p>
                </div>
                <span className="text-gray-300 text-sm" style={{ fontFamily: "monospace" }}>{row.ex}</span>
                <div className="text-right">
                  <span className={`font-bold text-xl ${row.color}`} style={{ fontFamily: "monospace" }}>{row.res}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ejemplo promedio */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <p className="text-amber-300 text-sm font-bold mb-4">📝 Ejemplo aplicado: Promedio de notas</p>
            <div className="bg-black/40 rounded-lg p-4 text-sm mb-3" style={{ fontFamily: "monospace", lineHeight: 1.8 }}>
              <p><span className="text-emerald-400">nota_1</span><span className="text-white"> = 5</span></p>
              <p><span className="text-emerald-400">nota_2</span><span className="text-white"> = 8</span></p>
              <p><span className="text-emerald-400">nota_3</span><span className="text-white"> = 10</span></p>
              <p className="mt-2">
                <span className="text-emerald-400">promedio</span>
                <span className="text-white"> = (nota_1 + nota_2 + nota_3) / 3</span>
              </p>
              <p className="mt-2">
                <span className="text-violet-400">print</span>
                <span className="text-white">(</span>
                <span className="text-green-300">"La nota promedio es {"{:.2f}"}"</span>
                <span className="text-white">.format(promedio))</span>
              </p>
              <p className="text-gray-500">→ La nota promedio es <span className="text-amber-300">7.67</span></p>
            </div>
            <p className="text-xs text-amber-400/70">
              <strong>{":.2f"}</strong> dentro del format() le indica a Python que muestre solo 2 decimales.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECCIÓN 4 — Librería math
        ═══════════════════════════════════════ */}
        <section id="math" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay: "240ms" }}>
          <SectionHeader icon="📐" title="Librería math" color="#f43f5e" />

          <p className="text-gray-400 mb-5">
            La librería estándar <code className="text-rose-400 bg-rose-500/10 px-1 rounded">math</code> provee funciones y constantes matemáticas avanzadas:
          </p>

          <div className="bg-black/40 rounded-xl border border-white/10 p-4 mb-6 text-sm" style={{ fontFamily: "monospace" }}>
            <span className="text-violet-400">import </span>
            <span className="text-white">math </span>
            <span className="text-violet-400">as </span>
            <span className="text-emerald-400">mt</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { fn: "mt.pi",             res: "3.14159265...", desc: "Constante π" },
              { fn: "round(9.5)",        res: "10",           desc: "Redondeo estándar" },
              { fn: "mt.ceil(9.9)",      res: "10",           desc: "Redondeo hacia arriba" },
              { fn: "mt.trunc(9.9999)", res: "9",            desc: "Truncar decimales" },
              { fn: "mt.factorial(4)",   res: "24",           desc: "Factorial  4! = 24" },
              { fn: "mt.exp(2)",         res: "7.389...",     desc: "Exponencial e²" },
              { fn: "mt.sin(mt.pi/2)",  res: "1.0",          desc: "Seno de π/2" },
              { fn: "round(mt.pi, 8)",  res: "3.14159265",   desc: "π con 8 decimales" },
            ].map((item) => (
              <div key={item.fn} className="bg-black/40 rounded-lg border border-white/10 p-3 flex justify-between items-center">
                <div>
                  <code className="text-rose-300 text-xs">{item.fn}</code>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
                <span className="text-amber-300 text-sm font-bold" style={{ fontFamily: "monospace" }}>{item.res}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer nav ── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">
            ← Volver al inicio
          </button>
          <span className="text-xs text-white/20" style={{ fontFamily: "monospace" }}>Python · Variables Numéricas</span>
        </div>

      </div>
    </div>
  );
}

// ── Helpers internos ──────────────────────────────────────────────

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

function CodeResult({ label, code, result, color }) {
  const colorMap = {
    violet: { code: "text-violet-300", result: "text-amber-300" },
    sky:    { code: "text-sky-300",    result: "text-amber-300" },
  };
  const c = colorMap[color] || colorMap.violet;
  return (
    <div className="bg-black/40 rounded-xl border border-white/10 p-4 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <code className={`${c.code} text-sm`}>{code}</code>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500 mb-1">Resultado</p>
        <span className={`${c.result} font-bold text-lg`} style={{ fontFamily: "monospace" }}>{result}</span>
      </div>
    </div>
  );
}

function Tip({ color, children }) {
  const map = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300" },
    sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-300" },
  };
  const c = map[color] || map.emerald;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4 text-sm ${c.text}`}>
      💡 {children}
    </div>
  );
}