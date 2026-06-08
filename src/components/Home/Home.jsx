import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/Slices/AddProductSlice";
import { carouselSlides } from "../../data/carouselData";
import { heroSections } from "../../data/homeHeroData";
import { theme } from "../../styles/theme";
import HeroSection from "./HeroSection/HeroSection";
import CurationGrid from "./CurationGrid/CurationGrid";
import PhilosophyQuote from "./PhilosophyQuote/PhilosophyQuote";
import NewArrivals from "./NewArrivals/NewArrivals";
import CTASection from "./CTASection/CTASection";

function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    document.title = "CS Atelier — Collections";
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const heroBg = carouselSlides[0]?.image;
  const heroTitle = carouselSlides[0]?.title;
  const curationItems = heroSections.slice(0, 3);
  const ctaImage = carouselSlides[1]?.image || carouselSlides[0]?.image;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: theme.colors.background, color: theme.colors.text.primary }}>
      <HeroSection heroBg={heroBg} heroTitle={heroTitle} />
      <CurationGrid curationItems={curationItems} />
      <PhilosophyQuote />
      <NewArrivals products={products} fallbackSlides={carouselSlides} />
      <CTASection ctaImage={ctaImage} />
    </div>
  );
}

export default Home;
