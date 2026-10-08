import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Plus, Minus } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, checkoutCart } = useStore();
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState(currentUser?.address || "");
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      showToast(
        language === "mr" ? "कृपया सर्व आवश्यक संपर्क व पत्ता माहिती भरा." : "Please fill in all shipping details.",
        "error"
      );
      return;
    }

    const newOrder = checkoutCart({
      name,
      email,
      phone,
      address,
      customerId: currentUser?.id,
    });

    setOrderComplete(newOrder.orderNumber);
    showToast(
      language === "mr"
        ? `ऑर्डर यशस्वीरित्या नोंदवली गेली! (#${newOrder.orderNumber})`
        : `Order #${newOrder.orderNumber} placed successfully!`,
      "success"
    );
  };

  const resetDrawer = () => {
    setOrderComplete(null);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-modal-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {language === "mr" ? "खरेदी कार्ट (Paper Products)" : "Shopping Cart"}
            </h3>
            <span className="px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-700 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={resetDrawer}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderComplete ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {language === "mr" ? "ऑर्डर कन्फर्म झाली!" : "Order Confirmed!"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === "mr"
                  ? `आपली ऑर्डर #${orderComplete} नोंदवली गेली असून डिस्पॅचची प्रक्रिया सुरू झाली आहे.`
                  : `Your order #${orderComplete} has been submitted for warehouse dispatch.`}
              </p>
              <button
                onClick={resetDrawer}
                className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl"
              >
                {language === "mr" ? "पूर्ण करा" : "Close"}
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-700">
                {language === "mr" ? "कार्ट रिकामी आहे" : "Your cart is empty"}
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {language === "mr"
                  ? "पत्रावळी शीट्स, क्राफ्ट पेपर व डिस्पोजेबल प्रॉडक्ट्स कार्टमध्ये जोडा."
                  : "Add paper rolls, patrawali blanks, or plates to cart to place direct orders."}
              </p>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === "mr" ? "डिलिव्हरी व इनव्हॉइस माहिती" : "Shipping & Billing Information"}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Factory / Delivery Address</label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Factory Plot, Industrial Area, City, State..."
                  className="w-full p-2.5 text-xs border rounded-xl border-slate-300 outline-hidden"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border text-xs text-slate-600 space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Total Payable:</span>
                  <span className="text-sky-700 font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-slate-400">Invoice terms: Net 30 / Advance Bank Transfer</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 border rounded-xl hover:bg-slate-50"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {language === "mr" ? item.product.nameMr : item.product.name}
                    </div>
                    <div className="text-[11px] text-slate-500">₹{item.product.price} / unit</div>
                    <div className="text-[11px] font-bold text-sky-700">
                      Total: ₹{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isCheckingOut && !orderComplete && cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-slate-900">
              <span>{language === "mr" ? "एकूण रक्कम:" : "Subtotal:"}</span>
              <span className="text-sky-700 text-base">₹{totalAmount.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <span>{language === "mr" ? "ऑर्डर पुढे चालू ठेवा" : "Proceed to Order"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
