"use client";

import { useCallback } from "react";

interface Props {
  href: string;
  landingPageId: string;
  destinationPhone: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function CallButton({ href, landingPageId, destinationPhone, className, style, children }: Props) {
  const handleClick = useCallback(() => {
    // Fire-and-forget — logs the call attempt in the background
    fetch("/api/webhook/call-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ landingPageId, destinationPhone }),
    }).catch(() => {});
  }, [landingPageId, destinationPhone]);

  return (
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
}
