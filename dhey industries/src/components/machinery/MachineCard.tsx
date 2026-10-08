import React from "react";
import { Link } from "react-router-dom";
import { Machine } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import { Cpu, Zap, Gauge, ArrowRight, Bookmark, FileSpreadsheet, Check } from "lucide-react";

interface MachineCardProps {
  machine: Machine;
  onOpenQuoteModal?: () => void;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine, onOpenQuoteModal }) => {
  const { language } = useLanguage();
  const { addToQuoteCart, quoteCart, savedIds, toggleSaved } = useStore();
  const { showToast } = useToast();

  const isSaved = savedIds.includes(machine.id);
  const isInQuoteCart = quoteCart.some((i) => i.itemId === machine.id);

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToQuoteCart({
      itemType: "machine",
      itemId: machine.id,
      name: language === "mr" ? machine.nameMr : machine.name,
      category: machine.category === "paper_machinery" ? "Paper Machinery" : "Drone Machinery",
      image: machine.images[0],
      quantity: 1,
      requirements: "Requires standard factory tooling and proforma quotation.",
      expectedDelivery: "Standard Lead Time",
    });

    showToast(
      language === "mr"
        ? `"${machine.nameMr}" कोटेशन यादीत जोडले गेले!`
        : `"${machine.name}" added to quotation cart!`,
      "success"
    );

    if (onOpenQuoteModal) {
      onOpenQuoteModal();
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(machine.id);
    showToast(
      isSaved
        ? (language === "mr" ? "मशीन बुकमार्कमधून काढली गेली." : "Removed from bookmarks.")
        : (language === "mr" ? "मशीन यशस्वीरीत्या सेव्ह केली गेली!" : "Saved to your bookmarks!"),
      "info"
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Image Section */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        <img
          src={machine.images[0]}
          alt={machine.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>
              {machine.category === "paper_machinery"
                ? (language === "mr" ? "पेपर मशिनरी" : "Paper Machinery")
                : (language === "mr" ? "ड्रोन उपकरणे" : "Drone Equipment")}
            </span>
          </span>
          {machine.featured && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500 text-white shadow-xs">
              {language === "mr" ? "लोकप्रिय" : "Featured"}
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleToggleSave}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            isSaved
              ? "bg-sky-600 text-white shadow-md"
              : "bg-white/80 text-slate-600 hover:bg-white hover:text-sky-600 shadow-xs"
          }`}
          title={isSaved ? "Remove from saved" : "Save this machine"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Code Overlay */}
        <div className="absolute bottom-2 left-3">
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-900/70 text-slate-200 rounded">
            {machine.productCode}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
            {language === "mr" ? machine.nameMr : machine.name}
          </h4>

          {/* Headline / Badge Summary */}
          {machine.headlineMr && (
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 leading-snug">
              {language === "mr" ? machine.headlineMr : (machine.headlineEn || machine.headlineMr)}
            </div>
          )}

          {/* Quick Specifications Pill Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
            {machine.productionCapacity && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Gauge className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{machine.productionCapacity}</span>
              </div>
            )}
            {machine.powerRequirement && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{machine.powerRequirement}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {language === "mr" ? "मशीन किंमत" : "Unit Price"}
            </span>
            <div>
              {machine.price ? (
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                    ₹{machine.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {language === "mr" ? "+ कच्चा माल खर्च स्वतंत्र" : "+ Tax / Raw Material Separate"}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {language === "mr" ? "कोटेशन मागवा" : "Price on Request"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/machines/${machine.id}`}
              className="py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1 text-center"
            >
              <span>{language === "mr" ? "तपशील पहा" : "View Specs"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleAddToQuote}
              className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs ${
                isInQuoteCart
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
            >
              {isInQuoteCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === "mr" ? "जोडले आहे" : "In Quote"}</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{language === "mr" ? "कोटेशन जोडा" : "Add to Quote"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
