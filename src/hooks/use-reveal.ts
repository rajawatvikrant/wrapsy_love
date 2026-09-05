import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Scroll-reveal for any element carrying [data-reveal] inside the given root
 * (or the whole document when no ref is passed).
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      items.forEach((el) => {
        const dir = el.dataset["reveal"] || "up";
        const from: gsap.TweenVars = { opacity: 0, duration: 0.9, ease: "power3.out" };
        if (dir === "up") from["y"] = 42;
        if (dir === "left") from["x"] = -48;
        if (dir === "right") from["x"] = 48;
        if (dir === "scale") from["scale"] = 0.92;
        gsap.from(el, {
          ...from,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
        gsap.from(Array.from(group.children), {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
