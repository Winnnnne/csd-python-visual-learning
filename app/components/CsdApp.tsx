"use client";

import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { LessonPage } from "./LearningComponents";
import {
  DashboardPage,
  GlossaryPage,
  HomePage,
  NotFoundPage,
  PracticePage,
  QuizPage,
  ReviewPage,
  TopicsPage,
} from "./Pages";
import { LearningProgressProvider } from "../hooks/use-learning-progress";

export function CsdApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="app-loading" role="status">
        <span>Py</span>
        <strong>Đang chuẩn bị phòng lab CSD...</strong>
      </div>
    );
  }

  return (
    <LearningProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="topics" element={<TopicsPage />} />
            <Route path="learn/:slug" element={<LessonPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </LearningProgressProvider>
  );
}
