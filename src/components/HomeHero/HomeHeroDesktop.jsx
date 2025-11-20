import { motion, useMotionValue, useTransform } from "framer-motion";
import { heroSections } from "../../data/homeHeroData";

export default function HomeHeroDesktop({ navigate }) {
  return (
    <div className="w-full">
      {heroSections.map((section) => (
        <HeroBlock key={section.id} section={section} navigate={navigate} />
      ))}
    </div>
  );
}

function HeroBlock({ section, navigate }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);
  const scale = useTransform(y, [-100, 100], [1.05, 1.1]);

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
    >
      {/* BACKGROUND */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${section.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          rotateX,
          rotateY,
          scale,
          filter: "brightness(60%) contrast(1.1)",
          willChange: "transform, filter",
        }}
      />

      {/* GRADIENT OVERLAY */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      {/* MAIN GRID */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-7xl w-full grid grid-cols-2 gap-10 items-center"
        style={{ paddingTop: "4rem", paddingBottom: "4rem", zIndex: 20 }}
      >
        {/* LEFT CONTENT */}
        <div className="text-white space-y-6" style={{ zIndex: 21 }}>
          <motion.h1
            variants={textUp}
            className="font-extrabold tracking-tight text-6xl"
          >
            {section.title}
          </motion.h1>

          <motion.p
            variants={textUp}
            className="text-gray-200 leading-relaxed max-w-lg text-xl"
          >
            {section.description}
          </motion.p>

          <motion.div
            variants={fadeStagger}
            className="flex gap-4"
            style={{ paddingTop: "0.5rem", zIndex: 22 }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/ProductsList")}
              className="bg-white text-black font-semibold rounded-full shadow-xl hover:bg-gray-200 transition-all"
              style={{
                paddingTop: "14px",
                paddingBottom: "14px",
                paddingLeft: "40px",
                paddingRight: "40px",
                zIndex: 22,
              }}
            >
              Shop Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/ProductsList")}
              className="border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all"
              style={{
                paddingTop: "14px",
                paddingBottom: "14px",
                paddingLeft: "40px",
                paddingRight: "40px",
                zIndex: 22,
              }}
            >
              Explore
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT IMAGE CARD */}
        <motion.div variants={floatCard} className="relative" style={{ zIndex: 21 }}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-white/20"
          >
            <img
              src={section.image}
              alt={section.alt}
              className="w-full h-[500px] object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

const textUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delay: 0.3, staggerChildren: 0.12 },
  },
};

const floatCard = {
  hidden: { opacity: 0, x: 50, y: 40 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { delay: 0.4, duration: 0.8, ease: "easeOut" },
  },
};
