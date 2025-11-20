import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeroDesktop from "./HomeHeroDesktop";
import HomeHeroMobile from "./HomeHeroMobile";

export default function HomeHero() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isMobile ? (
        <HomeHeroMobile navigate={navigate} />
      ) : (
        <HomeHeroDesktop navigate={navigate} />
      )}
    </>
  );
}
