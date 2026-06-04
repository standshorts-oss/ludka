"use client";
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Dices, Wallet, PlusCircle, User, 
  Menu, Bell, ChevronRight, Zap, Trophy, History 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const SLOT_SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];

type BetType = 'red' | 'black' | 'even' | 'odd' | 'number' | null;

export default function ProCasino() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('1000');
  const [bet, setBet] = useState<number>(10);
  const [betTarget, setBetTarget] = useState<BetType>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  const [game, setGame] = useState<'slots' | 'roulette'>('slots');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [cheatMode, setCheatMode] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const formatMoney = (val: number) => val.toLocaleString('ru-RU') + ' ₽';

  // --- ЛОГИКА ВЫИГРЫША ---
  const checkWin = (roll: number) => {
    if (betTarget === 'red' && RED_NUMBERS.includes(roll)) return 2;
    if (betTarget === 'black' && !RED_NUMBERS.includes(roll) && roll !== 0) return 2;
    if (betTarget === 'even' && roll !== 0 && roll % 2 === 0) return 2;
    if (betTarget === 'odd' && roll % 2 !== 0) return 2;
    if (betTarget === 'number' && roll === selectedNumber) return 36;
    return 0;
  };

  const playRoulette = () => {
    if (!betTarget) return alert("Выберите на что ставите!");
    if (balance < bet) { setShowWallet(true); return; }
    
    setIsSpinning(true);
    setBalance(b => b - bet);

    setTimeout(() => {
      let roll;
      // ЧИТ-МОД: 80% шанс что выпадет то, что выбрал игрок
      if (cheatMode && Math.random() < 0.8) {
        if (betTarget === 'red') roll = 32;
        else if (betTarget === 'black') roll = 15;
        else if (betTarget === 'number') roll = selectedNumber!;
        else roll = 2;
      } else {
        roll = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
      }

      setResult(roll);
      setIsSpinning(false);
      const multiplier = checkWin(roll);

      if (multiplier > 0) {
        const win = bet * multiplier;
        setBalance(b => b + win);
        setLogs(p => [{m: `Выигрыш: ${win} ₽`, w: true}, ...p]);
        confetti();
      } else {
        setLogs(p => [{m: `Проигрыш: -${bet} ₽`, w: false}, ...p]);
      }
    }, 1500);
  };

  const playSlots = () => {
    if (balance < bet) { setShowWallet(true); return; }
    setIsSpinning(true);
    setBalance(b => b - bet);

    setTimeout(() => {
      let res;
      if (cheatMode && Math.random() < 0.6) {
        const s = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        res = [s, s, s];
      } else {
        res = [0, 0, 0].map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
      }
      setResult(res);
      setIsSpinning(false);
      if (res[0] === res[1] && res[1] === res[2]) {
        const win = bet * 20;
        setBalance(b => b + win);
        confetti();
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#9ca3af] font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#15171c] border-r border-white/5 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-8 px-2 py-4">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-yellow-500/20">D</div>
          <span className="text-white font-black text-2xl tracking-tighter">DRAGON</span>
        </div>
        
        <button onClick={() => setGame('slots')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${game === 'slots' ? 'bg-yellow-500/10 text-yellow-500 shadow-inner' : 'hover:bg-white/5'}`}>
          <Gamepad2 size={20} /> Слоты
        </button>
        <button onClick={() => setGame('roulette')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${game === 'roulette' ? 'bg-yellow-500/10 text-yellow-500 shadow-inner' : 'hover:bg-white/5'}`}>
          <Dices size={20} /> Рулетка
        </button>
        <div className="mt-auto p-4 bg-[#1a1d23] rounded-2xl border border-white/5">
          <p className="text-[10px] uppercase font-bold opacity-30 mb-2">Live Wins</p>
          <div className="space-y-2">
            {logs.slice(0, 3).map((l, i) => (
              <div key={i} className={`text-[11px] font-bold ${l.w ? 'text-emerald-500' : 'text-red-500/50'}`}>{l.m}</div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-[#0d0e12] border-b border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-[#1a1d23] border border-white/5 p-1 rounded-2xl">
            <div className="px-4 py-2 text-yellow-500 font-black text-lg">{formatMoney(balance)}</div>
            <button onClick={() => setShowWallet(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-sm transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2">
              <PlusCircle size={16} /> ПОПОЛНИТЬ
            </button>
          </div>
          <div className="flex gap-4">
            <Bell size={20} className="opacity-20" />
            <div className="w-10 h-10 bg-zinc-800 rounded-full border border-white/10" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="max-w-5xl mx-auto">
            
            <div className="bg-[#15171c] rounded-[40px] border border-white/5 p-12 shadow-2xl relative overflow-hidden">
              
              {game === 'roulette' ? (
                <div className="flex flex-col items-center">
                  {/* РУЛЕТКА UI */}
                  <div className={`w-32 h-32 rounded-full border-8 border-[#0d0e12] flex items-center justify-center text-4xl font-black mb-12 shadow-2xl transition-all duration-[1000ms] ${isSpinning ? 'rotate-[720deg]' : ''} ${RED_NUMBERS.includes(result) ? 'text-red-500' : 'text-white'}`}>
                    {isSpinning ? '?' : result ?? '0'}
                  </div>

                  {/* СТАВКИ */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mb-12">
                    <button onClick={() => {setBetTarget('red'); setSelectedNumber(null)}} className={`py-4 rounded-xl font-black border-2 transition-all ${betTarget === 'red' ? 'bg-red-600 border-white' : 'bg-red-600/20 border-red-600/40 text-red-500'}`}>КРАСНОЕ</button>
                    <button onClick={() => {setBetTarget('black'); setSelectedNumber(null)}} className={`py-4 rounded-xl font-black border-2 transition-all ${betTarget === 'black' ? 'bg-zinc-800 border-white text-white' : 'bg-zinc-800/50 border-white/10 text-white/40'}`}>ЧЕРНОЕ</button>
                    <button onClick={() => {setBetTarget('even'); setSelectedNumber(null)}} className={`py-4 rounded-xl font-black border-2 transition-all ${betTarget === 'even' ? 'bg-white text-black' : 'bg-white/5 border-white/10'}`}>ЧЕТНОЕ</button>
                    <button onClick={() => {setBetTarget('odd'); setSelectedNumber(null)}} className={`py-4 rounded-xl font-black border-2 transition-all ${betTarget === 'odd' ? 'bg-white text-black' : 'bg-white/5 border-white/10'}`}>НЕЧЕТ</button>
                  </div>
                  
                  <div className="w-full max-w-2xl mb-8">
                    <p className="text-center text-[10px] font-bold uppercase mb-4 opacity-30">Или выберите число (X36)</p>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
                      {ROULETTE_NUMBERS.slice(0, 24).map(n => (
                        <button 
                          key={n} 
                          onClick={() => {setBetTarget('number'); setSelectedNumber(n)}}
                          className={`py-2 rounded-md text-xs font-bold transition-all ${selectedNumber === n ? 'bg-yellow-500 text-black scale-110 z-10' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={playRoulette} disabled={isSpinning} className="w-full max-w-md py-6 bg-yellow-500 text-black rounded-[24px] font-black text-2xl shadow-xl shadow-yellow-500/10 active:scale-95 transition-all uppercase italic tracking-tighter">Сделать ставку</button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-10">
                  <div className="flex gap-4 mb-16">
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`w-28 h-40 bg-[#0d0e12] rounded-3xl flex items-center justify-center text-6xl shadow-inner border border-white/5 ${isSpinning ? 'animate-bounce' : ''}`}>
                        {isSpinning ? '🌀' : (result?.[i] || '💎')}
                      </div>
                    ))}
                  </div>
                  <button onClick={playSlots} disabled={isSpinning} className="w-full max-w-md py-6 bg-yellow-500 text-black rounded-[24px] font-black text-2xl shadow-xl shadow-yellow-500/10 active:scale-95 transition-all uppercase">Крутить слоты</button>
                </div>
              )}

              {/* ПАНЕЛЬ СТАВКИ */}
              <div className="mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase opacity-30">Сумма ставки (₽)</span>
                  <div className="flex items-center gap-3 bg-[#0d0e12] p-2 rounded-2xl border border-white/5">
                    <input 
                      type="number" 
                      value={bet} 
                      onChange={(e) => setBet(Number(e.target.value))}
                      className="bg-transparent text-white font-black text-xl outline-none px-4 w-32"
                    />
                    <div className="flex gap-1">
                      <button onClick={() => setBet(b => b / 2)} className="w-10 h-10 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10 text-white">/2</button>
                      <button onClick={() => setBet(b => b * 2)} className="w-10 h-10 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10 text-white">x2</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[10, 50, 100, 500, 1000, 5000].map(v => (
                    <button key={v} onClick={() => setBet(v)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${bet === v ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10'}`}>₽{v}</button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* WALLET MODAL */}
      {showWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#15171c] border border-white/10 rounded-[40px] w-full max-w-md shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white font-black text-2xl uppercase italic">Кошелек</h3>
              <button onClick={() => setShowWallet(false)} className="text-white/20 hover:text-white transition-all">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase opacity-30 ml-2">Сумма пополнения</label>
                <div className="bg-[#0d0e12] p-4 rounded-2xl border border-white/5 flex items-center">
                  <input 
                    type="number" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-transparent text-white font-black text-2xl outline-none w-full"
                    placeholder="0.00"
                  />
                  <span className="text-yellow-500 font-black text-xl">₽</span>
                </div>
              </div>
              
              <button 
                onClick={() => { setBalance(b => b + Number(depositAmount)); setShowWallet(false); }}
                className="w-full py-5 bg-yellow-500 text-black rounded-2xl font-black text-xl shadow-lg shadow-yellow-500/10 hover:bg-yellow-400 transition-all"
              >
                ПОПОЛНИТЬ СЧЕТ
              </button>

              <div className="pt-4 flex flex-col items-center">
                <p className="text-[9px] font-medium opacity-20 uppercase tracking-widest text-center mb-4">Безопасное соединение SSL 256-bit</p>
                {/* SECRET AREA */}
                <button 
                  onDoubleClick={() => {setCheatMode(!cheatMode); alert(cheatMode ? 'Security: Normal' : 'Security: Bypass Active');}}
                  className="text-[8px] text-white/5 hover:text-white/20 transition-all cursor-default select-none"
                >
                  TXID: 882-991-002-BETA-V{cheatMode ? '1' : '0'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}