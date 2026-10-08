import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 shadow-xs">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          language === "en"
            ? "bg-white text-sky-700 shadow-xs border border-slate-200"
            : "text-slate-600 hover:text-slate-900"
        }`}
        title="Switch to English"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>English</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("mr")}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          language === "mr"
            ? "bg-sky-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
        title="मराठी भाषेत बदला"
      >
        <span>मराठी</span>
      </button>
    </div>
  );
};
