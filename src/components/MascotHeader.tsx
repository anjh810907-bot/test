import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Moon, Sun, Dices, Sparkles, UtensilsCrossed, BarChart3 } from 'lucide-react';
import { playPopSound, playDiceSound } from '../utils/audio';

interface MascotHeaderProps {
  currentTab: 'home' | 'history';
  onSelectTab: (tab: 'home' | 'history') => void;
  nickname: string;
  onRerollNickname: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  bubbleMessage: string;
  onMascotClick: () => void;
}

export default function MascotHeader({
  currentTab,
  onSelectTab,
  nickname,
  onRerollNickname,
  soundEnabled,
  onToggleSound,
  darkMode,
  onToggleTheme,
  bubbleMessage,
  onMascotClick,
}: MascotHeaderProps) {
  const [isWiggling, setIsWiggling] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const handleMascotTap = () => {
    setIsWiggling(true);
    playPopSound(soundEnabled);
    onMascotClick();
    setTimeout(() => setIsWiggling(false), 600);
  };

  const handleReroll = () => {
    setIsRolling(true);
    playDiceSound(soundEnabled);
    onRerollNickname();
    setTimeout(() => setIsRolling(false), 500);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-purple-950/80 border-b border-purple-100 dark:border-purple-900/60 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top bar: Brand & Tool Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
              title="도토리급식 홈으로 이동"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 flex items-center justify-center text-xl shadow-md shadow-purple-300/40 dark:shadow-purple-950 group-hover:scale-105 active:scale-95 transition-transform">
                🌰
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                    도토리급식
                  </h1>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 dark:bg-purple-900/80 text-purple-700 dark:text-purple-300 rounded-full">
                    학교맛방
                  </span>
                </div>
                <p className="text-xs text-purple-700/70 dark:text-purple-300/70 hidden sm:block font-medium">
                  내가 심은 도토리 메뉴, 다음 주 식판에 쏙!
                </p>
              </div>
            </button>
          </div>

          {/* Right Controls: Nickname + Theme + Sound */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Nickname Pill with Dice Reroll */}
            <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/40 border border-purple-200/80 dark:border-purple-800/80 rounded-full px-2.5 py-1 text-xs text-purple-800 dark:text-purple-200 shadow-xs">
              <span className="font-semibold truncate max-w-[110px] sm:max-w-[150px]">
                {nickname}
              </span>
              <button
                onClick={handleReroll}
                aria-label="닉네임 새로고침"
                title="새로운 동물 닉네임 뽑기"
                className={`p-1 rounded-full hover:bg-purple-200/70 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-300 transition-all ${
                  isRolling ? 'rotate-180 scale-125 text-fuchsia-500' : ''
                }`}
              >
                <Dices className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              title={soundEnabled ? '효과음 켜짐' : '효과음 음소거됨'}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                soundEnabled
                  ? 'bg-purple-100/80 dark:bg-purple-900/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              title={darkMode ? '부드러운 라벤더 모드' : '포근한 밤하늘 모드'}
              className="p-2 rounded-xl border border-purple-200/80 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all active:scale-95"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Mascot Ttori Dialogue Banner */}
        <div className="mt-3 flex items-center gap-3 bg-gradient-to-r from-purple-100/70 via-fuchsia-50/70 to-pink-100/70 dark:from-purple-900/40 dark:via-fuchsia-950/30 dark:to-purple-900/40 border border-purple-200/60 dark:border-purple-800/50 rounded-2xl p-2.5 sm:px-4 shadow-xs">
          {/* Mascot Squirrel Ttori */}
          <button
            onClick={handleMascotTap}
            className={`relative flex-shrink-0 w-11 h-11 rounded-2xl bg-white dark:bg-purple-900 shadow-sm border border-purple-200 dark:border-purple-700 flex items-center justify-center text-2xl transition-transform active:scale-90 cursor-pointer ${
              isWiggling ? 'animate-bounce' : 'hover:scale-105'
            }`}
            title="또리를 콕 찔러보세요!"
          >
            🐿️
            <span className="absolute -top-1 -right-1 text-xs">✨</span>
          </button>

          {/* Speech Bubble */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
              <span>다람쥐 또리</span>
              <span className="text-[10px] text-fuchsia-500 font-normal">터치하면 힘찬 응원!</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-100 truncate">
              "{bubbleMessage}"
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-3 flex gap-2 p-1 bg-purple-100/60 dark:bg-purple-900/50 rounded-2xl border border-purple-200/50 dark:border-purple-800/40">
          <button
            onClick={() => {
              playPopSound(soundEnabled);
              onSelectTab('home');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              currentTab === 'home'
                ? 'bg-white dark:bg-purple-800 text-purple-900 dark:text-white shadow-sm'
                : 'text-purple-600/80 dark:text-purple-300/80 hover:text-purple-900 dark:hover:text-white hover:bg-white/40'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>식판 리뷰 & 메뉴 건의</span>
          </button>

          <button
            onClick={() => {
              playPopSound(soundEnabled);
              onSelectTab('history');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              currentTab === 'history'
                ? 'bg-white dark:bg-purple-800 text-purple-900 dark:text-white shadow-sm'
                : 'text-purple-600/80 dark:text-purple-300/80 hover:text-purple-900 dark:hover:text-white hover:bg-white/40'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>나의 일기 & 랭킹</span>
          </button>
        </div>
      </div>
    </header>
  );
}
