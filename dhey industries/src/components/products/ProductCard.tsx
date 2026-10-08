import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import { ShoppingCart, FileSpreadsheet, Package, Layers } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onOpenCart?: () => void;
  onOpenQuoteModal?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenCart,
  onOpenQuoteModal,
}) => {
  const { language } = useLanguage();
  const { addToCart, addToQuoteCart } = useStore();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(
      language === "mr"
        ? `"${product.nameMr}" कार्टमध्ये जोडले गेले!`
        : `"${product.name}" added to cart!`,
      "success"
    );
    if (onOpenCart) onOpenCart();
  };

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToQuoteCart({
      itemType: "product",
      itemId: product.id,
      name: language === "mr" ? product.nameMr : product.name,
      category: "Paper Product / Consumable",
      image: product.images[0],
      quantity: 1,
      requirements: `Bulk wholesale quote requested for ${product.gsm} (${product.size}).`,
      expectedDelivery: "Standard Delivery",
    });
    showToast(
      language === "mr"
        ? `"${product.nameMr}" कोटेशन यादीत जोडले गेले!`
        : `"${product.name}" added to quote cart!`,
      "info"
    );
    if (onOpenQuoteModal) onOpenQuoteModal();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
            <Layers className="w-3 h-3 text-amber-400" />
            <span>{product.rollSheetType}</span>
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-600 text-white shadow-xs">
            {product.gsm}
          </span>
        </div>

        <div className="absolute bottom-2 left-3">
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-900/70 text-slate-200 rounded">
            {product.code}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link to={`/products/${product.id}`}>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
              {language === "mr" ? product.nameMr : product.name}
            </h4>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2">
            {language === "mr" ? product.descriptionMr : product.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Material</span>
              <span className="font-semibold">{product.material}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">MOQ</span>
              <span className="font-semibold">{product.moq}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">
              {language === "mr" ? "दर" : "Rate"}
            </span>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{product.price}
              </span>
              <span className="text-[10px] text-slate-500">
                {product.category === "finished_plates" ? "/ piece" : "/ kg"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="py-2 px-3 text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === "mr" ? "कार्टमध्ये" : "Add to Cart"}</span>
            </button>

            <button
              type="button"
              onClick={handleAddToQuote}
              className="py-2 px-3 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === "mr" ? "कोटेशन" : "Quote"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
