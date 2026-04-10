# Hướng Dẫn Chi Tiết Giao Diện & Lối Chơi Spellbound

Chào mừng bạn đến với **Spellbound**, nơi sức mạnh của từ vựng là vũ khí tối thượng của bạn. Dưới đây là mô tả chi tiết về giao diện và cách thức vận hành của trò chơi.

---

## 🎮 Các Màn Hình Chính

### 1. Thanh Trạng Thái (Header)
Nằm ở trên cùng của mọi màn hình, giúp bạn theo dõi tình trạng nhân vật:
- **HP (Máu)**: Thanh màu đỏ. Nếu HP về 0, bạn sẽ thất bại (Game Over).
- **Coins (Tiền vàng)**: Dùng để mua vật phẩm trong Shop hoặc quay vòng quay may mắn.
- **Score (Điểm số)**: Thể hiện thành tích của bạn.
- **Tabs Chuyển Đổi**:
    - **Map**: Quay lại bản đồ hành trình.
    - **Library**: Quản lý bộ từ vựng của bạn.
    - **Shop**: Mua vật phẩm hỗ trợ.

---

### 2. Bản Đồ Hành Trình (Adventure Map)
Đây là màn hình mặc định khi bạn bắt đầu game.
- **Tên Vùng Đất**: Hiển thị tên map hiện tại (ví dụ: *Whispering Woods*).
- **Tiến Trình (Progress Bar)**: Thanh trượt hiển thị bạn đã đi được bao xa trong level.
- **Các Nút Encounter (Nút tròn trên đường đi)**:
    - **Gate (Cánh cửa)**: Thử thách vượt rào.
    - **Enemy (Kiếm chéo)**: Chiến đấu với quái vật thường.
    - **Treasure (Hộp quà)**: Thử thách nhận phần thưởng.
    - **Nút Hiện Tại (Màu đỏ, có chữ "Current")**: Click vào đây để bắt đầu thử thách.
- **Nút Boss (Đầu lâu)**: Xuất hiện cuối mỗi bản đồ. Bạn phải hoàn thành tất cả các nút trước đó để mở khóa Boss.
- **Khu Vực Reset**:
    - **Reset Map**: Làm mới lại các thử thách của map hiện tại.
    - **Soft Reset**: Chơi lại từ đầu nhưng giữ nguyên HP và Tiền.
    - **Hard Reset**: Xóa mọi dữ liệu và chơi lại từ con số 0.

---

### 3. Giao Diện Chiến Đấu (Combat View)
Xuất hiện khi bạn click vào một thử thách trên bản đồ.
- **Khu Vực Quái Vật**: Hiển thị hình ảnh quái vật và thanh HP của nó.
- **Ô Nhập Chữ Cái**: Mỗi ô tương ứng với một chữ cái của từ cần đánh vần.
- **Nút Loa (Volume)**:
    - Loa bên cạnh từ mục tiêu: Nghe phát âm chuẩn của từ đó.
    - Loa bên cạnh ô nhập: Nghe phát âm của những gì bạn vừa gõ (giúp nhận biết lỗi sai).
- **Gợi Ý (Hints)**: Nghĩa tiếng Việt và định nghĩa tiếng Anh hiển thị bên dưới.
- **Vật Phẩm Hỗ Trợ (Bên phải)**:
    - **Hint**: Tự động điền 1 chữ cái ngẫu nhiên.
    - **Shield**: Bảo vệ bạn không bị mất máu nếu gõ sai.
    - **Reveal**: Mở khóa 1 ô chữ cái bạn chọn.
- **Nút Tấn Công (Submit)**: Sau khi gõ xong, bấm Enter hoặc nút này để kiểm tra.

---

### 4. Thư Viện Từ Vựng (Library)
Nơi bạn làm chủ kiến thức của mình.
- **Thêm Từ Mới**: Nhập từ, nghĩa, phát âm để đưa vào game.
- **Danh Sách Từ**: Hiển thị toàn bộ từ đang có. Bạn có thể **Sửa** hoặc **Xóa**.
- **Import/Export**: 
    - Copy danh sách từ của bạn để chia sẻ.
    - Dán danh sách từ (cách nhau bằng dấu phẩy) để thêm nhanh hàng loạt.
- **Reset All**: Xóa sạch từ tùy chỉnh và quay về bộ từ mặc định của game.

---

### 5. Cửa Hàng (Shop)
- **Vật Phẩm Hỗ Trợ**: Mua thêm Hint, Shield, Reveal Letter.
- **Thức Ăn (Candy, Chocolate, Cake)**: Dùng tiền để hồi phục HP ngay lập tức.

---

## 🗺 Hệ Thống Bản Đồ & Tiến Trình

Trò chơi gồm 3 vùng đất chính với độ khó tăng dần:

1.  **Whispering Woods (Rừng Thì Thầm)**:
    - Chủ đề: Rừng xanh.
    - Thử thách: Các từ vựng cơ bản (Easy/Medium).
    - **Boss**: Sau khi đánh bại Boss ở đây, bạn sẽ tiến vào map tiếp theo.

2.  **Crystal Caverns (Hang Động Pha Lê)**:
    - Chủ đề: Hang động.
    - Thử thách: Từ vựng trung bình và khó (Medium/Hard).
    - Quái vật có lượng máu cao hơn.

3.  **Dragon Peak (Đỉnh Long Vương)**:
    - Chủ đề: Lâu đài rồng.
    - Thử thách: Toàn bộ là các từ khó (Hard).
    - Đây là vùng đất cuối cùng của hành trình.

---

## 🏆 Phần Thưởng Cuối Cùng

Khi bạn đánh bại **Boss Cuối** tại **Dragon Peak**:
- Một màn hình **Victory (Chiến Thắng)** hoành tráng sẽ hiện ra với hiệu ứng pháo hoa (confetti).
- Bạn sẽ nhận được danh hiệu **"Spellbound Master"**.
- Bạn có thể chọn **"Continue Journey"** để reset lại toàn bộ hành trình, giữ nguyên sức mạnh và tiếp tục chinh phục những bộ từ vựng mới mà bạn tự thêm vào Library.

---

## 💡 Mẹo Chơi
- Hãy luôn nghe phát âm trước khi gõ để quen với âm điệu của từ.
- Nếu gặp từ quá khó, đừng ngần ngại dùng **Hint** hoặc mua **Shield** trong Shop.
- Tự thêm từ vựng bạn đang học trên lớp vào **Library** để biến việc học thành một cuộc phiêu lưu thực thụ!
