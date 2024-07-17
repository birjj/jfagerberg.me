export type Requirement = {
  text: (v: string) => string;
  test: (v: string) => boolean;
};

/** The below is largely taken from the challenge website */
type CharPredicate = (v: number) => boolean;
const all = (p: CharPredicate) => (s: string) => {
  for (let i = 0; i < s.length; i++) {
    if (!p(s.charCodeAt(i))) return false;
  }
  return true;
};
const any = (p: CharPredicate) => (s: string) => {
  for (let i = 0; i < s.length; i++) {
    if (p(s.charCodeAt(i))) return true;
  }
  return false;
};
const max = (xs: number[]) => {
  let x = -Infinity;
  for (let i = 0; i < xs.length; i++) {
    if (xs[i] > x) x = xs[i];
  }
  return x;
}
const min = (xs: number[]) => {
  let x = Infinity;
  for (let i = 0; i < xs.length; i++) {
    if (xs[i] < x) x = xs[i];
  }
  return x;
}

const isASCII: CharPredicate = (c) => {
  return c >= 32 && c <= 126;
};
const isUpper: CharPredicate = (c) => {
  return c >= 65 && c <= 90;
}
const isLower: CharPredicate = (c) => {
  return c >= 97 && c <= 122;
};
const isLetter: CharPredicate = (c) => {
  return isUpper(c) || isLower(c);
};
const isDigit: CharPredicate = (c) => {
  return c >= 48 && c <= 57;
};
const isRoman: CharPredicate = (c) => {
  return (c == 73 ||
          c == 86 ||
          c == 88 ||
          c == 76 ||
          c == 67 ||
          c == 68 ||
          c == 77
         );
};
const isSpecial: CharPredicate = (c) => {
  return (c < 48 ||
          c > 57 && c < 65 ||
          c > 90 && c < 97 ||
          c > 122
         );
};
const allASCII = all(isASCII);
const hasUpper = any(isUpper);
const hasLower = any(isLower);
const allLower = all(isLower);
const hasDigit = any(isDigit);
const hasSpecial = any(isSpecial);
const hasRoman = any(isRoman);
const numUnique = (s: string) => {
  const uniq = new Set();
  for (let i = 0; i < s.length; i++) {
    uniq.add(s.charCodeAt(i));
  }
  return uniq.size;
};
const letterStreak = (s: string) => {
  let streak = 0;
  let i = 0;
  for (let j = 0; j < s.length; j++) {
    if (isLetter(s.charCodeAt(j))) {
      i = min([i, j]);
    } else {
      streak = max([streak, j - i]);
      i = Infinity;
    }
  }
  return max([streak, s.length - i]);
};

const isPalindrome = (s: string) => {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) != s.charCodeAt(s.length - i - 1)) return false;
  }
  return true;
};
const b64AllLower = (s: string) => {
  return allLower(btoa(s));
};
const digitSum = (s: string) => {
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (isDigit(c)) sum += c - 48;
  }
  return sum;
}
const isCube = (n: number) => {
  return n > 0 && Math.pow(Math.round(Math.pow(n, 1/3)), 3) == n;
}
const requirements: Requirement[] = [
  
  {
    text: () => "Must be valid ASCII",
    test: allASCII
  },
  {
    text: () => "Must contain an uppercase letter",
    test: hasUpper,
  },
  {
    text: () => "Must contain a lowercase letter",
    test: hasLower,
  },
  {
    text: () => "Must contain a digit",
    test: hasDigit,
  },
  {
    text: () => "Must contain a symbol",
    test: hasSpecial,
  },
  {
    text: () => "Must contain a Roman numeral (CDILMVX)",
    test: hasRoman,
  },
  {
    text: () => "Must contain at least 8 unique characters",
    test: (v) => numUnique(v) >= 8,
  },
  {
    text: (v) => `Must be between 10 and 20 characters long (${v.length})`,
    test: (v) => v.length >= 10 && v.length <= 20,
  },
  {
    text: () => "Must contain an unbroken sequence of letters of length 5",
    test: (v) => letterStreak(v) >= 5,
  },
  {
    text: (v) => `Sum of all digits must be a cube number (${digitSum(v)})`,
    test: (v) => isCube(digitSum(v)),
  },
  {
    text: () => "Must be a palindrome",
    test: isPalindrome,
  },
  {
    text: () => "Base64 encoding must contain only lowercase letters",
    test: b64AllLower,
  },
];
export default requirements;