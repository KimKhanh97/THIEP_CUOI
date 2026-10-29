# THIEP_CUOI
## Lưu lời chúc vào Google Sheet

1. Đăng nhập Google bằng **trankimkhanh0909@gmail.com**, tạo Google Sheet mới (vd: "Lời chúc đám cưới").
2. Trong Sheet: **Tiện ích mở rộng → Apps Script**. Xoá code mẫu, dán toàn bộ nội dung file `google-apps-script/Code.gs`, bấm Lưu.
3. **Triển khai → Tùy chọn triển khai mới** → chọn loại **Ứng dụng web**:
   - Thực thi dưới dạng: **Tôi** (trankimkhanh0909@gmail.com)
   - Người có quyền truy cập: **Bất kỳ ai**
   Bấm Triển khai, cấp quyền khi Google hỏi (chọn Nâng cao → Đi tới… nếu có cảnh báo).
4. Sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`) và dán vào `wishesApi` trong `assets/data.js`.

Lời chúc sẽ được ghi vào tab **LoiChuc** (tự tạo ở lần gửi đầu tiên). Muốn ẩn một lời chúc, xoá dòng đó trong Sheet.
Nếu sửa `Code.gs` sau này: **Triển khai → Quản lý bản triển khai → Chỉnh sửa → Phiên bản mới** để giữ nguyên URL.
