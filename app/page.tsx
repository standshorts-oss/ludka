"use client";
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Dices, Wallet, PlusCircle, User, Menu, Bell, 
  ChevronRight, Zap, Trophy, History, Share2, ShieldCheck, 
  Gift, Percent, Rocket, Layers, Ghost, Ban
} from 'lucide-react';
import confetti from 'canvas-confetti';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const SLOT_SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];

export default function MegaDragonCasino() {
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(100);
  const [betTarget, setBetTarget] = useState<any>(null);
  const [game, setGame] = useState<'slots' | 'roulette'>('slots');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [cheatMode, setCheatMode] = useState(false);
  const [tickerWins, setTickerWins] = useState<any[]>([]);

  // Инициализация фейковых данных и промо
  useEffect(() => {
    setTimeout(() => setShowPromo(true), 2000);
    const interval = setInterval(() => {
      const names = ['Oleg_Top', 'Drift_King', 'Mama_Ya_V_Vegase', 'User_992', 'Vanya777', 'Kiruha_G'];
      const games = ['Crash', 'Slots', 'Mines', 'Roulette'];
      const win = { name: names[Math.floor(Math.random() * names.length)], amount: (Math.random() * 10000).toFixed(0), game: games[Math.floor(Math.random() * games.length)] };
      setTickerWins(prev => [win, ...prev].slice(0, 15));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatMoney = (val: number) => val.toLocaleString('ru-RU') + ' ₽';

  const handleAction = () => {
    if (balance < bet) { setShowWallet(true); return; }
    setIsSpinning(true);
    setBalance(b => b - bet);

    setTimeout(() => {
      let win = 0;
      if (game === 'slots') {
        const res = cheatMode && Math.random() < 0.7 ? ['7️⃣', '7️⃣', '7️⃣'] : [0,0,0].map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
        setResult(res);
        if (res[0] === res[1] && res[1] === res[2]) win = bet * 25;
      } else {
        const roll = cheatMode && Math.random() < 0.8 ? (betTarget === 'red' ? 32 : 15) : Math.floor(Math.random() * 37);
        setResult(roll);
        if ((betTarget === 'red' && RED_NUMBERS.includes(roll)) || (betTarget === 'black' && !RED_NUMBERS.includes(roll) && roll !== 0)) win = bet * 2;
      }
      
      if (win > 0) {
        setBalance(b => b + win);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFC600', '#FFFFFF'] });
      }
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#9ca3af] font-sans flex overflow-hidden selection:bg-yellow-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#14161b] border-r border-white/5 flex flex-col p-5 gap-2 z-20">
        <div className="flex items-center gap-3 mb-8 px-2 py-2">
          <div className="w-11 h-11 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">D</div>
          <div>
            <span className="text-white font-black text-2xl tracking-tighter block leading-none">DRAGON</span>
            <span className="text-yellow-500 text-[10px] font-bold tracking-[0.3em] uppercase">Money Edition</span>
          </div>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
          <p className="text-[10px] uppercase font-black opacity-20 mb-4 px-2 tracking-widest">Игровой зал</p>
          <NavItem icon={<Rocket size={18}/>} name="Crash" active={false} tag="Hot" />
          <NavItem icon={<Gamepad2 size={18}/>} name="Слоты" active={game === 'slots'} onClick={() => setGame('slots')} />
          <NavItem icon={<Dices size={18}/>} name="Рулетка" active={game === 'roulette'} onClick={() => setGame('roulette')} />
          <NavItem icon={<Layers size={18}/>} name="Mines" active={false} />
          
          <p className="text-[10px] uppercase font-black opacity-20 mt-8 mb-4 px-2 tracking-widest">Бонусы</p>
          <NavItem icon={<Gift size={18}/>} name="Кейсы" active={false} tag="New" />
          <NavItem icon={<Percent size={18}/>} name="Промокоды" onClick={() => setShowPromo(true)} active={false} />
          <NavItem icon={<Trophy size={18}/>} name="Задания" active={false} />
        </nav>
      </aside>

      {/* MAIN SECTION */}
      <main className="flex-1 flex flex-col relative">
        
        {/* TOP TICKER (LIVE WINS) */}
        <div className="h-10 bg-[#14161b] border-b border-white/5 flex items-center overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee py-2">
            {tickerWins.map((w, i) => (
              <div key={i} className="flex items-center gap-2 px-6 border-r border-white/5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                <span className="text-[11px] font-bold text-white/80">{w.name}</span>
                <span className="text-[11px] opacity-40 uppercase">{w.game}</span>
                <span className="text-[11px] font-black text-emerald-500">{w.amount} ₽</span>
              </div>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <header className="h-20 px-8 flex items-center justify-between bg-[#0b0c0f]/80 backdrop-blur-xl z-10 border-b border-white/5">
          <div className="flex gap-4 items-center">
            <div className="bg-[#1a1d23] border border-white/10 rounded-2xl flex items-center p-1 shadow-inner">
              <div className="px-5 py-2 text-yellow-500 font-black text-xl tracking-tighter tabular-nums">
                {formatMoney(balance)}
              </div>
              <button onClick={() => setShowWallet(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-xl transition-all shadow-lg shadow-yellow-500/20 active:scale-90">
                <PlusCircle size={20} />
              </button>
            </div>
            <button onClick={() => setShowWithdraw(true)} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
              Вывод
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-white font-bold text-sm">Gigachad_Player</span>
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">VIP Status</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl shadow-lg border border-white/20 flex items-center justify-center text-black font-black">GP</div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1d23] via-[#0b0c0f] to-[#0b0c0f]">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* GAME PANEL */}
            <div className="bg-[#14161b] rounded-[48px] border border-white/10 p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"/>
              
              <div className="flex flex-col items-center">
                {game === 'slots' ? (
                  <div className="py-10 flex flex-col items-center w-full">
                    <div className="flex gap-4 mb-16">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`w-32 h-44 bg-[#0b0c0f] rounded-[32px] flex items-center justify-center text-7xl shadow-inner border border-white/5 transition-all ${isSpinning ? 'animate-bounce scale-95 opacity-50' : 'scale-100'}`}>
                          {isSpinning ? '🌀' : (result?.[i] || '💎')}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center">
                    <div className={`w-48 h-48 rounded-full border-[12px] border-[#0b0c0f] flex items-center justify-center text-6xl font-black shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-12 transition-all duration-[1000ms] ${isSpinning ? 'rotate-[720deg]' : ''} ${RED_NUMBERS.includes(result) ? 'text-red-500' : 'text-white'}`}>
                      {isSpinning ? '?' : result ?? '0'}
                    </div>
                    <div className="flex gap-4 mb-10">
                      <button onClick={() => setBetTarget('red')} className={`px-12 py-5 rounded-2xl font-black transition-all border-4 ${betTarget === 'red' ? 'bg-red-600 border-white scale-110 shadow-lg' : 'bg-red-600/20 border-red-600/40 opacity-50'}`}>RED</button>
                      <button onClick={() => setBetTarget('black')} className={`px-12 py-5 rounded-2xl font-black transition-all border-4 ${betTarget === 'black' ? 'bg-zinc-800 border-white scale-110 shadow-lg' : 'bg-zinc-800/50 border-white/10 opacity-50'}`}>BLACK</button>
                    </div>
                  </div>
                )}

                <div className="w-full max-w-lg bg-[#0b0c0f]/50 backdrop-blur-md p-8 rounded-[32px] border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30">Bet Configuration</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-500">Max Bet: 1M ₽</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}
                      className="bg-transparent text-white font-black text-4xl outline-none w-full tabular-nums"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setBet(b => Math.max(0.1, b/2))} className="px-4 py-2 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all">/2</button>
                      <button onClick={() => setBet(b => b*2)} className="px-4 py-2 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all">x2</button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAction} disabled={isSpinning}
                  className="mt-10 w-full max-w-lg py-7 bg-yellow-500 hover:bg-yellow-400 text-black rounded-[28px] font-black text-3xl transition-all active:scale-95 shadow-[0_15px_40px_rgba(234,179,8,0.3)] uppercase tracking-tighter italic"
                >
                  {isSpinning ? 'Удача близко...' : 'Забрать куш'}
                </button>
              </div>
            </div>

            {/* FAKE CARDS (ILLUSION OF CHOICE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FakeGameCard name="Crash" img="🚀" players="1,402" />
              <FakeGameCard name="Mines" img="💣" players="892" />
              <FakeGameCard name="Battle" img="⚔️" players="45" tag="PvP" />
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <Modal isOpen={showWallet} onClose={() => setShowWallet(false)} title="Пополнение баланса">
        <div className="space-y-6">
          <div className="bg-[#0b0c0f] p-6 rounded-3xl border border-white/5">
            <span className="text-[10px] font-black opacity-30 uppercase block mb-2">Введите сумму</span>
            <input type="number" className="bg-transparent text-3xl font-black text-white outline-none w-full" placeholder="1000" id="depInput" />
          </div>
          <button onClick={() => {
            const val = (document.getElementById('depInput') as HTMLInputElement).value;
            setBalance(b => b + Number(val || 1000));
            setShowWallet(false);
          }} className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl text-xl shadow-xl hover:bg-yellow-400 transition-all">ОПЛАТИТЬ КАРТОЙ</button>
          <div className="pt-4 flex justify-center">
            <button onDoubleClick={() => {setCheatMode(!cheatMode); alert(cheatMode ? 'Bypass: Off' : 'Bypass: Active');}} className="text-[8px] text-white/5 hover:text-white/20 transition-all uppercase tracking-[0.5em]">TX_SECURE_AUTH_882</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} title="Вывод средств">
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban size={40} />
          </div>
          <h4 className="text-white font-black text-xl mb-2 italic">ОШИБКА ВЕРИФИКАЦИИ</h4>
          <p className="text-sm opacity-50 leading-relaxed">Для вывода средств ваш аккаунт должен иметь статус <span className="text-yellow-500 font-bold italic underline">ULTRA-GIGACHAD</span>. <br/>Продолжайте играть для повышения уровня!</p>
          <button onClick={() => setShowWithdraw(false)} className="mt-8 px-10 py-4 bg-white/5 rounded-2xl font-bold uppercase text-xs tracking-widest">Понял, играю дальше</button>
        </div>
      </Modal>

      <Modal isOpen={showPromo} onClose={() => setShowPromo(false)} title="🎁 ЛИЧНЫЙ БОНУС">
        <div className="text-center space-y-6">
          <div className="text-5xl mb-4 animate-bounce">🔥</div>
          <h4 className="text-2xl font-black text-white italic leading-tight uppercase">Промокод: <span className="text-yellow-500 underline">LUDKA2024</span></h4>
          <p className="text-sm opacity-60 px-4">Активируй этот код при пополнении и получи <span className="text-emerald-500 font-bold">+25%</span> к депозиту прямо сейчас!</p>
          <button onClick={() => setShowPromo(false)} className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl text-xl shadow-xl hover:bg-yellow-400 transition-all uppercase italic">ЗАБРАТЬ БОНУС</button>
        </div>
      </Modal>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}

// Вспомогательные компоненты
function NavItem({icon, name, active, tag, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${active ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'hover:bg-white/5'}`}>
      <div className="flex items-center gap-3">
        <span className={active ? 'text-yellow-500' : 'text-white/40 group-hover:text-white transition-all'}>{icon}</span>
        <span className="font-bold text-sm tracking-tight">{name}</span>
      </div>
      {tag && <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{tag}</span>}
    </button>
  );
}

function FakeGameCard({name, img, players, tag}: any) {
  return (
    <div className="bg-[#14161b] p-6 rounded-[32px] border border-white/5 hover:border-white/20 transition-all cursor-not-allowed group relative overflow-hidden">
      {tag && <div className="absolute top-4 right-4 bg-indigo-600 text-[8px] font-black px-2 py-1 rounded text-white uppercase">{tag}</div>}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-all duration-500">{img}</div>
      <h5 className="text-white font-bold mb-1">{name}</h5>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/>
        <span className="text-[10px] font-bold opacity-30 uppercase">{players} Online</span>
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