"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      title="התנתק"
      className="text-gray-400 hover:text-red-500 border border-gray-700 hover:border-red-500 p-1.5 rounded-4xl transition-colors flex items-center justify-center"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
    </button>
  );
}
