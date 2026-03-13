"use client";

import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QuizButton() {
  const pathname = usePathname();

  // Hide the floating button on the quiz page itself
  if (pathname === "/quiz") return null;

  return (
    <Link
      href="/quiz"
      className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 group flex items-center justify-center"
      aria-label="Mainkan Quiz Flora & Fauna"
    >
      <MessageCircleQuestion className="w-7 h-7" />
      <span className="absolute right-full mr-4 bg-white text-emerald-900 px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none">
        Uji Pengetahuanmu!
      </span>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
      </span>
    </Link>
  );
}
