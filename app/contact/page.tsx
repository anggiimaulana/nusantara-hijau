"use client";

import { submitContactForm } from "../actions/contact";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  Instagram,
  Leaf,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

// ─── Data ─────────────────────────────────────
const TOPICS = [
  "Pertanyaan umum", "Koreksi data spesies", "Kolaborasi & kemitraan",
  "Saran fitur", "Laporan bug / teknis", "Lainnya",
];
const CONSERVATION_LINKS = [
  { name: "WWF Indonesia", desc: "Program konservasi satwa & habitat", url: "https://www.wwf.id", color: "var(--pg-mint)" },
  { name: "IUCN Red List", desc: "Database status konservasi global", url: "https://iucnredlist.org", color: "var(--pg-accent)" },
  { name: "BKSDA Online", desc: "Laporkan perburuan & perdagangan liar", url: "https://bksda.menlhk.go.id", color: "var(--pg-pink)" },
  { name: "iNaturalist ID", desc: "Citizen science keanekaragaman hayati", url: "https://inaturalist.org", color: "var(--pg-amber)" },
];
const CONTACT_INFO = [
  { icon: <Mail className="w-4 h-4" strokeWidth={2.5} />, label: "Email", value: "halo@nusantarahijau.id", color: "var(--pg-accent)" },
  { icon: <Clock className="w-4 h-4" strokeWidth={2.5} />, label: "Respons", value: "1–2 hari kerja", color: "var(--pg-mint)" },
  { icon: <Globe className="w-4 h-4" strokeWidth={2.5} />, label: "Platform", value: "TECHSOFT 2026", color: "var(--pg-amber)" },
  { icon: <Instagram className="w-4 h-4" strokeWidth={2.5} />, label: "Instagram", value: "@nusantarahijau", color: "var(--pg-pink)" },
];

// ─── Animations ───────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

// ─── Form ─────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email tidak valid";
    if (!form.topic) e.topic = "Pilih topik";
    if (form.message.trim().length < 20) e.message = "Minimal 20 karakter";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    startTransition(async () => {
      try {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        const res = await submitContactForm(fd);
        setStatus(res.success ? "success" : "error");
      } catch { setStatus("error"); }
    });
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "var(--pg-mint)", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
        >
          <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
        </motion.div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          Pesan Terkirim! 🎉
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Terima kasih, {form.name}. Kami akan merespons dalam 1–2 hari kerja.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", topic: "", message: "" }); }}
          className="btn-outline-pg text-sm py-2.5 px-6"
        >
          Kirim pesan lain
        </button>
      </motion.div>
    );
  }

  const fieldBase: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: "12px", fontSize: "14px",
    background: "var(--pg-bg)", border: "2px solid var(--border-hard)", color: "var(--text-primary)",
    outline: "none", fontFamily: "var(--font-body)",
    boxShadow: "3px 3px 0px var(--border-hard)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="label-pg">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Nama kamu"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={fieldBase}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--pg-accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-hard)"; e.currentTarget.style.boxShadow = "3px 3px 0px var(--border-hard)"; }}
          />
          {errors.name && <p className="text-xs mt-1.5 font-semibold flex items-center gap-1" style={{ color: "var(--status-cr)" }}><AlertCircle className="w-3 h-3" />{errors.name}</p>}
        </div>
        {/* Email */}
        <div>
          <label className="label-pg">Alamat Email</label>
          <input
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={fieldBase}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--pg-accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-hard)"; e.currentTarget.style.boxShadow = "3px 3px 0px var(--border-hard)"; }}
          />
          {errors.email && <p className="text-xs mt-1.5 font-semibold flex items-center gap-1" style={{ color: "var(--status-cr)" }}><AlertCircle className="w-3 h-3" />{errors.email}</p>}
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="label-pg">Topik</label>
        <select
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          style={{ ...fieldBase, cursor: "pointer" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--pg-accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-hard)"; e.currentTarget.style.boxShadow = "3px 3px 0px var(--border-hard)"; }}
        >
          <option value="">-- Pilih topik --</option>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.topic && <p className="text-xs mt-1.5 font-semibold flex items-center gap-1" style={{ color: "var(--status-cr)" }}><AlertCircle className="w-3 h-3" />{errors.topic}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="label-pg">Pesan</label>
        <textarea
          rows={5}
          placeholder="Tulis pesanmu di sini..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...fieldBase, resize: "vertical", minHeight: "120px" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--pg-accent)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--pg-accent)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-hard)"; e.currentTarget.style.boxShadow = "3px 3px 0px var(--border-hard)"; }}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.message
            ? <p className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--status-cr)" }}><AlertCircle className="w-3 h-3" />{errors.message}</p>
            : <span />
          }
          <p className="text-xs font-bold" style={{ color: form.message.length >= 20 ? "var(--pg-mint)" : "var(--text-faint)", fontFamily: "var(--font-heading)" }}>
            {form.message.length} kar
          </p>
        </div>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 p-4 rounded-xl text-sm font-semibold" style={{ background: "var(--status-cr-bg)", border: "2px solid var(--status-cr-border)", color: "var(--status-cr)" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> Terjadi kesalahan. Silakan coba lagi.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || status === "loading"}
        className="btn-candy w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending || status === "loading" ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
            />
            Mengirim…
          </>
        ) : (
          <><Send className="w-4 h-4" strokeWidth={2.5} /> Kirim Pesan</>
        )}
      </button>
    </form>
  );
}

// ─── Contact Page ─────────────────────────────
export default function ContactPage() {
  return (
    <main style={{ background: "var(--pg-bg)" }} className="min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative py-12 overflow-hidden" style={{ background: "var(--pg-bg)", borderBottom: "2px solid var(--border-hard)" }}>
        <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

        {/* Geometric deco */}
        <motion.div
          animate={{ y: [0, -16, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-16 w-16 h-16 rounded-2xl hidden lg:block"
          style={{ background: "var(--pg-accent)", border: "2px solid var(--border-hard)", boxShadow: "var(--shadow-hard)", transform: "rotate(12deg)" }}
        />
        <motion.div
          animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-8 right-1/3 w-10 h-10 rounded-full hidden lg:block"
          style={{ background: "var(--pg-pink)", border: "2px solid var(--border-hard)", boxShadow: "var(--shadow-hard)" }}
        />
        <div
          className="absolute top-36 left-8 w-12 h-12 hidden lg:block"
          style={{ border: "3px solid var(--pg-amber)", borderRadius: "6px", opacity: 0.4, transform: "rotate(20deg)" }}
        />

        <div className="container-main relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span variants={fadeUp} className="section-eyebrow mb-4">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} /> Hubungi Kami
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mb-4"
              style={{
                fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--text-primary)",
                fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1,
              }}
            >
              Bersama Kita{" "}
              <span className="squiggle-underline" style={{ color: "var(--pg-accent)" }}>Jaga Nusantara</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base max-w-md" style={{ color: "var(--text-secondary)" }}>
              Ada pertanyaan, masukan, atau ingin berkolaborasi? Kami senang mendengar darimu.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── MAIN ─── */}
      <section className="py-16 sm:py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start">

            {/* Form card */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div
                variants={fadeUp}
                className="p-7 sm:p-10 rounded-3xl"
                style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "6px 6px 0px var(--border-hard)" }}
              >
                <div className="mb-7">
                  <h2 className="text-2xl font-bold mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    Kirim Pesan
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Semua kolom wajib diisi. Respons 1–2 hari kerja.</p>
                </div>
                <ContactForm />
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.aside initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-5">

              {/* Info card */}
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl"
                style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <h3 className="text-base font-bold mb-5" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                  Info Kontak
                </h3>
                <div className="space-y-3.5">
                  {CONTACT_INFO.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.color, color: "white" }}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-faint)", fontFamily: "var(--font-heading)" }}>{item.label}</p>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Conservation links */}
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl"
                style={{ background: "white", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <h3 className="text-base font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                  Aksi Konservasi
                </h3>
                <div className="space-y-2.5">
                  {CONSERVATION_LINKS.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-xl transition-all"
                      style={{ background: "var(--pg-bg)", border: "2px solid var(--border-hard)", boxShadow: "2px 2px 0px var(--border-hard)" }}
                      whileHover={{ boxShadow: `4px 3px 0px ${link.color}`, borderColor: link.color }}
                    >
                      <div>
                        <p className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>{link.name}</p>
                        <p className="text-xs leading-snug pl-2" style={{ color: "var(--text-secondary)", fontFamily: "system-ui, sans-serif" }}>{link.desc}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-40 group-hover:opacity-70" style={{ color: link.color }} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* CTA card */}
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl relative overflow-hidden"
                style={{ background: "var(--pg-accent)", border: "2px solid var(--border-hard)", boxShadow: "4px 4px 0px var(--border-hard)" }}
              >
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-15 select-none">🌿</div>
                <div className="relative z-10">
                  <Leaf className="w-5 h-5 text-white mb-3" strokeWidth={2.5} />
                  <p className="text-base font-bold mb-1.5 text-white" style={{ fontFamily: "var(--font-heading)" }}>Jelajahi Spesies</p>
                  <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.70)" }}>Kenali flora & fauna endemik Indonesia.</p>
                  <Link
                    href="/species"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                    style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.30)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                  >
                    Mulai Eksplorasi <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </motion.div>

            </motion.aside>
          </div>
        </div>
      </section>

    </main>
  );
}
