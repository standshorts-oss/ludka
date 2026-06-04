"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, Dices, Wallet, PlusCircle, Bell, ChevronRight, 
  Zap, Trophy, History, Gift, Percent, Rocket, Layers, Ban, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- ДАННЫЕ И КОНСТАНТЫ ---
const NAMES_POOL = ['Ivan_777', 'Sanya_Pro', 'Lucky_Oleg', 'Dimon_Vegas', 'Vanya_Zanoz', 'Kirill_Gold', 'Artem_Top', 'Vlad_Rich', 'Nikita_Win', 'Igor_Nsk', 'Stas_Borets', 'Oleg_AllIn', 'Roma_Donat', 'Igor_Zanoz', 'Toha_Milliard', 'Serega_777', 'Artur_Money', 'Sasha_Rich', 'Misha_Zoloto', 'Borya_Win', 'Artem_Top', 'Vlad_Lucky', 'Kostya_Pro', 'Nikita_Gold', 'Danya_Mega', 'Pudge_Fan', 'Dotersha_3', 'Pavel_Techno', 'Giga_Chel', 'Master_Shifu', 'Turbo_Snail', 'Kira_Lox', 'Aleksey_Rich', 'Vovan_Turbo', 'Master_Splinter', 'Dimas_007', 'Lom_44', 'Grisha_Grizli', 'Sanya_V_Pluse', 'Den_Nalichka', 'Max_Bet', 'Pudge_Win', 'Dota_Lover', 'Kripto_Baron', 'Zhenya_Keks', 'Marat_King', 'Ludik_Pro', 'Antoxa_Shans', 'Petya_Jackpot', 'Vitya_Vegas', 'Bez_Deneg', 'Azart_Nsk', 'Mell_Fan', 'Rich_Bitch', 'Dragon_Lord', 'King_Of_Slots', 'Money_Maker', 'Big_Win_Guy', 'Slot_Masher', 'Bet_Master', 'Gold_Digger', 'Rich_Man_77', 'Lucky_Strike', 'Seven_Up', 'Cherry_Picker', 'Diamond_Eyes', 'Bell_Ringer', 'Fruit_Loop', 'Star_Dust', 'Moon_Light', 'Night_Owl', 'Early_Bird', 'Fast_Cash', 'Slow_Mo', 'Easy_Money', 'Hard_Work', 'Play_Boy', 'Game_Changer', 'Rule_Breaker', 'Risk_Taker', 'High_Roller', 'Low_Rider', 'Ace_In_Hole', 'Jack_Potter', 'Queen_Bee', 'King_Pin', 'Joker_Wild', 'Wild_Card', 'Free_Spin', 'Bonus_Round', 'Max_Payout', 'Huge_Win', 'Mega_Moolah', 'Super_Star', 'Ultra_Rich', 'Legend_Pavel', 'Mythic_Sanya', 'Epic_Ivan', 'Rare_Oleg', 'Common_Dimon', 'Golden_Vanya', 'Silver_Kirill', 'Bronze_Artem', 'Iron_Vlad', 'Steel_Nikita', 'Copper_Igor', 'Platinum_Stas', 'Titanium_Roma', 'Diamond_Artur', 'Emerald_Sasha', 'Ruby_Misha', 'Sapphire_Borya', 'Topaz_Artem', 'Onyx_Vlad', 'Crystal_Kostya', 'Pearl_Nikita', 'Amber_Danya', 'Jade_Pavel', 'Lazuli_Sanya', 'Quartz_Ivan', 'Jasper_Oleg', 'Agate_Dimon', 'Malachite_Vanya', 'Citrine_Kirill', 'Ametrine_Artem', 'Peridot_Vlad', 'Zircon_Nikita', 'Spinel_Igor', 'Tanzanite_Stas', 'Morganite_Roma', 'Kunizite_Artur', 'Iolite_Sasha', 'Sunstone_Misha', 'Moonstone_Borya', 'Larimar_Artem', 'Apatite_Vlad', 'Fluorite_Kostya', 'Sodalite_Nikita', 'Kyanite_Danya', 'Variscite_Pavel', 'Charoite_Sanya', 'Sugilite_Ivan', 'Rhodonite_Oleg', 'Prehnite_Dimon', 'Zhenya_22', 'Maga_05', 'Gordiy_Orel', 'Bmw_M5', 'Sanya_Perekup', 'Dimas_Kashiri', 'Vitek_Ogon', 'Seryi_Volk', 'Maks_Betov', 'Andryuha_Win'];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const SLOT_SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];

export default function MegaCasino() {
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(100);
  const [game, setGame] = useState<'slots' | 'roulette'>('slots');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [cheatMode, setCheatMode] = useState(false);

  // Состояния для Рулетки
  const [selectedBetType, setSelectedBetType] = useState<string | null>(null);
  const [selectedBetValue, setSelectedBetValue] = useState<any>(null);

  // Состояния для Слотов
  const [lines, setLines] = useState(1);
  const [reels, setReels] = useState([['💎','💎','💎'],['💎','💎','💎'],['💎','💎','💎']]);

  // Бегущая строка
  const [tickerWins, setTickerWins] = useState<any[]>([]);

  // Инициализация ленты выигрышей
  useEffect(() => {
    const games = ['Crash', 'Slots', 'Mines', 'Roulette', 'Battle', 'Tower'];
    
    const createWin = () => ({
      name: NAMES_POOL[Math.floor(Math.random() * NAMES_POOL.length)],
      amount: (Math.random() * 15000 + 100).toFixed(0),
      game: games[Math.floor(Math.random() * games.length)]
    });

    setTickerWins(Array.from({length: 10}, createWin));

    const loop = () => {
      const delay = Math.floor(Math.random() * 7000) + 3000;
      setTimeout(() => {
        setTickerWins(prev => [createWin(), ...prev.slice(0, 14)]);
        loop();
      }, delay);
    };
    loop();
    setTimeout(() => setShowPromo(true), 4000);
  }, []);

  const formatMoney = (val: number) => val.toLocaleString('ru-RU') + ' ₽';

  // --- ЛОГИКА РУЛЕТКИ ---
  const handleRouletteSpin = () => {
    if (balance < bet) return setShowWallet(true);
    if (!selectedBetType) return alert("Выберите зону для ставки на поле!");

    setIsSpinning(true);
    setBalance(b => b - bet);

    setTimeout(() => {
      let roll: number;
      // ЧИТ: 90% шанс на успех
      if (cheatMode && Math.random() < 0.9) {
        if (selectedBetType === 'number') roll = selectedBetValue;
        else if (selectedBetType === 'color' && selectedBetValue === 'red') roll = 1;
        else if (selectedBetType === 'color' && selectedBetValue === 'black') roll = 2;
        else if (selectedBetType === 'dozen') roll = (selectedBetValue - 1) * 12 + 1;
        else roll = 0;
      } else {
        roll = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
      }

      setResult(roll);
      setIsSpinning(false);

      // Проверка выигрыша
      let winMultiplier = 0;
      if (selectedBetType === 'number' && roll === selectedBetValue) winMultiplier = 36;
      if (selectedBetType === 'color') {
        const isRed = RED_NUMBERS.includes(roll);
        if (selectedBetValue === 'red' && isRed) winMultiplier = 2;
        if (selectedBetValue === 'black' && !isRed && roll !== 0) winMultiplier = 2;
      }
      if (selectedBetType === 'evenodd') {
        if (selectedBetValue === 'even' && roll !== 0 && roll % 2 === 0) winMultiplier = 2;
        if (selectedBetValue === 'odd' && roll % 2 !== 0) winMultiplier = 2;
      }
      if (selectedBetType === 'dozen') {
        if (selectedBetValue === 1 && roll >= 1 && roll <= 12) winMultiplier = 3;
        if (selectedBetValue === 2 && roll >= 13 && roll <= 24) winMultiplier = 3;
        if (selectedBetValue === 3 && roll >= 25 && roll <= 36) winMultiplier = 3;
      }

      if (winMultiplier > 0) {
        setBalance(b => b + bet * winMultiplier);
        confetti({ particleCount: 150, spread: 60, colors: ['#FFC600'] });
      }
    }, 1500);
  };

  // --- ЛОГИКА СЛОТОВ ---
  const handleSlotsSpin = () => {
    const totalCost = bet * lines;
    if (balance < totalCost) return setShowWallet(true);

    setIsSpinning(true);
    setBalance(b => b - totalCost);

    setTimeout(() => {
      let newReels;
      if (cheatMode && Math.random() < 0.7) {
        const s = '7️⃣';
        newReels = [[s,s,s],[s,s,s],[s,s,s]];
      } else {
        newReels = [0,1,2].map(() => [0,1,2].map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]));
      }
      setReels(newReels);
      setIsSpinning(false);

      // Простая проверка линий (горизонтали)
      let wins = 0;
      if (lines >= 1 && newReels[1][0] === newReels[1][1] && newReels[1][1] === newReels[1][2]) wins++;
      if (lines >= 2 && newReels[0][0] === newReels[0][1] && newReels[0][1] === newReels[0][2]) wins++;
      if (lines >= 3 && newReels[2][0] === newReels[2][1] && newReels[2][1] === newReels[2][2]) wins++;
      
      if (wins > 0) {
        setBalance(b => b + (totalCost * wins * 10));
        confetti();
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#9ca3af] font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#14161b] border-r border-white/5 flex flex-col hidden xl:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">D</div>
          <span className="text-white font-black text-xl italic tracking-tighter uppercase">Dragon<span className="text-yellow-500">M</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<Gamepad2 size={18}/>} name="Слоты" active={game === 'slots'} onClick={() => setGame('slots')} />
          <NavItem icon={<Dices size={18}/>} name="Рулетка" active={game === 'roulette'} onClick={() => setGame('roulette')} />
          <NavItem icon={<Rocket size={18}/>} name="Crash" tag="Hot" />
          <NavItem icon={<Layers size={18}/>} name="Mines" />
          <NavItem icon={<Gift size={18}/>} name="Кейсы" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* БЕГУЩАЯ СТРОКА */}
        <div className="h-10 bg-[#14161b] border-b border-white/5 flex items-center overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...tickerWins, ...tickerWins].map((w, i) => (
              <div key={i} className="flex items-center gap-4 px-8 border-r border-white/5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-white/90">{w.name}</span>
                <span className="text-[10px] opacity-30 uppercase tracking-widest">{w.game}</span>
                <span className="text-[11px] font-black text-emerald-500">+{w.amount} ₽</span>
              </div>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <header className="h-20 bg-[#0b0c0f]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-4">
            <div className="bg-[#1a1d23] border border-white/10 p-1 rounded-2xl flex items-center shadow-inner">
              <div className="px-6 py-2 text-yellow-500 font-black text-xl tracking-tighter tabular-nums">{formatMoney(balance)}</div>
              <button onClick={() => setShowWallet(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black p-2.5 rounded-xl shadow-lg shadow-yellow-500/20 transition-all active:scale-90">
                <PlusCircle size={20} />
              </button>
            </div>
            <button onClick={() => setShowWithdraw(true)} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Вывод</button>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="opacity-20" />
            <div className="w-10 h-10 bg-zinc-800 rounded-xl border border-white/10" />
          </div>
        </header>

        {/* GAME AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1d23] via-[#0b0c0f] to-[#0b0c0f]">
          <div className="max-w-6xl mx-auto">
            
            <div className="bg-[#14161b] rounded-[48px] border border-white/10 p-6 md:p-12 shadow-2xl relative">
              
              {game === 'roulette' ? (
                <div className="flex flex-col items-center">
                  {/* Wheel Result */}
                  <div className={`w-32 h-32 rounded-full border-[10px] border-[#0d0e12] flex items-center justify-center text-4xl font-black mb-10 transition-all duration-[1000ms] ${isSpinning ? 'rotate-[720deg] scale-110' : ''} ${RED_NUMBERS.includes(result) ? 'bg-red-600' : result === 0 ? 'bg-emerald-600' : 'bg-zinc-900'}`}>
                    {isSpinning ? '?' : result ?? '—'}
                  </div>

                  {/* ПОЛНОЕ ПОЛЕ РУЛЕТКИ */}
                  <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex min-w-[800px] gap-1">
                      {/* Zero */}
                      <div onClick={() => {setSelectedBetType('number'); setSelectedBetValue(0)}} className={`w-14 h-full flex items-center justify-center rounded-l-xl font-bold border-2 cursor-pointer transition-all ${selectedBetValue === 0 ? 'bg-emerald-500 border-white text-white' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500'}`}>0</div>
                      
                      <div className="flex-1 grid grid-cols-12 grid-rows-3 gap-1 h-48">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36].map(num => {
                          const isRed = RED_NUMBERS.includes(num);
                          const active = selectedBetType === 'number' && selectedBetValue === num;
                          return (
                            <div 
                              key={num} 
                              onClick={() => {setSelectedBetType('number'); setSelectedBetValue(num)}}
                              className={`flex items-center justify-center rounded-md font-bold text-sm border-2 cursor-pointer transition-all ${active ? 'bg-yellow-500 border-white text-black scale-105 z-10' : isRed ? 'bg-red-600 border-transparent text-white' : 'bg-zinc-800 border-transparent text-white'}`}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Special Zones */}
                    <div className="flex min-w-[800px] ml-14 mt-2 gap-1 h-12">
                      <button onClick={() => {setSelectedBetType('dozen'); setSelectedBetValue(1)}} className={`flex-1 rounded-md font-bold text-[10px] uppercase border-2 ${selectedBetType === 'dozen' && selectedBetValue === 1 ? 'bg-white text-black border-yellow-500' : 'bg-white/5 border-white/5'}`}>1st 12</button>
                      <button onClick={() => {setSelectedBetType('dozen'); setSelectedBetValue(2)}} className={`flex-1 rounded-md font-bold text-[10px] uppercase border-2 ${selectedBetType === 'dozen' && selectedBetValue === 2 ? 'bg-white text-black border-yellow-500' : 'bg-white/5 border-white/5'}`}>2nd 12</button>
                      <button onClick={() => {setSelectedBetType('dozen'); setSelectedBetValue(3)}} className={`flex-1 rounded-md font-bold text-[10px] uppercase border-2 ${selectedBetType === 'dozen' && selectedBetValue === 3 ? 'bg-white text-black border-yellow-500' : 'bg-white/5 border-white/5'}`}>3rd 12</button>
                    </div>
                    <div className="flex min-w-[800px] ml-14 mt-1 gap-1 h-12">
                      <button onClick={() => {setSelectedBetType('color'); setSelectedBetValue('red')}} className={`flex-1 rounded-md font-bold uppercase text-[10px] border-2 bg-red-600 ${selectedBetType === 'color' && selectedBetValue === 'red' ? 'border-white scale-105' : 'border-transparent opacity-60'}`}>Красное</button>
                      <button onClick={() => {setSelectedBetType('color'); setSelectedBetValue('black')}} className={`flex-1 rounded-md font-bold uppercase text-[10px] border-2 bg-zinc-800 ${selectedBetType === 'color' && selectedBetValue === 'black' ? 'border-white scale-105' : 'border-transparent opacity-60'}`}>Черное</button>
                      <button onClick={() => {setSelectedBetType('evenodd'); setSelectedBetValue('even')}} className={`flex-1 rounded-md font-bold uppercase text-[10px] border-2 bg-white/5 ${selectedBetType === 'evenodd' && selectedBetValue === 'even' ? 'bg-white text-black border-white' : 'border-white/5'}`}>Четное</button>
                      <button onClick={() => {setSelectedBetType('evenodd'); setSelectedBetValue('odd')}} className={`flex-1 rounded-md font-bold uppercase text-[10px] border-2 bg-white/5 ${selectedBetType === 'evenodd' && selectedBetValue === 'odd' ? 'bg-white text-black border-white' : 'border-white/5'}`}>Нечетное</button>
                    </div>
                  </div>

                  <button onClick={handleRouletteSpin} disabled={isSpinning} className="mt-10 w-full max-w-md py-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-3xl font-black text-2xl uppercase shadow-xl transition-all active:scale-95">Сделать ставку</button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-3 gap-4 mb-10 relative">
                    {/* Visual Lines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-center gap-[30%] opacity-20">
                      {[1, 2, 3, 4, 5].slice(0, lines).map(l => <div key={l} className="w-full h-1 bg-yellow-500" />)}
                    </div>
                    {reels.map((col, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        {col.map((s, j) => (
                          <div key={j} className={`w-24 h-24 md:w-32 md:h-32 bg-[#0b0c0f] rounded-2xl flex items-center justify-center text-5xl border border-white/5 shadow-inner transition-all ${isSpinning ? 'animate-bounce opacity-40' : ''}`}>
                            {isSpinning ? '🌀' : s}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-8">
                    {[1, 3, 5].map(num => (
                      <button key={num} onClick={() => setLines(num)} className={`px-6 py-2 rounded-xl font-black text-xs uppercase border-2 transition-all ${lines === num ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5'}`}>{num} Линии</button>
                    ))}
                  </div>

                  <button onClick={handleSlotsSpin} disabled={isSpinning} className="w-full max-w-md py-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-3xl font-black text-2xl uppercase transition-all active:scale-95 shadow-xl shadow-yellow-500/10">Крутить ${bet * lines}</button>
                </div>
              )}

              {/* CONTROLS */}
              <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase opacity-30 px-2 tracking-widest">Ставка (₽)</span>
                  <div className="flex items-center gap-2 bg-[#0b0c0f] p-2 rounded-2xl border border-white/5">
                    <input type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="bg-transparent text-white font-black text-2xl outline-none w-24 px-2" />
                    <button onClick={() => setBet(b => Math.max(0.1, b/2))} className="px-3 py-2 bg-white/5 rounded-lg text-[10px] font-bold">/2</button>
                    <button onClick={() => setBet(b => b*2)} className="px-3 py-2 bg-white/5 rounded-lg text-[10px] font-bold">X2</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[100, 500, 1000, 5000, 10000].map(v => (
                    <button key={v} onClick={() => setBet(v)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${bet === v ? 'bg-white text-black shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}>₽{v}</button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {showWallet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="bg-[#14161b] border border-white/10 rounded-[40px] w-full max-w-md p-10 shadow-2xl">
            <h3 className="text-white font-black text-3xl uppercase italic mb-6">Кошелек</h3>
            <div className="space-y-6">
              <div className="bg-[#0b0c0f] p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black opacity-20 uppercase mb-2 tracking-widest">Сумма пополнения (₽)</p>
                <input type="number" id="depInput" defaultValue="5000" className="bg-transparent text-white text-4xl font-black outline-none w-full" />
              </div>
              <button onClick={() => {
                const val = (document.getElementById('depInput') as HTMLInputElement).value;
                setBalance(b => b + Number(val || 0));
                setShowWallet(false);
              }} className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl text-xl uppercase shadow-lg shadow-yellow-500/10">Пополнить через СБП</button>
              <div className="pt-4 flex justify-center opacity-5">
                 <button onDoubleClick={() => {setCheatMode(!cheatMode); alert(cheatMode ? 'OFF' : 'ON');}} className="text-[8px] cursor-default">TX_882_DEBUG_PROTOCOL_AUTH_V3</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWithdraw && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="bg-[#14161b] border border-white/10 rounded-[40px] w-full max-w-md p-10 text-center">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Ban size={40}/></div>
            <h4 className="text-white font-black text-2xl uppercase italic mb-4 tracking-tighter">Ошибка безопасности</h4>
            <p className="text-sm opacity-40 px-6 leading-relaxed uppercase font-bold text-[10px] tracking-widest">Аккаунт не прошел проверку KYC. Для разблокировки вывода необходимо иметь суммарный оборот ставок более <span className="text-yellow-500">250,000 ₽</span>.</p>
            <button onClick={() => setShowWithdraw(false)} className="mt-10 px-10 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Понял, продолжаю играть</button>
          </div>
        </div>
      )}

      {showPromo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-[40px] p-1 shadow-[0_0_100px_rgba(234,179,8,0.3)]">
            <div className="bg-[#14161b] rounded-[38px] p-10 text-center max-w-sm">
               <div className="text-6xl mb-6 animate-bounce">🎰</div>
               <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Бонус +25%</h4>
               <p className="text-sm opacity-50 mb-8 font-medium">Активируй промокод <span className="text-yellow-500 font-bold underline">DRAGON2024</span> при следующем пополнении!</p>
               <button onClick={() => setShowPromo(false)} className="w-full py-5 bg-yellow-500 text-black font-black rounded-2xl text-xl uppercase italic shadow-xl shadow-yellow-500/10 active:scale-95 transition-all">Забрать бонус</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: max-content; animation: marquee 40s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function NavItem({icon, name, active, tag, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${active ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'hover:bg-white/5 opacity-40 hover:opacity-100'}`}>
      <div className="flex items-center gap-3">
        <span className={active ? 'text-yellow-500' : 'text-white'}>{icon}</span>
        <span className="font-bold text-sm tracking-tight uppercase">{name}</span>
      </div>
      {tag && <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">{tag}</span>}
    </button>
  );
}