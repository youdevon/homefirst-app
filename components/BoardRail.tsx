"use client";

import { useEffect, useRef } from "react";

type BoardRailProps = {
  children: React.ReactNode;
};

export default function BoardRail({ children }: BoardRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const updateOverflow = () => {
      rail.classList.toggle(
        "board-rail--overflow",
        rail.scrollWidth > rail.clientWidth + 1,
      );
    };

    updateOverflow();

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(rail);

    return () => observer.disconnect();
  }, [children]);

  return (
    <div ref={railRef} className="board-rail" role="list">
      {children}
    </div>
  );
}
