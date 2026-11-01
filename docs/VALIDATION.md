# Kết quả kiểm tra source Phase 1

Ngày kiểm tra ban đầu: 31/10/2026 (trước khi đổi sang SDK 52).

| Kiểm tra | Kết quả |
| --- | --- |
| Cài dependencies bằng npm | Thành công; kèm package-lock.json |
| TypeScript strict — `npm run typecheck` | Qua |
| Logic dữ liệu — `npm test` | 9/9 qua |
| JavaScript/Hermes bundle Android — `npm run export:android` | Qua |
| Web bundle — `npm run export:web` | Qua |
| Expo Metro development server ở chế độ localhost/CI | Khởi động được |
| UI smoke test trên Chromium, dùng web export | Qua các thao tác bên dưới |
| Chạy app native trên Android thật/emulator | Chưa thực hiện; không có thiết bị/emulator trong môi trường tạo source |

Các luồng UI đã kiểm tra: tải 4 tài khoản mẫu; tìm tiếng Việt không dấu; không có kết quả; mật khẩu mặc định ẩn, hiện/ẩn/copy; sửa thông tin; hủy/bỏ thay đổi; validation trường bắt buộc và website; thêm mới; giữ nguyên dấu cách/Unicode trong mật khẩu; hủy/xác nhận xóa; xóa tới kho trống; reload trở về dữ liệu mẫu. Không phát hiện JavaScript runtime error trong các luồng này.

Đã kiểm tra không tràn ngang ở viewport 320, 393 và 768 px, đồng thời xem hình render danh sách, chi tiết và form.

## Giới hạn

- Web smoke test không chứng minh hành vi native của bàn phím, Android Back, safe area, clipboard hoặc font hệ thống. Làm tiếp checklist `VERIFY_PHASE_1.md` trên điện thoại.
- Bundle Android không phải APK và không thay thế native runtime testing.
- Kiểm tra dependency compatibility online bị timeout mạng; kiểm tra offline bằng metadata đi kèm Expo báo dependencies up to date. Không coi đây là một lần Expo Doctor online thành công.
- Development server được thử bằng localhost/CI do môi trường hạn chế quảng bá mạng LAN. Hướng dẫn README dùng LAN và Expo Go để bạn kiểm tra trên máy của mình.
- Không có tuyên bố đã kiểm tra bảo mật: PIN, mã hóa, backup và lưu bền vững chưa được triển khai ở phase 1.

## Kiểm tra tương thích Node 18 (01/11/2026)

Môi trường: Windows PowerShell, Node.js 18.20.8, npm 10.8.2. Project dùng Expo SDK 52.0.49, React Native 0.76.9 và React 18.3.1. Phiên bản Expo modules lấy từ danh sách `bundledNativeModules.json` của chính gói Expo 52.0.49.

| Kiểm tra | Kết quả |
| --- | --- |
| `npm ci` trong thư mục sạch, dùng chính `package.json` và `package-lock.json` | Qua, không có cảnh báo `EBADENGINE`; một số dependency cũ vẫn có cảnh báo deprecated |
| Metadata `engines.node` của toàn bộ gói trong lockfile | Không có gói nào khai báo không tương thích với Node 18.20.8 |
| `npx expo install --check` | Dependencies are up to date |
| `npm run check` | TypeScript qua; 9/9 bài kiểm tra qua |
| `npm run export:android` | Qua, tạo Hermes bundle |
| `npm run export:web` | Qua |
| `npm start` | Metro khởi động và trả lời trên localhost:8081; không còn lỗi `configs.toReversed` |

Chưa chạy UI native trên điện thoại Android. Bundle và dev server không chứng minh hành vi native; dùng [VERIFY_PHASE_1.md](VERIFY_PHASE_1.md) để kiểm tra trên Expo Go SDK 52.

Trong thư mục làm việc có sẵn `node_modules`, lần chạy lại `npm ci` gặp lỗi Windows `EBUSY` khi npm xóa thư mục dependency. Đã đổi tên thư mục cũ thành `node_modules.stale-20261101205045` trong project, sau đó `npm ci` chạy thành công ngay tại project. `npm run check` và `npm run export:android` đều qua sau khi cài sạch. Thư mục dự phòng chưa được xóa vì lệnh xóa đệ quy bị hệ thống xét duyệt tự động chặn.
