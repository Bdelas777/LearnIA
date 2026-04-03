// Pandas.jsx — Módulo: Introducción a Pandas
// Contenido basado en el notebook: Machine Learning con Python - Módulo III

import { useState } from "react";

// ── Dataset Titanic simulado ──────────────────────────────────────
const titanicData = [
  { PassengerId:1,  Survived:0, Pclass:3, Name:"Braund, Mr. Owen Harris",                                Sex:"male",   Age:22,   SibSp:1, Parch:0, Fare:7.25,   Cabin:null,   Embarked:"S" },
  { PassengerId:2,  Survived:1, Pclass:1, Name:"Cumings, Mrs. John Bradley",                              Sex:"female", Age:38,   SibSp:1, Parch:0, Fare:71.28,  Cabin:"C85",  Embarked:"C" },
  { PassengerId:3,  Survived:1, Pclass:3, Name:"Heikkinen, Miss. Laina",                                  Sex:"female", Age:26,   SibSp:0, Parch:0, Fare:7.93,   Cabin:null,   Embarked:"S" },
  { PassengerId:4,  Survived:1, Pclass:1, Name:"Futrelle, Mrs. Jacques Heath",                            Sex:"female", Age:35,   SibSp:1, Parch:0, Fare:53.10,  Cabin:"C123", Embarked:"S" },
  { PassengerId:5,  Survived:0, Pclass:3, Name:"Allen, Mr. William Henry",                                Sex:"male",   Age:35,   SibSp:0, Parch:0, Fare:8.05,   Cabin:null,   Embarked:"S" },
  { PassengerId:6,  Survived:0, Pclass:3, Name:"Moran, Mr. James",                                        Sex:"male",   Age:null, SibSp:0, Parch:0, Fare:8.46,   Cabin:null,   Embarked:"Q" },
  { PassengerId:7,  Survived:0, Pclass:1, Name:"McCarthy, Mr. Timothy J",                                 Sex:"male",   Age:54,   SibSp:0, Parch:0, Fare:51.86,  Cabin:"E46",  Embarked:"S" },
  { PassengerId:8,  Survived:0, Pclass:3, Name:"Palsson, Master. Gosta Leonard",                          Sex:"male",   Age:2,    SibSp:3, Parch:1, Fare:21.08,  Cabin:null,   Embarked:"S" },
  { PassengerId:9,  Survived:1, Pclass:3, Name:"Johnson, Mrs. Oscar W",                                   Sex:"female", Age:27,   SibSp:0, Parch:2, Fare:11.13,  Cabin:null,   Embarked:"S" },
  { PassengerId:10, Survived:1, Pclass:2, Name:"Nasser, Mrs. Nicholas",                                   Sex:"female", Age:14,   SibSp:1, Parch:0, Fare:30.07,  Cabin:null,   Embarked:"C" },
];

const COLS = ["PassengerId","Survived","Pclass","Name","Sex","Age","SibSp","Parch","Fare","Cabin","Embarked"];

// ── DataFrame visual ──────────────────────────────────────────────
function DataFrameTable({ data, highlightCols=[], highlightRows=[], maxRows=5, title="" }) {
  const rows = data.slice(0, maxRows);
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
      {title && <p className="text-xs text-gray-500 px-4 pt-3 font-mono">{title}</p>}
      <table className="w-full text-xs" style={{ fontFamily: "monospace" }}>
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-3 py-2 text-left text-gray-600 font-bold">#</th>
            {COLS.map(c => (
              <th key={c} className={`px-3 py-2 text-left font-bold whitespace-nowrap
                ${highlightCols.includes(c) ? "text-yellow-300 bg-yellow-400/10" : "text-gray-400"}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-white/5 ${highlightRows.includes(i) ? "bg-yellow-400/10" : "hover:bg-white/[0.02]"}`}>
              <td className="px-3 py-1.5 text-gray-600">{i}</td>
              {COLS.map(c => (
                <td key={c} className={`px-3 py-1.5 whitespace-nowrap
                  ${highlightCols.includes(c) || highlightRows.includes(i) ? "text-yellow-200" : "text-gray-300"}
                  ${row[c] === null ? "text-rose-400 italic" : ""}`}>
                  {row[c] === null ? "NaN" : String(row[c]).length > 20 ? String(row[c]).slice(0,18)+"…" : String(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-600 px-4 py-2">{data.length} filas × {COLS.length} columnas</p>
    </div>
  );
}

// ── Demo: Creación de DataFrame ───────────────────────────────────
function CreacionDemo() {
  const [modo, setModo] = useState("dict");
  const [personas, setPersonas] = useState([
    { nombre:"Carlos", apellido:"Pérez",  dni:"1111111", edad:36 },
    { nombre:"Juan",   apellido:"García", dni:"123456",  edad:32 },
  ]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const agregar = () => {
    if (nombre.trim() && apellido.trim()) {
      setPersonas([...personas, { nombre: nombre.trim(), apellido: apellido.trim(), dni: Math.floor(Math.random()*9e6+1e6).toString(), edad: Math.floor(Math.random()*40+18) }]);
      setNombre(""); setApellido("");
    }
  };

  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
      <p className="text-sky-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Crear DataFrame</p>
      <div className="flex gap-2 mb-4">
        {["dict","lista"].map(m => (
          <button key={m} onClick={() => setModo(m)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all
              ${modo===m ? "border-sky-400 bg-sky-400/20 text-sky-300" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {m === "dict" ? "Desde diccionario" : "Desde lista de listas"}
          </button>
        ))}
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-3 mb-4 text-xs" style={{ fontFamily: "monospace", lineHeight: 1.9 }}>
        {modo === "dict" ? (
          <>
            <p><span className="text-emerald-400">dic</span><span className="text-white"> = {"{"}'nombre': {JSON.stringify(personas.map(p=>p.nombre))}, 'edad': {JSON.stringify(personas.map(p=>p.edad))}, ...{"}"}</span></p>
            <p><span className="text-emerald-400">df</span><span className="text-white"> = pd.</span><span className="text-sky-400">DataFrame</span><span className="text-white">(data=dic)</span></p>
          </>
        ) : (
          <>
            <p><span className="text-emerald-400">lista</span><span className="text-white"> = {JSON.stringify(personas.map(p=>[p.nombre,p.apellido,p.dni,p.edad]))}</span></p>
            <p><span className="text-emerald-400">df</span><span className="text-white"> = pd.</span><span className="text-sky-400">DataFrame</span><span className="text-white">(data=lista, columns=['nombre','apellido','dni','edad'])</span></p>
          </>
        )}
      </div>

      {/* Tabla resultado */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 mb-4">
        <table className="w-full text-xs" style={{ fontFamily: "monospace" }}>
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 text-left text-gray-600">#</th>
              {["nombre","apellido","dni","edad"].map(c => (
                <th key={c} className="px-3 py-2 text-left text-sky-300 font-bold">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {personas.map((p, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-3 py-1.5 text-gray-600">{i}</td>
                <td className="px-3 py-1.5 text-gray-300">{p.nombre}</td>
                <td className="px-3 py-1.5 text-gray-300">{p.apellido}</td>
                <td className="px-3 py-1.5 text-gray-300">{p.dni}</td>
                <td className="px-3 py-1.5 text-amber-300">{p.edad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="nombre"
          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs w-24 outline-none focus:border-sky-500/50" />
        <input value={apellido} onChange={e=>setApellido(e.target.value)} placeholder="apellido"
          onKeyDown={e=>e.key==="Enter"&&agregar()}
          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs w-28 outline-none focus:border-sky-500/50" />
        <button onClick={agregar}
          className="text-xs px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer">
          + Agregar fila
        </button>
      </div>
    </div>
  );
}

// ── Demo: Exploración del DataFrame ──────────────────────────────
function ExploracionDemo() {
  const [metodo, setMetodo] = useState("head");

  const metodos = {
    head:    { label: ".head(5)",    desc: "Primeras 5 filas",   data: titanicData.slice(0,5),   type: "table" },
    tail:    { label: ".tail(5)",    desc: "Últimas 5 filas",    data: titanicData.slice(-5),    type: "table" },
    shape:   { label: ".shape",      desc: "Dimensiones",        value: "(891, 12)",             type: "value" },
    columns: { label: ".columns",    desc: "Nombres de columnas", value: COLS.join(", "),        type: "value" },
    nulls:   { label: ".isnull().sum()", desc: "Valores nulos por columna", type: "nulls" },
    describe:{ label: ".describe()", desc: "Estadísticas descriptivas", type: "stats" },
  };

  const stats = {
    Age:  { count:714, mean:29.70, std:14.53, min:0.42, "25%":20.13, "50%":28.0, "75%":38.0, max:80 },
    Fare: { count:891, mean:32.20, std:49.69, min:0,    "25%":7.91,  "50%":14.45,"75%":31.0, max:512.33 },
  };

  const nulls = { PassengerId:0, Survived:0, Pclass:0, Name:0, Sex:0, Age:177, SibSp:0, Parch:0, Ticket:0, Fare:0, Cabin:687, Embarked:2 };

  const m = metodos[metodo];

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-emerald-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Explorar el dataset Titanic (891 pasajeros)</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(metodos).map(([k,v]) => (
          <button key={k} onClick={() => setMetodo(k)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all
              ${metodo===k ? "border-emerald-400 bg-emerald-400/20 text-emerald-300" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            datos{v.label}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-xs mb-3">→ {m.desc}</p>

      {m.type === "table" && <DataFrameTable data={m.data} maxRows={5} />}

      {m.type === "value" && (
        <div className="bg-black/40 rounded-xl border border-white/10 p-4 font-mono text-sm">
          <span className="text-amber-300">{m.value}</span>
        </div>
      )}

      {m.type === "nulls" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(nulls).map(([col, n]) => (
            <div key={col} className={`rounded-lg border p-3 flex justify-between items-center
              ${n > 0 ? "border-rose-500/30 bg-rose-500/5" : "border-white/10 bg-white/[0.02]"}`}>
              <span className="text-xs font-mono text-gray-400">{col}</span>
              <span className={`font-bold text-sm font-mono ${n > 0 ? "text-rose-300" : "text-emerald-300"}`}>{n}</span>
            </div>
          ))}
        </div>
      )}

      {m.type === "stats" && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-white/10 rounded-xl" style={{ fontFamily: "monospace" }}>
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-3 py-2 text-left text-violet-300">stat</th>
                <th className="px-3 py-2 text-right text-sky-300">Age</th>
                <th className="px-3 py-2 text-right text-amber-300">Fare</th>
              </tr>
            </thead>
            <tbody>
              {["count","mean","std","min","25%","50%","75%","max"].map(s => (
                <tr key={s} className="border-b border-white/5">
                  <td className="px-3 py-1.5 text-violet-300 font-bold">{s}</td>
                  <td className="px-3 py-1.5 text-right text-gray-300">{stats.Age[s]}</td>
                  <td className="px-3 py-1.5 text-right text-gray-300">{stats.Fare[s]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Demo: loc / iloc ──────────────────────────────────────────────
function AccesoDemo() {
  const [tipo, setTipo] = useState("col-name");
  const [result, setResult] = useState(null);

  const accesos = [
    { k:"col-name",    label:'datos["Name"]',        desc:"Columna por nombre → Serie", cols:["Name"] },
    { k:"col-2names",  label:'datos[["Name","Sex"]]', desc:"Varias columnas → DataFrame", cols:["Name","Sex"] },
    { k:"iloc-col",    label:"datos.iloc[:,[3,4]]",   desc:"Columnas por índice entero", cols:["Name","Sex"] },
    { k:"loc-row",     label:"datos.loc[0]",          desc:"Fila 0 por etiqueta → Serie", rows:[0] },
    { k:"loc-rows",    label:"datos.loc[[0,1]]",      desc:"Filas 0 y 1 por etiqueta", rows:[0,1] },
    { k:"loc-both",    label:'datos.loc[[0,1],["Name","Sex"]]', desc:"Filas y columnas por etiqueta", rows:[0,1], cols:["Name","Sex"] },
    { k:"iloc-rows",   label:"datos.iloc[1:10:3]",    desc:"Filas 1,4,7 por posición (salto 3)", rows:[1,4,7] },
  ];

  const curr = accesos.find(a => a.k === tipo);

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
      <p className="text-violet-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — .loc vs .iloc</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {accesos.map(a => (
          <button key={a.k} onClick={() => setTipo(a.k)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono transition-all
              ${tipo===a.k ? "border-violet-400 bg-violet-400/20 text-violet-300" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {a.label}
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-xs mb-3">→ {curr.desc}</p>
      <DataFrameTable data={titanicData} highlightCols={curr.cols||[]} highlightRows={curr.rows||[]} maxRows={5} />
    </div>
  );
}

// ── Demo: Filtrado ────────────────────────────────────────────────
function FiltradoDemo() {
  const [filtro, setFiltro] = useState("menores");

  const filtros = {
    menores:  { label: 'df[df["Age"]<18]',               fn: r => r.Age !== null && r.Age < 18,              desc: "Pasajeros menores de edad" },
    jovenes:  { label: '(18<df["Age"]) & (df["Age"]<25)',fn: r => r.Age !== null && r.Age > 18 && r.Age < 25,desc: "Entre 18 y 25 años" },
    nulos:    { label: 'df.loc[df.Age.isnull()]',         fn: r => r.Age === null,                            desc: "Pasajeros con edad desconocida (NaN)" },
    survived: { label: 'df[df["Survived"]==1]',           fn: r => r.Survived === 1,                         desc: "Sobrevivientes" },
    pclass1:  { label: 'df[df["Pclass"]==1]',             fn: r => r.Pclass === 1,                           desc: "Primera clase" },
    female:   { label: 'df[df["Sex"]=="female"]',         fn: r => r.Sex === "female",                       desc: "Pasajeras femeninas" },
  };

  const curr = filtros[filtro];
  const filtered = titanicData.filter(curr.fn);

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
      <p className="text-rose-300 text-xs font-bold mb-4 uppercase tracking-widest">🎮 Demo — Filtrado de datos</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(filtros).map(([k,v]) => (
          <button key={k} onClick={() => setFiltro(k)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono transition-all
              ${filtro===k ? "border-rose-400 bg-rose-400/20 text-rose-300" : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            {k}
          </button>
        ))}
      </div>

      <div className="bg-black/40 rounded-xl border border-white/10 p-3 font-mono text-xs mb-3">
        <p className="text-rose-300">{curr.label}</p>
        <p className="text-gray-500">→ {curr.desc}: <span className="text-amber-300">{filtered.length} filas</span> de {titanicData.length}</p>
      </div>

      <DataFrameTable data={filtered} maxRows={5} />
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
    sky:    { bg:"bg-sky-500/10",    border:"border-sky-500/20",    text:"text-sky-300" },
    emerald:{ bg:"bg-emerald-500/10",border:"border-emerald-500/20",text:"text-emerald-300" },
    violet: { bg:"bg-violet-500/10", border:"border-violet-500/20", text:"text-violet-300" },
    amber:  { bg:"bg-amber-500/10",  border:"border-amber-500/20",  text:"text-amber-300" },
    rose:   { bg:"bg-rose-500/10",   border:"border-rose-500/20",   text:"text-rose-300" },
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
export default function Pandas({ onBack }) {
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
        <div className="absolute top-1/2 left-0 w-[200px] h-[200px] bg-emerald-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Navbar */}
        <nav className="flex items-center gap-3 mb-14 fade-up">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">← Inicio</button>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/40" style={{ fontFamily: "monospace" }}>Python</span>
          <span className="text-white/20">/</span>
          <span className="text-sm text-sky-400" style={{ fontFamily: "monospace" }}>Pandas</span>
        </nav>

        {/* Header */}
        <header className="mb-14 fade-up">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border mb-5"
            style={{ borderColor: "#0ea5e9", color: "#0ea5e9", fontFamily: "monospace" }}>
            🐍 Módulo III · Procesamiento de datos
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Introducción a{" "}
            <span style={{
              background: "linear-gradient(135deg, #0ea5e9, #a855f7, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Pandas</span>
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            La librería esencial para análisis de datos. Crea y manipula
            <code className="text-sky-400 bg-sky-500/10 px-1 rounded mx-1">DataFrames</code>,
            explora datasets reales y filtra datos con
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">.loc</code> e
            <code className="text-violet-400 bg-violet-500/10 px-1 rounded mx-1">.iloc</code>.
          </p>
        </header>

        {/* Índice */}
        <div className="flex flex-wrap gap-2 mb-14 fade-up">
          {[
            { href: "#que-es",    label: "❓ ¿Qué es?" },
            { href: "#crear",     label: "🏗️ Crear DF" },
            { href: "#cargar",    label: "📂 Cargar datos" },
            { href: "#explorar",  label: "🔍 Explorar" },
            { href: "#acceso",    label: "🎯 loc / iloc" },
            { href: "#filtrar",   label: "🔎 Filtrar" },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* ══ SECCIÓN 1 — ¿Qué es Pandas? ══ */}
        <section id="que-es" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8">
          <SectionHeader icon="❓" title="¿Qué es Pandas?" color="#0ea5e9" />
          <p className="text-gray-400 mb-5">
            <strong className="text-white">pandas</strong> es una librería construida sobre <strong className="text-white">NumPy</strong> que nos da estructuras de datos y herramientas para analizar grandes volúmenes de datos.
            Permite cargar, limpiar, filtrar, reducir y representar datos reales.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { icon:"📊", title:"Series",    desc:"Arreglo unidimensional con etiquetas. Como una columna de Excel.", color:"#0ea5e9" },
              { icon:"🗂️", title:"DataFrame", desc:"Tabla de datos bidimensional con filas y columnas etiquetadas.",  color:"#a855f7" },
              { icon:"🔗", title:"Integración",desc:"Se articula sobre NumPy y es compatible con Matplotlib.",        color:"#10b981" },
            ].map(c => (
              <div key={c.title} className="rounded-xl border p-4" style={{ borderColor:`${c.color}30`, background:`${c.color}08` }}>
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="font-bold text-sm mb-1" style={{ color:c.color }}>{c.title}</p>
                <p className="text-gray-400 text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
          <CodeBlock>
            <p><span className="text-violet-400">import</span><span className="text-white"> pandas </span><span className="text-violet-400">as</span><span className="text-sky-400"> pd</span><span className="text-gray-500 ml-2"># alias pd es la convención</span></p>
          </CodeBlock>
        </section>

        {/* ══ SECCIÓN 2 — Crear DataFrame ══ */}
        <section id="crear" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"80ms" }}>
          <SectionHeader icon="🏗️" title="Creando un DataFrame" color="#a855f7" />
          <p className="text-gray-400 mb-5">Existen varias formas de crear un DataFrame. Las más comunes son desde un <strong className="text-white">diccionario</strong> o desde una <strong className="text-white">lista de listas</strong>.</p>
          <CreacionDemo />
        </section>

        {/* ══ SECCIÓN 3 — Cargar datos ══ */}
        <section id="cargar" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"120ms" }}>
          <SectionHeader icon="📂" title="Cargar datos desde archivos" color="#10b981" />
          <p className="text-gray-400 mb-5">
            Pandas permite importar datos desde múltiples formatos. El más común es el <strong className="text-white">CSV</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              { fn: "pd.read_csv()",   ext: ".csv",  desc: "Archivos separados por comas",    color:"#10b981" },
              { fn: "pd.read_excel()", ext: ".xlsx", desc: "Hojas de cálculo Excel",          color:"#0ea5e9" },
              { fn: "pd.read_json()",  ext: ".json", desc: "Formato JSON",                    color:"#f59e0b" },
              { fn: "pd.read_sql()",   ext: "DB",    desc: "Consultas a base de datos SQL",   color:"#a855f7" },
            ].map(f => (
              <div key={f.fn} className="rounded-xl border p-4" style={{ borderColor:`${f.color}30`, background:`${f.color}08` }}>
                <code className="text-sm font-bold block mb-1" style={{ color:f.color }}>{f.fn}</code>
                <p className="text-xs text-gray-500">{f.ext} — {f.desc}</p>
              </div>
            ))}
          </div>
          <CodeBlock>
            <p className="text-gray-500"># Cargar dataset del Titanic</p>
            <p><span className="text-emerald-400">datos</span><span className="text-white"> = pd.</span><span className="text-sky-400">read_csv</span><span className="text-white">(</span><span className="text-green-300">"data/titanic.csv"</span><span className="text-white">)</span></p>
          </CodeBlock>
          <Tip color="emerald">
            Pandas también puede leer directamente desde una URL: <code>pd.read_csv("https://…/data.csv")</code>
          </Tip>
        </section>

        {/* ══ SECCIÓN 4 — Exploración ══ */}
        <section id="explorar" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"160ms" }}>
          <SectionHeader icon="🔍" title="Explorando el DataFrame" color="#f59e0b" />
          <p className="text-gray-400 mb-5">Estos métodos permiten entender la estructura y calidad de los datos antes de analizarlos.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { fn:".head(n)",        desc:"Primeras n filas (default 5)",           color:"#10b981" },
              { fn:".tail(n)",        desc:"Últimas n filas",                        color:"#10b981" },
              { fn:".shape",          desc:"Tupla (filas, columnas)",                color:"#0ea5e9" },
              { fn:".columns",        desc:"Nombres de las columnas",                color:"#0ea5e9" },
              { fn:".info()",         desc:"Tipos y valores no-nulos por columna",   color:"#a855f7" },
              { fn:".isnull().sum()", desc:"Cuenta valores NaN por columna",         color:"#f43f5e" },
              { fn:".count()",        desc:"Valores no-nulos por columna",           color:"#f59e0b" },
              { fn:".describe()",     desc:"Estadísticas: count, mean, std, min, max",color:"#f59e0b" },
              { fn:".mean()",         desc:"Media por columna",                      color:"#f59e0b" },
              { fn:".quantile(0.25)", desc:"Cuartil 25% de cada columna",           color:"#f59e0b" },
              { fn:".fillna(0)",      desc:"Rellena NaN con el valor indicado",      color:"#6366f1" },
              { fn:".set_index(col)", desc:"Define una columna como índice",         color:"#6366f1" },
            ].map(item => (
              <div key={item.fn} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <code className="text-xs font-bold block mb-1" style={{ color:item.color }}>{item.fn}</code>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
          <ExploracionDemo />
        </section>

        {/* ══ SECCIÓN 5 — loc e iloc ══ */}
        <section id="acceso" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"200ms" }}>
          <SectionHeader icon="🎯" title=".loc e .iloc — Acceso a datos" color="#a855f7" />
          <p className="text-gray-400 mb-5">
            Dos métodos principales para seleccionar filas y columnas:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <code className="text-violet-300 font-bold text-sm block mb-2">.loc[ ]</code>
              <p className="text-gray-400 text-xs mb-3">Accede por <strong className="text-white">etiquetas</strong> (nombres de columna / índice del DataFrame)</p>
              <div className="bg-black/30 rounded-lg p-3 text-xs font-mono space-y-1">
                <p><span className="text-violet-300">datos.loc[0]</span><span className="text-gray-500"> → fila 0</span></p>
                <p><span className="text-violet-300">datos.loc[[0,1]]</span><span className="text-gray-500"> → filas 0 y 1</span></p>
                <p><span className="text-violet-300">datos.loc[[0,1],["Name","Sex"]]</span></p>
              </div>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <code className="text-sky-300 font-bold text-sm block mb-2">.iloc[ ]</code>
              <p className="text-gray-400 text-xs mb-3">Accede por <strong className="text-white">posición entera</strong> (como índices de lista: 0, 1, 2…)</p>
              <div className="bg-black/30 rounded-lg p-3 text-xs font-mono space-y-1">
                <p><span className="text-sky-300">datos.iloc[:,3]</span><span className="text-gray-500"> → col 3</span></p>
                <p><span className="text-sky-300">datos.iloc[:,[3,4]]</span><span className="text-gray-500"> → cols 3 y 4</span></p>
                <p><span className="text-sky-300">datos.iloc[1:10:3]</span><span className="text-gray-500"> → filas 1,4,7</span></p>
              </div>
            </div>
          </div>
          <AccesoDemo />
          <div className="mt-4">
            <Tip color="violet">
              <strong>Regla rápida:</strong> usa <code>.loc</code> cuando conoces los nombres y <code>.iloc</code> cuando conoces las posiciones numéricas.
              Con <code>.loc[[0]]</code> (doble corchete) obtienes un <strong>DataFrame</strong>; con <code>.loc[0]</code> obtienes una <strong>Serie</strong>.
            </Tip>
          </div>
        </section>

        {/* ══ SECCIÓN 6 — Filtrado ══ */}
        <section id="filtrar" className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 scroll-mt-8" style={{ animationDelay:"240ms" }}>
          <SectionHeader icon="🔎" title="Filtrado de Datos" color="#f43f5e" />
          <p className="text-gray-400 mb-5">
            Filtra filas según condiciones booleanas. Puedes combinar condiciones con <code className="text-rose-400 bg-rose-500/10 px-1 rounded">&</code> (AND) y <code className="text-rose-400 bg-rose-500/10 px-1 rounded">|</code> (OR).
          </p>
          <CodeBlock>
            <p className="text-gray-500"># Menores de edad</p>
            <p><span className="text-emerald-400">datos</span><span className="text-white">[datos[</span><span className="text-green-300">"Age"</span><span className="text-white">] &lt; </span><span className="text-amber-300">18</span><span className="text-white">]</span></p>
            <p className="mt-1 text-gray-500"># Entre 18 y 25 años (& = AND)</p>
            <p><span className="text-emerald-400">datos</span><span className="text-white">[(</span><span className="text-amber-300">18</span><span className="text-white"> &lt; datos[</span><span className="text-green-300">"Age"</span><span className="text-white">]) </span><span className="text-rose-400">&</span><span className="text-white"> (datos[</span><span className="text-green-300">"Age"</span><span className="text-white">] &lt; </span><span className="text-amber-300">25</span><span className="text-white">)]</span></p>
            <p className="mt-1 text-gray-500"># Valores nulos (NaN)</p>
            <p><span className="text-emerald-400">datos</span><span className="text-white">.loc[datos.Age.</span><span className="text-sky-400">isnull</span><span className="text-white">()]</span></p>
            <p className="mt-1 text-gray-500"># Sin duplicados</p>
            <p><span className="text-emerald-400">datos</span><span className="text-white">[datos.index.</span><span className="text-sky-400">duplicated</span><span className="text-white">()]</span></p>
          </CodeBlock>
          <FiltradoDemo />
          <div className="mt-4">
            <Tip color="rose">
              Siempre usa paréntesis al combinar condiciones: <code>(cond1) & (cond2)</code>. Sin paréntesis, Python puede evaluar el operador <code>&</code> con precedencia incorrecta.
            </Tip>
          </div>
        </section>

        {/* Resumen */}
        <section className="mb-10 fade-up rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" style={{ animationDelay:"280ms" }}>
          <SectionHeader icon="⚡" title="Resumen rápido" color="#6366f1" />
          <div className="space-y-3">
            {[
              { code:"pd.DataFrame(dict)",      desc:"Crea un DF desde un diccionario (clave=columna).",       color:"#0ea5e9" },
              { code:"pd.read_csv('file.csv')", desc:"Carga un CSV como DataFrame.",                           color:"#10b981" },
              { code:"df.head(n)",              desc:"Muestra las primeras n filas.",                          color:"#f59e0b" },
              { code:"df.shape",                desc:"Devuelve (n_filas, n_columnas).",                        color:"#f59e0b" },
              { code:"df.isnull().sum()",        desc:"Cuenta valores NaN por columna.",                       color:"#f43f5e" },
              { code:"df.describe()",           desc:"Estadísticas descriptivas de columnas numéricas.",       color:"#f59e0b" },
              { code:"df['col']",               desc:"Selecciona una columna → Serie.",                        color:"#a855f7" },
              { code:"df[['col1','col2']]",     desc:"Selecciona varias columnas → DataFrame.",               color:"#a855f7" },
              { code:"df.loc[fila, col]",       desc:"Acceso por etiqueta de fila y/o columna.",              color:"#a855f7" },
              { code:"df.iloc[i, j]",           desc:"Acceso por posición entera de fila y columna.",         color:"#0ea5e9" },
              { code:"df[df['col']>valor]",     desc:"Filtra filas donde la condición sea True.",              color:"#f43f5e" },
              { code:"df.fillna(0)",            desc:"Reemplaza NaN por el valor indicado.",                   color:"#6366f1" },
            ].map(row => (
              <div key={row.code} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <code className="text-sm font-bold whitespace-nowrap mt-0.5 shrink-0" style={{ color:row.color }}>{row.code}</code>
                <p className="text-gray-400 text-sm">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">← Volver al inicio</button>
          <span className="text-xs text-white/20" style={{ fontFamily:"monospace" }}>Python · Pandas</span>
        </div>

      </div>
    </div>
  );
}