"use client";

import {
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clipboard,
  Code2,
  Eye,
  EyeOff,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { topicMap, topics, type Exercise, type QuizQuestion, type TopicSlug } from "../data/learning-data";
import { useLearningProgress } from "../hooks/use-learning-progress";
import { DataStructureSimulator } from "./DataStructureSimulator";

const tabs = [
  ["overview", "Tổng quan"],
  ["theory", "Lý thuyết"],
  ["simulation", "Mô phỏng"],
  ["code", "Code Python"],
  ["explanation", "Giải thích code"],
  ["exercises", "Bài tập"],
  ["quiz", "Trắc nghiệm"],
  ["mistakes", "Lỗi thường gặp"],
  ["summary", "Tóm tắt ôn thi"],
] as const;

export function CodeBlock({ code, title = "main.py" }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="code-block">
      <div className="code-head">
        <span><i className="code-dot red" /><i className="code-dot yellow" /><i className="code-dot green" />{title}</span>
        <button onClick={copy}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? "Đã sao chép" : "Sao chép"}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export function ExerciseCard({ exercise, defaultOpen = false }: { exercise: Exercise; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [code, setCode] = useState(exercise.starter);
  const [output, setOutput] = useState("Nhấn “Chạy test” để mô phỏng kết quả kiểm tra.");
  const progress = useLearningProgress();
  const completed = progress.completedExercises.includes(exercise.id);

  return (
    <article className={`exercise-card ${open ? "expanded" : ""}`}>
      <button className="exercise-title" onClick={() => setOpen((value) => !value)}>
        <span className={`level-pill level-${exercise.level.toLowerCase().replace(" ", "-")}`}>{exercise.level}</span>
        <span><strong>{exercise.title}</strong><small>{exercise.knowledge}</small></span>
        {completed && <CheckCircle2 className="completed-icon" size={18} />}
        <ChevronDown size={18} />
      </button>
      {open && (
        <motion.div className="exercise-body" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="exercise-prompt">{exercise.prompt}</p>
          <div className="io-grid">
            <div><span>Input</span><p>{exercise.input}</p></div>
            <div><span>Output mong đợi</span><p>{exercise.expected}</p></div>
          </div>
          <details className="hint-box">
            <summary><Lightbulb size={16} />Gợi ý từng bước</summary>
            <ol>{exercise.hints.map((hint) => <li key={hint}>{hint}</li>)}</ol>
          </details>
          <div className="playground">
            <div className="editor-pane">
              <div className="pane-title"><span>Python Playground · mô phỏng MVP</span><span>Python 3</span></div>
              <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} aria-label={`Code cho bài ${exercise.title}`} />
              <div className="editor-actions">
                <button className="run-button" onClick={() => setOutput(code.trim() === exercise.solution.trim() ? `✓ Passed 3/3 test cases\n${exercise.expected}` : `Chế độ mô phỏng: code đã được nhận.\nĐối chiếu output mong đợi: ${exercise.expected}`)}>▶ Chạy test</button>
                <button onClick={() => { setCode(exercise.starter); setOutput("Đã khôi phục code khung."); }}><RotateCcw size={14} /> Reset</button>
              </div>
            </div>
            <div className="output-pane"><div className="pane-title">Console output</div><pre>{output}</pre></div>
          </div>
          <div className="solution-actions">
            <button onClick={() => setSolutionVisible((value) => !value)}>
              {solutionVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              {solutionVisible ? "Ẩn lời giải" : "Xem lời giải"}
            </button>
            <button className={completed ? "is-complete" : ""} onClick={() => progress.toggleExercise(exercise.id)}>
              <CheckCircle2 size={16} />{completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
            </button>
          </div>
          {solutionVisible && (
            <div className="solution-box">
              <CodeBlock code={exercise.solution} title={`solution_${exercise.id}.py`} />
              <div className="thinking-grid">
                <div><strong>Tư duy</strong><p>{exercise.thinking}</p></div>
                <div><strong>Lỗi dễ mắc</strong><p>{exercise.commonMistake}</p></div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </article>
  );
}

export function QuizDeck({ questions, topicSlug }: { questions: QuizQuestion[]; topicSlug: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const progress = useLearningProgress();
  const score = questions.filter((question) => answers[question.id] === question.answer).length;

  const submit = () => {
    setSubmitted(true);
    const wrongIds = questions.filter((question) => answers[question.id] !== question.answer).map((question) => question.id);
    progress.saveQuiz(topicSlug, Math.round((score / questions.length) * 100), wrongIds);
  };

  return (
    <div className="quiz-deck">
      {questions.map((question, index) => (
        <article className="quiz-question" key={question.id}>
          <div className="question-kicker"><span>Câu {index + 1}</span><small>1 điểm</small></div>
          <h3>{question.question}</h3>
          {question.code && <CodeBlock code={question.code} title="question.py" />}
          <div className="answer-grid">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              const state = submitted
                ? optionIndex === question.answer
                  ? "correct"
                  : selected
                    ? "wrong"
                    : ""
                : selected
                  ? "selected"
                  : "";
              return (
                <button
                  className={state}
                  key={option}
                  onClick={() => !submitted && setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className={`answer-explanation ${answers[question.id] === question.answer ? "correct" : "wrong"}`}>
              {answers[question.id] === question.answer ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}
              <div><strong>{answers[question.id] === question.answer ? "Chính xác" : "Chưa đúng"}</strong><p>{question.explanation}</p>
                {answers[question.id] !== undefined && answers[question.id] !== question.answer && <small>{question.optionReasons[answers[question.id]]}</small>}
              </div>
            </div>
          )}
        </article>
      ))}
      <div className="quiz-submit-bar">
        <span>Đã trả lời <strong>{Object.keys(answers).length}/{questions.length}</strong> câu</span>
        {submitted ? (
          <div className="score-result"><strong>{score}/{questions.length}</strong><span>{Math.round((score / questions.length) * 100)}%</span><button onClick={() => { setAnswers({}); setSubmitted(false); }}>Làm lại</button></div>
        ) : <button className="primary-action" disabled={Object.keys(answers).length < questions.length} onClick={submit}>Nộp bài</button>}
      </div>
    </div>
  );
}

export function LessonPage() {
  const { slug } = useParams();
  const topic = slug ? topicMap[slug as TopicSlug] : undefined;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number][0]>("overview");
  const progress = useLearningProgress();

  useEffect(() => {
    if (topic) progress.visit(topic.slug);
  }, [topic?.slug]);

  if (!topic) return <Navigate to="/topics" replace />;
  const completed = progress.completedLessons.includes(topic.slug);
  const bookmarked = progress.bookmarks.includes(topic.slug);

  return (
    <div className={`lesson-page accent-${topic.accent}`}>
      <section className="lesson-hero">
        <div>
          <span className="eyebrow"><Sparkles size={14} />{topic.eyebrow}</span>
          <h1>{topic.name}</h1>
          <p>{topic.description}</p>
          <div className="lesson-meta"><span>⏱ 35 phút</span><span>◆ Cơ bản → nâng cao</span><span>Python 3</span></div>
        </div>
        <div className="lesson-actions">
          <button className={bookmarked ? "active" : ""} onClick={() => progress.toggleBookmark(topic.slug)}>
            {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}{bookmarked ? "Đã lưu" : "Lưu bài"}
          </button>
          <button className={`complete-lesson ${completed ? "active" : ""}`} onClick={() => progress.toggleLesson(topic.slug)}>
            <CheckCircle2 size={17} />{completed ? "Đã hoàn thành" : "Hoàn thành bài"}
          </button>
        </div>
      </section>

      <div className="lesson-tabs" role="tablist" aria-label="Nội dung bài học">
        {tabs.map(([id, label]) => <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>{label}</button>)}
      </div>

      <motion.div className="lesson-content" key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === "overview" && (
          <div className="overview-layout">
            <section className="content-card intro-card">
              <span className="section-label">Bức tranh tổng quan</span>
              <h2>Hiểu cấu trúc trước khi viết code</h2>
              <p>{topic.overview}</p>
              <div className="analogy-callout"><span>Ví dụ đời thường</span><strong>{topic.analogy}</strong></div>
            </section>
            <section className="content-card anatomy-card">
              <span className="section-label">Các biến cần nhớ</span>
              <div className="anatomy-grid">{topic.anatomy.map((item) => <div key={item.term}><code>{item.term}</code><p>{item.description}</p></div>)}</div>
            </section>
            <section className="content-card operations-card">
              <div className="section-heading"><div><span className="section-label">Độ phức tạp</span><h2>Các thao tác cốt lõi</h2></div><span className="big-o-badge">Big O</span></div>
              <div className="operation-table">{topic.operations.map((operation) => <div key={operation.name}><strong>{operation.name}</strong><code>{operation.complexity}</code><span>{operation.description}</span></div>)}</div>
            </section>
          </div>
        )}

        {activeTab === "theory" && (
          <div className="theory-layout">
            <section className="content-card"><span className="section-label">Lý thuyết từng bước</span><h2>Nguyên lý hoạt động</h2><div className="numbered-theory">{topic.theory.map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div></section>
            <aside className="content-card compare-note"><ListChecks size={22} /><h3>Tự kiểm tra</h3><p>Bạn có thể giải thích cấu trúc này bằng ba biến quan trọng nhất mà không nhìn tài liệu?</p><button onClick={() => setActiveTab("quiz")}>Kiểm tra ngay</button></aside>
          </div>
        )}

        {activeTab === "simulation" && (
          topic.simulator ? <DataStructureSimulator mode={topic.simulator} /> : (
            <section className="content-card concept-simulator">
              <span className="section-label">Mô phỏng khái niệm</span><h2>{topic.name}</h2>
              <div className={`concept-nodes ${topic.slug === "circular-linked-list" ? "circular" : "double"}`}>
                {[12, 27, 35].map((value, index) => <div key={value}><span>{index === 0 ? "HEAD" : index === 2 ? "TAIL" : "NODE"}</span><strong>{value}</strong></div>)}
              </div>
              <p>{topic.slug === "circular-linked-list" ? "Mũi nối cuối quay về HEAD: tail.next = head. Dừng traversal khi current quay lại head." : "Mỗi cặp node giữ hai reference đối xứng: next đi tới và prev đi lùi."}</p>
              <div className="coming-badge">Mô phỏng tương tác đầy đủ ở giai đoạn tiếp theo · MVP đã có 4 phòng lab chính</div>
            </section>
          )
        )}

        {activeTab === "code" && <div className="code-layout"><CodeBlock code={topic.code} title={`${topic.slug.replaceAll("-", "_")}.py`} /><aside className="content-card code-side"><span className="section-label">Output dự kiến</span><pre>{topic.slug === "binary-search-tree" ? "[20, 30, 40, 50, 60, 70, 80]" : "Chạy file để xem ví dụ cuối bài."}</pre><p>Code dùng class, object và tên biến rõ ràng; có thể sao chép để chạy bằng Python 3.</p></aside></div>}

        {activeTab === "explanation" && <section className="content-card"><span className="section-label">Đọc code có chiến lược</span><h2>Ba điểm quan trọng nhất</h2><div className="code-notes">{topic.codeNotes.map((note, index) => <div key={note}><span>0{index + 1}</span><p>{note}</p></div>)}</div><button className="text-link" onClick={() => setActiveTab("code")}><Code2 size={16} />Mở code Python hoàn chỉnh</button></section>}

        {activeTab === "exercises" && <div className="exercise-list"><div className="section-intro"><div><span className="section-label">Luyện code Python</span><h2>3 bài tập tăng dần độ khó</h2></div><span>{topic.exercises.filter((item) => progress.completedExercises.includes(item.id)).length}/3 đã xong</span></div>{topic.exercises.map((item, index) => <ExerciseCard key={item.id} exercise={item} defaultOpen={index === 0} />)}</div>}

        {activeTab === "quiz" && <div><div className="section-intro"><div><span className="section-label">Kiểm tra nhanh</span><h2>5 câu trắc nghiệm Python</h2></div><span>Giải thích ngay sau khi nộp</span></div><QuizDeck questions={topic.quiz} topicSlug={topic.slug} /></div>}

        {activeTab === "mistakes" && <div className="mistakes-grid">{topic.mistakes.map((mistake, index) => <article className="mistake-card" key={mistake.title}><span>0{index + 1}</span><CircleAlert size={22} /><h3>{mistake.title}</h3><p>{mistake.fix}</p></article>)}</div>}

        {activeTab === "summary" && <section className="summary-sheet"><div className="summary-heading"><div><span className="section-label">Cheat sheet ôn thi</span><h2>{topic.shortName} trong 60 giây</h2></div><span>PY · CSD</span></div><ul>{topic.examSummary.map((item) => <li key={item}><CheckCircle2 size={18} /><span>{item}</span></li>)}</ul><div className="summary-next"><div><strong>Sẵn sàng sang bài tiếp?</strong><p>Đánh dấu hoàn thành để cập nhật dashboard.</p></div><button onClick={() => progress.toggleLesson(topic.slug)}>{completed ? "Đã hoàn thành" : "Hoàn thành bài"}</button></div></section>}
      </motion.div>

      <div className="lesson-footer-nav">
        {topics[(topics.findIndex((item) => item.slug === topic.slug) - 1 + topics.length) % topics.length] && (
          <Link to={`/learn/${topics[(topics.findIndex((item) => item.slug === topic.slug) - 1 + topics.length) % topics.length].slug}`}>← Bài trước</Link>
        )}
        <Link to="/topics">Xem tất cả chủ đề</Link>
        <Link to={`/learn/${topics[(topics.findIndex((item) => item.slug === topic.slug) + 1) % topics.length].slug}`}>Bài tiếp →</Link>
      </div>
    </div>
  );
}
