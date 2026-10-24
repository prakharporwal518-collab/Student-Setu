// Shared helpers + location data used by every module.

/** Build an Unsplash CDN URL. Components fall back to an illustration if the image fails. */
export const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

/**
 * Free Unsplash photo by its short page id (the last 11 characters of an unsplash.com/photos/... link).
 * Images that fail to load fall back to the built-in illustrations.
 */
export const unsplashPhoto = (id, w = 1200) => `https://unsplash.com/photos/${id}/download?force=true&w=${w}`

export const states = [
  { id: 'mp', name: 'Madhya Pradesh', cities: ['bhopal', 'indore'] },
  { id: 'dl', name: 'Delhi', cities: ['delhi'] },
  { id: 'rj', name: 'Rajasthan', cities: ['jaipur'] },
  { id: 'up', name: 'Uttar Pradesh', cities: ['lucknow'] },
  { id: 'mh', name: 'Maharashtra', cities: ['nagpur'] },
]

// `palette` drives the illustrated city cards (sky gradient + skyline colour).
export const cities = [
  {
    id: 'bhopal', photos: [], name: 'Bhopal', state: 'Madhya Pradesh', stateId: 'mp', students: 12400,
    tagline: 'City of Lakes', landmark: 'mosque',
    areas: ['MP Nagar', 'Lalghati', 'Ayodhya Bypass', 'Hoshangabad Road', 'Kolar Road', 'Indrapuri'],
    palette: ['#fb923c', '#f43f5e', '#312e81'], lat: 23.2599, lng: 77.4126,
  },
  {
    id: 'indore', photos: [], name: 'Indore', state: 'Madhya Pradesh', stateId: 'mp', students: 9800,
    tagline: 'Cleanest City of India', landmark: 'palace',
    areas: ['Bhawarkuan', 'Vijay Nagar', 'Palasia', 'Rau', 'Khandwa Road'],
    palette: ['#fbbf24', '#fb7185', '#1e3a8a'], lat: 22.7196, lng: 75.8577,
  },
  {
    id: 'delhi', photos: ['XjKaPInYVCM', '1quFrRMEScA', 'Lo1MM5WJiEw'], name: 'Delhi', state: 'Delhi', stateId: 'dl', students: 18200,
    tagline: 'Capital of Dreams', landmark: 'gate',
    areas: ['North Campus', 'Mukherjee Nagar', 'Hauz Khas', 'Laxmi Nagar', 'Rohini'],
    palette: ['#fdba74', '#ef4444', '#1e1b4b'], lat: 28.6139, lng: 77.209,
  },
  {
    id: 'jaipur', photos: ['slTVVuk7hZU'], name: 'Jaipur', state: 'Rajasthan', stateId: 'rj', students: 7600,
    tagline: 'The Pink City', landmark: 'mahal',
    areas: ['Malviya Nagar', 'Mansarovar', 'Jagatpura', 'Vaishali Nagar'],
    palette: ['#fda4af', '#f97316', '#4c1d95'], lat: 26.9124, lng: 75.7873,
  },
  {
    id: 'lucknow', photos: ['gu9Z8OdMKHo'], name: 'Lucknow', state: 'Uttar Pradesh', stateId: 'up', students: 6400,
    tagline: 'City of Nawabs', landmark: 'imambara',
    areas: ['Hazratganj', 'Aliganj', 'Gomti Nagar', 'Kapoorthala'],
    palette: ['#fcd34d', '#f472b6', '#1e3a8a'], lat: 26.8467, lng: 80.9462,
  },
  {
    id: 'nagpur', photos: [], name: 'Nagpur', state: 'Maharashtra', stateId: 'mh', students: 5200,
    tagline: 'Orange City', landmark: 'temple',
    areas: ['Dharampeth', 'Sitabuldi', 'Pratap Nagar', 'Sadar'],
    palette: ['#fb923c', '#a855f7', '#0f172a'], lat: 21.1458, lng: 79.0882,
  },
]

export const cityById = (id) => cities.find((c) => c.id === id)

export const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN')

export const timeAgo = (iso) => {
  const d = (Date.now() - new Date(iso).getTime()) / 1000
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)} min ago`
  if (d < 86400) return `${Math.floor(d / 3600)} h ago`
  return `${Math.floor(d / 86400)} d ago`
}
