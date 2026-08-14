"use client";
import { useEffect, useRef, CSSProperties } from "react";

const ease = "cubic-bezier(.22,1,.36,1)";

export function AnimateIn({
  children, delay = 0, from = "bottom", style, className,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "bottom" | "left" | "right" | "scale";
  style?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const map = {
      bottom: "translateY(28px)",
      left: "translateX(-28px)",
      right: "translateX(28px)",
      scale: "scale(0.92)",
    };
    el.style.opacity = "0";
    el.style.transform = map[from];
    el.style.transition = `opacity 0.65s ${ease} ${delay}ms, transform 0.65s ${ease} ${delay}ms`;

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      el.style.opacity = "1";
      el.style.transform = "none";
      io.unobserve(el);
    }, { threshold: 0.08 });

    io.observe(el);
    return () => io.disconnect();
  }, [delay, from]);

  return <div ref={ref} style={style} className={className}>{children}</div>;
}

export function StaggerIn({
  children, baseDelay = 0, stagger = 75, style, className,
}: {
  children: React.ReactNode;
  baseDelay?: number;
  stagger?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    items.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(22px)";
      child.style.transition = `opacity 0.55s ${ease} ${baseDelay + i * stagger}ms, transform 0.55s ${ease} ${baseDelay + i * stagger}ms`;
    });

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      (Array.from((entry.target as HTMLElement).children) as HTMLElement[]).forEach(c => {
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      io.unobserve(entry.target);
    }, { threshold: 0.05 });

    io.observe(el);
    return () => io.disconnect();
  }, [baseDelay, stagger]);

  return <div ref={ref} style={style} className={className}>{children}</div>;
}
