// Every lazily-loaded page in one place. App.jsx builds its routes from these, and
// "Save for offline" fetches them all so the service worker can cache every page.
export const loaders = {
  SkillBridge: () => import('./pages/SkillBridge'),
  Verify: () => import('./pages/Verify'),
  Teacher: () => import('./pages/Teacher'),
  ClassRoom: () => import('./pages/ClassRoom'),
  Vocational: () => import('./pages/Vocational'),
  Pathways: () => import('./pages/Pathways'),
  Counseling: () => import('./pages/Counseling'),
  Architecture: () => import('./pages/Architecture'),
  Hostels: () => import('./pages/Hostels'),
  HostelDetail: () => import('./pages/HostelDetail'),
  OwnerDashboard: () => import('./pages/OwnerDashboard'),
  Tiffin: () => import('./pages/Tiffin'),
  ProviderDashboard: () => import('./pages/ProviderDashboard'),
  Connect: () => import('./pages/Connect'),
  Colleges: () => import('./pages/Colleges'),
  Resources: () => import('./pages/Resources'),
  Skills: () => import('./pages/Skills'),
  Careers: () => import('./pages/Careers'),
  Exams: () => import('./pages/Exams'),
  Scholarships: () => import('./pages/Scholarships'),
  Library: () => import('./pages/Library'),
  Sidf: () => import('./pages/Sidf'),
  Auth: () => import('./pages/Auth'),
  Dashboards: () => import('./pages/Dashboards'),
  SearchPage: () => import('./pages/SearchPage'),
  InfoPages: () => import('./pages/InfoPages'),
}

export const prefetchAllPages = () => Promise.all(Object.values(loaders).map((load) => load()))
