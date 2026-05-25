"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // No token in URL → invalid link
  if (!token) {
    return (
      <main
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
        dir="rtl"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-4xl font-bold text-red-500 mb-3" aria-hidden="true">⚠</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">קישור לא תקין</h1>
          <p className="text-gray-500 text-sm mb-6">
            הקישור לאיפוס הסיסמה חסר או שגוי. בקש קישור חדש.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            בקש קישור חדש
          </Link>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.message ?? "איפוס הסיסמה נכשל");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (done) {
    return (
      <main
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
        dir="rtl"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center" role="status" aria-live="polite">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5" aria-hidden="true">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">הסיסמה אופסה בהצלחה</h2>
          <p className="text-gray-500 text-sm">מועבר לדף הכניסה תוך מספר שניות...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-full mb-4" aria-hidden="true">
            <svg
              className="w-7 h-7 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">הגדרת סיסמה חדשה</h1>
          <p className="text-gray-500 mt-1 text-sm">הזן סיסמה חדשה לחשבונך</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה חדשה <span className="text-gray-400 font-normal">(לפחות 6 תווים)</span>
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={submitting}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
              placeholder="••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              אימות סיסמה
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              disabled={submitting}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            aria-label={submitting ? "שומר סיסמה, אנא המתן" : "שמור סיסמה חדשה"}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "שומר..." : "שמור סיסמה חדשה"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
