import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Calculator, TrendingUp, DollarSign, Calendar, Clock, AlertCircle } from "lucide-react";

interface MachineCalcConfig {
  id: string;
  nameEn: string;
  nameMr: string;
  baseKgPer8Hr: number;
  profitPer1000Kg: number;
  machinePrice: number;
}

const CALC_MODELS: MachineCalcConfig[] = [
  {
    id: "auto-145",
    nameEn: "All-in-One Automatic Patrawali Machine (5 Roll)",
    nameMr: "ऑल-इन-वन ऑटोमॅटिक पत्रावळी मशीन (145 किलो / 8 तास)",
    baseKgPer8Hr: 145,
    profitPer1000Kg: 9000,
    machinePrice: 111000,
  },
  {
    id: "semi-70",
    nameEn: "Semi-Automatic Patrawali Machine (Manual Feed)",
    nameMr: "सेमी-ऑटोमॅटिक पत्रावळी मशीन (70 किलो / 8 तास)",
    baseKgPer8Hr: 70,
    profitPer1000Kg: 9000,
    machinePrice: 111000,
  },
  {
    id: "semi-dbldie-18k",
    nameEn: "Double Die Semi-Automatic Machine (Dual Profit)",
    nameMr: "डबल डाय सेमी-ऑटोमॅटिक मशीन (₹18,000 / 1,000 किलो)",
    baseKgPer8Hr: 70,
    profitPer1000Kg: 18000,
    machinePrice: 135000,
  },
  {
    id: "dron-belt-100",
    nameEn: "Automatic Single Die Dron Machine (Belt Drive)",
    nameMr: "ऑटोमॅटिक सिंगल डाय द्रोण मशीन (100 किलो / दिवस)",
    baseKgPer8Hr: 100,
    profitPer1000Kg: 9000,
    machinePrice: 95000,
  },
  {
    id: "semi-dbldie-65k",
    nameEn: "Double Die Machine (Precision 65 kg/Day Model)",
    nameMr: "डबल डाय मशीन (सरासरी 65 किलो / 16 दिवस लक्ष्य)",
    baseKgPer8Hr: 65,
    profitPer1000Kg: 9000,
    machinePrice: 125000,
  },
];

export const RoiCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedModelId, setSelectedModelId] = useState(CALC_MODELS[0].id);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerMonth, setDaysPerMonth] = useState(30);

  const currentModel = CALC_MODELS.find((m) => m.id === selectedModelId) || CALC_MODELS[0];

  // Dynamic calculations based on user prompt figures
  const effectiveKgPerDay = Math.round((currentModel.baseKgPer8Hr / 8) * hoursPerDay);
  const monthlyProductionKg = effectiveKgPerDay * daysPerMonth;
  const monthlyProfitInr = Math.round((monthlyProductionKg / 1000) * currentModel.profitPer1000Kg);
  const yearlyProductionKg = monthlyProductionKg * 12;
  const yearlyProfitInr = monthlyProfitInr * 12;

  // Payback period in months
  const paybackMonths = (currentModel.machinePrice / (monthlyProfitInr || 1)).toFixed(1);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === "mr" ? "व्यवसाय नफा गणक" : "Business Investment & ROI Calculator"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            {t.calculator.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t.calculator.selectMachine}
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
                >
                  {CALC_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {language === "mr" ? m.nameMr : m.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>{t.calculator.workingHours}</span>
                    </span>
                    <span className="text-sky-400 font-bold">{hoursPerDay} {language === "mr" ? "तास" : "Hours"}</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="16"
                    step="1"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>6 hrs (Part time)</span>
                    <span>8 hrs (Standard)</span>
                    <span>16 hrs (2 Shifts)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.calculator.daysPerMonth}</span>
                    </span>
                    <span className="text-amber-400 font-bold">{daysPerMonth} {language === "mr" ? "दिवस" : "Days"}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="30"
                    step="1"
                    value={daysPerMonth}
                    onChange={(e) => setDaysPerMonth(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>20 days</span>
                    <span>25 days</span>
                    <span>30 days (Full month)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  {language === "mr"
                    ? `मशीन किंमत: ₹${currentModel.machinePrice.toLocaleString()}/- (कच्चा माल खर्च स्वतंत्र). 1,000 किलोवर ₹${currentModel.profitPer1000Kg.toLocaleString()} नफ्याचे अधिकृत सूत्र.`
                    : `Machine Price: ₹${currentModel.machinePrice.toLocaleString()}/-. Formula basis: ~₹${currentModel.profitPer1000Kg.toLocaleString()} net profit per 1,000 kg produced.`}
                </div>
              </div>
            </div>

            {/* Live Outputs & Projections */}
            <div className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === "mr" ? "अंदाजे उत्पादन व परतावा" : "Projected Returns"}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  ROI: ~{paybackMonths} {language === "mr" ? "महिन्यांत मशीन वसूल" : "Months Payback"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {language === "mr" ? "दैनंदिन उत्पादन" : "Daily Output"}
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {effectiveKgPerDay} <span className="text-xs text-slate-400 font-normal">kg/day</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {language === "mr" ? "मासिक उत्पादन" : "Monthly Output"}
                  </div>
                  <div className="text-lg font-bold text-sky-400 mt-0.5">
                    {monthlyProductionKg.toLocaleString()} <span className="text-xs text-slate-400 font-normal">kg</span>
                  </div>
                </div>
              </div>

              {/* Monthly Profit Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>{t.calculator.monthlyProfit}</span>
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-300">
                    ₹{monthlyProfitInr.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Annual Profit Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 to-slate-900 border border-sky-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>{t.calculator.yearlyProfit}</span>
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-sky-300">
                    ₹{yearlyProfitInr.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center leading-normal">
                {t.calculator.note}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
