import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Branding & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block bg-white p-2 rounded-xl shadow-xs">
              <img
                src="/images/logo.png"
                alt="Dhey Industries Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.companyDesc}
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ISO 9001:2015 Industrial Quality Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  {language === "mr"
                    ? "कामाचे तास: सोमवार - शनिवार, सकाळी 9 ते संध्याकाळी 7"
                    : "Business Hours: Mon - Sat, 09:00 AM - 07:00 PM IST"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Machinery Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {language === "mr" ? "प्रमुख मशीन्स" : "Featured Machinery"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  to="/machines/mach-01"
                  className="hover:text-sky-400 transition-colors"
                >
                  {language === "mr"
                    ? "ऑल-इन-वन ऑटोमॅटिक पत्रावळी (5 रोल)"
                    : "Automatic 5-Roll Patrawali (₹1,11,000)"}
                </Link>
              </li>
              <li>
                <Link
                  to="/machines/mach-02"
                  className="hover:text-sky-400 transition-colors"
                >
                  {language === "mr"
                    ? "सेमी-ऑटोमॅटिक पत्रावळी (मॅन्युअल फीड)"
                    : "Semi-Automatic Single Die (₹1,11,000)"}
                </Link>
              </li>
              <li>
                <Link
                  to="/machines/mach-03"
                  className="hover:text-sky-400 transition-colors"
                >
                  {language === "mr"
                    ? "डबल डाय सेमी-ऑटोमॅटिक मशीन"
                    : "Double Die Semi-Automatic Machine"}
                </Link>
              </li>
              <li>
                <Link
                  to="/machines/mach-04"
                  className="hover:text-sky-400 transition-colors"
                >
                  {language === "mr"
                    ? "ऑटोमॅटिक सिंगल डाय द्रोण मशीन"
                    : "Automatic Dron Making Machine (Belt Drive)"}
                </Link>
              </li>
              <li>
                <Link
                  to="/machines/mach-05"
                  className="hover:text-sky-400 transition-colors"
                >
                  {language === "mr"
                    ? "डबल डाय 65 किलो/दिवस मॉडेल"
                    : "Double Die 65 kg/Day Model"}
                </Link>
              </li>
              <li>
                <Link to="/drone-equipment" className="hover:text-sky-400 transition-colors">
                  {language === "mr" ? "व्यावसायिक ड्रोन असेंबली उपकरणे" : "Commercial Drone Equipment"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products & Papers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {language === "mr" ? "उत्पादने व कागदपत्रे" : "Products & Papers"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/paper-products" className="hover:text-sky-400 transition-colors">
                  {language === "mr" ? "सिल्व्हर लॅमिनेटेड शीट्स व रोल्स" : "Silver Laminated Sheets & Rolls"}
                </Link>
              </li>
              <li>
                <Link to="/paper-products" className="hover:text-sky-400 transition-colors">
                  {language === "mr" ? "क्राफ्ट व फ्लूटिंग पेपर रोल्स" : "Kraft & Corrugating Medium"}
                </Link>
              </li>
              <li>
                <Link to="/paper-products" className="hover:text-sky-400 transition-colors">
                  {language === "mr" ? "कप्पा थाळी व द्रोण वाट्या" : "Finished Thali & Dron Bowls"}
                </Link>
              </li>
              <li>
                <Link to="/technical-papers" className="hover:text-sky-400 transition-colors">
                  {language === "mr" ? "मशीन माहितीपत्रके (Datasheets)" : "Technical Datasheets (PDF)"}
                </Link>
              </li>
              <li>
                <Link to="/technical-papers" className="hover:text-sky-400 transition-colors">
                  {language === "mr" ? "ऑपरेटर व सेफ्टी मॅन्युअल्स" : "Operator & Safety Manuals"}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-sky-400 transition-colors">
                  {language === "mr" ? "इन्स्टॉलेशन व स्पेअर पार्ट्स" : "Installation & Spare Parts"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Direct Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <a
                href="tel:+917298772222"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">+91 7298772222</div>
                  <div className="text-[11px] text-slate-400">Direct Sales & Technical Helpline</div>
                </div>
              </a>

              <a
                href="mailto:dheyindustries@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">dheyindustries@gmail.com</span>
              </a>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed">
                  {t.footer.address}
                </span>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold pt-1"
              >
                <span>
                  {language === "mr"
                    ? "लाईव्ह मॅप व फॅक्टरी पत्ता पहा"
                    : "View Live Maps & Driving Directions"}
                </span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Dhey Industries. {t.footer.allRightsReserved}</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              About
            </Link>
            <Link to="/machines" className="hover:text-slate-300 transition-colors">
              Machinery
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">
              Staff / Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
