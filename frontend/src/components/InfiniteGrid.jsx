import React, { useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

/**
 * AnimatedGridBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * A full-size, pointer-aware background layer that renders an infinitely
 * scrolling grid with a mouse-reveal mask and soft ambient blobs.
 *
 * Usage: wrap any page/layout with this component as an absolute background.
 *
 * Props:
 *   className  – extra classes on the outermost wrapper (optional)
 *   children   – the page content to render on top (optional)
 */
export const AnimatedGridBackground = ({ className, children }) => {
  const containerRef = useRef(null);

  // Use a unique ID so multiple instances on the same page don't share <pattern> ids
  const uid = useId().replace(/:/g, "");
  const patternId = `grid-${uid}`;

  // Mouse tracking
  const mouseX = useMotionValue(-9999);   // start off-screen so mask is not visible
  const mouseY = useMotionValue(-9999);

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  // Infinitely scrolling grid offset
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative w-full min-h-screen overflow-hidden", className)}
    >
      {/* ── Base grid (very faint, always visible) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.04]">
        <GridPattern patternId={patternId} offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      {/* ── Highlighted grid revealed under cursor ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-50 dark:opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern patternId={patternId} offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* ── Ambient colour blobs ── */}
      {/* Light mode: vibrant; Dark mode: matches reference screenshot */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Top-right orange/amber blob */}
        <div className="absolute right-[-20%] top-[-20%] h-[40%] w-[40%] rounded-full bg-orange-400/50 blur-[130px] dark:bg-orange-700/40" />
        {/* Top-right warm accent secondary blob – light only */}
        <div className="absolute right-[10%] top-[-10%] h-[20%] w-[20%] rounded-full bg-[var(--color-primary)]/40 blur-[100px] dark:bg-orange-800/25" />
        {/* Bottom-left blue/indigo blob */}
        <div className="absolute bottom-[-20%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/50 blur-[130px] dark:bg-blue-700/35" />
        {/* Bottom-left indigo depth blob – dark only */}
        <div className="absolute bottom-[-10%] left-[5%] h-[25%] w-[25%] rounded-full bg-transparent blur-[100px] dark:bg-indigo-800/25" />
      </div>

      {/* ── Page content ── */}
      {children && (
        <div className="relative z-10 w-full">
          {children}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper: SVG grid pattern
// ─────────────────────────────────────────────────────────────────────────────
const GridPattern = ({ patternId, offsetX, offsetY }) => (
  <svg className="h-full w-full">
    <defs>
      <motion.pattern
        id={patternId}
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        x={offsetX}
        y={offsetY}
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          /* 
            Light mode → slate-400 (visible against white/light-grey bg)
            Dark  mode → slate-600 (visible against dark bg)
          */
          className="text-slate-400 dark:text-slate-600"
        />
      </motion.pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
  </svg>
);
