import Link from "next/link";
import { Leaf, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div
            className="text-[10rem] font-bold leading-none opacity-5 select-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2ECC71",
            }}
          >
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#2ECC71]/10 border border-[#2ECC71]/20 flex items-center justify-center">
              <Search className="w-9 h-9 text-[#2ECC71]" />
            </div>
          </div>
        </div>

        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[#90A4AE] text-sm mb-8 leading-relaxed">
          Sepertinya spesies yang kamu cari tidak ada di sini. Mungkin sudah
          punah... atau URL-nya salah. 😅
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/species"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white text-sm font-semibold rounded-xl hover:scale-105 transition-all shadow-lg shadow-green-900/20"
          >
            <Leaf className="w-4 h-4" />
            Jelajahi Spesies
          </Link>
        </div>
      </div>
    </div>
  );
}
