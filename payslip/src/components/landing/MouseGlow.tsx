import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      animate={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, oklch(0.65 0.24 295 / 0.12), transparent 40%)`,
      }}
      transition={{ type: "tween", ease: "linear", duration: 0.15 }}
    />
  );
}
