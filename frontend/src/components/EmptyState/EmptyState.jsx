import { FiCode, FiFileText, FiGlobe, FiLayers, FiPlay, FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";

const CARDS = [
  {
    title: "Build a React App",
    description: "Create a modern template with routes",
    prompt: "Show me how to build a modern React 19 app with Vite and React Router from scratch.",
    icon: FiCode,
    color: "var(--accent)"
  },
  {
    title: "Review Resume / Document",
    description: "Analyze technical layout & key bullet points",
    prompt: "Act as an expert technical recruiter and reviewer. Analyze my document details and tell me how to make it more professional for enterprise roles.",
    icon: FiFileText,
    color: "var(--sarva-secondary-teal, #14B8A6)"
  },
  {
    title: "System Architecture & API",
    description: "Design endpoints and database schema",
    prompt: "Provide a RESTful API design spec and MongoDB schema for a multi-tenant enterprise system.",
    icon: FiGlobe,
    color: "var(--accent)"
  },
  {
    title: "Explain Algorithms & Data",
    description: "Graph traversal, DP, and data structures",
    prompt: "Explain Graph traversal algorithms (BFS and DFS) with Python code implementations.",
    icon: FiLayers,
    color: "var(--sarva-secondary-teal, #14B8A6)"
  },
  {
    title: "Python Data Pipelines",
    description: "List comprehensions to async handlers",
    prompt: "Show me Python list comprehensions, async generator functions, and clean data processing pipelines.",
    icon: FiPlay,
    color: "var(--accent)"
  },
  {
    title: "Research Paper Insights",
    description: "Analyze abstract and extract key findings",
    prompt: "Analyze the abstract of a research paper and output its key claims, methodology, and limitations.",
    icon: FiBookOpen,
    color: "var(--sarva-secondary-teal, #14B8A6)"
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
