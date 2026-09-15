"use client";

import { motion, useScroll } from "motion/react";

/** The page spine. Fills as you scroll; every section hangs off it. */
export function Rail() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="rail" aria-hidden="true">
      <motion.div className="rail-fill" style={{ scaleY: scrollYProgress }} />
    </div>
  );
}
