import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Halaman Tidak Ditemukan | NusantaraHijau",
};

function LeafDecor({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg className={className} style={{ transform: `rotate(${rotate}deg)` }} viewBox="0 0 80 80" fill="none">
      <path
        d="M40 8C25 20 12 35 18 50C24 65 40 72 40 72C40 72 56 65 62 50C68 35 55 20 40 8Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path d="M40 8C40 8 40 30 40 72" stroke="currentColor" strokeWidth="1.5" opacity="0.18" strokeDasharray="3 3" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-50" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(46,125,50,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Floating leaves */}
      <div className="absolute top-16 left-10 text-green-300 opacity-60 animate-float hidden md:block">
        <LeafDecor className="w-36 h-36" rotate={-15} />
      </div>
      <div className="absolute bottom-20 right-10 text-teal-300 opacity-50 animate-float-reverse hidden md:block">
        <LeafDecor className="w-24 h-24" rotate={140} />
      </div>
      <div className="absolute top-1/3 right-20 text-green-200 opacity-40 animate-float hidden lg:block">
        <LeafDecor className="w-16 h-16" rotate={60} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-lg mx-auto">
        {/* 404 display */}
        <div className="mb-7">
          <div
            className="text-[7rem] sm:text-[9rem] font-bold leading-none select-none"
            style={{
              fontFamily: "var(--font-playfair), serif",
              background:
                "linear-gradient(135deg, rgba(46,125,50,0.15), rgba(38,166,154,0.10))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </div>
        </div>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6"
          style={{
            background: "rgba(46,125,50,0.08)",
            border: "1px solid rgba(46,125,50,0.18)",
          }}
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--green-400)" }}>
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5C12.83 6.63 10.55 7 8 7C8.21 5.71 8 4 4 3c0 0 8-2 13 5z" />
          </svg>
        </div>

        <h1
          className="font-bold mb-3"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Halaman Tidak Ditemukan
        </h1>

        <p
          className="text-sm sm:text-base leading-relaxed mb-8 max-w-xs mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Seperti spesies yang punah, halaman ini tidak bisa kami temukan. Yuk balik ke beranda dan jelajahi kekayaan hayati Nusantara!
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary px-6 py-3 text-sm inline-flex justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Beranda
          </Link>
          <Link
            href="/species"
            className="btn-outline px-6 py-3 text-sm inline-flex justify-center"
          >
            Jelajahi Spesies
          </Link>
        </div>

        {/* Fun note */}
        <p
          className="mt-10 text-xs"
          style={{ color: "var(--text-faint)" }}
        >
          Kesalahan 404 · NusantaraHijau · Atlas Keanekaragaman Hayati Indonesia
        </p>
      </div>
    </div>
  );
}
