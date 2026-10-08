import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { CheckCircle2, Factory } from "lucide-react";

export const IndustriesServed: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            {language === "mr" ? "औद्योगिक बाजारपेठ" : "Sectors & Markets"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            {t.industries.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.industries.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {t.industries.items.map((sector, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Factory className="w-4 h-4 text-sky-600" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {sector}
              </h3>
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Verified Application</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
