"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger the direct children (set `--i` on each) instead of animating this element as one unit. */
  stagger?: boolean;
  /** Delay (ms) before this element reveals — ignored when `stagger` is set. */
  delay?: number;
  /** Rendered element — defaults to a div so it can replace an existing wrapper without extra nesting. */
  as?: React.ElementType;
};

/**
 * Subtle fade-up on scroll. The hidden state lives in globals.css, gated behind
 * `prefers-reduced-motion: no-preference`; this just toggles `.is-in` once the
 * element enters the viewport. No dependency, tiny client island.
 */
export function Reveal({ children, className, stagger, delay, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(stagger ? "reveal-stagger" : "reveal", className)}
      style={!stagger && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
