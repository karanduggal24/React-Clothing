import React, { useEffect } from "react";
import { Marquee } from "../ui/marquee";
import Superhero from "/src/assets/Batman.png";
import Jersey from "/src/assets/Barca.png";
import GraphicTee from "/src/assets/GraphicTee.png";
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import HomeHero from "../HomeHero/HomeHero";
import { Import } from "lucide-react";

function Home() {
  useEffect(() => {
    document.title = "Clothing Store";
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* Marquee Section */}
      <div className="bg-white">
        <Marquee className="w-full text-sm md:text-base">
          <span className="mx-4">Best Clothing Brand</span>
          <span className="mx-4">Exclusive Collection</span>
          <span className="mx-4">Premium Quality</span>
          <span className="mx-4">Latest Fashion</span>
          <span className="mx-4">Best Prices</span>
        </Marquee>
      </div>

      {/* Carousel Section */}
      <div className="relative w-full h-[400px] md:h-[90vh] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
              rootNode: (emblaRoot) => emblaRoot.parentElement,
            })
          ]}
          opts={{
            loop: true
          }}
        >
          <CarouselContent className="h-full ml-0">
            <CarouselItem className="pl-0">
              <div className="relative w-full h-full">
                <img
                  src={Superhero}
                  alt="superhero"
                  className="absolute inset-0 w-full h-full object-cover object-center md:object-center"
                />
                <div className="text-white absolute bottom-5 left-0 right-0 px-4 md:px-8">
                  <h1 className="text-2xl md:text-4xl text-center font-bold">
                    SuperHero Collection
                  </h1>
                  <p className="text-center text-sm md:text-base mt-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam, dolore dolorem perspiciatis earum eum qui. Sed, ad
                    animi necessitatibus qui labore nisi alias nulla sunt dolore
                    consectetur officiis doloremque odio.
                  </p>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className="pl-0">
              <div className="w-full h-[400px] md:h-[80vh] bg-gray-800 flex items-center justify-center text-white text-xl md:text-2xl">
                <div className="relative w-full h-full">
                <img
                  src={Jersey}
                  alt="Jersey"
                  className="absolute inset-0 w-full h-full object-cover object-center md:object-center"
                />
                <div className="text-white absolute bottom-5 left-0 right-0 px-4 md:px-8">
                  <h1 className="text-2xl md:text-4xl text-center font-bold">
                    Trending Jersey Collection
                  </h1>
                  <p className="text-center text-sm md:text-base mt-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam, dolore dolorem perspiciatis earum eum qui. Sed, ad
                    animi necessitatibus qui labore nisi alias nulla sunt dolore
                    consectetur officiis doloremque odio.
                  </p>
                </div>
              </div>
              </div>
            </CarouselItem>

            <CarouselItem className="pl-0">
              <div className="w-full h-[400px] md:h-[80vh] bg-gray-700 flex items-center justify-center text-white text-xl md:text-2xl">
                  <div className="relative w-full h-full">
                <img
                  src={GraphicTee}
                  alt="Graphic Tee"
                  className="absolute inset-0 w-full h-full object-cover object-center md:object-center"
                />
                <div className="text-white absolute bottom-5 left-0 right-0 px-4 md:px-8">
                  <h1 className="text-2xl md:text-4xl text-center font-bold">
                    Graphic Tee Collection
                  </h1>
                  <p className="text-center text-sm md:text-base mt-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam, dolore dolorem perspiciatis earum eum qui. Sed, ad
                    animi necessitatibus qui labore nisi alias nulla sunt dolore
                    consectetur officiis doloremque odio.
                  </p>
                </div>
              </div>
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Carousel Navigation Buttons */}
          <CarouselPrevious className="absolute left-2 md:left-4 z-10" />
          <CarouselNext className="absolute right-2 md:right-4 z-10" />
        </Carousel>
      </div>
      <HomeHero />
    </div>
  );
}

export default Home;
