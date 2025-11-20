import Superhero from "/src/assets/Batman.png";
import Jersey from "/src/assets/Barca.png";
import GraphicTee from "/src/assets/GraphicTee.png";

export const heroSections = [
  {
    id: 1,
    image: Superhero,
    alt: "Superhero Collection",
    title: "Best Styles",
    description: "Discover our exclusive superhero collection featuring iconic characters and bold designs. Perfect for fans who want to showcase their favorite heroes in style.",
    buttonText: "Shop Superhero Collection",
    bgColor: "bg-gray-50",
    reverse: false
  },
  {
    id: 2,
    image: Jersey,
    alt: "Jersey Collection",
    title: "Trending Jerseys",
    description: "Represent your team with authentic jerseys from top clubs and national teams. Premium quality materials ensure comfort and durability for true fans.",
    buttonText: "Explore Jerseys",
    bgColor: "bg-white",
    reverse: true
  },
  {
    id: 3,
    image: GraphicTee,
    alt: "Graphic Tee Collection",
    title: "Gen-Z Designs",
    description: "Express your unique personality with our curated collection of graphic tees. From minimalist designs to bold statements, find your perfect match.",
    buttonText: "Browse Graphic Tees",
    bgColor: "bg-gray-50",
    reverse: false
  }
];
