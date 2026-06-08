import { useNavigate } from "react-router-dom";
import { Button } from "../../ui";
import { theme } from "../../../styles/theme";

function CTASection({ ctaImage }) {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '128px 32px', backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
      <div
        className="grid grid-cols-1 md:grid-cols-2 items-center"
        style={{ gap: '96px', maxWidth: '1440px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div>
          <h2
            className="uppercase tracking-[0.4em]"
            style={{ fontSize: '10px', marginBottom: '48px', opacity: 0.6 }}
          >
            Discover More
          </h2>
          <h3
            className="font-black tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '48px' }}
          >
            EXPLORE THE FULL COLLECTION
          </h3>
          <Button
            variant="link"
            size="default"
            onClick={() => navigate('/ProductsList')}
            className="group flex items-center"
            style={{
              gap: '16px',
              paddingBottom: '16px',
              color: theme.colors.text.light,
              borderBottom: `1px solid rgba(252,249,248,0.2)`
            }}
          >
            <span className="uppercase tracking-widest" style={{ fontSize: '12px' }}>Shop All Products</span>
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </Button>
        </div>
        <div className="overflow-hidden grayscale" style={{ height: '500px' }}>
          <img
            src={ctaImage}
            alt="Collection"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'top' }}
          />
        </div>
      </div>
    </section>
  );
}

export default CTASection;
