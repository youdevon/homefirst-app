"use client";

import { useEffect, useRef, useState } from "react";
import { AI_NOT_CONFIGURED_MESSAGE } from "@/lib/ai/chat-config";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/ai/status");
        const data = (await response.json()) as {
          enabled?: boolean;
          welcomeMessage?: string;
        };

        if (cancelled) {
          return;
        }

        setIsEnabled(Boolean(data.enabled));
        setWelcomeMessage(
          data.welcomeMessage ||
            (data.enabled ? "" : AI_NOT_CONFIGURED_MESSAGE),
        );
      } catch {
        if (!cancelled) {
          setIsEnabled(false);
          setWelcomeMessage(AI_NOT_CONFIGURED_MESSAGE);
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  async function sendMessage() {
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    if (isEnabled === false) {
      setMessages((current) => [
        ...current,
        createMessage("assistant", AI_NOT_CONFIGURED_MESSAGE),
      ]);
      setInput("");
      return;
    }

    const userMessage = createMessage("user", trimmed);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(-8).map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      const reply =
        data.reply ||
        "Sorry, I could not answer that. Please contact the office for assistance.";

      setMessages((current) => [...current, createMessage("assistant", reply)]);

      if (!response.ok && data.error === "not_configured") {
        setIsEnabled(false);
      }
    } catch {
      setError("Could not reach the assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function openPanel() {
    setIsOpen(true);

    if (messages.length === 0 && welcomeMessage) {
      setMessages([createMessage("assistant", welcomeMessage)]);
    }
  }

  return (
    <div className="ai-assistant-root" aria-live="polite">
      {isOpen ? (
        <section
          className="ai-assistant-panel"
          role="dialog"
          aria-labelledby="ai-assistant-title"
          aria-describedby="ai-assistant-subtitle"
        >
          <header className="ai-assistant-header">
            <div>
              <h2 id="ai-assistant-title" className="ai-assistant-title">
                Website Assistant
              </h2>
              <p id="ai-assistant-subtitle" className="ai-assistant-subtitle">
                Ask about schemes, eligibility, documents, contact details, or
                news.
              </p>
            </div>
            <button
              type="button"
              className="ai-assistant-close"
              aria-label="Minimize assistant"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="ai-assistant-messages" role="log" aria-relevant="additions">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ai-assistant-message ai-assistant-message-user"
                    : "ai-assistant-message ai-assistant-message-assistant"
                }
              >
                {message.content}
              </div>
            ))}

            {isLoading ? (
              <div
                className="ai-assistant-message ai-assistant-message-assistant ai-assistant-loading"
                aria-busy="true"
              >
                Thinking…
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {error ? (
            <p className="ai-assistant-error" role="alert">
              {error}
            </p>
          ) : null}

          <form
            className="ai-assistant-form"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <label className="ai-assistant-input-label" htmlFor="ai-assistant-input">
              Your question
            </label>
            <textarea
              id="ai-assistant-input"
              ref={inputRef}
              className="ai-assistant-input"
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question…"
              maxLength={1000}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ai-assistant-send"
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </form>
        </section>
      ) : null}

      {!isOpen ? (
        <button
          type="button"
          className="ai-assistant-launcher"
          aria-label="Open website assistant"
          aria-expanded={isOpen}
          onClick={openPanel}
        >
          <span className="ai-assistant-launcher-icon" aria-hidden="true">
            ✦
          </span>
          <span>Ask Assistant</span>
        </button>
      ) : null}
    </div>
  );
}
