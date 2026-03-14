"use client";

import {
  getRandomQuizSession,
  Question,
  QuizLevel,
} from "@/utils/quizGenerator";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  Flame,
  Leaf,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type QuizState = "WELCOME" | "PLAYING" | "ENDED";

// ─── Motion Variants ──────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("WELCOME");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);

  const handleStart = (level: QuizLevel) => {
    setSelectedLevel(level);
    const sessionQuestions = getRandomQuizSession(level, 10);
    setQuestions(sessionQuestions);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setQuizState("PLAYING");
    setSelectedOption(null);
    setIsAnswerRevealed(false);
  };

  const handleAnswer = (option: string) => {
    if (isAnswerRevealed) return;

    setSelectedOption(option);
    setIsAnswerRevealed(true);

    const isCorrect = option === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerRevealed(false);
      } else {
        setQuizState("ENDED");
      }
    }, 2000);
  };

  const getResultFeedback = (finalScore: number) => {
    if (finalScore <= 50) {
      return {
        title: "Perlu Belajar Lagi!",
        desc: "Kamu mungkin baru menemukan pesona alam Nusantara. Terus eksplorasi Atlas agar wawasanmu makin luas!",
        color: "var(--pg-pink)",
        bg: "var(--pg-pink-light)",
        shadowColor: "var(--pg-pink)",
        icon: <BookOpen className="w-16 h-16 mb-6 mx-auto" style={{ color: "var(--pg-pink)" }} />,
      };
    } else if (finalScore <= 70) {
      return {
        title: "Lumayan Bagus!",
        desc: "Kamu sudah tahu banyak, tapi masih ada ruang untuk menjadi ahli keanekaragaman hayati sesungguhnya.",
        color: "var(--status-vu)",
        bg: "var(--pg-amber-light)",
        shadowColor: "var(--pg-amber)",
        icon: <Target className="w-16 h-16 mb-6 mx-auto" style={{ color: "var(--status-vu)" }} />,
      };
    } else if (finalScore <= 90) {
      return {
        title: "Sangat Memukau!",
        desc: "Luar biasa! Pengetahuanmu tentang alam Nusantara benar-benar layak diacungi jempol.",
        color: "var(--pg-accent-dark)",
        bg: "var(--pg-accent-light)",
        shadowColor: "var(--pg-accent)",
        icon: <Award className="w-16 h-16 mb-6 mx-auto" style={{ color: "var(--pg-accent-dark)" }} />,
      };
    } else {
      return {
        title: "Pakar Nusantara Sejati!",
        desc: "Hampir mustahil! Kamu adalah ahlinya Flora dan Fauna Indonesia tiada tanding. Kami memberikan apresiasi tertinggi!",
        color: "var(--status-vu)",
        bg: "var(--pg-amber-light)",
        shadowColor: "var(--pg-amber)",
        icon: <Trophy className="w-20 h-20 mb-6 mx-auto" style={{ color: "var(--status-vu)" }} />,
      };
    }
  };

  const levels = [
    {
      id: "mudah",
      name: "Tingkat Mudah",
      desc: "Tebak dari rupa dan asalnya.",
      icon: <Leaf className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />,
      color: "var(--pg-mint)",
      shadowColor: "var(--shadow-hard-mint)",
    },
    {
      id: "sedang",
      name: "Tingkat Sedang",
      desc: "Uji ingatan letak dan status konservasi.",
      icon: <Flame className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />,
      color: "var(--pg-amber)",
      shadowColor: "var(--shadow-hard-amber)",
    },
    {
      id: "sulit",
      name: "Tingkat Sulit",
      desc: "Tantangan pakar! Hafal nama latin & misteri.",
      icon: <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />,
      color: "var(--pg-pink)",
      shadowColor: "var(--shadow-hard-pink)",
    },
  ];

  return (
    <div
      className="min-h-screen py-12 relative overflow-hidden flex flex-col items-center"
      style={{ background: "var(--pg-bg)" }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

      {/* Floating decorative shapes (like in homepage) */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-16 w-12 h-12 rounded-xl hidden lg:block pointer-events-none"
        style={{
          background: "var(--pg-mint)",
          border: "2px solid var(--border-hard)",
          boxShadow: "var(--shadow-hard)",
          rotate: "-15deg",
        }}
      />
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-28 right-24 w-10 h-10 rounded-full hidden lg:block pointer-events-none"
        style={{
          background: "var(--pg-amber)",
          border: "2px solid var(--border-hard)",
          boxShadow: "var(--shadow-hard)",
        }}
      />

      <div className="container-main relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {quizState === "WELCOME" && (
            <motion.div
              key="welcome"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -30, filter: "blur(5px)" }}
              variants={stagger}
              className="flex flex-col items-center w-full"
            >
              <div className="text-center mb-12">
                <motion.div variants={fadeUp} className="mb-6 flex justify-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center animate-bounce-pop"
                    style={{
                      background: "white",
                      border: "3px solid var(--border-hard)",
                      boxShadow: "6px 6px 0px var(--pg-accent)",
                    }}
                  >
                    <Trophy
                      className="w-10 h-10"
                      strokeWidth={2.5}
                      style={{ color: "var(--text-primary)" }}
                    />
                  </div>
                </motion.div>
                <motion.h1
                  variants={fadeUp}
                  className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <span style={{ color: "var(--text-primary)" }}>
                    Tantangan Nusantara
                  </span>
                  <span style={{ color: "var(--pg-accent)" }}>Hijau</span>
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-base md:text-lg max-w-2xl mx-auto font-medium"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                >
                  Selamat datang di arena pengujian! Pilih tingkat kesulitan dan
                  kami akan memberikan 10 soal acak. Seberapa luas pengetahuanmu
                  tentang flora dan fauna Nusantara?
                </motion.p>
              </div>

              <motion.div
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl"
              >
                {levels.map((level, i) => (
                  <motion.button
                    variants={fadeUp}
                    key={level.id}
                    whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? -1 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStart(level.id as QuizLevel)}
                    className="text-left p-6 md:p-8 rounded-3xl flex flex-col justify-between cursor-pointer"
                    style={{
                      background: "white",
                      border: "3px solid var(--border-hard)",
                      boxShadow: `6px 6px 0px ${level.color}`,
                      transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `10px 10px 0px ${level.color}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0px ${level.color}`;
                    }}
                  >
                    <div
                      className="mb-6 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: level.color,
                        border: "2px solid var(--border-hard)",
                        boxShadow: "3px 3px 0px var(--border-hard)",
                      }}
                    >
                      {level.icon}
                    </div>
                    <div>
                      <h3
                        className="text-xl md:text-2xl font-bold mb-3"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
                      >
                        {level.name}
                      </h3>
                      <p
                        className="text-sm md:text-base leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {level.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {quizState === "PLAYING" && questions.length > 0 && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl mx-auto"
            >
              {/* Top Bar for Quiz Progress */}
              <div className="flex justify-between items-center mb-8 px-2 md:px-0">
                <div className="flex flex-col gap-3 w-full max-w-[200px] md:max-w-xs">
                  <div
                    className="flex justify-between text-xs md:text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Soal &bull; {currentIndex + 1}/10</span>
                  </div>
                  <div
                    className="w-full h-3 rounded-full overflow-hidden"
                    style={{
                      background: "white",
                      border: "2px solid var(--border-hard)",
                    }}
                  >
                    <motion.div
                      className="h-full"
                      style={{ background: "var(--pg-accent)" }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentIndex + 1) / 10) * 100}%`,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className="text-xs md:text-sm font-bold uppercase tracking-widest mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Skor
                  </span>
                  <div
                    className="font-black text-3xl md:text-4xl flex items-center"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {score}
                  </div>
                </div>
              </div>

              {/* Main Quiz Card */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-3xl p-6 md:p-10 lg:p-12"
                    style={{
                      background: "white",
                      border: "3px solid var(--border-hard)",
                      boxShadow: "8px 8px 0px var(--border-hard)",
                    }}
                  >
                    <h2
                      className="text-xl md:text-2xl lg:text-[1.75rem] font-bold mb-8 leading-snug whitespace-pre-wrap text-center max-w-3xl mx-auto"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
                    >
                      {questions[currentIndex].text}
                    </h2>

                    {questions[currentIndex].imageUrl && (
                      <div className="mb-8 flex justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden"
                          style={{
                            border: "3px solid var(--border-hard)",
                            boxShadow: "6px 6px 0px var(--pg-pink)",
                          }}
                        >
                          <Image
                            src={questions[currentIndex].imageUrl!}
                            alt="Question Reference"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                          />
                        </motion.div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[currentIndex].options.map((option, idx) => {
                        const isCorrectAnswer =
                          option === questions[currentIndex].correctAnswer;
                        const isSelected = selectedOption === option;

                        let bgClass = "bg-white";
                        let borderClass = "var(--border-hard)";
                        let shadowClass = "4px 4px 0px var(--border-medium)";
                        let textClass = "var(--text-primary)";
                        let scaleDown = false;

                        if (isAnswerRevealed) {
                          if (isCorrectAnswer) {
                            bgClass = "bg-[#DCFCE7]"; // pg-accent-light
                            borderClass = "var(--pg-accent-dark)";
                            shadowClass = "4px 4px 0px var(--pg-accent)";
                            textClass = "var(--pg-accent-dark)";
                          } else if (isSelected) {
                            bgClass = "bg-[#FFE4E6]"; // pinkish light
                            borderClass = "var(--status-cr)";
                            shadowClass = "4px 4px 0px var(--status-cr)";
                            textClass = "var(--status-cr)";
                            scaleDown = true;
                          } else {
                            bgClass = "bg-[#F1F5F9]"; // pg-muted
                            borderClass = "var(--border-medium)";
                            shadowClass = "none";
                            textClass = "var(--text-muted)";
                          }
                        }

                        return (
                          <motion.button
                            key={idx}
                            whileHover={
                              !isAnswerRevealed
                                ? { y: -2, x: -2, boxShadow: "6px 6px 0px var(--border-hard)" }
                                : {}
                            }
                            whileTap={!isAnswerRevealed ? { y: 2, x: 2, boxShadow: "0px 0px 0px var(--border-medium)" } : {}}
                            animate={isAnswerRevealed && scaleDown ? { scale: 0.98, opacity: 0.7 } : {}}
                            onClick={() => handleAnswer(option)}
                            disabled={isAnswerRevealed}
                            className={`relative text-left px-5 py-5 rounded-2xl font-semibold text-base md:text-lg transition-colors flex items-center justify-between min-h-[5rem] cursor-pointer ${bgClass}`}
                            style={{
                              border: `2px solid ${borderClass}`,
                              boxShadow: shadowClass,
                              color: textClass,
                              fontFamily: "var(--font-heading)",
                            }}
                          >
                            <span className="flex-1 pr-4 leading-snug">
                              {option}
                            </span>
                            {isAnswerRevealed && isCorrectAnswer && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <CheckCircle
                                  className="w-6 h-6 shrink-0"
                                  strokeWidth={2.5}
                                  style={{ color: "var(--pg-accent-dark)" }}
                                />
                              </motion.div>
                            )}
                            {isAnswerRevealed &&
                              isSelected &&
                              !isCorrectAnswer && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <XCircle
                                    className="w-6 h-6 shrink-0"
                                    strokeWidth={2.5}
                                    style={{ color: "var(--status-cr)" }}
                                  />
                                </motion.div>
                              )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {quizState === "ENDED" && (
            <motion.div
              key="ended"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="rounded-[2.5rem] p-10 md:p-14 lg:p-16 text-center max-w-2xl mx-auto overflow-hidden relative"
              style={{
                background: "white",
                border: "3px solid var(--border-hard)",
                boxShadow: `12px 12px 0px ${getResultFeedback(score).shadowColor}`,
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: getResultFeedback(score).bg }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                >
                  {getResultFeedback(score).icon}
                </motion.div>

                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight"
                  style={{ color: getResultFeedback(score).color, fontFamily: "var(--font-heading)" }}
                >
                  {getResultFeedback(score).title}
                </h2>

                <div className="flex flex-col items-center justify-center mb-8">
                  <div
                    className="text-[5rem] md:text-[6.5rem] font-black flex items-baseline leading-none"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}
                  >
                    {score}
                    <span className="text-3xl md:text-4xl ml-2" style={{ color: "var(--text-muted)" }}>
                      %
                    </span>
                  </div>
                  <div
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base shadow-sm"
                    style={{
                      background: "white",
                      border: "2px solid var(--border-hard)",
                      boxShadow: "3px 3px 0px var(--pg-accent)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--pg-accent)" }} strokeWidth={2.5} />
                    <span>Menjawab {correctCount} Soal dengan Benar</span>
                  </div>
                </div>

                <p
                  className="text-lg leading-relaxed mb-10 max-w-lg mx-auto"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {getResultFeedback(score).desc}
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => setQuizState("WELCOME")}
                    className="btn-candy py-3.5 text-base flex-1 sm:flex-none justify-center"
                    style={{ minWidth: "160px" }}
                  >
                    <RotateCcw className="w-5 h-5" strokeWidth={2.5} /> Kuis Lagi
                  </button>
                  <Link
                    href="/species"
                    className="btn-outline-pg py-3.5 text-base flex-1 sm:flex-none justify-center"
                    style={{ minWidth: "160px" }}
                  >
                    <BookOpen className="w-5 h-5" strokeWidth={2.5} /> Telusuri Atlas
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
