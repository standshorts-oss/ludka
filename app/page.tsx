"use client";
import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const SLOT_SYMBOLS = ['🍒', '🍋', '🍇', '🔔', '💎', '7️⃣'];

export default function Casino() {
  const [mode, setMode] = useState<'fair' | 'cheat'>('fair');
  const [balance, setBalance] = useState(5000);
  const [bet, setBet] = useState(100);
  const [game, setGame] = useState<'slots' | 'roulette'>('slots');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const isCheat = mode === 'cheat';

  const playSlots = () => {
    if (balance < bet) return alert("Жми кнопку пополнения!");
    setIsSpinning(true);
    setBalance(b => b - bet);
    setTimeout(() => {
      let res;
      if (Math.random() < (isCheat ? 0.7 : 0.1)) {
        const s = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        res = [s, s, s];
      } else {
        res = [SLOT_SYMBOLS[0], SLOT_SYMBOLS[1], SLOT_SYMBOLS[2]].sort(() => Math.random() - 0.5);
      }
      setResult(res);
      setIsSpinning(false);
      if (res[0] === res[1]) { setBalance(b => b + bet * 10); confetti(); }
    }, 700);
  };

  const playRoulette = (color: 'red' | 'black') => {
    if (balance < bet) return alert("Жми кнопку пополнения!");
    setIsSpinning(true);
    setBalance(b => b - bet);
    setTimeout(() => {
      let num;
      if (Math.random() < (isCheat ? 0.8 : 0.48)) {
        num = color === 'red' ? 32 : 15; // Просто даем выигрышный номер
      } else {
        num = Math.floor(Math.random() * 37);
      }
      setResult(num);
      setIsSpinning(false);
      const win = color === 'red' ? RED_NUMBERS.includes(num) : (!RED_NUMBERS.includes(num) && num !== 0);
      if (win) { setBalance(b => b + bet * 2); confetti(); }
    }, 1000);
  };

  return (
    <div className={`min-h-screen p-8 transition-all ${isCheat ? 'bg-zinc-950 text-purple-400' : 'bg-emerald-950 text-white'} font-mono`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8 bg-black/40 p-4 rounded-2xl border border-white/10">
          <div>
            <p className="text-xs opacity-50 uppercase">Баланс</p>
            <p className="text-2xl font-bold text-yellow-500">${balance.toLocaleString()}</p>
          </div>
          <button onClick={() => setMode(isCheat ? 'fair' : 'cheat')} className={`px-4 py-2 rounded-full text-xs font-bold ${isCheat ? 'bg-purple-600 text-white' : 'bg-emerald-600'}`}>
            {isCheat ? "😈 ЧИТЫ: ВКЛ" : "🛡️ ЧЕСТНО"}
          </button>
        </div>

        <div className="bg-white/5 p-6 rounded-[30px] border border-white/10 text-center shadow-2xl">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setGame('slots')} className={`flex-1 py-2 rounded-xl ${game === 'slots' ? 'bg-white text-black' : 'bg-white/10'}`}>СЛОТЫ</button>
            <button onClick={() => setGame('roulette')} className={`flex-1 py-2 rounded-xl ${game === 'roulette' ? 'bg-white text-black' : 'bg-white/10'}`}>РУЛЕТКА</button>
          </div>

          {game === 'slots' ? (
            <div>
              <div className="flex justify-center gap-2 mb-8">
                {(isSpinning ? ['🌀', '🌀', '🌀'] : (Array.isArray(result) ? result : ['❓','❓','❓'])).map((s,i) => (
                  <div key={i} className="w-20 h-24 bg-white rounded-lg flex items-center justify-center text-4xl text-black">{s}</div>
                ))}
              </div>
              <button onClick={playSlots} className="w-full py-4 bg-yellow-500 text-black font-black rounded-xl text-xl">КРУТИТЬ</button>
            </div>
          ) : (
            <div>
              <div className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-3xl font-bold border-4 ${result !== null && RED_NUMBERS.includes(result) ? 'bg-red-600' : 'bg-zinc-800'}`}>
                {isSpinning ? '?' : result ?? '0'}
              </div>
              <div className="flex gap-2">
                <button onClick={() => playRoulette('red')} className="flex-1 py-4 bg-red-600 rounded-xl font-bold">RED</button>
                <button onClick={() => playRoulette('black')} className="flex-1 py-4 bg-zinc-900 rounded-xl font-bold border border-white/20">BLACK</button>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <button onClick={() => setBalance(b => b + 5000)} className="text-xs text-yellow-500 underline">ДОБАВИТЬ $5000</button>
            <div className="flex gap-2">
              {[100, 500, 1000].map(v => (
                <button key={v} onClick={() => setBet(v)} className={`w-12 h-8 rounded text-[10px] ${bet === v ? 'bg-white text-black' : 'bg-white/10'}`}>${v}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}