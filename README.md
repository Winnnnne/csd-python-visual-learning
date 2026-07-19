# CSD Python Visual Learning

Website học tập và ôn thi môn **Cấu trúc dữ liệu và giải thuật** bằng Python, dành cho sinh viên mới học CSD. MVP tập trung vào cách học “nhìn thấy trước, code sau”: mỗi chủ đề có lý thuyết tiếng Việt, mô phỏng, code Python hoàn chỉnh, bài tập và trắc nghiệm.

## Tính năng MVP

- Trang chủ, dashboard, thư viện 6 cấu trúc dữ liệu và khu vực ôn thi.
- 6 chủ đề: Singly Linked List, Doubly Linked List, Circular Singly Linked List, Stack, Queue và Binary Search Tree.
- 9 tab nội dung cho từng bài học.
- 4 mô phỏng tương tác: DSLK đơn, Stack, Queue và BST.
- 18 bài tập Python (3 mức độ/chủ đề) với code khung, gợi ý, lời giải ẩn và playground mô phỏng.
- 30 câu trắc nghiệm (5 câu/chủ đề), chấm điểm và giải thích đáp án.
- Dark/light mode, tìm kiếm, flashcard, bảng Big O và Pomodoro.
- Lưu tiến độ, điểm, câu sai và bookmark bằng `localStorage`; không cần đăng nhập.
- Responsive, hỗ trợ bàn phím và `prefers-reduced-motion`.

## Công nghệ

- React 19 + TypeScript
- Vite qua vinext/Sites runtime
- React Router (`HashRouter` để website đa trang hoạt động ổn định cả khi deploy tĩnh)
- Tailwind CSS 4 (pipeline CSS) + CSS tùy biến
- Framer Motion
- Lucide React
- Cloudflare Worker-compatible output cho OpenAI Sites

Phiên bản MVP chưa tải Pyodide/Monaco để giữ gói nhẹ. Playground hiện mô phỏng việc đối chiếu test case; giao diện và dữ liệu đã sẵn sàng để tích hợp Pyodide ở giai đoạn sau.

## Cấu trúc thư mục

```text
.
├── app/
│   ├── components/
│   │   ├── AppLayout.tsx              # sidebar, header, search, theme, Pomodoro
│   │   ├── CsdApp.tsx                 # router và các route chính
│   │   ├── DataStructureSimulator.tsx # 4 mô phỏng tương tác
│   │   ├── LearningComponents.tsx     # bài học, code, bài tập, quiz
│   │   └── Pages.tsx                  # home, dashboard, practice, review...
│   ├── data/
│   │   └── learning-data.ts           # toàn bộ nội dung CSD/Python mẫu
│   ├── hooks/
│   │   └── use-learning-progress.tsx  # localStorage và tiến độ
│   ├── globals.css                    # design system và responsive
│   ├── layout.tsx                     # metadata và root layout
│   └── page.tsx                       # entry page
├── public/                            # tài nguyên tĩnh
├── .openai/hosting.json               # cấu hình Sites
├── package.json
├── vite.config.ts
└── README.md
```

## Cài đặt và chạy

Yêu cầu Node.js 22.13 trở lên.

```bash
npm install
npm run dev
```

Mở địa chỉ được in trong terminal (mặc định `http://localhost:3000`).

Nếu dùng pnpm:

```bash
pnpm install
pnpm dev
```

Build bản production:

```bash
npm run build
npm run start
```

## Chạy bằng VS Code

1. Mở thư mục dự án bằng **File → Open Folder**.
2. Cài Node.js 22.13+ nếu máy chưa có.
3. Mở **Terminal → New Terminal**.
4. Chạy `npm install`, sau đó `npm run dev`.
5. Giữ terminal hoạt động và mở URL local được hiển thị.

## Cách sử dụng

1. Bắt đầu ở **Trang chủ** hoặc mở **Dashboard** để xem bài tiếp theo.
2. Chọn một cấu trúc trong **Cấu trúc dữ liệu**.
3. Đi lần lượt qua Tổng quan → Lý thuyết → Mô phỏng → Code Python.
4. Trong mô phỏng, nhập số rồi chọn thêm, xóa, tìm, chạy tự động hoặc từng bước.
5. Làm 3 bài tập; chỉ nhấn **Xem lời giải** sau khi đã thử code.
6. Hoàn thành 5 câu trắc nghiệm để dashboard phát hiện chủ đề yếu.
7. Dùng **Ôn thi CSD** để xem bảng Big O, flashcard và danh sách câu sai.

Dữ liệu chỉ nằm trong trình duyệt hiện tại. Xóa dữ liệu website của trình duyệt sẽ xóa tiến độ.

## Các component quan trọng

- `CsdApp`: khai báo route và bọc toàn bộ ứng dụng bằng progress provider.
- `AppLayout`: điều hướng responsive, tìm kiếm, dark/light mode và Pomodoro.
- `LearningProgressProvider`: chuẩn hóa việc đọc/ghi tiến độ vào `localStorage`.
- `LessonPage`: dùng một schema dữ liệu chung để tạo đủ 9 tab cho cả 6 chủ đề.
- `DataStructureSimulator`: một engine giao diện cho 4 chế độ; quản lý dữ liệu, đường duyệt, bước hiện tại, dòng Python và tốc độ.
- `ExerciseCard`/`QuizDeck`: playground, lời giải ẩn, chấm điểm, giải thích và lưu câu sai.

## Danh sách thư viện chính

| Thư viện | Vai trò |
|---|---|
| `react`, `react-dom` | UI và trạng thái |
| `react-router-dom` | Điều hướng trong ứng dụng |
| `framer-motion` | Chuyển cảnh nhẹ |
| `lucide-react` | Icon giao diện có accessibility |
| `tailwindcss` | CSS build pipeline |
| `vinext`, `vite` | Dev server và production build |

## Deploy lên Vercel

1. Đưa source code lên GitHub/GitLab/Bitbucket.
2. Tạo project mới trong Vercel và import repository.
3. Chọn Framework Preset là **Other** nếu Vercel không tự nhận cấu hình.
4. Build command: `npm run build`.
5. Với cấu trúc vinext/Sites hiện tại, phương án deploy được kiểm thử chính là OpenAI Sites/Cloudflare Worker. Nếu bắt buộc dùng Vercel, nên chuyển lớp runtime sang Vite SPA thuần hoặc Next.js chuẩn trước khi phát hành chính thức.

Không có biến môi trường bắt buộc cho MVP.

## Giai đoạn tiếp theo

- Pyodide chạy Python thật và Monaco/CodeMirror.
- Mô phỏng tương tác đầy đủ cho DLL/CLL.
- Chế độ 3D lazy-loaded bằng React Three Fiber.
- Thi thử có timer, trộn đủ ngân hàng câu hỏi và phân tích điểm yếu sâu hơn.
- Ghi chú cá nhân, achievement, daily challenge động và trang so sánh chuyên sâu.
