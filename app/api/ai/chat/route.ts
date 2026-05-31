import { NextRequest, NextResponse } from "next/server";
import {
  AI_MAX_HISTORY_MESSAGES,
  AI_MAX_MESSAGE_LENGTH,
  AI_NOT_CONFIGURED_MESSAGE,
  AI_SYSTEM_INSTRUCTION,
  isAiAssistantEnabled,
} from "@/lib/ai/chat-config";
import { buildPublicWebsiteContext } from "@/lib/ai/public-website-context";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function sanitizeHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is ChatMessage =>
        Boolean(item) &&
        typeof item === "object" &&
        (item as ChatMessage).role !== undefined &&
        ((item as ChatMessage).role === "user" ||
          (item as ChatMessage).role === "assistant") &&
        typeof (item as ChatMessage).content === "string",
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, AI_MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-AI_MAX_HISTORY_MESSAGES);
}

export async function POST(request: NextRequest) {
  if (!isAiAssistantEnabled()) {
    return NextResponse.json(
      { error: "not_configured", reply: AI_NOT_CONFIGURED_MESSAGE },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`ai-chat:${ip}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        reply:
          "Too many requests. Please wait a moment and try again, or contact the office directly.",
      },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const message =
    typeof record.message === "string" ? record.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }

  if (message.length > AI_MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  const history = sanitizeHistory(record.history);
  const publicContext = await buildPublicWebsiteContext();
  const apiKey = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const messages = [
    {
      role: "system" as const,
      content: `${AI_SYSTEM_INSTRUCTION}\n\n---\nPublic website content:\n${publicContext}`,
    },
    ...history.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 500,
        messages,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error", response.status, await response.text());
      return NextResponse.json(
        {
          error: "upstream_error",
          reply:
            "Sorry, I could not process that request right now. Please try again later or contact the office for assistance.",
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I do not have an answer for that. Please contact the office for assistance.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat route failed", error);
    return NextResponse.json(
      {
        error: "server_error",
        reply:
          "Sorry, something went wrong. Please contact the office for assistance.",
      },
      { status: 500 },
    );
  }
}
