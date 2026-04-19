import { assetPath } from "../lib/assets";

export type VocabCategory = "人物" | "食物" | "地點" | "動作" | "時間";

export type VocabularyItem = {
  id: string;
  zh: string;
  pinyin: string;
  english: string;
  category: VocabCategory;
  image: string;
  example: {
    zh: string;
    pinyin: string;
    english: string;
    blank: string;
  };
};

export type GrammarPattern = {
  id: string;
  title: string;
  pattern: string;
  explanation: string;
  example: {
    zh: string;
    pinyin: string;
    english: string;
  };
  puzzle: string[];
  answer: string;
  transform: {
    prompt: string;
    source: string;
    options: string[];
    answer: string;
  };
  context: {
    scene: string;
    image: string;
    options: string[];
    answer: string;
  };
  fix: {
    wrong: string;
    options: string[];
    answer: string;
  };
};

export const vocabularyItems: VocabularyItem[] = [
  {
    id: "teacher",
    zh: "老師",
    pinyin: "lao shi",
    english: "teacher",
    category: "人物",
    image: assetPath("illustrations/teacher.svg"),
    example: {
      zh: "老師很好。",
      pinyin: "Lao shi hen hao.",
      english: "The teacher is very nice.",
      blank: "____很好。",
    },
  },
  {
    id: "friend",
    zh: "朋友",
    pinyin: "peng you",
    english: "friend",
    category: "人物",
    image: assetPath("illustrations/friend.svg"),
    example: {
      zh: "他是我的朋友。",
      pinyin: "Ta shi wo de peng you.",
      english: "He is my friend.",
      blank: "他是我的____。",
    },
  },
  {
    id: "school",
    zh: "學校",
    pinyin: "xue xiao",
    english: "school",
    category: "地點",
    image: assetPath("illustrations/school.svg"),
    example: {
      zh: "我去學校。",
      pinyin: "Wo qu xue xiao.",
      english: "I go to school.",
      blank: "我去____。",
    },
  },
  {
    id: "home",
    zh: "家",
    pinyin: "jia",
    english: "home",
    category: "地點",
    image: assetPath("illustrations/home.svg"),
    example: {
      zh: "我在家。",
      pinyin: "Wo zai jia.",
      english: "I am at home.",
      blank: "我在____。",
    },
  },
  {
    id: "water",
    zh: "水",
    pinyin: "shui",
    english: "water",
    category: "食物",
    image: assetPath("illustrations/water.svg"),
    example: {
      zh: "我喝水。",
      pinyin: "Wo he shui.",
      english: "I drink water.",
      blank: "我喝____。",
    },
  },
  {
    id: "rice",
    zh: "飯",
    pinyin: "fan",
    english: "rice; meal",
    category: "食物",
    image: assetPath("illustrations/rice.svg"),
    example: {
      zh: "我吃飯。",
      pinyin: "Wo chi fan.",
      english: "I eat a meal.",
      blank: "我吃____。",
    },
  },
  {
    id: "eat",
    zh: "吃",
    pinyin: "chi",
    english: "to eat",
    category: "動作",
    image: assetPath("illustrations/eat.svg"),
    example: {
      zh: "妹妹吃飯。",
      pinyin: "Mei mei chi fan.",
      english: "Younger sister eats a meal.",
      blank: "妹妹____飯。",
    },
  },
  {
    id: "drink",
    zh: "喝",
    pinyin: "he",
    english: "to drink",
    category: "動作",
    image: assetPath("illustrations/drink.svg"),
    example: {
      zh: "哥哥喝水。",
      pinyin: "Ge ge he shui.",
      english: "Older brother drinks water.",
      blank: "哥哥____水。",
    },
  },
  {
    id: "today",
    zh: "今天",
    pinyin: "jin tian",
    english: "today",
    category: "時間",
    image: assetPath("illustrations/today.svg"),
    example: {
      zh: "今天我很忙。",
      pinyin: "Jin tian wo hen mang.",
      english: "Today I am busy.",
      blank: "____我很忙。",
    },
  },
  {
    id: "tomorrow",
    zh: "明天",
    pinyin: "ming tian",
    english: "tomorrow",
    category: "時間",
    image: assetPath("illustrations/tomorrow.svg"),
    example: {
      zh: "明天見。",
      pinyin: "Ming tian jian.",
      english: "See you tomorrow.",
      blank: "____見。",
    },
  },
];

export const categories: VocabCategory[] = [
  "人物",
  "食物",
  "地點",
  "動作",
  "時間",
];

export const grammarPatterns: GrammarPattern[] = [
  {
    id: "shi",
    title: "A 是 B",
    pattern: "主詞 + 是 + 身分／關係",
    explanation: "用「是」介紹身分、關係或名稱。",
    example: {
      zh: "她是老師。",
      pinyin: "Ta shi lao shi.",
      english: "She is a teacher.",
    },
    puzzle: ["她", "是", "老師"],
    answer: "她是老師",
    transform: {
      prompt: "把句子改成否定句",
      source: "我是學生。",
      options: ["我不是學生。", "我不學生。", "我是不要學生。"],
      answer: "我不是學生。",
    },
    context: {
      scene: "你想介紹你的朋友。",
      image: assetPath("illustrations/friend.svg"),
      options: ["他是我的朋友。", "他在我的朋友。", "他有我的朋友。"],
      answer: "他是我的朋友。",
    },
    fix: {
      wrong: "我是很老師。",
      options: ["我是老師。", "我很老師。", "我在老師。"],
      answer: "我是老師。",
    },
  },
  {
    id: "hen",
    title: "很 + 形容詞",
    pattern: "主詞 + 很 + 形容詞",
    explanation: "描述狀態時，中文常用「很」連接主詞與形容詞。",
    example: {
      zh: "今天很熱。",
      pinyin: "Jin tian hen re.",
      english: "Today is hot.",
    },
    puzzle: ["今天", "很", "熱"],
    answer: "今天很熱",
    transform: {
      prompt: "把句子改成否定句",
      source: "我很忙。",
      options: ["我不忙。", "我不是忙。", "我沒有忙。"],
      answer: "我不忙。",
    },
    context: {
      scene: "你想說今天天氣熱。",
      image: assetPath("illustrations/today.svg"),
      options: ["今天很熱。", "今天是熱。", "今天在熱。"],
      answer: "今天很熱。",
    },
    fix: {
      wrong: "老師是很好。",
      options: ["老師很好。", "老師有很好。", "老師在很好。"],
      answer: "老師很好。",
    },
  },
  {
    id: "zai",
    title: "在 + 地點",
    pattern: "主詞 + 在 + 地點",
    explanation: "用「在」說明人或東西的位置。",
    example: {
      zh: "我在學校。",
      pinyin: "Wo zai xue xiao.",
      english: "I am at school.",
    },
    puzzle: ["我", "在", "學校"],
    answer: "我在學校",
    transform: {
      prompt: "把地點換成「家」",
      source: "我在學校。",
      options: ["我在家。", "我去家。", "我是家。"],
      answer: "我在家。",
    },
    context: {
      scene: "你人在家裡，要說自己的位置。",
      image: assetPath("illustrations/home.svg"),
      options: ["我在家。", "我是家。", "我有家。"],
      answer: "我在家。",
    },
    fix: {
      wrong: "我是在學校。",
      options: ["我在學校。", "我是學校。", "我有學校。"],
      answer: "我在學校。",
    },
  },
  {
    id: "verb-object",
    title: "動詞 + 受詞",
    pattern: "主詞 + 動詞 + 受詞",
    explanation: "日常動作通常放在主詞後面，再接動作的對象。",
    example: {
      zh: "我喝水。",
      pinyin: "Wo he shui.",
      english: "I drink water.",
    },
    puzzle: ["我", "喝", "水"],
    answer: "我喝水",
    transform: {
      prompt: "把動作換成「吃飯」",
      source: "我喝水。",
      options: ["我吃飯。", "我飯吃。", "我喝飯。"],
      answer: "我吃飯。",
    },
    context: {
      scene: "午餐時間，你要說你正在吃飯。",
      image: assetPath("illustrations/rice.svg"),
      options: ["我吃飯。", "我飯吃。", "我在飯。"],
      answer: "我吃飯。",
    },
    fix: {
      wrong: "我水喝。",
      options: ["我喝水。", "我是喝水。", "我水是喝。"],
      answer: "我喝水。",
    },
  },
  {
    id: "time-first",
    title: "時間 + 主詞 + 動作",
    pattern: "時間詞 + 主詞 + 動作",
    explanation: "中文常把時間放在句子前面，說明事情發生的時間。",
    example: {
      zh: "明天我去學校。",
      pinyin: "Ming tian wo qu xue xiao.",
      english: "Tomorrow I go to school.",
    },
    puzzle: ["明天", "我", "去", "學校"],
    answer: "明天我去學校",
    transform: {
      prompt: "把時間換成「今天」",
      source: "明天我去學校。",
      options: ["今天我去學校。", "我今天去學校。", "我去今天學校。"],
      answer: "今天我去學校。",
    },
    context: {
      scene: "你要跟同學約明天見面。",
      image: assetPath("illustrations/tomorrow.svg"),
      options: ["明天見。", "見明天。", "明天是見。"],
      answer: "明天見。",
    },
    fix: {
      wrong: "我去明天學校。",
      options: ["明天我去學校。", "我明天學校去。", "去學校我明天。"],
      answer: "明天我去學校。",
    },
  },
];

export const dialogueLines = [
  "你好！",
  "你好！你是新同學嗎？",
  "是，我是新同學。",
  "很高興認識你。",
];
