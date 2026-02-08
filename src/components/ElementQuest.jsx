import { useState, useEffect, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Swords, ChevronRight, Zap, HelpCircle, ArrowLeft,
  Check, BookOpen, Trophy, FlaskConical, X,
} from "lucide-react";
import { STAGES_DATA, FUSION_QUIZZES, ALL_ELEMENTS } from "../data/stages";
import { useGameStorage } from "../hooks/useStorage";

/* ─── Utilities ─────────────────────────────────────────────────── */
function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/* ─── Visual Components ─────────────────────────────────────────── */
function Particles({ count = 20, color = "bg-yellow-400" }) {
  const [ps] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 4 + 2,
      d: Math.random() * 3 + 2,
      dl: Math.random() * 2,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ps.map((p) => (
        <motion.div
          key={p.i}
          className={`absolute rounded-full ${color} opacity-60`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FloatingEmoji({ emoji, count = 6 }) {
  const [items] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      i,
      x: Math.random() * 90 + 5,
      sz: Math.random() * 20 + 16,
      d: Math.random() * 6 + 4,
      dl: Math.random() * 3,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((it) => (
        <motion.div
          key={it.i}
          className="absolute opacity-20"
          style={{ left: `${it.x}%`, bottom: -40, fontSize: it.sz }}
          animate={{ y: [0, -600], rotate: [0, 360], opacity: [0.15, 0.3, 0] }}
          transition={{ duration: it.d, delay: it.dl, repeat: Infinity, ease: "linear" }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

function HPBar({ current, max, label, color, icon }) {
  const pct = Math.max(0, (current / max) * 100);
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-0.5 font-bold">
          <span className="text-white/80">{label}</span>
          <span className="text-white/90">
            {current}/{max}
          </span>
        </div>
        <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className={`h-full ${color} rounded-full`}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const [pcs] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      i,
      x: Math.random() * 100,
      color: ["bg-yellow-400", "bg-pink-400", "bg-cyan-400", "bg-green-400", "bg-purple-400", "bg-red-400"][i % 6],
      size: Math.random() * 8 + 4,
      dur: Math.random() * 2 + 1.5,
      del: Math.random() * 0.8,
      rot: Math.random() * 720 - 360,
      xD: (Math.random() - 0.5) * 200,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {pcs.map((p) => (
        <motion.div
          key={p.i}
          className={`absolute ${p.color} rounded-sm`}
          style={{ left: `${p.x}%`, top: -20, width: p.size, height: p.size * 0.6 }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: [-20, 800], x: [0, p.xD], rotate: [0, p.rot], opacity: [1, 1, 0] }}
          transition={{ duration: p.dur, delay: p.del, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/* ─── Element Card ──────────────────────────────────────────────── */
function ElementCard({ element, size = "lg", revealed = true, className = "" }) {
  if (!revealed)
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-br from-slate-700 to-slate-800 ${
          size === "lg" ? "w-36 h-44" : "w-full h-20"
        } ${className}`}
      >
        <span className="text-4xl">❓</span>
      </div>
    );
  if (size === "choice")
    return (
      <div
        className={`relative flex items-center gap-3 rounded-2xl border-2 border-white/15 bg-gradient-to-br from-slate-700/80 to-slate-900/80 backdrop-blur-sm shadow-lg overflow-hidden w-full py-3.5 px-4 min-h-[56px] hover:border-white/30 hover:bg-white/10 active:scale-95 transition-all ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg font-black text-white flex-shrink-0">
          {element.symbol}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white/90 truncate">{element.answer}</p>
          <p className="text-xs text-white/40">{element.rubi}</p>
        </div>
        <span className="text-white/20 text-xs font-mono">{element.number}</span>
      </div>
    );
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-br from-slate-700/80 to-slate-900/80 backdrop-blur-sm shadow-lg overflow-hidden ${
        size === "lg" ? "w-36 h-44" : ""
      } ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <span className="absolute top-2 left-3 text-white/40 text-xs font-mono">{element.number}</span>
      <span className="text-4xl font-black text-white leading-none mb-1">{element.symbol}</span>
      <span className="text-sm font-bold text-white/90">{element.answer}</span>
      <span className="text-xs text-white/40">{element.rubi}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TITLE SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function TitleScreen({ onStart }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0f0c29,#302b63 50%,#24243e)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Particles count={40} color="bg-indigo-400" />
      <FloatingEmoji emoji="⚗️" count={4} />
      <FloatingEmoji emoji="💫" count={5} />
      <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <motion.div className="relative z-10 text-center px-6" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <motion.div className="text-7xl mb-4" animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>
          ⚗️
        </motion.div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">元素クエスト</span>
        </h1>
        <p className="text-indigo-300/80 text-lg font-medium tracking-widest mb-1">ELEMENT QUEST</p>
        <p className="text-indigo-400/60 text-sm mb-10">周期表の世界を冒険しよう！</p>
        <motion.button
          onClick={onStart}
          className="relative px-12 py-5 rounded-2xl font-bold text-xl text-white overflow-hidden cursor-pointer"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245,158,11,0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Swords size={20} /> 冒険をはじめる <ChevronRight size={20} />
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAP SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function MapScreen({ clearedStages, perfectStages, stageScores, bestScores, discovered, onSelectStage, onZukan, onFusion }) {
  const totalDisc = discovered.length;
  return (
    <motion.div
      className="min-h-screen py-6 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#0c0a1d,#1a1640 40%,#0f172a)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Particles count={25} color="bg-purple-400" />
      <div className="max-w-lg mx-auto relative z-10">
        <motion.div className="text-center mb-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2 className="text-3xl font-black text-white mb-1">🗺️ 冒険マップ</h2>
          <p className="text-purple-300/60 text-sm">各元素の3問全正解でカードをゲット！</p>
        </motion.div>
        <div className="flex gap-3 mb-5">
          <motion.button
            onClick={onZukan}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-base hover:bg-indigo-500/30 transition cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <BookOpen size={18} /> 元素図鑑{" "}
            <span className="text-xs text-indigo-400/60 ml-1">
              {totalDisc}/{ALL_ELEMENTS.length}
            </span>
          </motion.button>
          <motion.button
            onClick={onFusion}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-base hover:bg-amber-500/30 transition cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FlaskConical size={18} /> 合体クイズ
          </motion.button>
        </div>
        <div className="space-y-4">
          {STAGES_DATA.map((stage, idx) => {
            const cleared = clearedStages.includes(stage.id);
            const perfect = perfectStages.includes(stage.id);
            const best = bestScores[stage.id];
            const score = stageScores[stage.id];
            const tq = stage.questions.length;
            const collected = score ? score.collected || 0 : 0;
            return (
              <motion.div key={stage.id} initial={{ x: idx % 2 === 0 ? -60 : 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.08 }}>
                <motion.button
                  onClick={() => onSelectStage(stage.id)}
                  className="w-full relative rounded-2xl p-5 border-2 text-left transition-all border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/25 hover:bg-white/10 cursor-pointer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white/20 bg-slate-900 flex items-center justify-center">
                    {perfect ? <span className="text-xs">👑</span> : cleared ? <Check size={12} className="text-green-400" /> : <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>{stage.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white/40 text-xs font-mono">STAGE {stage.id}</span>
                        {perfect && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">PERFECT</span>}
                        {cleared && !perfect && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">CLEAR</span>}
                      </div>
                      <h3 className="text-white font-bold text-xl truncate">{stage.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        {score && (
                          <span className="text-white/50 text-xs">
                            カード {collected}/{tq}
                          </span>
                        )}
                        {best > 0 && (
                          <span className="text-amber-400/70 text-xs font-mono flex items-center gap-1">
                            <Trophy size={10} />
                            {best.toLocaleString()}pts
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-white/30 flex-shrink-0" />
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ZUKAN (Collection)
   ═══════════════════════════════════════════════════════════════════ */
function ZukanScreen({ discovered, onBack }) {
  const [selectedStage, setSelectedStage] = useState(0);
  const stages = [{ label: "すべて", id: 0 }, ...STAGES_DATA.map((s) => ({ label: s.icon + " " + s.title, id: s.id }))];
  const elements = selectedStage === 0 ? ALL_ELEMENTS : STAGES_DATA.find((s) => s.id === selectedStage)?.questions || [];
  const discSet = new Set(discovered);
  const discCount = elements.filter((e) => discSet.has(e.symbol)).length;
  return (
    <motion.div
      className="min-h-screen py-6 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#0c0a1d,#1a1640 40%,#0f172a)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-lg mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-white/40 hover:text-white/80 transition cursor-pointer p-3 -ml-1">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-black text-white flex-1">📖 元素図鑑</h2>
          <span className="text-sm text-white/50 font-mono">
            {discCount}/{elements.length}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
            animate={{ width: `${(discCount / elements.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {stages.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStage(s.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                selectedStage === s.id
                  ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/40"
                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {elements.map((e) => {
            const found = discSet.has(e.symbol);
            return (
              <motion.div
                key={e.symbol}
                className={`relative rounded-xl border-2 p-3 text-center transition-all ${found ? "border-white/15 bg-white/5" : "border-white/5 bg-black/20"}`}
                whileHover={found ? { scale: 1.05 } : {}}
                layout
              >
                {found ? (
                  <>
                    <span className="text-2xl font-black text-white">{e.symbol}</span>
                    <p className="text-xs font-bold text-white/80 mt-1">{e.answer}</p>
                    <p className="text-xs text-white/30">{e.rubi}</p>
                    {e.trivia && <p className="text-xs text-indigo-300/60 mt-2 leading-relaxed">{e.trivia}</p>}
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-black text-white/10">?</span>
                    <p className="text-xs text-white/15 mt-1">未発見</p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FUSION QUIZ
   ═══════════════════════════════════════════════════════════════════ */
function FusionScreen({ discovered, onBack }) {
  const discSet = new Set(discovered);
  const available = FUSION_QUIZZES.filter((fq) => fq.components.every((c) => discSet.has(c)));
  const [quizzes] = useState(() => shuffle(available).slice(0, 5));
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (available.length === 0)
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f0c29,#302b63 50%,#24243e)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-black text-white mb-2">合体クイズ</h2>
          <p className="text-white/50 text-sm mb-6">
            元素を発見すると合体クイズが解放されるよ！
            <br />
            まずは冒険で元素を集めよう！
          </p>
          <motion.button onClick={onBack} className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-lg cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            戻る
          </motion.button>
        </div>
      </motion.div>
    );

  if (finished)
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f0c29,#302b63 50%,#24243e)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Particles count={40} color="bg-amber-300" />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4">🧪</div>
          <h2 className="text-3xl font-black text-white mb-2">合体クイズ結果</h2>
          <p className="text-2xl font-black text-amber-300 mb-2">
            {score}/{quizzes.length} 問正解
          </p>
          <p className="text-white/50 text-sm mb-6">{score === quizzes.length ? "パーフェクト！すごい！" : score >= 3 ? "よくできた！" : "もっと挑戦してみよう！"}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => {
                setQIdx(0);
                setScore(0);
                setFinished(false);
                setShowResult(null);
                setInput("");
              }}
              className="px-8 py-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              もう一度
            </motion.button>
            <motion.button onClick={onBack} className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-lg cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              戻る
            </motion.button>
          </div>
        </div>
      </motion.div>
    );

  const fq = quizzes[qIdx];
  if (!fq) return null;
  const checkFusion = (ans) => {
    const a = ans.trim();
    return a === fq.answer || fq.answer.includes(a) || a.includes(fq.answer.split("（")[0]);
  };
  const handleSubmit = () => {
    if (!input.trim() || showResult) return;
    if (checkFusion(input)) {
      setScore((p) => p + 1);
      setShowResult("correct");
    } else setShowResult("wrong");
  };
  const advance = () => {
    setShowResult(null);
    setInput("");
    if (qIdx + 1 < quizzes.length) setQIdx((p) => p + 1);
    else setFinished(true);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0f0c29,#302b63 50%,#24243e)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FloatingEmoji emoji="🧪" count={4} />
      <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto w-full px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={onBack} className="text-white/40 hover:text-white/80 cursor-pointer p-3 -ml-1">
            <ArrowLeft size={24} />
          </button>
          <span className="text-white/50 text-sm font-mono flex-1">合体クイズ</span>
          <span className="text-white/50 text-xs">
            {qIdx + 1}/{quizzes.length}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <div className="text-center">
            <span className="text-5xl mb-3 block">{fq.emoji}</span>
            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
              {fq.components.map((c, i) => {
                const el = ALL_ELEMENTS.find((e) => e.symbol === c);
                return (
                  <div key={c} className="flex items-center gap-2">
                    {i > 0 && <span className="text-white/40 text-xl">+</span>}
                    <div className="w-14 h-16 rounded-xl border-2 border-white/20 bg-white/5 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-white">{c}</span>
                      <span className="text-xs text-white/40">{el?.answer}</span>
                    </div>
                  </div>
                );
              })}
              <span className="text-white/40 text-xl ml-2">= ❓</span>
            </div>
            <p className="text-white font-bold text-lg mb-1">{fq.formula}</p>
            <p className="text-amber-300/70 text-sm">{fq.hint}</p>
          </div>

          <AnimatePresence>
            {showResult === "correct" && (
              <motion.div key="fc" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full p-4 rounded-2xl border-2 text-center bg-green-500/10 border-green-500/30">
                <p className="text-green-400 font-black text-lg">🎉 正解！ {fq.answer}</p>
                <motion.button onClick={advance} className="mt-3 px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-base cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {qIdx + 1 < quizzes.length ? "次へ →" : "結果を見る →"}
                </motion.button>
              </motion.div>
            )}
            {showResult === "wrong" && (
              <motion.div key="fw" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full p-4 rounded-2xl border-2 text-center bg-red-500/10 border-red-500/30">
                <p className="text-red-400 font-black text-lg mb-1">💥 不正解！</p>
                <p className="text-white/60 text-sm">
                  答え: <span className="text-white font-bold">{fq.answer}</span>
                </p>
                <motion.button onClick={advance} className="mt-3 px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-base cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {qIdx + 1 < quizzes.length ? "次へ →" : "結果を見る →"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showResult && (
            <div className="w-full space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="できる物質の名前は？"
                  className="flex-1 px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-white/40 text-lg"
                />
                <motion.button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className={`px-6 py-4 rounded-xl font-bold text-white cursor-pointer ${input.trim() ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
                  whileHover={input.trim() ? { scale: 1.05 } : {}}
                  whileTap={input.trim() ? { scale: 0.95 } : {}}
                >
                  <FlaskConical size={18} />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GAME SCREEN — 3 Questions per Element
   Each element: Q1=ヒント→名前, Q2=名前→記号, Q3=記号→原子番号
   All 3 correct → element card collected
   ═══════════════════════════════════════════════════════════════════ */
function generateNameChoices(correct, allElems) {
  const others = allElems.filter((e) => e.answer !== correct.answer);
  return shuffle([correct, ...shuffle(others).slice(0, 3)]);
}
function generateSymbolChoices(correct, allElems) {
  const others = allElems.filter((e) => e.symbol !== correct.symbol);
  const picks = shuffle(others).slice(0, 3);
  return shuffle([correct, ...picks]).map((e) => ({ label: e.symbol, value: e.symbol }));
}
function generateNumberChoices(correct, allElems) {
  const others = allElems.filter((e) => e.number !== correct.number);
  const picks = shuffle(others).slice(0, 3);
  return shuffle([correct, ...picks]).map((e) => ({ label: String(e.number), value: e.number }));
}

function GameScreen({ stage, onFinish, onBack }) {
  const [elements] = useState(() => shuffle(stage.questions));
  const totalElements = elements.length; // 9

  // For each element, pre-generate choices for all 3 question types
  const [allChoicesMap] = useState(() =>
    elements.map((el) => ({
      nameChoices: generateNameChoices(el, ALL_ELEMENTS),
      symbolChoices: generateSymbolChoices(el, ALL_ELEMENTS),
      numberChoices: generateNumberChoices(el, ALL_ELEMENTS),
    }))
  );

  const [elIdx, setElIdx] = useState(0); // current element index (0-8)
  const [phase, setPhase] = useState(0); // 0=hint→name, 1=name→symbol, 2=symbol→number
  const [phaseCorrect, setPhaseCorrect] = useState(0); // correct count for current element (0-3)
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(null); // "correct" | "wrong" | null
  const [collectedCards, setCollectedCards] = useState([]); // symbols of collected elements
  const [totalScore, setTotalScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [playerHP, setPlayerHP] = useState(9); // lose 1 per wrong
  const [shakeEnemy, setShakeEnemy] = useState(false);

  const currentEl = elements[elIdx];
  const choices = allChoicesMap[elIdx];
  const clearThreshold = Math.ceil(totalElements * 2 / 3); // 6 of 9

  // Question text & choices based on phase
  const questionData = useMemo(() => {
    if (!currentEl || !choices) return null;
    if (phase === 0) {
      // Show hint → pick element name (hint display uses frozenHint)
      const hintText = currentEl.hints[0];
      return {
        prompt: "このヒントが表す元素は？",
        hint: hintText,
        options: choices.nameChoices.map((e) => ({ label: e.answer, sublabel: e.rubi, value: e.answer })),
        correctValue: currentEl.answer,
        phaseLabel: "Q1: ヒント → 元素名",
        phaseColor: "text-green-400",
      };
    }
    if (phase === 1) {
      return {
        prompt: `「${currentEl.answer}」の元素記号は？`,
        hint: null,
        options: choices.symbolChoices,
        correctValue: currentEl.symbol,
        phaseLabel: "Q2: 元素名 → 記号",
        phaseColor: "text-cyan-400",
      };
    }
    return {
      prompt: `「${currentEl.symbol}」の原子番号は？`,
      hint: null,
      options: choices.numberChoices.map((o) => ({ ...o, value: o.value })),
      correctValue: currentEl.number,
      phaseLabel: "Q3: 記号 → 原子番号",
      phaseColor: "text-amber-400",
    };
  }, [currentEl, choices, phase]);

  // Memoize hint for phase 0 so it doesn't change on re-render
  const [frozenHint, setFrozenHint] = useState("");
  useEffect(() => {
    if (currentEl && phase === 0) {
      setFrozenHint(currentEl.hints[Math.floor(Math.random() * currentEl.hints.length)]);
    }
  }, [elIdx, phase, currentEl]);

  const handleChoice = (value) => {
    if (selected !== null) return;
    setSelected(value);

    const isCorrect = value === (phase === 2 ? currentEl.number : phase === 1 ? currentEl.symbol : currentEl.answer);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((p) => Math.max(p, newCombo));
      setPhaseCorrect((p) => p + 1);
      setTotalScore((p) => p + 100 + newCombo * 20);
      setShakeEnemy(true);
      setTimeout(() => setShakeEnemy(false), 500);
      setShowResult("correct");
    } else {
      setCombo(0);
      setPlayerHP((p) => Math.max(0, p - 1));
      setShowResult("wrong");
    }
  };

  const advance = () => {
    const wasCorrect = showResult === "correct";
    const _newPhaseCorrect = wasCorrect ? phaseCorrect : phaseCorrect; // already updated in handleChoice

    setSelected(null);
    setShowResult(null);

    if (phase < 2) {
      // Move to next question for same element
      setPhase((p) => p + 1);
    } else {
      // Finished all 3 questions for this element
      if (phaseCorrect === 3) {
        // Got all 3 right → collect card!
        setCollectedCards((p) => [...p, currentEl.symbol]);
      }
      // Move to next element
      if (elIdx + 1 < totalElements) {
        setElIdx((p) => p + 1);
        setPhase(0);
        setPhaseCorrect(0);
      } else {
        // Stage finished
        const finalCollected = phaseCorrect === 3 ? [...collectedCards, currentEl.symbol] : collectedCards;
        onFinish({
          collected: finalCollected.length,
          total: totalElements,
          remainingHP: playerHP,
          score: totalScore,
          maxCombo,
          discovered: finalCollected,
        });
      }
    }
  };

  // Game over on 0 HP
  useEffect(() => {
    if (playerHP <= 0) {
      const t = setTimeout(() => {
        onFinish({
          collected: collectedCards.length,
          total: totalElements,
          remainingHP: 0,
          score: totalScore,
          maxCombo,
          discovered: collectedCards,
        });
      }, 1500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger when HP reaches 0, not when score/cards change after game over
  }, [playerHP]);

  if (!questionData) return null;

  const actualHint = phase === 0 ? frozenHint : null;

  return (
    <motion.div className={`min-h-screen flex flex-col relative overflow-hidden ${stage.bgColor}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Particles count={15} color="bg-white" />
      <FloatingEmoji emoji={stage.enemy} count={4} />
      <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto w-full px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={onBack} className="text-white/40 hover:text-white/80 cursor-pointer p-3 -ml-1">
            <ArrowLeft size={24} />
          </button>
          <span className="text-white/50 text-sm font-mono flex-1">
            STAGE {stage.id} — {stage.title}
          </span>
          <span className="text-amber-400/80 text-sm font-mono flex items-center gap-1">
            <Trophy size={14} />
            {totalScore.toLocaleString()}
          </span>
        </div>

        {/* HP Bar */}
        <div className="space-y-2 mb-3">
          <HPBar current={playerHP} max={9} label="プレイヤー" color="bg-gradient-to-r from-green-500 to-emerald-400" icon="🧑‍🔬" />
        </div>

        {/* Element progress dots */}
        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
          {elements.map((el, i) => (
            <div
              key={el.symbol}
              className={`w-4 h-4 rounded-full border transition-all ${
                collectedCards.includes(el.symbol)
                  ? "bg-green-400 border-green-400"
                  : i === elIdx
                  ? "bg-white border-white scale-125"
                  : i < elIdx
                  ? "bg-red-400/50 border-red-400/50"
                  : "bg-white/10 border-white/20"
              }`}
            />
          ))}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-sm text-white/40">
            カード <span className="text-white font-bold">{collectedCards.length}</span>/{clearThreshold}
          </div>
          {collectedCards.length >= clearThreshold && <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold animate-pulse">クリア確定！</span>}
          <div className="text-sm text-white/30">
            元素 {elIdx + 1}/{totalElements}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {/* Current element card */}
          <motion.div className="text-center" animate={shakeEnemy ? { x: [0, -10, 10, -10, 0] } : {}} transition={{ duration: 0.4 }}>
            {phase === 0 && stage.cardSheet && currentEl.cardCell ? (
              <div
                className="w-40 h-40 rounded-2xl border-2 border-amber-400/40 shadow-lg shadow-amber-500/10 overflow-hidden"
                style={{
                  backgroundImage: `url(${import.meta.env.BASE_URL}${stage.cardSheet})`,
                  backgroundSize: "300% 300%",
                  backgroundPosition: `${currentEl.cardCell[1] * 50}% ${currentEl.cardCell[0] * 50}%`,
                }}
              />
            ) : phase === 0 ? (
              <ElementCard element={currentEl} size="lg" revealed={false} />
            ) : (
              <ElementCard element={currentEl} size="lg" revealed={true} />
            )}
          </motion.div>

          {/* Phase indicator */}
          <div className="flex items-center gap-2 mb-1">
            {[0, 1, 2].map((p) => (
              <div
                key={p}
                className={`w-10 h-2 rounded-full transition-all ${
                  p < phase ? (phaseCorrect > p ? "bg-green-400" : "bg-red-400/50") : p === phase ? "bg-white" : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <span className={`text-xs font-bold ${questionData.phaseColor}`}>{questionData.phaseLabel}</span>

          {/* Combo */}
          <AnimatePresence>
            {combo > 1 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                <Zap size={14} className="text-amber-400" />
                <span className="text-amber-300 text-sm font-bold">{combo} COMBO!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question */}
          <div className="w-full">
            {actualHint && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 bg-green-500/20 text-green-400">💡</div>
                <p className="text-white/80 text-sm leading-relaxed pt-0.5">{actualHint}</p>
              </motion.div>
            )}
            <p className="text-white/90 text-center font-bold text-lg mb-4">{questionData.prompt}</p>
          </div>

          {/* Choices */}
          {!showResult && playerHP > 0 && (
            <div className="w-full grid grid-cols-2 gap-4">
              {questionData.options.map((opt, i) => (
                <motion.button
                  key={`${opt.value}-${i}`}
                  onClick={() => handleChoice(opt.value)}
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative flex items-center gap-3 rounded-2xl border-2 border-white/15 bg-gradient-to-br from-slate-700/80 to-slate-900/80 backdrop-blur-sm shadow-lg overflow-hidden w-full py-5 px-5 min-h-[72px] hover:border-white/30 hover:bg-white/10 active:scale-95 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <span className="text-white font-bold text-lg">{opt.label}</span>
                    {opt.sublabel && <span className="text-white/40 text-sm">{opt.sublabel}</span>}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Result with choices highlighted */}
          {showResult && playerHP > 0 && (
            <div className="w-full grid grid-cols-2 gap-4">
              {questionData.options.map((opt, i) => {
                const isCorrect = opt.value === questionData.correctValue;
                const isSelected = opt.value === selected;
                const bc = isCorrect ? "border-green-400 bg-green-500/10" : isSelected ? "border-red-400 bg-red-500/10" : "border-white/5 opacity-40";
                return (
                  <div key={`${opt.value}-${i}`} className={`relative rounded-2xl border-2 ${bc}`}>
                    <div className="relative flex items-center gap-3 rounded-2xl overflow-hidden w-full py-5 px-5 min-h-[72px]">
                      <span className="text-white font-bold text-lg">{opt.label}</span>
                      {opt.sublabel && <span className="text-white/40 text-sm">{opt.sublabel}</span>}
                    </div>
                    {isCorrect && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Result message */}
          <AnimatePresence>
            {showResult === "correct" && (
              <motion.div key="c" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-full p-4 rounded-2xl border-2 text-center bg-green-500/10 border-green-500/30">
                <p className="text-green-400 font-black text-xl">⚔️ 正解！</p>
                {phase === 2 && phaseCorrect === 3 && <p className="text-amber-300 text-base font-bold mt-1">🎴 {currentEl.answer} カードゲット！</p>}
                <motion.button onClick={advance} className="mt-3 px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-base cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {phase < 2 ? `次の問題（Q${phase + 2}）→` : elIdx + 1 < totalElements ? "次の元素へ →" : "結果を見る →"}
                </motion.button>
              </motion.div>
            )}
            {showResult === "wrong" && (
              <motion.div key="w" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-full p-4 rounded-2xl border-2 text-center bg-red-500/10 border-red-500/30">
                <p className="text-red-400 font-black text-xl">💥 不正解！</p>
                <p className="text-white/60 text-sm">
                  正解: {questionData.correctValue}
                </p>
                <motion.button onClick={advance} className="mt-3 px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-base cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {phase < 2 ? `次の問題（Q${phase + 2}）→` : elIdx + 1 < totalElements ? "次の元素へ →" : "結果を見る →"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RESULT SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function ResultScreen({ stage, result, onMap, onRetry }) {
  const totalEl = stage.questions.length;
  const clearTh = Math.ceil(totalEl * 2 / 3);
  const isPerfect = result.collected === totalEl;
  const isCleared = result.collected >= clearTh;
  const stars = Math.min(3, Math.ceil((result.collected / totalEl) * 3));
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (isPerfect) {
      const t = setTimeout(() => setShowConfetti(true), 800);
      return () => clearTimeout(t);
    }
  }, [isPerfect]);
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: isPerfect ? "linear-gradient(135deg,#1a0a2e,#2d1569 30%,#4a1942 60%,#1a0a2e)" : "linear-gradient(135deg,#0f0c29,#302b63 50%,#24243e)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isCleared && <Particles count={isPerfect ? 60 : 30} color={isPerfect ? "bg-amber-300" : "bg-yellow-400"} />}
      {showConfetti && <Confetti />}
      {isPerfect && (
        <>
          <FloatingEmoji emoji="🎉" count={4} />
          <FloatingEmoji emoji="✨" count={4} />
          <motion.div
            className="absolute w-80 h-80 rounded-full top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(circle,rgba(251,191,36,0.3) 0%,transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}
      <motion.div className="relative z-10 text-center max-w-sm w-full" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <motion.div
          className="text-7xl mb-3"
          animate={isPerfect ? { rotate: [0, 15, -15, 0], scale: [1, 1.4, 1] } : isCleared ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {isPerfect ? "👑" : isCleared ? "🏆" : result.remainingHP <= 0 ? "💀" : "😢"}
        </motion.div>
        {isPerfect ? (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7, type: "spring" }}>
            <h2 className="text-4xl font-black mb-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400">PERFECT!!</span>
            </h2>
            <motion.p className="text-amber-400/60 text-xs mb-4" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
              全カードコンプリート！
            </motion.p>
          </motion.div>
        ) : (
          <>
            <h2 className="text-3xl font-black text-white mb-1">{isCleared ? "ステージクリア！" : result.remainingHP <= 0 ? "ゲームオーバー..." : "あと少し！"}</h2>
            <p className={`text-sm mb-4 ${isCleared ? "text-green-400/80" : "text-amber-400/80"}`}>{isCleared ? `${result.collected}枚のカードをゲット！` : `${clearTh}枚以上でクリアだよ`}</p>
          </>
        )}
        <div className="flex justify-center gap-3 mb-4">
          {[1, 2, 3].map((s) => (
            <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.6 + s * 0.2, type: "spring" }}>
              <Star size={36} className={s <= stars ? `${isPerfect ? "text-amber-300" : "text-yellow-400"} fill-current drop-shadow-lg` : "text-white/15"} />
            </motion.div>
          ))}
        </div>
        {isPerfect && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring" }} className="mx-auto mb-3 w-fit px-5 py-1.5 rounded-full border-2 border-amber-400/50 bg-amber-500/10">
            <span className="text-amber-300 font-black text-xs">👑 PERFECT MASTER 👑</span>
          </motion.div>
        )}
        <div className={`border rounded-2xl p-4 mb-5 space-y-2 text-sm ${isPerfect ? "bg-amber-500/5 border-amber-500/20" : "bg-white/5 border-white/10"}`}>
          <div className="flex justify-between">
            <span className="text-white/50">獲得カード</span>
            <span className="text-white font-bold">
              {result.collected}/{totalEl}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">スコア</span>
            <span className="text-amber-300 font-bold">{(result.score || 0).toLocaleString()} pts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">最大コンボ</span>
            <span className="text-white font-bold">{result.maxCombo || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">残りHP</span>
            <span className="text-white font-bold">{result.remainingHP}/9</span>
          </div>
        </div>
        <div className="space-y-3">
          {!isPerfect && (
            <motion.button
              onClick={onRetry}
              className="w-full px-8 py-4 rounded-2xl font-bold text-white text-lg cursor-pointer"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Swords size={20} /> {isCleared ? "パーフェクトを目指す" : "もう一度挑戦する"}
              </span>
            </motion.button>
          )}
          <motion.button
            onClick={onMap}
            className={`w-full px-8 py-4 rounded-2xl font-bold text-white text-lg cursor-pointer ${isPerfect || isCleared ? "" : "bg-white/5 border border-white/15"}`}
            style={isPerfect ? { background: "linear-gradient(135deg,#d97706,#b45309)" } : isCleared ? { background: "linear-gradient(135deg,#7c3aed,#6d28d9)" } : {}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            マップに戻る
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ALL CLEAR SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function AllClearScreen({ onRestart, allPerfect }) {
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#1a0533,#2d1b69 30%,#44337a 70%,#1a0533)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Particles count={60} color="bg-amber-300" />
      {showConfetti && <Confetti />}
      <FloatingEmoji emoji="🏆" count={5} />
      <FloatingEmoji emoji="⭐" count={5} />
      <motion.div className="relative z-10 text-center" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <motion.div className="text-8xl mb-4" animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          👑
        </motion.div>
        <h1 className="text-4xl font-black mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
            {allPerfect ? "全ステージ PERFECT!!" : "全ステージクリア！"}
          </span>
        </h1>
        <p className="text-purple-300/60 text-sm mb-8">キミは立派な元素マスターだ！</p>
        <motion.button
          onClick={onRestart}
          className="px-10 py-4 rounded-2xl font-bold text-white text-lg cursor-pointer"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          もう一度冒険する
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN — ElementQuest
   ═══════════════════════════════════════════════════════════════════ */
export default function ElementQuest() {
  const { data, loaded, save, reset } = useGameStorage();
  const [gameState, setGameState] = useState("TITLE");
  const [currentStageId, setCurrentStageId] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  // Derive state from storage
  const clearedStages = data?.clearedStages || [];
  const perfectStages = data?.perfectStages || [];
  const stageScores = data?.stageScores || {};
  const bestScores = data?.bestScores || {};
  const discovered = data?.discovered || [];

  const currentStage = STAGES_DATA.find((s) => s.id === currentStageId);

  const handleSelectStage = (id) => {
    setCurrentStageId(id);
    setRetryKey((p) => p + 1);
    setGameState("GAME");
  };

  const handleFinishStage = (result) => {
    setLastResult(result);
    const stg = STAGES_DATA.find((s) => s.id === currentStageId);
    const totalEl = stg.questions.length;
    const clearTh = Math.ceil(totalEl * 2 / 3);
    const isCleared = result.collected >= clearTh;
    const isPerfect = result.collected === totalEl;

    const newDiscovered = [...new Set([...discovered, ...(result.discovered || [])])];
    const newCleared = isCleared ? [...new Set([...clearedStages, currentStageId])] : clearedStages;
    const newPerfect = isPerfect ? [...new Set([...perfectStages, currentStageId])] : perfectStages;
    const newStageScores = { ...stageScores };
    const existing = newStageScores[currentStageId];
    if (!existing || result.collected > (existing.collected || 0)) {
      newStageScores[currentStageId] = result;
    }
    const newBestScores = { ...bestScores };
    if (result.score > (newBestScores[currentStageId] || 0)) {
      newBestScores[currentStageId] = result.score;
    }

    save({
      clearedStages: newCleared,
      perfectStages: newPerfect,
      stageScores: newStageScores,
      bestScores: newBestScores,
      discovered: newDiscovered,
    });

    setGameState(newCleared.length === STAGES_DATA.length ? "CLEAR" : "RESULT");
  };

  const handleRetry = () => {
    setRetryKey((p) => p + 1);
    setGameState("GAME");
  };
  const handleMap = () => {
    setGameState("MAP");
    setCurrentStageId(null);
  };
  const handleRestart = () => {
    reset();
    setGameState("TITLE");
    setCurrentStageId(null);
    setLastResult(null);
  };

  if (!loaded)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div className="text-4xl" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          ⚗️
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950">
      <AnimatePresence mode="wait">
        {gameState === "TITLE" && <TitleScreen key="title" onStart={() => setGameState("MAP")} />}
        {gameState === "MAP" && (
          <MapScreen
            key="map"
            clearedStages={clearedStages}
            perfectStages={perfectStages}
            stageScores={stageScores}
            bestScores={bestScores}
            discovered={discovered}
            onSelectStage={handleSelectStage}
            onZukan={() => setGameState("ZUKAN")}
            onFusion={() => setGameState("FUSION")}
          />
        )}
        {gameState === "ZUKAN" && <ZukanScreen key="zukan" discovered={discovered} onBack={handleMap} />}
        {gameState === "FUSION" && <FusionScreen key="fusion" discovered={discovered} onBack={handleMap} />}
        {gameState === "GAME" && currentStage && <GameScreen key={`g-${currentStageId}-${retryKey}`} stage={currentStage} onFinish={handleFinishStage} onBack={handleMap} />}
        {gameState === "RESULT" && currentStage && lastResult && <ResultScreen key={`r-${retryKey}`} stage={currentStage} result={lastResult} onMap={handleMap} onRetry={handleRetry} />}
        {gameState === "CLEAR" && <AllClearScreen key="clear" onRestart={handleRestart} allPerfect={perfectStages.length === STAGES_DATA.length} />}
      </AnimatePresence>
    </div>
  );
}
