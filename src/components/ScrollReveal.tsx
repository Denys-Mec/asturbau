import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "reveal-up" | "reveal-in" | "fade-in";
  threshold?: number;
  delay?: number; // Delay in milliseconds
}

export function ScrollReveal({
  children,
  className = "",
  animation = "reveal-up",
  threshold = 0.05,
  delay = 0,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Animate only once
        }
      },
      { threshold }
    );

    const currentTarget = domRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [threshold, hasMounted]);

  const animationClass =
    animation === "reveal-up"
      ? "animate-reveal-up"
      : animation === "reveal-in"
      ? "animate-reveal-in"
      : "animate-fade-in";

  return (
    <div
      ref={domRef}
      className={`${className} ${
        hasMounted ? (isVisible ? animationClass : "opacity-0") : ""
      }`}
      style={{
        animationDelay: delay > 0 ? `${delay}ms` : undefined,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}
