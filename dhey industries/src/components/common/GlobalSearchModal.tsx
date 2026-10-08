import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { Search, X, Cpu, Package, FileText, ArrowRight } from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const { machines, products, technicalPapers } = useStore();
  const { language } = useLanguage();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { machines: [], products: [], papers: [] };

    const matchedMachines = machines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.nameMr.toLowerCase().includes(q) ||
        m.productCode.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.descriptionMr.toLowerCase().includes(q)
    );

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameMr.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );

    const matchedPapers = technicalPapers.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.titleMr.toLowerCase().includes(q) ||
        doc.relatedEntity.toLowerCase().includes(q)
    );

    return {
      machines: matchedMachines.slice(0, 5),
      products: matchedProducts.slice(0, 5),
      papers: matchedPapers.slice(0, 5),
    };
  }, [query, machines, products, technicalPapers]);

  if (!isOpen) return null;

  const totalResults =
    results.machines.length + results.products.length + results.papers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-modal-in">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === "mr"
                ? "मशीन्स, पेपर प्रॉडक्ट्स किंवा डॉक्युमेंट्स शोधा..."
                : "Search machines, paper products, documents, specs..."
            }
            className="w-full text-base outline-hidden text-slate-800 placeholder-slate-400 font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="text-center py-8 text-slate-400 text-sm">
              {language === "mr"
                ? "शोधण्यासाठी वरील बॉक्समध्ये नाव किंवा मॉडेल टाईप करा (उदा: पत्रावळी, द्रोण, 5 रोल, Kraft)"
                : "Type keywords like 'patrawali', 'dron', '5 roll', 'kraft', 'dynamometer'..."}
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              {language === "mr"
                ? `"${query}" साठी कोणतेही परिणाम सापडले नाहीत.`
                : `No matching machines or products found for "${query}".`}
            </div>
          )}

          {/* Machines Results */}
          {results.machines.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-sky-600" />
                {language === "mr" ? "मशिनरी व उपकरणे" : "Machinery & Equipment"}
              </div>
              <div className="space-y-1">
                {results.machines.map((m) => (
                  <Link
                    key={m.id}
                    to={`/machines/${m.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.images[0]}
                        alt={m.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-600">
                          {language === "mr" ? m.nameMr : m.name}
                        </div>
                        <div className="text-xs text-slate-500">{m.productCode}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {results.products.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                {language === "mr" ? "पेपर उत्पादने" : "Paper Products & Materials"}
              </div>
              <div className="space-y-1">
                {results.products.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-600">
                        {language === "mr" ? p.nameMr : p.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {p.code} • {p.gsm} • ₹{p.price}/unit
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Technical Papers Results */}
          {results.papers.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                {language === "mr" ? "तांत्रिक कागदपत्रे" : "Technical Documents & Manuals"}
              </div>
              <div className="space-y-1">
                {results.papers.map((doc) => (
                  <Link
                    key={doc.id}
                    to="/technical-papers"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-600">
                        {language === "mr" ? doc.titleMr : doc.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {doc.documentType} • {doc.fileSize}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
