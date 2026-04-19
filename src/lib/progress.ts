import { useCallback, useEffect, useMemo, useState } from "react";

export type ActivityKey =
  | "vocab-flip"
  | "vocab-match"
  | "vocab-meaning"
  | "vocab-fill"
  | "vocab-sort"
  | "grammar-puzzle"
  | "grammar-transform"
  | "grammar-context"
  | "grammar-fix"
  | "grammar-dialogue";

export type ActivityProgress = Record<
  ActivityKey,
  {
    completed: boolean;
    score: number;
    attempts: number;
    lastPlayed: string | null;
  }
>;

const STORAGE_KEY = "huayu-a1-playlab-progress";

const keys: ActivityKey[] = [
  "vocab-flip",
  "vocab-match",
  "vocab-meaning",
  "vocab-fill",
  "vocab-sort",
  "grammar-puzzle",
  "grammar-transform",
  "grammar-context",
  "grammar-fix",
  "grammar-dialogue",
];

export const activityLabels: Record<ActivityKey, string> = {
  "vocab-flip": "詞彙翻牌",
  "vocab-match": "圖詞配對",
  "vocab-meaning": "詞義快選",
  "vocab-fill": "句中填詞",
  "vocab-sort": "分類挑戰",
  "grammar-puzzle": "句型拼圖",
  "grammar-transform": "語法轉換機",
  "grammar-context": "情境選句",
  "grammar-fix": "錯誤修正",
  "grammar-dialogue": "對話排序",
};

function makeInitialProgress(): ActivityProgress {
  return keys.reduce((acc, key) => {
    acc[key] = {
      completed: false,
      score: 0,
      attempts: 0,
      lastPlayed: null,
    };
    return acc;
  }, {} as ActivityProgress);
}

export function useProgress() {
  const [progress, setProgress] = useState<ActivityProgress>(() => {
    if (typeof window === "undefined") return makeInitialProgress();

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...makeInitialProgress(), ...JSON.parse(saved) }
        : makeInitialProgress();
    } catch {
      return makeInitialProgress();
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const markActivity = useCallback((key: ActivityKey, score: number) => {
    setProgress((current) => ({
      ...current,
      [key]: {
        completed: score > 0,
        score: Math.max(current[key].score, score),
        attempts: current[key].attempts + 1,
        lastPlayed: new Date().toISOString(),
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(makeInitialProgress());
  }, []);

  const summary = useMemo(() => {
    const entries = Object.values(progress);
    const completed = entries.filter((item) => item.completed).length;
    const bestScore = entries.reduce((sum, item) => sum + item.score, 0);
    return { completed, total: keys.length, bestScore };
  }, [progress]);

  return { progress, summary, markActivity, resetProgress };
}
