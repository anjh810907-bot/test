import React, { useState } from 'react';
import { MealReview, MealType, TasteTag } from '../types';
import { TASTE_TAGS } from '../mockData';
import { playChimeSound, playFanfareSound, playPopSound } from '../utils/audio';
import { Sparkles, Heart, Utensils, MessageSquareHeart, CheckCircle2 } from 'lucide-react';

interface TodayMealFormProps {
  authorNickname: string;
  soundEnabled: boolean;
  onAddReview: (review: MealReview) => void;
  onTriggerParticles: (e?: React.MouseEvent) => void;
  onUpdateBubble: (msg: string) => void;
}

export default function TodayMealForm({
  authorNickname,
  soundEnabled,
  onAddReview,
  onTriggerParticles,
  onUpdateBubble,
}: TodayMealFormProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [mainMenu, setMainMenu] = useState('');
  const [sideDishes, setSideDishes] = useState('');
  const [acornRating, setAcornRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['바삭바삭해요', '단짠단짠']);
  const [reviewText, setReviewText] = useState('');
  const [chefLetter, setChefLetter] = useState('');
  const [mood, setMood] = useState<'delicious' | 'happy' | 'full' | 'surprised' | 'comfort'>('delicious');
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const ratingDescriptions: Record<number, { text: string; sub: string }> = {
    1: { text: '조금 아쉬워요 🥺', sub: '다음엔 더 맛있어질 거예요!' },
    2: { text: '무난했어요 🙂', sub: '남기지 않고 냠냠 먹었어요.' },
    3: { text: '맛있게 뚝딱! 😋', sub: '든든하고 기분 좋은 한 끼였어요.' },
    4: { text: '완전 꿀맛 대만족! 🤤', sub: '친구랑 감탄하면서 먹은 식단!' },
    5: { text: '매일 먹고 싶은 레전드 급식! 👑', sub: '식판을 설거지하듯 싹 비웠어요!' },
  };

  const handleAcornClick = (r: number) => {
    setAcornRating(r);
    playChimeSound(r, soundEnabled);
    onUpdateBubble(`오호! 오늘 급식에 ${r}점 도토리를 주었구나! 🐿️`);
  };

  const toggleTag = (label: string) => {
    playPopSound(soundEnabled);
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainMenu.trim()) {
      setFormError('오늘 먹은 메인 메뉴 이름을 입력해주세요! 🍱');
      onUpdateBubble('앗! 오늘 먹은 메뉴 이름을 알려줘야 또리가 기록할 수 있어!');
      return;
    }

    if (!reviewText.trim()) {
      setFormError('오늘 급식에 대한 솔직한 한 줄 후기를 남겨주세요! ✍️');
      onUpdateBubble('어떤 맛이었는지 한마디만 들려줄래? 친구들도 궁금해해!');
      return;
    }

    setFormError('');

    const newReview: MealReview = {
      id: 'rev_' + Date.now() + Math.random().toString(36).substring(2, 6),
      date,
      mealType,
      mainMenu: mainMenu.trim(),
      sideDishes: sideDishes.trim(),
      acornRating,
      tasteTags: selectedTags,
      reviewText: reviewText.trim(),
      chefLetter: chefLetter.trim(),
      mood,
      authorNickname,
      createdAt: Date.now(),
    };

    onAddReview(newReview);
    playFanfareSound(soundEnabled);
    onTriggerParticles();
    onUpdateBubble('우와! 갓 구운 도토리처럼 소중한 식판 일기가 저장됐어! 🌰✨');

    // Reset form fields
    setMainMenu('');
    setSideDishes('');
    setReviewText('');
    setChefLetter('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="bg-white/90 dark:bg-purple-950/70 backdrop-blur-xs rounded-3xl p-5 sm:p-7 border border-purple-200/80 dark:border-purple-800/70 shadow-sm transition-all">
      {/* Title Header */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-purple-100 dark:border-purple-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-lg">
            🍱
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-purple-950 dark:text-purple-100 flex items-center gap-1.5">
              오늘의 식판 일기 쓰기
              <Sparkles className="w-4 h-4 text-fuchsia-500 inline" />
            </h2>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70">
              오늘 먹은 급식 맛은 어땠나요? 도토리 별점과 함께 소중한 일기를 남겨주세요!
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meal Time Slot */}
        <div>
          <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 mb-2">
            식사 구분
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'lunch' as MealType, label: '오늘의 중식 (점심)', icon: '🍱' },
              { type: 'dinner' as MealType, label: '오늘의 석식 (저녁)', icon: '🌙' },
              { type: 'breakfast' as MealType, label: '오늘의 조식 (아침)', icon: '🌅' },
            ].map((slot) => (
              <button
                type="button"
                key={slot.type}
                onClick={() => {
                  playPopSound(soundEnabled);
                  setMealType(slot.type);
                }}
                className={`py-2 px-2.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  mealType === slot.type
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-400/40 scale-102'
                    : 'bg-purple-50/60 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/60 hover:bg-purple-100/70'
                }`}
              >
                <span>{slot.icon}</span>
                <span>{slot.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 mb-1.5">
              메인 메뉴명 <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 바삭치킨마요덮밥 & 눈꽃치즈볼"
              value={mainMenu}
              onChange={(e) => setMainMenu(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-900/20 text-purple-950 dark:text-purple-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:bg-white dark:focus:bg-purple-950 transition-all placeholder:text-purple-300 dark:placeholder:text-purple-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 mb-1.5">
              함께 나온 국 & 반찬 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 팽이버섯장국, 깍두기, 청포도에이드"
              value={sideDishes}
              onChange={(e) => setSideDishes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-900/20 text-purple-950 dark:text-purple-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:bg-white dark:focus:bg-purple-950 transition-all placeholder:text-purple-300 dark:placeholder:text-purple-700"
            />
          </div>
        </div>

        {/* Acorn Rating (1 to 5) */}
        <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-900/30 border border-purple-200/70 dark:border-purple-800/60 text-center">
          <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 mb-2">
            오늘 급식 도토리 별점 <span className="text-pink-500">*</span>
          </label>

          {/* Acorn Stars */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating ? star <= hoverRating : star <= acornRating;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleAcornClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className={`text-3xl sm:text-4xl transition-all transform active:scale-125 cursor-pointer ${
                    active ? 'scale-110 drop-shadow-sm filter-none' : 'opacity-30 grayscale hover:opacity-75'
                  }`}
                  aria-label={`${star}점 도토리`}
                  title={`${star}점`}
                >
                  🌰
                </button>
              );
            })}
          </div>

          <div className="mt-2">
            <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
              {ratingDescriptions[hoverRating || acornRating].text}
            </span>
            <p className="text-xs text-purple-600 dark:text-purple-300">
              {ratingDescriptions[hoverRating || acornRating].sub}
            </p>
          </div>
        </div>

        {/* Taste Tags (Multi-select) */}
        <div>
          <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 mb-2">
            맛 태그 선택 (어떤 느낌이었나요?)
          </label>
          <div className="flex flex-wrap gap-2">
            {TASTE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.label);
              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleTag(tag.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100/60'
                  }`}
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* One-line Honest Review */}
        <div>
          <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 mb-1.5">
            솔직한 한 줄 후기 <span className="text-pink-500">*</span>
          </label>
          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="오늘 급식에서 가장 맛있었던 반찬이나 생생한 맛 소감을 적어주세요! (예: 튀김이 완전 바삭하고 치즈가 듬뿍 들어서 꿀맛이었어요)"
            className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-900/20 text-purple-950 dark:text-purple-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:bg-white dark:focus:bg-purple-950 transition-all placeholder:text-purple-300 dark:placeholder:text-purple-700"
          />
        </div>

        {/* Chef Gratitude Letter / Cheer (선생님께 드리는 응원 한마디) */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1">
              <MessageSquareHeart className="w-3.5 h-3.5 text-fuchsia-500" />
              급식실 선생님께 드리는 감사 & 응원 한마디 (선택)
            </label>
            <span className="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-medium">
              선생님들께 큰 힘이 돼요! 💌
            </span>
          </div>
          <input
            type="text"
            value={chefLetter}
            onChange={(e) => setChefLetter(e.target.value)}
            placeholder="예: 이른 아침부터 맛있는 밥 지어주셔서 감사합니다! 힘내세요 영양사 선생님 ♡"
            className="w-full px-3.5 py-2 rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-900/20 text-purple-950 dark:text-purple-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400 focus:bg-white dark:focus:bg-purple-950 transition-all placeholder:text-purple-300 dark:placeholder:text-purple-700"
          />
        </div>

        {/* Error notification */}
        {formError && (
          <div className="p-3 rounded-2xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold flex items-center gap-2 animate-shake">
            <span>🐿️</span>
            <span>{formError}</span>
          </div>
        )}

        {/* Success notification */}
        {isSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>오늘의 식판 일기가 성공적으로 저장되었습니다! '나의 일기 & 랭킹' 탭에서 공유 카드를 확인해보세요!</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-extrabold text-sm sm:text-base shadow-md shadow-purple-400/30 hover:shadow-lg hover:shadow-purple-400/40 active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🌰</span>
          <span>오늘의 식판 일기 등록하기</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </button>
      </form>
    </div>
  );
}
