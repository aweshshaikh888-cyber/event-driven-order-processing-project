import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { ArrowRight, Layers, Cpu, PlaneTakeoff } from "lucide-react";

export const SolutionCategories: React.FC = () => {
  const { t, language } = useLanguage();

  const categories = [
    {
      title: t.solutions.paperProductsTitle,
      desc: t.solutions.paperProductsDesc,
      image: "/images/machine-4.jpg",
      link: "/paper-products",
      icon: Layers,
      color: "from-amber-600/90 to-amber-900/90",
      tag: language === "mr" ? "कच्चा माल व प्लेट्स" : "Raw Materials & Goods",
    },
    {
      title: t.solutions.paperMachinesTitle,
      desc: t.solutions.paperMachinesDesc,
      image: "/images/machine-1.png",
      link: "/machines",
      icon: Cpu,
      color: "from-sky-600/90 to-sky-900/90",
      tag: language === "mr" ? "ऑल-इन-वन मशीन्स" : "Production Machinery",
    },
    {
      title: t.solutions.droneEquipmentTitle,
      desc: t.solutions.droneEquipmentDesc,
      image: "/images/machine-2.jpg",
      link: "/drone-equipment",
      icon: PlaneTakeoff,
      color: "from-indigo-600/90 to-indigo-900/90",
      tag: language === "mr" ? "व्यावसायिक असेंबली" : "Industrial Assembly & QA",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            {language === "mr" ? "आमची उत्पादन सोल्यूशन्स" : "Turnkey Engineering Systems"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            {t.solutions.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.solutions.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Photo & Gradient */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-40 group-hover:opacity-30 transition-opacity`} />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
                      {cat.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-slate-950/80 text-white flex items-center justify-center backdrop-blur-md">
                    <Icon className="w-5 h-5 text-sky-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <Link
                    to={cat.link}
                    className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 group-hover:translate-x-1 transition-all pt-2"
                  >
                    <span>{language === "mr" ? "उत्पादने व मशीन्स पहा" : "Explore Solutions"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
