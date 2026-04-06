
import { useState } from "react";
import VarNumericas from './components/VarNumericas';
import Variables from "./components/Variables";
import Estructuras from "./components/Estructuras";
import If from "./components/If";
import For from "./components/For";
import While from './components/While'
import Funciones from "./components/Funciones";
import POO from "./components/POO";
import NumPy from "./components/Numpy";
import Pandas from "./components/Pandas";
import Matplotlib from "./components/Matplotlib";
import ScikitLearn from "./components/ScikitLearn";
import MatematicasEstadistica from "./components/Estadistica";
import ML from "./components/ML";
import Clasificacion from "./components/Clasificacion";
import Regresion from "./components/Regresion";
import Lineal from "./components/Lineal";
import Polinomial from "./components/Polinomial";
import Logistica from "./components/Logistica";
const concepts = [
  {
    id: "python",
    tag: "01",
    title: "Python",
    subtitle: "El lenguaje de la IA",
    icon: "🐍",
    accent: "#10b981",
    desc: "El lenguaje de programación más utilizado en inteligencia artificial.",
    pills: [
      { name: "Variables Numéricas", page: "var-numericas" }, 
      { name: "Variables",              page: 'var'},
      { name: "Estructuras",        page: 'estruc' },
      { name: "If else",          page: 'if' },
      { name: "While",          page:  'while'  },
      { name: "For",          page: 'for' },
      { name: "Funciones",          page: "funciones" },
      { name: "POO",          page: "poo" },
    ],
  },
  {
    id: "visual",
    tag: "02",
    title: "Herramientas Visuales y procesamiento",
    subtitle: "Como visualizar y procesar datos",
    icon: "🎨",
    accent: "#8b5cf6",
    desc: "Son las herramientas visuales y de procesamiento para escribir el codigo y visualizar las graficas.",
    pills: [
      { name: "Numpy", page: "numpy" },
      { name: "Pandas",             page: "pandas" },
      { name: "Matplotlib",              page: "matplotlib" },
      { name: "Scikit-learn",            page: "scikit-learn" },
      { name: "Matematicas y estadistica",            page: "matematicas-estadistica" },
    ],
  },
  {
    id: "ml",
    tag: "03",
    title: "Machine Learning",
    subtitle: "Aprendizaje automático",
    icon: "⚙️",
    accent: "#0ea5e9",
    desc: "Los sistemas aprenden a partir de datos sin ser programados explícitamente.",
    pills: [
      { name: "Introduccion al ML",    page: 'ml' },
      { name: "Evaluacion de modelos de Clasificacion",    page: "clasificacion" },
      { name: "Evaluacion de modelos de Regresion",    page: "regresion" },
      { name: "Regresión lineal",    page: "lineal" },
      { name: "Regresión polinomial",    page: "polinomial" },
      { name: "Regresión logistica",    page: "logistica" },
      { name: "Clasificador de Naives Bayes",page: null },
      { name: "KNN",   page: null },
      { name: "KMeans",   page: null },
      { name: "Maquinas de Soporte Vectorial",page: null },
      { name: "Analisis de Componentes Principales",page: null },
      { name: "Regularizacion de Modelos Lineales",page: null },
      { name: "Optimizacion de Hiperparametros",page: null },
    ],
  },
  {
    id: "dl",
    tag: "04",
    title: "Deep Learning",
    subtitle: "Redes neuronales profundas",
    icon: "🧠",
    accent: "#f43f5e",
    desc: "Redes neuronales con múltiples capas para aprender patrones complejos.",
    pills: [
      { name: "Introduccion a las redes neuronales/Percetron Sencillo",  page: null },
      { name: "BackPropagation",     page: null },
      { name: "Deep learning con Keras",         page: null },
      { name: "Teoria de redes convuncionales",page: null },
      { name: "Practica de redes convuncionales",page: null },
    ],
  },
];

// Router simple: mapea el id de página → componente
// Cuando agregues una nueva página, solo añádela aquí.

function PageRouter({ page, onBack }) {
  if (page === "var-numericas") return <VarNumericas onBack={onBack} />;
  if (page === "var") return <Variables onBack={onBack} />;
  if (page === "estruc") return <Estructuras onBack={onBack} />;
  if (page === "if") return <If onBack={onBack} />;
  if (page === "for") return <For onBack={onBack} />;
  if (page === "while") return <While onBack={onBack} />;
  if (page === "funciones") return <Funciones onBack={onBack} />;
  if (page === "poo") return <POO onBack={onBack} />;
  if (page === "numpy") return <NumPy onBack={onBack} />;
  if (page === "pandas") return <Pandas onBack={onBack} />;
  if (page === "matplotlib") return <Matplotlib onBack={onBack} />;
  if (page === "scikit-learn") return <ScikitLearn onBack={onBack} />;
  if (page === "matematicas-estadistica") return <MatematicasEstadistica onBack={onBack} />;
  if (page === "ml") return <ML onBack={onBack} />;
  if (page === "clasificacion") return <Clasificacion onBack={onBack} />;
  if (page === "regresion") return <Regresion onBack={onBack} />;
  if (page === "polinomial") return <Polinomial onBack={onBack} />;
  if (page === "lineal") return <Lineal onBack={onBack} />;
  if (page === "logistica") return <Logistica onBack={onBack} />;

  return null;
}

// ConceptCard
function ConceptCard({ concept, onNavigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-2xl p-[1px]"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${concept.accent}, transparent)`
            : "rgba(255,255,255,0.05)",
        }}
      >
        <div className="rounded-2xl bg-[#0b0b0b]/90 backdrop-blur-xl h-full p-6 border border-white/10">

          {/* Glow */}
          <div
            className={`absolute inset-0 rounded-2xl transition duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
            style={{ background: `radial-gradient(circle at top right, ${concept.accent}30, transparent 60%)` }}
          />

          <div className="relative z-10 flex flex-col h-full">

            {/* Header */}
            <div className="flex justify-between mb-4">
              <span
                className="text-xs px-2 py-1 rounded-full border font-mono"
                style={{ borderColor: concept.accent, color: concept.accent }}
              >
                {concept.tag}
              </span>
              <span className="text-2xl">{concept.icon}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold mb-1 text-white">{concept.title}</h2>
            <p className="text-sm mb-3" style={{ color: concept.accent }}>{concept.subtitle}</p>

            {/* Desc */}
            <p className="text-sm text-gray-400 flex-1 mb-4">{concept.desc}</p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {concept.pills.map((pill) => (
                <button
                  key={pill.name}
                  onClick={() => pill.page && onNavigate(pill.page)}
                  className={`text-xs px-3 py-1.5 rounded-md border border-white/10 bg-white/5
                    transition-all duration-300 hover:scale-105 active:scale-95
                    ${pill.page ? "hover:bg-white/10 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  style={{ color: concept.accent }}
                  title={pill.page ? `Ir a ${pill.name}` : "Próximamente"}
                >
                  {pill.name}
                  {pill.page && <span className="ml-1 opacity-60">→</span>}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// App principal
export default function App() {
  // currentPage: null = página principal | "var-numericas" = sub-página
  const [currentPage, setCurrentPage] = useState(null);

  // Si hay una página activa, renderiza su componente
  if (currentPage) {
    return <PageRouter page={currentPage} onBack={() => setCurrentPage(null)} />;
  }

  // Página principal
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
        .fade-up { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-rose-900/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">

        {/* Navbar */}
        <nav className="flex justify-between mb-16 fade-up">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <span className="text-sm text-white/70 font-mono">conceptos.ia</span>
          </div>
        </nav>

        {/* Hero */}
        <header className="mb-16 fade-up">
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Aprende <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Explora los pilares fundamentales de la IA moderna de forma clara e interactiva.
          </p>
        </header>

        {/* Grid de conceptos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept, i) => (
            <div key={concept.id} className="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <ConceptCard concept={concept} onNavigate={setCurrentPage} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-6 border-t border-white/10 text-xs text-white/30 flex justify-between">
          <span>conceptos.ia © 2026 by Bernardo de la Sierra based on  Python: Machine Learning de Udemy</span>
          <span>Created with React + Tailwind</span>
        </footer>

      </div>
    </div>
  );
}