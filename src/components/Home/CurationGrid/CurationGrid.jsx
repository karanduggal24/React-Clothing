import { useNavigate } from "react-router-dom";
import { theme } from "../../../styles/theme";

function CurationGrid({ curationItems }) {
  const navigate = useNavigate();

  return (
    <section
      style={{ padding: '160px 40px', backgroundColor: theme.colors.background, color: theme.colors.text.primary }}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-24 max-w-[1512px]"
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >

        {/* Left Column */}
        <div className="lg:col-span-4 flex flex-col justify-between lg:sticky lg:top-40 h-fit">
          <div>
            <div className="w-8 h-px" style={{ marginBottom: '24px', backgroundColor: theme.colors.primary }} />
            <h2
              className="uppercase tracking-[0.3em] font-light text-[10px]"
              style={{ marginBottom: '16px', color: theme.colors.text.muted }}
            >
              01 / The Curation
            </h2>
            <h3 className="text-2xl font-normal tracking-tight leading-snug max-w-xs" style={{ color: theme.colors.text.primary }}>
              Redefining silhouette through structural tailoring.
            </h3>
          </div>

          <p className="font-light text-[15px] leading-relaxed max-w-[280px]" style={{ marginTop: '48px', color: theme.colors.text.secondary }}>
           Garments defined by spatial awareness and impeccable tailoring. A silent study in minimalist reduction.
          </p>
        </div>

        {/* Right Column: Asymmetric Editorial Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20">

            {curationItems[0] && (
              <CurationImage
                item={curationItems[0]}
                className="w-full"
                aspectRatio="3/4"
                onClick={() => navigate('/ProductsList')}
              />
            )}

            {curationItems[1] && (
              <CurationImage
                item={curationItems[1]}
                className="w-full"
                aspectRatio="4/5"
                onClick={() => navigate('/ProductsList')}
                style={{ marginTop: '80px' }}
              />
            )}

            {curationItems[2] && (
              <CurationImage
                item={curationItems[2]}
                className="w-full md:col-span-2"
                aspectRatio="16/9"
                onClick={() => navigate('/ProductsList')}
                style={{ marginTop: '40px' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CurationImage({ item, className = "", aspectRatio, onClick, style = {} }) {
  return (
    <div
      className={`group cursor-pointer overflow-hidden relative ${className}`}
      style={{ aspectRatio, backgroundColor: theme.colors.backgroundDark, border: `1px solid ${theme.colors.border.light}`, ...style }}
      onClick={onClick}
    >
      <img
        src={item.image}
        alt={item.alt}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
      />
      <div
        className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 flex items-center justify-between w-[calc(100%-64px)]"
        style={{ bottom: '32px', left: '32px', color: theme.colors.text.light }}
      >
        <span className="uppercase tracking-[0.2em] font-light text-[10px]">{item.title}</span>
        <span className="text-[11px] font-light" style={{ opacity: 0.6 }}>View Collection ↗</span>
      </div>
    </div>
  );
}

export default CurationGrid;
