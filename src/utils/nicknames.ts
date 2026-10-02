const ADJECTIVES = [
  '볼빵빵',
  '행복한',
  '달콤한',
  '바삭한',
  '포근한',
  '눈누난나',
  '도토리품은',
  '새콤달콤',
  '용감한',
  '미소짓는',
  '사랑스러운',
  '오물오물',
  '치즈가득',
  '초코러버',
  '별빛가득',
  '냠냠쩝쩝',
  '꿀맛찾는',
  '동글동글',
  '식판비운',
  '반짝이는',
];

const ANIMALS = [
  { name: '다람쥐', emoji: '🐿️' },
  { name: '판다', emoji: '🐼' },
  { name: '토끼', emoji: '🐰' },
  { name: '수달', emoji: '🦦' },
  { name: '햄스터', emoji: '🐹' },
  { name: '아기사슴', emoji: '🦌' },
  { name: '곰돌이', emoji: '🐻' },
  { name: '강아지', emoji: '🐶' },
  { name: '고양이', emoji: '🐱' },
  { name: '뱁새', emoji: '🐥' },
  { name: '알파카', emoji: '🦙' },
  { name: '아기물개', emoji: '🦭' },
];

export function generateRandomNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal.name} ${animal.emoji}`;
}

export function getOrCreateUserId(): string {
  const STORAGE_KEY = 'dotori_user_id';
  let uid = localStorage.getItem(STORAGE_KEY);
  if (!uid) {
    uid = 'user_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, uid);
  }
  return uid;
}
