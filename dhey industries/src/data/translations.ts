export interface TranslationSchema {
  nav: {
    home: string;
    about: string;
    products: string;
    machines: string;
    paperProducts: string;
    droneEquipment: string;
    technicalPapers: string;
    services: string;
    contact: string;
    login: string;
    register: string;
    dashboard: string;
    adminDashboard: string;
    requestQuote: string;
    cart: string;
    quotes: string;
    searchPlaceholder: string;
    phone: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheading: string;
    exploreProducts: string;
    requestQuote: string;
    callNow: string;
    experienceYears: string;
    machinesDelivered: string;
    happyClients: string;
    productionCapacity: string;
  };
  aboutSection: {
    title: string;
    subtitle: string;
    description: string;
    points: string[];
    readMore: string;
  };
  solutions: {
    title: string;
    subtitle: string;
    paperProductsTitle: string;
    paperProductsDesc: string;
    paperMachinesTitle: string;
    paperMachinesDesc: string;
    droneEquipmentTitle: string;
    droneEquipmentDesc: string;
    viewProducts: string;
    viewMachines: string;
  };
  featuredMachines: {
    title: string;
    subtitle: string;
    viewAll: string;
    requestQuote: string;
    viewDetails: string;
    specs: string;
    capacity: string;
    power: string;
    priceStarting: string;
    quoteOnly: string;
    addToQuote: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    selectMachine: string;
    dailyProduction: string;
    workingHours: string;
    daysPerMonth: string;
    monthlyOutput: string;
    monthlyProfit: string;
    yearlyOutput: string;
    yearlyProfit: string;
    note: string;
  };
  whyChooseUs: {
    title: string;
    subtitle: string;
    features: Array<{ title: string; desc: string }>;
  };
  industries: {
    title: string;
    subtitle: string;
    items: string[];
  };
  cta: {
    title: string;
    subtitle: string;
    requestQuote: string;
    contactEngineering: string;
    callUs: string;
  };
  footer: {
    companyDesc: string;
    quickLinks: string;
    products: string;
    machines: string;
    contactInfo: string;
    allRightsReserved: string;
    address: string;
    ownerEmail: string;
    ownerPhone: string;
  };
  common: {
    viewDetails: string;
    addToCart: string;
    addToQuote: string;
    requestQuote: string;
    inStock: string;
    outOfStock: string;
    specifications: string;
    price: string;
    moq: string;
    category: string;
    status: string;
    actions: string;
    submit: string;
    cancel: string;
    loading: string;
    downloadBrochure: string;
    downloadManual: string;
    contactEngineer: string;
    safetyInfo: string;
    applications: string;
    installationRequirements: string;
  };
}

export const translations: Record<"en" | "mr", TranslationSchema> = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      products: "Products",
      machines: "Machines",
      paperProducts: "Paper Products",
      droneEquipment: "Drone Machinery",
      technicalPapers: "Technical Papers",
      services: "Services",
      contact: "Contact",
      login: "Login",
      register: "Register",
      dashboard: "Customer Portal",
      adminDashboard: "Owner Portal",
      requestQuote: "Request a Quote",
      cart: "Cart",
      quotes: "Quotes",
      searchPlaceholder: "Search machines, products, papers...",
      phone: "+91 7298772222",
    },
    hero: {
      badge: "ISO Certified Industrial Engineering",
      headline: "Advanced Manufacturing Solutions for Paper & Drone Industries",
      subheading:
        "Engineering high-performance machines, industrial equipment and paper solutions for modern manufacturing facilities worldwide.",
      exploreProducts: "Explore Machines & Products",
      requestQuote: "Request a Quote",
      callNow: "Call: +91 7298772222",
      experienceYears: "15+ Years Industry Experience",
      machinesDelivered: "1,200+ Machines Delivered",
      happyClients: "850+ Enterprise Clients",
      productionCapacity: "99.4% Operational Uptime",
    },
    aboutSection: {
      title: "About Dhey Industries",
      subtitle: "Engineering Excellence in Paper & Drone Machinery",
      description:
        "Dhey Industries is a premier industrial manufacturing and engineering corporation. We design, manufacture, and supply high-precision automatic and semi-automatic paper plate/patrawali machines, dron making equipment, industrial paper products, and commercial drone assembly/testing equipment. Our machines are built with robust heavy-duty structures to guarantee high efficiency, low maintenance, and maximum business profitability.",
      points: [
        "Heavy-duty rigid machine frames with industrial durability",
        "High-performance motors and multi-die interchangeable tooling",
        "Low capital investment with high daily manufacturing throughput",
        "Complete technical assistance, installation, and spare parts support",
      ],
      readMore: "Learn More About Us",
    },
    solutions: {
      title: "Our Core Solutions",
      subtitle: "Comprehensive manufacturing technologies tailored for commercial profitability",
      paperProductsTitle: "Paper Products & Raw Materials",
      paperProductsDesc:
        "Premium kraft paper rolls, food-grade packaging papers, corrugated stock, disposable silver thali, and kappe patrawali blanks.",
      paperMachinesTitle: "Paper Manufacturing & Converting Machines",
      paperMachinesDesc:
        "All-in-one automatic 5-roll patrawali machines, double die semi-automatic presses, dron making machines, and hydraulic plate equipment.",
      droneEquipmentTitle: "Drone Manufacturing & Testing Stations",
      droneEquipmentDesc:
        "Industrial assembly benches, automated PCB surface mount inspection, motor torque dynamometers, battery load test benches, and flight calibration rigs.",
      viewProducts: "Browse Products",
      viewMachines: "Browse Machinery",
    },
    featuredMachines: {
      title: "Featured Industrial Machinery",
      subtitle: "High-yield, reliable manufacturing systems with proven return on investment",
      viewAll: "View All Machinery",
      requestQuote: "Request a Quote",
      viewDetails: "View Technical Specs",
      specs: "Key Specifications",
      capacity: "Production Capacity",
      power: "Power Requirement",
      priceStarting: "Price starting at",
      quoteOnly: "Price On Request / Custom Quote",
      addToQuote: "Add to Quote Cart",
    },
    calculator: {
      title: "Production & Profit Calculator",
      subtitle: "Estimate your output and business returns based on operational hours",
      selectMachine: "Select Manufacturing Machine",
      dailyProduction: "Daily Production Capacity",
      workingHours: "Operating Hours / Day",
      daysPerMonth: "Operating Days / Month",
      monthlyOutput: "Est. Monthly Production",
      monthlyProfit: "Est. Monthly Profit Margin",
      yearlyOutput: "Est. Annual Output",
      yearlyProfit: "Est. Annual Profit Potential",
      note: "* Profit calculations are based on standard raw material and market pricing formulas. Actual earnings may vary based on local paper raw material costs and wholesale demand.",
    },
    whyChooseUs: {
      title: "Why Partner With Dhey Industries",
      subtitle: "Engineered for maximum reliability, lower lifecycle costs, and rapid ROI",
      features: [
        {
          title: "Heavy-Duty Construction",
          desc: "Built with structural steel frames and premium hydraulic cylinders designed for non-stop continuous factory shifts.",
        },
        {
          title: "High Production Yield",
          desc: "Optimized cycle times producing up to 145 kg/day on automatic systems and consistent quality across all dies.",
        },
        {
          title: "Multi-Die Versatility",
          desc: "Single machine accommodates plain patrawali, kappe thali, breakfast plates, bowls, and custom dron sizes.",
        },
        {
          title: "Prompt Technical Support",
          desc: "Dedicated engineering assistance, direct phone support at +91 7298772222, and fast spare parts dispatch.",
        },
      ],
    },
    industries: {
      title: "Industries We Serve",
      subtitle: "Supplying precision machinery and materials across critical industrial sectors",
      items: [
        "Eco-Friendly Paper Product Manufacturing",
        "Food Service & Catering Packaging",
        "Commercial Drone Assembly Facilities",
        "Industrial Electronics & PCB Assembly",
        "Corrugated Box & Packaging Units",
        "Aviation Component Fabrication",
        "Industrial Automation & Testing Labs",
        "Research & Development Institutions",
      ],
    },
    cta: {
      title: "Looking for the Right Machine for Your Facility?",
      subtitle:
        "Speak directly with our senior mechanical engineers for customized machine configurations, factory layout planning, and quotation sheets.",
      requestQuote: "Request an Instant Quote",
      contactEngineering: "Contact Engineering Team",
      callUs: "Direct Line: +91 7298772222",
    },
    footer: {
      companyDesc:
        "Dhey Industries is a leading manufacturer of paper-making machines, commercial patrawali/dron equipment, high-grade paper supplies, and commercial drone assembly stations.",
      quickLinks: "Quick Navigation",
      products: "Products & Papers",
      machines: "Industrial Machinery",
      contactInfo: "Factory & Office",
      allRightsReserved: "All rights reserved. Dhey Industries.",
      address: "Dhey Industries Manufacturing Facility, Industrial Area, Maharashtra, India",
      ownerEmail: "dheyindustries@gmail.com",
      ownerPhone: "+91 7298772222",
    },
    common: {
      viewDetails: "View Details",
      addToCart: "Add to Cart",
      addToQuote: "Add to Quote",
      requestQuote: "Request a Quote",
      inStock: "In Stock / Ready to Ship",
      outOfStock: "Made to Order",
      specifications: "Technical Specifications",
      price: "Price",
      moq: "Minimum Order Quantity",
      category: "Category",
      status: "Status",
      actions: "Actions",
      submit: "Submit",
      cancel: "Cancel",
      loading: "Processing...",
      downloadBrochure: "Download Brochure (PDF)",
      downloadManual: "Download Operator Manual",
      contactEngineer: "Talk to Engineer",
      safetyInfo: "Safety & Operating Guidelines",
      applications: "Typical Applications",
      installationRequirements: "Installation & Utility Requirements",
    },
  },
  mr: {
    nav: {
      home: "मुख्यपृष्ठ",
      about: "आमच्याबद्दल",
      products: "सर्व उत्पादने",
      machines: "मशीन्स",
      paperProducts: "पेपर प्रॉडक्ट्स",
      droneEquipment: "ड्रोन मशिनरी",
      technicalPapers: "तांत्रिक कागदपत्रे",
      services: "सेवा",
      contact: "संपर्क",
      login: "लॉगिन",
      register: "नोंदणी",
      dashboard: "ग्राहक पोर्टल",
      adminDashboard: "मालक पोर्टल (Admin)",
      requestQuote: "कोटेशन मागवा",
      cart: "कार्ट",
      quotes: "कोटेशन यादी",
      searchPlaceholder: "मशीन्स, प्रॉडक्ट्स किंवा माहिती शोधा...",
      phone: "+91 7298772222",
    },
    hero: {
      badge: "🌿 ऑल-इन-वन ऑटोमॅटिक पत्रावळी व औद्योगिक मशिनरी",
      headline: "“ऑल-इन-वन ऑटोमॅटिक पत्रावळी मशीन”",
      subheading:
        "8 तासांत अंदाजे 145 किलो उत्पादन क्षमता • फक्त ₹1,11,000/- पासून! उच्च दर्जाची पत्रावळी, द्रोण मशिनरी व व्यावसायिक ड्रोन असेंबली उपकरणांचे अग्रगण्य उत्पादक.",
      exploreProducts: "मशीन्स व उत्पादने पहा",
      requestQuote: "कोटेशन मागवा",
      callNow: "थेट संपर्क: +91 7298772222",
      experienceYears: "15+ वर्षांचा औद्योगिक अनुभव",
      machinesDelivered: "1,200+ मशीन्स यशस्वीपणे वितरित",
      happyClients: "850+ समाधानी उद्योजक ग्राहक",
      productionCapacity: "उत्कृष्ट उत्पादन क्षमता व नफा",
    },
    aboutSection: {
      title: "ध्येय इंडस्ट्रीज बद्दल",
      subtitle: "पत्रावळी, द्रोण व औद्योगिक मशीन मॅन्युफॅक्चरिंगमधील अग्रगण्य नाव",
      description:
        "ध्येय इंडस्ट्रीज (Dhey Industries) ही उच्च दर्जाच्या ऑटोमॅटिक व सेमी-ऑटोमॅटिक पत्रावळी मशीन्स, द्रोण बनवण्याच्या मशीन्स, औद्योगिक पेपर उत्पादने आणि व्यावसायिक ड्रोन असेंबली/टेस्टिंग उपकरणांची निर्मिती व पुरवठा करणारी विश्वासू कंपनी आहे. कमी गुंतवणुकीत अधिक उत्पादन व खात्रीशीर कमाईचे व्यवसाय मॉडेल आम्ही पुरवतो.",
      points: [
        "मजबूत व टिकाऊ मशीन स्ट्रक्चर आणि हायड्रॉलिक सिस्टीम",
        "एकाच मशीनवर विविध उत्पादने: प्लेन पत्रावळी, कप्पा पत्रावळी, नाश्ता प्लेट, द्रोण",
        "सुलभ ऑपरेशन आणि कमी वीज खर्चात भरघोस उत्पादन",
        "तांत्रिक मार्गदर्शन, स्पेअर पार्ट्स आणि तात्काळ आफ्टर-सेल्स सपोर्ट",
      ],
      readMore: "कंपनीबद्दल अधिक माहिती",
    },
    solutions: {
      title: "आमची मुख्य सोल्यूशन्स",
      subtitle: "व्यवसायाच्या भरभराटीसाठी आधुनिक आणि खात्रीशीर मॅन्युफॅक्चरिंग तंत्रज्ञान",
      paperProductsTitle: "पेपर उत्पादने व कच्चा माल",
      paperProductsDesc:
        "क्राफ्ट पेपर रोल्स, पॅकेजिंग पेपर, डिस्पोजेबल सिल्व्हर थाळी, कप्पा पत्रावळी आणि द्रोणसाठी आवश्यक दर्जेदार मटेरियल.",
      paperMachinesTitle: "पेपर व पत्रावळी मॅन्युफॅक्चरिंग मशीन्स",
      paperMachinesDesc:
        "ऑल-इन-वन ऑटोमॅटिक पत्रावळी मशीन (₹1,11,000/-), डबल डाय सेमी-ऑटोमॅटिक, ऑटोमॅटिक सिंगल डाय द्रोण मशीन.",
      droneEquipmentTitle: "ड्रोन मॅन्युफॅक्चरिंग व टेस्टिंग उपकरणे",
      droneEquipmentDesc:
        "व्यावसायिक व औद्योगिक ड्रोन असेंबली स्टेशन्स, मोटर टॉर्क टेस्ट बेंच, बॅटरी टेस्टिंग आणि सेन्सर कॅलिब्रेशन स्टेशन.",
      viewProducts: "उत्पादने पहा",
      viewMachines: "मशीन्स पहा",
    },
    featuredMachines: {
      title: "प्रमुख औद्योगिक मशीन्स",
      subtitle: "कमी गुंतवणुकीत जास्तीत जास्त उत्पादन व नफा देणारी खात्रीशीर मशीन्स",
      viewAll: "सर्व मशीन्स पहा",
      requestQuote: "कोटेशन मागवा",
      viewDetails: "तांत्रिक माहिती व हिशोब",
      specs: "वैशिष्ट्ये",
      capacity: "उत्पादन क्षमता",
      power: "मोटर क्षमता",
      priceStarting: "मशीन किंमत",
      quoteOnly: "कोटेशन मागवा / संपर्क करा",
      addToQuote: "कोटेशन यादीत जोडा",
    },
    calculator: {
      title: "📊 उत्पादन व नफा गणक (ROI Calculator)",
      subtitle: "तुमच्या दैनंदिन कामकाजानुसार उत्पादन आणि मासिक उत्पन्नाचा हिशोब करा",
      selectMachine: "मशीन निवडा",
      dailyProduction: "दैनंदिन उत्पादन क्षमता",
      workingHours: "रोजचे कामाचे तास",
      daysPerMonth: "महिन्याचे कामकाजाचे दिवस",
      monthlyOutput: "अंदाजे मासिक उत्पादन",
      monthlyProfit: "अंदाजे मासिक उत्पन्न",
      yearlyOutput: "अंदाजे वार्षिक उत्पादन",
      yearlyProfit: "अंदाजे वार्षिक कमाई",
      note: "* 1,000 किलो उत्पादनावर अंदाजे ₹9,000 पर्यंत कमाई (कच्चा माल व इतर खर्चाच्या गणनेनुसार). स्थानिक बाजारातील दरांनुसार तफावत असू शकते.",
    },
    whyChooseUs: {
      title: "ध्येय इंडस्ट्रीज का निवडावी?",
      subtitle: "मजबूत रचना, विश्वासार्ह सेवा आणि हमखास नफ्याची हमी",
      features: [
        {
          title: "एक मशीन – अनेक उत्पादने",
          desc: "एकाच मशीनवर प्लेन पत्रावळी, कप्पा पत्रावळी, नाश्ता प्लेट आणि द्रोण सहज तयार करण्याची सुविधा.",
        },
        {
          title: "मजबूत व टिकाऊ स्ट्रक्चर",
          desc: "उच्च दर्जाचे स्टील आणि आधुनिक मोटर/हायड्रॉलिक सिस्टीममुळे मशीन अखंड काम करते.",
        },
        {
          title: "कमी मनुष्यबळात भरघोस उत्पादन",
          desc: "ऑटोमॅटिक व सेमी-ऑटोमॅटिक पर्यायांमुळे ऑपरेटरचे श्रम वाचतात व उत्पादन क्षमता वाढते.",
        },
        {
          title: "तात्काळ तांत्रिक सहाय्य",
          desc: "फोन क्रमांक +91 7298772222 वर थेट मार्गदर्शन, मशीन इन्स्टॉलेशन आणि स्पेअर पार्ट्सची उपलब्धता.",
        },
      ],
    },
    industries: {
      title: "आम्ही सेवा देतो ती क्षेत्रे",
      subtitle: "पर्यावरणपूरक डिस्पोजेबल उत्पादने आणि प्रगत तंत्रज्ञान उद्योगांसाठी मशीन पुरवठा",
      items: [
        "पर्यावरणपूरक पत्रावळी व द्रोण निर्मिती उद्योग",
        "हॉटेल, केटरिंग व पॅकेजिंग उद्योग",
        "व्यावसायिक ड्रोन असेंबली युनिट्स",
        "इलेक्ट्रॉनिक्स व पीसीबी उत्पादन",
        "पेपर कन्व्हर्टिंग व बॉक्स मॅन्युफॅक्चरिंग",
        "औद्योगिक ऑटोमेशन व टेस्टिंग लॅब",
        "संशोधन आणि विकास संस्था (R&D)",
        "ग्रामीण व लघुउद्योग स्टार्टअप्स",
      ],
    },
    cta: {
      title: "तुमच्या मॅन्युफॅक्चरिंग युनिटसाठी योग्य मशीन शोधत आहात?",
      subtitle:
        "मशीनची किंमत, कोटेशन आणि उत्पादन क्षमतेबद्दल आमच्या तज्ज्ञ इंजिनिअरशी थेट बोला किंवा त्वरित कोटेशन मागवा.",
      requestQuote: "त्वरित कोटेशन मागवा",
      contactEngineering: "इंजिनिअरिंग टीमशी संपर्क करा",
      callUs: "थेट फोन: +91 7298772222",
    },
    footer: {
      companyDesc:
        "ध्येय इंडस्ट्रीज ही पत्रावळी मशीन्स, द्रोण मेकिंग मशीन्स, दर्जेदार पेपर उत्पादने आणि व्यावसायिक ड्रोन मॅन्युफॅक्चरिंग उपकरणांची निर्मिती करणारी विश्वासू कंपनी आहे.",
      quickLinks: "महत्त्वाचे दुवे",
      products: "उत्पादने व पेपर्स",
      machines: "मशिनरी कॅटलॉग",
      contactInfo: "पत्ता व संपर्क",
      allRightsReserved: "सर्व हक्क राखीव. ध्येय इंडस्ट्रीज.",
      address: "ध्येय इंडस्ट्रीज मॅन्युफॅक्चरिंग फॅसिलिटी, इंडस्ट्रियल एरिया, महाराष्ट्र, भारत",
      ownerEmail: "dheyindustries@gmail.com",
      ownerPhone: "+91 7298772222",
    },
    common: {
      viewDetails: "तपशील पहा",
      addToCart: "कार्टमध्ये जोडा",
      addToQuote: "कोटेशनसाठी जोडा",
      requestQuote: "कोटेशन मागवा",
      inStock: "स्टॉकमध्ये उपलब्ध",
      outOfStock: "ऑर्डरनुसार निर्मिती",
      specifications: "तांत्रिक तपशील",
      price: "किंमत",
      moq: "किमान ऑर्डर प्रमाण",
      category: "श्रेणी",
      status: "स्थिती",
      actions: "कृती",
      submit: "सबमिट करा",
      cancel: "रद्द करा",
      loading: "प्रक्रिया चालू आहे...",
      downloadBrochure: "माहितीपत्रक (Brochure) डाऊनलोड",
      downloadManual: "ऑपरेटर मॅन्युअल डाऊनलोड",
      contactEngineer: "इंजिनिअरशी बोला",
      safetyInfo: "सुरक्षा व ऑपरेटिंग सूचना",
      applications: "उत्पादन उपयोग",
      installationRequirements: "इन्स्टॉलेशन व पॉवर आवश्यकता",
    },
  },
};
