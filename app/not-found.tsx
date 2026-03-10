import Link from "next/link";
import { Leaf, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-base)" }}>
      <div className="text-center max-w-md">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div
            className="text-[10rem] font-bold leading-none opacity-10 select-none"
            style={{
              fontFamily: "var(--font-playfair), serif",
              color: "var(--green-500)",
            }}
          >
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--green-50)", border: "1px solid var(--green-200)" }}
            >
              <Search className="w-9 h-9" style={{ color: "var(--green-500)" }} />
            </div>
          </div>
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Sepertinya spesies yang kamu cari tidak ada di sini. Mungkin sudah
          punah... atau URL-nya salah. 😅
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              color: "var(--text-secondary)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/species"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl hover:scale-105 transition-all btn-primary"
          >
            <Leaf className="w-4 h-4" />
            Jelajahi Spesies
          </Link>
        </div>
      </div>
    </div>
  );
}
