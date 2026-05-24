import type { NextRequest } from "next/server";

const IPV4_PATTERN =
  /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;

function normalizeIp(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("::ffff:")) {
    const mapped = trimmed.slice("::ffff:".length);
    return IPV4_PATTERN.test(mapped) ? mapped : null;
  }

  if (IPV4_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function pickFirstPublicIpv4(values: string[]): string | null {
  for (const raw of values) {
    const parts = raw.split(",").map((part) => part.trim());

    for (const part of parts) {
      const ipv4 = normalizeIp(part);
      if (ipv4) {
        return ipv4;
      }
    }
  }

  return null;
}

export function getClientIpAddress(request?: NextRequest | null): string {
  if (!request) {
    return "Unknown";
  }

  const headerValues = [
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
  ].filter((value): value is string => Boolean(value));

  const fromHeaders = pickFirstPublicIpv4(headerValues);

  if (fromHeaders) {
    return fromHeaders;
  }

  return "Unknown";
}

export function getClientUserAgent(request?: NextRequest | null): string {
  return request?.headers.get("user-agent")?.trim() || "Unknown";
}
