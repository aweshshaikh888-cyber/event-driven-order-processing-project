import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  Machine,
  Order,
  QuoteRequest,
  Inquiry,
  TechnicalPaper,
  InventoryItem,
  NotificationItem,
  CartItem,
  QuoteCartItem,
  OrderStatus,
  QuoteStatus,
} from "../types";
import {
  INITIAL_PRODUCTS,
  INITIAL_MACHINES,
  INITIAL_ORDERS,
  INITIAL_QUOTES,
  INITIAL_INQUIRIES,
  INITIAL_TECHNICAL_PAPERS,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
} from "../data/initialData";

interface StoreContextType {
  products: Product[];
  machines: Machine[];
  orders: Order[];
  quotes: QuoteRequest[];
  inquiries: Inquiry[];
  technicalPapers: TechnicalPaper[];
  inventory: InventoryItem[];
  notifications: NotificationItem[];
  cart: CartItem[];
  quoteCart: QuoteCartItem[];
  savedIds: string[];
  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkoutCart: (customerInfo: { name: string; email: string; phone: string; address: string; customerId?: string }) => Order;
  // Quote operations
  addToQuoteCart: (item: {
    itemType: "machine" | "product";
    itemId: string;
    name: string;
    category: string;
    image?: string;
    quantity?: number;
    requirements?: string;
    expectedDelivery?: string;
  }) => void;
  removeFromQuoteCart: (itemId: string) => void;
  updateQuoteCartRequirements: (itemId: string, req: string, delivery?: string, qty?: number) => void;
  clearQuoteCart: () => void;
  submitQuoteRequest: (customerInfo: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    customerId?: string;
    notes?: string;
  }) => QuoteRequest;
  // Admin Operations
  addMachine: (machine: Machine) => void;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPayment: (orderId: string, payment: "Pending" | "Paid" | "Partial") => void;
  respondToQuote: (
    quoteId: string,
    data: {
      estimatedPrice: number | null;
      deliveryLeadTime?: string;
      ownerReply?: string;
      notes?: string;
      status: QuoteStatus;
    }
  ) => void;
  addTechnicalPaper: (paper: TechnicalPaper) => void;
  deleteTechnicalPaper: (id: string) => void;
  submitInquiry: (inquiryData: Omit<Inquiry, "id" | "status" | "createdAt">) => void;
  replyToInquiry: (id: string, reply: string) => void;
  updateInventoryStock: (sku: string, newQty: number) => void;
  toggleSaved: (id: string) => void;
  markNotificationRead: (id: string) => void;
  resetToSampleData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const s = localStorage.getItem("dhey_products");
    return s ? JSON.parse(s) : INITIAL_PRODUCTS;
  });

  const [machines, setMachines] = useState<Machine[]>(() => {
    const s = localStorage.getItem("dhey_machines");
    return s ? JSON.parse(s) : INITIAL_MACHINES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const s = localStorage.getItem("dhey_orders");
    return s ? JSON.parse(s) : INITIAL_ORDERS;
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const s = localStorage.getItem("dhey_quotes");
    return s ? JSON.parse(s) : INITIAL_QUOTES;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const s = localStorage.getItem("dhey_inquiries");
    return s ? JSON.parse(s) : INITIAL_INQUIRIES;
  });

  const [technicalPapers, setTechnicalPapers] = useState<TechnicalPaper[]>(() => {
    const s = localStorage.getItem("dhey_docs");
    return s ? JSON.parse(s) : INITIAL_TECHNICAL_PAPERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const s = localStorage.getItem("dhey_inventory");
    return s ? JSON.parse(s) : INITIAL_INVENTORY;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const s = localStorage.getItem("dhey_notifs");
    return s ? JSON.parse(s) : INITIAL_NOTIFICATIONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const s = localStorage.getItem("dhey_cart");
    return s ? JSON.parse(s) : [];
  });

  const [quoteCart, setQuoteCart] = useState<QuoteCartItem[]>(() => {
    const s = localStorage.getItem("dhey_quotecart");
    return s ? JSON.parse(s) : [];
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const s = localStorage.getItem("dhey_saved");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => { localStorage.setItem("dhey_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("dhey_machines", JSON.stringify(machines)); }, [machines]);
  useEffect(() => { localStorage.setItem("dhey_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("dhey_quotes", JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem("dhey_inquiries", JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem("dhey_docs", JSON.stringify(technicalPapers)); }, [technicalPapers]);
  useEffect(() => { localStorage.setItem("dhey_inventory", JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem("dhey_notifs", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("dhey_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("dhey_quotecart", JSON.stringify(quoteCart)); }, [quoteCart]);
  useEffect(() => { localStorage.setItem("dhey_saved", JSON.stringify(savedIds)); }, [savedIds]);
  // Cart Actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const checkoutCart = (customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    customerId?: string;
  }): Order => {
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `DHEY-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customerInfo.customerId || "usr-guest",
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        quantity: c.quantity,
        unitPrice: c.product.price,
        total: c.product.price * c.quantity,
      })),
      totalAmount,
      orderDate: new Date().toISOString().split("T")[0],
      paymentStatus: "Pending",
      status: "Confirmed",
      shippingAddress: customerInfo.address,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Owner notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: "usr-admin",
        role: "owner",
        title: "New Customer Order Placed",
        titleMr: "नवीन ग्राहकाची ऑर्डर प्राप्त झाली",
        message: `${customerInfo.name} placed Order #${newOrder.orderNumber} for ₹${totalAmount.toLocaleString()}`,
        messageMr: `${customerInfo.name} यांनी ₹${totalAmount.toLocaleString()} ची ऑर्डर #${newOrder.orderNumber} नोंदवली आहे.`,
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        read: false,
        type: "order",
      },
      ...prev,
    ]);

    return newOrder;
  };

  // Quote Cart Actions
  const addToQuoteCart = (item: {
    itemType: "machine" | "product";
    itemId: string;
    name: string;
    category: string;
    image?: string;
    quantity?: number;
    requirements?: string;
    expectedDelivery?: string;
  }) => {
    setQuoteCart((prev) => {
      const idx = prev.findIndex((i) => i.itemId === item.itemId);
      if (idx > -1) {
        return prev;
      }
      return [
        ...prev,
        {
          id: `qi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          itemType: item.itemType,
          itemId: item.itemId,
          name: item.name,
          category: item.category,
          image: item.image,
          quantity: item.quantity || 1,
          requirements: item.requirements || "Standard industrial specification requested.",
          expectedDelivery: item.expectedDelivery || "Within 15 days",
        },
      ];
    });
  };

  const removeFromQuoteCart = (itemId: string) => {
    setQuoteCart((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const updateQuoteCartRequirements = (itemId: string, req: string, delivery?: string, qty?: number) => {
    setQuoteCart((prev) =>
      prev.map((i) =>
        i.itemId === itemId
          ? {
              ...i,
              requirements: req,
              expectedDelivery: delivery || i.expectedDelivery,
              quantity: qty || i.quantity,
            }
          : i
      )
    );
  };

  const clearQuoteCart = () => setQuoteCart([]);

  const submitQuoteRequest = (customerInfo: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    customerId?: string;
    notes?: string;
  }): QuoteRequest => {
    const newQuote: QuoteRequest = {
      id: `quot-${Date.now()}`,
      quoteNumber: `DHEY-RFQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerId: customerInfo.customerId || "usr-guest",
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      companyName: customerInfo.companyName,
      items: [...quoteCart],
      estimatedPrice: null,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
      notes: customerInfo.notes,
    };

    setQuotes((prev) => [newQuote, ...prev]);
    clearQuoteCart();

    // Owner notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: "usr-admin",
        role: "owner",
        title: "New Machine Quote Request (RFQ)",
        titleMr: "नवीन मशिनरी कोटेशन विनंती प्राप्त",
        message: `${customerInfo.name} (${customerInfo.companyName}) submitted RFQ #${newQuote.quoteNumber}.`,
        messageMr: `${customerInfo.name} (${customerInfo.companyName}) यांनी RFQ #${newQuote.quoteNumber} पाठवले आहे.`,
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        read: false,
        type: "quote",
      },
      ...prev,
    ]);

    return newQuote;
  };

  // Admin & CRUD operations
  const addMachine = (m: Machine) => setMachines((p) => [m, ...p]);
  const updateMachine = (id: string, updates: Partial<Machine>) =>
    setMachines((p) => p.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  const deleteMachine = (id: string) => setMachines((p) => p.filter((m) => m.id !== id));

  const addProduct = (prod: Product) => setProducts((p) => [prod, ...p]);
  const updateProduct = (id: string, updates: Partial<Product>) =>
    setProducts((p) => p.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod)));
  const deleteProduct = (id: string) => setProducts((p) => p.filter((prod) => prod.id !== id));

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const updateOrderPayment = (orderId: string, payment: "Pending" | "Paid" | "Partial") => {
    setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, paymentStatus: payment } : o)));
  };

  const respondToQuote = (
    quoteId: string,
    data: {
      estimatedPrice: number | null;
      deliveryLeadTime?: string;
      ownerReply?: string;
      notes?: string;
      status: QuoteStatus;
    }
  ) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          const updated = { ...q, ...data };
          // notify customer
          setNotifications((notifs) => [
            {
              id: `notif-${Date.now()}`,
              userId: q.customerId,
              role: "customer",
              title: "Quotation Updated by Dhey Industries",
              titleMr: "ध्येय इंडस्ट्रीजकडून कोटेशन अपडेट",
              message: `Your RFQ #${q.quoteNumber} has been updated. Status: ${data.status}.`,
              messageMr: `तुमच्या कोटेशन #${q.quoteNumber} ला कंपनीकडून प्रतिसाद आला आहे. स्थिती: ${data.status}.`,
              date: new Date().toISOString().replace("T", " ").substring(0, 16),
              read: false,
              type: "quote",
            },
            ...notifs,
          ]);
          return updated;
        }
        return q;
      })
    );
  };

  const addTechnicalPaper = (paper: TechnicalPaper) => setTechnicalPapers((p) => [paper, ...p]);
  const deleteTechnicalPaper = (id: string) =>
    setTechnicalPapers((p) => p.filter((d) => d.id !== id));

  const submitInquiry = (data: Omit<Inquiry, "id" | "status" | "createdAt">) => {
    const inq: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: "New",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setInquiries((prev) => [inq, ...prev]);
  };

  const replyToInquiry = (id: string, reply: string) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, reply, status: "Replied" } : i))
    );
  };

  const updateInventoryStock = (sku: string, newQty: number) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.sku === sku
          ? {
              ...inv,
              availableQuantity: newQty,
              status:
                newQty <= 0
                  ? "out_of_stock"
                  : newQty <= inv.lowStockThreshold
                  ? "low_stock"
                  : "in_stock",
            }
          : inv
      )
    );
  };

  const toggleSaved = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetToSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setMachines(INITIAL_MACHINES);
    setOrders(INITIAL_ORDERS);
    setQuotes(INITIAL_QUOTES);
    setInquiries(INITIAL_INQUIRIES);
    setTechnicalPapers(INITIAL_TECHNICAL_PAPERS);
    setInventory(INITIAL_INVENTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCart([]);
    setQuoteCart([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        machines,
        orders,
        quotes,
        inquiries,
        technicalPapers,
        inventory,
        notifications,
        cart,
        quoteCart,
        savedIds,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutCart,
        addToQuoteCart,
        removeFromQuoteCart,
        updateQuoteCartRequirements,
        clearQuoteCart,
        submitQuoteRequest,
        addMachine,
        updateMachine,
        deleteMachine,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateOrderPayment,
        respondToQuote,
        addTechnicalPaper,
        deleteTechnicalPaper,
        submitInquiry,
        replyToInquiry,
        updateInventoryStock,
        toggleSaved,
        markNotificationRead,
        resetToSampleData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
