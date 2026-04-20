import { Hero } from "@/components/hero"
import { CategoryStrip } from "@/components/category-strip"
import { FeaturedProducts } from "@/components/featured-products"
import { ServicesSection } from "@/components/services-section"
import { InquiryCta } from "@/components/inquiry-cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <ServicesSection />
      <InquiryCta />
    </>
  )
}
