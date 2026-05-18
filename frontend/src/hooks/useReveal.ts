import { useRef, useEffect } from "react";

type Options = {
  once?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export default function useReveal(options: Options = { once: true }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            if (options.once) observer.unobserve(el);
          } else {
            if (!options.once) el.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: options.threshold ?? 0.12,
        root: options.root ?? null,
        rootMargin: options.rootMargin ?? "0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options.once, options.threshold, options.root, options.rootMargin]);

  return ref;
}
