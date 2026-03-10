"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
}

export default function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  containerClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  onError,
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Generate placeholder with initials from alt text
  const getInitials = (text: string) => {
    return text
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading Skeleton */}
      <AnimatePresence>
        {isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "var(--bg-muted)" }}
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2"
            >
              <Leaf className="w-8 h-8" style={{ color: "var(--green-300)" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {hasError && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: "var(--bg-muted)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
            style={{ background: "var(--green-100)" }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: "var(--green-600)" }}
            >
              {getInitials(alt)}
            </span>
          </div>
          <span className="text-xs text-center px-4" style={{ color: "var(--text-muted)" }}>
            {alt}
          </span>
        </div>
      )}

      {/* Actual Image */}
      {!hasError && (
        fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
            sizes={sizes}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
          />
        )
      )}
    </div>
  );
}

// Blur placeholder component
export function BlurPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        background: "linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-subtle) 50%, var(--bg-muted) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}
