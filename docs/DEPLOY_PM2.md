# Deploy production bằng PM2 (VPS tự host)

Hướng dẫn chạy thiệp cưới trên VPS Ubuntu (20.04+) với PM2 + Nginx + SSL.

> Yêu cầu: 1 VPS (RAM ≥ 512MB là đủ — trang tĩnh, rất nhẹ), 1 domain trỏ A record
> về IP của VPS.

## 1. Cài môi trường trên VPS (làm 1 lần)

SSH vào VPS rồi chạy:

```bash
# Node qua nvm (Next.js 16 yêu cầu Node >= 20.9 — dùng 22 LTS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22

# PM2 + Nginx
npm install -g pm2
sudo apt update && sudo apt install -y nginx
```

## 2. Lấy code và build

```bash
cd ~
git clone git@github.com:lhdlam/wedding-invitation.git
cd wedding-invitation

npm ci          # cài dependencies đúng theo lockfile
npm run build   # build production (đã bao gồm lint + typecheck nếu dùng npm run check)
```

Lưu ý: thư mục `photos-source/` (ảnh gốc) không nằm trong git — không cần trên
server. Web chỉ dùng ảnh WebP đã tối ưu trong `public/images/`.

## 3. Chạy bằng PM2

File cấu hình `ecosystem.config.js` đã có sẵn ở gốc repo:

```bash
pm2 start ecosystem.config.js   # chạy app tên "wedding" ở port 3003
pm2 save                        # lưu danh sách process
pm2 startup                     # in ra 1 lệnh sudo — copy chạy để tự khởi động cùng VPS
```

Kiểm tra: `pm2 status` (phải thấy `wedding · online`), `curl -I http://localhost:3003`.

Các lệnh hay dùng:

```bash
pm2 logs wedding      # xem log
pm2 restart wedding   # khởi động lại
pm2 stop wedding      # dừng
```

## 4. Nginx reverse proxy + domain

> DNS cần cả 2 bản ghi trỏ về IP VPS: `@` (domain gốc) và `www`.

**Bước A** — tạo file `/etc/nginx/sites-available/wedding` (bản HTTP tạm để
certbot xác thực):

```nginx
server {
    listen 80;
    server_name danglam-hoaithuong.vn www.danglam-hoaithuong.vn;  # đổi thành domain của bạn

    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_set_header Host $host;
    }
}
```

Kích hoạt + xin SSL miễn phí (Let's Encrypt) cho **cả 2 tên**:

```bash
sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d danglam-hoaithuong.vn -d www.danglam-hoaithuong.vn
```

**Bước B** — sau khi certbot cấp chứng chỉ xong, thay TOÀN BỘ nội dung file
`/etc/nginx/sites-available/wedding` bằng bản chuẩn cuối: mọi truy cập
`http://` và `www.` đều bị dồn về một địa chỉ duy nhất
`https://danglam-hoaithuong.vn`:

```nginx
# 1) HTTP (mọi tên) → HTTPS domain gốc
server {
    listen 80;
    server_name danglam-hoaithuong.vn www.danglam-hoaithuong.vn;
    return 301 https://danglam-hoaithuong.vn$request_uri;
}

# 2) HTTPS www → HTTPS domain gốc
server {
    listen 443 ssl http2;
    server_name www.danglam-hoaithuong.vn;

    ssl_certificate     /etc/letsencrypt/live/danglam-hoaithuong.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/danglam-hoaithuong.vn/privkey.pem;

    return 301 https://danglam-hoaithuong.vn$request_uri;
}

# 3) Site chính
server {
    listen 443 ssl http2;
    server_name danglam-hoaithuong.vn;

    ssl_certificate     /etc/letsencrypt/live/danglam-hoaithuong.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/danglam-hoaithuong.vn/privkey.pem;

    # Ảnh/nhạc/tĩnh: cache 30 ngày ở trình duyệt
    location ~* \.(webp|jpg|png|ico|mp3|woff2|otf|ttf)$ {
        proxy_pass http://127.0.0.1:3003;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=2592000";
    }

    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Kiểm tra chuyển hướng (cả 3 phải trả `301` về `https://danglam-hoaithuong.vn/...`):

```bash
curl -sI http://danglam-hoaithuong.vn      | head -3
curl -sI http://www.danglam-hoaithuong.vn  | head -3
curl -sI https://www.danglam-hoaithuong.vn | head -3
```

Xong — mở `https://domain` là thấy thiệp; trang nhà gái ở `https://domain/T`.

## 5. Cập nhật phiên bản mới (mỗi lần sửa)

```bash
cd ~/wedding-invitation
git pull
npm ci          # chỉ cần khi package.json đổi, chạy luôn cho chắc
npm run build
pm2 restart wedding
```

## 6. Checklist sau deploy (mở bằng điện thoại thật)

- [ ] `/` và `/T` — đúng ngày, tên, nhà hàng từng bên
- [ ] Bấm sáp mở phong bì: animation + nhạc phát
- [ ] Nút "Chỉ đường tới nhà hàng" ra đúng Google Maps
- [ ] Vuốt lightbox album
- [ ] Gửi form RSVP thử → kiểm tra Google Sheet nhận được
- [ ] Gửi link qua Zalo/Messenger cho chính mình xem preview

## Sự cố thường gặp

| Triệu chứng | Nguyên nhân / cách xử lý |
|---|---|
| `pm2 status` báo `errored` | `pm2 logs wedding` xem lỗi; thường do chưa `npm run build` hoặc Node < 20.9 (`node -v`) |
| Trang trắng, 502 | Nginx không nối được port 3003 → kiểm tra `pm2 status`, rồi `sudo nginx -t` |
| Đổi code mà web không đổi | Quên `npm run build` trước khi `pm2 restart` |
| Hết SSL sau 90 ngày | Certbot tự gia hạn; kiểm tra `sudo certbot renew --dry-run` |
