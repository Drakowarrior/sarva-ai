import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./DislikeFeedbackModal.css";

const OPTIONS = [
  "Incorrect Information",
  "Not Relevant",
  "Incomplete Answer",
  "Too Long",
  "Too Short",
  "Other"
];

function DislikeFeedbackModal({ isOpen, onClose, onSubmit, onSkip }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [comments, setComments] = useState("");
  const modalRef = useRef(null);

  // Focus trap and escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedOptions, comments);
    // Reset state
    setSelectedOptions([]);
    setComments("");
  };

  const handleSkipClick = () => {
    onSkip();
    // Reset state
    setSelectedOptions([]);
    setComments("");
  };

  return (
    <AnimatePresence>
      <div className="dislike-modal-overlay" onClick={onClose}>
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="dislike-modal-card"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Dislike response feedback form"
        >
          <div className="dislike-modal-header">
            <h3>Feedback on Response</h3>
            <button
              className="dislike-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="dislike-modal-body">
            <p className="dislike-modal-intro">
              We're sorry the response wasn't helpful. Could you tell us what went wrong?
            </p>

            {/* Checkbox Options Grid */}
            <div className="dislike-options-grid" role="group" aria-label="Select reasons for dislike">
              {OPTIONS.map((option) => {
                const isSelected = selectedOptions.includes(option);
                return (
                  <label
                    key={option}
                    className={`dislike-option-label ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionToggle(option)}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Comments Area */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="dislike-comments" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                Additional comments (Optional)
              </label>
              <textarea
                id="dislike-comments"
                className="dislike-textarea"
                placeholder="Help us improve. What would have made this response better?..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                maxLength={500}
              />
            </div>

            {/* Actions */}
            <div className="dislike-modal-actions">
              <button
                type="submit"
                className="dislike-submit-btn"
              >
                Submit
              </button>
              <button
                type="button"
                className="dislike-skip-btn"
                onClick={handleSkipClick}
              >
                Skip
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DislikeFeedbackModal;
