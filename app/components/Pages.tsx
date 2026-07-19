"use client";

import {
  ArrowRight,
  BookCheck,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Code2,
  Flame,
  Layers3,
  Play,
  Search,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { complexityRows, glossary, learningPath, topics } from "../data/learning-data";
import { useLearningProgress } from "../hooks/use-learning-progress";
import { ExerciseCard, QuizDeck } from "./LearningComponents";

const iconBySlug = {
  "singly-linked-list": "SLL",
  "doubly-linked-list": "DLL",
  "circular-linked-list": "CLL",
  stack: "LIFO",
  queue: "FIFO",
  "binary-search-tree": "BST",
};

export function HomePage() {
  const progress = useLearningProgress();
  const nextTopic = topics.find((topic) => !progress.completedLessons.includes(topic.slug)) ?? topics[0];
  const percent = Math.round((progress.completedLessons.length / topics.length) * 100);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} />Học trực quan · Code Python thật</span>
          <h1>Nhìn thấy cấu trúc.<br /><em>Hiểu được thuật toán.</em></h1>
          <p>Phòng lab CSD giúp bạn đi từ reference đầu tiên đến BST — với mô phỏng từng bước, code Python dễ đọc và bài luyện sát kỳ thi.</p>
          <div className="hero-actions">
            <Link className="hero-primary" to={`/learn/${nextTopic.slug}`}><Play size={17} fill="currentColor" />{percent ? "Học tiếp" : "Bắt đầu lộ trình"}<ArrowRight size={17} /></Link>
            <Link className="hero-secondary" to="/topics"><BrainCircuit size={17} />Khám phá 6 chủ đề</Link>
          </div>
          <div className="hero-proof">
            <div><strong>6</strong><span>cấu trúc cốt lõi</span></div>
            <div><strong>18</strong><span>bài code Python</span></div>
            <div><strong>30</strong><span>câu trắc nghiệm</span></div>
          </div>
        </div>

        <div className="hero-lab" aria-label="Minh họa phòng lab danh sách liên kết">
          <div className="lab-window-bar"><span /><span /><span /><strong>linked_list_lab.py</strong><i>LIVE</i></div>
          <div className="lab-status"><span>Search target</span><strong>35</strong><small>Step 3 of 4</small></div>
          <div className="lab-nodes">
            {[12, 27, 35, 48].map((value, index) => (
              <div className="hero-node-wrap" key={value}>
                <span>{index === 0 ? "head" : index === 2 ? "current" : index === 3 ? "tail" : ""}</span>
                <div className={value === 35 ? "active" : ""}><strong>{value}</strong><i>next</i></div>
                {index < 3 && <b>→</b>}
              </div>
            ))}
          </div>
          <div className="lab-code-line"><span>05</span><code>if current.data == target:</code><i /></div>
          <div className="lab-message"><CheckCircle2 size={18} /><span><strong>Tìm thấy node 35</strong>current đang trỏ đúng giá trị cần tìm.</span></div>
          <div className="lab-variables"><code>current = Node(35)</code><code>target = 35</code></div>
        </div>
      </section>

      <section className="continue-strip">
        <div className="continue-progress" style={{ "--progress": `${percent}%` } as React.CSSProperties}><strong>{percent}%</strong><span>hoàn thành</span></div>
        <div><span className="section-label">Tiếp tục hành trình</span><h2>{nextTopic.name}</h2><p>{nextTopic.description}</p></div>
        <div className="continue-meta"><span><Clock3 size={15} />35 phút</span><span><Code2 size={15} />3 bài tập</span></div>
        <Link to={`/learn/${nextTopic.slug}`}>Vào bài học <ChevronRight size={17} /></Link>
      </section>

      <section className="home-section">
        <div className="home-section-head"><div><span className="section-label">Lộ trình CSD</span><h2>Chọn cấu trúc để khám phá</h2><p>Mỗi chủ đề đi từ hình dung trực quan đến code Python hoàn chỉnh.</p></div><Link to="/topics">Xem toàn bộ <ArrowRight size={16} /></Link></div>
        <div className="topic-card-grid">
          {topics.map((topic, index) => {
            const complete = progress.completedLessons.includes(topic.slug);
            return (
              <motion.article className={`topic-card accent-${topic.accent}`} key={topic.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <div className="topic-card-top"><span>{iconBySlug[topic.slug]}</span>{complete && <CheckCircle2 size={19} />}</div>
                <small>{topic.eyebrow}</small><h3>{topic.name}</h3><p>{topic.description}</p>
                <div className="topic-tags"><span>Python</span><span>3 bài tập</span><span>5 câu hỏi</span></div>
                <Link to={`/learn/${topic.slug}`}>{complete ? "Ôn lại bài" : "Bắt đầu học"}<ArrowRight size={16} /></Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="daily-challenge">
        <div className="challenge-icon"><Flame size={26} /></div>
        <div><span>DAILY CHALLENGE · +25 XP</span><h2>Tìm lỗi trong hàm pop()</h2><p>Hàm đang chạy đúng với stack nhiều phần tử nhưng lỗi khi stack rỗng. Bạn sửa được trong 5 phút?</p></div>
        <div className="challenge-code"><code>return self.items.pop()</code><span>Điều gì còn thiếu?</span></div>
        <Link to="/practice">Thử thách ngay <Zap size={16} /></Link>
      </section>
    </div>
  );
}

export function DashboardPage() {
  const progress = useLearningProgress();
  const percent = Math.round((progress.completedLessons.length / topics.length) * 100);
  const bestScore = Math.max(0, ...Object.values(progress.quizScores));
  const weakTopics = topics.filter((topic) => (progress.quizScores[topic.slug] ?? 100) < 70);
  const nextTopic = topics.find((topic) => !progress.completedLessons.includes(topic.slug)) ?? topics[0];

  return (
    <div className="dashboard-page">
      <div className="page-heading"><div><span className="eyebrow"><BarChartIcon />Không gian cá nhân</span><h1>Chào bạn, sẵn sàng luyện CSD?</h1><p>Tiến độ được lưu tự động trên thiết bị này.</p></div><Link className="primary-action" to={`/learn/${nextTopic.slug}`}>Học tiếp <ArrowRight size={17} /></Link></div>
      <div className="stats-grid">
        <StatCard icon={<BookCheck />} label="Bài đã học" value={`${progress.completedLessons.length}/6`} note="chủ đề hoàn thành" />
        <StatCard icon={<Code2 />} label="Bài tập" value={`${progress.completedExercises.length}/18`} note="đã đánh dấu xong" />
        <StatCard icon={<Trophy />} label="Điểm cao nhất" value={`${bestScore}%`} note="trắc nghiệm theo bài" />
        <StatCard icon={<Target />} label="Câu cần ôn" value={`${progress.wrongQuestions.length}`} note="câu trả lời sai" />
      </div>
      <div className="dashboard-grid">
        <section className="content-card progress-overview">
          <div className="section-heading"><div><span className="section-label">Tổng quan</span><h2>Tiến độ lộ trình</h2></div><span>Tuần này · 3 ngày học</span></div>
          <div className="progress-overview-body">
            <div className="big-progress-ring" style={{ "--progress-deg": `${percent * 3.6}deg` } as React.CSSProperties}><div><strong>{percent}%</strong><span>hoàn thành</span></div></div>
            <div className="path-mini-list">{topics.map((topic, index) => <Link key={topic.slug} to={`/learn/${topic.slug}`} className={progress.completedLessons.includes(topic.slug) ? "done" : topic.slug === nextTopic.slug ? "current" : ""}><span>{progress.completedLessons.includes(topic.slug) ? <CheckCircle2 size={17} /> : index + 1}</span><div><strong>{topic.shortName}</strong><small>{progress.completedLessons.includes(topic.slug) ? "Đã hoàn thành" : topic.slug === nextTopic.slug ? "Bài tiếp theo" : "Chưa học"}</small></div><ChevronRight size={16} /></Link>)}</div>
          </div>
        </section>
        <section className="content-card weak-topics">
          <span className="section-label">Gợi ý ôn tập</span><h2>Chủ đề cần chú ý</h2>
          {weakTopics.length ? weakTopics.map((topic) => <Link to={`/learn/${topic.slug}`} key={topic.slug}><CircleAlert size={18} /><div><strong>{topic.shortName}</strong><span>Điểm gần nhất {progress.quizScores[topic.slug]}%</span></div><ArrowRight size={16} /></Link>) : <div className="empty-state"><CheckCircle2 size={28} /><strong>Chưa có chủ đề yếu</strong><p>Làm trắc nghiệm để hệ thống gợi ý chính xác hơn.</p></div>}
        </section>
        <section className="content-card next-lesson-card">
          <div><span className="section-label">Bài học tiếp theo</span><h2>{nextTopic.name}</h2><p>{nextTopic.analogy}</p><div><span>35 phút</span><span>3 bài tập</span><span>5 câu hỏi</span></div><Link to={`/learn/${nextTopic.slug}`}>Tiếp tục <ArrowRight size={16} /></Link></div>
          <div className="next-lesson-visual"><span>{iconBySlug[nextTopic.slug]}</span><i /><i /><i /></div>
        </section>
      </div>
    </div>
  );
}

function BarChartIcon() {
  return <Layers3 size={14} />;
}

function StatCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <article className="stat-card"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong><p>{note}</p></div></article>;
}

export function TopicsPage() {
  const progress = useLearningProgress();
  return (
    <div className="topics-page">
      <div className="page-heading"><div><span className="eyebrow"><BrainCircuit size={14} />Thư viện bài học</span><h1>6 cấu trúc dữ liệu cốt lõi</h1><p>Học theo thứ tự gợi ý hoặc chọn đúng phần bạn cần ôn.</p></div></div>
      <div className="topic-list-grid">{topics.map((topic, index) => <article className={`topic-list-card accent-${topic.accent}`} key={topic.slug}><div className="topic-index">0{index + 1}</div><div className="topic-symbol">{iconBySlug[topic.slug]}</div><div><span>{topic.eyebrow}</span><h2>{topic.name}</h2><p>{topic.description}</p><div className="mini-complexities">{topic.operations.slice(0, 3).map((operation) => <span key={operation.name}>{operation.name} <code>{operation.complexity}</code></span>)}</div></div><div className="topic-card-footer"><span>{progress.completedLessons.includes(topic.slug) ? <><CheckCircle2 size={16} />Đã hoàn thành</> : "35 phút · 9 phần"}</span><Link to={`/learn/${topic.slug}`}>Mở bài học <ArrowRight size={16} /></Link></div></article>)}</div>
    </div>
  );
}

export function PracticePage() {
  const [level, setLevel] = useState("Tất cả");
  const exercises = topics.flatMap((topic) => topic.exercises.map((item) => ({ ...item, topic: topic.shortName })));
  const filtered = level === "Tất cả" ? exercises : exercises.filter((item) => item.level === level);
  return (
    <div className="practice-page">
      <div className="page-heading"><div><span className="eyebrow"><Code2 size={14} />Python practice lab</span><h1>18 bài tập từ cơ bản đến nâng cao</h1><p>Viết code, chạy mô phỏng test case và chỉ mở lời giải khi thật sự cần.</p></div></div>
      <div className="filter-row">{["Tất cả", "Cơ bản", "Trung bình", "Nâng cao"].map((item) => <button className={level === item ? "active" : ""} onClick={() => setLevel(item)} key={item}>{item}<span>{item === "Tất cả" ? exercises.length : exercises.filter((exercise) => exercise.level === item).length}</span></button>)}</div>
      <div className="exercise-list practice-list">{filtered.map((item) => <div key={item.id}><span className="exercise-topic-label">{item.topic}</span><ExerciseCard exercise={item} /></div>)}</div>
    </div>
  );
}

export function QuizPage() {
  const [mixedStarted, setMixedStarted] = useState(false);
  const mixed = topics.map((topic) => topic.quiz[0]);
  return (
    <div className="quiz-page">
      <div className="page-heading"><div><span className="eyebrow"><Target size={14} />Practice mode</span><h1>Trắc nghiệm CSD bằng Python</h1><p>30 câu theo chủ đề, phản hồi tức thì và lưu lại những câu cần ôn.</p></div></div>
      {!mixedStarted ? <><section className="quiz-banner"><div><span>Đề luyện tập tổng hợp</span><h2>6 câu · 6 cấu trúc · không giới hạn thời gian</h2><p>Khởi động nhanh trước khi vào từng bộ câu hỏi chuyên sâu.</p><button onClick={() => setMixedStarted(true)}><Play size={16} />Bắt đầu luyện</button></div><div className="quiz-orbit"><strong>30</strong><span>câu hỏi</span><i>A</i><i>B</i><i>C</i><i>D</i></div></section><div className="quiz-topic-grid">{topics.map((topic) => <Link to={`/learn/${topic.slug}`} key={topic.slug}><span>{iconBySlug[topic.slug]}</span><div><strong>{topic.shortName}</strong><small>5 câu · lý thuyết & đọc code</small></div><ChevronRight size={17} /></Link>)}</div></> : <QuizDeck questions={mixed} topicSlug="mixed" />}
    </div>
  );
}

export function ReviewPage() {
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const progress = useLearningProgress();
  const flashcards = topics.map((topic) => ({ front: topic.name, back: topic.examSummary.join(" • ") }));
  const weakTopics = topics.filter((topic) => (progress.quizScores[topic.slug] ?? 100) < 70);
  return (
    <div className="review-page">
      <div className="page-heading"><div><span className="eyebrow"><Trophy size={14} />Exam command center</span><h1>Ôn thi CSD</h1><p>Tóm tắt Big O, flashcard và danh sách những phần bạn còn yếu.</p></div><Link className="primary-action" to="/quiz">Thi thử nhanh <ArrowRight size={17} /></Link></div>
      <div className="review-grid">
        <section className="content-card complexity-section"><div className="section-heading"><div><span className="section-label">Bảng tổng hợp</span><h2>Time complexity cần nhớ</h2></div><span>* tùy cách cài đặt/vị trí</span></div><div className="complexity-table"><div className="complexity-row header"><span>Cấu trúc</span><span>Insert</span><span>Delete</span><span>Search</span><span>Traversal</span></div>{complexityRows.map((row) => <div className="complexity-row" key={row[0]}>{row.map((cell, index) => index ? <code key={cell + index}>{cell}</code> : <strong key={cell}>{cell}</strong>)}</div>)}</div><p className="table-note"><strong>Vì sao BST thay đổi?</strong> Chi phí là O(h). Cây cân đối có h ≈ log n; cây lệch có h ≈ n. Linked list phải traversal để search nên là O(n).</p></section>
        <section className="content-card flashcard-section"><div className="section-heading"><div><span className="section-label">Flashcard</span><h2>Nhớ nhanh trong 60 giây</h2></div><span>{flashIndex + 1}/{flashcards.length}</span></div><button className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((value) => !value)}><span>{flipped ? "TÓM TẮT" : "CẤU TRÚC"}</span><strong>{flipped ? flashcards[flashIndex].back : flashcards[flashIndex].front}</strong><small>Nhấn để {flipped ? "xem câu hỏi" : "lật thẻ"}</small></button><div className="flash-controls"><button onClick={() => { setFlashIndex((index) => (index - 1 + flashcards.length) % flashcards.length); setFlipped(false); }}>← Trước</button><button onClick={() => { setFlashIndex((index) => (index + 1) % flashcards.length); setFlipped(false); }}>Tiếp →</button></div></section>
        <section className="content-card review-alerts"><span className="section-label">Cá nhân hóa</span><h2>Danh sách cần ôn lại</h2><div className="review-metrics"><div><strong>{progress.wrongQuestions.length}</strong><span>câu đã làm sai</span></div><div><strong>{weakTopics.length}</strong><span>chủ đề dưới 70%</span></div><div><strong>{progress.bookmarks.length}</strong><span>bài đã đánh dấu</span></div></div>{!progress.wrongQuestions.length ? <div className="empty-state"><Target size={27} /><strong>Hãy làm một bộ trắc nghiệm</strong><p>Các câu sai sẽ tự xuất hiện ở đây.</p></div> : <Link to="/quiz">Luyện lại câu sai <ArrowRight size={16} /></Link>}</section>
      </div>
      <section className="exam-tips"><div><span>01</span><strong>Vẽ reference trước</strong><p>Đánh dấu head, tail, current và previous trên giấy.</p></div><div><span>02</span><strong>Kiểm tra trường hợp biên</strong><p>Rỗng, một node, node đầu, node cuối luôn cần thử.</p></div><div><span>03</span><strong>Nói rõ average/worst</strong><p>Đặc biệt với BST, đừng chỉ ghi O(log n).</p></div></section>
    </div>
  );
}

export function GlossaryPage() {
  const [query, setQuery] = useState("");
  const entries = useMemo(() => glossary.filter(([term, definition]) => `${term} ${definition}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="glossary-page">
      <div className="page-heading"><div><span className="eyebrow"><Layers3 size={14} />CSD dictionary</span><h1>Từ điển thuật ngữ</h1><p>Giải nghĩa ngắn gọn bằng ngôn ngữ dễ nhớ cho người mới.</p></div></div>
      <label className="glossary-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm reference, recursion, traversal..." /></label>
      <div className="glossary-grid">{entries.map(([term, definition], index) => <article key={term}><span>{String.fromCharCode(65 + index)}</span><h2>{term}</h2><p>{definition}</p><button onClick={() => navigator.clipboard.writeText(`${term}: ${definition}`)}>Sao chép định nghĩa</button></article>)}</div>
    </div>
  );
}

export function RoadmapStrip() {
  return <div className="roadmap-strip">{learningPath.map((item, index) => <div key={item}><span>{index + 1}</span><strong>{item}</strong></div>)}</div>;
}

export function NotFoundPage() {
  return <div className="not-found"><strong>404</strong><h1>Node này không tồn tại</h1><p>Reference hiện tại đang trỏ đến None.</p><Link to="/">Quay về head →</Link></div>;
}
