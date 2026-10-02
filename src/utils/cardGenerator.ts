import { MealReview } from '../types';

export function generateMealCardCanvas(review: MealReview): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 1040;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Soft Berry Lavender Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#fbf8ff');
    bgGrad.addColorStop(0.5, '#f5edff');
    bgGrad.addColorStop(1, '#ede2fe');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative background pastel circles
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(60, 80, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(740, 220, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#818cf8';
    ctx.beginPath();
    ctx.arc(700, 950, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Inner White Floating Card with Shadow
    const cardX = 40;
    const cardY = 50;
    const cardW = width - 80;
    const cardH = height - 100;
    const radius = 32;

    ctx.save();
    ctx.shadowColor = 'rgba(126, 34, 206, 0.12)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 14;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    // Inner Card Border
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f3e8ff';
    ctx.stroke();
    ctx.restore();

    // Top Header Banner
    ctx.save();
    ctx.fillStyle = '#9333ea';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🐿️ 도토리급식 식판 일기장', cardX + 40, cardY + 56);

    // Date & Meal Type badge
    const mealLabel = review.mealType === 'lunch' ? '오늘의 중식 🍱' : review.mealType === 'dinner' ? '오늘의 석식 🌙' : '오늘의 조식 🌅';
    ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'right';
    ctx.fillText(`${review.date} (${mealLabel})`, cardX + cardW - 40, cardY + 54);

    // Horizontal separator
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, cardY + 80);
    ctx.lineTo(cardX + cardW - 40, cardY + 80);
    ctx.stroke();
    ctx.restore();

    // 3. Menu Title & Highlights
    ctx.save();
    ctx.fillStyle = '#581c87';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.textAlign = 'left';
    
    // Fit text if too long
    let title = review.mainMenu;
    if (title.length > 22) {
      title = title.substring(0, 22) + '...';
    }
    ctx.fillText(title, cardX + 40, cardY + 130);

    // Side dishes subtitle
    if (review.sideDishes) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
      let side = review.sideDishes;
      if (side.length > 38) side = side.substring(0, 38) + '...';
      ctx.fillText(`함께 나온 반찬: ${side}`, cardX + 40, cardY + 164);
    }
    ctx.restore();

    // 4. Dotori Acorn Star Rating
    ctx.save();
    const ratingBoxY = cardY + 200;
    ctx.fillStyle = '#faf5ff';
    ctx.beginPath();
    ctx.roundRect(cardX + 40, ratingBoxY, cardW - 80, 84, 18);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#e9d5ff';
    ctx.stroke();

    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillStyle = '#7e22ce';
    ctx.textAlign = 'left';
    ctx.fillText('오늘의 도토리 만족도', cardX + 64, ratingBoxY + 48);

    // Acorns
    let acornsStr = '';
    for (let i = 0; i < 5; i++) {
      acornsStr += i < review.acornRating ? '🌰 ' : '⚪ ';
    }
    ctx.font = '30px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(acornsStr.trim(), cardX + cardW - 64, ratingBoxY + 52);
    ctx.restore();

    // 5. Taste Tags Chips
    let currentY = cardY + 316;
    if (review.tasteTags && review.tasteTags.length > 0) {
      ctx.save();
      let tagX = cardX + 40;
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';

      review.tasteTags.slice(0, 5).forEach((tag) => {
        const textWidth = ctx.measureText(`# ${tag}`).width;
        const tagBoxW = textWidth + 24;

        if (tagX + tagBoxW > cardX + cardW - 40) {
          tagX = cardX + 40;
          currentY += 42;
        }

        ctx.fillStyle = '#f3e8ff';
        ctx.beginPath();
        ctx.roundRect(tagX, currentY, tagBoxW, 32, 16);
        ctx.fill();

        ctx.fillStyle = '#7e22ce';
        ctx.textAlign = 'left';
        ctx.fillText(`# ${tag}`, tagX + 12, currentY + 21);

        tagX += tagBoxW + 10;
      });
      ctx.restore();
      currentY += 50;
    }

    // 6. Review Bubble Section
    ctx.save();
    const reviewBoxY = currentY + 10;
    const reviewBoxH = 200;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cardX + 40, reviewBoxY, cardW - 80, reviewBoxH, 20);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e9d5ff';
    ctx.stroke();

    // Quotation mark icon
    ctx.font = 'bold 44px serif';
    ctx.fillStyle = '#d8b4fe';
    ctx.fillText('“', cardX + 60, reviewBoxY + 44);

    // Multi-line review text wrapping
    ctx.fillStyle = '#1f2937';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.textAlign = 'left';

    const maxLineWidth = cardW - 140;
    const words = review.reviewText.split('');
    let line = '';
    let textY = reviewBoxY + 54;
    const lineHeight = 32;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        ctx.fillText(line, cardX + 70, textY);
        line = words[n];
        textY += lineHeight;
        if (textY > reviewBoxY + reviewBoxH - 30) {
          line += '...';
          break;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, cardX + 70, textY);
    ctx.restore();

    // 7. Chef Letter / Gratitude Note
    let bottomSectionY = reviewBoxY + reviewBoxH + 20;
    if (review.chefLetter) {
      ctx.save();
      ctx.fillStyle = '#fdf4ff';
      ctx.beginPath();
      ctx.roundRect(cardX + 40, bottomSectionY, cardW - 80, 80, 16);
      ctx.fill();
      ctx.strokeStyle = '#f5d0fe';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#c026d3';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
      ctx.fillText('💌 급식선생님께 보낸 응원 한마디', cardX + 60, bottomSectionY + 28);

      ctx.fillStyle = '#701a75';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
      let letter = review.chefLetter;
      if (letter.length > 40) letter = letter.substring(0, 40) + '...';
      ctx.fillText(`"${letter}"`, cardX + 60, bottomSectionY + 56);
      ctx.restore();
      bottomSectionY += 96;
    }

    // 8. Author Nickname Footer
    ctx.save();
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'left';
    ctx.fillText(`작성자 : ${review.authorNickname}`, cardX + 45, cardY + cardH - 35);

    ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'left';
    ctx.fillText('도토리급식과 함께 맛있고 즐거운 학교 생활을 응원합니다!', cardX + 45, cardY + cardH - 14);
    ctx.restore();

    // 9. Official Circular Rubber Stamp ("참 잘 먹었어요! / 도토리급식 인증")
    ctx.save();
    const stampX = cardX + cardW - 130;
    const stampY = cardY + cardH - 120;
    const stampRadius = 66;

    // Slight stamp angle tilt for realism
    ctx.translate(stampX, stampY);
    ctx.rotate(-0.18);

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';

    // Outer double ring
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, stampRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, stampRadius - 7, 0, Math.PI * 2);
    ctx.stroke();

    // Stamp text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillText('★ CLEAN PLATE AWARD ★', 0, -32);

    ctx.font = 'bold 22px "Sunflower", "Pretendard", sans-serif';
    ctx.fillText('참 잘 먹었어요!', 0, -2);

    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillText('도토리급식 인증', 0, 26);

    ctx.font = '16px sans-serif';
    ctx.fillText('🐿️ 🌰', 0, 46);

    ctx.restore();

    resolve(canvas.toDataURL('image/png'));
  });
}

export function downloadMealCard(dataUrl: string, date: string) {
  const link = document.createElement('a');
  link.download = `dotori-meal-${date}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
