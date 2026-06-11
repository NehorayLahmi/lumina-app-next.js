"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("יש להזין כתובת אימייל");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.message ?? "אירעה שגיאה");
      return;
    }

    // Always show success — backend never reveals if email exists (anti-enumeration)
    setSent(true);
  }

  return (
    <main
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {sent ? (
          <div className="text-center" role="status" aria-live="polite">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5" aria-hidden="true">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">בדוק את תיבת הדואר שלך</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              אם האימייל{" "}
              <span className="font-medium text-gray-700">{email}</span>{" "}
              קיים במערכת, ישלח אליו קישור לאיפוס הסיסמה.
              <br />
              הקישור בתוקף למשך שעה אחת.
            </p>
            <Link
              href="/login"
              className="inline-block mt-6 text-indigo-600 hover:underline text-sm font-medium"
            >
              חזרה לדף הכניסה
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full mb-4" aria-hidden="true">
                <svg
                  className="w-7 h-7 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">שחזור סיסמה</h1>
              <p className="text-gray-500 mt-1 text-sm">
                הזן את האימייל שלך ונשלח לך קישור לאיפוס
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                  דואר אלקטרוני
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50"
                  placeholder="name@example.com"
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
                aria-label={submitting ? "שולח קישור, אנא המתן" : "שלח קישור לאיפוס סיסמה"}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                {submitting ? "שולח..." : "שלח קישור לאיפוס"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                חזרה לדף הכניסה
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
