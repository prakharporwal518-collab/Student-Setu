import { FeaturedCities, Hero, HowItWorks, ModuleCards, Stats, Testimonials } from '../components/home/HomeSections'
import HostelFinder, { HostelFinderHeader } from '../components/hostel/HostelFinder'

export default function Home() {
  return (
    <>
      <Hero />
      <ModuleCards />
      <Stats />
      <HowItWorks />
      <section className="container-x">
        <div className="rounded-3xl bg-gradient-to-b from-brand-50/80 to-white p-4 ring-1 ring-brand-100 dark:from-white/5 dark:to-transparent dark:ring-white/10 sm:p-6 lg:p-8">
          <HostelFinderHeader />
          <HostelFinder limit={6} />
        </div>
      </section>
      <Testimonials />
      <FeaturedCities />
    </>
  )
}
