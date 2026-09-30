/**
 * Converts numbers into Persian words (تبدیل عدد به حروف فارسی)
 */

const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const dahgan = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const dah_ta_bist = [
  'ده',
  'یازده',
  'دوازده',
  'سیزده',
  'چهارده',
  'پانزده',
  'شانزده',
  'هفده',
  'هجده',
  'نوزده'
];
const sadgan = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const maghadir = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

function chunkNumber(num: number): number[] {
  const parts: number[] = [];
  let n = Math.floor(Math.abs(num));
  while (n > 0) {
    parts.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  return parts;
}

function convertThreeDigits(num: number): string {
  if (num === 0) return '';
  const s = Math.floor(num / 100);
  const d = Math.floor((num % 100) / 10);
  const y = num % 10;

  const result: string[] = [];

  if (s > 0) {
    result.push(sadgan[s]);
  }

  if (d === 1) {
    result.push(dah_ta_bist[y]);
  } else {
    if (d > 1) result.push(dahgan[d]);
    if (y > 0) result.push(yekan[y]);
  }

  return result.join(' و ');
}

export function numberToPersianWords(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return 'صفر';
  const rounded = Math.floor(Math.abs(num));
  if (rounded === 0) return 'صفر';

  const parts = chunkNumber(rounded);
  const words: string[] = [];

  for (let i = parts.length - 1; i >= 0; i--) {
    const chunk = parts[i];
    if (chunk > 0) {
      const partText = convertThreeDigits(chunk);
      const unit = maghadir[i];
      words.push(unit ? `${partText} ${unit}` : partText);
    }
  }

  const prefix = num < 0 ? 'منفی ' : '';
  return prefix + words.join(' و ') + ' تومان';
}
