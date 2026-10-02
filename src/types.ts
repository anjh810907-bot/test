export type MealType = 'lunch' | 'dinner' | 'breakfast';

export interface TasteTag {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface MealReview {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  mainMenu: string;
  sideDishes: string;
  acornRating: number; // 1 to 5
  tasteTags: string[];
  reviewText: string;
  chefLetter: string; // 감사와 응원의 한마디
  mood: 'delicious' | 'happy' | 'full' | 'surprised' | 'comfort';
  authorNickname: string;
  createdAt: number;
}

export type WishCategory = 'main' | 'dessert' | 'snack' | 'soup' | 'beverage';

export interface AcornWish {
  id: string;
  menuTitle: string;
  category: WishCategory;
  reason: string;
  authorNickname: string;
  votes: number;
  votedUserIds?: string[];
  createdAt: number;
  deliveryStatus: 'growing' | 'delivered' | 'candidate'; // 0-4: growing, 5-9: delivered (급식선생님 전달), 10+: candidate (식단 후보)
  teacherReply?: string; // 급식선생님의 따뜻한 화답
}

export type MascotMood = 'normal' | 'happy' | 'eating' | 'sparkle' | 'thinking';
