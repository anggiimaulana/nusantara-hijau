"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode } from "react";

// ============================================
// EASING CURVES - Premium feel
// ============================================
export const easing = {
  // Smooth deceleration - for entrances
  smooth: [0.4, 0, 0.2, 1],
  // Bouncy - for playful interactions
  bouncy: [0.68, -0.55, 0.265, 1.55],
  // Sharp - for quick transitions
  sharp: [0.4, 0, 0.6, 1],
  // Gentle - for subtle movements
  gentle: [0.25, 0.1, 0.25, 1],
  // Spring-like - for natural feel
  spring: [0.175, 0.885, 0.32, 1.275],
} as const;

// ============================================
// VARIANTS - Predefined animations
// ============================================
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.smooth },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: easing.smooth },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easing.smooth },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easing.smooth },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easing.smooth },
  },
};

// ============================================
// COMPONENTS - Animated wrappers
// ============================================

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: easing.smooth,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInView({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: easing.smooth,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({
  children,
  className = "",
  scale = 1.02,
}: MotionProps & { scale?: number }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CardHover({
  children,
  className = "",
}: MotionProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: easing.smooth },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}

export function PulseRing({
  children,
  className = "",
}: Omit<MotionProps, "delay">) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "var(--green-400)" }}
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.4, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function FloatingElement({
  children,
  className = "",
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({
  children,
  className = "",
}: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: easing.smooth }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: MotionProps & { direction?: "up" | "down" | "left" | "right" }) {
  const directionMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        ease: easing.smooth,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { motion, AnimatePresence };
