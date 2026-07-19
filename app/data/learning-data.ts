export type TopicSlug =
  | "singly-linked-list"
  | "doubly-linked-list"
  | "circular-linked-list"
  | "stack"
  | "queue"
  | "binary-search-tree";

export type Exercise = {
  id: string;
  level: "Cơ bản" | "Trung bình" | "Nâng cao";
  title: string;
  prompt: string;
  knowledge: string;
  input: string;
  expected: string;
  starter: string;
  hints: string[];
  solution: string;
  thinking: string;
  commonMistake: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
  optionReasons: string[];
};

export type Topic = {
  slug: TopicSlug;
  name: string;
  shortName: string;
  eyebrow: string;
  accent: string;
  description: string;
  analogy: string;
  overview: string;
  theory: string[];
  anatomy: { term: string; description: string }[];
  operations: { name: string; complexity: string; description: string }[];
  code: string;
  codeNotes: string[];
  mistakes: { title: string; fix: string }[];
  examSummary: string[];
  exercises: Exercise[];
  quiz: QuizQuestion[];
  simulator?: "linked" | "stack" | "queue" | "bst";
};

const exercise = (
  id: string,
  level: Exercise["level"],
  title: string,
  prompt: string,
  starter: string,
  solution: string,
  expected: string,
  thinking: string,
  knowledge: string,
  input = "Dữ liệu được tạo trực tiếp trong chương trình.",
  hints = ["Xác định điều kiện dừng trước.", "Theo dõi biến con trỏ sau mỗi vòng lặp."],
  commonMistake = "Quên xử lý cấu trúc rỗng hoặc làm mất liên kết trước khi cập nhật con trỏ.",
): Exercise => ({
  id,
  level,
  title,
  prompt,
  starter,
  solution,
  expected,
  thinking,
  knowledge,
  input,
  hints,
  commonMistake,
});

const quiz = (
  id: string,
  question: string,
  options: string[],
  answer: number,
  explanation: string,
  code?: string,
): QuizQuestion => ({
  id,
  question,
  options,
  answer,
  explanation,
  code,
  optionReasons: options.map((option, index) =>
    index === answer
      ? `“${option}” là lựa chọn đúng theo nguyên lý của cấu trúc.`
      : `“${option}” không thỏa điều kiện được mô tả trong câu hỏi.`,
  ),
});

export const topics: Topic[] = [
  {
    slug: "singly-linked-list",
    name: "Singly Linked List",
    shortName: "DSLK đơn",
    eyebrow: "Nền tảng con trỏ",
    accent: "mint",
    description: "Mỗi node giữ dữ liệu và một reference trỏ đến node kế tiếp.",
    analogy: "Giống một đoàn tàu: mỗi toa chỉ biết toa ngay sau mình.",
    overview:
      "Danh sách liên kết đơn tổ chức dữ liệu thành chuỗi node. Biến head mở đầu chuỗi, tail đánh dấu node cuối và tail.next luôn là None.",
    theory: [
      "Node là object chứa data và next. Trong Python, next lưu reference đến object Node khác, không phải bản sao của node đó.",
      "Muốn duyệt danh sách, đặt current = head rồi liên tục cập nhật current = current.next cho đến khi current is None.",
      "Thêm đầu là O(1). Thêm cuối là O(1) nếu quản lý tail; nếu chỉ có head, ta phải duyệt nên là O(n).",
      "Danh sách phù hợp khi số phần tử thay đổi thường xuyên và ta chèn/xóa đầu nhiều. Không phù hợp khi cần truy cập phần tử thứ i liên tục.",
    ],
    anatomy: [
      { term: "head", description: "Reference đến node đầu; None khi danh sách rỗng." },
      { term: "tail", description: "Reference đến node cuối; tail.next phải là None." },
      { term: "current", description: "Con trỏ tạm dùng khi duyệt, tìm hoặc xóa." },
      { term: "next", description: "Reference nối node hiện tại với node kế tiếp." },
    ],
    operations: [
      { name: "Thêm đầu", complexity: "O(1)", description: "Node mới trỏ đến head cũ rồi trở thành head." },
      { name: "Thêm cuối", complexity: "O(1)*", description: "Gắn tail.next và cập nhật tail (*khi có tail)." },
      { name: "Tìm kiếm", complexity: "O(n)", description: "So sánh lần lượt từ head đến None." },
      { name: "Xóa theo giá trị", complexity: "O(n)", description: "Giữ previous để nối bỏ node cần xóa." },
      { name: "Đảo ngược", complexity: "O(n)", description: "Đổi chiều từng next bằng ba con trỏ." },
    ],
    code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def is_empty(self):
        return self.head is None

    def add_first(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        if self.tail is None:
            self.tail = new_node

    def add_last(self, data):
        new_node = Node(data)
        if self.is_empty():
            self.head = self.tail = new_node
            return
        self.tail.next = new_node
        self.tail = new_node

    def remove_value(self, value):
        previous = None
        current = self.head
        while current is not None:
            if current.data == value:
                if previous is None:
                    self.head = current.next
                else:
                    previous.next = current.next
                if current is self.tail:
                    self.tail = previous
                return True
            previous = current
            current = current.next
        return False

    def search(self, value):
        current = self.head
        while current is not None:
            if current.data == value:
                return current
            current = current.next
        return None

    def reverse(self):
        previous = None
        current = self.head
        self.tail = self.head
        while current is not None:
            next_node = current.next
            current.next = previous
            previous = current
            current = next_node
        self.head = previous

    def display(self):
        values = []
        current = self.head
        while current is not None:
            values.append(str(current.data))
            current = current.next
        print(" -> ".join(values) + " -> None")


numbers = SinglyLinkedList()
numbers.add_last(10)
numbers.add_last(20)
numbers.add_first(5)
numbers.display()  # 5 -> 10 -> 20 -> None`,
    codeNotes: [
      "add_first phải cập nhật tail khi chèn node đầu tiên.",
      "remove_value giữ previous vì node hiện tại không biết node đứng trước.",
      "reverse lưu next_node trước khi đổi current.next để không làm mất phần danh sách còn lại.",
    ],
    mistakes: [
      { title: "Làm mất danh sách", fix: "Luôn lưu next_node trước khi đổi liên kết trong thao tác reverse." },
      { title: "Quên cập nhật tail", fix: "Khi xóa node cuối hoặc thêm node đầu tiên, cập nhật cả tail." },
      { title: "Dùng current.data khi current là None", fix: "Kiểm tra current is not None trước khi đọc data." },
    ],
    examSummary: [
      "head mở đầu, tail kết thúc và tail.next = None.",
      "Không có truy cập ngẫu nhiên: phần tử thứ i cần O(i).",
      "Chèn đầu O(1); search, traversal và reverse đều O(n).",
      "Xóa giữa cần giữ previous hoặc tìm node đứng trước.",
    ],
    simulator: "linked",
    exercises: [
      exercise(
        "sll-1",
        "Cơ bản",
        "Đếm số node",
        "Hoàn thành hàm count_nodes để trả về số node trong danh sách.",
        `def count_nodes(self):
    count = 0
    current = self.head
    # Viết tiếp tại đây
    return count`,
        `def count_nodes(self):
    count = 0
    current = self.head
    while current is not None:
        count += 1
        current = current.next
    return count`,
        "Danh sách 4 -> 7 -> 9 trả về 3.",
        "Mỗi lần current trỏ đến một node hợp lệ thì tăng count, sau đó tiến sang next.",
        "Traversal, biến đếm và điều kiện dừng None.",
      ),
      exercise(
        "sll-2",
        "Trung bình",
        "Chèn sau một giá trị",
        "Viết insert_after(target, data). Trả về False nếu không có target.",
        `def insert_after(self, target, data):
    current = self.head
    # Tìm target và nối node mới
    return False`,
        `def insert_after(self, target, data):
    current = self.head
    while current is not None:
        if current.data == target:
            new_node = Node(data)
            new_node.next = current.next
            current.next = new_node
            if current is self.tail:
                self.tail = new_node
            return True
        current = current.next
    return False`,
        "[2, 5, 8], insert_after(5, 6) → [2, 5, 6, 8].",
        "Nối new_node với phần sau trước, rồi mới cho current trỏ đến new_node.",
        "Thứ tự cập nhật reference và trường hợp chèn sau tail.",
      ),
      exercise(
        "sll-3",
        "Nâng cao",
        "Tìm node giữa",
        "Tìm node giữa chỉ với một lần duyệt bằng slow và fast.",
        `def middle(self):
    slow = self.head
    fast = self.head
    # fast đi nhanh gấp đôi
    return slow`,
        `def middle(self):
    slow = self.head
    fast = self.head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow`,
        "[1, 2, 3, 4, 5] → node có data 3.",
        "Khi fast đến cuối, slow mới đi được một nửa quãng đường.",
        "Kỹ thuật hai con trỏ, O(n) time và O(1) space.",
      ),
    ],
    quiz: [
      quiz("sll-q1", "Dấu hiệu kết thúc của DSLK đơn là gì?", ["head = tail", "current.next = head", "current is None", "data = 0"], 2, "Sau node cuối, reference next là None."),
      quiz("sll-q2", "Thêm một node vào đầu tốn bao nhiêu thời gian?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 0, "Chỉ cần đổi hai reference, không phụ thuộc số node."),
      quiz("sll-q3", "Output của đoạn code là gì?", ["5", "10", "None", "Lỗi"], 1, "head.next trỏ đến node thứ hai có data 10.", `a = Node(5)\nb = Node(10)\na.next = b\nprint(a.next.data)`),
      quiz("sll-q4", "Khi xóa node cuối, biến nào cũng cần được cập nhật?", ["head", "tail", "data", "count luôn bắt buộc"], 1, "tail phải chuyển về node đứng trước node bị xóa."),
      quiz("sll-q5", "Nhược điểm chính so với Python list là gì?", ["Không thể chèn", "Không chứa được số", "Không truy cập nhanh theo chỉ số", "Luôn tốn O(n²) bộ nhớ"], 2, "Muốn đến phần tử i phải đi từ head qua các next."),
    ],
  },
  {
    slug: "doubly-linked-list",
    name: "Doubly Linked List",
    shortName: "DSLK đôi",
    eyebrow: "Đi theo hai hướng",
    accent: "violet",
    description: "Mỗi node có cả prev và next để duyệt tiến hoặc lùi.",
    analogy: "Một toa tàu có cửa nối với cả toa trước lẫn toa sau.",
    overview:
      "Danh sách liên kết đôi đổi thêm bộ nhớ lấy khả năng đi hai chiều và xóa node đã biết trong O(1). Head.prev và tail.next đều là None.",
    theory: [
      "Mỗi Node giữ data, prev và next. Hai reference của hai node kề nhau phải nhất quán: a.next is b thì b.prev is a.",
      "Có thể duyệt xuôi từ head hoặc duyệt ngược từ tail, điều mà DSLK đơn không làm trực tiếp được.",
      "Nếu đã có reference đến node cần xóa, ta nối node.prev với node.next mà không phải tìm node đứng trước.",
      "Cấu trúc phù hợp cho lịch sử trước/sau, playlist hai chiều; đổi lại mỗi node cần thêm một reference prev.",
    ],
    anatomy: [
      { term: "head", description: "Node đầu; head.prev luôn là None." },
      { term: "tail", description: "Node cuối; tail.next luôn là None." },
      { term: "prev", description: "Reference đến node đứng ngay trước." },
      { term: "next", description: "Reference đến node đứng ngay sau." },
    ],
    operations: [
      { name: "Thêm đầu/cuối", complexity: "O(1)", description: "Cập nhật hai phía của liên kết và head/tail." },
      { name: "Xóa node đã biết", complexity: "O(1)", description: "Nối prev và next bỏ qua node." },
      { name: "Tìm kiếm", complexity: "O(n)", description: "Vẫn phải so sánh từng node." },
      { name: "Duyệt hai chiều", complexity: "O(n)", description: "Đi từ head hoặc tail tùy mục tiêu." },
    ],
    code: `class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None


class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def add_first(self, data):
        new_node = Node(data)
        new_node.next = self.head
        if self.head is None:
            self.tail = new_node
        else:
            self.head.prev = new_node
        self.head = new_node

    def add_last(self, data):
        new_node = Node(data)
        new_node.prev = self.tail
        if self.tail is None:
            self.head = new_node
        else:
            self.tail.next = new_node
        self.tail = new_node

    def remove(self, value):
        current = self.head
        while current is not None and current.data != value:
            current = current.next
        if current is None:
            return False
        if current.prev is None:
            self.head = current.next
        else:
            current.prev.next = current.next
        if current.next is None:
            self.tail = current.prev
        else:
            current.next.prev = current.prev
        return True

    def display_forward(self):
        current = self.head
        while current is not None:
            print(current.data, end=" <-> ")
            current = current.next
        print("None")

    def display_backward(self):
        current = self.tail
        while current is not None:
            print(current.data, end=" <-> ")
            current = current.prev
        print("None")`,
    codeNotes: [
      "Khi thêm đầu, ngoài new_node.next còn phải đặt head cũ.prev.",
      "Xóa node có bốn trường hợp biên được gom bằng kiểm tra prev/next là None.",
      "Duyệt ngược bắt đầu ở tail và dùng current.prev.",
    ],
    mistakes: [
      { title: "Chỉ cập nhật một chiều", fix: "Sau mỗi thay đổi, kiểm tra cả a.next và b.prev." },
      { title: "Sai head hoặc tail", fix: "Xử lý riêng khi current.prev hoặc current.next là None." },
      { title: "Nhầm prev với previous tạm", fix: "prev là thuộc tính node; previous có thể chỉ là biến duyệt." },
    ],
    examSummary: [
      "Node có ba phần: prev | data | next.",
      "Tốn bộ nhớ hơn DSLK đơn nhưng duyệt được hai chiều.",
      "Xóa node đã có reference là O(1); tìm node vẫn O(n).",
      "Bất biến quan trọng: a.next = b thì b.prev = a.",
    ],
    exercises: [
      exercise("dll-1", "Cơ bản", "Duyệt ngược", "Hoàn thành hàm trả về các giá trị từ tail về head.", `def to_reverse_list(self):\n    values = []\n    current = self.tail\n    # Hoàn thành\n    return values`, `def to_reverse_list(self):\n    values = []\n    current = self.tail\n    while current is not None:\n        values.append(current.data)\n        current = current.prev\n    return values`, "1 <-> 2 <-> 3 → [3, 2, 1].", "Bắt đầu từ tail và chỉ dùng prev.", "Traversal ngược và điều kiện dừng None."),
      exercise("dll-2", "Trung bình", "Xóa node đầu", "Viết remove_first và trả về dữ liệu đã xóa, hoặc None.", `def remove_first(self):\n    # Xử lý rỗng và danh sách một node\n    pass`, `def remove_first(self):\n    if self.head is None:\n        return None\n    value = self.head.data\n    self.head = self.head.next\n    if self.head is None:\n        self.tail = None\n    else:\n        self.head.prev = None\n    return value`, "[4, 9] → trả 4, danh sách còn [9].", "Sau khi dời head, ngắt prev mới và xử lý trường hợp không còn node.", "Cập nhật head, tail và prev ở biên."),
      exercise("dll-3", "Nâng cao", "Chèn trước node", "Viết insert_before(target, data) và giữ liên kết hai chiều nhất quán.", `def insert_before(self, target, data):\n    current = self.head\n    # Tìm target và chèn\n    return False`, `def insert_before(self, target, data):\n    current = self.head\n    while current is not None and current.data != target:\n        current = current.next\n    if current is None:\n        return False\n    new_node = Node(data)\n    new_node.prev = current.prev\n    new_node.next = current\n    if current.prev is None:\n        self.head = new_node\n    else:\n        current.prev.next = new_node\n    current.prev = new_node\n    return True`, "[3, 7], insert_before(7, 5) → [3, 5, 7].", "Nối node mới với hai hàng xóm rồi cập nhật hàng xóm trỏ ngược lại.", "Bốn reference quanh vị trí chèn."),
    ],
    quiz: [
      quiz("dll-q1", "head.prev có giá trị nào?", ["head", "tail", "None", "0"], 2, "Không có node nào đứng trước head."),
      quiz("dll-q2", "Lợi thế rõ nhất so với DSLK đơn?", ["Ít bộ nhớ hơn", "Duyệt được hai chiều", "Search luôn O(1)", "Không cần Node"], 1, "prev cho phép đi từ tail về head."),
      quiz("dll-q3", "Nếu a.next is b thì liên hệ đúng là gì?", ["b.next is a", "b.prev is a", "a.prev is b", "b.data is a"], 1, "Hai chiều của cùng một liên kết phải đối xứng."),
      quiz("dll-q4", "Xóa một node đã có reference tốn?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 0, "Có thể truy cập trực tiếp cả hai hàng xóm qua prev và next."),
      quiz("dll-q5", "Duyệt ngược dùng cập nhật nào?", ["current = current.next", "current = head", "current = current.prev", "tail = tail.next"], 2, "Từ tail, prev đưa current về phía head."),
    ],
  },
  {
    slug: "circular-linked-list",
    name: "Circular Singly Linked List",
    shortName: "DSLK vòng",
    eyebrow: "Không có điểm cuối None",
    accent: "amber",
    description: "Node cuối trỏ lại head, tạo thành một vòng kín.",
    analogy: "Giống vòng quay: đi tiếp đủ lâu sẽ quay lại vị trí xuất phát.",
    overview:
      "Danh sách vòng đơn giữ quy tắc tail.next = head. Vì không có None ở cuối, mọi vòng duyệt phải chủ động dừng khi current quay lại head.",
    theory: [
      "Có thể chỉ lưu tail vì head luôn là tail.next. Điều này giúp thêm đầu và thêm cuối đều O(1).",
      "Dùng vòng while True hoặc do-while mô phỏng trong Python, nhưng phải kiểm tra current is head sau khi di chuyển.",
      "Danh sách vòng phù hợp cho round-robin, lượt chơi, playlist lặp và bộ lập lịch luân phiên.",
      "Rủi ro lớn nhất là vòng lặp vô hạn nếu dùng điều kiện current is not None như DSLK đơn.",
    ],
    anatomy: [
      { term: "tail", description: "Node cuối theo quy ước logic, không phải điểm cụt." },
      { term: "head", description: "Node đầu và bằng tail.next khi không rỗng." },
      { term: "tail.next", description: "Luôn trỏ về head để khép vòng." },
      { term: "current", description: "Phải dừng khi current quay lại head." },
    ],
    operations: [
      { name: "Thêm đầu", complexity: "O(1)", description: "Gắn node mới sau tail và coi nó là head." },
      { name: "Thêm cuối", complexity: "O(1)", description: "Chèn sau tail rồi chuyển tail." },
      { name: "Tìm/Xóa", complexity: "O(n)", description: "Dừng sau tối đa một vòng." },
      { name: "Duyệt vòng", complexity: "O(n)", description: "Xử lý mỗi node đúng một lần rồi dừng ở head." },
    ],
    code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class CircularLinkedList:
    def __init__(self):
        self.tail = None

    @property
    def head(self):
        return None if self.tail is None else self.tail.next

    def add_last(self, data):
        new_node = Node(data)
        if self.tail is None:
            self.tail = new_node
            new_node.next = new_node
        else:
            new_node.next = self.tail.next
            self.tail.next = new_node
            self.tail = new_node

    def search(self, value):
        if self.tail is None:
            return None
        current = self.head
        while True:
            if current.data == value:
                return current
            current = current.next
            if current is self.head:
                return None

    def remove(self, value):
        if self.tail is None:
            return False
        previous = self.tail
        current = self.head
        while True:
            if current.data == value:
                if current is previous:
                    self.tail = None
                else:
                    previous.next = current.next
                    if current is self.tail:
                        self.tail = previous
                return True
            previous = current
            current = current.next
            if current is self.head:
                return False

    def display(self):
        if self.tail is None:
            print("Empty")
            return
        values = []
        current = self.head
        while True:
            values.append(str(current.data))
            current = current.next
            if current is self.head:
                break
        print(" -> ".join(values) + " -> (head)")`,
    codeNotes: [
      "Node đầu tiên tự trỏ đến chính nó: new_node.next = new_node.",
      "Trong mọi lần thêm, bất biến tail.next = head vẫn được giữ.",
      "search và remove kiểm tra quay lại head để dừng an toàn.",
    ],
    mistakes: [
      { title: "Chờ current là None", fix: "Danh sách vòng không dẫn tới None; hãy dừng khi current is head." },
      { title: "Quên node một phần tử", fix: "Khi chỉ một node, tail is head và node.next trỏ chính nó." },
      { title: "Mất head khi đổi tail", fix: "Lưu hoặc nối new_node.next với tail.next trước khi cập nhật tail." },
    ],
    examSummary: [
      "Bất biến cốt lõi: tail.next = head.",
      "Không có None ở cuối, cần điều kiện quay lại head.",
      "Nếu chỉ giữ tail, head truy cập O(1) qua tail.next.",
      "Ứng dụng tiêu biểu: round-robin và luân phiên lượt.",
    ],
    exercises: [
      exercise("cll-1", "Cơ bản", "Kiểm tra danh sách rỗng", "Viết is_empty khi class chỉ lưu tail.", `def is_empty(self):\n    # Trả về True hoặc False\n    pass`, `def is_empty(self):\n    return self.tail is None`, "Danh sách mới → True; sau add_last(3) → False.", "Không có tail đồng nghĩa chưa có bất kỳ node nào.", "Biểu diễn trạng thái rỗng."),
      exercise("cll-2", "Trung bình", "Đếm đúng một vòng", "Đếm số node mà không rơi vào vòng lặp vô hạn.", `def count_nodes(self):\n    if self.tail is None:\n        return 0\n    count = 0\n    current = self.head\n    # Hoàn thành\n    return count`, `def count_nodes(self):\n    if self.tail is None:\n        return 0\n    count = 0\n    current = self.head\n    while True:\n        count += 1\n        current = current.next\n        if current is self.head:\n            break\n    return count`, "Vòng 4 → 6 → 8 → head trả 3.", "Xử lý current trước, di chuyển, rồi kiểm tra đã quay lại head chưa.", "Điều kiện dừng của vòng kín."),
      exercise("cll-3", "Nâng cao", "Chia lượt round-robin", "Trả về k lượt bắt đầu từ head, có thể đi qua nhiều vòng.", `def turns(self, k):\n    result = []\n    if self.tail is None:\n        return result\n    current = self.head\n    # Thêm đúng k giá trị\n    return result`, `def turns(self, k):\n    result = []\n    if self.tail is None:\n        return result\n    current = self.head\n    for _ in range(k):\n        result.append(current.data)\n        current = current.next\n    return result`, "[A, B, C], k=5 → [A, B, C, A, B].", "Vì next tự quay vòng, chỉ cần lặp đúng k lần thay vì tìm điều kiện None.", "Ứng dụng vòng lặp có số lượt xác định."),
    ],
    quiz: [
      quiz("cll-q1", "Điều kiện quan trọng nhất của DSLK vòng?", ["head = None", "tail.next = head", "tail.prev = head", "head.next = None"], 1, "Reference của tail khép vòng về head."),
      quiz("cll-q2", "Vì sao while current is not None không phù hợp?", ["Python không có while", "current luôn là số", "current không bao giờ thành None", "head luôn None"], 2, "Các next tạo vòng kín nên current tiếp tục quay vòng."),
      quiz("cll-q3", "Một danh sách vòng có đúng một node thì?", ["node.next is None", "node.next is node", "tail is None", "Không hợp lệ"], 1, "Node vừa là head vừa là tail và tự trỏ lại mình."),
      quiz("cll-q4", "Ứng dụng phù hợp nhất?", ["Tìm kiếm nhị phân", "Round-robin", "Bảng băm", "Ma trận"], 1, "Round-robin cần quay lại phần tử đầu sau phần tử cuối."),
      quiz("cll-q5", "Nếu chỉ lưu tail, lấy head bằng?", ["tail.prev", "tail.data", "tail.next", "None"], 2, "Theo bất biến vòng, tail.next chính là head."),
    ],
  },
  {
    slug: "stack",
    name: "Stack",
    shortName: "Ngăn xếp",
    eyebrow: "LIFO · Vào sau ra trước",
    accent: "blue",
    description: "Chỉ thêm và lấy phần tử ở đỉnh stack.",
    analogy: "Chồng sách: cuốn đặt sau cùng nằm trên cùng và được lấy trước.",
    overview:
      "Stack tuân theo LIFO. Mọi thao tác chính diễn ra ở top: push thêm, pop lấy và peek xem mà không xóa.",
    theory: [
      "Python list hỗ trợ stack tự nhiên với append và pop ở cuối, đều có chi phí trung bình O(1).",
      "Cài bằng linked list thì head đóng vai top; push là add_first và pop là remove_first.",
      "Stack xuất hiện trong call stack của đệ quy, undo, backtracking, kiểm tra dấu ngoặc và DFS.",
      "Không dùng pop(0) cho stack vì vừa sai vị trí top theo quy ước, vừa làm dịch các phần tử O(n).",
    ],
    anatomy: [
      { term: "top", description: "Vị trí duy nhất cho push, pop và peek." },
      { term: "push", description: "Đặt phần tử mới lên top." },
      { term: "pop", description: "Lấy và xóa phần tử ở top." },
      { term: "peek", description: "Đọc top nhưng giữ nguyên stack." },
    ],
    operations: [
      { name: "Push", complexity: "O(1)*", description: "list.append hoặc chèn đầu linked list." },
      { name: "Pop", complexity: "O(1)", description: "list.pop hoặc xóa head." },
      { name: "Peek", complexity: "O(1)", description: "Đọc phần tử top." },
      { name: "Search", complexity: "O(n)", description: "Không phải thao tác cốt lõi; cần duyệt." },
    ],
    code: `class StackWithList:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def push(self, value):
        self.items.append(value)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]

    def size(self):
        return len(self.items)


class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class StackWithLinkedList:
    def __init__(self):
        self.top = None
        self.length = 0

    def push(self, value):
        new_node = Node(value)
        new_node.next = self.top
        self.top = new_node
        self.length += 1

    def pop(self):
        if self.top is None:
            raise IndexError("Stack is empty")
        value = self.top.data
        self.top = self.top.next
        self.length -= 1
        return value

    def peek(self):
        return None if self.top is None else self.top.data


history = StackWithList()
history.push("Trang chủ")
history.push("Bài Stack")
print(history.pop())  # Bài Stack`,
    codeNotes: [
      "Với list, top được quy ước ở cuối để append/pop hiệu quả.",
      "Với linked list, top ở head nên không cần duyệt.",
      "pop trên stack rỗng cần trả lỗi rõ ràng hoặc giá trị quy ước.",
    ],
    mistakes: [
      { title: "Pop stack rỗng", fix: "Luôn kiểm tra is_empty hoặc chủ động raise IndexError rõ nghĩa." },
      { title: "Dùng pop(0)", fix: "Quy ước top ở cuối list và dùng pop() để giữ O(1)." },
      { title: "Nhầm peek với pop", fix: "peek chỉ đọc, tuyệt đối không thay đổi kích thước." },
    ],
    examSummary: [
      "LIFO: phần tử vào sau ra trước.",
      "push, pop, peek đều O(1); search O(n).",
      "Top ở cuối Python list hoặc ở head của linked list.",
      "Ứng dụng: undo, dấu ngoặc, DFS và call stack.",
    ],
    simulator: "stack",
    exercises: [
      exercise("stack-1", "Cơ bản", "Đảo ngược chuỗi", "Dùng list như stack để đảo ngược chuỗi, không dùng slicing.", `def reverse_text(text):\n    stack = []\n    # push từng ký tự và pop\n    return ""`, `def reverse_text(text):\n    stack = []\n    for char in text:\n        stack.append(char)\n    result = ""\n    while stack:\n        result += stack.pop()\n    return result`, '"CSD" → "DSC".', "Ký tự cuối được push sau cùng nên được pop đầu tiên.", "LIFO, push và pop."),
      exercise("stack-2", "Trung bình", "Kiểm tra dấu ngoặc", "Trả về True nếu (), [] và {} cân bằng đúng thứ tự.", `def is_balanced(text):\n    stack = []\n    pairs = {")": "(", "]": "[", "}": "{"}\n    # Hoàn thành\n    return len(stack) == 0`, `def is_balanced(text):\n    stack = []\n    pairs = {")": "(", "]": "[", "}": "{"}\n    for char in text:\n        if char in "([{":\n            stack.append(char)\n        elif char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n    return len(stack) == 0`, '"([{}])" → True; "([)]" → False.', "Mỗi ngoặc đóng phải khớp chính xác với ngoặc mở gần nhất.", "Stack, ánh xạ cặp và short-circuit."),
      exercise("stack-3", "Nâng cao", "Min Stack", "Thiết kế stack trả về giá trị nhỏ nhất trong O(1).", `class MinStack:\n    def __init__(self):\n        self.items = []\n        self.minimums = []\n\n    def push(self, value):\n        pass\n\n    def get_min(self):\n        pass`, `class MinStack:\n    def __init__(self):\n        self.items = []\n        self.minimums = []\n\n    def push(self, value):\n        self.items.append(value)\n        if not self.minimums or value <= self.minimums[-1]:\n            self.minimums.append(value)\n\n    def pop(self):\n        value = self.items.pop()\n        if value == self.minimums[-1]:\n            self.minimums.pop()\n        return value\n\n    def get_min(self):\n        return None if not self.minimums else self.minimums[-1]`, "push 5, 2, 4 → min 2; pop 4 → min vẫn 2.", "Dùng stack phụ chỉ lưu các mốc minimum, đồng bộ khi push/pop.", "Thiết kế dữ liệu phụ để tối ưu truy vấn."),
    ],
    quiz: [
      quiz("stack-q1", "Stack tuân theo nguyên tắc nào?", ["FIFO", "LIFO", "Random", "Sorted"], 1, "Last In, First Out — vào sau ra trước."),
      quiz("stack-q2", "Top của stack dùng Python list nên đặt ở đâu?", ["Đầu list", "Giữa list", "Cuối list", "Không cần top"], 2, "append và pop ở cuối có chi phí trung bình O(1)."),
      quiz("stack-q3", "Sau push(2), push(7), pop(), kết quả pop là?", ["2", "7", "None", "9"], 1, "7 được đưa vào sau cùng nên ra trước."),
      quiz("stack-q4", "peek khác pop ở điểm nào?", ["peek xóa top", "peek không xóa top", "peek luôn O(n)", "peek thêm phần tử"], 1, "peek chỉ quan sát giá trị top."),
      quiz("stack-q5", "Bài toán nào dùng stack tự nhiên nhất?", ["Xử lý hàng chờ in", "Undo thao tác", "Round-robin", "BFS"], 1, "Undo cần hoàn tác thao tác gần nhất trước."),
    ],
  },
  {
    slug: "queue",
    name: "Queue",
    shortName: "Hàng đợi",
    eyebrow: "FIFO · Vào trước ra trước",
    accent: "coral",
    description: "Thêm ở rear và lấy ở front theo đúng thứ tự đến.",
    analogy: "Hàng mua vé: người đến trước được phục vụ trước.",
    overview:
      "Queue tuân theo FIFO. Enqueue thêm ở rear, dequeue lấy ở front. Cài bằng linked list với cả front và rear giúp hai thao tác đều O(1).",
    theory: [
      "front chỉ node sẽ rời hàng tiếp theo; rear chỉ node vừa vào gần nhất.",
      "Khi dequeue phần tử cuối, phải đặt cả front và rear về None để biểu diễn hàng rỗng đúng.",
      "collections.deque là lựa chọn thực tế tốt trong Python, nhưng tự cài linked list giúp hiểu reference.",
      "Queue dùng trong BFS, xử lý yêu cầu, hàng đợi in và mô phỏng dịch vụ.",
    ],
    anatomy: [
      { term: "front", description: "Đầu lấy ra; dequeue diễn ra tại đây." },
      { term: "rear", description: "Cuối thêm vào; enqueue diễn ra tại đây." },
      { term: "enqueue", description: "Thêm phần tử mới vào rear." },
      { term: "dequeue", description: "Lấy phần tử lâu nhất ở front." },
    ],
    operations: [
      { name: "Enqueue", complexity: "O(1)", description: "Nối rear.next rồi dời rear." },
      { name: "Dequeue", complexity: "O(1)", description: "Dời front sang front.next." },
      { name: "Peek/front", complexity: "O(1)", description: "Đọc dữ liệu ở front." },
      { name: "Search", complexity: "O(n)", description: "Không phải thao tác cốt lõi; cần duyệt." },
    ],
    code: `from collections import deque


class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedQueue:
    def __init__(self):
        self.front = None
        self.rear = None
        self.length = 0

    def is_empty(self):
        return self.front is None

    def enqueue(self, value):
        new_node = Node(value)
        if self.rear is None:
            self.front = self.rear = new_node
        else:
            self.rear.next = new_node
            self.rear = new_node
        self.length += 1

    def dequeue(self):
        if self.front is None:
            raise IndexError("Queue is empty")
        value = self.front.data
        self.front = self.front.next
        if self.front is None:
            self.rear = None
        self.length -= 1
        return value

    def peek(self):
        return None if self.front is None else self.front.data

    def size(self):
        return self.length


requests = LinkedQueue()
requests.enqueue("REQ-01")
requests.enqueue("REQ-02")
print(requests.dequeue())  # REQ-01

# Trong dự án thực tế, deque hỗ trợ hai đầu hiệu quả:
fast_queue = deque([1, 2])
fast_queue.append(3)
print(fast_queue.popleft())  # 1`,
    codeNotes: [
      "rear giúp enqueue không phải duyệt từ front.",
      "Sau dequeue cuối cùng, rear phải về None cùng front.",
      "deque.popleft() là O(1), khác list.pop(0) phải dịch phần tử.",
    ],
    mistakes: [
      { title: "Dùng list.pop(0)", fix: "Học cấu trúc bằng linked list; khi làm thật dùng collections.deque." },
      { title: "Quên reset rear", fix: "Nếu front thành None sau dequeue, đặt rear = None." },
      { title: "Nhầm FIFO với LIFO", fix: "Ghi rõ hai đầu: enqueue tại rear, dequeue tại front." },
    ],
    examSummary: [
      "FIFO: vào trước ra trước.",
      "front để lấy, rear để thêm; cả hai thao tác O(1).",
      "Queue rỗng khi front và rear đều None.",
      "Ứng dụng: BFS, hàng chờ, xử lý yêu cầu.",
    ],
    simulator: "queue",
    exercises: [
      exercise("queue-1", "Cơ bản", "Hoàn thành peek", "Trả về front.data hoặc None nếu queue rỗng.", `def peek(self):\n    # Không thay đổi queue\n    pass`, `def peek(self):\n    if self.front is None:\n        return None\n    return self.front.data`, "Queue [8, 3] → 8 và vẫn còn 2 phần tử.", "peek chỉ đọc node front.", "Kiểm tra rỗng và truy cập front."),
      exercise("queue-2", "Trung bình", "Xử lý k yêu cầu", "Dequeue tối đa k phần tử và trả danh sách đã xử lý.", `def process(queue, k):\n    done = []\n    # Dừng sớm nếu queue rỗng\n    return done`, `def process(queue, k):\n    done = []\n    for _ in range(k):\n        if queue.is_empty():\n            break\n        done.append(queue.dequeue())\n    return done`, "[A, B, C], k=2 → [A, B], queue còn [C].", "Mỗi lượt luôn lấy đúng front và kiểm tra rỗng trước.", "FIFO và vòng lặp giới hạn."),
      exercise("queue-3", "Nâng cao", "Sinh số nhị phân", "Dùng queue sinh n chuỗi nhị phân đầu tiên: 1, 10, 11, 100...", `from collections import deque\n\ndef binary_numbers(n):\n    queue = deque(["1"])\n    result = []\n    # Hoàn thành\n    return result`, `from collections import deque\n\ndef binary_numbers(n):\n    queue = deque(["1"])\n    result = []\n    for _ in range(n):\n        value = queue.popleft()\n        result.append(value)\n        queue.append(value + "0")\n        queue.append(value + "1")\n    return result`, "n=5 → ['1', '10', '11', '100', '101'].", "Mỗi chuỗi tạo hai con theo thứ tự FIFO, giống duyệt cây theo tầng.", "Queue và breadth-first generation."),
    ],
    quiz: [
      quiz("queue-q1", "Queue tuân theo nguyên tắc nào?", ["LIFO", "FIFO", "Sorted", "Random"], 1, "First In, First Out — vào trước ra trước."),
      quiz("queue-q2", "enqueue diễn ra ở đâu?", ["front", "rear", "root", "top"], 1, "Phần tử mới đứng cuối hàng tại rear."),
      quiz("queue-q3", "Sau enqueue(2), enqueue(7), dequeue(), giá trị lấy ra?", ["2", "7", "None", "9"], 0, "2 vào trước nên ra trước."),
      quiz("queue-q4", "Vì sao không nên dùng list.pop(0) cho queue lớn?", ["Không hợp lệ trong Python", "Tốn O(n) do dịch phần tử", "Luôn trả None", "Làm đảo queue"], 1, "Xóa đầu list khiến các phần tử sau phải dời chỉ số."),
      quiz("queue-q5", "Thuật toán nào dùng queue?", ["DFS đệ quy", "BFS", "Undo", "Đảo chuỗi"], 1, "BFS xử lý node theo từng tầng bằng FIFO."),
    ],
  },
  {
    slug: "binary-search-tree",
    name: "Binary Search Tree",
    shortName: "Cây BST",
    eyebrow: "Trái nhỏ · phải lớn",
    accent: "lime",
    description: "Cây nhị phân có quy tắc sắp thứ tự để search theo nhánh.",
    analogy: "Như trò đoán số: nhỏ hơn thì rẽ trái, lớn hơn thì rẽ phải.",
    overview:
      "BST giữ mọi giá trị nhỏ hơn node ở cây con trái và lớn hơn ở cây con phải. Hiệu quả phụ thuộc chiều cao của cây.",
    theory: [
      "Search so sánh tại current: bằng thì thấy, nhỏ hơn đi left, lớn hơn đi right; gặp None là không tồn tại.",
      "In-order traversal của BST cho dãy tăng dần. Pre-order bắt đầu bằng root; post-order kết thúc bằng root.",
      "Delete có ba ca: lá thì bỏ; một con thì nối cha với con; hai con thì thay bằng in-order successor — node nhỏ nhất của cây con phải.",
      "BST cân bằng có chiều cao O(log n); nếu chèn dữ liệu đã tăng dần, cây lệch thành gần linked list và thao tác thành O(n).",
    ],
    anatomy: [
      { term: "root", description: "Node gốc, điểm bắt đầu mọi đường tìm kiếm." },
      { term: "left", description: "Cây con chứa giá trị nhỏ hơn node." },
      { term: "right", description: "Cây con chứa giá trị lớn hơn node." },
      { term: "leaf", description: "Node không có left và right." },
    ],
    operations: [
      { name: "Insert/Search", complexity: "O(log n) avg", description: "Mỗi so sánh loại một nhánh khi cây cân đối." },
      { name: "Delete", complexity: "O(log n) avg", description: "Tìm node rồi xử lý 0, 1 hoặc 2 con." },
      { name: "Min/Max", complexity: "O(h)", description: "Đi hết nhánh trái/phải; h là chiều cao." },
      { name: "Traversal", complexity: "O(n)", description: "Mỗi node được thăm đúng một lần." },
    ],
    code: `from collections import deque


class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, data):
        def add(node, data):
            if node is None:
                return Node(data)
            if data < node.data:
                node.left = add(node.left, data)
            elif data > node.data:
                node.right = add(node.right, data)
            return node
        self.root = add(self.root, data)

    def search_iterative(self, value):
        current = self.root
        while current is not None:
            if value == current.data:
                return current
            if value < current.data:
                current = current.left
            else:
                current = current.right
        return None

    def find_min(self, node):
        current = node
        while current.left is not None:
            current = current.left
        return current

    def delete(self, value):
        def remove(node, value):
            if node is None:
                return None
            if value < node.data:
                node.left = remove(node.left, value)
            elif value > node.data:
                node.right = remove(node.right, value)
            else:
                if node.left is None:
                    return node.right
                if node.right is None:
                    return node.left
                successor = self.find_min(node.right)
                node.data = successor.data
                node.right = remove(node.right, successor.data)
            return node
        self.root = remove(self.root, value)

    def inorder(self):
        result = []
        def visit(node):
            if node is None:
                return
            visit(node.left)
            result.append(node.data)
            visit(node.right)
        visit(self.root)
        return result

    def breadth_first(self):
        if self.root is None:
            return []
        result = []
        queue = deque([self.root])
        while queue:
            node = queue.popleft()
            result.append(node.data)
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        return result


tree = BinarySearchTree()
for value in [50, 30, 70, 20, 40, 60, 80]:
    tree.insert(value)
print(tree.inorder())  # [20, 30, 40, 50, 60, 70, 80]`,
    codeNotes: [
      "Hàm insert đệ quy phải gán lại node.left hoặc node.right bằng kết quả trả về.",
      "Search lặp tránh thêm bộ nhớ call stack và thể hiện rõ đường đi.",
      "Delete hai con sao chép successor rồi xóa successor trong cây con phải.",
    ],
    mistakes: [
      { title: "Không gán kết quả đệ quy", fix: "Luôn viết node.left = remove(...) hoặc node.right = remove(...)." },
      { title: "Nhầm successor", fix: "Successor là node nhỏ nhất của cây con phải, không phải luôn là con phải trực tiếp." },
      { title: "Cho rằng BST luôn O(log n)", fix: "Nêu rõ trung bình O(log n), xấu nhất O(n) khi cây lệch." },
    ],
    examSummary: [
      "left < node < right (với quy ước không lưu trùng).",
      "In-order tạo dãy tăng dần.",
      "Delete hai con dùng min(right subtree) làm successor.",
      "Chi phí O(h): cân bằng O(log n), lệch O(n).",
    ],
    simulator: "bst",
    exercises: [
      exercise("bst-1", "Cơ bản", "Đếm node lá", "Đếm node không có cả left lẫn right bằng đệ quy.", `def count_leaves(node):\n    if node is None:\n        return 0\n    # Hoàn thành`, `def count_leaves(node):\n    if node is None:\n        return 0\n    if node.left is None and node.right is None:\n        return 1\n    return count_leaves(node.left) + count_leaves(node.right)`, "BST [5, 3, 7, 2] có 2 lá: 2 và 7.", "Base case None trả 0; node không con trả 1; còn lại cộng hai cây con.", "Recursion và định nghĩa leaf."),
      exercise("bst-2", "Trung bình", "Tính chiều cao", "Quy ước cây rỗng cao -1, node lá cao 0.", `def height(node):\n    if node is None:\n        return -1\n    # Hoàn thành`, `def height(node):\n    if node is None:\n        return -1\n    left_height = height(node.left)\n    right_height = height(node.right)\n    return 1 + max(left_height, right_height)`, "Cây root 5, con 3, cháu 2 có height 2.", "Đường dài nhất từ node xuống lá bằng 1 cộng chiều cao lớn hơn của hai cây con.", "Recursion, height và base case."),
      exercise("bst-3", "Nâng cao", "Kiểm tra BST hợp lệ", "Kiểm tra mọi node nằm trong khoảng min_value và max_value phù hợp.", `def is_valid(node, low=float("-inf"), high=float("inf")):\n    # Không chỉ so sánh với node cha\n    pass`, `def is_valid(node, low=float("-inf"), high=float("inf")):\n    if node is None:\n        return True\n    if not (low < node.data < high):\n        return False\n    return (is_valid(node.left, low, node.data) and\n            is_valid(node.right, node.data, high))`, "Cây 10 với node 12 nằm sâu trong cây con trái → False.", "Mỗi nhánh kế thừa toàn bộ giới hạn từ tổ tiên, không chỉ điều kiện với cha.", "Bất biến BST toàn cục và recursion với khoảng."),
    ],
    quiz: [
      quiz("bst-q1", "In-order traversal của BST tạo ra?", ["Dãy giảm", "Dãy tăng", "Thứ tự ngẫu nhiên", "Chỉ node lá"], 1, "Left → root → right đi qua giá trị theo thứ tự tăng."),
      quiz("bst-q2", "Khi value < current.data, search đi đâu?", ["left", "right", "root", "dừng luôn"], 0, "Giá trị nhỏ hơn nằm ở cây con trái."),
      quiz("bst-q3", "Delete node hai con thường dùng node nào?", ["Root", "Node lớn nhất toàn cây", "Min của cây con phải", "Một node lá bất kỳ"], 2, "Đó là in-order successor gần nhất."),
      quiz("bst-q4", "BST lệch hoàn toàn có search xấu nhất?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 2, "Chiều cao có thể bằng n - 1, giống linked list."),
      quiz("bst-q5", "Traversal nào dùng queue?", ["Pre-order đệ quy", "In-order đệ quy", "Breadth-first", "Post-order đệ quy"], 2, "BFS dùng FIFO để xử lý lần lượt từng tầng."),
    ],
  },
];

export const topicMap = Object.fromEntries(
  topics.map((topic) => [topic.slug, topic]),
) as Record<TopicSlug, Topic>;

export const learningPath = [
  "Class, object & reference",
  "Node trong Python",
  "Singly Linked List",
  "Doubly Linked List",
  "Circular Linked List",
  "Stack",
  "Queue",
  "Recursion",
  "Binary Search Tree",
  "Traversal",
  "Bài tập tổng hợp",
  "Thi thử CSD",
];

export const complexityRows = [
  ["Singly Linked List", "O(1)*", "O(n)", "O(n)", "O(n)"],
  ["Doubly Linked List", "O(1)*", "O(1)*", "O(n)", "O(n)"],
  ["Stack", "O(1)", "O(1)", "O(n)", "O(n)"],
  ["Queue", "O(1)", "O(1)", "O(n)", "O(n)"],
  ["BST trung bình", "O(log n)", "O(log n)", "O(log n)", "O(n)"],
  ["BST xấu nhất", "O(n)", "O(n)", "O(n)", "O(n)"],
];

export const glossary = [
  ["Reference", "Biến giữ tham chiếu đến một object, thay vì sao chép toàn bộ object."],
  ["Traversal", "Quá trình thăm lần lượt các node theo một thứ tự xác định."],
  ["Time complexity", "Cách thời gian chạy tăng theo kích thước input n."],
  ["Space complexity", "Lượng bộ nhớ bổ sung thuật toán cần theo kích thước input."],
  ["Recursion", "Hàm gọi lại chính nó với bài toán nhỏ hơn và có base case."],
  ["In-order successor", "Node đứng ngay sau một node trong thứ tự in-order; với BST là min của cây con phải."],
];
