# Roadmap đã điều chỉnh: Android, local-only

Chỉ triển khai một phase mỗi lượt. Người dùng mở UI kiểm tra rồi mới chuyển phase tiếp theo.

| Phase | Mục tiêu | Điều kiện hoàn thành |
| --- | --- | --- |
| 1 — Hiện tại | UI và CRUD với dữ liệu giả trong RAM | Hoàn thành checklist Android, sửa các lỗi UI đã phát hiện |
| 2 | Tạo/xác nhận PIN 6 số, mở khóa/đổi PIN, khóa thủ công, khóa khi chuyển nền; giới hạn nhập sai có lưu trạng thái | Không thể vượt qua màn hình PIN bằng Back; kiểm tra khởi động lại và thời gian chờ |
| 3 | Database local mã hóa bằng SQLCipher; khóa ngẫu nhiên bảo vệ qua Android Keystore/SecureStore | Dữ liệu giữ qua restart, file database không đọc được khi thiếu khóa, không lộ dữ liệu qua log |
| 4 | Backup/restore file mã hóa, mật khẩu sao lưu riêng, quy trình đổi hoặc mất máy | Khôi phục được bản backup trên cài đặt sạch; xử lý mật khẩu sai/file lỗi mà không làm mất dữ liệu đang có |
| 5 | Bảo vệ màn hình đa nhiệm/clipboard, hoàn thiện lỗi và accessibility, build APK riêng | Kiểm tra thực tế trên Android và chạy toàn bộ luồng trước khi dùng dữ liệu thật |

Không cần cloud, database server, DB connection string, email/password đăng nhập hoặc chức năng nhiều người dùng.

## Nguyên tắc cho các phase sau

- PIN 6 số là lớp kiểm soát truy cập của app, không tự bảo vệ trước mọi hình thức trích xuất hoặc sửa app.
- Không dùng trực tiếp PIN làm khóa SQLCipher. Thiết kế khóa ngẫu nhiên, bảo vệ khóa và giới hạn tấn công theo threat model thiết bị trước khi triển khai.
- Không lưu PIN dạng rõ, không ghi PIN/password/khóa vào log; không viết thuật toán mã hóa riêng.
- Chỉ hiện một màn hình PIN mà không bảo vệ khóa/dữ liệu bên dưới không phải bảo mật đầy đủ.
- SecureStore dựa trên Keystore không có nghĩa mọi thiết bị đều cung cấp phần cứng bảo mật như nhau.
- Không giả định khóa local sẽ tự theo Android Auto Backup sang máy khác; backup portable cần thiết kế riêng.
- Quên PIN không có chức năng bỏ qua mở kho. Khôi phục dựa trên bản sao lưu mã hóa và mật khẩu sao lưu riêng.
- SQLCipher cần development build; không được hạ xuống SQLite dạng rõ để giữ tương thích Expo Go.
- Chỉ dùng thông tin giả cho tới khi kiểm tra mã hóa và backup/restore hoàn tất.

Tham khảo: <https://docs.expo.dev/versions/latest/sdk/securestore/> và <https://docs.expo.dev/versions/latest/sdk/sqlite/>.
