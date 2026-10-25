import { lazy } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import Layout, { RequireRole } from './components/layout/Layout'
import Home from './pages/Home'
import { loaders } from './pageLoaders'

// Pages are code-split so the home page loads fast on mobile data.
const page = (file, name = 'default') => lazy(() => loaders[file]().then((m) => ({ default: m[name] })))

const SkillBridge = page('SkillBridge')
const Verify = page('Verify')
const Teacher = page('Teacher')
const ClassRoom = page('ClassRoom')
const Vocational = page('Vocational')
const Pathways = page('Pathways')
const Counseling = page('Counseling')
const Architecture = page('Architecture')
const Hostels = page('Hostels')
const HostelDetail = page('HostelDetail')
const OwnerDashboard = page('OwnerDashboard')
const Tiffin = page('Tiffin')
const ProviderDashboard = page('ProviderDashboard')
const Connect = page('Connect')
const Colleges = page('Colleges')
const CollegeDetail = page('Colleges', 'CollegeDetail')
const Resources = page('Resources')
const Skills = page('Skills')
const Careers = page('Careers')
const Exams = page('Exams')
const Quiz = page('Exams', 'Quiz')
const Scholarships = page('Scholarships')
const Library = page('Library')
const Sidf = page('Sidf')
const Login = page('Auth', 'Login')
const Signup = page('Auth', 'Signup')
const StudentDashboard = page('Dashboards', 'StudentDashboard')
const MentorDashboard = page('Dashboards', 'MentorDashboard')
const AdminPanel = page('Dashboards', 'AdminPanel')
const SearchPage = page('SearchPage')
const About = page('InfoPages', 'About')
const Help = page('InfoPages', 'Help')
const FAQ = page('InfoPages', 'FAQ')
const Privacy = page('InfoPages', 'Privacy')
const Terms = page('InfoPages', 'Terms')
const NotFound = page('InfoPages', 'NotFound')

// Remount these pages when their key input changes so local state resets.
const QuizRoute = () => <Quiz key={useParams().id} />
const SearchRoute = () => <SearchPage key={useLocation().search} />
const ClassRoute = () => <ClassRoom key={useParams().code ?? 'join'} />

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Core learning platform */}
        <Route path="skill-bridge" element={<SkillBridge />} />
        <Route path="verify/:token" element={<Verify />} />
        <Route path="teacher" element={<Teacher />} />
        <Route path="class" element={<ClassRoute />} />
        <Route path="class/:code" element={<ClassRoute />} />
        <Route path="pathways" element={<Pathways />} />
        <Route path="counseling" element={<Counseling />} />
        <Route path="architecture" element={<Architecture />} />
        <Route path="vocational" element={<Vocational />} />
        <Route path="resources" element={<Resources />} />
        <Route path="skills" element={<Skills />} />
        <Route path="careers" element={<Careers />} />
        <Route path="exams" element={<Exams />} />
        <Route path="quiz/:id" element={<QuizRoute />} />
        <Route path="scholarships" element={<Scholarships />} />
        <Route path="library" element={<Library />} />
        <Route path="sidf" element={<Sidf />} />
        {/* Optional student-life support */}
        <Route path="hostels" element={<Hostels />} />
        <Route path="hostels/:id" element={<HostelDetail />} />
        <Route path="tiffin" element={<Tiffin />} />
        <Route path="connect" element={<Connect />} />
        <Route path="colleges" element={<Colleges />} />
        <Route path="colleges/:id" element={<CollegeDetail />} />
        {/* Accounts & info */}
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
  )
}
