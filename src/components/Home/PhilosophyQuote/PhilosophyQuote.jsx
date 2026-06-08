import { useNavigate } from "react-router-dom";
import { Button } from "../../ui";
import { theme } from "../../../styles/theme";

function PhilosophyQuote() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '160px 32px', backgroundColor: theme.colors.backgroundAlt }}>
      <div style={{ maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
        <h2
          className="uppercase tracking-[0.3em]"
          style={{ fontSize: '10px', marginBottom: '64px', color: theme.colors.secondary }}
        >
          Philosophy
        </h2>
        <blockquote
          className="font-black tracking-tight"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '48px', color: theme.colors.text.primary }}
        >
          "True utility is found in the intersection of structural permanence and functional beauty."
        </blockquote>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate('/ProductsList')}
            className="group relative uppercase tracking-widest"
            style={{ fontSize: '11px', paddingBottom: '8px', color: theme.colors.text.primary }}
          >
            Explore the Collection
            <span
              className="absolute bottom-0 left-0 w-0 transition-all duration-500 group-hover:w-full"
              style={{ height: '1px', backgroundColor: theme.colors.secondary }}
            />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PhilosophyQuote;
