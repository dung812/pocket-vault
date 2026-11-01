# Pocket Vault — Phase 1

App quản lý tài khoản cá nhân, ưu tiên Android, viết bằng **React Native + Expo + TypeScript**. Giao diện tiếng Việt.

**Đây là bản kiểm tra UI. Chỉ nhập dữ liệu giả. Chưa có PIN, mã hóa hoặc lưu bền vững.**

## Phạm vi hiện tại

- Danh sách có 4 tài khoản mẫu và tìm theo tên, website, username; hỗ trợ tìm tiếng Việt không dấu.
- Xem chi tiết; hiện/ẩn và sao chép mật khẩu; sao chép username.
- Thêm, sửa, xóa có xác nhận; nhiều tài khoản trên cùng website.
- Kiểm tra trường bắt buộc, cảnh báo rời form khi chưa lưu, xử lý kho trống.
- Dữ liệu **chỉ nằm trong RAM**. Tải lại hoặc khởi động lại tiến trình app sẽ trở về dữ liệu mẫu. Fast Refresh có thể giữ trạng thái, nên dùng Reload để thử đặt lại.
- Không có backend, tài khoản đăng nhập, cloud hoặc DB connection string.

Hướng đã chốt cho các phase sau: **chỉ lưu trên thiết bị cài app**, mã hóa database, mở bằng PIN 6 số và sao lưu mã hóa ra file. Chưa cần Supabase hay dịch vụ cloud.

## 1. Chuẩn bị trên máy tính

1. Dùng **Node.js 18.20.8** và **npm 10.8.2** (đã kiểm tra với bản này). Không cần đổi Node của hệ thống.
2. Giải nén file ZIP. Mở thư mục `pocket-vault-phase1` bằng VS Code.
3. Mở Terminal ngay trong thư mục có `package.json`. Windows có thể dùng PowerShell hoặc Command Prompt; không cần WSL.
4. Kiểm tra:

```sh
node --version
npm --version
```

## 2. Cài thư viện và chạy

Nếu chưa ở trong thư mục project:

```sh
cd pocket-vault-phase1
```

Sau đó:

```sh
npm ci
npm run check
npm start
```

- `npm ci` cài đúng các phiên bản trong `package-lock.json`. Không cần tự tạo lại project bằng `create-expo-app`.
- Terminal hiển thị QR code và địa chỉ development server. Giữ terminal đang chạy.
- Máy tính và điện thoại cùng mạng Wi-Fi; cho phép Node.js qua firewall trên mạng riêng nếu được hỏi.
- **Không cần Android Studio** nếu thử trên điện thoại thật bằng Expo Go.

## 3. Mở trên điện thoại Android

1. Cài **[Expo Go cho SDK 52 trên Android](https://expo.dev/go?device=true&platform=android&sdkVersion=52)**; bản trên Play Store có thể không khớp SDK của project.
2. Mở Expo Go, chọn **Scan QR code** và quét QR trong terminal.
3. Đợi bundle tải xong. App sẽ hiện **Pocket Vault → Kho của tôi** với 4 tài khoản mẫu.
4. Nếu công cụ Expo yêu cầu đăng nhập tài khoản phát triển, làm theo hướng dẫn của Expo Go/CLI. Đây là tài khoản công cụ phát triển, không phải chức năng đăng nhập của Pocket Vault.
5. Sửa source trên máy tính; lưu file để Expo cập nhật giao diện.

Nếu cần tải lại hoàn toàn: mở menu developer của Expo Go rồi chọn **Reload** (thường bằng cách lắc điện thoại), hoặc nhấn `r` trong terminal.

## 4. Nếu không kết nối được

| Hiện tượng | Xử lý |
| --- | --- |
| Quét QR nhưng tải mãi | Kiểm tra cùng Wi-Fi, tránh guest Wi-Fi có chặn thiết bị, cho phép Node.js qua firewall mạng riêng; thử tắt VPN nếu đang bật. |
| Vẫn không kết nối qua LAN | Dừng server bằng `Ctrl+C`, chạy `npm run start:tunnel`. Chấp nhận cài `@expo/ngrok` nếu CLI hỏi. Tunnel cần internet; chỉ dùng dữ liệu giả. |
| Expo Go báo SDK không khớp | Cài [Expo Go cho SDK 52 trên Android](https://expo.dev/go?device=true&platform=android&sdkVersion=52); không tự nâng phiên bản `react-native` riêng lẻ. |
| PowerShell chặn chạy `npm.ps1` | Dùng Command Prompt, hoặc thay `npm` bằng `npm.cmd`, `npx` bằng `npx.cmd`. Không cần đổi chính sách bảo mật toàn máy. |
| Cache cũ hoặc bundle lỗi | Dừng server, chạy `npm run start:clear`. |
| `npm ci` báo `EBUSY` khi xóa `node_modules` | Dừng Expo/Metro và các terminal đang chạy trong project. Nếu vẫn lỗi, đổi tên riêng thư mục `node_modules` của project thành `node_modules.stale-...`, rồi chạy lại `npm ci`. Chỉ xóa thư mục dự phòng khi đã xác nhận bản cài mới chạy được. |
| Chạy `npm run android` nhưng báo thiếu emulator/ADB | Dùng `npm start` và quét QR trên điện thoại; script `android` dành cho máy đã cấu hình emulator/ADB. |
| Bấm copy trên bản web bị chặn | Clipboard phụ thuộc quyền trình duyệt; ưu tiên kiểm tra trên Android Expo Go. |

Có thể xem trước trên trình duyệt bằng `npm run web`. Bản web để kiểm tra nhanh giao diện, không thay thế kiểm tra bàn phím, clipboard và nút Back trên Android.

## 5. Kiểm tra phase 1

Làm checklist [docs/VERIFY_PHASE_1.md](docs/VERIFY_PHASE_1.md), rồi ghi lại màn hình hoặc bước gặp lỗi để sửa trước phase tiếp theo.

```sh
npm run check
npm run export:android
```

`export:android` kiểm tra tạo JavaScript bundle Android; **không tạo file APK**. Bản phase 1 chạy qua Expo Go. Tạo APK độc lập sẽ làm ở phase hoàn thiện.

Kết quả kiểm tra trong môi trường tạo source: xem [docs/VALIDATION.md](docs/VALIDATION.md).

## 6. Cấu trúc source

```text
App.tsx                         Điều hướng đơn giản, Android Back, thông báo
src/screens/                    Danh sách, chi tiết, form thêm/sửa
src/components/ui.tsx           Button, icon, avatar, dialog xác nhận
src/types/vault.ts              Kiểu dữ liệu và hợp đồng repository
src/data/seed.ts                Dữ liệu giả
src/data/memoryVaultRepository.ts  Repository trong RAM
src/state/VaultProvider.tsx     Kết nối dữ liệu với UI
src/domain/vault.ts             Tìm kiếm, validation và xử lý website
src/theme.ts                    Màu giao diện
tests/vault.test.ts             Kiểm tra logic dữ liệu
docs/                           Checklist, roadmap, hướng dẫn Codex CLI
```

Không có file `.env` cần cấu hình. Không thêm mật khẩu thật vào source, test, log hoặc Git.

## 7. Khởi tạo Git và mở Codex CLI

ZIP là source sạch, chưa có thư mục `.git` hay `node_modules`. Có thể tạo repo local:

```sh
git init
git add .
git commit -m "Initialize Pocket Vault phase 1 UI prototype"
```

Mở Codex CLI trong thư mục project (sau khi đã cài và cấu hình CLI):

```sh
codex
```

Repo có `AGENTS.md` để giữ đúng phạm vi. Dùng hướng dẫn [docs/CODEX_HANDOFF.md](docs/CODEX_HANDOFF.md). Đừng yêu cầu CLI làm toàn bộ roadmap trong một lần.

## Tài liệu chính thức

- Tạo project và ghi chú SDK/Expo Go: <https://docs.expo.dev/get-started/create-a-project/>
- Chạy trên thiết bị: <https://docs.expo.dev/get-started/start-developing/>
- Expo Go cho Android: <https://expo.dev/go>
- Lưu trữ mã hóa cho phase sau: <https://docs.expo.dev/versions/latest/sdk/sqlite/>

Mốc tương thích Node 18: 01/11/2026. Phiên bản cài thực tế được cố định trong `package-lock.json`.
