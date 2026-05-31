export const AI_WELCOME_MESSAGE =
  "Hello, I can help you find information on housing schemes, eligibility, documents, news, and contact details.";

export const AI_NOT_CONFIGURED_MESSAGE =
  "The assistant is not configured yet. Please contact the office for assistance.";

export const AI_MAX_MESSAGE_LENGTH = 1000;

export const AI_MAX_HISTORY_MESSAGES = 8;

export const AI_SYSTEM_INSTRUCTION = `You are the public website assistant for this housing/community website. Answer questions only from the public website content provided. Be concise, helpful, and professional. Do not invent facts. Do not make final eligibility decisions or tell visitors they qualify or are approved. If asked about eligibility, say they may wish to review the information on the website and that final eligibility must be confirmed by the office. If information is missing, say so and direct the visitor to the Contact page or office contact details. Include relevant internal page links when helpful (/schemes, /media, /contact, /about, /eligibility, /application). Keep answers short (under 120 words when possible). Do not request or store personal sensitive information; if a visitor shares personal details, respond generally and direct them to official contact or application channels.`;

export const AI_PUBLIC_PAGES = [
  { path: "/", label: "Homepage" },
  { path: "/schemes", label: "Housing schemes" },
  { path: "/eligibility", label: "Eligibility" },
  { path: "/application", label: "Application" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/media", label: "News & media" },
] as const;

export function isAiAssistantEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}
