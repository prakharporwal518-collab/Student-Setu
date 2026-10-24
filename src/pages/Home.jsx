import { FeaturedCities, Hero, HowItWorks, ModuleCards, Stats, Testimonials } from '../components/home/HomeSections'
import { BharatSection, SkillBridgeShowcase, StudentLifeSection, TeacherShowcase } from '../components/home/Showcases'

// Learning first: Skill Bridge, Teacher Copilot and remote-learning features lead;
// stay & food support sits further down as an optional extra.
export default function Home() {
  return (
    <>
      <Hero />
      <ModuleCards />
      <Stats />
      <SkillBridgeShowcase />
      <HowItWorks />
      <TeacherShowcase />
      <BharatSection />
      <Testimonials />
      <StudentLifeSection />
      <FeaturedCities />
    </>
  )
}
