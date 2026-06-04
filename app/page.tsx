"use client";
import React, { useState } from 'react';
import { Sparkles, Zap, ShieldCheck, Ghost, Coins, PlusCircle, History, RotateCcw, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const SLOT_SYMBOLS = ['🍒', '🍋', '🍇', '🔔', '💎', '7️⃣'];

export default function LuxuryCasino() {
  const [mode, setMode] = useState<'fair' | 'cheat'>('fair');
  const [balance, setBalance] = useState(5000);
  const [bet, setBet] = useState(100);
  const [game, setGame] = useState<'slots' | 'roulette'>('slots');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showATM, setShowATM] = useState(false);

  const isCheat = mode === 'cheat';

  const spinSlots = () => {
    if (balance < bet) { setShowATM(true); return; }
    setIsSpinning(true);
    setBalance(prev => prev - bet);
    setTimeout(() => {
      let final;
      // В чит-режиме шанс победы 70%, в обычном 15%
      if (Math.random() < (isCheat ? 0.7 : 0.15)) {
        const s = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        final = [s, s, s];
      } else {
        final = [...SLOT_SYMBOLS].sort(() => Math.random() - 0.5).slice(0, 3);
      }
      setResult(final);
      setIsSpinning(false);
      if (final[0] === final[1] && final[1] === final[2]) {
        setBalance(p => p + bet * 10);
        confetti();
      }
    }, 800);
  };

  const spinRoulette = (target: 'red' | 'black') => {
    if (balance < bet) { setShowATM(true); return; }
    setIsSpinning(true);
    setBalance(prev => prev - bet);
    setTimeout(() => {
      let roll;
      // В чит-режиме шанс угадать цвет 85%, в обычном 48%
      if (Math.random() < (isCheat ? 0.85 : 0.48)) {
        const pool = ROULETTE_NUMBERS.filter(n => target === 'red' ? RED_NUMBERS.includes(n) : (!RED_NUMBERS.includes(n) && n !== 0));
        roll = pool[Math.floor(Math.random() * pool.length)];
      } else {
        roll = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
      }
      setResult(roll);
      setIsSpinning(false);
      const isWin = target === 'red' ? RED_NUMBERS.includes(roll) : (!RED_NUMBERS.includes(roll) && roll !== 0);
      if (isWin) { setBalance(p => p + bet * 2); confetti(); }
    }, 1000);
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${isCheat ? 'bg-slate-950 text-purple-400' : 'bg-emerald-950 text-white'} p-4 md:p-10 font-sans`}>
      
      {/* ATM MODAL */}
      {showATM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border-2 border-yellow-500 rounded-[40px] p-10 max-w-sm w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.4)]">
            <h2 className="text-4xl font-black mb-4 text-white uppercase italic">Банкомат</h2>
            <p className="text-white/60 mb-8">Удача любит смелых! Вот тебе еще немного монет.</p>
            <button 
              onClick={() => { setBalance(b => b + 50000); setShowATM(false); }}
              className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl text-xl transition-transform active:scale-95 mb-4"
            >
              ВЗЯТЬ $50,000
            </button>
            <button onClick={() => setShowATM(false)} className="text-white/40 uppercase text-xs font-bold tracking-widest">Закрыть</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-black/40 p-6 rounded-[32px] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-2xl text-black shadow-lg">
            <Coins size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter leading-none">GIGA CASINO</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Best Luck Edition</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] uppercase font-black opacity-40 mb-1">Твой Баланс</p>
            <p className="text-3xl font-black text-yellow-500 tracking-tighter">${balance.toLocaleString()}</p>
          </div>
          <button 
            onClick={() => setMode(isCheat ? 'fair' : 'cheat')}
            className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 ${isCheat ? 'bg-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.5)]' : 'bg-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}
          >
            {isCheat ? <Ghost className="animate-bounce" /> : <ShieldCheck />}
            <span>{isCheat ? "ЧИТ-МОД: ВКЛ" : "РЕЖИМ: ЧЕСТНЫЙ"}</span>
          </button>
        </div>
      </header>

      {/* GAME AREA */}
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setGame('slots')} className={`px-10 py-4 rounded-2xl font-black transition-all ${game === 'slots' ? 'bg-white text-black scale-105 shadow-xl' : 'bg-black/40 opacity-50 hover:opacity-100'}`}>СЛОТЫ</button>
          <button onClick={() => setGame('roulette')} className={`px-10 py-4 rounded-2xl font-black transition-all ${game === 'roulette' ? 'bg-white text-black scale-105 shadow-xl' : 'bg-black/40 opacity-50 hover:opacity-100'}`}>РУЛЕТКА</button>
        </div>

        <div className={`relative overflow-hidden rounded-[50px] border-4 p-12 transition-all duration-500 ${isCheat ? 'bg-slate-900 border-purple-500/30 shadow-[0_0_100px_rgba(168,85,247,0.1)]' : 'bg-emerald-900/40 border-emerald-500/30'}`}>
          {game === 'slots' ? (
            <div className="flex flex-col items-center">
              <div className="flex gap-6 mb-16 relative">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`w-28 h-40 bg-gradient-to-b from-white to-gray-200 rounded-3xl flex items-center justify-center text-6xl shadow-2xl text-black border-b-8 border-gray-400 ${isSpinning ? 'animate-bounce' : ''}`} style={{animationDelay: `${i*0.1}s`}}>
                    {isSpinning ? '🌀' : (Array.isArray(result) ? result[i] : '7️⃣')}
                  </div>
                ))}
              </div>
              <button 
                onClick={spinSlots} 
                disabled={isSpinning}
                className={`w-full max-w-md py-8 rounded-[30px] text-4xl font-black transition-all active:scale-95 shadow-2xl ${isCheat ? 'bg-purple-500 hover:bg-purple-400' : 'bg-yellow-500 hover:bg-yellow-400 text-black'}`}
              >
                {isSpinning ? 'КРУТИМ...' : `ИГРАТЬ $${bet}`}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className={`w-48 h-48 rounded-full border-[12px] mb-12 flex items-center justify-center text-6xl font-black shadow-2xl transition-all duration-[1000ms] ${isSpinning ? 'rotate-[720deg] scale-110' : ''} ${result !== null && RED_NUMBERS.includes(result) ? 'bg-red-600 border-red-400' : result === 0 ? 'bg-emerald-500 border-emerald-300' : 'bg-zinc-900 border-zinc-700'}`}>
                {isSpinning ? '?' : result ?? '0'}
              </div>
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <button onClick={() => spinRoulette('red')} disabled={isSpinning} className="py-6 bg-red-600 hover:bg-red-500 rounded-[24px] font-black text-2xl shadow-xl active:scale-95 transition-all border-b-4 border-red-800">КРАСНОЕ</button>
                <button onClick={() => spinRoulette('black')} disabled={isSpinning} className="py-6 bg-zinc-900 hover:bg-zinc-800 rounded-[24px] font-black text-2xl shadow-xl active:scale-95 transition-all border-b-4 border-black border border-white/10">ЧЕРНОЕ</button>
              </div>
            </div>
          )}

          <div className="mt-16 flex flex-col items-center">
            <p className="text-[10px] uppercase font-black opacity-30 mb-4 tracking-widest text-white">Выбери свою ставку</p>
            <div className="flex gap-3">
              {[100, 500, 1000, 5000].map(val => (
                <button 
                  key={val} 
                  onClick={() => setBet(val)} 
                  className={`w-20 h-12 rounded-xl font-bold transition-all border-2 ${bet === val ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30 text-white'}`}
                >
                  ${val}
                </button>
              ))}
              <button onClick={() => setShowATM(true)} className="px-4 h-12 bg-yellow-500 text-black rounded-xl font-black flex items-center gap-2 hover:bg-yellow-400 transition-all"><PlusCircle size={18} /> $$$</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center opacity-20 text-[10px] font-bold tracking-[0.5em] uppercase text-white">
        For entertainment purposes only • Gigachad Casino 2024
      </footer>
    </div>
  );
}