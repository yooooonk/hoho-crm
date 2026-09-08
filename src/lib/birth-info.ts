const ZODIAC_ANIMALS = [
  "쥐",
  "소",
  "호랑이",
  "토끼",
  "용",
  "뱀",
  "말",
  "양",
  "원숭이",
  "닭",
  "개",
  "돼지",
];

export function getZodiacSign(birthYear: number) {
  const index = (((birthYear - 2020) % 12) + 12) % 12;
  return `${ZODIAC_ANIMALS[index]}띠`;
}

// 한국식 만 나이 (생일이 지났으면 올해-출생연도, 안 지났으면 -1)
export function getKoreanAge(birthDate: Date, today: Date = new Date()) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

export function formatBirthInfo(birthDate: Date, today: Date = new Date()) {
  return `만 ${getKoreanAge(birthDate, today)}세 · ${getZodiacSign(birthDate.getFullYear())}`;
}
