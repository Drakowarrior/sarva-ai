/**
 * Google Analytics (GA4) Custom Event Helper for SARVA AI
 * Security Note: Never transmit PII (passwords, emails, tokens, or raw document content).
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

export const trackSignupStarted = (source = "home_cta") => {
  trackEvent("signup_started", { source });
};

export const trackSignupCompleted = (method = "email") => {
  trackEvent("signup_completed", { method });
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

export const trackFirstChatStarted = () => {
  trackEvent("first_chat_started");
};

export const trackMessageSent = (messageLength, hasFile = false) => {
  trackEvent("message_sent", {
    message_length: messageLength,
    has_file: hasFile
  });
};

export const trackFileUploaded = (fileName, fileType) => {
  trackEvent("file_uploaded", {
    file_type: fileType
  });
};

export const trackFileUploadStarted = (fileType = "pdf") => {
  trackEvent("file_upload_started", {
    file_type: fileType
  });
};

export const trackCtaClick = (location = "hero", buttonName = "Try SARVA AI Free") => {
  trackEvent("cta_click", {
    location,
    button_name: buttonName
  });
};

export const trackTrySarvaClick = (source = "home_hero") => {
  trackEvent("try_sarva_click", { source });
};

export const trackDemoStarted = (source = "home_hero") => {
  trackEvent("demo_started", { source });
};

export const trackDemoPromptClicked = (promptTitle) => {
  trackEvent("demo_prompt_clicked", {
    prompt_title: promptTitle
  });
};

export const trackDemoPromptSubmitted = (promptCategory) => {
  trackEvent("demo_prompt_submitted", {
    category: promptCategory
  });
};

export const trackDemoCompleted = (messagesSent = 3) => {
  trackEvent("demo_completed", {
    messages_sent: messagesSent
  });
};

export const trackGithubClick = (location = "footer") => {
  trackEvent("github_click", { location });
};

export const trackCaseStudyView = (source = "navigation") => {
  trackEvent("case_study_view", { source });
};

export const trackUseCasesView = (category = "all") => {
  trackEvent("use_cases_view", { category });
};

export const trackFeedbackPositive = (rating, comment = "") => {
  trackEvent("feedback_positive", { rating });
};

export const trackFeedbackNegative = (rating, comment = "") => {
  trackEvent("feedback_negative", { rating });
};

export const trackSessionCreated = (sessionId) => {
  trackEvent("session_created", {
    session_id: sessionId
  });
};
