import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { X, Trash2, Send, Building, Mail, Phone, User, Calendar, CheckCircle2, FileSpreadsheet } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const { quoteCart, removeFromQuoteCart, updateQuoteCartRequirements, submitQuoteRequest, clearQuoteCart } = useStore();
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(currentUser?.name || "");
  const [companyName, setCompanyName] = useState(currentUser?.company || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedQuoteNumber, setSubmittedQuoteNumber] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast(
        language === "mr" ? "कृपया नाव, ईमेल व फोन नंबर प्रविष्ट करा." : "Please enter your name, email, and phone number.",
        "error"
      );
      return;
    }

    if (quoteCart.length === 0) {
      showToast(
        language === "mr" ? "कोटेशन यादीमध्ये किमान एक मशीन किंवा उत्पादन असणे आवश्यक आहे." : "Your quote cart is empty. Please add machines first.",
        "error"
      );
      return;
    }

    const createdQuote = submitQuoteRequest({
      name,
      companyName: companyName || "Individual Manufacturing Unit",
      email,
      phone,
      customerId: currentUser?.id,
      notes,
    });

    setSubmittedQuoteNumber(createdQuote.quoteNumber);
    setIsSubmitted(true);
    showToast(
      language === "mr"
        ? `कोटेशन विनंती यशस्वीरीत्या पाठवली गेली! (संदर्भ: ${createdQuote.quoteNumber})`
        : `Request for Quotation submitted successfully! (Ref: ${createdQuote.quoteNumber})`,
      "success"
    );
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-modal-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === "mr" ? "औद्योगिक कोटेशन विनंती (RFQ Cart)" : "Request for Quotation (RFQ)"}
              </h3>
              <p className="text-xs text-slate-500">
                {language === "mr"
                  ? "मशिनरी, उत्पादन क्षमता व किमतीचे अधिकृत कोटेशन"
                  : "Direct machine quotation from Dhey Industries Engineering Team"}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {language === "mr" ? "कोटेशन विनंती यशस्वीरीत्या नोंदवली गेली!" : "Quotation Request Received!"}
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {language === "mr"
                  ? `आपल्या कोटेशनचा संदर्भ क्रमांक ${submittedQuoteNumber} आहे. ध्येय इंडस्ट्रीजची इंजिनिअरिंग टीम लवकरच आपल्याशी फोन किंवा ईमेलवर संपर्क करेल.`
                  : `Your RFQ Reference Number is ${submittedQuoteNumber}. Our engineering team is preparing your custom proforma quotation.`}
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs text-slate-600 text-left space-y-1">
                <div><span className="font-semibold text-slate-800">Direct Helpline:</span> +91 7298772222</div>
                <div><span className="font-semibold text-slate-800">Email:</span> dheyindustries@gmail.com</div>
              </div>
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
              >
                {language === "mr" ? "बंद करा" : "Close Window"}
              </button>
            </div>
          ) : quoteCart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-slate-700 font-bold">
                {language === "mr" ? "तुमची कोटेशन यादी रिकामी आहे" : "Your Quote Cart is Currently Empty"}
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === "mr"
                  ? "मशीन पानावर जाऊन 'कोटेशन यादीत जोडा' (Add to Quote) बटनावर क्लिक करा."
                  : "Browse our industrial machines and click 'Add to Quote' on any machine to receive pricing and technical delivery specs."}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors"
              >
                {language === "mr" ? "मशीन्स पहा" : "Browse Machinery"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Machines in Quote Cart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>{language === "mr" ? "निवडलेली मशीन्स व उपकरणे" : "Selected Machines for Quotation"}</span>
                  <button
                    type="button"
                    onClick={clearQuoteCart}
                    className="text-rose-600 hover:underline normal-case text-xs font-medium"
                  >
                    {language === "mr" ? "सर्व काढून टाका" : "Clear All"}
                  </button>
                </div>

                <div className="space-y-3">
                  {quoteCart.map((item) => (
                    <div
                      key={item.itemId}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white"
                          />
                        )}
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">{language === "mr" ? "प्रमाण:" : "Qty:"}</span>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuoteCartRequirements(
                                item.itemId,
                                item.requirements,
                                item.expectedDelivery,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-14 px-2 py-1 text-xs font-bold text-center border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromQuoteCart(item.itemId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remove from Quote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Contact Form */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === "mr" ? "संपर्क व फॅक्टरी माहिती" : "Contact & Factory Details"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === "mr" ? "पूर्ण नाव *" : "Full Name *"}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rameshwar Patil"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === "mr" ? "कंपनी / फॅक्टरी नाव" : "Company / Workshop Name"}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Patil Eco Packaging"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === "mr" ? "ईमेल पत्ता *" : "Email Address *"}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rameshwar@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === "mr" ? "फोन / व्हॉट्सॲप नंबर *" : "Phone / WhatsApp Number *"}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9822012345"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === "mr" ? "विशेष आवश्यकता / नोट (उदा: डायचे आकार, सिंगल फेज मोटर)" : "Custom Tooling or Specific Notes"}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      language === "mr"
                        ? "उदा: मला 14 इंच कप्पा थाळी आणि 6 इंच द्रोण डाय हवे आहेत. सिंगल फेज वीज उपलब्ध आहे."
                        : "e.g. We require 14-inch compartment thali die, single-phase motor, and shipment to Nashik."
                    }
                    className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  {language === "mr" ? "रद्द करा" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === "mr" ? "अधिकृत कोटेशन सबमिट करा" : "Submit Quote Request"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
