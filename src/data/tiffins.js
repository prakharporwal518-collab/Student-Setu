import { unsplash } from './common.js'

const F = {
  thali: 'photo-1585937421612-70a008356fbe',
  curry: 'photo-1565557623262-b51c2513a641',
  biryani: 'photo-1589302168068-964664d93dc0',
  bowl: 'photo-1546069901-ba9599a7e63c',
  dal: 'photo-1567188040759-fb8a883dc6d8',
  paneer: 'photo-1631452180519-c014fe946bc7',
}

const weekMenu = (veg = true) => ({
  Mon: veg ? 'Dal tadka, aloo gobi, 4 roti, rice, salad' : 'Egg curry, dal, 4 roti, rice',
  Tue: veg ? 'Rajma, jeera rice, 4 roti, raita' : 'Chicken curry, rice, 4 roti',
  Wed: veg ? 'Kadhi pakoda, bhindi, 4 roti, rice' : 'Kadhi, bhindi, 4 roti, rice',
  Thu: veg ? 'Chole, mix veg, 4 roti, rice' : 'Fish curry, rice, 4 roti',
  Fri: veg ? 'Paneer masala, dal, 4 roti, rice' : 'Chicken biryani, raita',
  Sat: veg ? 'Sev tamatar, dal fry, 4 roti, rice' : 'Egg bhurji, dal, 4 roti, rice',
  Sun: veg ? 'Special: Puri, kheer, chole, pulao' : 'Special: Mutton curry, rice, kheer',
})

export const tiffins = [
  {
    id: 't1', name: 'Maa Ki Rasoi', city: 'bhopal', area: 'MP Nagar', foodType: 'veg', monthly: 2800, perMeal: 60,
    mealsPerDay: 2, deliveryAreas: ['MP Nagar', 'Habibganj', 'Shivaji Nagar'], timings: { lunch: '12:30 – 2:00 PM', dinner: '8:00 – 9:30 PM' },
    rating: 4.7, reviewsCount: 210, verified: true, trial: true, image: unsplash(F.thali), contact: '+91 98XXX XX101', provider: 'Kamla Devi',
    speciality: 'Home-style MP thali with less oil', menu: weekMenu(true),
    reviews: [{ name: 'Rohit Verma', rating: 5, text: 'Home-style food and on time delivery. Highly recommended!', date: '2025-09-01' }],
  },
  {
    id: 't2', name: 'Annapurna Tiffin Service', city: 'bhopal', area: 'Ayodhya Bypass', foodType: 'veg', monthly: 2400, perMeal: 50,
    mealsPerDay: 2, deliveryAreas: ['Ayodhya Bypass', 'RGPV', 'Anand Nagar'], timings: { lunch: '12:00 – 1:30 PM', dinner: '7:30 – 9:00 PM' },
    rating: 4.4, reviewsCount: 132, verified: true, trial: true, image: unsplash(F.dal), contact: '+91 98XXX XX102', provider: 'Suresh Mishra',
    speciality: 'Budget-friendly, delivers to RGPV hostels', menu: weekMenu(true),
    reviews: [{ name: 'Aman Tiwari', rating: 4, text: 'Value for money. Sunday special is great.', date: '2025-07-12' }],
  },
  {
    id: 't3', name: 'Spice Box Kitchen', city: 'bhopal', area: 'Lalghati', foodType: 'both', monthly: 3500, perMeal: 75,
    mealsPerDay: 2, deliveryAreas: ['Lalghati', 'Airport Road', 'Bairagarh'], timings: { lunch: '1:00 – 2:30 PM', dinner: '8:30 – 10:00 PM' },
    rating: 4.3, reviewsCount: 88, verified: true, trial: false, image: unsplash(F.biryani), contact: '+91 98XXX XX103', provider: 'Faizan Ali',
    speciality: 'Bhopali biryani on Fridays', menu: weekMenu(false),
    reviews: [{ name: 'Sameer', rating: 4, text: 'Biryani day is everyone’s favourite.', date: '2025-06-05' }],
  },
  {
    id: 't4', name: 'Healthy Bites Mess', city: 'bhopal', area: 'Kolar Road', foodType: 'veg', monthly: 3200, perMeal: 70,
    mealsPerDay: 3, deliveryAreas: ['Kolar Road', 'Chuna Bhatti', 'MANIT'], timings: { lunch: '12:30 – 2:00 PM', dinner: '8:00 – 9:30 PM' },
    rating: 4.5, reviewsCount: 64, verified: false, trial: true, image: unsplash(F.bowl), contact: '+91 98XXX XX104', provider: 'Neelam Jain',
    speciality: 'Breakfast included · Jain options', menu: weekMenu(true),
    reviews: [{ name: 'Shruti', rating: 5, text: 'Love the sprouts breakfast!', date: '2025-08-18' }],
  },
  {
    id: 't5', name: 'Indori Swad Tiffin', city: 'indore', area: 'Bhawarkuan', foodType: 'veg', monthly: 2600, perMeal: 55,
    mealsPerDay: 2, deliveryAreas: ['Bhawarkuan', 'DAVV', 'Navlakha'], timings: { lunch: '12:00 – 1:30 PM', dinner: '8:00 – 9:30 PM' },
    rating: 4.6, reviewsCount: 176, verified: true, trial: true, image: unsplash(F.paneer), contact: '+91 73XXX XX105', provider: 'Rekha Soni',
    speciality: 'Indori dal-bafla every Sunday', menu: weekMenu(true),
    reviews: [{ name: 'Megha', rating: 5, text: 'Tastes like home. Never missed a delivery.', date: '2025-09-10' }],
  },
  {
    id: 't6', name: 'Vijay Nagar Meal Box', city: 'indore', area: 'Vijay Nagar', foodType: 'both', monthly: 3800, perMeal: 85,
    mealsPerDay: 2, deliveryAreas: ['Vijay Nagar', 'Scheme 54', 'Rasoma'], timings: { lunch: '1:00 – 2:30 PM', dinner: '8:30 – 10:00 PM' },
    rating: 4.2, reviewsCount: 71, verified: true, trial: false, image: unsplash(F.curry), contact: '+91 73XXX XX106', provider: 'Ajay Rathi',
    speciality: 'Protein-rich options for gym-goers', menu: weekMenu(false),
    reviews: [{ name: 'Rahul', rating: 4, text: 'Good portions.', date: '2025-05-02' }],
  },
  {
    id: 't7', name: 'Dilli Ka Dabba', city: 'delhi', area: 'North Campus', foodType: 'veg', monthly: 4200, perMeal: 90,
    mealsPerDay: 2, deliveryAreas: ['Kamla Nagar', 'Vijay Nagar', 'GTB Nagar'], timings: { lunch: '12:30 – 2:00 PM', dinner: '8:00 – 9:30 PM' },
    rating: 4.4, reviewsCount: 244, verified: true, trial: true, image: unsplash(F.thali), contact: '+91 98XXX XX107', provider: 'Sunita Arora',
    speciality: 'Punjabi home food near DU colleges', menu: weekMenu(true),
    reviews: [{ name: 'Simran', rating: 4, text: 'Rajma chawal is perfect.', date: '2025-08-03' }],
  },
  {
    id: 't8', name: 'Aspirant’s Kitchen', city: 'delhi', area: 'Mukherjee Nagar', foodType: 'both', monthly: 3600, perMeal: 70,
    mealsPerDay: 2, deliveryAreas: ['Mukherjee Nagar', 'Nehru Vihar', 'Outram Lines'], timings: { lunch: '1:00 – 2:30 PM', dinner: '8:30 – 10:00 PM' },
    rating: 4.1, reviewsCount: 152, verified: false, trial: true, image: unsplash(F.dal), contact: '+91 98XXX XX108', provider: 'Manoj Kumar',
    speciality: 'Light dinner for late-night study', menu: weekMenu(false),
    reviews: [{ name: 'Abhishek', rating: 4, text: 'Reliable and affordable.', date: '2025-04-11' }],
  },
  {
    id: 't9', name: 'Rajputana Rasoi', city: 'jaipur', area: 'Malviya Nagar', foodType: 'veg', monthly: 3000, perMeal: 65,
    mealsPerDay: 2, deliveryAreas: ['Malviya Nagar', 'MNIT', 'Jawahar Circle'], timings: { lunch: '12:30 – 2:00 PM', dinner: '8:00 – 9:30 PM' },
    rating: 4.5, reviewsCount: 93, verified: true, trial: true, image: unsplash(F.paneer), contact: '+91 94XXX XX109', provider: 'Geeta Shekhawat',
    speciality: 'Dal baati churma on Sundays', menu: weekMenu(true),
    reviews: [{ name: 'Tanvi', rating: 5, text: 'Authentic Rajasthani taste.', date: '2025-03-29' }],
  },
  {
    id: 't10', name: 'Nawabi Tiffin', city: 'lucknow', area: 'Aliganj', foodType: 'nonveg', monthly: 3900, perMeal: 85,
    mealsPerDay: 2, deliveryAreas: ['Aliganj', 'Kapoorthala', 'University Road'], timings: { lunch: '1:00 – 2:30 PM', dinner: '8:30 – 10:00 PM' },
    rating: 4.3, reviewsCount: 81, verified: true, trial: false, image: unsplash(F.biryani), contact: '+91 94XXX XX110', provider: 'Shabana Khan',
    speciality: 'Awadhi biryani and kebabs on weekends', menu: weekMenu(false),
    reviews: [{ name: 'Shivam', rating: 4, text: 'Weekend biryani is fantastic.', date: '2025-02-14' }],
  },
  {
    id: 't11', name: 'Varhadi Bhojan', city: 'nagpur', area: 'Pratap Nagar', foodType: 'veg', monthly: 2700, perMeal: 55,
    mealsPerDay: 2, deliveryAreas: ['Pratap Nagar', 'VNIT', 'Dharampeth'], timings: { lunch: '12:30 – 2:00 PM', dinner: '8:00 – 9:30 PM' },
    rating: 4.4, reviewsCount: 57, verified: true, trial: true, image: unsplash(F.curry), contact: '+91 94XXX XX111', provider: 'Smita Wankhede',
    speciality: 'Maharashtrian bhakri thali', menu: weekMenu(true),
    reviews: [{ name: 'Sakshi', rating: 5, text: 'Simple and tasty.', date: '2025-06-22' }],
  },
]

export const foodTypeLabel = { veg: 'Pure Veg', nonveg: 'Non-Veg', both: 'Veg & Non-Veg' }
