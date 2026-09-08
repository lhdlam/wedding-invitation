# Kết nối form RSVP với Google Sheet

Form RSVP gửi dữ liệu tới một **Google Apps Script Web App** — script này chạy
ngay trong Google Sheet của bạn và ghi mỗi lượt xác nhận thành một dòng mới.
Không cần server, không cần API key, không tốn phí.

```
Khách điền form  →  POST  →  Apps Script Web App  →  Google Sheet
```

---

## Bước 1 — Tạo Google Sheet

1. Mở https://sheets.new để tạo một bảng tính mới.
2. Đặt tên, ví dụ `Wedding RSVP`.

Không cần tự tạo cột — script sẽ tự tạo tab `RSVP` kèm hàng tiêu đề ở lần gửi đầu tiên.

## Bước 2 — Dán script

1. Trong Sheet, chọn **Extensions → Apps Script**.
2. Xoá hết nội dung mặc định trong `Code.gs`.
3. Mở file [`scripts/google-sheet/rsvp-webhook.gs`](../scripts/google-sheet/rsvp-webhook.gs) trong dự án này, copy toàn bộ và dán vào.
4. Nhấn biểu tượng đĩa mềm để lưu (Ctrl/Cmd + S).

## Bước 3 — Deploy thành Web App

1. Góc trên bên phải, chọn **Deploy → New deployment**.
2. Bấm icon bánh răng cạnh "Select type" → chọn **Web app**.
3. Điền:
   - **Description**: `RSVP webhook` (tuỳ ý)
   - **Execute as**: **Me** (chính bạn)
   - **Who has access**: **Anyone** ← *bắt buộc*, nếu để "Anyone with Google account" thì khách chưa đăng nhập Google sẽ không gửi được.
4. Bấm **Deploy**.
5. Google sẽ xin quyền: **Authorize access** → chọn tài khoản → màn hình cảnh báo "Google hasn't verified this app" thì bấm **Advanced → Go to (tên project) (unsafe)** → **Allow**. Cảnh báo này là bình thường với script tự viết.
6. Copy **Web app URL**, dạng:

   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

> ⚠️ URL phải kết thúc bằng `/exec`, không phải `/dev`.

## Bước 4 — Cắm URL vào dự án

Tạo file `.env.local` ở thư mục gốc dự án (file này đã nằm trong `.gitignore`):

```bash
NEXT_PUBLIC_RSVP_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

Khởi động lại dev server để Next.js đọc biến mới:

```bash
npm run dev
```

## Bước 5 — Deploy lên Vercel

Biến trong `.env.local` **không** tự lên Vercel. Thêm thủ công:

1. Vercel Dashboard → chọn project → **Settings → Environment Variables**.
2. Thêm:
   - Name: `NEXT_PUBLIC_RSVP_WEBHOOK_URL`
   - Value: URL `/exec` ở Bước 3
   - Environments: tick cả **Production**, **Preview**, **Development**
3. **Redeploy** lại project — biến chỉ có hiệu lực ở bản build mới.

---

## Kiểm tra

Điền thử form trên site rồi mở Sheet — phải thấy một dòng mới trong tab `RSVP`:

| Thời gian | Tên | Tham dự | Số người | Khách của | Lời nhắn |
|---|---|---|---|---|---|
| 08/09/2026 14:32:10 | Nguyễn Văn A | Có | 2 người | Khách mời cô dâu | Chúc mừng hai bạn! |

## Nếu chưa cấu hình URL

Khi `NEXT_PUBLIC_RSVP_WEBHOOK_URL` chưa được đặt, form vẫn hoạt động bình thường
và hiện lời cảm ơn, chỉ là không ghi đi đâu cả. Tiện cho lúc phát triển giao diện.

---

## Xử lý sự cố

**Sheet không có dòng nào mới**
- Kiểm tra "Who has access" đúng là **Anyone** (Bước 3.3). Đây là lỗi phổ biến nhất.
- Kiểm tra URL kết thúc bằng `/exec`.
- Mở DevTools → tab Network, xem request tới `script.google.com` có được gửi không.
- Trong Apps Script, mở **Executions** (biểu tượng đồng hồ bên trái) để xem log lỗi từng lần chạy.

**Đã sửa script nhưng không thấy thay đổi**
Apps Script không tự áp dụng bản mới. Vào **Deploy → Manage deployments → ✏️ (Edit)
→ Version: New version → Deploy**. URL giữ nguyên nên không phải sửa lại env.

**Form báo "Gửi không thành công"**
Thường do mất mạng hoặc URL sai. Lưu ý: do dùng `mode: "no-cors"`, trình duyệt
không đọc được nội dung phản hồi, nên form chỉ biết request đã gửi đi được hay
không — nó không phát hiện được lỗi phía Apps Script. Khi nghi ngờ, kiểm tra tab
**Executions** trong Apps Script.

---

## Lưu ý bảo mật

`NEXT_PUBLIC_` nghĩa là URL này lộ ra trong mã nguồn phía trình duyệt — không
tránh được, vì trình duyệt phải biết địa chỉ để gửi tới. Rủi ro thấp: script chỉ
có `doPost` nên URL này **chỉ ghi được, không đọc được** dữ liệu trong Sheet.
Trường hợp xấu nhất là ai đó gửi rác vào bảng; khi đó chỉ cần
**Deploy → Manage deployments → Archive** để huỷ URL rồi deploy lại cái mới.
