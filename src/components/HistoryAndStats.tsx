import React, { useState } from 'react';
import { MealReview, AcornWish } from '../types';
import { playPopSound } from '../utils/audio';
import {
  Trophy,
  Star,
  Sparkles,
  Calendar,
  Share2,
  Trash2,
  Camera,
  Heart,
  TrendingUp,
  Award,
  Search,
  MessageSquareHeart,
} from 'lucide-react';

interface HistoryAndStatsProps {
  reviews: MealReview[];
  wishes: AcornWish[];
  soundEnabled: boolean;
  onOpenCardModal: (review: MealReview) => void;
  onDeleteReview: (reviewId: string) => void;
  onSwitchToHome: () => void;
}

export default function HistoryAndStats({
  reviews,
  wishes,
  soundEnabled,
  onOpenCardModal,
  onDeleteReview,
  onSwitchToHome,
}: HistoryAndStatsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Compute Statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.acornRating, 0) / totalReviews).toFixed(1)
      : '0.0';

  // Count tag occurrences
  const tagCounts: Record<string, number> = {};
  reviews.forEach((r) => {
    r.tasteTags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Top 5 Acorn Wishes Leaderboard
  const topWishes = [...wishes].sort((a, b) => b.votes - a.votes).slice(0, 5);

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter !== 'all' && r.acornRating !== ratingFilter) return false;
    if (
      searchTerm &&
      !r.mainMenu.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Meals */}
        <div className="p-4 rounded-3xl bg-white/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-300">
            <span className="text-xs font-bold">기록한 식판</span>
            <span className="text-lg">🍱</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-950 dark:text-purple-100">
              {totalReviews}
            </span>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-300 ml-1">끼</span>
          </div>
          <p className="text-[11px] text-purple-600/70 dark:text-purple-400 mt-1">소중한 급식 기록</p>
        </div>

        {/* Avg Rating */}
        <div className="p-4 rounded-3xl bg-white/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-300">
            <span className="text-xs font-bold">평균 도토리 만족도</span>
            <span className="text-lg">🌰</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-950 dark:text-purple-100">
              {avgRating}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs text-amber-500 mt-1">
            {'🌰'.repeat(Math.round(Number(avgRating)) || 1)}
          </div>
        </div>

        {/* Favorite Taste Tag */}
        <div className="p-4 rounded-3xl bg-white/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-300">
            <span className="text-xs font-bold">최애 맛 태그</span>
            <span className="text-lg">✨</span>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-extrabold text-purple-950 dark:text-purple-100 truncate block">
              {topTags[0] ? `#${topTags[0][0]}` : '기록 필요'}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400">
              {topTags[0] ? `${topTags[0][1]}회 선택됨` : '-'}
            </span>
          </div>
          <p className="text-[11px] text-purple-600/70 dark:text-purple-400 mt-1">우리의 입맛 취향</p>
        </div>

        {/* Clean Plate Rate */}
        <div className="p-4 rounded-3xl bg-white/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-300">
            <span className="text-xs font-bold">잔반 없는 완식률</span>
            <span className="text-lg">🏆</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              100%
            </span>
          </div>
          <p className="text-[11px] text-purple-600/70 dark:text-purple-400 mt-1">참 잘 먹었어요 도장 쾅!</p>
        </div>
      </div>

      {/* 2. Realtime Acorn Wish Leaderboard (도토리 랭킹) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/70 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-purple-950 dark:text-purple-100 flex items-center gap-1.5">
                실시간 도토리 메뉴 랭킹 TOP 5
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                가장 많은 친구들의 표를 얻어 다음 주 식단 후보로 달리는 메뉴들이에요!
              </p>
            </div>
          </div>
        </div>

        {/* Top 5 Podium Cards */}
        <div className="space-y-2.5">
          {topWishes.map((wish, idx) => {
            const rank = idx + 1;
            const progress = Math.min((wish.votes / 10) * 100, 100);
            const isCandidate = wish.votes >= 10;
            const isDelivered = wish.votes >= 5;

            const rankBadges = [
              { label: '1위', crown: '👑 🥇', border: 'border-amber-300 dark:border-amber-700', bg: 'bg-amber-50/70 dark:bg-amber-950/40' },
              { label: '2위', crown: '🥈', border: 'border-slate-300 dark:border-slate-700', bg: 'bg-slate-50/70 dark:bg-slate-900/40' },
              { label: '3위', crown: '🥉', border: 'border-orange-200 dark:border-orange-800', bg: 'bg-orange-50/70 dark:bg-orange-950/30' },
            ];

            const badge = rankBadges[idx] || {
              label: `${rank}위`,
              crown: '🌰',
              border: 'border-purple-100 dark:border-purple-800/50',
              bg: 'bg-purple-50/40 dark:bg-purple-900/20',
            };

            return (
              <div
                key={wish.id}
                className={`p-3.5 sm:p-4 rounded-2xl border ${badge.border} ${badge.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl shrink-0 w-8 text-center font-bold">
                    {badge.crown}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-purple-950 dark:text-purple-100">
                        {wish.menuTitle}
                      </span>
                      {isCandidate ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                          ★ 식단 후보 등극
                        </span>
                      ) : isDelivered ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-200 dark:bg-fuchsia-900 text-fuchsia-900 dark:text-fuchsia-100">
                          🚀 배달 완료
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-purple-700/80 dark:text-purple-300 line-clamp-1 mt-0.5">
                      "{wish.reason}"
                    </p>
                  </div>
                </div>

                {/* Votes & Progress */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 font-bold text-sm text-purple-900 dark:text-purple-200">
                    <span className="text-base">🌰</span>
                    <span>{wish.votes}표</span>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-normal">
                      (목표 10표)
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-28 sm:w-32 bg-purple-200 dark:bg-purple-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. My Meal Reviews Journal (나의 급식 일기장) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/70 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-900/60 pb-3">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-purple-950 dark:text-purple-100 flex items-center gap-2">
              <span>📖 나의 급식 일기장</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                {filteredReviews.length}개의 기록
              </span>
            </h3>
            <p className="text-xs text-purple-600 dark:text-purple-300">
              내가 남긴 솔직한 급식 평가를 모아보고 감성 카드로 캡처할 수 있어요!
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="메뉴 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-900/40 text-xs text-purple-950 dark:text-purple-100 placeholder:text-purple-400 focus:outline-hidden focus:ring-1 focus:ring-purple-400 w-32 sm:w-40"
              />
              <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2 top-2" />
            </div>

            <select
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="py-1.5 px-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-900/40 text-xs font-bold text-purple-950 dark:text-purple-100 focus:outline-hidden"
            >
              <option value="all">별점 전체</option>
              <option value="5">🌰 5개</option>
              <option value="4">🌰 4개</option>
              <option value="3">🌰 3개</option>
              <option value="2">🌰 2개</option>
              <option value="1">🌰 1개</option>
            </select>
          </div>
        </div>

        {/* Meal Journal List */}
        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => {
              const mealLabel =
                review.mealType === 'lunch'
                  ? '중식 🍱'
                  : review.mealType === 'dinner'
                  ? '석식 🌙'
                  : '조식 🌅';

              return (
                <div
                  key={review.id}
                  className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-900/30 border border-purple-200/70 dark:border-purple-800/60 space-y-3 relative hover:shadow-sm transition-all"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-purple-200/80 dark:bg-purple-800 text-purple-900 dark:text-purple-100">
                        {mealLabel}
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {review.date}
                      </span>
                      <span className="text-xs text-purple-500/70 hidden sm:inline">•</span>
                      <span className="text-xs text-purple-600/80 dark:text-purple-300 font-medium truncate max-w-[130px]">
                        {review.authorNickname}
                      </span>
                    </div>

                    {/* Acorn Rating */}
                    <div className="flex items-center gap-1 text-sm font-bold text-purple-900 dark:text-purple-100 bg-white/80 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200/60 dark:border-purple-800/50">
                      <span>{'🌰'.repeat(review.acornRating)}</span>
                      <span className="text-xs text-purple-600 dark:text-purple-300 ml-1">
                        ({review.acornRating}점)
                      </span>
                    </div>
                  </div>

                  {/* Menu Highlights */}
                  <div>
                    <h4 className="font-extrabold text-base sm:text-lg text-purple-950 dark:text-purple-100">
                      {review.mainMenu}
                    </h4>
                    {review.sideDishes && (
                      <p className="text-xs text-purple-700/80 dark:text-purple-300 mt-0.5">
                        반찬: {review.sideDishes}
                      </p>
                    )}
                  </div>

                  {/* Taste Tags */}
                  {review.tasteTags && review.tasteTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {review.tasteTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Honest Review */}
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/50">
                    <p className="text-xs sm:text-sm text-purple-900 dark:text-purple-100 leading-relaxed font-medium">
                      "{review.reviewText}"
                    </p>
                  </div>

                  {/* Chef Letter if available */}
                  {review.chefLetter && (
                    <div className="p-2.5 rounded-xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-200/60 dark:border-pink-900/50 flex items-start gap-2">
                      <MessageSquareHeart className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-pink-900 dark:text-pink-200">
                        <span className="font-bold text-pink-700 dark:text-pink-300">
                          급식선생님께 드린 편지:
                        </span>{' '}
                        "{review.chefLetter}"
                      </p>
                    </div>
                  )}

                  {/* Action Bar: Capture Photo Card & Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-purple-800/60">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>✓ 참 잘 먹었어요 인증완료</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playPopSound(soundEnabled);
                          onOpenCardModal(review);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        title="예쁜 식판 요약 카드 만들기"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>카드 캡처 / 공유 📸</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('이 식판 일기를 삭제할까요?')) {
                            playPopSound(soundEnabled);
                            onDeleteReview(review.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-purple-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/50 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-purple-50/40 dark:bg-purple-900/20 rounded-2xl border border-dashed border-purple-200 dark:border-purple-800">
            <p className="text-3xl mb-2">🍽️📖</p>
            <p className="text-sm font-bold text-purple-900 dark:text-purple-200">
              일치하는 식판 일기가 없어요!
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              오늘 먹은 급식 리뷰를 작성하고 멋진 카드를 간직해보세요!
            </p>
            <button
              onClick={() => {
                playPopSound(soundEnabled);
                onSwitchToHome();
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              오늘의 식판 일기 쓰러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
