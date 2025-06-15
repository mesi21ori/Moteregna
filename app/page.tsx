import AppShowcase from "./landing/app-showcase";
import FinalCTA from "./landing/final-cta";
import Footer from "./landing/footer";
import Hero from "./landing/hero";
import StatisticsVisualizations from "./landing/statistics-visualizations";
import StatsBar from "./landing/stats-bar";
import Testimonials from "./landing/testimonials";
import ValueProposition from "./landing/value-proposition";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <StatsBar />
      <ValueProposition />
      <AppShowcase />
      <StatisticsVisualizations />
      <FinalCTA />
      <Testimonials />
      <Footer />
    </main>
  )
}
