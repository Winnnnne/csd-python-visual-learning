"use client";

import {
  Pause,
  Play,
  Plus,
  RotateCcw,
  ScanSearch,
  Shuffle,
  SkipForward,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SimulatorMode = "linked" | "stack" | "queue" | "bst";

const initialValues: Record<SimulatorMode, number[]> = {
  linked: [12, 27, 35, 48],
  stack: [12, 27, 35],
  queue: [12, 27, 35, 48],
  bst: [50, 30, 70, 20, 40, 60, 80],
};

const pythonLines: Record<SimulatorMode, string[]> = {
  linked: [
    "current = self.head",
    "while current is not None:",
    "    if current.data == target:",
    "        return current",
    "    current = current.next",
    "return None",
  ],
  stack: [
    "def push(self, value):",
    "    self.items.append(value)",
    "",
    "def pop(self):",
    "    return self.items.pop()",
  ],
  queue: [
    "def dequeue(self):",
    "    value = self.front.data",
    "    self.front = self.front.next",
    "    if self.front is None:",
    "        self.rear = None",
    "    return value",
  ],
  bst: [
    "current = self.root",
    "while current is not None:",
    "    if target == current.data:",
    "        return current",
    "    if target < current.data:",
    "        current = current.left",
    "    else:",
    "        current = current.right",
  ],
};

type TreeNode = {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

function buildTree(values: number[]) {
  let root: TreeNode | null = null;
  for (const value of values) {
    if (!root) {
      root = { value, left: null, right: null };
      continue;
    }
    let current = root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = { value, left: null, right: null };
          break;
        }
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) {
          current.right = { value, left: null, right: null };
          break;
        }
        current = current.right;
      } else break;
    }
  }
  return root;
}

function treeLayout(root: TreeNode | null) {
  const nodes: { value: number; x: number; y: number; parentX?: number; parentY?: number }[] = [];
  const visit = (
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number,
    parent?: { x: number; y: number },
  ) => {
    if (!node) return;
    nodes.push({ value: node.value, x, y, parentX: parent?.x, parentY: parent?.y });
    visit(node.left, x - offset, y + 88, Math.max(offset / 2, 48), { x, y });
    visit(node.right, x + offset, y + 88, Math.max(offset / 2, 48), { x, y });
  };
  visit(root, 300, 38, 142);
  return nodes;
}

export function DataStructureSimulator({ mode }: { mode: SimulatorMode }) {
  const [values, setValues] = useState(initialValues[mode]);
  const [input, setInput] = useState("42");
  const [sequence, setSequence] = useState<number[]>([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [message, setMessage] = useState("Sẵn sàng. Chọn một thao tác để bắt đầu.");
  const [found, setFound] = useState<number | null>(null);

  const numberValue = Number(input);
  const currentValue = sequence[stepIndex];

  useEffect(() => {
    if (!running) return;
    if (stepIndex >= sequence.length - 1) {
      setRunning(false);
      return;
    }
    const id = window.setTimeout(() => setStepIndex((index) => index + 1), speed);
    return () => window.clearTimeout(id);
  }, [running, sequence.length, speed, stepIndex]);

  useEffect(() => {
    if (stepIndex < 0 || !sequence.length) return;
    const value = sequence[stepIndex];
    const target = Number(input);
    if (mode === "bst") {
      if (value === target) {
        setFound(value);
        setMessage(`Tìm thấy ${target}. current.data == target.`);
        setRunning(false);
      } else {
        setMessage(`${target} ${target < value ? "<" : ">"} ${value} → đi sang ${target < value ? "trái" : "phải"}.`);
      }
    } else if (value === target) {
      setFound(value);
      setMessage(`Tìm thấy ${target} tại bước ${stepIndex + 1}.`);
      setRunning(false);
    } else {
      setMessage(`Bước ${stepIndex + 1}: current.data = ${value}, chưa khớp ${target}.`);
    }
    if (stepIndex === sequence.length - 1 && value !== target) {
      setMessage(`Đã duyệt hết ${sequence.length} node. Không tìm thấy ${target}.`);
    }
  }, [input, mode, sequence, stepIndex]);

  const resetPlayback = () => {
    setSequence([]);
    setStepIndex(-1);
    setRunning(false);
    setFound(null);
  };

  const add = () => {
    if (!Number.isFinite(numberValue)) return;
    resetPlayback();
    setValues((current) => {
      if (mode === "bst" && current.includes(numberValue)) return current;
      return [...current, numberValue];
    });
    setMessage(
      mode === "stack"
        ? `push(${numberValue}): thêm ${numberValue} lên top.`
        : mode === "queue"
          ? `enqueue(${numberValue}): thêm ${numberValue} tại rear.`
          : mode === "bst"
            ? `insert(${numberValue}): so sánh từ root để tìm vị trí None phù hợp.`
            : `add_last(${numberValue}): tail.next trỏ đến node mới.`,
    );
  };

  const remove = () => {
    resetPlayback();
    if (!values.length) {
      setMessage("Cấu trúc đang rỗng, không có phần tử để xóa.");
      return;
    }
    if (mode === "stack") {
      const removed = values.at(-1);
      setValues((current) => current.slice(0, -1));
      setMessage(`pop() → ${removed}. Top chuyển xuống phần tử ngay trước.`);
    } else if (mode === "queue") {
      const removed = values[0];
      setValues((current) => current.slice(1));
      setMessage(`dequeue() → ${removed}. Front chuyển sang node kế tiếp.`);
    } else {
      const target = numberValue;
      setValues((current) => current.filter((value) => value !== target));
      setMessage(values.includes(target) ? `Đã xóa ${target} và nối lại các reference.` : `Không có ${target} để xóa.`);
    }
  };

  const getBstSearchPath = (target: number) => {
    const path: number[] = [];
    let node = buildTree(values);
    while (node) {
      path.push(node.value);
      if (node.value === target) break;
      node = target < node.value ? node.left : node.right;
    }
    return path;
  };

  const startSearch = (auto = true) => {
    if (!Number.isFinite(numberValue) || !values.length) return;
    resetPlayback();
    const nextSequence = mode === "bst" ? getBstSearchPath(numberValue) : [...values];
    setSequence(nextSequence);
    setStepIndex(0);
    setRunning(auto);
    setMessage("Bước 1: gán current vào vị trí bắt đầu.");
  };

  const nextStep = () => {
    if (!sequence.length) {
      startSearch(false);
      return;
    }
    setRunning(false);
    setStepIndex((index) => Math.min(index + 1, sequence.length - 1));
  };

  const randomize = () => {
    resetPlayback();
    const pool = Array.from({ length: mode === "bst" ? 7 : 5 }, () => Math.floor(Math.random() * 80) + 10);
    setValues(mode === "bst" ? Array.from(new Set(pool)) : pool);
    setMessage("Đã tạo bộ dữ liệu mới. Hãy thử tìm kiếm hoặc duyệt từng bước.");
  };

  const treeNodes = useMemo(() => treeLayout(buildTree(values)), [values]);
  const activeLine = mode === "bst" ? (currentValue === numberValue ? 2 : numberValue < currentValue ? 4 : 6) : stepIndex < 0 ? 0 : currentValue === numberValue ? 2 : 4;

  return (
    <section className="simulator-shell" aria-label="Mô phỏng cấu trúc dữ liệu">
      <div className="sim-toolbar">
        <label>
          <span>Giá trị</span>
          <input
            type="number"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && add()}
          />
        </label>
        <button className="primary-action" onClick={add}><Plus size={16} />{mode === "stack" ? "Push" : mode === "queue" ? "Enqueue" : "Thêm"}</button>
        <button onClick={remove}><Trash2 size={16} />{mode === "stack" ? "Pop" : mode === "queue" ? "Dequeue" : "Xóa"}</button>
        <button onClick={() => startSearch(true)}><ScanSearch size={16} />Tìm kiếm</button>
        <button onClick={randomize}><Shuffle size={16} />Ngẫu nhiên</button>
        <button onClick={() => {
          setValues(initialValues[mode]);
          resetPlayback();
          setMessage("Đã đưa mô phỏng về dữ liệu ban đầu.");
        }}><RotateCcw size={16} />Reset</button>
      </div>

      <div className="sim-grid">
        <div className="visual-stage">
          <div className="stage-topline">
            <span className="live-dot" />
            <strong>Mô phỏng 2D</strong>
            <span>{values.length} node</span>
          </div>

          {mode === "linked" && (
            <div className="linked-visual">
              {values.length ? values.map((value, index) => (
                <div className="linked-item" key={`${value}-${index}`}>
                  <span className={`node-label ${index === 0 ? "label-head" : index === values.length - 1 ? "label-tail" : ""}`}>
                    {index === 0 ? "HEAD" : index === values.length - 1 ? "TAIL" : ""}
                  </span>
                  <div className={`data-node ${currentValue === value ? "current" : ""} ${found === value ? "found" : ""}`}>
                    <strong>{value}</strong><span>next</span>
                  </div>
                  <span className="node-arrow">→</span>
                </div>
              )) : <div className="empty-visual">head → None</div>}
              {!!values.length && <span className="none-node">None</span>}
            </div>
          )}

          {mode === "stack" && (
            <div className="stack-visual">
              {values.length ? [...values].reverse().map((value, visualIndex) => (
                <div key={`${value}-${visualIndex}`} className={`stack-node ${currentValue === value ? "current" : ""} ${visualIndex === 0 ? "top-node" : ""}`}>
                  {visualIndex === 0 && <span>TOP</span>}<strong>{value}</strong>
                </div>
              )) : <div className="empty-visual">Stack rỗng</div>}
            </div>
          )}

          {mode === "queue" && (
            <div className="queue-visual">
              <span className="queue-direction">dequeue ←</span>
              {values.length ? values.map((value, index) => (
                <div key={`${value}-${index}`} className={`queue-node ${currentValue === value ? "current" : ""}`}>
                  {index === 0 && <span>FRONT</span>}
                  <strong>{value}</strong>
                  {index === values.length - 1 && <span>REAR</span>}
                </div>
              )) : <div className="empty-visual">front = rear = None</div>}
              <span className="queue-direction">← enqueue</span>
            </div>
          )}

          {mode === "bst" && (
            <div className="tree-visual">
              {treeNodes.filter((node) => node.parentX !== undefined).map((node) => {
                const startX = node.parentX ?? 0;
                const startY = (node.parentY ?? 0) + 24;
                const endY = node.y + 24;
                const distance = Math.hypot(node.x - startX, endY - startY);
                const angle = Math.atan2(endY - startY, node.x - startX) * (180 / Math.PI);
                return (
                  <i
                    className="tree-line"
                    key={`line-${node.value}`}
                    style={{ left: startX, top: startY, width: distance, transform: `rotate(${angle}deg)` }}
                  />
                );
              })}
              {treeNodes.map((node, index) => (
                <div
                  className={`tree-node ${currentValue === node.value ? "current" : ""} ${found === node.value ? "found" : ""}`}
                  style={{ left: node.x, top: node.y }}
                  key={node.value}
                >
                  {index === 0 && <span>ROOT</span>}
                  <strong>{node.value}</strong>
                </div>
              ))}
              {!values.length && <div className="empty-visual">root = None</div>}
            </div>
          )}
        </div>

        <div className="sim-sidepanel">
          <div className="variable-card">
            <span>Biến đang theo dõi</span>
            <div><code>current</code><strong>{currentValue ?? "None"}</strong></div>
            <div><code>target</code><strong>{Number.isFinite(numberValue) ? numberValue : "—"}</strong></div>
            <div><code>size</code><strong>{values.length}</strong></div>
          </div>
          <div className="mini-code">
            <div className="mini-code-head"><span>search.py</span><span>Python</span></div>
            <pre>{pythonLines[mode].map((line, index) => (
              <span className={index === activeLine && stepIndex >= 0 ? "active-line" : ""} key={`${line}-${index}`}>
                <i>{String(index + 1).padStart(2, "0")}</i>{line || " "}
              </span>
            ))}</pre>
          </div>
        </div>
      </div>

      <div className="sim-console">
        <div className="step-controls">
          <button onClick={() => setRunning((value) => !value)} disabled={!sequence.length} aria-label={running ? "Tạm dừng" : "Chạy tự động"}>
            {running ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button onClick={nextStep} aria-label="Chạy một bước"><SkipForward size={17} /></button>
          <label>Tốc độ
            <input type="range" min="250" max="1200" step="50" value={1450 - speed} onChange={(event) => setSpeed(1450 - Number(event.target.value))} />
          </label>
          <span>Bước {Math.max(stepIndex + 1, 0)}/{sequence.length || 0}</span>
        </div>
        <p><span>{stepIndex >= 0 ? stepIndex + 1 : "•"}</span>{message}</p>
      </div>
    </section>
  );
}
