import React, { useEffect } from "react";
import { Marquee } from "../ui/marquee";
import Autoplay from 'embla-carousel-autoplay';
import ReviewMarquee from "./ReviewMarquee/ReviewMarquee";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import HomeHero from "../HomeHero/HomeHero";
import { carouselSlides } from "../../data/carouselData";

function Home() {
  useEffect(() => {
    document.title = "Clothing Store-Home";
  }, []);

  return (
    <div className="w-full flex flex-col">
      
      {/* Marquee Section */}
      <div className="bg-white">
        <Marquee className="w-full text-sm md:text-base">
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>Best Clothing Brand</span>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>Exclusive Collection</span>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>Premium Quality</span>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>Latest Fashion</span>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>Best Prices</span>
        </Marquee>
      </div>

      {/* Carousel Section */}
      <div className="relative w-full h-[400px] md:h-[90vh] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: 3000,
              rootNode: (emblaRoot) => emblaRoot.parentElement,
            })
          ]}
          opts={{
            loop: true
          }}
        >
          <CarouselContent className="h-full ml-0" style={{ marginLeft: 0 }}>
            {carouselSlides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0 h-full" style={{ paddingLeft: 0 }}>
                <div className="relative w-full h-[400px] md:h-[90vh]">

                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-end text-white"
                    style={{
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      paddingBottom: "3rem",
                    }}
                  >
                    {/* md:px-8 md:pb-20 responsive spacing */}
                    <style>{`
                      @media (min-width: 768px) {
                        .home-hero-spacing {
                          padding-left: 2rem !important;
                          padding-right: 2rem !important;
                          padding-bottom: 5rem !important;
                        }
                      }
                    `}</style>

                    <div className="home-hero-spacing w-full flex flex-col items-center">

                      <h1 
                        className="text-3xl md:text-6xl font-bold text-center drop-shadow-lg"
                        style={{ marginBottom: "1rem" }}
                      >
                        {slide.title}
                      </h1>

                      <p 
                        className="text-center text-base md:text-xl max-w-2xl drop-shadow-md"
                        style={{ marginBottom: "2rem" }}
                      >
                        {slide.description}
                      </p>

                      <button 
                        onClick={() => window.location.href = '/ProductsList'}
                        className="bg-black text-white font-bold border-2 border-white hover:bg-white hover:text-black transition-all duration-300 shadow-xl uppercase tracking-wider text-sm md:text-base"
                        style={{
                          paddingTop: "14px",
                          paddingBottom: "14px",
                          paddingLeft: "40px",
                          paddingRight: "40px"
                        }}
                      >
                        {slide.buttonText}
                      </button>

                    </div>

                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel Navigation */}
          <CarouselPrevious 
            className="absolute left-2 md:left-4 z-10"
            style={{ left: "0.5rem" }}
          />
          <CarouselNext 
            className="absolute right-2 md:right-4 z-10"
            style={{ right: "0.5rem" }}
          />
        </Carousel>
      </div>

      <HomeHero />
      <ReviewMarquee />
    </div>
  );
}

export default Home;
