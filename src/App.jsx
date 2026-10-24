import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import Layout, { PageLoader, RequireRole } from './components/layout/Layout'
import Home from './pages/Home'

// Pages are code-split so the home page loads fast on mobile data.
const Hostels = lazy(() => import('./pages/Hostels'))
const HostelDetail = lazy(() => import('./pages/HostelDetail'))
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'))
const Tiffin = lazy(() => import('./pages/Tiffin'))
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard'))
const Connect = lazy(() => import('./pages/Connect'))
const Colleges = lazy(() => import('./pages/Colleges'))
const CollegeDetail = lazy(() => import('./pages/Colleges').then((m) => ({ default: m.CollegeDetail })))
const Resources = lazy(() => import('./pages/Resources'))
const Skills = lazy(() => import('./pages/Skills'))
const Careers = lazy(() => import('./pages/Careers'))
const Exams = lazy(() => import('./pages/Exams'))
const Quiz = lazy(() => import('./pages/Exams').then((m) => ({ default: m.Quiz })))
const Scholarships = lazy(() => import('./pages/Scholarships'))
const Library = lazy(() => import('./pages/Library'))
const Sidf = lazy(() => import('./pages/Sidf'))
const Login = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Signup })))
const StudentDashboard = lazy(() => import('./pages/Dashboards').then((m) => ({ default: m.StudentDashboard })))
const MentorDashboard = lazy(() => import('./pages/Dashboards').then((m) => ({ default: m.MentorDashboard })))
const AdminPanel = lazy(() => import('./pages/Dashboards').then((m) => ({ default: m.AdminPanel })))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const info = (name) => lazy(() => import('./pages/InfoPages').then((m) => ({ default: m[name] })))
const About = info('About')
const Help = info('Help')
const FAQ = info('FAQ')
const Privacy = info('Privacy')
const Terms = info('Terms')
const NotFound = info('NotFound')

// Remount these pages when their key input changes so local state resets.
const QuizRoute = () => <Quiz key={useParams().id} />
const SearchRoute = () => <SearchPage key={useLocation().search} />

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hostels" element={<Hostels />} />
          <Route path="hostels/:id" element={<HostelDetail />} />
          <Route path="tiffin" element={<Tiffin />} />
          <Route path="connect" element={<Connect />} />
          <Route path="colleges" element={<Colleges />} />
          <Route path="colleges/:id" element={<CollegeDetail />} />
          <Route path="resources" element={<Resources />} />
          <Route path="skills" element={<Skills />} />
          <Route path="careers" element={<Careers />} />
          <Route path="exams" element={<Exams />} />
          <Route path="quiz/:id" element={<QuizRoute />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="library" element={<Library />} />
          <Route path="sidf" element={<Sidf />} />
          <Route path="search" element={<SearchRoute />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dashboard" element={<RequireRole role="student"><StudentDashboard /></RequireRole>} />
          <Route path="owner" element={<RequireRole role="owner"><OwnerDashboard /></RequireRole>} />
          <Route path="provider" element={<RequireRole role="provider"><ProviderDashboard /></RequireRole>} />
          <Route path="mentor" element={<RequireRole role="mentor"><MentorDashboard /></RequireRole>} />
          <Route path="admin" element={<RequireRole role="admin"><AdminPanel /></RequireRole>} />
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
