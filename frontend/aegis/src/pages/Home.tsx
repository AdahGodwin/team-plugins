import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import PreCare from '../components/home/PreCare'
import Caretaker from '../components/home/Caretaker'
import HowItWorks from '../components/home/HowItWorks'
import RiskScore from '../components/home/RiskScore'
import EscalationLevels from '../components/home/EscalationLevels'
import Features from '../components/home/Features'
import CTASection from '../components/home/CTASection'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <PreCare />
        <Caretaker />
        <HowItWorks />
        <RiskScore />
        <EscalationLevels />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default Home
