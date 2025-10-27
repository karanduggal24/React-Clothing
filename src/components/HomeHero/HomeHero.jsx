// import React from 'react';
// import Superhero from "../../assets/superhero.jpg";
// import { BlurFade } from '../ui/blur-fade';
// import Jersey from "../../assets/Barca.png";
// import GraphicTee from "../../assets/GraphicTee.png";

// function HomeHero() {
//   return (
//     <div>
//      <div className="  w-full flex flex-col md:flex-row items-center justify-around p-6 md:p-10 gap-8 h-[70vh]">
//              <div className="pt-6 md:pt-10">
//                <BlurFade delay={0.25} inView>
//                  <img
//                    src={Superhero}
//                    alt="Superhero"
//                    className="mx-auto shadow-lg w-60 h-60 md:w-96 md:h-96 object-cover object-center rounded-lg"
//                  />
//                </BlurFade>
//              </div>
     
//              <div className="  flex flex-col justify-center max-w-md md:max-w-lg space-y-4 text-center md:text-left">
//                <BlurFade delay={0.25} inView>
//                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
//                    Best Styles
//                  </h1>
//                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
//                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
//                    labore minima impedit quisquam dicta velit, repellat repudiandae,
//                    officiis molestias natus, perferendis quae exercitationem
//                    necessitatibus! Suscipit ab non distinctio nulla dolorum?
//                  </p>
//                </BlurFade>
//              </div>
//            </div>
//            <div className=" w-full flex flex-col md:flex-row items-center justify-around p-6 md:p-10 gap-8 h-[70vh] "> 
//              <div className="sm:flex-col-reverse flex flex-col justify-center max-w-md md:max-w-lg space-y-4 text-center md:text-left">
//                <BlurFade delay={0.25} inView>
//                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
//                    Trending Jerseys
//                  </h1>
//                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
//                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
//                    labore minima impedit quisquam dicta velit, repellat repudiandae,
//                    officiis molestias natus, perferendis quae exercitationem
//                    necessitatibus! Suscipit ab non distinctio nulla dolorum?
//                  </p>
//                </BlurFade>
//              </div>
//              <div className="pt-6 md:pt-10">
//                <BlurFade delay={0.25} inView>
//                  <img
//                    src={Jersey}
//                    alt="Jersey"
//                    className="mx-auto shadow-lg w-60 h-60 md:w-96 md:h-96 object-cover object-center rounded-lg"
//                  />
//                </BlurFade>
//              </div>
    
//            </div>
//            <div className="  w-full flex flex-col md:flex-row items-center justify-around p-6 md:p-10 gap-8 h-[70vh]">
//              <div className="pt-6 md:pt-10">
//                <BlurFade delay={0.25} inView>
//                  <img
//                    src={GraphicTee}
//                    alt="Graphic Tee"
//                    className="mx-auto shadow-lg w-60 h-60 md:w-96 md:h-96 object-cover object-center rounded-lg"
//                  />
//                </BlurFade>
//              </div>
     
//              <div className="flex flex-col justify-center max-w-md md:max-w-lg space-y-4 text-center md:text-left">
//                <BlurFade delay={0.25} inView>
//                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
//                    Gen-Z Designs
//                  </h1>
//                  <p style={{ marginTop: '20px' }} className="text-base md:text-lg text-gray-600 leading-relaxed">
//                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
//                    labore minima impedit quisquam dicta velit, repellat repudiandae,
//                    officiis molestias natus, perferendis quae exercitationem
//                    necessitatibus! Suscipit ab non distinctio nulla dolorum?
//                  </p>
//                </BlurFade>
//              </div>
//            </div>
            
//     </div>
//   );
// }

// export default HomeHero;



import React from "react";
import Superhero from "../../assets/superhero.jpg";
import { BlurFade } from "../ui/blur-fade";
import Jersey from "../../assets/Barca.png";
import GraphicTee from "../../assets/GraphicTee.png";

function HomeHero() {
  return (
    <div>
      {/* Section 1 */}
      <div className="w-full flex flex-col md:flex-row items-center justify-around p-6 md:p-10 gap-8 h-[70vh]">
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

      {/* Section 2 - Flip only on desktop */}
      <div className="w-full flex flex-col md:flex-row-reverse items-center justify-around p-6 md:p-10 gap-8 h-[70vh]">
        <div className="pt-6 md:pt-10">
          <BlurFade delay={0.25} inView>
            <img
              src={Jersey}
              alt="Jersey"
              className="mx-auto shadow-lg w-60 h-60 md:w-96 md:h-96 object-cover object-center rounded-lg"
            />
          </BlurFade>
        </div>

        <div className="flex flex-col justify-center max-w-md md:max-w-lg space-y-4 text-center md:text-left">
          <BlurFade delay={0.25} inView>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              Trending Jerseys
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

      {/* Section 3 */}
      <div className="w-full flex flex-col md:flex-row items-center justify-around p-6 md:p-10 gap-8 h-[70vh]">
        <div className="pt-6 md:pt-10">
          <BlurFade delay={0.25} inView>
            <img
              src={GraphicTee}
              alt="Graphic Tee"
              className="mx-auto shadow-lg w-60 h-60 md:w-96 md:h-96 object-cover object-center rounded-lg"
            />
          </BlurFade>
        </div>

        <div className="flex flex-col justify-center max-w-md md:max-w-lg space-y-4 text-center md:text-left">
          <BlurFade delay={0.25} inView>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              Gen-Z Designs
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mt-5">
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

export default HomeHero;
