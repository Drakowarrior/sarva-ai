/**
 * Google Analytics (GA4) Custom Event Helper for SARVA AI
 */

export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
    console.log(`[GA4 Tracked Event] ${eventName}:`, eventParams);
  }
};

export const trackSignUp = (method = "email") => {
  trackEvent("sign_up", { method });
};

export const trackLogin = (method = "email") => {
  trackEvent("login", { method });
};

export const trackLogout = () => {
  trackEvent("logout");
};

export const trackChatStarted = (sessionId) => {
  trackEvent("chat_started", { session_id: sessionId });
};

export const trackMessageSent = (messageLength, hasFile = false) => {
  trackEvent("message_sent", {
    message_length: messageLength,
    has_file: hasFile
  });
};

export const trackFileUploaded = (fileName, fileType) => {
  trackEvent("file_uploaded", {
    file_name: fileName,
    file_type: fileType
  });
};

export const trackFeedbackPositive = (rating, comment = "") => {
  trackEvent("feedback_positive", {
    rating,
    comment
  });
};

export const trackFeedbackNegative = (rating, comment = "") => {
  trackEvent("feedback_negative", {
    rating,
    comment
  });
};

export const trackSessionCreated = (sessionId, sessionTitle = "") => {
  trackEvent("session_created", {
    session_id: sessionId,
    session_title: sessionTitle
  });
};
