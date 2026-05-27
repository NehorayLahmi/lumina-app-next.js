"use client";

import { useState } from "react";
import { isValidName, isValidPhone } from "@/lib/validate";

interface Props {
  profession: string;
  city: string;
  proName: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export function LeadForm({ profession, city, proName }: Props) {
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [state, setState]       = useState<FormState>("idle");
  const [errMsg, setErrMsg]     = useState("");
  const [nameErr, setNameErr]   = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNameErr(""); setPhoneErr(""); setErrMsg("");

    let valid = true;
    if (!name.trim()) {
      setNameErr("יש להזין שם מלא"); valid = false;
    } else if (!isValidName(name.trim())) {
      setNameErr("שם לא תקין — עברית או אנגלית בלבד (2–50 תווים)"); valid = false;
    }
    if (!phone.trim()) {
      setPhoneErr("יש להזין מספר טלפון"); valid = false;
    } else if (!isValidPhone(phone.trim())) {
      setPhoneErr("מספר לא תקין — יש להזין מספר ישראלי (לדוגמה: 050-1234567)"); valid = false;
    }
    if (!valid) return;

    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName: name.trim(), clientPhone: phone.trim(), city, profession }),
      });
      if (res.ok) { setState("success"); setName(""); setPhone(""); }
      else {
        const data = await res.json().catch(() => ({}));
        setErrMsg(data.message ?? "שגיאה בשליחה — נסה שוב");
        setState("error");
      }
    } catch {
      setErrMsg("שגיאת חיבור — נסה שוב");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="cyber-glass cyber-glow"
        style={{ borderRadius: 28, padding: "48px 32px", textAlign: "center" }}
      >
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,242,255,0.15)", border: "1px solid rgba(0,242,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 30, color: "#00f2ff", fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: "#e2e2e7", marginBottom: 8 }}>הפרטים נשלחו בהצלחה!</h3>
        <p style={{ fontSize: 14, color: "#b4b5b5" }}>{proName} יחזור אליך בהקדם.</p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(40,42,46,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14, padding: "14px 16px",
    fontSize: 15, color: "#e2e2e7",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div className="cyber-glass cyber-glow" style={{ borderRadius: 28, padding: "32px 28px" }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: "#ffdca1", marginBottom: 24 }}>השאירו פרטים ונחזור אליכם</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
        <div>
          <label
            htmlFor="lead-full-name"
            style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#b4b5b5", marginBottom: 6, letterSpacing: "0.04em" }}
          >
            שם מלא
          </label>
          <input
            id="lead-full-name"
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); if (nameErr) setNameErr(""); }}
            required
            autoComplete="name"
            placeholder="ישראל ישראלי"
            style={{ ...inputStyle, borderColor: nameErr ? "rgba(255,100,80,0.6)" : undefined }}
            onFocus={e => { e.currentTarget.style.borderColor = nameErr ? "rgba(255,100,80,0.8)" : "rgba(0,242,255,0.7)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,242,255,0.25)"; e.currentTarget.style.outline = "none"; }}
            onBlur={e => { e.currentTarget.style.borderColor = nameErr ? "rgba(255,100,80,0.6)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {nameErr && <p role="alert" style={{ fontSize: 12, color: "#ffb4ab", margin: "4px 0 0 4px" }}>{nameErr}</p>}
        </div>
        <div>
          <label
            htmlFor="lead-phone"
            style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#b4b5b5", marginBottom: 6, letterSpacing: "0.04em" }}
          >
            מספר טלפון
          </label>
          <input
            id="lead-phone"
            type="tel"
            value={phone}
            onChange={e => { setPhone(e.target.value); if (phoneErr) setPhoneErr(""); }}
            required
            autoComplete="tel"
            placeholder="05X-XXX-XXXX"
            dir="ltr"
            style={{ ...inputStyle, textAlign: "left", borderColor: phoneErr ? "rgba(255,100,80,0.6)" : undefined }}
            onFocus={e => { e.currentTarget.style.borderColor = phoneErr ? "rgba(255,100,80,0.8)" : "rgba(0,242,255,0.7)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,242,255,0.25)"; e.currentTarget.style.outline = "none"; }}
            onBlur={e => { e.currentTarget.style.borderColor = phoneErr ? "rgba(255,100,80,0.6)" : "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {phoneErr && <p role="alert" style={{ fontSize: 12, color: "#ffb4ab", margin: "4px 0 0 4px" }}>{phoneErr}</p>}
        </div>
        {state === "error" && (
          <p
            role="alert"
            aria-live="assertive"
            style={{ fontSize: 13, color: "#ffb4ab", background: "rgba(255,180,171,0.1)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}
          >
            {errMsg}
          </p>
        )}
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label={state === "loading" ? "שולח טופס, אנא המתן" : "שלח פרטים לקבלת שיחה חוזרת"}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 14, border: "none", cursor: state === "loading" ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg, #ffb800, #ff9500)", color: "#271900",
            fontSize: 17, fontWeight: 700, fontFamily: "inherit",
            opacity: state === "loading" ? 0.65 : 1, transition: "opacity 0.2s, transform 0.15s",
            boxShadow: "0 4px 20px rgba(255,184,0,0.3)",
          }}
          onMouseEnter={e => { if (state !== "loading") e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {state === "loading" ? "שולח..." : "שליחת פרטים"}
        </button>
      </form>
    </div>
  );
}
