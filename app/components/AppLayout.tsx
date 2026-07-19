"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Clock3,
  Code2,
  Command,
  FileQuestion,
  GraduationCap,
  Home,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { glossary, topics } from "../data/learning-data";
import { useLearningProgress } from "../hooks/use-learning-progress";

const navItems = [
  { to: "/", label: "Trang chủ", icon: Home, end: true },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/topics", label: "Cấu trúc dữ liệu", icon: BrainCircuit },
  { to: "/practice", label: "Bài tập Python", icon: Code2 },
  { to: "/quiz", label: "Trắc nghiệm", icon: FileQuestion },
  { to: "/review", label: "Ôn thi CSD", icon: GraduationCap },
  { to: "/glossary", label: "Từ điển", icon: BookOpen },
];

const crumbNames: Record<string, string> = {
  dashboard: "Dashboard",
  topics: "Cấu trúc dữ liệu",
  learn: "Bài học",
  practice: "Bài tập Python",
  quiz: "Trắc nghiệm",
  review: "Ôn thi CSD",
  glossary: "Từ điển thuật ngữ",
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [timer, setTimer] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const progress = useLearningProgress();

  useEffect(() => {
    const saved = window.localStorage.getItem("csd-theme") as "light" | "dark" | null;
    const nextTheme = saved ?? "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    if (!timerRunning || timer <= 0) return;
    const id = window.setInterval(() => setTimer((value) => value - 1), 1000);
    return () => window.clearInterval(id);
  }, [timer, timerRunning]);

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("csd-theme", next);
  };

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    if (!normalized) return [];
    const topicResults = topics
      .filter((topic) =>
        `${topic.name} ${topic.shortName} ${topic.description}`
          .toLocaleLowerCase("vi")
          .includes(normalized),
      )
      .slice(0, 4)
      .map((topic) => ({ label: topic.name, meta: topic.description, to: `/learn/${topic.slug}` }));
    const glossaryResults = glossary
      .filter(([term, definition]) =>
        `${term} ${definition}`.toLocaleLowerCase("vi").includes(normalized),
      )
      .slice(0, 2)
      .map(([term, definition]) => ({ label: term, meta: definition, to: "/glossary" }));
    return [...topicResults, ...glossaryResults];
  }, [query]);

  const pathParts = location.pathname.split("/").filter(Boolean);
  const percent = Math.round((progress.completedLessons.length / topics.length) * 100);
  const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
  const seconds = (timer % 60).toString().padStart(2, "0");

  return (
    <div className={`app-shell ${focusMode ? "focus-mode" : ""}`}>
      <button
        className="mobile-menu"
        onClick={() => setSidebarOpen(true)}
        aria-label="Mở menu"
      >
        <Menu size={20} />
      </button>

      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="brand-row">
          <Link to="/" className="brand-mark" aria-label="CSD Python Visual Learning">
            <span className="brand-glyph">Py</span>
            <span>
              <strong>CSD Visual</strong>
              <small>Python Learning Lab</small>
            </span>
          </Link>
          <button className="icon-button close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu">
            <X size={18} />
          </button>
        </div>

        <div className="progress-card-mini">
          <div>
            <span>Tiến độ học</span>
            <strong>{percent}%</strong>
          </div>
          <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
          <small>{progress.completedLessons.length}/{topics.length} chủ đề hoàn thành</small>
        </div>

        <nav className="side-nav" aria-label="Điều hướng chính">
          <p className="nav-label">Không gian học tập</p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              <ChevronRight className="nav-arrow" size={15} />
            </NavLink>
          ))}
        </nav>

        <div className="pomodoro-card">
          <div className="pomodoro-heading"><Clock3 size={16} /><span>Pomodoro tập trung</span></div>
          <strong>{minutes}:{seconds}</strong>
          <div className="pomodoro-actions">
            <button onClick={() => setTimerRunning((running) => !running)}>
              {timerRunning ? "Tạm dừng" : "Bắt đầu"}
            </button>
            <button
              aria-label="Đặt lại Pomodoro"
              onClick={() => {
                setTimerRunning(false);
                setTimer(25 * 60);
              }}
            >
              ↻
            </button>
          </div>
        </div>

        <div className="achievement-chip">
          <Award size={18} />
          <span><strong>Tân binh Python</strong><small>Hoàn thành bài đầu tiên</small></span>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu" />}

      <div className="page-column">
        <header className="topbar">
          <div className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">CSD</Link>
            {pathParts.map((part, index) => {
              const label = crumbNames[part] ?? topics.find((topic) => topic.slug === part)?.shortName ?? part;
              return <span key={`${part}-${index}`}><ChevronRight size={13} />{label}</span>;
            })}
          </div>

          <div className="topbar-actions">
            <div className="global-search">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm bài học, thuật ngữ..."
                aria-label="Tìm kiếm nội dung"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && searchResults[0]) {
                    navigate(searchResults[0].to);
                    setQuery("");
                  }
                }}
              />
              <kbd><Command size={11} /> K</kbd>
              {query && (
                <div className="search-popover">
                  {searchResults.length ? searchResults.map((result) => (
                    <button
                      key={`${result.to}-${result.label}`}
                      onClick={() => {
                        navigate(result.to);
                        setQuery("");
                      }}
                    >
                      <strong>{result.label}</strong>
                      <span>{result.meta}</span>
                    </button>
                  )) : <p>Không tìm thấy nội dung phù hợp.</p>}
                </div>
              )}
            </div>
            <button
              className={`focus-button ${focusMode ? "active" : ""}`}
              onClick={() => setFocusMode((value) => !value)}
              title="Ẩn sidebar để tập trung"
            >
              <BrainCircuit size={17} />
              <span>Tập trung</span>
            </button>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Đổi giao diện sáng tối">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  );
}
