/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MealReview, AcornWish } from './types';
import { INITIAL_REVIEWS, INITIAL_WISHES } from './mockData';
import { generateRandomNickname, getOrCreateUserId } from './utils/nicknames';
import { playPopSound } from './utils/audio';

import MascotHeader from './components/MascotHeader';
import TodayMealForm from './components/TodayMealForm';
import WishlistSection from './components/WishlistSection';
import HistoryAndStats from './components/HistoryAndStats';
import PhotoCardModal from './components/PhotoCardModal';
import ParticleEffect from './components/ParticleEffect';

export default function App() {
  // Navigation Tab ('home' | 'history')
  const [currentTab, setCurrentTab] = useState<'home' | 'history'>('home');

  // Persistence: Reviews
  const [reviews, setReviews] = useState<MealReview[]>(() => {
    try {
      const stored = localStorage.getItem('dotori_meal_reviews');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load reviews from localStorage', e);
    }
    return INITIAL_REVIEWS;
  });

  // Persistence: Wishes
  const [wishes, setWishes] = useState<AcornWish[]>(() => {
    try {
      const stored = localStorage.getItem('dotori_meal_wishes');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load wishes from localStorage', e);
    }
    return INITIAL_WISHES;
  });

  // User identity & Nickname
  const [currentUserId] = useState<string>(() => getOrCreateUserId());
  const [nickname, setNickname] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('dotori_user_nickname');
      if (stored) return stored;
    } catch (e) {
      // ignore
    }
    const generated = generateRandomNickname();
    try {
      localStorage.setItem('dotori_user_nickname', generated);
    } catch (e) {}
    return generated;
  });

  // Audio mute preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('dotori_sound_enabled');
      if (stored !== null) return stored === 'true';
    } catch (e) {}
    return true;
  });

  // Theme mode (Light vs Dark)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('dotori_dark_mode');
      if (stored !== null) return stored === 'true';
    } catch (e) {}
    return false;
  });

  // Mascot Ttori Dialogue
  const [bubbleMessage, setBubbleMessage] = useState<string>(
    '오늘도 도토리처럼 꽉 찬 하루를 만들어보자!'
  );

  // Particle explosion trigger
  const [particleTriggerCount, setParticleTriggerCount] = useState(0);
  const [particleOrigin, setParticleOrigin] = useState<{ x: number; y: number } | undefined>(undefined);

  // Active Photo Card for Modal
  const [activePhotoReview, setActivePhotoReview] = useState<MealReview | null>(null);

  // Sync reviews to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dotori_meal_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews', e);
    }
  }, [reviews]);

  // Sync wishes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('dotori_meal_wishes', JSON.stringify(wishes));
    } catch (e) {
      console.error('Failed to save wishes', e);
    }
  }, [wishes]);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('dotori_dark_mode', String(darkMode));
    } catch (e) {}
  }, [darkMode]);

  // Sync sound preference
  useEffect(() => {
    try {
      localStorage.setItem('dotori_sound_enabled', String(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  const handleToggleTheme = () => {
    playPopSound(soundEnabled);
    setDarkMode((prev) => !prev);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleRerollNickname = () => {
    const newName = generateRandomNickname();
    setNickname(newName);
    try {
      localStorage.setItem('dotori_user_nickname', newName);
    } catch (e) {}
    setBubbleMessage(`새로운 친구 '${newName}' 반가워! 🐿️`);
  };

  const triggerParticles = (e?: React.MouseEvent) => {
    if (e) {
      setParticleOrigin({ x: e.clientX, y: e.clientY });
    } else {
      setParticleOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setParticleTriggerCount((prev) => prev + 1);
  };

  const handleAddReview = (newReview: MealReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setBubbleMessage('식판 일기를 정리했어! 또 맛있는 식단을 기록해줘 🐿️');
  };

  const handleAddWish = (newWish: AcornWish) => {
    setWishes((prev) => [newWish, ...prev]);
  };

  const handleVoteWish = (wishId: string) => {
    setWishes((prev) =>
      prev.map((item) => {
        if (item.id === wishId) {
          const newVotes = item.votes + 1;
          const userIds = item.votedUserIds || [];
          const updatedUserIds = userIds.includes(currentUserId)
            ? userIds
            : [...userIds, currentUserId];

          let deliveryStatus = item.deliveryStatus;
          if (newVotes >= 10) {
            deliveryStatus = 'candidate';
          } else if (newVotes >= 5) {
            deliveryStatus = 'delivered';
          }

          return {
            ...item,
            votes: newVotes,
            votedUserIds: updatedUserIds,
            deliveryStatus,
          };
        }
        return item;
      })
    );
  };

  const ttoriCheerfulQuotes = [
    '오늘도 도토리처럼 꽉 찬 하루를 만들어보자! 🐿️',
    '급식 남기지 않고 싹 비우면 도토리 요정이 찾아와! ✨',
    '내가 심은 메뉴가 식판에 쏙 나오는 날까지 함께 응원해! 🌱',
    '급식실 선생님께 드리는 따뜻한 말 한마디가 최고의 반찬이야 ♡',
    '볼빵빵 다람쥐 또리는 오늘도 친구들을 열렬히 응원해! 🌰',
  ];

  const handleMascotClick = () => {
    const nextMsg =
      ttoriCheerfulQuotes[Math.floor(Math.random() * ttoriCheerfulQuotes.length)];
    setBubbleMessage(nextMsg);
    triggerParticles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/70 via-fuchsia-50/30 to-violet-100/50 dark:from-purple-950 dark:via-slate-900 dark:to-purple-950 text-purple-950 dark:text-purple-100 selection:bg-purple-200 dark:selection:bg-purple-800 transition-colors pb-16">
      {/* Particle Effect Overlay */}
      <ParticleEffect triggerCount={particleTriggerCount} origin={particleOrigin} />

      {/* Top Header & Mascot Bar */}
      <MascotHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        nickname={nickname}
        onRerollNickname={handleRerollNickname}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        bubbleMessage={bubbleMessage}
        onMascotClick={handleMascotClick}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {currentTab === 'home' ? (
          <div className="space-y-6">
            {/* Screen 1 Part 1: Today's Meal Tray Review Writer */}
            <TodayMealForm
              authorNickname={nickname}
              soundEnabled={soundEnabled}
              onAddReview={handleAddReview}
              onTriggerParticles={triggerParticles}
              onUpdateBubble={setBubbleMessage}
            />

            {/* Screen 1 Part 2: Acorn Wishlist & Live Voting */}
            <WishlistSection
              wishes={wishes}
              currentUserId={currentUserId}
              authorNickname={nickname}
              soundEnabled={soundEnabled}
              onAddWish={handleAddWish}
              onVoteWish={handleVoteWish}
              onTriggerParticles={triggerParticles}
              onUpdateBubble={setBubbleMessage}
            />
          </div>
        ) : (
          /* Screen 2: Meal History, Stats & Realtime Top Leaderboard */
          <HistoryAndStats
            reviews={reviews}
            wishes={wishes}
            soundEnabled={soundEnabled}
            onOpenCardModal={setActivePhotoReview}
            onDeleteReview={handleDeleteReview}
            onSwitchToHome={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Photo Card Modal */}
      <PhotoCardModal
        review={activePhotoReview}
        onClose={() => setActivePhotoReview(null)}
        soundEnabled={soundEnabled}
        onTriggerParticles={triggerParticles}
      />

      {/* Bottom Footer */}
      <footer className="max-w-4xl mx-auto px-4 pt-8 text-center text-xs text-purple-700/60 dark:text-purple-400/60 space-y-1">
        <p className="font-semibold">
          🌰 도토리급식 (Dotori School Meal) • "내가 심은 도토리 메뉴, 다음 주 급식 식판에 쏙!"
        </p>
        <p>
          학생과 선생님, 급식선생님이 함께 소통하며 더 맛있는 급식을 만들어가는 다정한 학교 공간입니다.
        </p>
      </footer>
    </div>
  );
}
