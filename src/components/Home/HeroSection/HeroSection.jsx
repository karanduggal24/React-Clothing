import { useNavigate } from "react-router-dom";
import { Button } from "../../ui";
import { theme } from "../../../styles/theme";

function HeroSection({ heroBg, heroTitle }) {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: '100vh', backgroundColor: theme.colors.primary }}
    >
      {heroBg && (
        <img
          src={heroBg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover grayscale"
          style={{ opacity: 0.6, filter: 'grayscale(1) brightness(0.75)' }}
        />
      )}
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, rgba(28,27,27,0.5) 0%, rgba(28,27,27,0) 100%)' }}
      />

      {/* Hero content */}
      <div className="relative z-10 text-center" style={{ padding: '0 16px' }}>
        <p
          className="uppercase tracking-[0.4em]"
          style={{ fontSize: '10px', marginBottom: '32px', opacity: 0.8, color: theme.colors.text.light }}
        >
          VOLUME 01 / THE NEW ESSENTIALS
        </p>
        <h1
          className="font-black tracking-tighter leading-none"
          style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', lineHeight: 0.85, color: theme.colors.text.light }}
        >
          {(heroTitle || 'NEW COLLECTION').toUpperCase()}
        </h1>
      </div>

      {/* Explore Collection Button - Always visible at bottom */}
      <div 
        className="absolute z-20 left-1/2 transform -translate-x-1/2"
        style={{ bottom: '48px' }}
      >
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/ProductsList')}
          className="group flex items-center bg-[#fcf9f8] text-[#1c1b1b] hover:bg-[#e5e2e1] transition-colors"
          style={{ gap: '16px', borderColor: 'transparent' }}
        >
          <span className="uppercase text-xs tracking-widest">Explore Collection</span>
          <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform" style={{ fontSize: '18px' }}>
            arrow_forward
          </span>
        </Button>
      </div>
    </section>
  );
}

export default HeroSection;
