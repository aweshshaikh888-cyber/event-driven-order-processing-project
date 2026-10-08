import React from "react";
import { EarningsRow } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import { TrendingUp, Calendar, Zap, DollarSign } from "lucide-react";

interface ProductionIncomeChartProps {
  chartData: EarningsRow[];
  earningsNoteMr?: string;
  importantNoteMr?: string;
  machineTitle?: string;
}

export const ProductionIncomeChart: React.FC<ProductionIncomeChartProps> = ({
  chartData,
  earningsNoteMr,
  importantNoteMr,
  machineTitle,
}) => {
  const { language } = useLanguage();

  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>{language === "mr" ? "उत्पादन व कमाई विश्लेषण" : "Production & Earnings Matrix"}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {language === "mr" ? "📊 उत्पादन व उत्पन्न तक्ता" : "Production & Income Projection Table"}
          </h3>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === "mr" ? "1,000 किलो = ₹9,000 उत्पन्न आधार" : "Basis: ~₹9,000 Profit / 1,000 kg"}</span>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === "mr" ? "कालावधी" : "Time Period"}</span>
                </div>
              </th>
              <th className="py-3.5 px-4 sm:px-6">
                <span>{language === "mr" ? "कामाचे दिवस" : "Operating Days"}</span>
              </th>
              <th className="py-3.5 px-4 sm:px-6">
                <span>{language === "mr" ? "उत्पादन (किलो)" : "Production (kg)"}</span>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === "mr" ? "अंदाजे उत्पन्न (₹)" : "Est. Income (INR)"}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {chartData.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white hover:bg-slate-50/80" : "bg-slate-50/50 hover:bg-slate-100/60"}
              >
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                  {language === "mr" ? row.periodMr : row.period}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600 font-medium">
                  {row.workDays ? `${row.workDays} ${language === "mr" ? "दिवस" : "Days"}` : "-"}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-sky-700">
                  {row.productionKg}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-right font-extrabold text-emerald-700 text-sm sm:text-base">
                  ₹{typeof row.incomeInr === "number" ? row.incomeInr.toLocaleString() : row.incomeInr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes & Highlights */}
      {(earningsNoteMr || importantNoteMr) && (
        <div className="space-y-3">
          {earningsNoteMr && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              {earningsNoteMr}
            </div>
          )}
          {importantNoteMr && (
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
              {importantNoteMr}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
