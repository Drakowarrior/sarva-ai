import { useState, useEffect, useRef } from "react";
import { useBlocker, useLocation } from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "../../context/SessionContext";
import api from "../../services/api";
import toast from "react-hot-toast";
import "./FeedbackModal.css";

function FeedbackModal() {
  const {
    isFeedbackOpen,
    setIsFeedbackOpen,
    pendingNavigation,
    setPendingNavigation,
    feedbackPromptMessage,
    messages,
    currentSession,
    userId
  } = useSession();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const modalRef = useRef(null);
  const location = useLocation();

  // Intercept in-app routing changes (e.g. going to / or /auth from /chat)
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    // Don't block if there are no messages
    if (messages.length === 0) {
      return false;
    }
    // Block if leaving from "/chat" route to a different route
    return currentLocation.pathname === "/chat" && currentLocation.pathname !== nextLocation.pathname;
  });

  // Open modal if React Router blocker is activated
  useEffect(() => {
    if (blocker.state === "blocked") {
      setPendingNavigation(() => blocker.proceed);
      setIsFeedbackOpen(true);
    }
  }, [blocker.state, setPendingNavigation, setIsFeedbackOpen]);

  // Hook into mouseleave for exit intent
  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Only track exit intent when on the chat page with messages
      if (
        location.pathname !== "/chat" ||
        messages.length === 0
      ) {
        return;
      }
      // Detect exit intent (mouse leaving from top of window)
      if (e.clientY < 15) {
        setIsFeedbackOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [location.pathname, messages, setIsFeedbackOpen]);

  // Hook into beforeunload to ask for prompt if they close/refresh tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Only check unload when on the chat page with messages
      if (
        location.pathname !== "/chat" ||
        messages.length === 0
      ) {
        return;
      }
      // Show modal in background when they reload/exit
      setIsFeedbackOpen(true);
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave?";
      return "Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname, messages, setIsFeedbackOpen]);

  // Keyboard accessibility: escape to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFeedbackOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFeedbackOpen, blocker]);

  // Focus modal container on open
  useEffect(() => {
    if (isFeedbackOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isFeedbackOpen]);

  if (!isFeedbackOpen) return null;

  const handleClose = () => {
    setIsFeedbackOpen(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleSkip = () => {
    setIsFeedbackOpen(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/feedback", {
        rating: rating > 0 ? rating : null,
        message: message,
        page_url: window.location.href,
        sessionId: currentSession,
        userId: userId
      });

      setIsSuccess(true);

      // Show success message briefly, then proceed with transition
      setTimeout(() => {
        setIsFeedbackOpen(false);
        setIsSuccess(false);
        setRating(0);
        setMessage("");
        if (pendingNavigation) {
          pendingNavigation();
          setPendingNavigation(null);
        }
      }, 2000);
    } catch (err) {
      console.error("Feedback submission error:", err);
      toast.error("Failed to submit feedback. Moving on...");
      // Ensure we don't trap navigation on error
      setTimeout(() => {
        setIsFeedbackOpen(false);
        if (pendingNavigation) {
          pendingNavigation();
          setPendingNavigation(null);
        }
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="feedback-overlay" onClick={handleClose}>
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="feedback-card"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Website Feedback Modal"
        >
          <div className="feedback-header">
            <h3>We Value Your Feedback</h3>
            <button
              className="feedback-close-btn"
              onClick={handleClose}
              aria-label="Close feedback modal"
            >
              <FiX />
            </button>
          </div>

          <div className="feedback-body">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p className="feedback-intro">
                  {feedbackPromptMessage}
                </p>

                {/* Star Rating Section */}
                <div className="feedback-section">
                  <span className="feedback-section-label">Rate your experience (Optional)</span>
                  <div className="stars-container" role="radiogroup" aria-label="Star rating out of 5 stars">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = starValue <= (hoverRating || rating);
                      const isHovered = starValue <= hoverRating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          className={`star-btn ${isFilled ? "filled" : ""} ${isHovered ? "hovered" : ""}`}
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          role="radio"
                          aria-checked={rating === starValue}
                          aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                        >
                          <svg
                            stroke="currentColor"
                            fill={isFilled ? "currentColor" : "none"}
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            height="1rem"
                            width="1rem"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Message Field */}
                <div className="feedback-section" style={{ alignItems: "stretch" }}>
                  <label htmlFor="feedback-message" className="feedback-section-label" style={{ alignSelf: "center", marginBottom: "4px" }}>
                    Share your thoughts (Optional)
                  </label>
                  <div className="textarea-container">
                    <textarea
                      id="feedback-message"
                      className="feedback-textarea"
                      placeholder="Tell us how we can improve your experience..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                      maxLength={500}
                      disabled={isSubmitting}
                    />
                    <div className={`char-counter ${message.length >= 500 ? "limit-reached" : ""}`}>
                      {message.length}/500
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="feedback-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                  <button
                    type="button"
                    className="skip-btn"
                    onClick={handleSkip}
                    disabled={isSubmitting}
                    style={{ width: "100%" }}
                  >
                    Skip
                  </button>
                </div>
              </form>
            ) : (
              <div className="success-state">
                <div className="success-icon-wrapper">
                  <FiCheck />
                </div>
                <p className="success-message">
                  Thank you for your feedback! We appreciate your help in improving our website.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default FeedbackModal;
