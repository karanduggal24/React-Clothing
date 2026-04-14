import { useState, useEffect } from "react";

/**
 * Returns true when the viewport matches the given media query
 * Usage: const isMobile = useMediaQuery("(max-width: 767px)")
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default useMediaQuery;
