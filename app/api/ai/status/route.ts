import { NextResponse } from "next/server";
import {
  AI_NOT_CONFIGURED_MESSAGE,
  AI_WELCOME_MESSAGE,
  isAiAssistantEnabled,
} from "@/lib/ai/chat-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = isAiAssistantEnabled();

  return NextResponse.json({
    enabled,
    welcomeMessage: enabled ? AI_WELCOME_MESSAGE : AI_NOT_CONFIGURED_MESSAGE,
  });
}
