import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  categories,
  dialogueLines,
  grammarPatterns,
  vocabularyItems,
  type VocabularyItem,
} from "./data/learningData";
import {
  activityLabels,
  type ActivityKey,
  useProgress,
} from "./lib/progress";
import { assetPath } from "./lib/assets";

type Screen = "home" | "vocabulary" | "grammar";
type FeedbackTone = "idle" | "correct" | "wrong";

type ActivityProps = {
  markActivity: (key: ActivityKey, score: number) => void;
};

const vocabActivityKeys: ActivityKey[] = [
  "vocab-flip",
  "vocab-match",
  "vocab-meaning",
  "vocab-fill",
  "vocab-sort",
];

const grammarActivityKeys: ActivityKey[] = [
  "grammar-puzzle",
  "grammar-transform",
  "grammar-context",
  "grammar-fix",
  "grammar-dialogue",
];

const sectionTabs: { id: Screen; label: string }[] = [
  { id: "home", label: "學習入口" },
  { id: "vocabulary", label: "詞彙學習" },
  { id: "grammar", label: "語法學習" },
];

function Feedback({
  tone,
  message,
}: {
  tone: FeedbackTone;
  message: string;
}) {
  if (tone === "idle") {
    return <div className="feedback feedback-idle">{message}</div>;
  }

  return (
    <motion.div
      className={`feedback ${tone === "correct" ? "feedback-correct" : "feedback-wrong"}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
    >
      {message}
    </motion.div>
  );
}

function ProgressPanel({
  summary,
  resetProgress,
}: {
  summary: { completed: number; total: number; bestScore: number };
  resetProgress: () => void;
}) {
  const percent = Math.round((summary.completed / summary.total) * 100);

  return (
    <section className="progress-panel" aria-label="學習進度">
      <div>
        <p className="eyebrow">A1-A2 Playlab</p>
        <h1>華語小任務</h1>
        <p>
          透過短句、圖片與即時回饋練習繁中、拼音與英文意思。今天先完成一個任務也很好。
        </p>
      </div>
      <div className="progress-meter" aria-label={`已完成 ${percent}%`}>
        <div className="meter-ring">
          <span>{percent}%</span>
        </div>
        <div>
          <strong>
            {summary.completed}/{summary.total} 個活動
          </strong>
          <small>最佳總分 {summary.bestScore}</small>
          <button className="text-button" type="button" onClick={resetProgress}>
            重設進度
          </button>
        </div>
      </div>
    </section>
  );
}

function HomeScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <motion.main
      className="home-grid"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">繁中 + pinyin + English</p>
          <h2>玩 10 個小任務，把日常華語說出來。</h2>
          <p>
            詞彙從看圖、配對到句中填詞；語法從句型拼圖到對話排序，適合初級學習者自學或課堂投影。
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => setScreen("vocabulary")}>
              開始詞彙
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setScreen("grammar")}
            >
              開始語法
            </button>
          </div>
        </div>
        <motion.img
          src={assetPath("illustrations/hero.svg")}
          alt="華語學習角色、卡片與句型方塊"
          initial={{ rotate: -2, scale: 0.96 }}
          animate={{ rotate: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </section>

      <section className="learning-map" aria-label="學習地圖">
        <LearningPath
          title="詞彙學習"
          description="看圖、聽心裡讀音、說出中文，再把詞語放回句子。"
          keys={vocabActivityKeys}
          onStart={() => setScreen("vocabulary")}
        />
        <LearningPath
          title="語法學習"
          description="把字塊排成句子，練習否定句、地點句與短對話。"
          keys={grammarActivityKeys}
          onStart={() => setScreen("grammar")}
        />
      </section>
    </motion.main>
  );
}

function LearningPath({
  title,
  description,
  keys,
  onStart,
}: {
  title: string;
  description: string;
  keys: ActivityKey[];
  onStart: () => void;
}) {
  return (
    <article className="path-panel">
      <div>
        <p className="eyebrow">{keys.length} activities</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <ol>
        {keys.map((key) => (
          <li key={key}>{activityLabels[key]}</li>
        ))}
      </ol>
      <button type="button" onClick={onStart}>
        進入練習
      </button>
    </article>
  );
}

function ActivityShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className="activity-shell"
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35 }}
    >
      <div className="activity-heading">
        <p className="eyebrow">{title}</p>
        <h3>{subtitle}</h3>
      </div>
      {children}
    </motion.section>
  );
}

function VocabularyScreen({ markActivity }: ActivityProps) {
  return (
    <main className="activity-stack">
      <IntroBand
        title="詞彙學習"
        body="先看圖片建立意思，再用拼音、英文與例句把詞語放進語境。"
        image={assetPath("illustrations/vocab-world.svg")}
        alt="詞彙卡片與分類籃"
      />
      <VocabFlip markActivity={markActivity} />
      <VocabMatch markActivity={markActivity} />
      <VocabMeaning markActivity={markActivity} />
      <VocabFill markActivity={markActivity} />
      <VocabSort markActivity={markActivity} />
    </main>
  );
}

function GrammarScreen({ markActivity }: ActivityProps) {
  return (
    <main className="activity-stack">
      <IntroBand
        title="語法學習"
        body="從 A1 句型開始，透過拼圖、轉換、情境與對話練習句子的順序。"
        image={assetPath("illustrations/grammar-world.svg")}
        alt="語法方塊與對話泡泡"
      />
      <GrammarPuzzle markActivity={markActivity} />
      <GrammarTransform markActivity={markActivity} />
      <GrammarContext markActivity={markActivity} />
      <GrammarFix markActivity={markActivity} />
      <DialogueOrder markActivity={markActivity} />
    </main>
  );
}

function IntroBand({
  title,
  body,
  image,
  alt,
}: {
  title: string;
  body: string;
  image: string;
  alt: string;
}) {
  return (
    <section className="intro-band">
      <div>
        <p className="eyebrow">A1-A2</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <img src={image} alt={alt} />
    </section>
  );
}

function VocabFlip({ markActivity }: ActivityProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const item = vocabularyItems[index];

  function markSeen(nextItem = item) {
    const next = new Set(seen);
    next.add(nextItem.id);
    setSeen(next);
    markActivity("vocab-flip", next.size * 10);
  }

  return (
    <ActivityShell title="詞彙翻牌" subtitle="翻開卡片，看拼音、英文與例句">
      <div className="flip-layout">
        <button
          className={`flip-card ${flipped ? "is-flipped" : ""}`}
          type="button"
          onClick={() => {
            setFlipped((value) => !value);
            markSeen();
          }}
          aria-label={`翻開 ${item.zh} 卡片`}
        >
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.span
                key="front"
                className="flip-face"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: 90 }}
              >
                <img src={item.image} alt={item.english} />
                <strong>{item.zh}</strong>
              </motion.span>
            ) : (
              <motion.span
                key="back"
                className="flip-face flip-back"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: 90 }}
              >
                <strong>{item.pinyin}</strong>
                <span>{item.english}</span>
                <small>{item.example.zh}</small>
                <small>{item.example.pinyin}</small>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <div className="control-panel">
          <Feedback
            tone={seen.has(item.id) ? "correct" : "idle"}
            message={
              seen.has(item.id)
                ? `已看過 ${seen.size} 張卡片`
                : "點卡片翻面，讀出中文與拼音。"
            }
          />
          <div className="button-row">
            <button
              type="button"
              onClick={() => {
                setIndex((value) =>
                  value === 0 ? vocabularyItems.length - 1 : value - 1,
                );
                setFlipped(false);
              }}
            >
              上一張
            </button>
            <button
              type="button"
              onClick={() => {
                setIndex((value) => (value + 1) % vocabularyItems.length);
                setFlipped(false);
              }}
            >
              下一張
            </button>
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}

function VocabMatch({ markActivity }: ActivityProps) {
  const items = vocabularyItems.slice(0, 6);
  const [selected, setSelected] = useState<VocabularyItem | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "先選詞語，再選相同意思的圖片。",
  });

  function tryMatch(target: VocabularyItem) {
    if (!selected || matched.has(target.id)) return;

    if (selected.id === target.id) {
      const next = new Set(matched);
      next.add(target.id);
      setMatched(next);
      setFeedback({
        tone: "correct",
        message: `${target.zh} 配對成功。`,
      });
      markActivity("vocab-match", Math.round((next.size / items.length) * 100));
      setSelected(null);
      return;
    }

    setFeedback({
      tone: "wrong",
      message: `${selected.zh} 不是這張圖片，再試一次。`,
    });
  }

  return (
    <ActivityShell title="圖詞配對" subtitle="用點選完成圖片與詞語配對">
      <div className="match-grid">
        <div className="word-bank">
          {items.map((item) => (
            <button
              className={selected?.id === item.id ? "selected" : ""}
              type="button"
              key={item.id}
              disabled={matched.has(item.id)}
              onClick={() => setSelected(item)}
            >
              {item.zh}
              <small>{item.pinyin}</small>
            </button>
          ))}
        </div>
        <div className="picture-grid">
          {items.map((item) => (
            <button
              className={matched.has(item.id) ? "matched" : ""}
              type="button"
              key={item.id}
              onClick={() => tryMatch(item)}
            >
              <img src={item.image} alt={item.english} />
              <span>{matched.has(item.id) ? item.zh : "選圖片"}</span>
            </button>
          ))}
        </div>
      </div>
      <Feedback tone={feedback.tone} message={feedback.message} />
    </ActivityShell>
  );
}

function VocabMeaning({ markActivity }: ActivityProps) {
  const questions = vocabularyItems.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "看中文和圖片，選英文意思。",
  });
  const item = questions[index];
  const options = useMemo(() => {
    const distractors = vocabularyItems
      .filter((candidate) => candidate.id !== item.id)
      .slice(index, index + 2)
      .map((candidate) => candidate.english);
    return [item.english, ...distractors].sort((a, b) => a.localeCompare(b));
  }, [index, item]);

  function answer(option: string) {
    if (answered) return;
    const correct = option === item.english;
    const nextScore = correct ? score + 20 : score;
    setScore(nextScore);
    setAnswered(true);
    setFeedback({
      tone: correct ? "correct" : "wrong",
      message: correct ? "答對了。" : `正確答案是 ${item.english}。`,
    });
    if (index === questions.length - 1) {
      markActivity("vocab-meaning", nextScore);
    }
  }

  return (
    <ActivityShell title="詞義快選" subtitle="快速連結中文、圖片與英文意思">
      <div className="quiz-card">
        <img src={item.image} alt={item.english} />
        <div>
          <p className="large-zh">{item.zh}</p>
          <p>{item.pinyin}</p>
        </div>
      </div>
      <div className="option-grid">
        {options.map((option) => (
          <button type="button" key={option} onClick={() => answer(option)}>
            {option}
          </button>
        ))}
      </div>
      <div className="button-row">
        <Feedback tone={feedback.tone} message={feedback.message} />
        <button
          type="button"
          onClick={() => {
            setIndex((value) => (value + 1) % questions.length);
            setAnswered(false);
            setFeedback({
              tone: "idle",
              message: "看中文和圖片，選英文意思。",
            });
          }}
        >
          下一題
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setIndex(0);
            setScore(0);
            setAnswered(false);
            markActivity("vocab-meaning", 0);
          }}
        >
          重新開始
        </button>
      </div>
    </ActivityShell>
  );
}

function VocabFill({ markActivity }: ActivityProps) {
  const questions = vocabularyItems.slice(2, 8);
  const [index, setIndex] = useState(0);
  const [correctIds, setCorrectIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "選一個詞放進句子空格。",
  });
  const item = questions[index];

  function choose(candidate: VocabularyItem) {
    if (candidate.id === item.id) {
      const next = new Set(correctIds);
      next.add(candidate.id);
      setCorrectIds(next);
      setFeedback({
        tone: "correct",
        message: `${candidate.zh} 放進句子很自然。`,
      });
      markActivity("vocab-fill", Math.round((next.size / questions.length) * 100));
      return;
    }

    setFeedback({
      tone: "wrong",
      message: `${candidate.zh} 不是這一句需要的詞。`,
    });
  }

  return (
    <ActivityShell title="句中填詞" subtitle="把詞語放回 A1 例句">
      <div className="sentence-board">
        <span>{item.example.blank}</span>
        <small>{item.example.english}</small>
      </div>
      <div className="chip-row">
        {questions.map((candidate) => (
          <button type="button" key={candidate.id} onClick={() => choose(candidate)}>
            {candidate.zh}
            <small>{candidate.pinyin}</small>
          </button>
        ))}
      </div>
      <div className="button-row">
        <Feedback tone={feedback.tone} message={feedback.message} />
        <button
          type="button"
          onClick={() => {
            setIndex((value) => (value + 1) % questions.length);
            setFeedback({
              tone: "idle",
              message: "選一個詞放進句子空格。",
            });
          }}
        >
          下一句
        </button>
      </div>
    </ActivityShell>
  );
}

function VocabSort({ markActivity }: ActivityProps) {
  const [selected, setSelected] = useState<VocabularyItem | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "先選一個詞，再選分類籃。",
  });

  function place(category: string) {
    if (!selected) return;
    const next = { ...placements, [selected.id]: category };
    setPlacements(next);
    const isCorrect = selected.category === category;
    const correctCount = vocabularyItems.filter(
      (item) => next[item.id] === item.category,
    ).length;
    setFeedback({
      tone: isCorrect ? "correct" : "wrong",
      message: isCorrect
        ? `${selected.zh} 屬於「${category}」。`
        : `${selected.zh} 不屬於「${category}」。`,
    });
    markActivity("vocab-sort", Math.round((correctCount / vocabularyItems.length) * 100));
    setSelected(null);
  }

  return (
    <ActivityShell title="分類挑戰" subtitle="把詞彙分到人物、食物、地點、動作與時間">
      <div className="sort-layout">
        <div className="chip-row">
          {vocabularyItems.map((item) => (
            <button
              className={selected?.id === item.id ? "selected" : ""}
              type="button"
              key={item.id}
              onClick={() => setSelected(item)}
            >
              {item.zh}
              <small>{placements[item.id] || item.pinyin}</small>
            </button>
          ))}
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button type="button" key={category} onClick={() => place(category)}>
              {category}
              <small>
                {
                  vocabularyItems.filter(
                    (item) => placements[item.id] === category,
                  ).length
                }{" "}
                個
              </small>
            </button>
          ))}
        </div>
      </div>
      <Feedback tone={feedback.tone} message={feedback.message} />
    </ActivityShell>
  );
}

function GrammarPuzzle({ markActivity }: ActivityProps) {
  const [patternIndex, setPatternIndex] = useState(0);
  const [answer, setAnswer] = useState<string[]>([]);
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "依序點字塊，拼成正確句子。",
  });
  const pattern = grammarPatterns[patternIndex];

  function check() {
    const sentence = answer.join("");
    const correct = sentence === pattern.answer;
    setFeedback({
      tone: correct ? "correct" : "wrong",
      message: correct
        ? `${sentence} 是正確句子。`
        : "語序還不對，清除後再試一次。",
    });
    markActivity("grammar-puzzle", correct ? 100 : 0);
  }

  return (
    <ActivityShell title="句型拼圖" subtitle="把字塊排成 A1 句型">
      <PatternHeader pattern={pattern} />
      <div className="sentence-board">
        <span>{answer.length ? answer.join(" ") : "點下面的字塊"}</span>
        <small>{pattern.explanation}</small>
      </div>
      <div className="chip-row">
        {pattern.puzzle.map((word) => (
          <button type="button" key={word} onClick={() => setAnswer([...answer, word])}>
            {word}
          </button>
        ))}
      </div>
      <div className="button-row">
        <button type="button" onClick={check}>
          檢查
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => setAnswer([])}
        >
          清除
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setPatternIndex((value) => (value + 1) % grammarPatterns.length);
            setAnswer([]);
          }}
        >
          下一個句型
        </button>
      </div>
      <Feedback tone={feedback.tone} message={feedback.message} />
    </ActivityShell>
  );
}

function GrammarTransform({ markActivity }: ActivityProps) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "選出轉換後最自然的句子。",
  });
  const item = grammarPatterns[index].transform;

  function choose(option: string) {
    const correct = option === item.answer;
    setFeedback({
      tone: correct ? "correct" : "wrong",
      message: correct ? "轉換正確。" : `正確句子是：${item.answer}`,
    });
    markActivity("grammar-transform", correct ? 100 : 0);
  }

  return (
    <ActivityShell title="語法轉換機" subtitle="練習否定句與替換詞">
      <div className="sentence-board">
        <small>{item.prompt}</small>
        <span>{item.source}</span>
      </div>
      <div className="option-grid">
        {item.options.map((option) => (
          <button type="button" key={option} onClick={() => choose(option)}>
            {option}
          </button>
        ))}
      </div>
      <div className="button-row">
        <Feedback tone={feedback.tone} message={feedback.message} />
        <button
          type="button"
          onClick={() => {
            setIndex((value) => (value + 1) % grammarPatterns.length);
            setFeedback({
              tone: "idle",
              message: "選出轉換後最自然的句子。",
            });
          }}
        >
          下一題
        </button>
      </div>
    </ActivityShell>
  );
}

function GrammarContext({ markActivity }: ActivityProps) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "讀情境，選最自然的句子。",
  });
  const item = grammarPatterns[index].context;

  function choose(option: string) {
    const correct = option === item.answer;
    setFeedback({
      tone: correct ? "correct" : "wrong",
      message: correct ? "這一句很自然。" : `更自然的是：${item.answer}`,
    });
    markActivity("grammar-context", correct ? 100 : 0);
  }

  return (
    <ActivityShell title="情境選句" subtitle="依圖片與短情境選句">
      <div className="context-board">
        <img src={item.image} alt={item.scene} />
        <strong>{item.scene}</strong>
      </div>
      <div className="option-grid">
        {item.options.map((option) => (
          <button type="button" key={option} onClick={() => choose(option)}>
            {option}
          </button>
        ))}
      </div>
      <div className="button-row">
        <Feedback tone={feedback.tone} message={feedback.message} />
        <button
          type="button"
          onClick={() => {
            setIndex((value) => (value + 1) % grammarPatterns.length);
            setFeedback({
              tone: "idle",
              message: "讀情境，選最自然的句子。",
            });
          }}
        >
          下一題
        </button>
      </div>
    </ActivityShell>
  );
}

function GrammarFix({ markActivity }: ActivityProps) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "找出正確改法。",
  });
  const item = grammarPatterns[index].fix;

  function choose(option: string) {
    const correct = option === item.answer;
    setFeedback({
      tone: correct ? "correct" : "wrong",
      message: correct ? "修改正確。" : `正確改法是：${item.answer}`,
    });
    markActivity("grammar-fix", correct ? 100 : 0);
  }

  return (
    <ActivityShell title="錯誤修正" subtitle="辨認初級華語常見語序錯誤">
      <div className="sentence-board error-board">
        <small>原句</small>
        <span>{item.wrong}</span>
      </div>
      <div className="option-grid">
        {item.options.map((option) => (
          <button type="button" key={option} onClick={() => choose(option)}>
            {option}
          </button>
        ))}
      </div>
      <div className="button-row">
        <Feedback tone={feedback.tone} message={feedback.message} />
        <button
          type="button"
          onClick={() => {
            setIndex((value) => (value + 1) % grammarPatterns.length);
            setFeedback({ tone: "idle", message: "找出正確改法。" });
          }}
        >
          下一題
        </button>
      </div>
    </ActivityShell>
  );
}

function DialogueOrder({ markActivity }: ActivityProps) {
  const scrambled = [
    dialogueLines[2],
    dialogueLines[0],
    dialogueLines[3],
    dialogueLines[1],
  ];
  const [lines, setLines] = useState(scrambled);
  const [feedback, setFeedback] = useState({
    tone: "idle" as FeedbackTone,
    message: "用上移、下移排出自然對話。",
  });

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= lines.length) return;
    const next = [...lines];
    [next[index], next[target]] = [next[target], next[index]];
    setLines(next);
  }

  function check() {
    const correct = lines.every((line, index) => line === dialogueLines[index]);
    setFeedback({
      tone: correct ? "correct" : "wrong",
      message: correct ? "對話順序自然。" : "順序還不自然，想想打招呼的流程。",
    });
    markActivity("grammar-dialogue", correct ? 100 : 0);
  }

  return (
    <ActivityShell title="對話排序" subtitle="排列短對話，練習自然互動">
      <ol className="dialogue-list">
        {lines.map((line, index) => (
          <li key={line}>
            <span>{line}</span>
            <div>
              <button type="button" onClick={() => move(index, -1)}>
                上移
              </button>
              <button type="button" onClick={() => move(index, 1)}>
                下移
              </button>
            </div>
          </li>
        ))}
      </ol>
      <div className="button-row">
        <button type="button" onClick={check}>
          檢查對話
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => setLines(scrambled)}
        >
          重新開始
        </button>
      </div>
      <Feedback tone={feedback.tone} message={feedback.message} />
    </ActivityShell>
  );
}

function PatternHeader({ pattern }: { pattern: (typeof grammarPatterns)[number] }) {
  return (
    <div className="pattern-header">
      <div>
        <strong>{pattern.title}</strong>
        <span>{pattern.pattern}</span>
      </div>
      <p>
        {pattern.example.zh} / {pattern.example.pinyin} /{" "}
        {pattern.example.english}
      </p>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const { summary, markActivity, resetProgress } = useProgress();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#main" className="skip-link">
          跳到主要內容
        </a>
        <div className="brand-mark">
          <img src={assetPath("icons/book-bubble.svg")} alt="" />
          <span>Huayu A1 Playlab</span>
        </div>
        <nav aria-label="主要頁面">
          {sectionTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={screen === tab.id ? "active" : ""}
              onClick={() => setScreen(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main id="main">
        <ProgressPanel summary={summary} resetProgress={resetProgress} />
        <AnimatePresence mode="wait">
          {screen === "home" && <HomeScreen key="home" setScreen={setScreen} />}
          {screen === "vocabulary" && (
            <VocabularyScreen key="vocabulary" markActivity={markActivity} />
          )}
          {screen === "grammar" && (
            <GrammarScreen key="grammar" markActivity={markActivity} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
