import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Wrench, Shield, Zap, Headphones, CheckCircle2 } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const { t, language } = useLanguage();

  const icons = [Wrench, Shield, Zap, Headphones];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
            {language === "mr" ? "आमची ताकद" : "Engineering Advantage"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {t.whyChooseUs.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t.whyChooseUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.whyChooseUs.features.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-sky-500/50 hover:bg-slate-800 transition-all duration-300 space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
