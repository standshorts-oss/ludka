"use client";
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Dices, 
  Trophy, 
  Wallet, 
  User, 
  Menu, 
  Bell, 
  History, 
  Settings, 
  ChevronRight,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- КОНСТАНТЫ ---
const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const SLOT_TYPES = [
  { id: 'classic', name: 'Sizzling Hot', icons: ['🍒', '🍋', '🍇', '🍉', '🔔', '7️⃣'] },
  { id: 'egypt', name: 'Book of Ra', icons: ['🏺', '🗿', '🔱', '🧿', '👑', '📜'] },
  { id: 'olympus', name: 'Gates of Zeus', icons: ['⚡', '☁️', '🏛️', '💎', '🔥', '🔱'] }
];

export default function DragonCasino() {
  const [balance, setBalance] = useState(10000.50);
  const [bet, setBet] = useState<number>(10);
  const [game, setGame] = useState<'slots' | 'roulette'>('slots');
  const [activeSlot, setActiveSlot] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [cheatMode, setCheatMode] = useState(false);
  const [lastWins, setLastWins] = useState<{user: string, win: number, game: string}[]>([]);

  // Генерация фейковой ленты выигрышей
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Ivan_Q', 'Master77', 'LuckyBoy', 'Dragon_X', 'Player_1337'];
      const games = ['Slots', 'Roulette', 'Crash', 'Battle'];
      const newWin = {
        user: names[Math.floor(Math.random() * names.length)],
        win: parseFloat((Math.random() * 5000).toFixed(2)),
        game: games[Math.floor(Math.random() * games.length)]
      };
      setLastWins(prev => [newWin, ...prev].slice(0, 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatMoney = (val: number) => val.toLocaleString('ru-RU', { minimumFractionDigits: 2 }) + ' ₽';

  // --- ЛОГИКА ---
  const handleSpin = () => {
    if (balance < bet) { setShowWallet(true); return; }
    setIsSpinning(true);
    setBalance(prev => prev - bet);

    setTimeout(() => {
      if (game === 'slots') {
        const symbols = SLOT_TYPES[activeSlot].icons;
        let res;
        if (cheatMode && Math.random() < 0.6) { // 60% шанс на вин в читах
          const s = symbols[Math.floor(Math.random() * symbols.length)];
          res = [s, s, s];
        } else {
          res = [symbols[0], symbols[1], symbols[2]].sort(() => Math.random() - 0.5);
        }
        setResult(res);
        if (res[0] === res[1] && res[1] === res[2]) {
          const win = bet * 15;
          setBalance(b => b + win);
          confetti();
        }
      } else {
        // Рулетка
        let roll;
        if (cheatMode && Math.random() < 0.8) {
          roll = RED_NUMBERS[0]; // Всегда на красное (если ставим на красное)
        } else {
          roll = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
        }
        setResult(roll);
        // Упрощенная логика: считаем, что игрок всегда ставит на красное для примера
        if (RED_NUMBERS.includes(roll)) {
          setBalance(b => b + bet * 2);
          confetti();
        }
      }
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#9ca3af] font-sans flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#16191e] border-r border-white/5 hidden lg:flex flex-col p-4">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-bold">D</div>
          <span className="text-white font-bold text-xl tracking-tight">DRAGON<span className="text-yellow-500">MONEY</span></span>
        </div>

        <nav className="space-y-1">
          <p className="text-[10px] uppercase font-bold opacity-30 mb-4 px-2 tracking-widest">Игровое меню</p>
          {[
            {icon: <Gamepad2 size={18}/>, name: 'Слоты', active: game === 'slots', id: 'slots'},
            {icon: <Dices size={18}/>, name: 'Рулетка', active: game === 'roulette', id: 'roulette'},
            {icon: <Zap size={18}/>, name: 'Crash', active: false},
            {icon: <Trophy size={18}/>, name: 'Турниры', active: false},
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => item.id && setGame(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'hover:bg-white/5'}`}
            >
              {item.icon} <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0b0c0f]">
          <div className="flex items-center gap-4">
            <Menu className="lg:hidden" />
            <div className="bg-[#1a1d23] px-4 py-2 rounded-lg flex items-center gap-3 border border-white/5">
              <span className="text-yellow-500 font-bold text-sm">{formatMoney(balance)}</span>
              <button onClick={() => setShowWallet(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black p-1 rounded-md transition-all">
                <PlusCircle size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Bell size={20} className="opacity-50" />
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white/20">
              U
            </div>
          </div>
        </header>

        {/* GAME SCREEN */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="max-w-4xl mx-auto">
            
            {/* GAME BOX */}
            <div className="bg-[#16191e] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative">
              
              {/* Fake Live Indicator */}
              <div className="absolute top-4 left-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Live Game</span>
              </div>

              <div className="p-12 flex flex-col items-center">
                {game === 'slots' ? (
                  <div className="w-full">
                    <div className="flex justify-center gap-3 mb-10">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-24 h-32 bg-[#0b0c0f] rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-white/5">
                          {isSpinning ? '🌀' : (result?.[i] || '🎰')}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-2 mb-8">
                      {SLOT_TYPES.map((s, i) => (
                        <button key={i} onClick={() => setActiveSlot(i)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeSlot === i ? 'bg-white text-black' : 'bg-white/5'}`}>
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className={`w-32 h-32 rounded-full border-[8px] border-[#0b0c0f] flex items-center justify-center text-4xl font-bold mb-10 shadow-2xl transition-all duration-[1000ms] ${isSpinning ? 'rotate-[720deg]' : ''} ${RED_NUMBERS.includes(result) ? 'text-red-500' : 'text-white'}`}>
                      {isSpinning ? '?' : result ?? '0'}
                    </div>
                  </div>
                )}

                {/* BET CONTROL */}
                <div className="w-full max-w-sm bg-[#0b0c0f] p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-[10px] font-bold uppercase opacity-40 mb-2">
                    <span>Сумма ставки</span>
                    <span>₽0.1 - ₽1M</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      value={bet} 
                      onChange={(e) => setBet(parseFloat(e.target.value))}
                      className="bg-transparent text-white font-bold text-lg outline-none w-full"
                    />
                    <div className="flex gap-1">
                      {[10, 100, 500].map(v => (
                        <button key={v} onClick={() => setBet(v)} className="px-2 py-1 bg-white/5 rounded-md text-[10px] hover:bg-white/10">{v}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`mt-6 w-full max-w-sm py-4 rounded-2xl font-black text-xl tracking-tighter uppercase transition-all active:scale-95 ${isSpinning ? 'bg-zinc-800' : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'}`}
                >
                  {isSpinning ? 'Ожидание...' : 'Начать игру'}
                </button>
              </div>
            </div>

            {/* LIVE FEED */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {lastWins.map((win, i) => (
                <div key={i} className="bg-[#16191e] p-3 rounded-xl border border-white/5 flex flex-col">
                  <span className="text-[10px] font-bold text-white/20 uppercase">{win.game}</span>
                  <span className="text-white text-xs font-bold truncate">{win.user}</span>
                  <span className="text-emerald-500 text-xs font-bold">+{win.win} ₽</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* WALLET MODAL (Secret Area) */}
      {showWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#16191e] border border-white/10 rounded-[32px] w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white font-bold">Кошелек</h3>
              <button onClick={() => setShowWallet(false)} className="text-white/20">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-yellow-500/50 mb-1">Способ оплаты</p>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Банковская карта</span>
                  <ChevronRight size={16} />
                </div>
              </div>
              
              <button onClick={() => setBalance(b => b + 100000)} className="w-full py-4 bg-[#1a1d23] rounded-2xl text-white font-bold hover:bg-[#21242c] transition-all">
                Пополнить баланс
              </button>

              {/* SECRET CHEAT TOGGLE (Hidden in plain sight) */}
              <div className="pt-4 flex justify-center">
                <button 
                  onDoubleClick={() => { setCheatMode(!cheatMode); alert(cheatMode ? 'System Secured' : 'Algorithm Rigged'); }}
                  className="text-[9px] text-white/5 uppercase tracking-[0.5em] hover:text-white/20 transition-all cursor-default"
                >
                  Transaction Secure Protocol 2.1.4
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusCircle({size}: {size: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}