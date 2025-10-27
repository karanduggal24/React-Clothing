import React, { useEffect } from "react";
import { Marquee } from "../ui/marquee";
import Superhero from "../../assets/superhero.jpg";
import { BlurFade } from "../ui/blur-fade";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

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
      <div className="relative w-full h-[400px] md:h-[80vh] overflow-hidden">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full ml-0">
            <CarouselItem className="pl-0">
              <div className="relative w-full h-full">
                <img
                  src={Superhero}
                  alt="superhero"
                  className="absolute inset-0 w-full h-full object-cover object-center md:object-[center_25%]"
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
                Slide 2
              </div>
            </CarouselItem>

            <CarouselItem className="pl-0">
              <div className="w-full h-[400px] md:h-[80vh] bg-gray-700 flex items-center justify-center text-white text-xl md:text-2xl">
                Slide 3
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Carousel Navigation Buttons */}
          <CarouselPrevious className="absolute left-2 md:left-4 z-10" />
          <CarouselNext className="absolute right-2 md:right-4 z-10" />
        </Carousel>
      </div>

      {/* Info Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-around p-6 md:p-10 gap-8">
        <div className="pt-6 md:pt-10">
          <BlurFade delay={0.25} inView>
            <img
              src={Superhero}
              alt="Superhero"
              className="mx-auto shadow-lg w-60 h-60 md:w-96 md:h-96 object-cover object-center rounded-lg"
            />
          </BlurFade>
        </div>

        <div className="flex flex-col justify-center max-w-md md:max-w-lg space-y-4 text-center md:text-left">
          <BlurFade delay={0.25} inView>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              Best Styles
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
              labore minima impedit quisquam dicta velit, repellat repudiandae,
              officiis molestias natus, perferendis quae exercitationem
              necessitatibus! Suscipit ab non distinctio nulla dolorum?
            </p>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default Home;
