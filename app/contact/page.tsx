"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Instagram,
  ExternalLink,
  Leaf,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Heart,
  ArrowRight,
  Globe,
} from "lucide-react";

// ============================================
// DATA
// ============================================
const CONSERVATION_LINKS = [
  {
    name: "WWF Indonesia",
    desc: "Program konservasi satwa & habitat",
    url: "https://www.wwf.id",
    color: "#27AE60",
  },
  {
    name: "IUCN Red List",
    desc: "Database status konservasi global",
    url: "https://iucnredlist.org",
    color: "#E74C3C",
  },
  {
    name: "Into The Light Indonesia",
    desc: "Organisasi konservasi & lingkungan",
    url: "https://intothelightid.org",
    color: "#3498DB",
  },
  {
    name: "BKSDA Online",
    desc: "Laporkan perburuan & perdagangan liar",
    url: "https://bksda.menlhk.go.id",
    color: "#E67E22",
  },
];

const TOPICS = [
  "Pertanyaan umum",
  "Koreksi data spesies",
  "Kolaborasi & kemitraan",
  "Saran fitur",
  "Laporan bug / masalah teknis",
  "Lainnya",
];

// ============================================
// CONTACT FORM
// ============================================
function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!form.email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Format email tidak valid";
    if (!form.topic) newErrors.topic = "Pilih topik terlebih dahulu";
    if (!form.message.trim()) newErrors.message = "Pesan wajib diisi";
    else if (form.message.trim().length < 20)
      newErrors.message = "Pesan minimal 20 karakter";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStatus("loading");

    // Simulate submission (ganti dengan API call nyata jika diperlukan)
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setForm({ name: "", email: "", topic: "", message: "" });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#2ECC71]/15 border border-[#2ECC71]/25 flex items-center justify-center mb-5">
          <CheckCircle className="w-8 h-8 text-[#2ECC71]" />
        </div>
        <h3
          className="text-white font-bold text-2xl mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Pesan Terkirim!
        </h3>
        <p className="text-[#90A4AE] text-sm max-w-xs mb-6 leading-relaxed">
          Terima kasih telah menghubungi kami. Kami akan membalas pesanmu dalam
          1-3 hari kerja.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-5 py-2.5 rounded-xl bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#2ECC71] text-sm font-medium hover:bg-[#2ECC71]/20 transition-all"
        >
          Kirim pesan lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-[#90A4AE] text-xs font-medium uppercase tracking-wider mb-2">
            Nama <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            placeholder="Nama kamu"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-[#060E1A] border text-white placeholder-[#546E7A] text-sm focus:outline-none transition-all duration-200 ${
              errors.name
                ? "border-[#E74C3C]/50 focus:border-[#E74C3C]/70"
                : "border-white/8 focus:border-[#2ECC71]/40"
            }`}
          />
          {errors.name && (
            <p className="text-[#E74C3C] text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[#90A4AE] text-xs font-medium uppercase tracking-wider mb-2">
            Email <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="email"
            placeholder="email@kamu.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-[#060E1A] border text-white placeholder-[#546E7A] text-sm focus:outline-none transition-all duration-200 ${
              errors.email
                ? "border-[#E74C3C]/50 focus:border-[#E74C3C]/70"
                : "border-white/8 focus:border-[#2ECC71]/40"
            }`}
          />
          {errors.email && (
            <p className="text-[#E74C3C] text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="block text-[#90A4AE] text-xs font-medium uppercase tracking-wider mb-2">
          Topik <span className="text-[#E74C3C]">*</span>
        </label>
        <select
          value={form.topic}
          onChange={(e) => handleChange("topic", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl bg-[#060E1A] border text-sm focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
            errors.topic
              ? "border-[#E74C3C]/50 focus:border-[#E74C3C]/70 text-white"
              : "border-white/8 focus:border-[#2ECC71]/40"
          } ${form.topic ? "text-white" : "text-[#546E7A]"}`}
        >
          <option value="" disabled>
            Pilih topik...
          </option>
          {TOPICS.map((t) => (
            <option key={t} value={t} className="bg-[#0D1B2E] text-white">
              {t}
            </option>
          ))}
        </select>
        {errors.topic && (
          <p className="text-[#E74C3C] text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.topic}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-[#90A4AE] text-xs font-medium uppercase tracking-wider mb-2">
          Pesan <span className="text-[#E74C3C]">*</span>
        </label>
        <textarea
          placeholder="Tulis pesanmu di sini... (min. 20 karakter)"
          rows={5}
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl bg-[#060E1A] border text-white placeholder-[#546E7A] text-sm focus:outline-none transition-all duration-200 resize-none ${
            errors.message
              ? "border-[#E74C3C]/50 focus:border-[#E74C3C]/70"
              : "border-white/8 focus:border-[#2ECC71]/40"
          }`}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.message ? (
            <p className="text-[#E74C3C] text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ${form.message.length < 20 ? "text-[#546E7A]" : "text-[#2ECC71]"}`}
          >
            {form.message.length}/20
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-semibold rounded-xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-green-900/20"
      >
        {status === "loading" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Kirim Pesan
          </>
        )}
      </button>
    </div>
  );
}

// ============================================
// CONTACT PAGE
// ============================================
export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* ==================== HEADER ==================== */}
      <section className="section-container px-4 mb-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2ECC71]/20 bg-[#2ECC71]/5 mb-5">
            <Mail className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase">
              Hubungi Kami
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ada yang Ingin
            <span className="gradient-text"> Kamu Sampaikan?</span>
          </h1>
          <p className="text-[#90A4AE] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Kami terbuka untuk pertanyaan, saran, koreksi data, atau kolaborasi.
            Setiap masukan membantu NusantaraHijau menjadi lebih baik.
          </p>
        </div>
      </section>

      {/* ==================== MAIN CONTENT ==================== */}
      <section className="section-container px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form (3/5) */}
          <div className="lg:col-span-3">
            <div className="p-6 sm:p-8 rounded-3xl border border-white/6 bg-[#0D1B2E]">
              <h2
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Kirim Pesan
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Sidebar (2/5) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Direct contact */}
            <div className="p-5 rounded-2xl border border-white/6 bg-[#0D1B2E]">
              <h3
                className="text-white font-bold text-base mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Kontak Langsung
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:nusantarahijau@example.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-[#2ECC71]/20 hover:bg-[#2ECC71]/5 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#2ECC71]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#2ECC71]" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium group-hover:text-[#2ECC71] transition-colors">
                      nusantarahijau@example.com
                    </p>
                    <p className="text-[#546E7A] text-xs">
                      Balas dalam 1-3 hari kerja
                    </p>
                  </div>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-[#E1306C]/20 hover:bg-[#E1306C]/5 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#E1306C]/10 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-4 h-4 text-[#E1306C]" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium group-hover:text-[#E1306C] transition-colors">
                      @nusantarahijau
                    </p>
                    <p className="text-[#546E7A] text-xs">
                      Follow untuk update terbaru
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Response time */}
            <div className="p-5 rounded-2xl bg-[#2ECC71]/6 border border-[#2ECC71]/15">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2ECC71]/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-1">
                    Kami baca setiap pesan
                  </p>
                  <p className="text-[#90A4AE] text-xs leading-relaxed">
                    Meski tidak selalu bisa membalas semuanya, setiap saran dan
                    koreksi data akan kami pertimbangkan untuk perbaikan
                    NusantaraHijau.
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="p-5 rounded-2xl border border-white/6 bg-[#0D1B2E]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#2ECC71]" />
                <span className="text-white text-sm font-semibold">
                  Dibuat di Indonesia
                </span>
              </div>
              <p className="text-[#90A4AE] text-xs leading-relaxed">
                NusantaraHijau dibuat oleh mahasiswa Indonesia untuk masyarakat
                Indonesia dan dunia, dalam rangka TECHSOFT 2026.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== KONSERVASI LINKS ==================== */}
      <section className="py-16 border-y border-white/5 bg-[#060E1A]/50 mb-16">
        <div className="section-container px-4">
          <div className="text-center mb-10">
            <p className="text-[#2ECC71] text-xs font-semibold tracking-widest uppercase mb-3">
              Ambil Aksi Nyata
            </p>
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Link Konservasi
              <span className="gradient-text"> Terpercaya</span>
            </h2>
            <p className="text-[#90A4AE] text-sm max-w-md mx-auto">
              Bergabunglah dengan gerakan konservasi melalui
              organisasi-organisasi berikut yang bekerja nyata di lapangan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONSERVATION_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-white/6 bg-[#0D1B2E] hover:border-white/12 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${link.color}15` }}
                  >
                    <Globe className="w-4 h-4" style={{ color: link.color }} />
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#546E7A] group-hover:text-[#2ECC71] transition-colors" />
                </div>
                <h3
                  className="text-white font-bold text-sm mb-1.5 group-hover:text-[#2ECC71] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {link.name}
                </h3>
                <p className="text-[#90A4AE] text-xs leading-relaxed">
                  {link.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="section-container px-4">
        <div className="relative rounded-3xl overflow-hidden border border-[#2ECC71]/10 bg-gradient-to-br from-[#0D1B2E] to-[#060E1A] p-10 text-center">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(46,204,113,0.07) 0%, transparent 65%)",
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E74C3C]/10 border border-[#E74C3C]/20 mb-4 mx-auto">
              <Heart className="w-6 h-6 text-[#E74C3C]" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Bersama Kita Jaga
              <span className="gradient-text"> Nusantara</span>
            </h2>
            <p className="text-[#90A4AE] text-sm max-w-sm mx-auto mb-6">
              Sebelum menutup halaman ini, luangkan waktu sebentar untuk
              mengenal satu spesies baru dari Indonesia.
            </p>
            <Link
              href="/species"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-900/20"
            >
              <Leaf className="w-4 h-4" />
              Jelajahi Spesies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
