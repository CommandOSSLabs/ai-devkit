"use client";

import { useEffect, useState } from "react";

/**
 * Three-valued on purpose: `null` means "not measured yet". A boolean default
 * would make the first client render commit to a layout before matchMedia has
 * reported the viewport, and anything that syncs the URL would then act on
 * that guess.
 *
 * Both signals are listened for, because a missed `change` leaves the layout
 * committed to a viewport that no longer exists. `resize` fires on every
 * viewport change, and React drops the update when the boolean is unchanged,
 * so the redundancy is nearly free.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [query]);

  return matches;
}
