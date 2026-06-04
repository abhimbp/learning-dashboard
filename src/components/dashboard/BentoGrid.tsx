"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[200px] w-full",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export function BentoTile({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      className={cn(
        "glass-panel glow-border rounded-3xl p-6 relative overflow-hidden flex flex-col",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
