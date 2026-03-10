"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle,
    Clock,
    ExternalLink,
    Globe,
    Heart,
    Instagram,
    Leaf,
    Mail,
    Send
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ============================================
// DATA & ANIMATION VARIANTS
// ============================================
const CONSERVATION_LINKS = [
  { name: "WWF Indonesia", desc: "Program konservasi satwa & habitat", url: "https://www.wwf.id", color: "#27AE60" },
  { name: "IUCN Red List", desc: "Database status konservasi global", url: "https://iucnredlist.org", color: "#E74C3C" },
  { name: "Into The Light Indonesia", desc: "Organisasi konservasi & lingkungan", url: "https://intothelightid.org", color: "#3498DB" },
  { name: "BKSDA Online", desc: "Laporkan perburuan & perdagangan liar", url: "https://bksda.menlhk.go.id", color: "#E67E22" },
];

const TOPICS = [
  "Pertanyaan umum",
  "Koreksi data spesies",
  "Kolaborasi & kemitraan",
  "Saran fitur",
  "Laporan bug / masalah teknis",
  "Lainnya",
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

// ============================================
// CONTACT FORM
// ============================================
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!form.email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Format email tidak valid";
    if (!form.topic) newErrors.topic = "Pilih topik terlebih dahulu";
    if (!form.message.trim()) newErrors.message = "Pesan wajib diisi";
    else if (form.message.trim().length < 20) newErrors.message = "Pesan minimal 20 karakter";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setStatus("loading");
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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div
            className="w-18 h-18 rounded-full flex items-center justify-center mb-5"
            style={{ background: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.25)" }}
          >
            <CheckCircle className="w-9 h-9" style={{ color: "var(--green-500)" }} />
          </div>
          <h3 className="font-bold text-2xl mb-2" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}>
            Pesan Terkirim! 🎉
          </h3>
          <p className="text-sm max-w-xs mb-7 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Terima kasih telah menghubungi kami. Kami akan membalas pesanmu dalam 1–3 hari kerja.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80 shadow-sm"
            style={{ background: "rgba(46,204,113,0.10)", border: "1px solid rgba(46,204,113,0.22)", color: "var(--green-600)" }}
          >
            Kirim pesan lagi
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  const inputStyle = (field: string) => ({
    background: errors[field] ? "rgba(231,76,60,0.03)" : "rgba(255,255,255,0.6)",
    border: `1.5px solid ${errors[field] ? "rgba(231,76,60,0.45)" : "var(--border-light)"}`,
    color: "var(--text-primary)",
    outline: "none",
    transition: "all 0.3s ease",
  });

  return (
    <div className="space-y-6">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            Nama <span style={{ color: "#E74C3C" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Nama kamu"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 ring-green-500/10"
            style={inputStyle("name")}
            onFocus={(e) => { if (!errors.name) { e.target.style.borderColor = "var(--green-400)"; e.target.style.background = "white"; } }}
            onBlur={(e) => { e.target.style.borderColor = errors.name ? "rgba(231,76,60,0.45)" : "var(--border-light)"; e.target.style.background = errors.name ? "rgba(231,76,60,0.03)" : "rgba(255,255,255,0.6)"; }}
          />
          {errors.name && (
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#E74C3C" }}>
              <AlertCircle className="w-3 h-3" /> {errors.name}
            </p>
          )}
        </div>
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            Email <span style={{ color: "#E74C3C" }}>*</span>
          </label>
          <input
            type="email"
            placeholder="email@kamu.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 ring-green-500/10"
            style={inputStyle("email")}
            onFocus={(e) => { if (!errors.email) { e.target.style.borderColor = "var(--green-400)"; e.target.style.background = "white"; } }}
            onBlur={(e) => { e.target.style.borderColor = errors.email ? "rgba(231,76,60,0.45)" : "var(--border-light)"; e.target.style.background = errors.email ? "rgba(231,76,60,0.03)" : "rgba(255,255,255,0.6)"; }}
          />
          {errors.email && (
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#E74C3C" }}>
              <AlertCircle className="w-3 h-3" /> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          Topik <span style={{ color: "#E74C3C" }}>*</span>
        </label>
        <select
          value={form.topic}
          onChange={(e) => handleChange("topic", e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-4 ring-green-500/10"
          style={{ ...inputStyle("topic"), color: form.topic ? "var(--text-primary)" : "var(--text-muted)" }}
        >
          <option value="" disabled>Pilih topik...</option>
          {TOPICS.map((t) => (
            <option key={t} value={t} style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}>
              {t}
            </option>
          ))}
        </select>
        {errors.topic && (
          <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#E74C3C" }}>
            <AlertCircle className="w-3 h-3" /> {errors.topic}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          Pesan <span style={{ color: "#E74C3C" }}>*</span>
        </label>
        <textarea
          placeholder="Tulis pesanmu di sini... (min. 20 karakter)"
          rows={6}
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl text-sm resize-none focus:outline-none focus:ring-4 ring-green-500/10"
          style={inputStyle("message")}
          onFocus={(e) => { if (!errors.message) { e.target.style.borderColor = "var(--green-400)"; e.target.style.background = "white"; } }}
          onBlur={(e) => { e.target.style.borderColor = errors.message ? "rgba(231,76,60,0.45)" : "var(--border-light)"; e.target.style.background = errors.message ? "rgba(231,76,60,0.03)" : "rgba(255,255,255,0.6)"; }}
        />
        <div className="flex items-center justify-between mt-2">
          {errors.message ? (
            <p className="text-xs flex items-center gap-1" style={{ color: "#E74C3C" }}>
              <AlertCircle className="w-3 h-3" /> {errors.message}
            </p>
          ) : <span />}
          <span
            className="text-xs font-semibold"
            style={{ color: form.message.length >= 20 ? "var(--green-500)" : "var(--text-muted)" }}
          >
            {form.message.length}/20
          </span>
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2.5 py-4 font-bold rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group"
        style={{
          background: "linear-gradient(135deg, var(--green-600), var(--green-500))",
          color: "white",
          boxShadow: "0 8px 20px rgba(22, 163, 74, 0.25)",
        }}
      >
        {status === "loading" ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Mengirim Pesan...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            Kirim Pesan Sekarang
          </>
        )}
      </motion.button>
    </div>
  );
}

// ============================================
// CONTACT PAGE
// ============================================
export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 overflow-hidden" style={{ background: "var(--bg-base)" }}>

      {/* ===== HEADER ===== */}
      <section className="relative container-main px-4 mb-32 pt-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center relative z-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Mail className="w-4 h-4" style={{ color: "var(--green-600)" }} />
            <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "var(--green-700)" }}>
              Hubungi Kami
            </span>
          </motion.div>
          
          <motion.h1
            variants={fadeUp}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontFamily: "var(--font-playfair), serif",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
            className="font-bold mb-6"
          >
            Ada yang Ingin{" "}
            <span style={{ color: "var(--green-700)" }}>Kamu Sampaikan?</span>
          </motion.h1>
          
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Kami terbuka untuk pertanyaan umum, saran fitur, koreksi data spesies, maupun peluang kolaborasi. Setiap masukan membantu NusantaraHijau menjadi leksikon digital yang lebih baik.
          </motion.p>
        </motion.div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="container-main px-4 mb-32">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12"
        >
          {/* Form (3/5) */}
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <div
              className="p-8 sm:p-10 lg:p-12 rounded-[2rem] relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--border-light)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-[4px]"
                style={{ background: "linear-gradient(90deg, var(--green-600), var(--green-400), var(--teal-400))" }}
              />
              <h2
                className="text-2xl font-bold mb-8"
                style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
              >
                Kirim Pesan
              </h2>
              <ContactForm />
            </div>
          </motion.div>

          {/* Sidebar (2/5) */}
          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-5">
            {/* Direct contact */}
            <div
              className="p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-lg transition-shadow duration-500"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
              
              <h3
                className="font-bold text-xl mb-6 relative z-10"
                style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}
              >
                Kontak Langsung
              </h3>
              
              <div className="space-y-4 relative z-10">
                <a
                  href="mailto:nusantarahijau@example.com"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group/link hover:-translate-y-1"
                  style={{ background: "white", border: "1px solid var(--border-light)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <Mail className="w-5 h-5" style={{ color: "var(--green-600)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Email Kami</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>nusantarahijau@example.com</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group/link hover:-translate-y-1"
                  style={{ background: "white", border: "1px solid var(--border-light)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: "rgba(225,48,108,0.1)" }}>
                    <Instagram className="w-5 h-5" style={{ color: "#e1306c" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Instagram</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>@nusantarahijau</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Info boxes */}
            <div
              className="p-6 rounded-2xl flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.1)" }}>
                <CheckCircle className="w-5 h-5" style={{ color: "var(--green-600)" }} />
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>Saranmu Berarti</p>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Setiap laporan bug dan koreksi data akan langsung kami tinjau untuk perbaikan.
                </p>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.15)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.1)" }}>
                <Clock className="w-5 h-5" style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>Waktu Respons</p>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Balasan normalnya memakan waktu <strong>1–3 hari kerja</strong>.
                </p>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </section>

      {/* ===== KONSERVASI LINKS ===== */}
      <section
        className="py-32 mb-32 relative overflow-hidden"
        style={{
          background: "var(--bg-muted)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        
        <div className="container-main px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-[0.15em] uppercase mb-4" style={{ color: "var(--green-600)" }}>
              Ambil Aksi Nyata
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-bold mb-4"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontFamily: "var(--font-playfair), serif",
                color: "var(--text-primary)",
                lineHeight: "1.1",
              }}
            >
              Link Konservasi{" "}
              <span style={{ color: "var(--green-700)" }}>Terpercaya</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Dukung upaya konservasi flora dan fauna secara langsung melalui organisasi dan platform resmi pilihan kami.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {CONSERVATION_LINKS.map((link) => (
              <motion.a
                variants={fadeUp}
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-[2rem] block transition-all duration-300 relative overflow-hidden"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${link.color}, transparent)` }}
                />
                
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${link.color}15` }}>
                    <Globe className="w-6 h-6" style={{ color: link.color }} />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                
                <h3 className="font-bold text-lg mb-2 relative z-10" style={{ fontFamily: "var(--font-playfair), serif", color: "var(--text-primary)" }}>
                  {link.name}
                </h3>
                <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--text-secondary)" }}>
                  {link.desc}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="container-main px-4">
        <motion.div
           initial={{ opacity: 0, y: 36, scale: 0.97 }}
           whileInView={{ opacity: 1, y: 0, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           className="relative rounded-[2.5rem] overflow-hidden p-12 lg:p-20 text-center"
           style={{
             background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
             boxShadow: "0 20px 40px rgba(4,120,87,0.15)",
           }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-8 shadow-inner"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Heart className="w-6 h-6 text-white" />
            </div>
            
            <h2
              className="font-bold mb-5 text-white"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontFamily: "var(--font-playfair), serif",
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
              }}
            >
              Bersama Kita Jaga{" "}
              Nusantara
            </h2>
            
            <p className="text-base sm:text-lg mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>
              Mari tingkatkan literasi keanekaragaman hayati. Bagikan informasi penting dari portal kami kepada teman, keluarga, dan kolega.
            </p>
            
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block w-full sm:w-auto">
              <Link
                href="/species"
                className="inline-flex items-center justify-center w-full gap-2 px-10 py-4 font-bold rounded-full transition-all duration-300 group"
                style={{ background: "white", color: "#064e3b", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
              >
                <Leaf className="w-5 h-5" />
                Jelajahi Spesies
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
