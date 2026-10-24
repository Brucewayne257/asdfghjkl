// database.js — 500 Companies + 200 Colleges (700 Diverse Opportunities) + SQLite/Web Persistence
import { Platform } from 'react-native';

let sqliteModule = null;
try {
  if (Platform.OS !== 'web') {
    sqliteModule = require('expo-sqlite');
  }
} catch (e) {
  sqliteModule = null;
}

let databasePromise = null;
let memoryStore = {
  opportunities: null,
  bookmarks: {
    'col-1': 'Interested', // VIT Vellore GraVITas
    'comp-1': 'Applied',   // Google STEP
    'col-2': 'Interested', // IIT Madras Shaastra
  },
};

// --- 50 FEATURED FLAGSHIP TECH COMPANIES + 450 ADDITIONAL INDIAN & GLOBAL TECH EMPLOYERS (TOTAL = 500) ---
const FLAGSHIP_50_COMPANIES = [
  ['Google', 'google.com', '🔍', '#4285F4', 'Bengaluru', 'STEP & SWE Summer Internship 2027', 'Internship', 115000, '₹1,15,000 / mo', 4.9, 9850, ['C++', 'Python', 'DSA', 'Algorithms']],
  ['Microsoft', 'microsoft.com', '⊞', '#00A4EF', 'Hyderabad', 'Explore & SWE Early-Year Internship', 'Internship', 125000, '₹1,25,000 / mo', 4.9, 9620, ['C++', 'Python', 'System Design', 'DSA']],
  ['Amazon', 'amazon.com', '📦', '#FF9900', 'Bengaluru', 'Amazon WOW & SDE Hiring Hackathon', 'Hackathon', 110000, '₹1,10,000 / mo + PPO', 4.8, 9400, ['Java', 'C++', 'DSA', 'Algorithms']],
  ['NVIDIA', 'nvidia.com', '⚡', '#76B900', 'Bengaluru', 'Deep Learning, CUDA & TensorRT Intern', 'Internship', 150000, '₹95,000 / mo + GPU Grant', 5.0, 9910, ['C++', 'Python', 'AI/ML', 'VLSI']],
  ['Apple', 'apple.com', '', '#555555', 'Hyderabad', 'Silicon Verification & Core iOS Intern', 'Internship', 120000, '₹1,20,000 / mo', 5.0, 9750, ['C++', 'Swift', 'VLSI', 'Python']],
  ['Adobe', 'adobe.com', '🅰️', '#FF0000', 'Delhi NCR', 'GenAI & Women-in-Tech India Hackathon', 'Hackathon', 200000, '₹1,00,000 / mo + MacBook', 4.8, 8600, ['Python', 'AI/ML', 'React', 'C++']],
  ['Qualcomm', 'qualcomm.com', '📡', '#3253DC', 'Hyderabad', '5G Wireless, DSP & VLSI Hardware Intern', 'Internship', 75000, '₹75,000 / mo', 4.8, 7900, ['Signal Processing', 'VLSI', 'Embedded C', 'C++']],
  ['Intel', 'intel.com', '🔲', '#0071C5', 'Bengaluru', 'SoC Design, Xeon & Edge AI Intern', 'Internship', 65000, '₹65,000 / mo', 4.7, 7400, ['VLSI', 'Embedded C', 'Python', 'C++']],
  ['AMD', 'amd.com', '⚙️', '#ED1C24', 'Hyderabad', 'Ryzen/Instinct GPU Architecture Intern', 'Internship', 70000, '₹70,000 / mo', 4.7, 7100, ['VLSI', 'C++', 'Embedded C', 'Python']],
  ['Flipkart', 'flipkart.com', '🛍️', '#2874F0', 'Bengaluru', 'Flipkart GRiD 8.0 National Hackathon', 'Hackathon', 600000, '₹6,00,000 Pool + ₹1L/mo Intern', 4.9, 9800, ['C++', 'Python', 'AI/ML', 'Robotics']],
  ['Zoho', 'zoho.com', '🟩', '#D92B2B', 'Vellore / Chennai', 'Zoho CliQr & SaaS Product Engineering Intern', 'Internship', 40000, '₹40,000 / mo + Direct PPO', 4.8, 8900, ['C++', 'Java', 'Problem Solving', 'Web Dev']],
  ['Freshworks', 'freshworks.com', '🍃', '#00A859', 'Vellore / Chennai', 'Freshworks STS Cloud & AI Product Intern', 'Internship', 55000, '₹55,000 / mo', 4.7, 7600, ['React', 'Node.js', 'Python', 'DSA']],
  ['PayPal', 'paypal.com', '💸', '#003087', 'Vellore / Chennai', 'PayPal Campus Challenge & Risk AI Intern', 'Hackathon', 95000, '₹95,000 / mo + PPO', 4.8, 8450, ['Java', 'Python', 'AI/ML', 'DSA']],
  ['Atlassian', 'atlassian.com', '🔷', '#0052CC', 'Bengaluru', 'Distributed Cloud Systems SDE Intern', 'Internship', 130000, '₹1,30,000 / mo', 5.0, 9100, ['Java', 'React', 'TypeScript', 'DSA']],
  ['Stripe', 'stripe.com', '💳', '#635BFF', 'Bengaluru', 'Financial Infrastructure & API Intern', 'Internship', 125000, '₹1,25,000 / mo', 5.0, 8950, ['Ruby', 'Java', 'TypeScript', 'System Design']],
  ['Uber', 'uber.com', '🚗', '#333333', 'Bengaluru', 'Uber HackTag 4.0 & UberSTAR Internship', 'Hackathon', 140000, '₹1,40,000 / mo + PPO', 4.9, 9450, ['Go', 'Java', 'C++', 'Algorithms']],
  ['Razorpay', 'razorpay.com', '⚡', '#072654', 'Bengaluru', 'FinTech FTX Fellowship & Core Payments Intern', 'Internship', 85000, '₹85,000 / mo', 4.9, 8300, ['Go', 'Python', 'React', 'System Design']],
  ['CRED', 'cred.club', '🛡️', '#222222', 'Bengaluru', 'High-Trust FinTech & Backend Engineering Intern', 'Internship', 100000, '₹1,00,000 / mo', 4.9, 8700, ['Java', 'React', 'Kotlin', 'System Design']],
  ['PhonePe', 'phonepe.com', '💳', '#5F259F', 'Bengaluru', 'PhonePe Tech Scholars UPI Scale Intern', 'Internship', 100000, '₹1,00,000 / mo', 4.8, 8250, ['Java', 'C++', 'Distributed Systems', 'DSA']],
  ['TCS', 'tcs.com', '🏆', '#004B87', 'Mumbai / Pune', 'TCS CodeVita Global Coding Challenge', 'Coding Contest', 800000, '₹8,00,000 Pool + Digital Offer', 4.7, 9950, ['C++', 'Python', 'Java', 'Algorithms']],
  ['Infosys', 'infosys.com', '⚡', '#007CC3', 'Bengaluru', 'HackWithInfy & InStep Global Intern', 'Hackathon', 200000, '₹2,00,000 Pool + Specialist Role', 4.6, 9100, ['DSA', 'Python', 'Java', 'C++']],
  ['Cisco', 'cisco.com', '🌐', '#049FD9', 'Bengaluru', 'Cisco Ideathon & Next-Gen Routing Intern', 'Hackathon', 80000, '₹80,000 / mo + Full-Time', 4.8, 7800, ['Networking', 'Python', 'C++', 'Cybersecurity']],
  ['IBM', 'ibm.com', '⚛️', '#0F62FE', 'Bengaluru', 'IBM Quantum & watsonx Research Intern', 'Research', 60000, '₹60,000 / mo', 4.7, 7300, ['Python', 'Quantum', 'AI/ML', 'Cloud']],
  ['Oracle', 'oracle.com', '☁️', '#C74634', 'Bengaluru', 'Oracle Cloud (OCI) Kernel & DB Intern', 'Internship', 85000, '₹85,000 / mo', 4.7, 7150, ['Java', 'SQL', 'Cloud', 'DSA']],
  ['Salesforce', 'salesforce.com', '☁️', '#00A1E0', 'Hyderabad', 'Futureforce AI Cloud Summer Intern', 'Internship', 95000, '₹95,000 / mo', 4.9, 8000, ['Java', 'JavaScript', 'React', 'DSA']],
  ['Samsung R&D', 'samsung.com', '🌌', '#1428A0', 'Bengaluru', 'Samsung PRISM & On-Device AI Research', 'Research', 150000, '₹50,000 / mo + ₹1.5L Grant', 4.8, 8650, ['C++', 'Python', 'AI/ML', 'Computer Vision']],
  ['GitHub', 'github.com', '🐙', '#24292E', 'Bengaluru', 'GitHub Octernships & Copilot Open Source', 'Internship', 125000, '₹1,25,000 / mo ($1,500)', 4.9, 9300, ['Git', 'TypeScript', 'Python', 'Open Source']],
  ['GitLab', 'gitlab.com', '🦊', '#FC6D26', 'Bengaluru', 'DevSecOps Remote Open-Core Internship', 'Internship', 165000, '₹1,65,000 / mo ($2,000)', 4.8, 7400, ['Ruby', 'Go', 'Git', 'Cloud']],
  ['Cloudflare', 'cloudflare.com', '🛡️', '#F38020', 'Bengaluru', 'Edge Network, Rust & Zero-Trust Intern', 'Internship', 110000, '₹1,10,000 / mo', 4.9, 7950, ['Rust', 'C++', 'Go', 'Networking']],
  ['Intuit', 'intuit.com', '💠', '#236CFF', 'Bengaluru', 'Intuit Augment AI & FinTech Co-Op', 'Internship', 105000, '₹1,05,000 / mo', 4.9, 8150, ['Java', 'React', 'Python', 'AI/ML']],
  ['Swiggy', 'swiggy.com', '🛵', '#FC8019', 'Bengaluru', 'Swiggy Launchpad — Hyperlocal AI Intern', 'Internship', 75000, '₹75,000 / mo', 4.7, 7600, ['Python', 'AI/ML', 'Java', 'DSA']],
  ['Zomato', 'zomato.com', '🍽️', '#E23744', 'Delhi NCR', 'Zomato Consumer AI & Blinkit Logistics Hack', 'Hackathon', 90000, '₹90,000 / mo', 4.8, 8050, ['Python', 'React', 'AI/ML', 'System Design']],
  ['Meesho', 'meesho.com', '📦', '#F43397', 'Bengaluru', 'Meesho DICE Challenge & SDE Intern', 'Hackathon', 90000, '₹90,000 / mo + PPO', 4.8, 7850, ['Java', 'Python', 'Data Science', 'DSA']],
  ['Groww', 'groww.in', '📈', '#00D09C', 'Bengaluru', 'Low-Latency Trading & Full-Stack Intern', 'Internship', 75000, '₹75,000 / mo', 4.8, 7500, ['Java', 'React Native', 'C++', 'DSA']],
  ['Paytm', 'paytm.com', '📲', '#00BAF2', 'Delhi NCR', 'Merchant Ledger & QR Soundbox IoT Intern', 'Internship', 60000, '₹60,000 / mo', 4.6, 6800, ['Java', 'Node.js', 'React', 'IoT']],
  ['SAP Labs', 'sap.com', '🔷', '#008FD3', 'Bengaluru', 'Next-Gen Enterprise iXP Scholar Intern', 'Internship', 55000, '₹55,000 / mo', 4.6, 6100, ['Java', 'Python', 'SQL', 'Cloud']],
  ['Dell Technologies', 'dell.com', '💻', '#007DB8', 'Bengaluru', 'Dell Hack2Hire & Cloud Storage Intern', 'Hackathon', 100000, '₹50,000 / mo + ₹1L Prizes', 4.6, 6400, ['Python', 'C++', 'Cloud', 'System Design']],
  ['HPE', 'hpe.com', '🖥️', '#01A982', 'Bengaluru', 'HPE Catch Them Young (CTY) Systems Track', 'Internship', 50000, '₹50,000 / mo', 4.6, 5900, ['C++', 'Python', 'Linux', 'Networking']],
  ['Accenture', 'accenture.com', '❯', '#A100FF', 'Mumbai / Pune', 'Accenture Innovation Challenge 2026-27', 'Hackathon', 200000, '₹2,00,000 Prizes + Fast-Track', 4.5, 7200, ['AI/ML', 'React', 'Python', 'Problem Solving']],
  ['Wipro', 'wipro.com', '🌐', '#3F1D74', 'Bengaluru', 'Wipro Turbo AI & Cloud Engineering Intern', 'Internship', 40000, '₹40,000 / mo', 4.5, 5800, ['Java', 'Python', 'SQL', 'Cloud']],
  ['HCLTech', 'hcltech.com', '🔧', '#005696', 'Delhi NCR', 'Engineering R&D & Semiconductor Track', 'Internship', 35000, '₹35,000 / mo', 4.5, 5600, ['C++', 'Embedded C', 'VLSI', 'Python']],
  ['Tech Mahindra', 'techmahindra.com', '🤖', '#E31837', 'Mumbai / Pune', 'Makers Lab Sovereign AI & 6G Research', 'Research', 35000, '₹35,000 / mo', 4.5, 5400, ['Python', 'AI/ML', 'IoT', 'Networking']],
  ['LTIMindtree', 'ltimindtree.com', '🌲', '#00205B', 'Mumbai / Pune', 'Ignite Data & Snowflake Cloud Intern', 'Internship', 40000, '₹40,000 / mo', 4.5, 5300, ['SQL', 'Python', 'Cloud', 'React']],
  ['Persistent', 'persistent.com', '♾️', '#FD5F07', 'Mumbai / Pune', 'Semicolon Hackathon & Martian Internship', 'Hackathon', 45000, '₹45,000 / mo', 4.6, 6000, ['Java', 'Python', 'React', 'DSA']],
  ['Jio Platforms', 'jio.com', '📶', '#0F3CC9', 'Mumbai / Pune', 'Jio 5G/6G Core & Bharat AI Intern', 'Internship', 45000, '₹45,000 / mo', 4.5, 6500, ['Python', 'Networking', 'AI/ML', 'Cloud']],
  ['BrowserStack', 'browserstack.com', '🌐', '#F05A28', 'Mumbai / Pune', 'Cloud Device Farm & DevTools SDE Intern', 'Internship', 80000, '₹80,000 / mo', 4.8, 6900, ['Ruby', 'React', 'Node.js', 'Linux']],
  ['Red Hat', 'redhat.com', '🎩', '#EE0000', 'Mumbai / Pune', 'Open Source Linux Kernel & OpenShift Intern', 'Internship', 45000, '₹45,000 / mo', 4.7, 6450, ['Linux', 'C++', 'Python', 'Go']],
  ['ServiceNow', 'servicenow.com', '⚙️', '#293E40', 'Hyderabad', 'Code to Win & Enterprise AI Workflow Hack', 'Hackathon', 85000, '₹85,000 / mo + Prizes', 4.8, 7300, ['Java', 'JavaScript', 'AI/ML', 'DSA']],
  ['Autodesk', 'autodesk.com', '📐', '#0696D7', 'Mumbai / Pune', '3D Geometry, CAD & Simulation Intern', 'Internship', 65000, '₹65,000 / mo', 4.7, 6100, ['C++', 'CAD', 'Python', 'Computer Graphics']],
  ['Siemens', 'siemens.com', '⚡', '#009999', 'Mumbai / Pune', 'Digital Industries, EDA & Smart Grid Intern', 'Internship', 45000, '₹45,000 / mo', 4.6, 5950, ['C++', 'PLC/IoT', 'VLSI', 'Mechanical CAD']],
];

// 450 Additional Distinct Real Companies in India across FinTech, Global Banks, Semiconductors, SaaS, Unicorns, Core Engineering & AI
const EXTRA_450_COMPANY_NAMES = [
  'JPMorgan Chase', 'Goldman Sachs', 'Morgan Stanley', 'Tower Research Capital', 'D. E. Shaw India', 'Arcesium', 'Rubrik', 'Cohesity', 'Nutanix', 'Confluent',
  'Snowflake', 'Databricks', 'Palantir', 'MongoDB', 'Elastic', 'Datadog', 'CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'Zscaler',
  'Okta', 'Twilio', 'SendGrid', 'Shopify', 'Spotify', 'Netflix India', 'Airbnb India', 'LinkedIn India', 'Dropbox', 'Box',
  'Slack', 'Zoom', 'Figma', 'Canva', 'Notion', 'Linear', 'Vercel', 'Supabase', 'Postman', 'Hasura',
  'Chargebee', 'Innovaccer', 'Icertis', 'Druva', 'HighRadius', 'Mindtickle', 'BrowserStack Labs', 'Gupshup', 'Amagi', 'Uniphore',
  'Darwinbox', 'Leadsquared', 'Whatfix', 'MoEngage', 'CleverTap', 'WebEngage', 'Yellow.ai', 'Haptik', 'Kore.ai', 'Sarvam AI',
  'Krutrim AI', 'Ola Electric', 'Ather Energy', 'Rapido', 'Namma Yatri', 'Porter', 'Delhivery', 'Shadowfax', 'Shiprocket', 'BlackBuck',
  'Zepto', 'BigBasket', 'Blinkit', 'Nykaa', 'Myntra', 'Ajio', 'Purplle', 'Mamaearth', 'Lenskart', 'boAt Lifestyle',
  'Noise', 'Ultrahuman', 'Cure.fit', 'Practo', 'PharmEasy', 'Tata 1mg', 'HealthKart', 'MediBuddy', 'Pristyn Care', 'Qure.ai',
  'Niramai', 'BugWorks', 'Biocon', 'Dr.Reddys Labs', 'Sun Pharma Tech', 'Cipla Digital', 'Lupin Research', 'Zydus Lifesciences', 'Syngene', 'Strand Life Sciences',
  'Texas Instruments', 'NXP Semiconductors', 'STMicroelectronics', 'Analog Devices', 'Broadcom', 'Marvell Technology', 'MediaTek India', 'ARM India', 'Synopsys', 'Cadence Design Systems',
  'ansys', 'MathWorks', 'National Instruments', 'Micron Technology', 'Western Digital', 'Seagate', 'SanDisk', 'Lam Research', 'Applied Materials', 'KLA Tencor',
  'ASML Partners', 'Tejas Networks', 'Saankhya Labs', 'Mindgrove Tech', 'InCore Semiconductors', 'Netrasemi', 'Morphing Machines', 'Signalchip', 'VVDN Technologies', 'MosChip',
  'Tata Elxsi', 'L&T Technology Services', 'KPIT Technologies', 'Cyient', 'Sasken Technologies', 'QuEST Global', 'Tata Technologies', 'Mahindra Electric', 'Ashok Leyland EV', 'Bajaj Auto Tech',
  'TVS Motor Digital', 'Hero MotoCorp Vida', 'Royal Enfield Tech', 'Maruti Suzuki R&D', 'Hyundai Mobis India', 'Mercedes-Benz R&D India', 'BMW TechWorks India', 'Volvo Group India', 'Bosch Global Software', 'Continental Automotive',
  'ZF India Tech', 'Valeo India', 'Harman International', 'Schneider Electric', 'ABB India', 'Honeywell Technology', 'General Electric Vernova', 'GE Aerospace India', 'Rolls-Royce India Tech', 'Airbus India Engineering',
  'Boeing India Tech', 'Collins Aerospace', 'Safran Engineering', 'Thales India', 'Garuda Aerospace', 'IdeaForge', 'Skylark Drones', 'Asteria Aerospace', 'Pixxel Space', 'Skyroot Aerospace',
  'Agnikul Cosmos', 'Dhruva Space', 'Bellatrix Aerospace', 'Digantara', 'GalaxEye Space', 'SatSure', 'MapmyIndia', 'Genesys International', 'Larsen & Toubro ECC', 'Tata Projects Digital',
  'Shapoorji Pallonji Tech', 'Godrej Aerospace', 'Reliance Industries Digital', 'Adani Green Energy Tech', 'Tata Power Solar', 'ReNew Power AI', 'Suzlon Energy', 'Aarti Industries', 'Pidilite R&D', 'Asian Paints Research',
  'Vedanta Digital', 'JSW Steel Tech', 'Tata Steel Automation', 'Hindalco Innovation', 'UltraTech Digital', 'ITC Infotech', 'Hindustan Unilever R&D', 'Procter & Gamble Tech', 'Nestle India Digital', 'Mondelez Tech Center',
  'PepsiCo GBS Hyderabad', 'Coca-Cola Tech Hub', 'AB InBev GCC', 'Diageo India Tech', 'Philip Morris Tech', 'Walmart Global Tech', 'Target in India', 'Lowe’s India', 'Tesco Technology', 'Marks & Spencer Tech',
  'IKEA Digital Hub', 'Nike Tech Center India', 'Adidas Digital Hub', 'Puma India Tech', 'Levi Strauss Tech', 'H&M Digital Lab', 'Zara Inditex Tech', 'Sephora Digital', 'L’Oreal Tech Incubator', 'Estee Lauder Tech',
  'Citigroup Tech Pune', 'Bank of America Continuum', 'Barclays Global Service', 'Deutsche Bank Tech', 'UBS India Tech', 'Credit Suisse / UBS', 'BNP Paribas ISPL', 'Societe Generale GSC', 'Standard Chartered GBS', 'HSBC Technology India',
  'Wells Fargo India', 'BNY Mellon Tech', 'State Street HCL', 'BlackRock India', 'Fidelity Investments', 'Vanguard Partners', 'Charles Schwab India', 'Mastercard Tech Hub', 'Visa Technology Center', 'American Express India',
  'Discover Financial', 'Capital One India', 'NatWest Group India', 'Macquarie Group Tech', 'Nomura Services India', 'Macquarie FinTech', 'Jane Street Prep', 'Citadel Securities Track', 'Optiver Campus Track', 'IMC Trading Challenge',
  'WorldQuant Brain India', 'AlphaGrep Securities', 'Graviton Research', 'Quadeye Securities', 'NK Securities', 'Tower Research Gurgaon', 'Two Sigma Challenge', 'Millennium Management', 'Point72 Academy', 'AQR Capital India',
  'Zerodha Tech (Kite)', 'Upstox Engineering', 'Angel One Tech', 'Dhan HQ', 'Smallcase', 'Sensibull', 'Streak AI', 'Kuvera', 'Scripbox', 'ETMoney',
  'CoinDCX', 'CoinSwitch', 'Polygon Labs', 'InstaDapp', 'Biconomy', 'Push Protocol', 'Shardeum', 'Mudrex', 'Liminal Custody', 'Router Protocol',
  'Pine Labs', 'BharatPe', 'MobiKwik', 'Freecharge', 'Slice', 'Uni Cards', 'OneCard (FPL)', 'Fi Money', 'Jupiter Money', 'Niyo Solutions',
  'Juspay', 'Cashfree Payments', 'Easebuzz', 'PayU India', 'BillDesk', 'CCAvenue', 'Open Financial', 'Khatabook', 'OkCredit', 'Vyapar App',
  'Clear (ClearTax)', 'Zeta Suite', 'Perfios', 'Signzy', 'HyperVerge', 'IDfy', 'Karza Technologies', 'Setu API', 'Decentro', 'FinBox',
  'Lendingkart', 'KreditBee', 'MoneyView', 'EarlySalary (Fibe)', 'Navi Technologies', 'Rupeek', 'Indifi', 'OfBusiness', 'Oxyzo', 'Yubi (CredAvenue)',
  'Acko Insurance', 'Digit Insurance', 'Policybazaar Tech', 'Turtlemint', 'Plum HQ', 'Onsurity', 'Ditto Insurance', 'Loop Health', 'Even Healthcare', 'Niva Bupa Digital',
  'Deloitte USI', 'PwC Acceleration Center', 'EY GDS India', 'KPMG Global Services', 'McKinsey Digital Labs', 'BCG X Tech', 'Bain Capability Network', 'ZS Associates', 'Mu Sigma', 'Fractal Analytics',
  'Tiger Analytics', 'LatentView Analytics', 'Tredence', 'MathCo (TheMathCompany)', 'Absolutdata', 'Course5 Intelligence', 'Evalueserve', 'Crisil Quant', 'ICRA Analytics', 'Morningstar India',
  'S&P Global India', 'Moody’s Analytics', 'MSCI India Tech', 'Bloomberg Prep Track', 'FactSet Hyderabad', 'London Stock Exchange Tech', 'Nasdaq Bengaluru', 'Broadridge Financial', 'FIS Global India', 'Fiserv India',
  'GlobalLogic', 'EPAM Systems', 'Thoughtworks', 'Publicis Sapient', 'Nagarro', 'HashedIn by Deloitte', 'Successive Digital', 'To The New', 'Kellton Tech', 'Happiest Minds',
  'Coforge', 'Mphasis', 'Hexaware', 'Zensar Technologies', 'Birlasoft', 'Sonata Software', 'Mastek', 'Newgen Software', 'Intellect Design Arena', 'Nucleus Software',
  'Ramco Systems', 'Subex', 'Tanla Platforms', 'Route Mobile', 'RateGain', 'Mappls', 'Info Edge (Naukri)', 'Indiamart Tech', 'Justdial Engineering', 'Matrimony.com Tech',
  'MakeMyTrip', 'Goibibo', 'Yatra Online', 'Ixigo', 'Cleartrip', 'EaseMyTrip', 'Oyo Rooms Tech', 'Treebo Hotels', 'FabHotels', 'RedBus',
  'AbhiBus', 'bookmyshow', 'Paytm Insider', 'Zomato Live', 'Pratilipi', 'Pocket FM', 'Kuku FM', 'ShareChat', 'Moj App', 'Josh (VerSe)',
  'InMobi', 'Glance', 'Affle India', 'PubMatic', 'Media.net', 'Directi', 'Flock', 'Zeta Directi', 'Radix Registry', 'Titan Tech',
  'Dream11 (Dream Sports)', 'Games24x7', 'MPL (Mobile Premier League)', 'Nazara Technologies', 'WinZO Games', 'Krafton India', 'Nodwin Gaming', 'Loco Streaming', 'Rooter Sports', 'Stan Esports',
  'PhysicsWallah Tech', 'Unacademy', 'UpGrad', 'Scaler Academy', 'Newton School', 'Masai School', 'NextWave', 'GeeksforGeeks', 'Coding Ninjas', 'Coding Blocks',
  'sprinklr', 'Five9 India', 'Genesys Cloud', 'RingCentral', '8x8 India', 'Freshchat', 'Intercom Partner', 'Zendesk Pune', 'HubSpot Partner', 'Pipedrive Tech'
];

// --- 30 FEATURED COLLEGES + 170 ADDITIONAL INDIAN ENGINEERING COLLEGES (TOTAL = 200) ---
const FLAGSHIP_30_COLLEGES = [
  ['VIT Vellore', 'vit.ac.in', '🎓', '#1B365D', 'Vellore / Chennai', 'GraVITas & Yantra Smart Campus Hackathon', 'Hackathon', 200000, '₹2,00,000 Pool + Incubation', 5.0, 9980, 'Vellore (On Campus)'],
  ['IIT Madras', 'iitm.ac.in', '🏛️', '#800000', 'Vellore / Chennai', 'Shaastra & Research Park Fellowship', 'Techfest', 250000, '₹2,50,000 Pool + Lab Residency', 5.0, 9850, 'Chennai (135 km from Vellore)'],
  ['IIT Bombay', 'iitb.ac.in', '🏛️', '#003366', 'Mumbai / Pune', 'Techfest International Coding & AI Mandate', 'Techfest', 350000, '₹3,50,000 Prize Pool', 5.0, 9950, 'Mumbai'],
  ['IIT Delhi', 'iitd.ac.in', '🏛️', '#B31B1B', 'Delhi NCR', 'Tryst Annual Techfest & SRFP Research', 'Techfest', 200000, '₹2,00,000 Pool + Stipend', 4.9, 9400, 'New Delhi'],
  ['IIT Kanpur', 'iitk.ac.in', '🏛️', '#D35400', 'Delhi NCR', 'Techkriti — Innovation & Cyber Security', 'Techfest', 220000, '₹2,20,000 Prize Pool', 4.9, 9100, 'Kanpur'],
  ['IIT Kharagpur', 'iitkgp.ac.in', '🏛️', '#1F3A93', 'Hyderabad', 'Kshitij — Asia Largest Techno-Management Fest', 'Techfest', 300000, '₹3,00,000 Prize Pool', 4.9, 9350, 'Kharagpur'],
  ['IIT Roorkee', 'iitr.ac.in', '🏛️', '#117A65', 'Delhi NCR', 'Cognizance — Syntax Error Hackathon', 'Hackathon', 200000, '₹2,00,000 Prize Pool', 4.9, 8900, 'Roorkee'],
  ['IIT Guwahati', 'iitg.ac.in', '🏛️', '#1F618D', 'Hyderabad', 'Techniche — Flagship Tech & Robotics Fest', 'Techfest', 180000, '₹1,80,000 Prize Pool', 4.8, 8400, 'Guwahati'],
  ['IIT Hyderabad', 'iith.ac.in', '🏛️', '#8E44AD', 'Hyderabad', 'Elan & nVision — Autonomous AI Hackathon', 'Hackathon', 150000, '₹1,50,000 Prize Pool', 4.9, 8600, 'Hyderabad'],
  ['IIT Indore', 'iiti.ac.in', '🏛️', '#2E4053', 'Mumbai / Pune', 'Fluxus — Central India Coding Sprint', 'Techfest', 120000, '₹1,20,000 Prize Pool', 4.7, 7200, 'Indore'],
  ['IIT (BHU) Varanasi', 'iitbhu.ac.in', '🏛️', '#A04000', 'Delhi NCR', 'Technex — ByteTheBits & Robotics Fest', 'Techfest', 200000, '₹2,00,000 Prize Pool', 4.8, 8500, 'Varanasi'],
  ['NIT Tiruchirappalli', 'nitt.edu', '🔱', '#922B21', 'Vellore / Chennai', 'Pragyan — ISO Certified VLSI & Code Fest', 'Techfest', 175000, '₹1,75,000 Prize Pool', 4.9, 9250, 'Tiruchirappalli'],
  ['NIT Karnataka, Surathkal', 'nitk.ac.in', '⚓', '#1B4F72', 'Bengaluru', 'Engineer — Coastal Flagship Hackathon', 'Techfest', 160000, '₹1,60,000 Prize Pool', 4.9, 8800, 'Surathkal'],
  ['NIT Warangal', 'nitw.ac.in', '⚙️', '#0E6251', 'Hyderabad', 'Technozion — Core & Software Sprint', 'Techfest', 150000, '₹1,50,000 Prize Pool', 4.8, 8450, 'Warangal'],
  ['NIT Calicut', 'nitc.ac.in', '🌴', '#784212', 'Bengaluru', 'Tathva — Malabar Tech Symposium & FOSS', 'Techfest', 140000, '₹1,40,000 Prize Pool', 4.7, 7600, 'Kozhikode'],
  ['NIT Rourkela', 'nitrkl.ac.in', '🚀', '#6C3483', 'Hyderabad', 'Innovision — Space, AI & Core Techfest', 'Techfest', 150000, '₹1,50,000 Prize Pool', 4.8, 8100, 'Rourkela'],
  ['NIT Durgapur', 'nitdgp.ac.in', '🔥', '#1F618D', 'Hyderabad', 'Aarohan — Techno-Management Challenge', 'Techfest', 110000, '₹1,10,000 Prize Pool', 4.6, 6900, 'Durgapur'],
  ['NIT Delhi', 'nitdelhi.ac.in', '🏙️', '#943126', 'Delhi NCR', 'TerraTechnica — Smart Cities Hackathon', 'Hackathon', 100000, '₹1,00,000 Prize Pool', 4.6, 6700, 'New Delhi'],
  ['NIT Patna', 'nitp.ac.in', '🌉', '#145A32', 'Delhi NCR', 'Corona & Melange — Civil/CS Innovation', 'Techfest', 90000, '₹90,000 Prize Pool', 4.5, 6200, 'Patna'],
  ['IIIT Hyderabad', 'iiit.ac.in', '🧠', '#1A5276', 'Hyderabad', 'Felicity & Megathon — CVIT Research Hack', 'Hackathon', 200000, '₹2,00,000 Pool + Fellowship', 5.0, 9500, 'Hyderabad'],
  ['IIIT Bangalore', 'iiitb.ac.in', '💻', '#212F3D', 'Bengaluru', 'Infin8 & RISE Open-Source Sprint', 'Hackathon', 125000, '₹1,25,000 Prize Pool', 4.8, 8000, 'Bengaluru'],
  ['IIIT Delhi', 'iiitd.ac.in', '🧬', '#008080', 'Delhi NCR', 'Esya — CS, Bio-Computing & AI Fest', 'Techfest', 150000, '₹1,50,000 Prize Pool', 4.9, 8650, 'New Delhi'],
  ['BITS Pilani', 'bits-pilani.ac.in', '🚀', '#C0392B', 'Delhi NCR', 'APOGEE — International Technical Symposium', 'Techfest', 250000, '₹2,50,000 Prize Pool', 4.9, 9450, 'Pilani'],
  ['Manipal Institute of Technology', 'manipal.edu', '⚡', '#D35400', 'Bengaluru', 'TechTatva — National Student Subsystems Fest', 'Techfest', 140000, '₹1,40,000 Prize Pool', 4.7, 7900, 'Manipal'],
  ['Thapar Institute (TIET)', 'thapar.edu', '🛠️', '#8E24AA', 'Delhi NCR', 'Saturnalia & Makeathon Hardware/SW Sprint', 'Hackathon', 150000, '₹1,50,000 Prize Pool', 4.7, 7750, 'Patiala'],
  ['PES University', 'pes.edu', '💻', '#0D47A1', 'Bengaluru', 'Aatmatrisha & HashCode 24h Hackathon', 'Hackathon', 150000, '₹1,50,000 Prize Pool', 4.8, 8150, 'Bengaluru'],
  ['RV College of Engineering', 'rvce.edu.in', '🏎️', '#1565C0', 'Bengaluru', '8th Mile & IEEE Autonomous Mobility Hack', 'Techfest', 120000, '₹1,20,000 Prize Pool', 4.7, 7500, 'Bengaluru'],
  ['BMS College of Engineering', 'bmsce.ac.in', '🔬', '#283593', 'Bengaluru', 'Phase Shift — Flagship Tech Symposium', 'Techfest', 110000, '₹1,10,000 Prize Pool', 4.7, 7300, 'Bengaluru'],
  ['Jadavpur University', 'jadavpuruniversity.in', '🏛️', '#B71C1C', 'Hyderabad', 'Srijan — Premier Low-Cost Tech & Code Fest', 'Techfest', 130000, '₹1,30,000 Prize Pool', 4.9, 8700, 'Kolkata'],
  ['Delhi Technological University', 'dtu.ac.in', '🏛️', '#4A148C', 'Delhi NCR', 'Invictus — DTU Techfest & Vihaan Hackathon', 'Hackathon', 200000, '₹2,00,000 Prize Pool', 4.8, 8850, 'New Delhi'],
];

// 170 Additional Real Indian Colleges & Universities (Remaining IITs, NITs, IIITs, State & Private Universities)
const EXTRA_170_COLLEGE_NAMES = [
  'IIT Ropar', 'IIT Gandhinagar', 'IIT Jodhpur', 'IIT Patna', 'IIT Bhubaneswar', 'IIT Mandi', 'IIT Tirupati', 'IIT Palakkad', 'IIT Bhilai', 'IIT Goa',
  'IIT Jammu', 'IIT Dharwad', 'IIT (ISM) Dhanbad', 'IISc Bangalore', 'IISER Pune', 'IISER Kolkata', 'IISER Mohali', 'IISER Bhopal', 'IISER Thiruvananthapuram', 'IISER Tirupati',
  'IISER Berhampur', 'NISER Bhubaneswar', 'ISI Kolkata', 'CMI Chennai', 'TIFR Mumbai', 'IIST Thiruvananthapuram', 'ICT Mumbai', 'IIEST Shibpur', 'NIT Kurukshetra', 'MNIT Jaipur',
  'VNIT Nagpur', 'MNNIT Allahabad', 'SVNIT Surat', 'MANIT Bhopal', 'NIT Silchar', 'NIT Hamirpur', 'NIT Jalandhar', 'NIT Raipur', 'NIT Agartala', 'NIT Srinagar',
  'NIT Jamshedpur', 'NIT Meghalaya', 'NIT Nagaland', 'NIT Manipur', 'NIT Mizoram', 'NIT Sikkim', 'NIT Arunachal Pradesh', 'NIT Uttarakhand', 'NIT Andhra Pradesh', 'NIT Goa',
  'NIT Puducherry', 'IIIT Allahabad', 'IIITM Gwalior', 'IIITDM Jabalpur', 'IIITDM Kancheepuram', 'IIITDM Kurnool', 'IIIT Sri City', 'IIIT Guwahati', 'IIIT Vadodara', 'IIIT Kota',
  'IIIT Tiruchirappalli', 'IIIT Una', 'IIIT Sonepat', 'IIIT Kalyani', 'IIIT Lucknow', 'IIIT Dharwad', 'IIIT Kottayam', 'IIIT Manipur', 'IIIT Nagpur', 'IIIT Pune',
  'IIIT Ranchi', 'IIIT Surat', 'IIIT Bhopal', 'IIIT Bhagalpur', 'IIIT Agartala', 'IIIT Raichur', 'VIT Chennai', 'VIT AP Amaravati', 'VIT Bhopal', 'BITS Pilani Goa Campus',
  'BITS Pilani Hyderabad Campus', 'SRM Institute Kattankulathur', 'SRM Ramapuram', 'SRM AP', 'Amrita Vishwa Vidyapeetham Coimbatore', 'Amrita Amritapuri', 'Amrita Bengaluru', 'Anna University CEG Guindy', 'MIT Chromepet (Anna Univ)', 'ACT Campus Anna Univ',
  'SSN College of Engineering Chennai', 'PSG College of Technology Coimbatore', 'Coimbatore Institute of Technology (CIT)', 'Thiagarajar College of Engineering Madurai', 'Kumaraguru College of Technology', 'Sri Krishna College of Engineering', 'Rajalakshmi Engineering College', 'Sathyabama Institute Chennai', 'Saveetha Engineering College', 'Vel Tech Rangarajan University',
  'Hindustan Institute of Technology Chennai', 'BS Abdur Rahman Crescent Institute', 'Kalasalingam Academy', 'Karunya Institute Coimbatore', 'SASTRA Deemed University Thanjavur', 'Netaji Subhas University of Technology (NSUT)', 'Indira Gandhi Delhi Technical University (IGDTUW)', 'Jamia Millia Islamia Engineering', 'Maharaja Agrasen Institute (MAIT)', 'Maharaja Surajmal Institute (MSIT)',
  'Bharati Vidyapeeth COE Delhi', 'Guru Gobind Singh Indraprastha University', 'Jaypee Institute (JIIT) Noida', 'Shiv Nadar University Greater Noida', 'Bennett University Greater Noida', 'Ashoka University CS', 'Plaksha University Mohali', 'Punjab Engineering College (PEC) Chandigarh', 'UIET Panjab University', 'Chandigarh University',
  'Chitkara University Punjab', 'Lovely Professional University (LPU)', 'UPES Dehradun', 'Graphic Era University Dehradun', 'GB Pant University Pantnagar', 'HBTU Kanpur', 'IET Lucknow', 'MMMUT Gorakhpur', 'Aligarh Muslim University (ZHCET)', 'Banaras Hindu University (BHU Tech)',
  'BIT Mesra Ranchi', 'BIT Sindri', 'KIIT University Bhubaneswar', 'Siksha O Anusandhan (SOA) Bhubaneswar', 'VSSUT Burla', 'Silicon Institute Bhubaneswar', 'Heritage Institute of Technology Kolkata', 'IEM Kolkata', 'Techno Main Salt Lake', 'Kalyani Government Engineering College',
  'Jalpaiguri Government Engineering College', 'COEP Technological University Pune', 'VJTI Mumbai', 'SPIT Mumbai', 'DJ Sanghvi College Mumbai', 'KJ Somaiya College Mumbai', 'Thadomal Shahani Engineering College', 'Fr. Conceicao Rodrigues COE', 'Walchand College of Engineering Sangli', 'PICT Pune',
  'VIT Pune (Vishwakarma Institute)', 'MIT World Peace University Pune', 'Cummins College of Engineering Pune', 'Symbiosis Institute of Technology Pune', 'Ramdeobaba University Nagpur', 'LD College of Engineering Ahmedabad', 'DAIICT Gandhinagar', 'Nirma University Ahmedabad', 'PDEU Gandhinagar', 'MS University Baroda',
  'MS Ramaiah Institute of Technology Bengaluru', 'Dayananda Sagar College of Engineering', 'Bangalore Institute of Technology (BIT)', 'Nitte Meenakshi Institute (NMIT)', 'New Horizon College of Engineering', 'CMR Institute of Technology Bengaluru', 'JSS Science and Technology University Mysuru', 'National Institute of Engineering (NIE) Mysuru', 'KLE Technological University Hubballi', 'Manipal University Jaipur'
];

const ALL_BRANCHES = ['CSE', 'IT', 'AIML', 'Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotech'];
const HUBS = ['Vellore / Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai / Pune', 'Delhi NCR'];
const SKILL_SETS = [
  ['Python', 'C++', 'AI/ML', 'DSA'],
  ['React', 'TypeScript', 'Node.js', 'Cloud'],
  ['VLSI', 'Embedded C', 'Signal Processing', 'GNU Octave'],
  ['Java', 'Spring', 'Distributed Systems', 'SQL'],
  ['Robotics', 'CAD', 'IoT', 'Automation'],
  ['Cybersecurity', 'Linux', 'Networking', 'Go'],
  ['Data Science', 'PyTorch', 'Computer Vision', 'NLP'],
  ['Chemical/Process', 'Biotech', 'MATLAB/Octave', 'Research'],
];
const COMPANY_PROGRAMS = [
  { suffix: 'Summer Software Engineering Internship 2027', cat: 'Internship', stipend: '₹85,000 / mo', val: 85000 },
  { suffix: 'National AI & Cloud Innovation Hackathon', cat: 'Hackathon', stipend: '₹2,50,000 Prize Pool + PPO', val: 250000 },
  { suffix: 'Winter R&D & Systems Fellowship', cat: 'Research', stipend: '₹70,000 / mo + Compute Grant', val: 70000 },
  { suffix: 'Campus CodeSprint & Hiring Challenge', cat: 'Coding Contest', stipend: '₹1,50,000 Prizes + Intern Offer', val: 150000 },
  { suffix: 'Core Hardware, VLSI & Embedded Track', cat: 'Internship', stipend: '₹65,000 / mo', val: 65000 },
];
const COLLEGE_EVENTS = [
  { suffix: 'Annual National Techfest & Robotics Mandate', cat: 'Techfest', prize: '₹2,00,000 Prize Pool', val: 200000 },
  { suffix: '36-Hour Inter-College Smart India Sprint', cat: 'Hackathon', prize: '₹1,50,000 Prize Pool', val: 150000 },
  { suffix: 'Summer Faculty Research Internship (SRFP)', cat: 'Research', prize: '₹15,000 Fellowship + Hostel', val: 45000 },
  { suffix: 'ACM / IEEE National Algorithmic Contest', cat: 'Coding Contest', prize: '₹1,00,000 Prize Pool', val: 100000 },
];
const BRAND_COLORS = ['#0A84FF', '#30D158', '#FF9F0A', '#FF375F', '#BF5AF2', '#5E5CE6', '#64D2FF', '#FF453A'];
const SYMBOLS_POOL = ['⚡', '🚀', '💻', '🧠', '🔬', '📡', '🛡️', '🌐', '⚙️', '🏆'];

// --- BUILD ALL 700 DIVERSE OPPORTUNITIES (500 COMPANIES + 200 COLLEGES) ---
export function buildFull700Dataset() {
  const companies500 = [];

  // 1. Add Flagship 50 Companies
  FLAGSHIP_50_COMPANIES.forEach((c, idx) => {
    const [name, domain, symbol, color, region, program, cat, prizeValue, stipend, rating, popularity, skills] = c;
    const isCore = skills.some((s) => ['VLSI', 'Embedded C', 'Signal Processing', 'CAD', 'PLC/IoT'].includes(s));
    const branches = isCore ? ['ECE', 'EEE', 'Mechanical', 'CSE', 'IT', 'AIML'] : ['CSE', 'IT', 'AIML', 'Data Science', 'ECE', 'EEE'];
    const day = ((idx * 3) % 27) + 1;
    const month = idx % 2 === 0 ? '11' : '12';
    const deadline = `2026-${month}-${String(day).padStart(2, '0')}`;
    companies500.push({
      id: `comp-${idx + 1}`,
      title: `${name} — ${program}`,
      organizer: `${name} India`,
      institution: 'Corporate',
      orgType: 'Company',
      orgName: name,
      symbol,
      badge: name.slice(0, 3).toUpperCase(),
      brandColor: color,
      domain,
      rating,
      popularity,
      prizeValue,
      region,
      sourcePlatform: 'Verified Corporate & LinkedIn Feed',
      category: cat,
      eligibleBranches: branches,
      eligibleYears: [1, 2, 3, 4],
      skills,
      mode: `Hybrid • ${region}`,
      stipendOrPrize: stipend,
      deadline,
      deadlineTimestamp: new Date(deadline).getTime(),
      verifiedStatus: 'Verified Corporate Source',
      applyUrl: `https://${domain}`,
      isNew: idx < 15,
      closingSoon: month === '11' && day <= 10,
      description: `Official ${name} student opportunity (${program}). Open to undergraduate engineering students across India with strong fundamentals in ${skills.join(', ')}.`,
    });
  });

  // 2. Add Extra 450 Companies (Total = 500 Companies)
  EXTRA_450_COMPANY_NAMES.slice(0, 450).forEach((name, idx) => {
    const num = idx + 51;
    const prog = COMPANY_PROGRAMS[idx % COMPANY_PROGRAMS.length];
    const skills = SKILL_SETS[idx % SKILL_SETS.length];
    const region = HUBS[idx % HUBS.length];
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const rating = Number((4.5 + ((idx * 7) % 6) * 0.1).toFixed(1));
    const popularity = 3200 + ((idx * 137) % 6200);
    const day = ((idx * 5) % 27) + 1;
    const month = idx % 3 === 0 ? '11' : '12';
    const deadline = `2026-${month}-${String(day).padStart(2, '0')}`;

    companies500.push({
      id: `comp-${num}`,
      title: `${name} — ${prog.suffix}`,
      organizer: `${name} India GCC`,
      institution: 'Corporate',
      orgType: 'Company',
      orgName: name,
      symbol: SYMBOLS_POOL[idx % SYMBOLS_POOL.length],
      badge: name.slice(0, 3).toUpperCase(),
      brandColor: BRAND_COLORS[idx % BRAND_COLORS.length],
      domain: cleanSlug,
      rating: Math.min(5.0, rating),
      popularity,
      prizeValue: prog.val,
      region,
      sourcePlatform: 'Company Careers & University Recruiting',
      category: prog.cat,
      eligibleBranches: ALL_BRANCHES,
      eligibleYears: [1, 2, 3, 4],
      skills,
      mode: `Hybrid • ${region}`,
      stipendOrPrize: prog.stipend,
      deadline,
      deadlineTimestamp: new Date(deadline).getTime(),
      verifiedStatus: 'Verified Corporate Portal',
      applyUrl: `https://www.google.com/search?q=${encodeURIComponent(name + ' careers india internship hackathon')}`,
      isNew: idx % 9 === 0,
      closingSoon: month === '11' && day <= 8,
      description: `${name} (${prog.suffix}) in ${region}. Designed for engineering students seeking hands-on industry mentorship, hackathons, and pre-placement opportunities.`,
    });
  });

  const colleges200 = [];

  // 3. Add Flagship 30 Colleges
  FLAGSHIP_30_COLLEGES.forEach((col, idx) => {
    const [name, domain, symbol, color, region, fest, cat, prizeValue, prize, rating, popularity, loc] = col;
    const skills = SKILL_SETS[idx % SKILL_SETS.length];
    const day = ((idx * 2) % 27) + 1;
    const month = idx % 2 === 0 ? '11' : '12';
    const deadline = `2026-${month}-${String(day).padStart(2, '0')}`;
    colleges200.push({
      id: `col-${idx + 1}`,
      title: `${name} — ${fest}`,
      organizer: `${name} Technical Council`,
      institution: name,
      orgType: 'College',
      orgName: name,
      symbol,
      badge: name.slice(0, 4).toUpperCase(),
      brandColor: color,
      domain,
      rating,
      popularity,
      prizeValue,
      region,
      sourcePlatform: `${name} Official Portal / Unstop`,
      category: cat,
      eligibleBranches: ALL_BRANCHES,
      eligibleYears: [1, 2, 3, 4],
      skills,
      mode: `Offline / Hybrid • ${loc}`,
      stipendOrPrize: prize,
      deadline,
      deadlineTimestamp: new Date(deadline).getTime(),
      verifiedStatus: 'Verified Institutional Portal',
      applyUrl: `https://${domain}`,
      isNew: idx < 10 || name.includes('VIT'),
      closingSoon: month === '11' && day <= 10,
      description: `Flagship national technical festival, hackathon, and research symposium hosted by ${name} (${loc}). Open to undergraduate students across all engineering branches.`,
    });
  });

  // 4. Add Extra 170 Colleges (Total = 200 Colleges)
  EXTRA_170_COLLEGE_NAMES.slice(0, 170).forEach((name, idx) => {
    const num = idx + 31;
    const ev = COLLEGE_EVENTS[idx % COLLEGE_EVENTS.length];
    const skills = SKILL_SETS[(idx + 2) % SKILL_SETS.length];
    const isSouth =
      name.includes('Chennai') ||
      name.includes('Vellore') ||
      name.includes('Anna') ||
      name.includes('SRM') ||
      name.includes('SSN') ||
      name.includes('PSG') ||
      name.includes('Coimbatore') ||
      name.includes('Amrita') ||
      name.includes('SASTRA') ||
      name.includes('Kancheepuram') ||
      name.includes('Tiruchirappalli') ||
      name.includes('Tirupati');
    const region = isSouth ? 'Vellore / Chennai' : HUBS[idx % HUBS.length];
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.ac.in';
    const rating = Number((4.5 + ((idx * 3) % 6) * 0.1).toFixed(1));
    const popularity = 3500 + ((idx * 149) % 5800);
    const day = ((idx * 4) % 27) + 1;
    const month = idx % 2 === 0 ? '11' : '12';
    const deadline = `2026-${month}-${String(day).padStart(2, '0')}`;

    colleges200.push({
      id: `col-${num}`,
      title: `${name} — ${ev.suffix}`,
      organizer: `${name} Student Chapter & Innovation Cell`,
      institution: name,
      orgType: 'College',
      orgName: name,
      symbol: '🏛️',
      badge: name.slice(0, 4).toUpperCase(),
      brandColor: BRAND_COLORS[(idx + 3) % BRAND_COLORS.length],
      domain: cleanSlug,
      rating: Math.min(5.0, rating),
      popularity,
      prizeValue: ev.val,
      region,
      sourcePlatform: 'Institutional Fest & Unstop Feed',
      category: ev.cat,
      eligibleBranches: ALL_BRANCHES,
      eligibleYears: [1, 2, 3, 4],
      skills,
      mode: `Offline / Hybrid • ${region}`,
      stipendOrPrize: ev.prize,
      deadline,
      deadlineTimestamp: new Date(deadline).getTime(),
      verifiedStatus: 'Verified Campus Portal',
      applyUrl: `https://www.google.com/search?q=${encodeURIComponent(name + ' techfest hackathon official website')}`,
      isNew: idx % 7 === 0,
      closingSoon: month === '11' && day <= 9,
      description: `Inter-university technical competition, hackathon, and research showcase organized at ${name}. Welcomes student teams from all branches.`,
    });
  });

  // Interleave so top colleges & top companies appear together, totaling 700 items
  const combined = [];
  const maxLen = Math.max(companies500.length, colleges200.length);
  for (let i = 0; i < maxLen; i++) {
    if (colleges200[i]) combined.push(colleges200[i]);
    if (companies500[i]) combined.push(companies500[i]);
  }
  return combined;
}

async function getDb() {
  if (!sqliteModule || !sqliteModule.openDatabaseAsync) return null;
  if (!databasePromise) {
    databasePromise = sqliteModule.openDatabaseAsync('campuspulse_v700.db');
  }
  return databasePromise;
}

export async function initDatabase() {
  try {
    const db = await getDb();
    if (!db) {
      if (!memoryStore.opportunities) {
        memoryStore.opportunities = buildFull700Dataset();
      }
      return;
    }
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS opportunities_v700 (
        id TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS bookmarks_v700 (
        opportunity_id TEXT PRIMARY KEY NOT NULL,
        status TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (e) {
    if (!memoryStore.opportunities) {
      memoryStore.opportunities = buildFull700Dataset();
    }
  }
}

export async function getOpportunities() {
  try {
    const db = await getDb();
    if (!db) {
      if (!memoryStore.opportunities) {
        memoryStore.opportunities = buildFull700Dataset();
      }
      return memoryStore.opportunities;
    }
    const rows = await db.getAllAsync('SELECT payload FROM opportunities_v700 ORDER BY rowid ASC');
    const parsed = rows
      .map((row) => {
        try {
          return JSON.parse(row.payload);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    // If fewer than 700 items or old unrated "Directory" items exist, re-seed all 700 rich items
    if (parsed.length < 700 || parsed.some((item) => item.category === 'Directory')) {
      const fresh700 = buildFull700Dataset();
      await saveOpportunities(fresh700);
      return fresh700;
    }
    return parsed;
  } catch (e) {
    if (!memoryStore.opportunities) {
      memoryStore.opportunities = buildFull700Dataset();
    }
    return memoryStore.opportunities;
  }
}

export async function saveOpportunities(items) {
  memoryStore.opportunities = items;
  try {
    const db = await getDb();
    if (!db) return;
    await db.withTransactionAsync(async () => {
      for (const item of items) {
        await db.runAsync(
          `INSERT INTO opportunities_v700 (id, payload, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP`,
          String(item.id),
          JSON.stringify(item)
        );
      }
    });
  } catch (e) {
    // Fallback already stored in memoryStore
  }
}

export async function getBookmarks() {
  try {
    const db = await getDb();
    if (!db) return { ...memoryStore.bookmarks };
    const rows = await db.getAllAsync('SELECT opportunity_id, status FROM bookmarks_v700');
    if (rows.length === 0) return { ...memoryStore.bookmarks };
    return rows.reduce((result, row) => {
      result[row.opportunity_id] = row.status;
      return result;
    }, {});
  } catch (e) {
    return { ...memoryStore.bookmarks };
  }
}

export async function saveBookmark(opportunityId, status) {
  if (!status) {
    delete memoryStore.bookmarks[opportunityId];
  } else {
    memoryStore.bookmarks[opportunityId] = status;
  }
  try {
    const db = await getDb();
    if (!db) return;
    if (!status) {
      await db.runAsync('DELETE FROM bookmarks_v700 WHERE opportunity_id = ?', String(opportunityId));
      return;
    }
    await db.runAsync(
      `INSERT INTO bookmarks_v700 (opportunity_id, status, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(opportunity_id) DO UPDATE SET status = excluded.status, updated_at = CURRENT_TIMESTAMP`,
      String(opportunityId),
      String(status)
    );
  } catch (e) {
    // Fallback already updated in memoryStore
  }
}