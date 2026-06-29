"use client";
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const LANGS = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "ar", label: "ع",  flag: "🇩🇿" },
];

export default function LanguageSwitcher({ variant = "light" }) {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = LANGS.find((l) => l.code === language) || LANGS[0];

  const isDark = variant === "dark";

  return (
    <div className="relative" style={{ zIndex: 100 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 14px",
          borderRadius: "999px",
          border: isDark ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(0,0,0,0.15)",
          background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          color: isDark ? "#fff" : "#002045",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ fontSize: "16px" }}>{current.flag}</span>
        <span>{current.label}</span>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "16px", opacity: 0.7, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0 }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: "130px",
              borderRadius: "14px",
              background: "#fff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
              border: "1px solid rgba(0,0,0,0.08)",
              overflow: "hidden",
              animation: "fadeInDown 0.15s ease",
            }}
          >
            <style>{`@keyframes fadeInDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { changeLanguage(lang.code); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 16px",
                  border: "none",
                  background: language === lang.code ? "rgba(0,107,95,0.08)" : "transparent",
                  color: language === lang.code ? "#006b5f" : "#002045",
                  fontWeight: language === lang.code ? 700 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'Inter', sans-serif",
                  transition: "background 0.15s",
                  direction: lang.code === "ar" ? "rtl" : "ltr",
                }}
                onMouseEnter={(e) => { if (language !== lang.code) e.currentTarget.style.background = "rgba(0,107,95,0.04)"; }}
                onMouseLeave={(e) => { if (language !== lang.code) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "18px" }}>{lang.flag}</span>
                <span>{lang.code === "en" ? "English" : lang.code === "fr" ? "Français" : "العربية"}</span>
                {language === lang.code && (
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", marginLeft: "auto", color: "#006b5f" }}>check</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
