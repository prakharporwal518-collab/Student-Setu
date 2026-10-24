// Vocational training tracks (Hindi + English). NSQF levels are indicative —
// learners should confirm the exact qualification on Skill India / DGT portals.
const ytHi = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`

export const vocationalTracks = [
  {
    id: 'electrician', name: 'Electrician (Domestic Wiring)', hi: 'इलेक्ट्रीशियन (घरेलू वायरिंग)', icon: 'Zap', color: 'from-amber-400 to-orange-500',
    duration: '3–6 months', nsqf: 'NSQF Level 3–4 (indicative)', badge: 'electrician', video: ytHi('electrician course in hindi'),
    modules: [
      ['Safety & tools', 'सुरक्षा और औज़ार'], ['Basics of electricity (V, I, R)', 'बिजली की मूल बातें'], ['House wiring & earthing', 'घरेलू वायरिंग और अर्थिंग'],
      ['MCB, RCCB & distribution boards', 'एमसीबी, आरसीसीबी और डीबी'], ['Fault finding with a multimeter', 'मल्टीमीटर से खराबी ढूँढना'], ['Estimates & customer handling', 'अनुमान और ग्राहक से बात'],
    ],
    roles: ['House-wiring technician', 'Maintenance electrician', 'Self-employed electrician'], tools: ['Multimeter', 'Line tester', 'Insulated pliers', 'Wire stripper'],
  },
  {
    id: 'mobile_repair', name: 'Mobile Phone Repair Technician', hi: 'मोबाइल फ़ोन रिपेयरिंग', icon: 'Smartphone', color: 'from-sky-400 to-indigo-500',
    duration: '2–4 months', nsqf: 'NSQF Level 3–4 (indicative)', badge: 'mobile_repair', video: ytHi('mobile repairing course in hindi'),
    modules: [
      ['ESD safety & repair tools', 'ईएसडी सुरक्षा और औज़ार'], ['Parts of a smartphone', 'स्मार्टफ़ोन के पुर्ज़े'], ['Charging & battery faults', 'चार्जिंग और बैटरी की खराबी'],
      ['Display & touch replacement', 'डिस्प्ले और टच बदलना'], ['Software flashing basics', 'सॉफ़्टवेयर फ़्लैशिंग की मूल बातें'], ['Running a repair counter', 'रिपेयर दुकान चलाना'],
    ],
    roles: ['Service-centre technician', 'Repair-shop owner', 'Field technician'], tools: ['Multimeter', 'Hot-air station', 'ESD wrist strap', 'Precision screwdrivers'],
  },
  {
    id: 'solar', name: 'Solar PV Installer', hi: 'सोलर पीवी इंस्टॉलर', icon: 'Sun', color: 'from-yellow-400 to-amber-500',
    duration: '1–3 months', nsqf: 'NSQF Level 4 (indicative)', badge: 'solar', video: ytHi('solar panel installation training hindi'),
    modules: [
      ['How solar panels work', 'सोलर पैनल कैसे काम करते हैं'], ['Site survey & shading', 'साइट सर्वे और छाया'], ['Mounting & DC wiring', 'माउंटिंग और डीसी वायरिंग'],
      ['Inverters & batteries', 'इन्वर्टर और बैटरी'], ['Safety while working at height', 'ऊँचाई पर काम की सुरक्षा'], ['Rooftop solar schemes for homes', 'घरों के लिए रूफ़टॉप सोलर योजनाएँ'],
    ],
    roles: ['Rooftop solar installer', 'O&M technician', 'Solar sales & survey associate'], tools: ['Clamp meter', 'Safety harness', 'Crimping tool', 'Solar irradiance app'],
  },
  {
    id: 'tally_gst', name: 'Tally & GST Accounting Assistant', hi: 'टैली और जीएसटी अकाउंटिंग', icon: 'Calculator', color: 'from-emerald-400 to-teal-600',
    duration: '2–3 months', nsqf: 'NSQF Level 4 (indicative)', badge: 'gst', video: ytHi('tally prime gst full course hindi'),
    modules: [
      ['Bookkeeping basics', 'बहीखाते की मूल बातें'], ['TallyPrime company setup', 'टैलीप्राइम में कंपनी बनाना'], ['Vouchers & ledgers', 'वाउचर और लेजर'],
      ['GST invoices & returns', 'जीएसटी बिल और रिटर्न'], ['Payroll basics', 'वेतन (पेरोल) की मूल बातें'], ['Reports for the owner', 'मालिक के लिए रिपोर्ट'],
    ],
    roles: ['Accounts assistant', 'GST filing assistant', 'Freelance bookkeeper'], tools: ['TallyPrime', 'GST portal', 'Excel'],
  },
  {
    id: 'digital_marketing', name: 'Digital Marketing Assistant', hi: 'डिजिटल मार्केटिंग', icon: 'Megaphone', color: 'from-pink-400 to-rose-500',
    duration: '2–3 months', nsqf: 'NSQF Level 4 (indicative)', badge: 'seo_social', video: ytHi('digital marketing course in hindi'),
    modules: [
      ['Social media basics', 'सोशल मीडिया की मूल बातें'], ['Design posts with Canva', 'कैनवा से पोस्ट बनाना'], ['SEO basics', 'एसईओ की मूल बातें'],
      ['Google Business Profile for local shops', 'स्थानीय दुकानों के लिए गूगल बिज़नेस प्रोफ़ाइल'], ['Running small ad campaigns', 'छोटे विज्ञापन अभियान'], ['Measuring results', 'नतीजे मापना'],
    ],
    roles: ['Social media executive', 'Freelancer for local businesses', 'Content assistant'], tools: ['Canva', 'Instagram / WhatsApp Business', 'Google Business Profile'],
  },
  {
    id: 'office', name: 'Data Entry & Office Assistant', hi: 'डेटा एंट्री और ऑफ़िस असिस्टेंट', icon: 'Keyboard', color: 'from-violet-400 to-purple-600',
    duration: '1–2 months', nsqf: 'NSQF Level 3 (indicative)', badge: 'excel', video: ytHi('computer course for office work hindi'),
    modules: [
      ['Typing speed & accuracy', 'टाइपिंग स्पीड और सटीकता'], ['MS Word & Google Docs', 'एमएस वर्ड और गूगल डॉक्स'], ['Excel / Sheets for office work', 'ऑफ़िस के लिए एक्सेल'],
      ['Professional email', 'प्रोफ़ेशनल ईमेल'], ['Digital payments & UPI safety', 'डिजिटल पेमेंट और यूपीआई सुरक्षा'], ['Using government service portals', 'सरकारी पोर्टल का उपयोग'],
    ],
    roles: ['Data entry operator', 'Office assistant', 'Common Service Centre operator'], tools: ['Computer', 'Excel / Sheets', 'Email'],
  },
  {
    id: 'tailoring', name: 'Tailoring & Fashion Design', hi: 'सिलाई और फ़ैशन डिज़ाइन', icon: 'Scissors', color: 'from-fuchsia-400 to-pink-600',
    duration: '3–6 months', nsqf: 'NSQF Level 3–4 (indicative)', badge: null, video: ytHi('silai sikhna basic to advance'),
    modules: [
      ['Sewing machine handling', 'सिलाई मशीन चलाना'], ['Taking measurements', 'नाप लेना'], ['Cutting & stitching a kurta', 'कुर्ता काटना और सिलना'],
      ['Blouse & finishing work', 'ब्लाउज़ और फ़िनिशिंग'], ['Pricing your work', 'अपने काम की कीमत तय करना'], ['Selling on WhatsApp & online', 'व्हाट्सऐप और ऑनलाइन बेचना'],
    ],
    roles: ['Tailor', 'Boutique assistant', 'Home-based entrepreneur'], tools: ['Sewing machine', 'Measuring tape', 'Fabric scissors'],
  },
]

// Official portals for certification and paid apprenticeships.
export const skillPortals = [
  { name: 'Skill India Digital Hub', url: 'https://www.skillindiadigital.gov.in', text: 'Government skilling courses, certificates and job links.' },
  { name: 'Apprenticeship India', url: 'https://www.apprenticeshipindia.gov.in', text: 'Find paid apprenticeships with industry under the national scheme.' },
  { name: 'Directorate General of Training (ITI)', url: 'https://dgt.gov.in', text: 'ITI trades, admissions and craftsman training information.' },
]
