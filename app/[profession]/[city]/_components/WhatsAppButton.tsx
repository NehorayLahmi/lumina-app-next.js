"use client";

import { useCallback } from "react";

interface Props {
  phone: string;
  landingPageId: string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function toWaMe(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("972")) return `https://wa.me/${digits}`;
  if (digits.startsWith("0")) return `https://wa.me/972${digits.slice(1)}`;
  return `https://wa.me/972${digits}`;
}

export function WhatsAppButton({ phone, landingPageId, ariaLabel, className, style, children }: Props) {
  const handleClick = useCallback(() => {
    fetch("/api/webhook/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ landingPageId, destinationPhone: phone }),
    }).catch(() => {});
  }, [landingPageId, phone]);

  return (
    <a
      href={toWaMe(phone)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
