import { FiCode, FiFileText, FiGlobe, FiLayers, FiPlay, FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";

const CARDS = [
  {
    title: "Build a React App",
    description: "Create a modern template with routes",
    prompt: "Show me how to build a modern React 19 app with Vite and React Router from scratch.",
    icon: FiCode,
    color: "#38bdf8"
  },
  {
    title: "Review My Resume",
    description: "Get feedback on layout & bullet points",
    prompt: "Act as an expert technical recruiter and resume reviewer. Review my resume details and tell me how to make it more professional for FAANG jobs.",
    icon: FiFileText,
    color: "#ec4899"
  },
  {
    title: "Create Portfolio Website",
    description: "Show layout suggestions and source code",
    prompt: "Generate a beautiful portfolio website design using vanilla HTML and CSS. Provide source code.",
    icon: FiGlobe,
    color: "#10b981"
  },
  {
    title: "Explain DSA",
    description: "Graph, Dynamic Programming, Trees",
    prompt: "Explain the concepts of Graph traversal algorithms (BFS and DFS) with Python code implementations.",
    icon: FiLayers,
    color: "#a855f7"
  },
  {
    title: "Learn Python",
    description: "Basics to advanced list comprehensions",
    prompt: "I want to learn Python. Teach me list comprehensions, decorators, and basic generator functions with code snippets.",
    icon: FiPlay,
    color: "#f59e0b"
  },
  {
    title: "Generate Research Summary",
    description: "Input abstract and extract findings",
    prompt: "Analyze the abstract of a research paper and output its key claims, methodology, and limitations.",
    icon: FiBookOpen,
    color: "#ef4444"
  }
];

function EmptyState({ onSelectPrompt }) {
  return (
    <div className="empty-state-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
      >
        <img 
          src="/logo.jpg" 
          alt="SARVA AI Logo" 
          style={{ 
            width: "80px", 
            height: "80px", 
            borderRadius: "20px", 
            boxShadow: "0 8px 32px rgba(14, 165, 233, 0.2)",
            border: "2px solid var(--border)"
          }} 
        />
        <h1 className="empty-title" style={{ margin: 0 }}>SARVA AI</h1>
        <p className="empty-subtitle" style={{ marginTop: "4px" }}>How can I help you today?</p>
      </motion.div>

      <div className="prompt-grid">
        {CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              className="prompt-card"
              onClick={() => onSelectPrompt(card.prompt)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: `${card.color}15`,
                    color: card.color,
                    fontSize: "1.2rem"
                  }}
                >
                  <Icon />
                </span>
                <h4>{card.title}</h4>
              </div>
              <p>{card.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default EmptyState;
