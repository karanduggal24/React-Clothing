import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import HomeHeroDesktop from "./HomeHeroDesktop";
import HomeHeroMobile from "./HomeHeroMobile";

export default function HomeHero() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile
    ? <HomeHeroMobile navigate={navigate} />
    : <HomeHeroDesktop navigate={navigate} />;
}
