import { useEffect, useRef, useState } from "react";

interface CurvyScrollLineProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Converts a sequence of keypoints into a C1-continuous cubic Bezier SVG path
 * using Catmull-Rom spline interpolation (tension = 0.5).
 */
function catmullRomToBezier(points: Point[]): string {
  if (points.length < 2) return "";
  const p0 = points[0];
  if (!p0) return "";

  let d = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`;
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    const current = points[i]!;
    const next = points[i + 1]!;
    const prev = i > 0 ? points[i - 1]! : current;
    const nextNext = i < n - 2 ? points[i + 2]! : next;

    const cp1x = current.x + (next.x - prev.x) / 6;
    const cp1y = current.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (nextNext.x - current.x) / 6;
    const cp2y = next.y - (nextNext.y - current.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }

  return d;
}

export function CurvyScrollLine({ containerRef }: CurvyScrollLineProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  // Measure container dimensions with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const scrollH = el.scrollHeight || rect.height;
      setDimensions({
        width: rect.width,
        height: Math.max(scrollH, rect.height),
      });
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    window.addEventListener("resize", updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [containerRef]);

  const { width, height } = dimensions;
  const isMobile = width > 0 && width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  // Uniform, elegant stroke width
  const strokeWidth = isMobile ? 2.5 : isTablet ? 3.0 : 3.5;

  // Generate responsive organic path starting from top-left corner and ending touching footer
  // On mobile screens, sweeps across the page in an S-curve similar to desktop version
  let pathD = "";
  if (width > 0 && height > 200) {
    const points: Point[] = [];

    if (isDesktop) {
      // DESKTOP: Sweeping, graceful path entering from top-left off-screen,
      // weaving through outer gutters and section transitions, ending touching footer section.
      points.push(
        { x: -20, y: -15 }, // Top-left corner off-screen
        { x: width * 0.05, y: height * 0.035 }, // Sweeps past Marquee
        { x: width * 0.08, y: height * 0.14 }, // Left gutter of Promises
        { x: width * 0.52, y: height * 0.22 }, // Dips across gap between Promises & Occasions
        { x: width * 0.90, y: height * 0.32 }, // Right gutter of Occasions
        { x: width * 0.48, y: height * 0.46 }, // Sweeps under Occasions across to left
        { x: width * 0.10, y: height * 0.60 }, // Left gutter of Featured Hampers
        { x: width * 0.54, y: height * 0.71 }, // Cuts across gap under Featured
        { x: width * 0.88, y: height * 0.81 }, // Right margin past Hamper Studio
        { x: width * 0.50, y: height * 0.92 }, // Weaves into Bestsellers section
        { x: width * 0.52, y: height } // Ends directly touching footer section
      );
    } else if (isTablet) {
      // TABLET: Balanced amplitude through gutters and interstitial spaces
      points.push(
        { x: -15, y: -10 },
        { x: width * 0.06, y: height * 0.035 },
        { x: width * 0.09, y: height * 0.15 },
        { x: width * 0.88, y: height * 0.25 },
        { x: width * 0.86, y: height * 0.37 },
        { x: width * 0.12, y: height * 0.50 },
        { x: width * 0.10, y: height * 0.62 },
        { x: width * 0.88, y: height * 0.74 },
        { x: width * 0.80, y: height * 0.86 },
        { x: width * 0.50, y: height }
      );
    } else {
      // MOBILE: Flowing S-curve sweeping from side to side across the page similar to desktop,
      // gracefully passing behind the cards and ending touching the footer directly.
      points.push(
        { x: -15, y: -10 }, // Top-left entry
        { x: width * 0.08, y: height * 0.035 }, // Sweeps past Marquee
        { x: width * 0.12, y: height * 0.14 }, // Down left margin
        { x: width * 0.86, y: height * 0.24 }, // Sweeps across under Promises to right
        { x: width * 0.84, y: height * 0.36 }, // Down right margin
        { x: width * 0.14, y: height * 0.48 }, // Sweeps back across to left
        { x: width * 0.12, y: height * 0.60 }, // Down left margin
        { x: width * 0.86, y: height * 0.72 }, // Sweeps across under Featured to right
        { x: width * 0.80, y: height * 0.84 }, // Past Studio CTA
        { x: width * 0.35, y: height * 0.93 }, // Weaves into Bestsellers
        { x: width * 0.50, y: height } // Ends touching the footer section
      );
    }

    pathD = catmullRomToBezier(points);
  }

  // Update total path length
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        setPathLength(len);
      } catch {
        // Fallback if SVG not mounted
      }
    }
  }, [pathD]);

  // Scroll tracking with requestAnimationFrame
  // Synchronized so scroll drawing works identically on mobile and desktop
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const el = containerRef.current;
        if (!el || !pathRef.current) return;

        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;

        // Starts drawing as the content area arrives into view past hero
        const startTrigger = vh * 0.8;
        // Total scroll range calculated so line completes exactly when bottom of content reaches footer
        const totalRange = Math.max(1, rect.height - (vh - startTrigger));
        const scrolledDistance = startTrigger - rect.top;

        const raw = scrolledDistance / totalRange;
        const clamped = Math.max(0, Math.min(1, raw));
        setProgress(clamped);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [containerRef]);

  if (!pathD) return null;

  const currentDashOffset = pathLength ? pathLength * (1 - progress) : 10000;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="size-full"
      >
        {/* Soft, Uniform, Light Theme-Matched Line:
            A delicate, luminous blush-gold ribbon with uniform tone and width across desktop and mobile */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#f8bcc8"
          strokeOpacity="0.65"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength || 10000}
          strokeDashoffset={currentDashOffset}
          style={{
            transition: "stroke-dashoffset 80ms linear",
            filter: "drop-shadow(0 2px 6px rgba(248, 188, 200, 0.35))",
          }}
        />
      </svg>
    </div>
  );
}
