/**
 * High-precision Solar Hijri (Jalali / شمسی) and Gregorian (میلادی) conversion
 * Based on the astronomical algorithm for the Iranian calendar.
 */

export interface JalaliDate {
  gy?: number;
  gm?: number;
  gd?: number;
  jy: number;
  jm: number;
  jd: number;
}

export interface GregorianDate {
  gy: number;
  gm: number;
  gd: number;
}

export const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

export const GREGORIAN_MONTHS = [
  'ژانویه (January)',
  'فوریه (February)',
  'مارس (March)',
  'آوریل (April)',
  'مه (May)',
  'ژوئن (June)',
  'ژوئیه (July)',
  'اوت (August)',
  'سپتامبر (September)',
  'اکتبر (October)',
  'نوامبر (November)',
  'دسامبر (December)'
];

export const PERSIAN_WEEKDAYS = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
  'شنبه'
];

/**
 * Checks if a Gregorian year is leap.
 */
export function isGregorianLeapYear(gy: number): boolean {
  return (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
}

/**
 * Checks if a Jalali year is leap.
 */
export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
    2262, 2324, 2394, 2456, 3178
  ];
  let jp = breaks[0];
  let jump = 0;
  if (jy < jp || jy >= breaks[breaks.length - 1]) return false;

  for (let i = 1; i < breaks.length; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }
  let n = jy - jp;
  if (jump - n < 6) n = n - jump + (Math.floor(jump / 33) * 33 + 4);
  const mod = (n + 1) % 33;
  return mod === 1 || mod === 5 || mod === 9 || mod === 13 || mod === 17 || mod === 22 || mod === 26 || mod === 30;
}

/**
 * Converts Gregorian date to Jalali date.
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number } {
  const g_d_m = [0, 31, isGregorianLeapYear(gy) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gy2 = gy - 1600;
  let gm2 = gm - 1;
  let gd2 = gd - 1;

  let g_day_no = 365 * gy2 + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400);

  for (let i = 0; i < gm2; ++i) g_day_no += g_d_m[i + 1];
  g_day_no += gd2;

  let j_day_no = g_day_no - 79;

  let j_np = Math.floor(j_day_no / 12053);
  j_day_no %= 12053;

  let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  let jm: number;
  let jd: number;
  if (j_day_no < 186) {
    jm = 1 + Math.floor(j_day_no / 31);
    jd = 1 + (j_day_no % 31);
  } else {
    jm = 7 + Math.floor((j_day_no - 186) / 30);
    jd = 1 + ((j_day_no - 186) % 30);
  }

  return { jy, jm, jd };
}

/**
 * Converts Jalali date to Gregorian date.
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  let jy2 = jy - 979;
  let jm2 = jm - 1;
  let jd2 = jd - 1;

  let j_day_no = 365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);
  for (let i = 0; i < jm2; ++i) {
    j_day_no += i < 6 ? 31 : 30;
  }
  j_day_no += jd2;

  let g_day_no = j_day_no + 79;

  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  g_day_no %= 146097;

  let leap = true;
  if (g_day_no >= 36525) {
    g_day_no--;
    gy += 100 * Math.floor(g_day_no / 36524);
    g_day_no %= 36524;

    if (g_day_no >= 365) {
      g_day_no++;
    } else {
      leap = false;
    }
  }

  gy += 4 * Math.floor(g_day_no / 1461);
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;
    g_day_no--;
    gy += Math.floor(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  const g_d_m = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 12 && g_day_no >= g_d_m[gm + 1]) {
    g_day_no -= g_d_m[gm + 1];
    gm++;
  }
  gm += 1;
  let gd = g_day_no + 1;

  return { gy, gm, gd };
}

/**
 * Returns current Date in both Jalali and Gregorian.
 */
export function getCurrentDates() {
  const now = new Date();
  const gy = now.getFullYear();
  const gm = now.getMonth() + 1;
  const gd = now.getDate();
  const jalali = gregorianToJalali(gy, gm, gd);

  const dayOfWeek = now.getDay(); // 0 is Sunday
  const weekdayFa = PERSIAN_WEEKDAYS[dayOfWeek];

  return {
    gregorian: { gy, gm, gd, dateString: `${gy}/${String(gm).padStart(2, '0')}/${String(gd).padStart(2, '0')}` },
    jalali: {
      jy: jalali.jy,
      jm: jalali.jm,
      jd: jalali.jd,
      dateString: `${jalali.jy}/${String(jalali.jm).padStart(2, '0')}/${String(jalali.jd).padStart(2, '0')}`,
      monthName: PERSIAN_MONTHS[jalali.jm - 1],
      weekday: weekdayFa
    }
  };
}

/**
 * Formats a Jalali date string "1403/07/15" to readable Persian format: ۱۵ مهر ۱۴۰۳
 */
export function formatJalaliReadable(jy: number, jm: number, jd: number): string {
  const monthName = PERSIAN_MONTHS[jm - 1] || '';
  return `${jd} ${monthName} ${jy}`;
}

/**
 * Calculates day difference between two Gregorian or Jalali dates.
 */
export function getDaysDifference(
  d1: { y: number; m: number; d: number; isJalali: boolean },
  d2: { y: number; m: number; d: number; isJalali: boolean }
): number {
  const g1 = d1.isJalali ? jalaliToGregorian(d1.y, d1.m, d1.d) : { gy: d1.y, gm: d1.m, gd: d1.d };
  const g2 = d2.isJalali ? jalaliToGregorian(d2.y, d2.m, d2.d) : { gy: d2.y, gm: d2.m, gd: d2.d };

  const date1 = new Date(Date.UTC(g1.gy, g1.gm - 1, g1.gd));
  const date2 = new Date(Date.UTC(g2.gy, g2.gm - 1, g2.gd));

  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Adds or subtracts days from a Jalali date and returns the resulting Jalali & Gregorian dates.
 */
export function addDaysToJalali(jy: number, jm: number, jd: number, daysToAdd: number) {
  const g = jalaliToGregorian(jy, jm, jd);
  const date = new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
  date.setUTCDate(date.getUTCDate() + daysToAdd);

  const gy = date.getUTCFullYear();
  const gm = date.getUTCMonth() + 1;
  const gd = date.getUTCDate();

  const j = gregorianToJalali(gy, gm, gd);
  const dayOfWeek = date.getUTCDay();

  return {
    jalali: {
      ...j,
      dateString: `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`,
      readable: formatJalaliReadable(j.jy, j.jm, j.jd),
      weekday: PERSIAN_WEEKDAYS[dayOfWeek]
    },
    gregorian: {
      gy,
      gm,
      gd,
      dateString: `${gy}/${String(gm).padStart(2, '0')}/${String(gd).padStart(2, '0')}`
    }
  };
}

/**
 * Formats numbers into Persian digits if desired.
 */
export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (w) => persianDigits[Number(w)]);
}

/**
 * Formats a number with comma separators.
 */
export function formatToman(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '۰';
  return Math.round(amount).toLocaleString('fa-IR');
}
