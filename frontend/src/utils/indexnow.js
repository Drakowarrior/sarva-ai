/**
 * IndexNow API Helper for SARVA AI
 * Instantly pings Bing and Yandex when new public SEO pages or blog articles are indexed.
 */

export const submitIndexNow = async (urls = []) => {
  const host = "sarva-ai-one.vercel.app";
  const key = "sarvaaiindexnowkey202608120001";
  const keyLocation = `https://${host}/${key}.txt`;

  const defaultUrls = [
    `https://${host}/`,
    `https://${host}/about`,
    `https://${host}/features`,
    `https://${host}/ai-chatbot`,
    `https://${host}/enterprise-ai`,
    `https://${host}/file-analysis`,
    `https://${host}/security`,
    `https://${host}/technology`,
    `https://${host}/contact`,
    `https://${host}/case-study`,
    `https://${host}/blog`,
    `https://${host}/blog/fastapi-groq-ai-chatbot`,
    `https://${host}/blog/ai-document-analysis`,
    `https://${host}/blog/mongodb-chat-memory`,
    `https://${host}/blog/jwt-ai-chatbot-security`,
    `https://${host}/blog/full-stack-ai-architecture`
  ];

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls.length > 0 ? urls : defaultUrls
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
    console.log("[IndexNow Ping Status]:", response.status);
    return response.ok;
  } catch (error) {
    console.warn("[IndexNow Ping Error]:", error);
    return false;
  }
};
