import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth, OWNER_EMAIL, OWNER_PASSWORD } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GlobalSearchModal } from "./GlobalSearchModal";
import {
  Phone,
  Mail,
  Search,
  ShoppingCart,
  FileSpreadsheet,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  onOpenCart?: () => void;
  onOpenQuoteModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenQuoteModal }) => {
  const { t, language } = useLanguage();
  const { currentUser, isOwner, logout, quickLoginAsOwner, quickLoginAsCustomer } = useAuth();
  const { cart, quoteCart } = useStore();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const quoteTotalCount = quoteCart.length;

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.machines, path: "/machines" },
    { name: t.nav.products, path: "/products" },
    { name: t.nav.paperProducts, path: "/paper-products" },
    { name: t.nav.droneEquipment, path: "/drone-equipment" },
    { name: t.nav.technicalPapers, path: "/technical-papers" },
    { name: t.nav.services, path: "/services" },
    { name: t.nav.about, path: "/about" },
    { name: t.nav.contact, path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Industrial Contact & Language Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Contact Details */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <a
              href="tel:+917298772222"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold tracking-wide">+91 7298772222</span>
            </a>
            <a
              href="mailto:dheyindustries@gmail.com"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>dheyindustries@gmail.com</span>
            </a>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-slate-400">
              {language === "mr"
                ? "पत्रावळी, द्रोण व औद्योगिक मशीन मॅन्युफॅक्चरर"
                : "Paper Product & Machine Manufacturer"}
            </span>
          </div>

          {/* Quick Demo Credentials & Language Toggle */}
          <div className="flex items-center gap-3">
            {!currentUser && (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  type="button"
                  onClick={quickLoginAsOwner}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-950 text-sky-300 border border-sky-800 hover:bg-sky-900 transition-colors flex items-center gap-1"
                  title="One-click demo login as Owner (dheyindustries@gmail.com)"
                >
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  <span>Owner Demo</span>
                </button>
                <button
                  type="button"
                  onClick={quickLoginAsCustomer}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                  title="One-click demo login as Customer"
                >
                  <span>Customer Demo</span>
                </button>
              </div>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/images/logo.png"
              alt="Dhey Industries Logo"
              className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "text-sky-700 bg-sky-50 font-bold"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Search Machinery & Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quote Cart Button */}
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 transition-colors shadow-2xs"
              title="View Quote Requests"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">
                {language === "mr" ? "कोटेशन यादी" : "Quotes"}
              </span>
              {quoteTotalCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-sky-600 text-white">
                  {quoteTotalCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-amber-600 text-white shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      isOwner ? "bg-amber-600" : "bg-sky-600"
                    }`}
                  >
                    {isOwner ? "AD" : currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {isOwner ? "Dhey Admin" : currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-modal-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {currentUser.email}
                      </div>
                    </div>

                    {isOwner ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Owner / Admin ERP Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        to="/user/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                      >
                        <User className="w-4 h-4 text-sky-600" />
                        <span>Customer Portal</span>
                      </Link>
                    )}

                    {!isOwner && (
                      <>
                        <Link
                          to="/user/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          {language === "mr" ? "माझ्या ऑर्डर्स" : "My Orders"}
                        </Link>
                        <Link
                          to="/user/quotes"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          {language === "mr" ? "माझे कोटेशन्स" : "My Quotes"}
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/contact"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.nav.requestQuote}</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Android & Tablet Friendly) */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-modal-in shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
            <LanguageSwitcher />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  isActive(link.path)
                    ? "bg-sky-50 text-sky-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl bg-slate-50"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-sky-600 rounded-xl"
                >
                  {t.nav.register}
                </Link>
              </div>
            ) : (
              <Link
                to={isOwner ? "/admin" : "/user/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl shadow-xs"
              >
                {isOwner ? "Go to Owner / Admin ERP" : "Go to Customer Portal"}
              </Link>
            )}

            {/* Direct hotline call button for mobile */}
            <a
              href="tel:+917298772222"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Direct: +91 7298772222</span>
            </a>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};
