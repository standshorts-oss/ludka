"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Dices, Wallet, PlusCircle, User, Menu, Bell, 
  ChevronRight, Zap, Trophy, History, Share2, ShieldCheck, 
  Gift, Percent, Rocket, Layers, Ghost, Ban, Coins, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- КОНСТАНТЫ ---
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const SLOT_SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];
const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

export default function UltimateDragonCasino() {
  // Состояние баланса и ставок
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(100);
  const [betTarget, setBetTarget] = useState<any>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  // Состояние игры
  const [game, setGame] = useState<'slots' | 'roulette'>('slots');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Модалки и Читы
  const [showWallet, setShowWallet] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [cheatMode, setCheatMode] = useState(false);
  
  // Бегущая строка
  const [tickerWins, setTickerWins] = useState([
    { name: 'Oleg_Top', amount: '15400', game: 'Crash' },
    { name: 'Drift_King', amount: '2200', game: 'Slots' },
    { name: 'Mama_Ya_V_Vegase', amount: '500', game: 'Roulette' },
    { name: 'Lucky_Boy', amount: '89000', game: 'Mines' },
    { name: 'User_772', amount: '12400', game: 'Battle' }
  ]);

  // Эффект промокода и обновления ленты
  useEffect(() => {
    const promoTimer = setTimeout(() => setShowPromo(true), 3000);
    const interval = setInterval(() => {
      const names = ['X-Master', 'Almaz_77', 'Kiruha', 'Dimon_Win', 'Casino_Killer', 'Rich_Man'];
      const games = ['Slots', 'Crash', 'Roulette', 'Mines'];
      const newWin = { 
        name: names[Math.floor(Math.random() * names.length)], 
        amount: (Math.random() * 5000 + 100).toFixed(0), 
        game: games[Math.floor(Math.random() * games.length)] 
      };
      setTickerWins(prev => [newWin, ...prev].slice(0, 10));
    }, 4000);
    return () => { clearTimeout(promoTimer); clearInterval(interval); };
  }, []);

  const formatMoney = (val: number) => val.toLocaleString('ru-RU') + ' ₽';

  // --- ИГРОВАЯ ЛОГИКА ---
  const handlePlay = () => {
    if (balance < bet) { setShowWallet(true); return; }
    if (game === 'roulette' && !betTarget) { alert('Выберите на что ставите!'); return; }
    
    setIsSpinning(true);
    setBalance(b => b - bet);

    setTimeout(() => {
      let winMultiplier = 0;

      if (game === 'slots') {
        let res;
        // ЧИТ: 70% шанс на джекпот
        if (cheatMode && Math.random() < 0.7) {
          res = ['7️⃣', '7️⃣', '7️⃣'];
        } else {
          res = [0,0,0].map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
        }
        setResult(res);
        if (res[0] === res[1] && res[1] === res[2]) winMultiplier = 20;
      } else {
        // РУЛЕТКА
        let roll;
        // ЧИТ: 85% шанс угадать
        if (cheatMode && Math.random() < 0.85) {
          if (betTarget === 'red') roll = 32;
          else if (betTarget === 'black') roll = 15;
          else if (betTarget === 'number') roll = selectedNumber!;
          else roll = 2;
        } else {
          roll = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
        }
        setResult(roll);
        
        if (betTarget === 'red' && RED_NUMBERS.includes(roll)) winMultiplier = 2;
        else if (betTarget === 'black' && !RED_NUMBERS.includes(roll) && roll !== 0) winMultiplier = 2;
        else if (betTarget === 'number' && roll === selectedNumber) winMultiplier = 36;
      }

      if (winMultiplier > 0) {
        const winAmount = bet * winMultiplier;
        setBalance(b => b + winAmount);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ffc600', '#ffffff'] });
      }
      setIsSpinning(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#9ca3af] font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#14161b] border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-yellow-500/20">D</div>
          <span className="text-white font-black text-xl tracking-tighter uppercase italic">Dragon<span className="text-yellow-500">M</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[10px] uppercase font-black opacity-20 px-4 mb-4 tracking-[0.2em]">Игровой зал</p>
          <NavItem icon={<Gamepad2 size={18}/>} name="Слоты" active={game === 'slots'} onClick={() => setGame('slots')} />
          <NavItem icon={<Dices size={18}/>} name="Рулетка" active={game === 'roulette'} onClick={() => setGame('roulette')} />
          <NavItem icon={<Rocket size={18}/>} name="Crash" active={false} tag="Hot" />
          <NavItem icon={<Layers size={18}/>} name="Mines" active={false} />
          
          <p className="text-[10px] uppercase font-black opacity-20 px-4 mt-8 mb-4 tracking-[0.2em]">Бонусы</p>
          <NavItem icon={<Gift size={18}/>} name="Кейсы" active={false} tag="New" />
          <NavItem icon={<Percent size={18}/>} name="Промокоды" active={false} onClick={() => setShowPromo(true)} />
        </nav>

        <div className="p-6">
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-yellow-500 uppercase mb-1">Ваш статус</p>
            <p className="text-white font-bold text-xs uppercase">Новичок</p>
            <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
              <div className="w-1/3 h-full bg-yellow-500" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* БЕГУЩАЯ СТРОКА (ИСПРАВЛЕННАЯ) */}
        <div className="h-10 bg-[#14161b] border-b border-white/5 flex items-center overflow-hidden relative">
          <div className="absolute left-0 inset-y-0 w-10 bg-gradient-to-r from-[#14161b] to-transparent z-10" />
          <div className="absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-[#14161b] to-transparent z-10" />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...tickerWins, ...tickerWins].map((win, i) => (
              <div key={i} className="flex items-center gap-2 px-6 border-r border-white/5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-white/90">{win.name}</span>
                <span className="text-[10px] opacity-30 uppercase">{win.game}</span>
                <span className="text-[11px] font-black text-emerald-500">+{win.amount} ₽</span>
              </div>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <header className="h-20 bg-[#0b0c0f]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <div className="bg-[#1a1d23] border border-white/10 p-1 rounded-2xl flex items-center shadow-inner">
              <div className="px-6 py-2 text-yellow-500 font-black text-xl tracking-tighter tabular-nums">
                {formatMoney(balance)}
              </div>
              <button onClick={() => setShowWallet(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black p-2.5 rounded-xl shadow-lg shadow-yellow-500/20 transition-all active:scale-90">
                <PlusCircle size={20} />
              </button>
            </div>
            <button onClick={() => setShowWithdraw(true)} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Вывод
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <Bell size={20} className="opacity-20" />
            <div className="flex flex-col text-right hidden sm:block">
              <span className="text-white font-bold text-sm block leading-none mb-1">Giga_Player</span>
              <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest">VIP LVL 1</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-zinc-700 to-zinc-900 rounded-xl border border-white/10" />
          </div>
        </header>

        {/* GAME ZONE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1d23] via-[#0b0c0f] to-[#0b0c0f]">
          <div className="max-w-4xl mx-auto">
            
            <div className="bg-[#14161b] rounded-[48px] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
              
              <div className="flex flex-col items-center">
                {game === 'slots' ? (
                  <div className="flex flex-col items-center w-full">
                    <div className="flex gap-4 mb-16">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`w-24 h-36 md:w-32 md:h-44 bg-[#0b0c0f] rounded-[32px] flex items-center justify-center text-5xl md:text-7xl border border-white/5 shadow-inner transition-all ${isSpinning ? 'animate-bounce opacity-50' : ''}`}>
                          {isSpinning ? '🌀' : (result?.[i] || '💎')}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <div className={`w-40 h-40 rounded-full border-[10px] border-[#0b0c0f] flex items-center justify-center text-5xl font-black mb-12 shadow-2xl transition-all duration-[1000ms] ${isSpinning ? 'rotate-[720deg]' : ''} ${RED_NUMBERS.includes(result) ? 'text-red-500 shadow-[0_0_30px_rgba(239,44,44,0.2)]' : 'text-white'}`}>
                      {isSpinning ? '?' : result ?? '0'}
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
                      <button onClick={() => {setBetTarget('red'); setSelectedNumber(null)}} className={`py-4 rounded-2xl font-black transition-all border-2 ${betTarget === 'red' ? 'bg-red-600 border-white scale-105' : 'bg-red-600/10 border-red-600/20 opacity-40'}`}>RED</button>
                      <button onClick={() => {setBetTarget('black'); setSelectedNumber(null)}} className={`py-4 rounded-2xl font-black transition-all border-2 ${betTarget === 'black' ? 'bg-zinc-800 border-white scale-105' : 'bg-zinc-800/20 border-white/10 opacity-40'}`}>BLACK</button>
                    </div>
                    <div className="grid grid-cols-6 gap-2 mb-10">
                      {[0, 1, 5, 10, 15, 20, 25, 30, 32, 33, 35, 36].map(n => (
                        <button key={n} onClick={() => {setBetTarget('number'); setSelectedNumber(n)}} className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${selectedNumber === n ? 'bg-yellow-500 text-black scale-110' : 'bg-white/5 opacity-30 hover:opacity-100'}`}>{n}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="w-full max-w-md bg-[#0b0c0f] p-6 rounded-[32px] border border-white/5 shadow-inner">
                  <div className="flex justify-between items-center mb-4 opacity-30 text-[10px] font-black uppercase tracking-widest px-2">
                    <span>Размер ставки</span>
                    <span>₽0.1 - ₽1M</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}
                      className="bg-transparent text-white font-black text-3xl outline-none w-full px-2"
                    />
                    <div className="flex gap-1">
                      <button onClick={() => setBet(b => Math.max(0.1, b/2))} className="w-10 h-10 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all text-[10px]">/2</button>
                      <button onClick={() => setBet(b => b*2)} className="w-10 h-10 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all text-[10px]">X2</button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePlay} disabled={isSpinning}
                  className="mt-8 w-full max-w-md py-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-[28px] font-black text-2xl uppercase tracking-tighter italic transition-all active:scale-95 shadow-[0_20px_40px_rgba(234,179,8,0.2)]"
                >
                  {isSpinning ? 'Удача близко...' : 'Испытать удачу'}
                </button>
              </div>
            </div>

            {/* ИЛЛЮЗИЯ ВЫБОРА */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10">
              <FakeCard icon="🚀" name="Crash" />
              <FakeCard icon="💣" name="Mines" />
              <FakeCard icon="🃏" name="Baccarat" />
              <FakeCard icon="📦" name="Cases" />
            </div>
          </div>
        </div>
      </main>

      {/* МОДАЛКИ */}
      <Modal isOpen={showWallet} onClose={() => setShowWallet(false)} title="Пополнение">
        <div className="space-y-6">
          <div className="bg-[#0b0c0f] p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black uppercase opacity-20 mb-2">Введите сумму (₽)</p>
            <input type="number" id="depInput" defaultValue="1000" className="bg-transparent text-white text-4xl font-black outline-none w-full" />
          </div>
          <button onClick={() => {
            const val = (document.getElementById('depInput') as HTMLInputElement).value;
            setBalance(b => b + Number(val || 0));
            setShowWallet(false);
          }} className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl text-xl uppercase italic">Оплатить через СБП</button>
          
          <div className="pt-4 flex justify-center opacity-5">
             <button onDoubleClick={() => {setCheatMode(!cheatMode); alert(cheatMode ? 'OFF' : 'ON');}} className="text-[8px] tracking-[0.5em] cursor-default">
               DEBUG_MODE_TX_882_SSL
             </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} title="Вывод средств">
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban size={40} />
          </div>
          <h4 className="text-white font-black text-xl uppercase italic mb-2">Ошибка безопасности</h4>
          <p className="text-sm opacity-40 px-6">Ваш аккаунт не прошел автоматическую верификацию. Для вывода необходимо достичь оборота <span className="text-yellow-500 font-bold">₽250,000</span>.</p>
          <button onClick={() => setShowWithdraw(false)} className="mt-8 px-8 py-4 bg-white/5 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Продолжить играть</button>
        </div>
      </Modal>

      <Modal isOpen={showPromo} onClose={() => setShowPromo(false)} title="🎁 Ваш бонус">
        <div className="text-center py-4 space-y-6">
          <div className="text-5xl animate-bounce">🎰</div>
          <h4 className="text-3xl font-black text-white italic uppercase">Код: <span className="text-yellow-500 underline">LUDKA2024</span></h4>
          <p className="text-sm opacity-50 px-6">Введите этот код при пополнении, чтобы получить <span className="text-emerald-500 font-bold">+25%</span> к сумме депозита!</p>
          <button onClick={() => setShowPromo(false)} className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl text-xl uppercase italic">Забрать купон</button>
        </div>
      </Modal>

      {/* АНИМАЦИИ */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover { animation-play-state: paused; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

function NavItem({icon, name, active, tag, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${active ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-inner' : 'hover:bg-white/5'}`}>
      <div className="flex items-center gap-3">
        <span className={active ? 'text-yellow-500' : 'text-white/20 group-hover:text-white transition-all'}>{icon}</span>
        <span className="font-bold text-sm tracking-tight">{name}</span>
      </div>
      {tag && <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{tag}</span>}
    </button>
  );
}

function FakeCard({icon, name}: any) {
  return (
    <div className="bg-[#14161b] p-6 rounded-[32px] border border-white/5 hover:border-white/20 transition-all cursor-not-allowed group opacity-60">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-all duration-500">{icon}</div>
      <h5 className="text-white font-bold text-xs uppercase tracking-widest">{name}</h5>
      <div className="flex items-center gap-1.5 mt-2">
        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-bold opacity-20 uppercase">In Dev</span>
      </div>
    </div>
  );
}

function Modal({isOpen, onClose, title, children}: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#14161b] border border-white/10 rounded-[48px] w-full max-w-lg shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
          <h3 className="text-white font-black text-2xl italic uppercase tracking-tighter">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 text-white/50 transition-all">✕</button>
        </div>
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
}