"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface Props {
  onAuth: (user: TelegramUser) => void;
}

const BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME ?? "MyLuminaLeads_bot";

export function TelegramLoginButton({ onAuth }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onTelegramAuth = onAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", BOT_NAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    if (ref.current) ref.current.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [onAuth]);

  return <div ref={ref} />;
}
