import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { CheckCircle2, ArrowRight, ShieldCheck, Award, Factory } from "lucide-react";

export const AboutSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-3/4">
                <img
                  src="/images/machine-4.jpg"
                  alt="Dhey Industries Machinery"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
                <div className="text-xl font-extrabold text-sky-800">100%</div>
                <div className="text-[11px] font-semibold text-sky-600 mt-0.5">
                  {language === "mr" ? "गुणवत्ता चाचणी" : "Factory Tested"}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <div className="text-xl font-extrabold text-amber-800">1,200+</div>
                <div className="text-[11px] font-semibold text-amber-700 mt-0.5">
                  {language === "mr" ? "वितरित मशीन्स" : "Units Deployed"}
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-3/4">
                <img
                  src="/images/machine-1.png"
                  alt="Hydraulic Press Machine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <Factory className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.aboutSection.subtitle}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {t.aboutSection.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {t.aboutSection.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {t.aboutSection.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/about"
                className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>{t.aboutSection.readMore}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Award className="w-4 h-4 text-amber-500" />
                <span>ASVR Engineering & Industrial Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
