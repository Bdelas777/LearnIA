import { useState } from "react";

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
      { name: "NumPy", url: "/numpy" },
      { name: "Pandas", url: "/pandas" },
      { name: "Scikit-learn", url: "/sklearn" },
      { name: "Matplotlib", url: "/matplotlib" },
    ],
  },
  {
    id: "visual",
    tag: "02",
    title: "Herramientas Visuales",
    subtitle: "IA sin código",
    icon: "🎨",
    accent: "#8b5cf6",
    desc: "Plataformas de arrastrar y soltar para crear IA sin escribir código.",
    pills: [
      { name: "Teachable Machine", url: "/teachable-machine" },
      { name: "KNIME", url: "/knime" },
      { name: "Weka", url: "/weka" },
      { name: "Orange", url: "/orange" },
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
      { name: "Regresión", url: "/regresion" },
      { name: "Clasificación", url: "/clasificacion" },
      { name: "Clustering", url: "/clustering" },
      { name: "Random Forest", url: "/random-forest" },
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
      { name: "TensorFlow", url: "/tensorflow" },
      { name: "PyTorch", url: "/pytorch" },
      { name: "CNN", url: "/cnn" },
      { name: "Transformers", url: "/transformers" },
    ],
  },
];

function ConceptCard({ concept }) {
  const [hovered, setHovered] = useState(false);

  const handleRedirect = (url) => {
    window.location.href = url;
  };

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
            className={`absolute inset-0 rounded-2xl opacity-0 transition duration-700 ${
              hovered ? "opacity-100" : ""
            }`}
            style={{
              background: `radial-gradient(circle at top right, ${concept.accent}30, transparent 60%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            
            {/* Header */}
            <div className="flex justify-between mb-4">
              <span
                className="text-xs px-2 py-1 rounded-full border font-mono"
                style={{
                  borderColor: concept.accent,
                  color: concept.accent,
                }}
              >
                {concept.tag}
              </span>
              <span className="text-2xl">{concept.icon}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold mb-1 text-white">
              {concept.title}
            </h2>
            <p className="text-sm mb-3" style={{ color: concept.accent }}>
              {concept.subtitle}
            </p>

            {/* Desc */}
            <p className="text-sm text-gray-400 flex-1 mb-4">
              {concept.desc}
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {concept.pills.map((pill) => (
                <button
                  key={pill.name}
                  onClick={() => handleRedirect(pill.url)}
                  className="text-xs px-3 py-1.5 rounded-md border border-white/10
                  bg-white/5 hover:bg-white/10
                  transition-all duration-300
                  hover:scale-105 active:scale-95"
                  style={{
                    color: concept.accent,
                  }}
                >
                  {pill.name}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) both;
        }
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
            <span className="text-sm text-white/70 font-mono">
              conceptos.ia
            </span>
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept, i) => (
            <div key={concept.id} className="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <ConceptCard concept={concept} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-6 border-t border-white/10 text-xs text-white/30 flex justify-between">
          <span>conceptos.ia © 2024</span>
          <span>React + Tailwind</span>
        </footer>
      </div>
    </div>
  );
}