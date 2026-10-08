import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, FileSpreadsheet, Sparkles } from "lucide-react";

interface HeroProps {
  onOpenQuoteModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal }) => {
  const { t, language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24 industrial-grid">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Industrial Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-sky-400 text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {language === "mr" ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">
                    “ऑल-इन-वन ऑटोमॅटिक पत्रावळी मशीन”
                  </span>
                  <span className="block text-2xl sm:text-3xl lg:text-4xl text-slate-200 font-bold mt-2">
                    8 तासांत अंदाजे 145 किलो उत्पादन क्षमता • फक्त ₹1,11,000/- पासून!
                  </span>
                </>
              ) : (
                <>
                  Advanced Manufacturing Solutions for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">
                    Paper & Drone
                  </span>{" "}
                  Industries
                </>
              )}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t.hero.subheading}
            </p>

            {/* Value bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === "mr"
                    ? "5 रोल सिस्टम व स्वतंत्र फिडर मोटर"
                    : "5 Roll System with Independent Feeder Motor"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === "mr"
                    ? "प्लेन, कप्पा थाळी, नाश्ता प्लेट व द्रोण सोय"
                    : "Plain, Kappa Thali, Snack Plates & Dron"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === "mr"
                    ? "1,000 किलो उत्पादनावर अंदाजे ₹9,000 नफा"
                    : "~₹9,000 Earning per 1,000 kg Output"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === "mr"
                    ? "व्यावसायिक ड्रोन असेंबली व टेस्टिंग उपकरणे"
                    : "Commercial Drone Assembly & Testing Stations"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/machines"
                className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <span>{t.hero.exploreProducts}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t.hero.requestQuote}</span>
              </button>

              <a
                href="tel:+917298772222"
                className="px-5 py-3.5 text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/60 rounded-2xl transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 7298772222</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Machinery Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-900/90 shadow-2xl p-3 sm:p-4 group">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src="/images/machine-4.jpg"
                  alt="Dhey Industries Heavy Duty Hydraulic Press Machine"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />

                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-white flex items-center gap-2 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Dhey Industries Heavy Hydraulic Press</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                      {language === "mr" ? "सुरुवातीची किंमत" : "Starting Price"}
                    </div>
                    <div className="text-xl font-extrabold text-white">₹1,11,000/-</div>
                  </div>
                  <Link
                    to="/machines/mach-01"
                    className="px-3.5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors"
                  >
                    {language === "mr" ? "माहिती पहा" : "View Specs"}
                  </Link>
                </div>
              </div>

              {/* Machinery highlight thumbnails below */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <Link to="/machines/mach-02" className="relative rounded-xl overflow-hidden aspect-video border border-slate-700 group/sub">
                  <img src="/images/machine-1.png" alt="Semi Auto" className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-end p-1 text-[10px] font-bold text-white">
                    70 kg / Shift
                  </div>
                </Link>
                <Link to="/machines/mach-04" className="relative rounded-xl overflow-hidden aspect-video border border-slate-700 group/sub">
                  <img src="/images/machine-2.jpg" alt="Dron Auto" className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-end p-1 text-[10px] font-bold text-white">
                    Dron Belt Drive
                  </div>
                </Link>
                <Link to="/machines/mach-03" className="relative rounded-xl overflow-hidden aspect-video border border-slate-700 group/sub">
                  <img src="/images/machine-3.jpg" alt="Double Die" className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-end p-1 text-[10px] font-bold text-white">
                    Double Die
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">15+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t.hero.experienceYears}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">1,200+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t.hero.machinesDelivered}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">850+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t.hero.happyClients}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">99.4%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">{t.hero.productionCapacity}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
