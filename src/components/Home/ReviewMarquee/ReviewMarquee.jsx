import React from "react";
import { reviews } from "../../../static";
import { Marquee } from "../../ui/marquee";
import { cn } from "../../../lib/utils";

function ReviewMarquee() {
  const ReviewCard = ({ img, name, username, body }) => {
    return (
      <figure
        className={cn(
          "relative w-72 overflow-hidden rounded-2xl transition-all duration-300",
          "backdrop-blur-xl border border-white/30",
          "shadow-[0_8px_28px_rgba(0,0,0,0.10)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.14)]",
          "bg-white/40 dark:bg-[#1b1b1b]/40 dark:border-white/10"
        )}
        style={{
          padding: "26px",
          margin: "16px",
        }}
      >
        {/* Subtle top accent */}
        <div
          style={{
            height: "3px",
            width: "50px",
            background: "rgba(255,255,255,0.5)",
            borderRadius: "6px",
            marginBottom: "18px",
          }}
        ></div>

        {/* User Header */}
        <div
          className="flex items-center"
          style={{
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <img
            src={img}
            className="rounded-full object-cover"
            width="50"
            height="50"
            style={{
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          />

          <div className="flex flex-col">
            <span
              className="font-semibold text-gray-900 dark:text-white"
              style={{
                fontSize: "1rem",
              }}
            >
              {name}
            </span>
            <span
              className="text-xs text-gray-500 dark:text-gray-400"
              style={{}}
            >
              @{username}
            </span>
          </div>
        </div>

        {/* Review Text (now uses your site font) */}
        <blockquote
          className="text-gray-800 dark:text-gray-300"
          style={{
            fontSize: "0.95rem",
            lineHeight: "1.55",
            fontWeight: "400",
          }}
        >
          “{body}”
        </blockquote>
      </figure>
    );
  };

  return (
    <div
      className="relative flex w-full flex-col items-center justify-center overflow-hidden"
      style={{
        paddingTop: "70px",
        paddingBottom: "70px",
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,245,245,0.7), rgba(255,255,255,0.9))",
          zIndex: -1,
        }}
      ></div>

      {/* Title (Using your website font now) */}
      <h2
        className="tracking-tight text-gray-900 dark:text-white"
        style={{
          fontSize: "2.3rem",
          marginBottom: "35px",
          paddingBottom: "8px",
          position: "relative",
          fontWeight: "600",
        }}
      >
        Customer Reviews
        <span
          style={{
            position: "absolute",
            width: "70px",
            height: "3px",
            background: "rgba(0,0,0,0.18)",
            borderRadius: "4px",
            left: "50%",
            bottom: "0",
            transform: "translateX(-50%)",
          }}
        ></span>
      </h2>

      {/* Marquees */}
      <Marquee pauseOnHover className="[--duration:18s]">
        {reviews.map((r) => (
          <ReviewCard key={r.username} {...r} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className="[--duration:24s]">
        {reviews.map((r, i) => (
          <ReviewCard key={r.username + i} {...r} />
        ))}
      </Marquee>
    </div>
  );
}

export default ReviewMarquee;
