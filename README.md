# Spellbound - RPG Vocabulary Learning Game

Spellbound là một ứng dụng học từ vựng tiếng Anh kết hợp với lối chơi nhập vai (RPG). Người chơi sẽ tham gia vào các cuộc hành trình, đối đầu với quái vật và boss bằng cách đánh vần chính xác các từ vựng.

## 🌟 Tính năng chính

### 1. Adventure Map (Bản đồ hành trình)
- Hệ thống màn chơi (Levels) đa dạng với độ khó tăng dần.
- Mỗi level bao gồm nhiều cuộc chạm trán (Encounters) với quái vật thường và một trận đấu Boss cuối mỗi level.
- Tiến trình chơi được lưu lại tự động.

### 2. Hệ thống chiến đấu (Combat System)
- Người chơi tấn công quái vật bằng cách nhập đúng từ vựng.
- Hỗ trợ phản hồi thời gian thực: Hiển thị đúng/sai ngay khi nhập.
- **Text-to-Speech (TTS)**: 
    - Nghe phát âm của từ mục tiêu.
    - Nghe phát âm của từ bạn đang nhập để so sánh.
- Hiển thị phiên âm (Phonetic), nghĩa tiếng Việt và định nghĩa tiếng Anh.

### 3. Thư viện từ vựng (Library)
- Quản lý danh sách từ vựng cá nhân.
- Thêm từ mới, sửa hoặc xóa từ hiện có.
- **Import/Export**: Nhập danh sách từ nhanh chóng qua văn bản (phân tách bằng dấu phẩy).
- **Reset All**: Khôi phục bộ từ vựng mặc định và làm mới hành trình.
- **Đồng bộ hóa**: Game sẽ tự động tạo đề dựa trên chính xác những gì có trong thư viện của bạn.

### 4. Cửa hàng (Shop) & Vật phẩm
- Sử dụng tiền vàng (Coins) kiếm được sau mỗi trận đấu để mua vật phẩm hỗ trợ:
    - **Hint**: Gợi ý một chữ cái ngẫu nhiên.
    - **Shield**: Bảo vệ người chơi khỏi sát thương khi nhập sai.
    - **Reveal Letter**: Mở khóa một ô chữ cái cụ thể.
    - **Food (Candy, Chocolate, Cake)**: Hồi phục HP.

### 5. Vòng quay may mắn (Lucky Spin)
- Thử vận may để nhận thêm vàng hoặc hồi phục HP.

### 6. Hệ thống tiến trình & Lưu trữ
- Lưu trữ toàn bộ dữ liệu (Player state, Levels, Words, Used words) vào `LocalStorage`.
- Người chơi có thể tiếp tục hành trình bất cứ khi nào quay lại.

---

## ⚙️ Cấu hình (Configuration)

Ứng dụng cho phép tùy chỉnh các thông số game thông qua biến môi trường (Environment Variables). Bạn có thể tạo file `.env` dựa trên `.env.example`:

| Biến môi trường | Mô tả | Mặc định |
| :--- | :--- | :--- |
| `VITE_STARTING_HP` | Lượng máu khởi đầu của người chơi | 100 |
| `VITE_DEDUCTED_HP_ON_LOSS` | Lượng máu bị trừ khi thua trận | 20 |
| `VITE_STARTING_COINS` | Số tiền vàng khởi đầu | 0 |
| `VITE_COINS_PER_LEVEL` | Tiền vàng nhận được mỗi encounter | 20 |
| `VITE_COINS_ON_COMPLETION` | Tiền vàng nhận được khi xong level | 100 |
| `VITE_PRICE_HINT` | Giá mua vật phẩm Hint | 50 |
| `VITE_PRICE_SHIELD` | Giá mua vật phẩm Shield | 100 |
| `VITE_PRICE_REVEAL_LETTER` | Giá mua vật phẩm Reveal Letter | 150 |
| `VITE_PRICE_LUCKY_SPIN` | Chi phí mỗi lần quay | 100 |

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. **Clone dự án hoặc tải mã nguồn.**
2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```
3. **Chạy ứng dụng ở chế độ phát triển (Development):**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ `http://localhost:3000`.

4. **Xây dựng bản sản xuất (Production):**
   ```bash
   npm run build
   ```

---

## 🛠 Công nghệ sử dụng

- **Frontend**: React 19, TypeScript.
- **Styling**: Tailwind CSS 4.
- **Animation**: Motion (framer-motion).
- **Icons**: Lucide React.
- **Build Tool**: Vite.
- **Khác**: Canvas-confetti (hiệu ứng chiến thắng).

---

## ⌨️ Phím tắt (Hotkeys)

- **Enter**: 
    - Xác nhận từ đã nhập.
    - Tiếp tục hành trình (Continue Journey) khi nút này được focus.
    - Chơi lại (Try Again) ở màn hình Game Over.
- **Backspace**: Xóa ký tự và tự động quay lại ô trước đó nếu ô hiện tại trống.
