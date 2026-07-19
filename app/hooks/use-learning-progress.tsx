"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProgressState = {
  completedLessons: string[];
  completedExercises: string[];
  quizScores: Record<string, number>;
  wrongQuestions: string[];
  bookmarks: string[];
  lastVisited: string;
};

type ProgressContextValue = ProgressState & {
  ready: boolean;
  toggleLesson: (slug: string) => void;
  toggleExercise: (id: string) => void;
  saveQuiz: (slug: string, score: number, wrongIds: string[]) => void;
  toggleBookmark: (slug: string) => void;
  visit: (slug: string) => void;
  resetProgress: () => void;
};

const STORAGE_KEY = "csd-python-progress-v1";

const initialState: ProgressState = {
  completedLessons: [],
  completedExercises: [],
  quizScores: {},
  wrongQuestions: [],
  bookmarks: [],
  lastVisited: "singly-linked-list",
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function LearningProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setState({ ...initialState, ...JSON.parse(saved) });
    } catch {
      // Trình duyệt có thể chặn localStorage; website vẫn dùng được trong phiên.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Không làm gián đoạn việc học nếu bộ nhớ thiết bị hết dung lượng.
    }
  }, [ready, state]);

  const toggleInList = useCallback(
    (key: "completedLessons" | "completedExercises" | "bookmarks", id: string) => {
      setState((current) => {
        const list = current[key];
        return {
          ...current,
          [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
        };
      });
    },
    [],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      ...state,
      ready,
      toggleLesson: (slug) => toggleInList("completedLessons", slug),
      toggleExercise: (id) => toggleInList("completedExercises", id),
      toggleBookmark: (slug) => toggleInList("bookmarks", slug),
      saveQuiz: (slug, score, wrongIds) =>
        setState((current) => ({
          ...current,
          quizScores: {
            ...current.quizScores,
            [slug]: Math.max(score, current.quizScores[slug] ?? 0),
          },
          wrongQuestions: Array.from(new Set([...current.wrongQuestions, ...wrongIds])),
        })),
      visit: (slug) => setState((current) => ({ ...current, lastVisited: slug })),
      resetProgress: () => setState(initialState),
    }),
    [ready, state, toggleInList],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useLearningProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useLearningProgress phải nằm trong LearningProgressProvider");
  return context;
}
