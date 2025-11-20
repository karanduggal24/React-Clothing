import { motion } from "framer-motion";
import { heroSections } from "../../data/homeHeroData";

export default function HomeHeroMobile({ navigate }) {
  return (
    <div className="w-full">
      {heroSections.map((section, index) => (
        <MobileHeroBlock
          key={section.id}
          section={section}
          navigate={navigate}
          index={index}
        />
      ))}
    </div>
  );
}

function MobileHeroBlock({ section, navigate }) {
  return (
    <section
      className="relative w-full flex flex-col overflow-hidden"
      style={{
        minHeight: "90vh",
        backgroundColor: "#ffffff",
      }}
    >
      {/* IMAGE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden"
        style={{
          height: "53vh",
          borderBottomLeftRadius: "22px",
          borderBottomRightRadius: "22px",
        }}
      >
        <img
          src={section.image}
          alt={section.alt}
          className="w-full h-full object-cover"
        />

        {/* Softer premium fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(255,255,255,0.80) 100%)",
          }}
        ></div>
      </motion.div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="flex flex-col"
        style={{
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        {/* BADGE */}
        <div
          className="inline-flex items-center bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full"
          style={{
            padding: "7px 16px",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          <span
            className="bg-white rounded-full"
            style={{
              width: "6px",
              height: "6px",
              marginRight: "6px",
            }}
          ></span>
          New Drop
        </div>

        {/* TITLE */}
        <h2
          className="font-black text-gray-900"
          style={{
            fontSize: "2.2rem",
            lineHeight: "1.15",
            marginBottom: "0.75rem",
          }}
        >
          {section.title}
        </h2>

        {/* DESCRIPTION */}
        <p
          className="text-gray-600"
          style={{
            fontSize: "1rem",
            lineHeight: "1.55",
            marginBottom: "1.5rem",
          }}
        >
          {section.description}
        </p>

        {/* BUTTONS */}
        <div
          className="flex flex-col"
          style={{
            gap: "0.75rem",
            marginTop: "0.25rem",
          }}
        >
          {/* PRIMARY BUTTON */}
          <button
            onClick={() => navigate("/ProductsList")}
            className="w-full bg-black text-white font-bold rounded-lg transition-all duration-300 shadow-md"
            style={{
              paddingTop: "14px",
              paddingBottom: "14px",
              fontSize: "1rem",
            }}
          >
            {section.buttonText || "Shop Now"}
          </button>

          {/* SECONDARY BUTTON */}
          <button
            onClick={() => navigate("/ProductsList")}
            className="w-full bg-white text-black font-bold border-2 border-black rounded-lg transition-all duration-300"
            style={{
              paddingTop: "14px",
              paddingBottom: "14px",
              fontSize: "1rem",
            }}
          >
            View All
          </button>
        </div>
      </motion.div>
    </section>
  );
}
