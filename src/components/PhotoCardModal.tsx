import React, { useEffect, useState } from 'react';
import { MealReview } from '../types';
import { generateMealCardCanvas, downloadMealCard } from '../utils/cardGenerator';
import { playFanfareSound, playPopSound } from '../utils/audio';
import { Download, Share2, X, Sparkles, Check, CheckCircle2 } from 'lucide-react';

interface PhotoCardModalProps {
  review: MealReview | null;
  onClose: () => void;
  soundEnabled: boolean;
  onTriggerParticles: () => void;
}

export default function PhotoCardModal({
  review,
  onClose,
  soundEnabled,
  onTriggerParticles,
}: PhotoCardModalProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!review) return;
    setIsGenerating(true);
    generateMealCardCanvas(review).then((url) => {
      setImageUrl(url);
      setIsGenerating(false);
    });
  }, [review]);

  if (!review) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    playFanfareSound(soundEnabled);
    onTriggerParticles();
    downloadMealCard(imageUrl, review.date);
  };

  const handleCopyLinkOrShare = async () => {
    playPopSound(soundEnabled);
    if (navigator.share && imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `dotori-meal-${review.date}.png`, { type: 'image/png' });
        await navigator.share({
          title: `도토리급식 - ${review.mainMenu}`,
          text: `오늘의 급식 "${review.mainMenu}" 도토리 ${review.acornRating}점 일기를 확인해보세요!`,
          files: [file],
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    // Fallback: Copy URL/message
    navigator.clipboard.writeText(`[도토리급식] ${review.date} 식판 리뷰: ${review.mainMenu} (도토리 ${review.acornRating}개 🌰) - "${review.reviewText}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-purple-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-purple-200 dark:border-purple-700 max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        {/* Modal Top */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <h3 className="font-extrabold text-base sm:text-lg text-purple-950 dark:text-purple-100">
              오늘의 식판 요약 카드
            </h3>
          </div>
          <button
            onClick={() => {
              playPopSound(soundEnabled);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Canvas Preview */}
        <div className="my-4 flex items-center justify-center min-h-[320px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 py-12 text-purple-600 dark:text-purple-300">
              <span className="text-3xl animate-spin">🌰</span>
              <p className="text-xs font-bold">참 잘 먹었어요 도장을 쾅 찍는 중...</p>
            </div>
          ) : (
            imageUrl && (
              <div className="relative group max-w-[340px] rounded-2xl overflow-hidden shadow-lg border-2 border-purple-200 dark:border-purple-700">
                <img
                  src={imageUrl}
                  alt="도토리 식판 카드"
                  className="w-full h-auto object-contain"
                />
              </div>
            )
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-purple-100 dark:border-purple-800">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating || !imageUrl}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-purple-400/30 active:scale-97 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PNG 카드 다운로드</span>
            </button>

            <button
              onClick={handleCopyLinkOrShare}
              className="py-3 px-4 rounded-2xl border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-800/80 hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-100 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-97 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                  <span>친구에게 공유</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[11px] text-purple-600/80 dark:text-purple-400 pt-1">
            인스타그램 스토리나 반 단톡방에 예쁜 식판 카드를 자랑해보세요! ✨
          </p>
        </div>
      </div>
    </div>
  );
}
