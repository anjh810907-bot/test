import React, { useState } from 'react';
import { AcornWish, WishCategory } from '../types';
import { playFanfareSound, playPopSound } from '../utils/audio';
import { Sparkles, ThumbsUp, Send, CheckCircle, Award, Flame, Clock, Filter, MessageCircleHeart } from 'lucide-react';

interface WishlistSectionProps {
  wishes: AcornWish[];
  currentUserId: string;
  authorNickname: string;
  soundEnabled: boolean;
  onAddWish: (wish: AcornWish) => void;
  onVoteWish: (wishId: string) => void;
  onTriggerParticles: (e?: React.MouseEvent) => void;
  onUpdateBubble: (msg: string) => void;
}

export default function WishlistSection({
  wishes,
  currentUserId,
  authorNickname,
  soundEnabled,
  onAddWish,
  onVoteWish,
  onTriggerParticles,
  onUpdateBubble,
}: WishlistSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [menuTitle, setMenuTitle] = useState('');
  const [category, setCategory] = useState<WishCategory>('main');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  const [filterCategory, setFilterCategory] = useState<'all' | WishCategory>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'delivered'>('popular');

  const categories: { key: WishCategory; label: string; icon: string }[] = [
    { key: 'main', label: '메인요리', icon: '🍛' },
    { key: 'dessert', label: '디저트/후식', icon: '🍧' },
    { key: 'snack', label: '분식/간식', icon: '🍢' },
    { key: 'soup', label: '든든민국/찌개', icon: '🍲' },
    { key: 'beverage', label: '음료/과일', icon: '🧃' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!menuTitle.trim()) {
      setFormError('급식에 나왔으면 하는 메뉴 이름을 입력해주세요! 🌰');
      onUpdateBubble('어떤 메뉴가 먹고 싶어? 이름만 알려주면 또리가 심어줄게!');
      return;
    }

    if (!reason.trim()) {
      setFormError('왜 이 메뉴가 먹고 싶은지 짧은 이유를 적어주세요! ✍️');
      onUpdateBubble('왜 먹고 싶은지 적어주면 친구들과 선생님께 더 쏙쏙 와닿을 거야!');
      return;
    }

    setFormError('');

    const newWish: AcornWish = {
      id: 'wish_' + Date.now() + Math.random().toString(36).substring(2, 6),
      menuTitle: menuTitle.trim(),
      category,
      reason: reason.trim(),
      authorNickname,
      votes: 1, // Proposer automatically votes
      votedUserIds: [currentUserId],
      createdAt: Date.now(),
      deliveryStatus: 'growing',
    };

    onAddWish(newWish);
    playFanfareSound(soundEnabled);
    onTriggerParticles();
    onUpdateBubble('우와! 상상만 해도 군침 도는 도토리 메뉴를 심었구나! 🌱✨');

    setMenuTitle('');
    setReason('');
    setShowAddForm(false);
  };

  const handleVote = (wish: AcornWish, e: React.MouseEvent) => {
    const hasVoted = wish.votedUserIds?.includes(currentUserId);
    if (hasVoted) {
      onUpdateBubble('이미 이 도토리 메뉴에 소중한 한 표를 주었어! 🐿️');
      playPopSound(soundEnabled);
      return;
    }

    playFanfareSound(soundEnabled);
    onTriggerParticles(e);
    onVoteWish(wish.id);
    onUpdateBubble('볼빵빵 도토리 파티! 친구들의 표가 모이고 있어! 🌰🎉');
  };

  // Filter & Sort
  const filteredWishes = wishes
    .filter((w) => {
      if (filterCategory !== 'all' && w.category !== filterCategory) return false;
      if (sortBy === 'delivered') return w.votes >= 5 || w.deliveryStatus !== 'growing';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') return b.createdAt - a.createdAt;
      return b.votes - a.votes;
    });

  return (
    <div className="bg-white/90 dark:bg-purple-950/70 backdrop-blur-xs rounded-3xl p-5 sm:p-7 border border-purple-200/80 dark:border-purple-800/70 shadow-sm transition-all space-y-6">
      {/* Header & Toggle Form Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-900/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/80 text-fuchsia-700 dark:text-fuchsia-300 text-lg">
              🌱
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-purple-950 dark:text-purple-100">
              도토리 메뉴 건의함
            </h2>
          </div>
          <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-1">
            "내가 심은 도토리 메뉴, 다음 주 급식 식판에 쏙!" 5표 이상 모이면 급식선생님께 전달돼요!
          </p>
        </div>

        <button
          onClick={() => {
            playPopSound(soundEnabled);
            setShowAddForm(!showAddForm);
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            showAddForm
              ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
              : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-400/30 hover:scale-102'
          }`}
        >
          <span>{showAddForm ? '✕ 닫기' : '🌱 도토리 메뉴 심기'}</span>
        </button>
      </div>

      {/* Plant Dotori Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/40 dark:to-fuchsia-950/30 border border-purple-200 dark:border-purple-800 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-900 dark:text-purple-100 flex items-center gap-1.5">
              <span>🌱 새 도토리 메뉴 심기</span>
            </h3>
            <span className="text-[11px] text-purple-600 dark:text-purple-300">
              작성자: {authorNickname}
            </span>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1.5">
              메뉴 종류
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => {
                    playPopSound(soundEnabled);
                    setCategory(cat.key);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    category === cat.key
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
              메뉴 이름 <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 바삭 치즈볼 & 뿌링클 닭다리구이"
              value={menuTitle}
              onChange={(e) => setMenuTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950 text-purple-950 dark:text-purple-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300 dark:placeholder:text-purple-700"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
              건의 이유 / 하고 싶은 말 <span className="text-pink-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="예: 수요일 잔반 없는 날 특별 메뉴로 꼭 먹고 싶어요! 친구들도 다 찬성했어요!"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950 text-purple-950 dark:text-purple-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 placeholder:text-purple-300 dark:placeholder:text-purple-700"
            />
          </div>

          {formError && (
            <p className="text-xs text-pink-600 dark:text-pink-400 font-bold">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-200/50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5"
            >
              <span>🌱 도토리 심기 완료</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => {
              playPopSound(soundEnabled);
              setFilterCategory('all');
            }}
            className={`px-2.5 py-1 rounded-xl font-bold shrink-0 transition-all ${
              filterCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100/60 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
            }`}
          >
            전체 ({wishes.length})
          </button>
          {categories.map((cat) => {
            const count = wishes.filter((w) => w.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  playPopSound(soundEnabled);
                  setFilterCategory(cat.key);
                }}
                className={`px-2.5 py-1 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1 ${
                  filterCategory === cat.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100/60 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort Pill Buttons */}
        <div className="flex items-center gap-1 text-xs shrink-0 self-end sm:self-auto">
          <button
            onClick={() => {
              playPopSound(soundEnabled);
              setSortBy('popular');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
              sortBy === 'popular'
                ? 'bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-800 dark:text-fuchsia-200 font-extrabold'
                : 'text-purple-700/70 dark:text-purple-300/70'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>도토리순</span>
          </button>
          <button
            onClick={() => {
              playPopSound(soundEnabled);
              setSortBy('latest');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
              sortBy === 'latest'
                ? 'bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-800 dark:text-fuchsia-200 font-extrabold'
                : 'text-purple-700/70 dark:text-purple-300/70'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>최신순</span>
          </button>
          <button
            onClick={() => {
              playPopSound(soundEnabled);
              setSortBy('delivered');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
              sortBy === 'delivered'
                ? 'bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-800 dark:text-fuchsia-200 font-extrabold'
                : 'text-purple-700/70 dark:text-purple-300/70'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>전달완료 🚀</span>
          </button>
        </div>
      </div>

      {/* Wishlist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredWishes.map((wish, index) => {
          const hasVoted = wish.votedUserIds?.includes(currentUserId);
          const isCandidate = wish.votes >= 10;
          const isDelivered = wish.votes >= 5 && !isCandidate;
          const catInfo = categories.find((c) => c.key === wish.category);

          return (
            <div
              key={wish.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isCandidate
                  ? 'bg-gradient-to-br from-amber-50/70 via-purple-50/40 to-pink-50/70 dark:from-amber-950/20 dark:via-purple-950/40 dark:to-pink-950/20 border-amber-300 dark:border-amber-700/60 shadow-md'
                  : 'bg-purple-50/50 dark:bg-purple-900/30 border-purple-200/70 dark:border-purple-800/60 hover:border-purple-300'
              }`}
            >
              {/* Candidate Ribbon Badge */}
              {isCandidate && (
                <div className="absolute -top-1 -right-8 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-extrabold py-0.5 px-8 rotate-30 shadow-xs">
                  ★ 다음 주 식단 후보 ★
                </div>
              )}

              <div>
                {/* Card Top: Category & Status */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                    {catInfo?.icon} {catInfo?.label}
                  </span>

                  {isCandidate ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" />
                      식단 후보 등극!
                    </span>
                  ) : isDelivered ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-100 dark:bg-fuchsia-900/70 text-fuchsia-800 dark:text-fuchsia-200 border border-fuchsia-300 dark:border-fuchsia-700 flex items-center gap-1">
                      🚀 급식선생님께 도토리 배달 완료!
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      🌱 {5 - wish.votes}표 더 모이면 배달!
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-base text-purple-950 dark:text-purple-100 mb-1 leading-snug">
                  {wish.menuTitle}
                </h3>

                {/* Proposer Reason */}
                <p className="text-xs text-purple-800/80 dark:text-purple-300/90 bg-white/70 dark:bg-purple-950/60 p-2.5 rounded-xl border border-purple-100 dark:border-purple-800/50 mb-3">
                  "{wish.reason}"
                </p>

                {/* Nutrition Teacher Reply if exists */}
                {wish.teacherReply && (
                  <div className="p-2.5 rounded-xl bg-pink-50/90 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60 mb-3">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-pink-700 dark:text-pink-300 mb-0.5">
                      <MessageCircleHeart className="w-3.5 h-3.5 text-pink-500" />
                      <span>급식선생님의 따뜻한 화답</span>
                    </div>
                    <p className="text-xs text-pink-950 dark:text-pink-100">
                      {wish.teacherReply}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer: Author + Vote Button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-100/80 dark:border-purple-800/50">
                <span className="text-[11px] text-purple-600/80 dark:text-purple-400 font-medium truncate max-w-[120px]">
                  {wish.authorNickname}
                </span>

                <button
                  onClick={(e) => handleVote(wish, e)}
                  disabled={hasVoted}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    hasVoted
                      ? 'bg-purple-200/70 dark:bg-purple-800/70 text-purple-700 dark:text-purple-300 cursor-default'
                      : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-xs hover:scale-105 active:scale-95'
                  }`}
                  title={hasVoted ? '이미 도토리를 주셨습니다' : '도토리 1표 선물하기'}
                >
                  <span>🌰</span>
                  <span>{wish.votes}개</span>
                  {hasVoted ? (
                    <span className="text-[10px] opacity-80">(투표완료)</span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-amber-200">+1 Pick</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWishes.length === 0 && (
        <div className="text-center py-10 bg-purple-50/40 dark:bg-purple-900/20 rounded-2xl border border-dashed border-purple-200 dark:border-purple-800">
          <p className="text-3xl mb-2">🌰🌱</p>
          <p className="text-sm font-bold text-purple-900 dark:text-purple-200">
            아직 등록된 도토리 메뉴가 없어요!
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            첫 번째 도토리 메뉴를 심어 친구들의 공감을 받아보세요!
          </p>
        </div>
      )}
    </div>
  );
}
